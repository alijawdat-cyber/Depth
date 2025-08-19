// API لإدارة التقارير المشبوهة والمراجعة الأمنية للمبدعين
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface SuspectReport {
  id: string;
  reportedBy: string;
  reportType: 'quality_issue' | 'behavior_issue' | 'policy_violation' | 'fraud_suspicion';
  description: string;
  evidence?: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

// GET /api/creators/suspect - جلب التقارير المتعلقة بالمبدع (للمبدع نفسه أو للإدارة)
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');
    const isAdmin = session.user.role === 'admin';

    let targetCreatorId = creatorId;

    // إذا لم يكن إدارياً، يمكنه فقط رؤية تقاريره الخاصة
    if (!isAdmin) {
      if (session.user.role !== 'creator') {
        return NextResponse.json({
          success: false,
          error: 'غير مصرح - مخصص للمبدعين والإدارة فقط',
          requestId
        }, { status: 403 });
      }

      // البحث عن معرف المبدع
      const creatorQuery = await adminDb
        .collection('users')
        .where('email', '==', session.user.email.toLowerCase())
        .where('role', '==', 'creator')
        .limit(1)
        .get();

      if (creatorQuery.empty) {
        return NextResponse.json({
          success: false,
          error: 'لم يتم العثور على بيانات المبدع',
          requestId
        }, { status: 404 });
      }

      targetCreatorId = creatorQuery.docs[0].id;
    }

    if (!targetCreatorId) {
      return NextResponse.json({
        success: false,
        error: 'معرف المبدع مطلوب',
        requestId
      }, { status: 400 });
    }

    // جلب التقارير
    const reportsQuery = await adminDb
      .collection('suspect_reports')
      .where('creatorId', '==', targetCreatorId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const reports: SuspectReport[] = reportsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SuspectReport));

    // إخفاء معلومات حساسة إذا لم يكن إدارياً
    if (!isAdmin) {
      reports.forEach(report => {
        delete (report as Partial<SuspectReport>).reportedBy;
        delete (report as Partial<SuspectReport>).evidence;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        reports,
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length
      },
      requestId
    });

  } catch (error) {
    console.error('[GET /api/creators/suspect] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}

// POST /api/creators/suspect - إرسال تقرير مشبوه (للإدارة فقط)
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - يتطلب صلاحيات إدارية',
        requestId
      }, { status: 403 });
    }

    const { creatorId, reportType, description, evidence } = await req.json();

    if (!creatorId || !reportType || !description) {
      return NextResponse.json({
        success: false,
        error: 'معرف المبدع ونوع التقرير والوصف مطلوبة',
        requestId
      }, { status: 400 });
    }

    // التحقق من وجود المبدع
  const creatorDoc = await adminDb.collection('users').doc(creatorId).get();
  if (!creatorDoc.exists || creatorDoc.data()?.role !== 'creator') {
      return NextResponse.json({
        success: false,
        error: 'المبدع غير موجود',
        requestId
      }, { status: 404 });
    }

    const now = new Date().toISOString();

    const reportData = {
      creatorId,
      reportedBy: session.user.email,
      reportType,
      description,
      evidence: evidence || [],
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    const reportRef = await adminDb.collection('suspect_reports').add(reportData);

    // تسجيل في audit log
    await adminDb.collection('audit_log').add({
      action: 'suspect_report_created',
      entityType: 'creator',
      entityId: creatorId,
      userId: session.user.email,
      timestamp: now,
      details: {
        reportId: reportRef.id,
        reportType,
        description: description.substring(0, 100) // أول 100 حرف فقط
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال التقرير بنجاح',
      data: {
        reportId: reportRef.id
      },
      requestId
    });

  } catch (error) {
    console.error('[POST /api/creators/suspect] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
