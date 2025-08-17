import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/admin/contracts
// جلب جميع العقود مع الإحصائيات - للإدمن فقط
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

    // جلب جميع العقود
    const contractsSnapshot = await adminDb
      .collection('contracts')
      .orderBy('createdAt', 'desc')
      .get();

    const contracts = [];
    let totalValue = 0;
    let contractCount = 0;

    // إحصائيات حسب الحالة
    const statusCounts = {
      draft: 0,
      pending_client: 0,
      signed: 0,
      executed: 0,
      expired: 0,
      terminated: 0
    };

    // إحصائيات حسب النوع
    const typeCounts = {
      msa: 0,
      sow: 0,
      nda: 0,
      equipment: 0,
      model_release: 0,
      influencer: 0,
      media_buying: 0,
      clinica_compliance: 0
    };

    for (const doc of contractsSnapshot.docs) {
      const contractData = doc.data();
      
      // جلب بيانات العميل
      let clientName = 'غير محدد';
      let clientEmail = contractData.clientEmail || '';
      
      if (contractData.clientId) {
        try {
          const clientDoc = await adminDb
            .collection('clients')
            .doc(contractData.clientId)
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

      const contract = {
        id: doc.id,
        type: contractData.type || 'msa',
        status: contractData.status || 'draft',
        title: contractData.title || 'عقد بدون عنوان',
        clientId: contractData.clientId || '',
        clientName,
        clientEmail,
        projectId: contractData.projectId || null,
        parentContractId: contractData.parentContractId || null,
        value: contractData.value || 0,
        currency: contractData.currency || 'IQD',
        fxRate: contractData.fxRate || null,
        fxDate: contractData.fxDate || null,
        createdAt: contractData.createdAt || new Date().toISOString(),
        updatedAt: contractData.updatedAt || new Date().toISOString(),
        signedAt: contractData.signedAt || null,
        expiresAt: contractData.expiresAt || null,
        effectiveDate: contractData.effectiveDate || null,
        content: contractData.content || {},
        signatures: contractData.signatures || [],
        annexes: contractData.annexes || [],
        snapshot: contractData.snapshot || null
      };

      contracts.push(contract);

      // تحديث الإحصائيات
      if (contract.value && contract.currency === 'IQD') {
        totalValue += contract.value;
      } else if (contract.value && contract.currency === 'USD') {
        // تحويل تقريبي للدولار
        totalValue += contract.value * (contract.fxRate || 1300);
      }
      contractCount++;

      // عد الحالات
      const status = contractData.status || 'draft';
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      }

      // عد الأنواع
      const type = contractData.type || 'msa';
      if (type in typeCounts) {
        typeCounts[type as keyof typeof typeCounts]++;
      }
    }

    // حساب متوسط القيمة
    const averageValue = contractCount > 0 ? Math.round(totalValue / contractCount) : 0;

    const stats = {
      total: contractCount,
      draft: statusCounts.draft,
      pendingClient: statusCounts.pending_client,
      signed: statusCounts.signed,
      executed: statusCounts.executed,
      expired: statusCounts.expired,
      terminated: statusCounts.terminated,
      totalValue,
      averageValue,
      typeBreakdown: typeCounts
    };

    return NextResponse.json({
      success: true,
      contracts,
      stats
    });

  } catch (error) {
    console.error('Admin contracts fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في جلب العقود' 
    }, { status: 500 });
  }
}

// POST /api/admin/contracts
// إنشاء عقد جديد - للإدمن فقط
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
      type,
      title,
      clientEmail,
      value,
      currency,
      effectiveDate,
      expiresAt,
      projectId
    } = body;

    // التحقق من صحة البيانات
    if (!type || !title?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'نوع العقد والعنوان مطلوبان' 
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

    // إنشاء محتوى العقد الافتراضي حسب النوع
    const defaultContent = generateDefaultContent(type);

    // إنشاء التواقيع الافتراضية
    const defaultSignatures = [
      {
        party: 'depth' as const,
        signerName: 'علي جودت',
        signerTitle: 'المدير العام',
        status: 'pending' as const
      },
      {
        party: 'client' as const,
        signerName: 'ممثل العميل',
        signerTitle: 'المخول بالتوقيع',
        status: 'pending' as const
      }
    ];

    // إنشاء العقد
    const contractData = {
      type,
      status: 'draft',
      title: title.trim(),
      clientId,
      clientEmail: clientEmail.toLowerCase(),
      ...(projectId && { projectId }),
      value: value || 0,
      currency: currency || 'IQD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.email,
      content: defaultContent,
      signatures: defaultSignatures,
      annexes: [],
      ...(effectiveDate && { effectiveDate }),
      ...(expiresAt && { expiresAt })
    };

    const contractRef = await adminDb
      .collection('contracts')
      .add(contractData);

    // إرجاع العقد المُنشأ مع بيانات العميل
    const clientDoc = await adminDb
      .collection('clients')
      .doc(clientId)
      .get();
    
    const clientData = clientDoc.data();

    const contract = {
      id: contractRef.id,
      ...contractData,
      clientName: clientData?.name || clientData?.company || 'عميل جديد'
    };

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_logs')
      .add({
        action: 'contract_created',
        entityType: 'contract',
        entityId: contractRef.id,
        userId: session.user.email,
        details: {
          contractType: type,
          contractTitle: title,
          clientEmail: clientEmail,
          value: value || 0,
          currency: currency || 'IQD'
        },
        timestamp: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      contract
    });

  } catch (error) {
    console.error('Admin contract creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في إنشاء العقد' 
    }, { status: 500 });
  }
}

