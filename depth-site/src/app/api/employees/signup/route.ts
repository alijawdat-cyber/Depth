import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';

// POST /api/employees/signup
// إتمام تسجيل موظف عبر دعوة
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    // التحقق من البيانات
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'رمز الدعوة مطلوب', 
        requestId 
      }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ 
        success: false, 
        error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', 
        requestId 
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'كلمات المرور غير متطابقة', 
        requestId 
      }, { status: 400 });
    }

    // البحث عن الدعوة
    const inviteSnapshot = await adminDb.collection('employee_invites')
      .where('inviteToken', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (inviteSnapshot.empty) {
      return NextResponse.json({
        success: false,
        error: 'دعوة غير صالحة أو منتهية الصلاحية',
        requestId
      }, { status: 404 });
    }

    const inviteDoc = inviteSnapshot.docs[0];
    const inviteData = inviteDoc.data();

    // التحقق من انتهاء الصلاحية
    if (new Date() > inviteData.expiresAt.toDate()) {
      return NextResponse.json({
        success: false,
        error: 'انتهت صلاحية الدعوة',
        requestId
      }, { status: 410 });
    }

    // التحقق من عدم وجود مستخدم موظف موحد بنفس البريد
    const existingUnified = await adminDb.collection('users')
      .where('email', '==', inviteData.email)
      .where('role', '==', 'employee')
      .limit(1)
      .get();
    if (!existingUnified.empty) {
      return NextResponse.json({ success: false, error: 'الموظف موجود مسبقاً', requestId }, { status: 409 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    // إنشاء مستخدم موحد جديد بدور employee
    const isoNow = now.toISOString();
    const employeeUserRef = await adminDb.collection('users').add({
      email: inviteData.email,
      name: inviteData.name,
      role: 'employee',
      status: 'active',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: isoNow,
      updatedAt: isoNow,
      lastLoginAt: null,
      source: 'employee-invite',
      employeeProfile: {
        position: inviteData.position,
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

    // حفظ كلمة المرور في user_credentials
    await adminDb.collection('user_credentials').doc(employeeUserRef.id).set({
      userId: employeeUserRef.id,
      email: inviteData.email,
      hashedPassword,
      createdAt: isoNow,
      lastPasswordChange: isoNow
    });

    // تحديث الدعوة كمستخدمة
    await inviteDoc.ref.update({
      used: true,
      usedAt: isoNow,
      employeeId: employeeUserRef.id,
      completedSignup: true
    });

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'employee_signup_completed',
  entityType: 'user',
  entityId: employeeUserRef.id,
      userId: inviteData.email,
  timestamp: isoNow,
      details: {
        name: inviteData.name,
        position: inviteData.position,
        department: inviteData.department,
        inviteId: inviteDoc.id,
        invitedBy: inviteData.invitedBy
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إتمام تسجيل الموظف بنجاح',
  employeeId: employeeUserRef.id,
      requestId
    }, { status: 201 });

  } catch (error) {
    console.error('[employee.signup] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
