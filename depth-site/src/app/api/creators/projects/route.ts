import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/creators/projects
// جلب المشاريع المُسندة للمبدع المسجل دخوله
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // 'active', 'completed', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع للحصول على ID
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات المبدع' 
      }, { status: 404 });
    }

    const creatorId = creatorQuery.docs[0].id;

    // بناء الاستعلام للمشاريع المُسندة للمبدع
    let projectsQuery = adminDb
      .collection('projects')
      .where('assignedCreators', 'array-contains', creatorId);

    // فلترة حسب الحالة
    if (status && status !== 'all') {
      if (status === 'active') {
        projectsQuery = projectsQuery.where('status', 'in', ['assigned', 'in_progress', 'review_pending']);
      } else if (status === 'completed') {
        projectsQuery = projectsQuery.where('status', 'in', ['completed', 'delivered']);
      } else {
        projectsQuery = projectsQuery.where('status', '==', status);
      }
    }

    // ترتيب وتحديد العدد
    projectsQuery = projectsQuery
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (offset > 0) {
      // للصفحات التالية - يحتاج تطوير pagination أكثر تعقيداً
      // مؤقتاً نتجاهل offset
    }

    const projectsSnapshot = await projectsQuery.get();
    const projects = [];

    for (const doc of projectsSnapshot.docs) {
      const projectData = doc.data();
      
      // جلب بيانات العميل
      let clientName = 'غير محدد';
      if (projectData.clientId) {
        try {
          const clientDoc = await adminDb.collection('clients').doc(projectData.clientId).get();
          if (clientDoc.exists) {
            clientName = clientDoc.data()?.name || clientName;
          }
        } catch (error) {
          console.warn(`Failed to fetch client ${projectData.clientId}:`, error);
        }
      }

      // حساب المهام المُسندة للمبدع
      const creatorTasks = (projectData.tasks || []).filter((task: any) => 
        task.assignedTo === creatorId
      );

      const completedTasks = creatorTasks.filter((task: any) => 
        task.status === 'completed'
      );

      projects.push({
        id: doc.id,
        title: projectData.title || 'مشروع بدون عنوان',
        description: projectData.description || '',
        clientName,
        status: projectData.status,
        priority: projectData.priority || 'normal',
        deadline: projectData.deadline,
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt,
        
        // معلومات المهام
        totalTasks: creatorTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: creatorTasks.length - completedTasks.length,
        
        // معلومات الدفع (إذا متوفرة)
        budget: projectData.budget || null,
        creatorEarnings: projectData.creatorPayments?.[creatorId] || null,
        
        // SLA والمواعيد
        slaHours: projectData.slaHours || 48,
        isRush: projectData.priority === 'rush',
        
        // التقييم
        rating: projectData.creatorRatings?.[creatorId] || null,
        feedback: projectData.creatorFeedback?.[creatorId] || null
      });
    }

    // إحصائيات سريعة
    const stats = {
      total: projects.length,
      active: projects.filter(p => ['assigned', 'in_progress', 'review_pending'].includes(p.status)).length,
      completed: projects.filter(p => ['completed', 'delivered'].includes(p.status)).length,
      overdue: projects.filter(p => {
        if (!p.deadline) return false;
        return new Date(p.deadline) < new Date() && !['completed', 'delivered'].includes(p.status);
      }).length
    };

    return NextResponse.json({
      success: true,
      projects,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: projects.length === limit // تقدير بسيط
      }
    });

  } catch (error) {
    console.error('[creators.projects] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}
