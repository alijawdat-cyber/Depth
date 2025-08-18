import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

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

    // جلب كل الموظفين
    const employeesSnapshot = await adminDb.collection('employees')
      .orderBy('createdAt', 'desc')
      .get();

    const employees = employeesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        name: data.name,
        role: data.role,
        department: data.department,
        salary: data.salary,
        status: data.status,
        startDate: data.startDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        joinedAt: data.joinedAt?.toDate?.()?.toISOString()
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

    // إحصائيات
    const stats = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      pendingInvites: pendingInvites.length,
      byRole: {
        photographer: employees.filter(emp => emp.role === 'photographer').length,
        admin_staff: employees.filter(emp => emp.role === 'admin_staff').length,
        manager: employees.filter(emp => emp.role === 'manager').length
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

    // تحديث في employees collection
    await adminDb.collection('employees').doc(employeeId).update(validUpdates);

    // تحديث في users collection أيضاً
    const userUpdates = { ...validUpdates };
    if (validUpdates.role) {
      userUpdates.employeeRole = validUpdates.role;
      userUpdates.role = 'employee'; // يبقى employee في users
    }

    await adminDb.collection('users').doc(employeeId).update(userUpdates);

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
