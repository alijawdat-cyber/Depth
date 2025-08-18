// API لإدارة أرباح المبدعين
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface EarningsData {
  creatorId: string;
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedProjects: number;
  averageProjectValue: number;
  lastPaymentDate?: string;
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  id: string;
  amount: number;
  projectId: string;
  projectName: string;
  paymentDate: string;
  status: 'pending' | 'completed' | 'failed';
}

// GET /api/creators/earnings - جلب أرباح المبدع
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

    if (session.user.role !== 'creator') {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - مخصص للمبدعين فقط',
        requestId
      }, { status: 403 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({
        success: false,
        error: 'لم يتم العثور على بيانات المبدع',
        requestId
      }, { status: 404 });
    }

    const creatorId = creatorQuery.docs[0].id;

    // جلب المشاريع المكتملة للمبدع
    const projectsQuery = await adminDb
      .collection('projects')
      .where('assignedCreators', 'array-contains', creatorId)
      .where('status', 'in', ['completed', 'delivered'])
      .get();

    let totalEarnings = 0;
    let monthlyEarnings = 0;
    let pendingPayments = 0;
    const paymentHistory: PaymentRecord[] = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    for (const projectDoc of projectsQuery.docs) {
      const projectData = projectDoc.data();
      const projectValue = projectData.finalPrice || projectData.estimatedPrice || 0;
      
      // حساب نصيب المبدع (افتراضياً 70% من قيمة المشروع)
      const creatorShare = projectValue * 0.7;
      totalEarnings += creatorShare;

      // حساب الأرباح الشهرية
      const projectDate = new Date(projectData.completedAt || projectData.createdAt);
      if (projectDate.getMonth() === currentMonth && projectDate.getFullYear() === currentYear) {
        monthlyEarnings += creatorShare;
      }

      // إضافة للتاريخ
      paymentHistory.push({
        id: projectDoc.id,
        amount: creatorShare,
        projectId: projectDoc.id,
        projectName: projectData.title || 'مشروع بدون عنوان',
        paymentDate: projectData.completedAt || projectData.createdAt,
        status: projectData.paymentStatus || 'pending'
      });

      // حساب المدفوعات المعلقة
      if (!projectData.paymentStatus || projectData.paymentStatus === 'pending') {
        pendingPayments += creatorShare;
      }
    }

    const earningsData: EarningsData = {
      creatorId,
      totalEarnings,
      monthlyEarnings,
      pendingPayments,
      completedProjects: projectsQuery.docs.length,
      averageProjectValue: projectsQuery.docs.length > 0 ? totalEarnings / projectsQuery.docs.length : 0,
      paymentHistory: paymentHistory.slice(0, 10) // آخر 10 مدفوعات
    };

    return NextResponse.json({
      success: true,
      data: earningsData,
      requestId
    });

  } catch (error) {
    console.error('[GET /api/creators/earnings] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
