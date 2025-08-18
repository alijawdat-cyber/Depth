import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// Types (إضافة نوع مقاييس الأداء)
interface PerformanceMetrics {
  onTimePercentage: number;
  firstPassPercentage: number;
  averageCompletionTime: number;
  totalCompletedTasks: number;
}

interface TaskData {
  assignedTo?: string;
  status?: string;
  quality?: string;
  completedAt?: string;
  assignedAt?: string;
  rate?: number;
  dueDate?: string;
  deadline?: string;
  revisionCount?: number;
  [key: string]: unknown;
}

interface ProjectData {
  tasks?: TaskData[];
  slaHours?: number;
  deliverables?: unknown[];
  [key: string]: unknown;
}

// دوال حساب Speed Bonus حسب الوثائق
function calculateSpeedBonus(projectData: ProjectData, creatorId: string): number {
  const creatorTasks = (projectData.tasks || []).filter((task: TaskData) => task.assignedTo === creatorId);
  const completedTasks = creatorTasks.filter((task: TaskData) => task.status === 'completed' && task.quality === 'approved');
  
  if (completedTasks.length === 0) return 0;
  
  let totalBonus = 0;
  const slaHours = projectData.slaHours || 48;
  
  completedTasks.forEach((task: TaskData) => {
    if (task.completedAt && task.assignedAt) {
      const completionTime = new Date(task.completedAt).getTime() - new Date(task.assignedAt).getTime();
      const completionHours = completionTime / (1000 * 60 * 60);
      const slaDeadline = slaHours;
      
      if (completionHours < slaDeadline * 0.75) { // إنجاز في أقل من 75% من الوقت المحدد
        const bonusPercentage = Math.min(20, (slaDeadline - completionHours) / slaDeadline * 100);
        const taskRate = task.rate || 0;
        totalBonus += taskRate * (bonusPercentage / 100);
      }
    }
  });
  
  return Math.round(totalBonus);
}

function isDeliveredEarly(projectData: ProjectData, creatorId: string): boolean {
  const creatorTasks = (projectData.tasks || []).filter((task: TaskData) => 
    task.assignedTo === creatorId && task.status === 'completed'
  );
  
  return creatorTasks.some((task: TaskData) => {
    if (task.completedAt && task.dueDate) {
      return new Date(task.completedAt) < new Date(task.dueDate);
    }
    return false;
  });
}

// حساب نقاط الجودة حسب الوثائق
function calculateQualityScore(projectData: ProjectData, creatorId: string): number {
  const creatorTasks = (projectData.tasks || []).filter((task: TaskData) => task.assignedTo === creatorId);
  if (creatorTasks.length === 0) return 0;
  
  let totalScore = 0;
  let scoredTasks = 0;
  
  creatorTasks.forEach((task: TaskData) => {
    if (task.quality) {
      switch (task.quality) {
        case 'excellent': totalScore += 5; break;
        case 'good': totalScore += 4; break;
        case 'acceptable': totalScore += 3; break;
        case 'needs_improvement': totalScore += 2; break;
        case 'poor': totalScore += 1; break;
        default: totalScore += 3; break;
      }
      scoredTasks++;
    }
  });
  
  return scoredTasks > 0 ? Math.round((totalScore / scoredTasks) * 20) : 0; // تحويل إلى نسبة مئوية
}

// حساب مقاييس الأداء
function calculatePerformanceMetrics(projectData: ProjectData, creatorId: string): PerformanceMetrics | null {
  const creatorTasks = (projectData.tasks || []).filter((task: TaskData) => task.assignedTo === creatorId);
  if (creatorTasks.length === 0) return null;
  
  const completedTasks = creatorTasks.filter((task: TaskData) => task.status === 'completed');
  const onTimeTasks = completedTasks.filter((task: TaskData) => {
    if (task.completedAt && task.deadline) {
      return new Date(task.completedAt) <= new Date(task.deadline!);
    }
    return false;
  });
  
  const firstPassTasks = completedTasks.filter((task: TaskData) => 
    task.revisionCount === 0 || task.revisionCount === undefined
  );
  
  return {
    onTimePercentage: completedTasks.length > 0 ? Math.round((onTimeTasks.length / completedTasks.length) * 100) : 0,
    firstPassPercentage: completedTasks.length > 0 ? Math.round((firstPassTasks.length / completedTasks.length) * 100) : 0,
    averageCompletionTime: calculateAverageCompletionTime(completedTasks),
    totalCompletedTasks: completedTasks.length
  };
}

function calculateAverageCompletionTime(tasks: TaskData[]): number {
  const timesInHours = tasks
    .filter((task: TaskData) => task.assignedAt && task.completedAt)
    .map((task: TaskData) => {
      const assignedTime = new Date(task.assignedAt!).getTime();
      const completedTime = new Date(task.completedAt!).getTime();
      return (completedTime - assignedTime) / (1000 * 60 * 60); // ساعات
    });
  
  if (timesInHours.length === 0) return 0;
  return Math.round(timesInHours.reduce((sum, time) => sum + time, 0) / timesInHours.length);
}

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
      interface Task {
        assignedTo?: string;
        status?: string;
      }
      
      const creatorTasks = (projectData.tasks || []).filter((task: Task) => 
        task.assignedTo === creatorId
      );

      const completedTasks = creatorTasks.filter((task: Task) => 
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
        
        // معلومات الدفع - السعر الصافي للمبدع فقط (حسب سياسة الشفافية)
        creatorNetRate: projectData.creatorRates?.[creatorId] || null,
        // budget و creatorEarnings مخفيان حسب الوثائق
        
        // SLA والمواعيد
        slaHours: projectData.slaHours || 48,
        isRush: projectData.priority === 'rush',
        
        // Speed Bonus (حسب الوثائق - إذا أنجز قبل SLA بجودة معتمدة)
        speedBonus: calculateSpeedBonus(projectData, creatorId),
        isEarlyDelivery: isDeliveredEarly(projectData, creatorId),
        
        // التقييم المحسن
        rating: projectData.creatorRatings?.[creatorId] || null,
        feedback: projectData.creatorFeedback?.[creatorId] || null,
        qualityScore: calculateQualityScore(projectData, creatorId),
        performanceMetrics: calculatePerformanceMetrics(projectData, creatorId)
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
