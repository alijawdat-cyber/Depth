import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, email, password, name } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!token || !email || !password || !name) {
      return NextResponse.json({ 
        error: 'بيانات ناقصة: الرمز، الإيميل، كلمة المرور، والاسم مطلوبة' 
      }, { status: 400 });
    }

    // البحث عن الدعوة
    const inviteSnapshot = await adminDb.collection('employee_invites')
      .where('inviteToken', '==', token)
      .where('email', '==', email.toLowerCase())
      .where('used', '==', false)
      .limit(1)
      .get();

    if (inviteSnapshot.empty) {
      return NextResponse.json({ 
        error: 'دعوة غير صحيحة أو منتهية الصلاحية' 
      }, { status: 404 });
    }

    const inviteDoc = inviteSnapshot.docs[0];
    const inviteData = inviteDoc.data();

    // التحقق من انتهاء صلاحية الدعوة
    const now = new Date();
    const expiresAt = typeof inviteData.expiresAt === 'string' ? new Date(inviteData.expiresAt) : inviteData.expiresAt?.toDate?.();
    if (!expiresAt || now > expiresAt) {
      await inviteDoc.ref.update({ used: true, usedAt: now.toISOString(), expired: true });
      return NextResponse.json({ error: 'انتهت صلاحية الدعوة' }, { status: 410 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    const isoNow = now.toISOString();
    const userRef = await adminDb.collection('users').add({
      email: email.toLowerCase(),
      name,
      role: 'employee',
      status: 'active',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: isoNow,
      updatedAt: isoNow,
      lastLoginAt: null,
      source: 'employee-invite',
      employeeProfile: {
        position: inviteData.position || inviteData.role,
        department: inviteData.department,
        salary: inviteData.salary,
        permissions: inviteData.permissions || [],
        startDate: isoNow,
        capacity: 40,
        inviteId: inviteDoc.id,
        invitedBy: inviteData.invitedBy,
        invitedAt: inviteData.invitedAt?.toDate?.()?.toISOString() || isoNow,
        joinedAt: isoNow
      }
    });

    await adminDb.collection('user_credentials').doc(userRef.id).set({
      userId: userRef.id,
      email: email.toLowerCase(),
      hashedPassword,
      createdAt: isoNow,
      lastPasswordChange: isoNow
    });

    // تحديث حالة الدعوة لمقبولة
    await inviteDoc.ref.update({
      used: true,
      usedAt: isoNow,
      employeeId: userRef.id,
      completedSignup: true
    });

    return NextResponse.json({
      success: true,
      message: 'تم إكمال التسجيل بنجاح',
  employeeId: userRef.id,
      redirect: '/employees/dashboard'
    });

  } catch (error) {
    console.error('خطأ في قبول دعوة الموظف:', error);
    return NextResponse.json({ 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}

// التحقق من صحة رمز الدعوة
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ 
        error: 'رمز الدعوة مطلوب' 
      }, { status: 400 });
    }

    // البحث عن الدعوة
    const inviteSnapshot = await adminDb.collection('employee_invites')
      .where('token', '==', token)
      .where('status', '==', 'pending')
      .get();

    if (inviteSnapshot.empty) {
      return NextResponse.json({ 
        error: 'دعوة غير صحيحة' 
      }, { status: 404 });
    }

    const inviteData = inviteSnapshot.docs[0].data();

    // التحقق من انتهاء الصلاحية
    const now = new Date();
    const expiresAt = inviteData.expiresAt?.toDate?.() || new Date(inviteData.expiresAt);
    
    if (now > expiresAt) {
      return NextResponse.json({ 
        error: 'انتهت صلاحية الدعوة' 
      }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      invite: {
        email: inviteData.email,
        role: inviteData.role,
        department: inviteData.department,
        invitedBy: inviteData.invitedBy,
        expiresAt: expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('خطأ في التحقق من الدعوة:', error);
    return NextResponse.json({ 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}
