import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

/**
 * API شامل للوحة الإدارة
 * يجمع جميع البيانات المطلوبة لصفحات الإدارة
 */

interface FirestoreDocument {
  id: string;
  status?: string;
  createdAt: string;
  [key: string]: unknown;
}

// التحقق من صلاحية الإدارة
async function checkAdminAuth() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== 'admin') {
      return null;
    }

    return session;
  } catch (error) {
    console.error('خطأ في التحقق من الصلاحية:', error);
    return null;
  }
}

// دالة مساعدة لتحويل البيانات
function mapFirestoreDoc(doc: FirebaseFirestore.DocumentSnapshot): FirestoreDocument {
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate?.()?.toISOString() || doc.data()?.createdAt || new Date().toISOString()
  } as FirestoreDocument;
}

// جلب بيانات العملاء
async function fetchClientsData() {
  try {
    const clientsSnapshot = await adminDb.collection('clients').get();
    const clients = clientsSnapshot.docs.map(mapFirestoreDoc);

    return {
      clients,
      stats: {
        total: clients.length,
        pending: clients.filter(c => c.status === 'pending').length,
        approved: clients.filter(c => c.status === 'approved').length,
        rejected: clients.filter(c => c.status === 'rejected').length
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات العملاء:', error);
    return { clients: [], stats: { total: 0, pending: 0, approved: 0, rejected: 0 } };
  }
}

// جلب بيانات المشاريع
async function fetchProjectsData() {
  try {
    const projectsSnapshot = await adminDb.collection('projects').get();
    const projects = projectsSnapshot.docs.map(mapFirestoreDoc);

    return {
      projects,
      stats: {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        pending: projects.filter(p => p.status === 'pending').length
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات المشاريع:', error);
    return { projects: [], stats: { total: 0, active: 0, completed: 0, pending: 0 } };
  }
}

// جلب بيانات العقود
async function fetchContractsData() {
  try {
    const contractsSnapshot = await adminDb.collection('contracts').get();
    const contracts = contractsSnapshot.docs.map(mapFirestoreDoc);

    return {
      contracts,
      stats: {
        total: contracts.length,
        active: contracts.filter(c => c.status === 'active').length,
        completed: contracts.filter(c => c.status === 'completed').length,
        pending: contracts.filter(c => c.status === 'pending').length
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات العقود:', error);
    return { contracts: [], stats: { total: 0, active: 0, completed: 0, pending: 0 } };
  }
}

// جلب بيانات العروض
async function fetchQuotesData() {
  try {
    const quotesSnapshot = await adminDb.collection('quotes').get();
    const quotes = quotesSnapshot.docs.map(mapFirestoreDoc);

    return {
      quotes,
      stats: {
        total: quotes.length,
        draft: quotes.filter(q => q.status === 'draft').length,
        sent: quotes.filter(q => q.status === 'sent').length,
        approved: quotes.filter(q => q.status === 'approved').length,
        rejected: quotes.filter(q => q.status === 'rejected').length
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات العروض:', error);
    return { quotes: [], stats: { total: 0, draft: 0, sent: 0, approved: 0, rejected: 0 } };
  }
}

// جلب بيانات المبدعين
async function fetchCreatorsData() {
  try {
    const creatorsSnapshot = await adminDb.collection('creators').get();
    const creators = creatorsSnapshot.docs.map(mapFirestoreDoc);

    return {
      creators,
      stats: {
        total: creators.length,
        active: creators.filter(c => c.status === 'active').length,
        pending: creators.filter(c => c.status === 'pending').length
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات المبدعين:', error);
    return { creators: [], stats: { total: 0, active: 0, pending: 0 } };
  }
}

// GET - جلب جميع بيانات لوحة الإدارة
export async function GET(req: NextRequest) {
  try {
    // التحقق من الصلاحية
    const session = await checkAdminAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية إدارة مطلوبة' },
        { status: 403 }
      );
    }

    // استخراج نوع البيانات المطلوبة من query parameters
    const { searchParams } = new URL(req.url);
    const dataType = searchParams.get('type') || 'all';

    let responseData = {};

    switch (dataType) {
      case 'clients':
        responseData = await fetchClientsData();
        break;
      
      case 'projects':
        responseData = await fetchProjectsData();
        break;
      
      case 'contracts':
        responseData = await fetchContractsData();
        break;
      
      case 'quotes':
        responseData = await fetchQuotesData();
        break;
      
      case 'creators':
        responseData = await fetchCreatorsData();
        break;
      
      case 'all':
      default:
        // جلب جميع البيانات
        const [clients, projects, contracts, quotes, creators] = await Promise.all([
          fetchClientsData(),
          fetchProjectsData(),
          fetchContractsData(),
          fetchQuotesData(),
          fetchCreatorsData()
        ]);

        responseData = {
          clients,
          projects,
          contracts,
          quotes,
          creators,
          summary: {
            totalClients: clients.stats.total,
            totalProjects: projects.stats.total,
            totalContracts: contracts.stats.total,
            totalQuotes: quotes.stats.total,
            totalCreators: creators.stats.total
          }
        };
        break;
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات لوحة الإدارة:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في الخادم الداخلي',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}

// POST - إجراءات إدارية مختلفة
export async function POST(req: NextRequest) {
  try {
    const session = await checkAdminAuth();
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية إدارة مطلوبة' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case 'update_client_status':
        {
          const { clientId, status } = data;
          await adminDb.collection('clients').doc(clientId).update({
            status,
            updatedAt: new Date()
          });
          
          return NextResponse.json({
            success: true,
            message: `تم تحديث حالة العميل إلى ${status}`
          });
        }

      case 'create_project':
        {
          const projectData = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: data.status || 'active'
          };
          
          const docRef = await adminDb.collection('projects').add(projectData);
          
          return NextResponse.json({
            success: true,
            projectId: docRef.id,
            message: 'تم إنشاء المشروع بنجاح'
          });
        }

      case 'invite_client':
        {
          const { email } = data;
          
          // إضافة دعوة جديدة
          await adminDb.collection('client_invitations').add({
            email,
            status: 'pending',
            createdAt: new Date(),
            invitedBy: session.user?.email
          });
          
          return NextResponse.json({
            success: true,
            message: 'تم إرسال دعوة العميل بنجاح'
          });
        }

      default:
        return NextResponse.json(
          { error: 'عملية غير مدعومة' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('خطأ في تنفيذ العملية الإدارية:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في الخادم الداخلي',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
