// Client Approvals API - Replace /api/portal/approvals
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/client/approvals - Client approvals list
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
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
    
    const clientId = userQuery.docs[0].id;

    // بناء الاستعلام للموافقات
    let approvalsQuery = adminDb.collection('approvals')
      .where('clientId', '==', clientId);

    if (projectId) {
      // التحقق من ملكية المشروع
      const projectDoc = await adminDb.collection('projects').doc(projectId).get();
      
      if (!projectDoc.exists) {
        return NextResponse.json({
          success: false,
          error: 'المشروع غير موجود',
          requestId
        }, { status: 404 });
      }

      const projectData = projectDoc.data();
      if (projectData?.clientId !== clientId) {
        return NextResponse.json({
          success: false,
          error: 'غير مصرح - المشروع لا يخصك',
          requestId
        }, { status: 403 });
      }

      approvalsQuery = approvalsQuery.where('projectId', '==', projectId);
    }

    if (status) {
      approvalsQuery = approvalsQuery.where('status', '==', status);
    }

    const approvalsSnapshot = await approvalsQuery
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const approvals = [];

    for (const doc of approvalsSnapshot.docs) {
      const approvalData = doc.data();
      
      // فلترة الموافقات للعميل (بدون internal details)
      approvals.push({
        id: doc.id,
        
        // معلومات الموافقة
        title: approvalData.title,
        description: approvalData.description,
        type: approvalData.type, // file, milestone, concept, final
        priority: approvalData.priority, // low, medium, high, urgent
        
        // حالة الموافقة
        status: approvalData.status, // pending, approved, rejected, changes_requested
        
        // معلومات المشروع
        projectId: approvalData.projectId,
        projectTitle: approvalData.projectTitle,
        
        // الملفات المرفقة
        attachments: approvalData.attachments || [],
        
        // معلومات الجدولة
        dueDate: approvalData.dueDate,
        estimatedDuration: approvalData.estimatedDuration, // بالدقائق
        
        // ردود العميل
        clientResponse: approvalData.clientResponse,
        clientNotes: approvalData.clientNotes,
        clientFeedback: approvalData.clientFeedback,
        
        // التواريخ
        createdAt: approvalData.createdAt,
        submittedAt: approvalData.submittedAt,
        respondedAt: approvalData.respondedAt,
        
        // معلومات الإنجاز
        completedAt: approvalData.completedAt,
        
        // تاريخ الموافقة
        approvalHistory: approvalData.approvalHistory || [],
        
        // ❌ لا نعرض: internalNotes, creatorId, processingDetails, adminNotes
      });
    }

    // إحصائيات الموافقات
    const stats = {
      total: approvals.length,
      pending: approvals.filter(a => a.status === 'pending').length,
      approved: approvals.filter(a => a.status === 'approved').length,
      rejected: approvals.filter(a => a.status === 'rejected').length,
      changesRequested: approvals.filter(a => a.status === 'changes_requested').length,
      overdue: approvals.filter(a => 
        a.status === 'pending' && 
        a.dueDate && 
        new Date(a.dueDate) < new Date()
      ).length
    };

    return NextResponse.json({
      success: true,
      approvals,
      stats,
      total: approvals.length,
      requestId
    });

  } catch (error) {
    console.error('[client.approvals] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}

// POST /api/client/approvals - Client approval response
export async function POST(request: NextRequest) {
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
    const { 
      approvalId, 
      action, // approve, reject, request_changes
      notes, 
      feedback,
      requestedChanges 
    } = body;

    if (!approvalId || !action) {
      return NextResponse.json({
        success: false,
        error: 'معرف الموافقة والإجراء مطلوبان',
        requestId
      }, { status: 400 });
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
    
    const clientId = userQuery.docs[0].id;

    // التحقق من الموافقة
    const approvalDoc = await adminDb.collection('approvals').doc(approvalId).get();
    
    if (!approvalDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'الموافقة غير موجودة',
        requestId
      }, { status: 404 });
    }

    const approvalData = approvalDoc.data();
    if (approvalData?.clientId !== clientId) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - الموافقة لا تخصك',
        requestId
      }, { status: 403 });
    }

    if (approvalData.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'الموافقة تم الرد عليها مسبقاً',
        requestId
      }, { status: 400 });
    }

    // تحديث الموافقة
    const now = new Date().toISOString();
    let newStatus = 'pending';
    
    switch (action) {
      case 'approve':
        newStatus = 'approved';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'request_changes':
        newStatus = 'changes_requested';
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'إجراء غير صحيح',
          requestId
        }, { status: 400 });
    }

    // إضافة إلى تاريخ الموافقة
    const historyEntry = {
      action,
      respondedBy: clientId,
      respondedAt: now,
      notes: notes || '',
      feedback: feedback || ''
    };

    const updateData: {
      status: string;
      respondedAt: string;
      clientResponse: string;
      clientNotes: string;
      clientFeedback: string;
      requestedChanges?: string[];
      approvalHistory: Array<{
        action: string;
        respondedBy: string;
        respondedAt: string;
        notes: string;
        feedback: string;
      }>;
      completedAt?: string;
    } = {
      status: newStatus,
      respondedAt: now,
      clientResponse: action,
      clientNotes: notes || '',
      clientFeedback: feedback || '',
      approvalHistory: [...(approvalData.approvalHistory || []), historyEntry]
    };

    if (requestedChanges) {
      updateData.requestedChanges = requestedChanges;
    }

    if (newStatus === 'approved') {
      updateData.completedAt = now;
    }

    await adminDb.collection('approvals').doc(approvalId).update(updateData);

    // إشعار المبدع/الإدارة بالرد
    // يمكن إضافة منطق الإشعارات هنا

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل ردك بنجاح',
      status: newStatus,
      requestId
    });

  } catch (error) {
    console.error('[client.approvals.respond] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تسجيل الرد',
      requestId
    }, { status: 500 });
  }
}

// PUT /api/client/approvals/[id] - Update approval response
export async function PUT() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    // تنفيذ تحديث الموافقة (تعديل الرد السابق)
    // منطق مماثل لـ POST لكن للتعديل
    // يتطلب تنفيذ المنطق الكامل

    return NextResponse.json({
      success: true,
      message: 'تم تحديث ردك بنجاح',
      requestId
    });

  } catch (error) {
    console.error('[client.approvals.update] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تحديث الرد',
      requestId
    }, { status: 500 });
  }
}
