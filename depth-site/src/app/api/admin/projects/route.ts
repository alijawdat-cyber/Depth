import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// Types
interface DeliverableData {
  totalIQD?: number;
  totalUSD?: number;
  [key: string]: unknown;
}

// GET /api/admin/projects
// جلب جميع المشاريع مع الإحصائيات - للإدمن فقط
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للإدمن فقط' 
      }, { status: 403 });
    }

    // جلب جميع المشاريع
    const projectsSnapshot = await adminDb
      .collection('projects')
      .orderBy('createdAt', 'desc')
      .get();

    const projects = [];
    let totalValueIQD = 0;
    let totalValueUSD = 0;
    let totalMargin = 0;
    let projectCount = 0;

    // إحصائيات حسب الحالة
    const statusCounts = {
      draft: 0,
      quote_sent: 0,
      approved: 0,
      in_progress: 0,
      completed: 0,
      delivered: 0
    };

    for (const doc of projectsSnapshot.docs) {
      const projectData = doc.data();
      
      // جلب بيانات العميل
      let clientName = 'غير محدد';
      let clientEmail = projectData.clientEmail || '';
      
      if (projectData.clientId) {
        try {
          const clientDoc = await adminDb
            .collection('clients')
            .doc(projectData.clientId)
            .get();
          
          if (clientDoc.exists) {
            const clientData = clientDoc.data();
            clientName = clientData?.name || clientData?.company || 'غير محدد';
            clientEmail = clientData?.email || clientEmail;
          }
        } catch (error) {
          console.warn('Failed to fetch client data:', error);
        }
      }

      // حساب إجماليات المشروع
      const deliverables = projectData.deliverables || [];
      let projectTotalIQD = 0;
      let projectTotalUSD = 0;
      let projectMargin = 0;

      deliverables.forEach((deliverable: DeliverableData) => {
        projectTotalIQD += deliverable.totalIQD || 0;
        projectTotalUSD += deliverable.totalUSD || 0;
      });

      // حساب الهامش (مبسط - يحتاج تطوير أكثر)
      const estimatedCost = projectTotalIQD * 0.55; // افتراض تكلفة 55%
      projectMargin = projectTotalIQD > 0 ? Math.round(((projectTotalIQD - estimatedCost) / projectTotalIQD) * 100) : 0;

      // تحديد حالة Guardrail
      let guardrailStatus: 'safe' | 'warning' | 'danger' = 'safe';
      if (projectMargin < 45) {
        guardrailStatus = 'danger';
      } else if (projectMargin < 50) {
        guardrailStatus = 'warning';
      }

      const project = {
        id: doc.id,
        title: projectData.title || 'مشروع بدون عنوان',
        clientId: projectData.clientId || '',
        clientName,
        clientEmail,
        status: projectData.status || 'draft',
        priority: projectData.priority || 'normal',
        vertical: projectData.vertical || 'fashion',
        deliverables: deliverables,
        totalIQD: projectTotalIQD,
        totalUSD: projectTotalUSD,
        margin: projectMargin,
        guardrailStatus,
        createdAt: projectData.createdAt || new Date().toISOString(),
        updatedAt: projectData.updatedAt || new Date().toISOString(),
        deadline: projectData.deadline || null,
        description: projectData.description || '',
        snapshot: projectData.snapshot || null
      };

      projects.push(project);

      // تحديث الإحصائيات
      totalValueIQD += projectTotalIQD;
      totalValueUSD += projectTotalUSD;
      totalMargin += projectMargin;
      projectCount++;

      // عد الحالات
      const status = projectData.status || 'draft';
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    }

    // حساب متوسط الهامش
    const averageMargin = projectCount > 0 ? Math.round(totalMargin / projectCount) : 0;

    const stats = {
      total: projectCount,
      draft: statusCounts.draft,
      quoteSent: statusCounts.quote_sent,
      approved: statusCounts.approved,
      inProgress: statusCounts.in_progress,
      completed: statusCounts.completed,
      delivered: statusCounts.delivered,
      totalValueIQD,
      totalValueUSD,
      averageMargin
    };

    return NextResponse.json({
      success: true,
      projects,
      stats
    });

  } catch (error) {
    console.error('Admin projects fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في جلب المشاريع' 
    }, { status: 500 });
  }
}

// POST /api/admin/projects
// إنشاء مشروع جديد - للإدمن فقط
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للإدمن فقط' 
      }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      clientEmail,
      vertical,
      priority,
      deadline,
      description
    } = body;

    // التحقق من صحة البيانات
    if (!title?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'عنوان المشروع مطلوب' 
      }, { status: 400 });
    }

    if (!clientEmail?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'بريد العميل مطلوب' 
      }, { status: 400 });
    }

    // البحث عن العميل أو إنشاؤه
    let clientId = '';
    const clientQuery = await adminDb
      .collection('clients')
      .where('email', '==', clientEmail.toLowerCase())
      .limit(1)
      .get();

    if (!clientQuery.empty) {
      clientId = clientQuery.docs[0].id;
    } else {
      // إنشاء عميل جديد
      const newClientRef = await adminDb
        .collection('clients')
        .add({
          email: clientEmail.toLowerCase(),
          name: 'عميل جديد',
          company: '',
          phone: '',
          status: 'pending',
          createdAt: new Date().toISOString(),
          createdBy: session.user.email
        });
      clientId = newClientRef.id;
    }

    // إنشاء المشروع
    const projectData = {
      title: title.trim(),
      clientId,
      clientEmail: clientEmail.toLowerCase(),
      status: 'draft',
      priority: priority || 'normal',
      vertical: vertical || 'fashion',
      deliverables: [],
      totalIQD: 0,
      totalUSD: 0,
      margin: 0,
      guardrailStatus: 'safe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.email,
      ...(deadline && { deadline }),
      ...(description && { description: description.trim() })
    };

    const projectRef = await adminDb
      .collection('projects')
      .add(projectData);

    // إرجاع المشروع المُنشأ مع بيانات العميل
    const clientDoc = await adminDb
      .collection('clients')
      .doc(clientId)
      .get();
    
    const clientData = clientDoc.data();

    const project = {
      id: projectRef.id,
      ...projectData,
      clientName: clientData?.name || clientData?.company || 'عميل جديد'
    };

    return NextResponse.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Admin project creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في إنشاء المشروع' 
    }, { status: 500 });
  }
}