// دالة إنشاء محتوى افتراضي حسب نوع العقد
function generateDefaultContent(type: string) {
  const basePaymentTerms = {
    advance: 50,
    onDelivery: 50,
    killFee: 35
  };

  const baseLiability = {
    limit: 'لا يتجاوز مجموع الأتعاب المدفوعة آخر 3 أشهر',
    period: '3 أشهر'
  };

  switch (type) {
    case 'msa':
      return {
        scope: 'إنتاج وإدارة محتوى وتسويق أداء وفق أوامر عمل لاحقة',
        paymentTerms: basePaymentTerms,
        liability: baseLiability,
        intellectualProperty: 'تنتقل للعميل بعد السداد الكامل؛ نحتفظ بحق عرض الأعمال كسابقة عمل',
        currency: 'الأساس الدينار العراقي (IQD)',
        confidentiality: 'كما في اتفاقية عدم الإفشاء المرفقة',
        jurisdiction: 'حسب قانون/اختصاص محل التعاقد'
      };

    case 'sow':
      return {
        deliverables: [],
        timeline: {
          startDate: '',
          milestones: [],
          finalDelivery: ''
        },
        budget: {
          fees: 0,
          thirdPartyExpenses: 0,
          total: 0
        },
        paymentTerms: basePaymentTerms,
        revisionRounds: 2,
        acceptanceTarget: 70,
        clientResponsibilities: 'مواد/وصول/موافقات ضمن زمن الاستجابة في SLA'
      };

    case 'nda':
      return {
        scope: 'حماية معلومات الطرفين المتعلقة بالمشاريع',
        confidentialityPeriod: '3 سنوات من تاريخ آخر إفشاء',
        obligations: 'استخدام للمشروع فقط؛ منع الإفشاء؛ حماية معقولة',
        exceptions: 'معلومات عامة، معروفة سابقاً، مستقلّة التطوير، أو مُستلمة من طرف ثالث مشروع',
        remedies: 'حق تعويض وإنذار قضائي عند الإخلال'
      };

    case 'equipment':
      return {
        equipmentDetails: {
          usage: 'استخدام داخلي',
          checkout: 'خروج بموافقة خطية',
          checkInOut: 'Check-In/Check-Out مطلوب',
          damages: 'تعويض الأضرار'
        }
      };

    case 'model_release':
      return {
        modelDetails: {
          commercialUse: 'حق الاستخدام التجاري',
          channels: 'نطاق القنوات',
          duration: 'المدة',
          compensation: 'التعويض'
        }
      };

    case 'influencer':
      return {
        influencerDetails: {
          contentScope: 'نطاق المحتوى',
          deliverables: 'تسليمات',
          ownership: 'ملكية',
          whitelisting: 'إتاحة Whitelisting بشروط واضحة',
          platformDisclosures: 'إفصاحات المنصات'
        }
      };

    case 'media_buying':
      return {
        mediaBuyingDetails: {
          managementFee: '12% من الإنفاق',
          minimumBasic: '$350',
          minimumPro: '$500',
          accountOwnership: 'الملكية والإدارة لحسابات الإعلانات للعميل',
          depthAccess: 'الوصول التشغيلي لـ Depth',
          transparency: 'الشفافية والفوترة'
        }
      };

    case 'clinica_compliance':
      return {
        clinicaDetails: {
          writtenApprovals: 'موافقات خطية',
          disclaimer: 'إخلاء مسؤولية',
          platformCompliance: 'التزام سياسات المنصات للمطالبات الطبية/التجميلية'
        }
      };

    default:
      return {};
  }
}
