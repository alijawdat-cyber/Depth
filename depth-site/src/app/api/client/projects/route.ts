// Client Projects API - Replace /api/portal/projects
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/client/projects - Client projects list
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

    // البحث عن العميل في النظام الموحد
    const userQuery = await adminDb.collection('users')
      .where('email', '==', email)
      .where('role', '==', 'client')
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'العميل غير موجود بالنظام الموحد', 
        requestId 
      }, { status: 404 });
    }
    
    const clientId = userQuery.docs[0].id;

    // جلب مشاريع العميل
    const projectsQuery = await adminDb
      .collection('projects')
      .where('clientId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const projects = [];

    for (const doc of projectsQuery.docs) {
      const projectData = doc.data();
      
      // عرض بيانات محدودة للعميل (بدون creator details أو margins)
      projects.push({
        id: doc.id,
        title: projectData.title || 'مشروع بدون عنوان',
        description: projectData.description || '',
        status: projectData.status,
        priority: projectData.priority || 'normal',
        deadline: projectData.deadline,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        
        // معلومات العميل فقط
        budget: projectData.finalPrice || projectData.estimatedPrice || 0,
        currency: 'IQD',
        progress: projectData.progress || 0,
        
        // معلومات التسليم
        deliverables: projectData.deliverables ? Object.keys(projectData.deliverables).length : 0,
        completedDeliverables: projectData.deliverables 
          ? Object.values(projectData.deliverables as Record<string, any>).filter((d: any) => d.status === 'completed').length 
          : 0,
        
        // معلومات الموافقات
        pendingApprovals: projectData.approvals 
          ? Object.values(projectData.approvals as Record<string, any>).filter((a: any) => a.status === 'pending').length 
          : 0,
        
        // ❌ لا نعرض: creatorRates, margins, internal notes
      });
    }

    // إحصائيات العميل
    const stats = {
      total: projects.length,
      active: projects.filter(p => ['assigned', 'in_progress', 'review_pending'].includes(p.status)).length,
      completed: projects.filter(p => ['completed', 'delivered'].includes(p.status)).length,
      totalBudget: projects.reduce((sum, p) => sum + p.budget, 0)
    };

    return NextResponse.json({
      success: true,
      projects,
      stats,
      total: projects.length,
      requestId
    });

  } catch (error) {
    console.error('[client.projects] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
