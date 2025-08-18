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
      .where('token', '==', token)
      .where('email', '==', email)
      .where('status', '==', 'pending')
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
    const expiresAt = inviteData.expiresAt?.toDate?.() || new Date(inviteData.expiresAt);
    
    if (now > expiresAt) {
      // تحديث حالة الدعوة لمنتهية
      await adminDb.collection('employee_invites').doc(inviteDoc.id).update({
        status: 'expired'
      });
      
      return NextResponse.json({ 
        error: 'انتهت صلاحية الدعوة' 
      }, { status: 410 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء بيانات الموظف
    const employeeData = {
      email,
      name,
      password: hashedPassword,
      role: inviteData.role,
      department: inviteData.department,
      salary: inviteData.salary,
      startDate: inviteData.startDate,
      invitedBy: inviteData.invitedBy,
      status: 'active',
      createdAt: new Date(),
      joinedAt: new Date()
    };

    // حفظ الموظف في employees collection
    const employeeRef = await adminDb.collection('employees').add(employeeData);

    // ✅ حفظ في users collection للتوحيد
    try {
      await adminDb.collection('users').add({
        name: inviteData.name,
        email: inviteData.email,
        role: 'employee',
        status: 'active',
        profileId: employeeRef.id, // ربط مع الملف الشخصي
        source: 'employee-invite',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true, // الموظفون معتمدون من الإدارة
        twoFactorEnabled: false,
        // نسخ بعض البيانات المهمة
        position: inviteData.position || inviteData.role,
        department: inviteData.department,
        permissions: inviteData.permissions || [],
      });
    } catch (usersError) {
      console.warn('[employee.accept-invite] Failed to add employee to users collection:', usersError);
      // لا نفشل التسجيل إذا فشل التوحيد
    }

    // تحديث حالة الدعوة لمقبولة
    await adminDb.collection('employee_invites').doc(inviteDoc.id).update({
      status: 'accepted',
      acceptedAt: new Date(),
      employeeId: employeeRef.id
    });

    return NextResponse.json({
      success: true,
      message: 'تم إكمال التسجيل بنجاح',
      employeeId: employeeRef.id,
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
