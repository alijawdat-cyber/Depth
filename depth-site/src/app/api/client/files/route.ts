// Client Files API - Replace /api/portal/files
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/client/files - Client files list
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

    // إذا كان هناك projectId، تأكد أنه يخص العميل
    if (projectId) {
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
    }

    // بناء الاستعلام للملفات
    let filesQuery = adminDb.collection('files')
      .where('clientId', '==', clientId);

    if (projectId) {
      filesQuery = filesQuery.where('projectId', '==', projectId);
    }

    const filesSnapshot = await filesQuery
      .orderBy('uploadedAt', 'desc')
      .limit(100)
      .get();

    const files = [];

    for (const doc of filesSnapshot.docs) {
      const fileData = doc.data();
      
      // فلترة الملفات للعميل (بدون internal notes)
      files.push({
        id: doc.id,
        name: fileData.name,
        originalName: fileData.originalName,
        size: fileData.size,
        mimeType: fileData.mimeType,
        url: fileData.url,
        thumbnail: fileData.thumbnail,
        
        // معلومات المشروع
        projectId: fileData.projectId,
        projectTitle: fileData.projectTitle,
        
        // معلومات التسليم للعميل
        category: fileData.category, // draft, review, final
        status: fileData.status, // uploaded, reviewed, approved, delivered
        version: fileData.version || 1,
        
        // التواريخ
        uploadedAt: fileData.uploadedAt,
        reviewedAt: fileData.reviewedAt,
        approvedAt: fileData.approvedAt,
        
        // ملاحظات العميل فقط (ليس internal notes)
        clientNotes: fileData.clientNotes,
        clientFeedback: fileData.clientFeedback,
        
        // معلومات الموافقة
        requiresApproval: fileData.requiresApproval || false,
        approvalStatus: fileData.approvalStatus,
        
        // ❌ لا نعرض: creatorNotes, internalNotes, processingDetails
      });
    }

    // إحصائيات الملفات
    const stats = {
      total: files.length,
      pending: files.filter(f => f.status === 'uploaded').length,
      reviewed: files.filter(f => f.status === 'reviewed').length,
      approved: files.filter(f => f.status === 'approved').length,
      delivered: files.filter(f => f.status === 'delivered').length,
      requiresApproval: files.filter(f => f.requiresApproval && !f.approvalStatus).length
    };

    return NextResponse.json({
      success: true,
      files,
      stats,
      total: files.length,
      requestId
    });

  } catch (error) {
    console.error('[client.files] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم',
      requestId
    }, { status: 500 });
  }
}

// POST /api/client/files - Client file upload (feedback/references)
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const category = formData.get('category') as string || 'reference';
    const notes = formData.get('notes') as string || '';

    if (!file || !projectId) {
      return NextResponse.json({
        success: false,
        error: 'الملف ومعرف المشروع مطلوبان',
        requestId
      }, { status: 400 });
    }

    const email = session.user.email.toLowerCase();

    // التحقق من العميل والمشروع
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

    // رفع الملف (ستحتاج لتنفيذ منطق الرفع الفعلي)
    // هذا مثال مبسط
    const fileId = adminDb.collection('files').doc().id;
    const fileRef = adminDb.collection('files').doc(fileId);

    await fileRef.set({
      id: fileId,
      name: file.name,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      
      // معلومات المشروع
      projectId,
      projectTitle: projectData.title,
      clientId,
      
      // معلومات الرفع
      category, // reference, feedback, etc.
      status: 'uploaded',
      version: 1,
      
      // ملاحظات العميل
      clientNotes: notes,
      
      // التواريخ
      uploadedAt: new Date().toISOString(),
      
      // معلومات الرافع
      uploadedBy: clientId,
      uploaderRole: 'client'
    });

    return NextResponse.json({
      success: true,
      fileId,
      message: 'تم رفع الملف بنجاح',
      requestId
    });

  } catch (error) {
    console.error('[client.files.upload] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في رفع الملف',
      requestId
    }, { status: 500 });
  }
}
