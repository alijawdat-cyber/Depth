import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import type { UnifiedUser, EmployeeProfile } from '@/types/unified-user';

// نوع مساعد مرن لتجنب أخطاء الخصائص الاختيارية
interface FlexibleEmployeeProfile extends Partial<EmployeeProfile> {
  [key: string]: unknown;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // التحقق من الصلاحيات
    const isAdmin = process.env.ADMIN_EMAILS?.split(',').includes(session.user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: 'صلاحيات إدارية مطلوبة' }, { status: 403 });
    }

    // جلب كل الموظفين من النظام الموحد (users حيث role == employee)
    const employeesSnapshot = await adminDb.collection('users')
      .where('role', '==', 'employee')
      .orderBy('createdAt', 'desc')
      .get();

    const employees = employeesSnapshot.docs.map(doc => {
      const data = doc.data() as UnifiedUser & { employeeProfile?: FlexibleEmployeeProfile };
      const profile: FlexibleEmployeeProfile = data.employeeProfile || {};
      return {
        id: doc.id,
        email: data.email,
        name: data.name,
        role: 'employee',
        department: profile.department,
        salary: profile.salary,
        status: data.status,
        startDate: profile.startDate,
        createdAt: data.createdAt,
        joinedAt: profile.joinedAt
      };
    });

    // جلب الدعوات المعلقة
    const invitesSnapshot = await adminDb.collection('employee_invites')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const pendingInvites = invitesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        role: data.role,
        department: data.department,
        salary: data.salary,
        status: data.status,
        invitedBy: data.invitedBy,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        expiresAt: data.expiresAt?.toDate?.()?.toISOString()
      };
    });

    // إحصائيات (مبسطة حسب النموذج الموحد)
    const stats = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      pendingInvites: pendingInvites.length,
      // احتفاظ بمفاتيح سابقة عبر تحليل department أو role الداخلي إن وُجد
      byRole: {
        photographer: employees.filter(emp => emp.department === 'photographer' || emp.role === 'photographer').length,
        admin_staff: employees.filter(emp => emp.department === 'admin_staff' || emp.role === 'admin_staff').length,
        manager: employees.filter(emp => emp.department === 'manager' || emp.role === 'manager').length
      }
    };

    return NextResponse.json({
      success: true,
      employees,
      pendingInvites,
      stats
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات الموظفين:', error);
    return NextResponse.json({ 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}

// تحديث بيانات موظف
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const isAdmin = process.env.ADMIN_EMAILS?.split(',').includes(session.user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: 'صلاحيات إدارية مطلوبة' }, { status: 403 });
    }

    const { employeeId, updates } = await request.json();

    if (!employeeId || !updates) {
      return NextResponse.json({ 
        error: 'معرف الموظف والتحديثات مطلوبة' 
      }, { status: 400 });
    }

    // التحديثات المسموحة
    const allowedUpdates = ['name', 'role', 'department', 'salary', 'status'];
    const validUpdates: Record<string, string | number | Date> = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ 
        error: 'لا توجد تحديثات صحيحة' 
      }, { status: 400 });
    }

    validUpdates.updatedAt = new Date();

    // تحديث في users collection فقط (النظام الموحد)
    const userRef = adminDb.collection('users').doc(employeeId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: 'المستخدم غير موجود بالنظام الموحد' }, { status: 404 });
    }

    // إذا كانت هناك بيانات تخص ملف الموظف ننقلها إلى employeeProfile
  const userData = userSnap.data() as UnifiedUser & { employeeProfile?: FlexibleEmployeeProfile };
  const existingProfile: FlexibleEmployeeProfile = userData.employeeProfile || {};
  const profileUpdates: FlexibleEmployeeProfile = { ...existingProfile };

  if (typeof validUpdates.department === 'string') profileUpdates.department = validUpdates.department;
  if (typeof validUpdates.salary === 'number') profileUpdates.salary = validUpdates.salary;
  if (typeof validUpdates.role === 'string' && validUpdates.role !== 'employee') profileUpdates.position = String(validUpdates.role);
  if (!profileUpdates.startDate) profileUpdates.startDate = existingProfile.startDate || new Date().toISOString();

  const rootUpdates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (typeof validUpdates.name === 'string') rootUpdates.name = validUpdates.name;
  if (typeof validUpdates.status === 'string') rootUpdates.status = validUpdates.status;

    await userRef.update({
      ...rootUpdates,
      employeeProfile: profileUpdates
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الموظف بنجاح'
    });

  } catch (error) {
    console.error('خطأ في تحديث بيانات الموظف:', error);
    return NextResponse.json({ 
      error: 'خطأ في الخادم' 
    }, { status: 500 });
  }
}
