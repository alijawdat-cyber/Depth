// Client Profile API - Replace /api/portal/clients
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/client - Client profile and status
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - يتطلب تسجيل الدخول',
        requestId
      }, { status: 401 });
    }

    if (session.user.role !== 'client') {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - مخصص للعملاء فقط',
        requestId
      }, { status: 403 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن العميل
    const userQuery = await adminDb.collection('users')
      .where('email', '==', email)
      .where('role', '==', 'client')
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'العميل غير موجود', 
        requestId 
      }, { status: 404 });
    }
    
    const clientDoc = userQuery.docs[0];
    const clientData = clientDoc.data();

    // جلب إحصائيات المشاريع
    const projectsSnapshot = await adminDb.collection('projects')
      .where('clientId', '==', clientDoc.id)
      .get();

    const projects = projectsSnapshot.docs.map(doc => doc.data());
    
    const projectStats = {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      pending: projects.filter(p => p.status === 'pending').length,
      paused: projects.filter(p => p.status === 'paused').length
    };

    // جلب إحصائيات الموافقات المعلقة
    const approvalsSnapshot = await adminDb.collection('approvals')
      .where('clientId', '==', clientDoc.id)
      .where('status', '==', 'pending')
      .get();

    const pendingApprovals = approvalsSnapshot.size;

    // إعداد بيانات العميل للعرض (بدون معلومات حساسة)
    const client = {
      id: clientDoc.id,
      email: clientData.email,
      name: clientData.name,
      company: clientData.company,
      phone: clientData.phone,
      
      // حالة العميل
      status: clientData.status || 'pending', // pending, approved, suspended
      approvedAt: clientData.approvedAt,
      
      // معلومات التسجيل
      createdAt: clientData.createdAt,
      lastActiveAt: clientData.lastActiveAt,
      
      // إعدادات العميل
      preferences: {
        language: clientData.preferences?.language || 'ar',
        notifications: clientData.preferences?.notifications || true,
        timezone: clientData.preferences?.timezone || 'Asia/Baghdad'
      },
      
      // المعلومات المالية (المرئية للعميل)
      billing: {
        currency: clientData.billing?.currency || 'IQD',
        totalSpent: clientData.billing?.totalSpent || 0,
        outstandingBalance: clientData.billing?.outstandingBalance || 0,
      },
      
      // إحصائيات
      stats: {
        projects: projectStats,
        pendingApprovals,
        totalFiles: 0, // سيتم حسابها لاحقاً إذا لزم الأمر
      },
      
      // ❌ لا نعرض: internalNotes, adminNotes, creditLimit, margins, etc.
    };

    return NextResponse.json({
      success: true,
      client,
      requestId
    });

  } catch (error) {
    console.error('[client.profile] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}

// PUT /api/client - Update client profile
export async function PUT(request: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - يتطلب تسجيل الدخول',
        requestId
      }, { status: 401 });
    }

    if (session.user.role !== 'client') {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - مخصص للعملاء فقط',
        requestId
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, company, phone, preferences } = body;

    const email = session.user.email.toLowerCase();

    // البحث عن العميل
    const userQuery = await adminDb.collection('users')
      .where('email', '==', email)
      .where('role', '==', 'client')
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'العميل غير موجود', 
        requestId 
      }, { status: 404 });
    }
    
    const clientDoc = userQuery.docs[0];

    // تحديث البيانات المسموح للعميل بتعديلها
    const updateData: {
      updatedAt: string;
      lastActiveAt: string;
      name?: string;
      company?: string;
      phone?: string;
      preferences?: {
        language?: string;
        notifications?: boolean;
        timezone?: string;
      };
    } = {
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    
    if (preferences) {
      updateData.preferences = {
        ...clientDoc.data().preferences,
        ...preferences
      };
    }

    await adminDb.collection('users').doc(clientDoc.id).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      requestId
    });

  } catch (error) {
    console.error('[client.profile.update] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تحديث الملف الشخصي',
      requestId
    }, { status: 500 });
  }
}
