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

    // التحقق من عدم وجود موظف بهذا البريد
    const existingEmployee = await adminDb.collection('employees')
      .where('email', '==', inviteData.email)
      .limit(1)
      .get();

    if (!existingEmployee.empty) {
      return NextResponse.json({
        success: false,
        error: 'موظف بهذا البريد موجود مسبقاً',
        requestId
      }, { status: 409 });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    // إنشاء بيانات الموظف
    const employeeData = {
      // من الدعوة
      email: inviteData.email,
      name: inviteData.name,
      position: inviteData.position,
      department: inviteData.department,
      salary: inviteData.salary,
      permissions: inviteData.permissions || [],
      
      // من التسجيل
      password: hashedPassword,
      
      // حالة الموظف
      status: 'active',
      role: 'employee',
      
      // بيانات النظام
      createdAt: now,
      updatedAt: now,
      joinedAt: now,
      lastLoginAt: null,
      
      // مراجع الدعوة
      inviteId: inviteDoc.id,
      invitedBy: inviteData.invitedBy,
      invitedAt: inviteData.invitedAt,
      
      // audit
      createdBy: 'invite-signup',
      source: 'employee-invite'
    };

    // حفظ الموظف في قاعدة البيانات
    const employeeDocRef = await adminDb.collection('employees').add(employeeData);

    // ✅ حفظ في users collection للتوحيد
    try {
      await adminDb.collection('users').add({
        name: inviteData.name,
        email: inviteData.email,
        role: 'employee',
        status: 'active',
        profileId: employeeDocRef.id, // ربط مع الملف الشخصي
        source: 'employee-invite',
        createdAt: now,
        updatedAt: now,
        emailVerified: true, // الموظفون معتمدون من الإدارة
        twoFactorEnabled: false,
        // نسخ بعض البيانات المهمة
        position: inviteData.position,
        department: inviteData.department,
        permissions: inviteData.permissions || [],
      });
    } catch (usersError) {
      console.warn('[employee.signup] Failed to add employee to users collection:', usersError);
      // لا نفشل التسجيل إذا فشل التوحيد
    }

    // تحديث الدعوة كمستخدمة
    await inviteDoc.ref.update({
      used: true,
      usedAt: now,
      employeeId: employeeDocRef.id,
      completedSignup: true
    });

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'employee_signup_completed',
      entityType: 'employee',
      entityId: employeeDocRef.id,
      userId: inviteData.email,
      timestamp: now,
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
      employeeId: employeeDocRef.id,
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
