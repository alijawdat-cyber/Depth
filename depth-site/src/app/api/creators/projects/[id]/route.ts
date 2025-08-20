// Creator Project Detail API - Support for project details page
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { 
  CreatorProjectOverview,
  CreatorLineItem,
  CreatorTask,
  CreatorFileUpload,
  CreatorActivity 
} from '@/types/creator-project';

// GET /api/creators/projects/[id] - Creator project details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: projectId } = await params;
    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const userQuery = await adminDb.collection('users')
      .where('email', '==', email)
      .where('role', '==', 'creator')
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'المبدع غير موجود', 
        requestId 
      }, { status: 404 });
    }
    
    const creatorId = userQuery.docs[0].id;

    // التحقق من المشروع وملكيته
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    
    if (!projectDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'المشروع غير موجود',
        requestId
      }, { status: 404 });
    }

    const projectData = projectDoc.data();
    if (projectData?.creatorId !== creatorId) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح - المشروع لا يخصك',
        requestId
      }, { status: 403 });
    }

    // جلب بيانات المشروع
    const project: CreatorProjectOverview = {
      id: projectId,
      title: projectData.title,
      description: projectData.description,
      status: projectData.status,
      startDate: projectData.startDate,
      deadline: projectData.deadline,
      estimatedDuration: projectData.estimatedDuration || 0,
      
      // Creator earnings (calculated from line items)
      totalLineItems: 0,
      totalQuantity: 0,
      myEarnings: 0,
      
      // Progress
      completedTasks: 0,
      totalTasks: 0,
      progressPercentage: projectData.progressPercentage || 0,
      
      // Files
      uploadedFiles: 0,
      reviewedFiles: 0,
      deliveredFiles: 0,
    };

    // جلب Line Items للمبدع (بدون clientUnit وagencyMargin)
    const lineItemsSnapshot = await adminDb.collection('lineItems')
      .where('projectId', '==', projectId)
      .where('creatorId', '==', creatorId)
      .get();

    const lineItems: CreatorLineItem[] = [];
    let totalEarnings = 0;
    let totalQuantity = 0;

    for (const doc of lineItemsSnapshot.docs) {
      const data = doc.data();
      
      // حساب creator pricing (exclude client pricing)
      const baseUnit = data.baseUnit || 15000; // IQD base price per unit
      const creatorFactor = data.creatorFactor || 1.2; // Creator gets 20% more than base
      const creatorUnit = Math.round(baseUnit * creatorFactor);
      const lineSubtotal = data.quantity * creatorUnit;
      
      const lineItem: CreatorLineItem = {
        id: doc.id,
        subcategory: data.subcategory,
        quantity: data.quantity,
        processing: data.processing || data.outputLevel || 'raw_basic',
        
        // Creator pricing (safe for creator to see)
        baseUnit,
        creatorUnit,
        lineSubtotal,
        
        // ❌ Hidden from creator: clientUnit, agencyMargin
        
        status: data.status || 'pending',
        notes: data.creatorNotes || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || data.createdAt
      };
      
      lineItems.push(lineItem);
      totalEarnings += lineSubtotal;
      totalQuantity += data.quantity;
    }

    // Update project totals
    project.totalLineItems = lineItems.length;
    project.totalQuantity = totalQuantity;
    project.myEarnings = totalEarnings;

    // جلب Tasks
    const tasksSnapshot = await adminDb.collection('tasks')
      .where('projectId', '==', projectId)
      .where('creatorId', '==', creatorId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const tasks: CreatorTask[] = tasksSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        lineItemId: data.lineItemId,
        subcategory: data.subcategory,
        status: data.status,
        priority: data.priority || 'medium',
        assignedAt: data.assignedAt,
        dueDate: data.dueDate,
        completedAt: data.completedAt,
        estimatedHours: data.estimatedHours,
        actualHours: data.actualHours,
        notes: data.creatorNotes,
        attachments: data.attachments || []
      };
    });

    project.completedTasks = tasks.filter(t => t.status === 'completed').length;
    project.totalTasks = tasks.length;

    // جلب Files (Creator uploads only)
    const filesSnapshot = await adminDb.collection('files')
      .where('projectId', '==', projectId)
      .where('creatorId', '==', creatorId)
      .orderBy('uploadedAt', 'desc')
      .limit(100)
      .get();

    const files: CreatorFileUpload[] = filesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        originalName: data.originalName,
        size: data.size,
        mimeType: data.mimeType,
        url: data.url,
        thumbnail: data.thumbnail,
        
        projectId,
        lineItemId: data.lineItemId,
        taskId: data.taskId,
        
        status: data.status || 'uploaded',
        creatorNotes: data.creatorNotes,
        processingLevel: data.processingLevel,
        version: data.version || 1,
        
        uploadedAt: data.uploadedAt,
        reviewedAt: data.reviewedAt,
        sentToClientAt: data.sentToClientAt
        
        // ❌ Hidden: adminNotes, clientFeedback, internalNotes
      };
    });

    project.uploadedFiles = files.length;
    project.reviewedFiles = files.filter(f => f.status === 'admin_approved').length;
    project.deliveredFiles = files.filter(f => f.status === 'sent_to_client').length;

    // جلب Activities (Creator activities only)
    const activitiesSnapshot = await adminDb.collection('activities')
      .where('projectId', '==', projectId)
      .where('creatorId', '==', creatorId)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const activities: CreatorActivity[] = activitiesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        description: data.description,
        projectId,
        lineItemId: data.lineItemId,
        taskId: data.taskId,
        fileId: data.fileId,
        creatorId: data.creatorId,
        creatorName: data.creatorName,
        timestamp: data.timestamp,
        metadata: data.metadata || {}
      };
    });

    return NextResponse.json({
      success: true,
      project,
      lineItems,
      tasks,
      files,
      activities,
      requestId
    });

  } catch (error) {
    console.error('[creator.project.detail] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}
