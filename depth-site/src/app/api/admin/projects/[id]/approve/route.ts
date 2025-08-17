import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getActiveRateCard } from '@/lib/catalog/read';
import { getCurrentFXRate as getFXRate, createFXSnapshot, formatCurrency as formatCurrencyUnified } from '@/lib/pricing/fx';

// POST /api/admin/projects/[id]/approve
// اعتماد المشروع وإنشاء Version Snapshot - حسب الوثائق
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const projectId = params.id;

    // جلب المشروع
    const projectDoc = await adminDb
      .collection('projects')
      .doc(projectId)
      .get();

    if (!projectDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'المشروع غير موجود' 
      }, { status: 404 });
    }

    const projectData = projectDoc.data()!;

    // التحقق من أن المشروع في حالة quote_sent
    if (projectData.status !== 'quote_sent') {
      return NextResponse.json({ 
        success: false, 
        error: 'يمكن اعتماد المشاريع المُرسل عرضها فقط' 
      }, { status: 400 });
    }

    // جلب الإصدار الحالي من الحوكمة/الكتالوج والتسعير
    const currentVersion = await getCurrentVersion();
    const activeRateCard = await getActiveRateCard();
    const fxRate = getFXRate(activeRateCard?.fxPolicy || undefined);
    const fxSnapshot = createFXSnapshot(Number(projectData.totalIQD || 0), fxRate, 'admin');

    // إنشاء Version Snapshot - حسب الوثائق
    const snapshot = {
      version: currentVersion.version,
      fxRate: fxSnapshot.rate,
      fxDate: fxSnapshot.date,
      fxSource: fxSnapshot.source,
      catalogVersion: currentVersion.catalogVersion,
      pricingVersion: currentVersion.pricingVersion,
      rateCardVersionId: activeRateCard?.versionId || null,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email,
      // حفظ نسخة من التسليمات والأسعار
      deliverables: projectData.deliverables,
      totalIQD: projectData.totalIQD,
      totalUSD: fxSnapshot.quotedUSD,
      margin: projectData.margin
    };

    // تحديث المشروع مع Snapshot
    await adminDb
      .collection('projects')
      .doc(projectId)
      .update({
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: session.user.email,
        snapshot: snapshot,
        updatedAt: new Date().toISOString()
      });

    // تسجيل في Audit Log
    await adminDb
      .collection('audit_logs')
      .add({
        action: 'project_approved',
        entityType: 'project',
        entityId: projectId,
        userId: session.user.email,
        details: {
          projectTitle: projectData.title,
          clientEmail: projectData.clientEmail,
          totalIQD: projectData.totalIQD,
          totalUSD: fxSnapshot.quotedUSD,
          margin: projectData.margin,
          snapshot: {
            version: snapshot.version,
            fxRate: snapshot.fxRate,
            catalogVersion: snapshot.catalogVersion
          }
        },
        timestamp: new Date().toISOString()
      });

    // إنشاء SOW (Statement of Work) - حسب الوثائق
    const sowData = await generateSOW(projectData, snapshot);
    
    // حفظ SOW
    const sowRef = await adminDb
      .collection('contracts')
      .add({
        type: 'sow',
        projectId: projectId,
        clientId: projectData.clientId,
        status: 'generated',
        content: sowData,
        snapshot: snapshot,
        createdAt: new Date().toISOString(),
        createdBy: session.user.email
      });

    return NextResponse.json({
      success: true,
      message: 'تم اعتماد المشروع وإنشاء Version Snapshot بنجاح',
      snapshot: snapshot,
      sowId: sowRef.id,
      approvedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Project approval error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في اعتماد المشروع' 
    }, { status: 500 });
  }
}

// دالة جلب الإصدار الحالي
async function getCurrentVersion() {
  try {
    // جلب آخر إصدار من الحوكمة
    const versionQuery = await adminDb
      .collection('versions')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!versionQuery.empty) {
      const versionData = versionQuery.docs[0].data();
      return {
        version: versionData.version || 'v2024.01',
        catalogVersion: versionData.catalogVersion || 'v2024.01',
        pricingVersion: versionData.pricingVersion || 'v2024.01'
      };
    }
  } catch (error) {
    console.warn('Failed to fetch current version:', error);
  }

  // إصدار افتراضي
  return {
    version: `v${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    catalogVersion: `v${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    pricingVersion: `v${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}`
  };
}

// دالة جلب سعر الصرف الحالي
async function getCurrentFXRate() {
  try {
    // جلب آخر سعر صرف
    const fxQuery = await adminDb
      .collection('fx_rates')
      .orderBy('date', 'desc')
      .limit(1)
      .get();

    if (!fxQuery.empty) {
      const fxData = fxQuery.docs[0].data();
      return {
        rate: fxData.rate || 1300,
        date: fxData.date || new Date().toISOString(),
        source: fxData.source || 'manual'
      };
    }
  } catch (error) {
    console.warn('Failed to fetch current FX rate:', error);
  }

  // سعر صرف افتراضي
  return {
    rate: 1300, // د.ع للدولار الواحد
    date: new Date().toISOString(),
    source: 'default'
  };
}

// دالة إنشاء SOW (Statement of Work)
async function generateSOW(projectData: any, snapshot: any) {
  const deliverables = projectData.deliverables || [];
  
  let deliverablesList = '';
  deliverables.forEach((del: any, index: number) => {
    deliverablesList += `
${index + 1}. ${del.subcategoryNameAr || del.subcategory}
   - الكمية: ${del.quantity}
   - المعالجة: ${getProcessingText(del.processing)}
   - السعر: ${formatCurrencyUnified(del.totalIQD)} (${formatCurrencyUnified(del.totalUSD, 'USD')})
   - المُسند إلى: ${del.assignedToName || 'سيتم التحديد'}
   ${del.conditions?.isRush ? '   - عاجل (Rush) - SLA مخفض' : ''}
   ${del.conditions?.locationZone ? `   - المنطقة: ${getLocationZoneText(del.conditions.locationZone)}` : ''}
`;
  });

  const sowContent = {
    projectTitle: projectData.title,
    clientId: projectData.clientId,
    clientEmail: projectData.clientEmail,
    deliverables: deliverablesList,
    totalIQD: projectData.totalIQD,
    totalUSD: projectData.totalUSD,
    margin: projectData.margin,
    
    // شروط العقد
    terms: {
      slaHours: projectData.priority === 'rush' ? 24 : 48,
      paymentTerms: 'دفع 50% مقدماً، والباقي عند التسليم',
      revisionRounds: 2,
      deliveryMethod: 'رابط تحميل آمن',
      copyrights: 'العميل يحصل على حقوق الاستخدام التجاري'
    },
    
    // معلومات الإصدار
    snapshot: {
      version: snapshot.version,
      fxRate: snapshot.fxRate,
      fxDate: snapshot.fxDate,
      catalogVersion: snapshot.catalogVersion,
      pricingVersion: snapshot.pricingVersion
    },
    
    // بيانات الامتثال
    compliance: {
      gdprCompliant: true,
      dataRetention: '2 سنوات',
      backupPolicy: 'نسخ احتياطية يومية'
    },
    
    generatedAt: new Date().toISOString()
  };

  return sowContent;
}

// دوال مساعدة
function getProcessingText(processing: string) {
  switch (processing) {
    case 'raw_only': return 'RAW Only';
    case 'raw_basic': return 'RAW + Basic Color';
    case 'full_retouch': return 'Full Retouch';
    default: return processing;
  }
}

function getLocationZoneText(zone: string) {
  switch (zone) {
    case 'baghdad_center': return 'بغداد — مركز';
    case 'baghdad_outer': return 'بغداد — أطراف';
    case 'provinces_near': return 'محافظات — قريبة';
    case 'provinces_far': return 'محافظات — بعيدة';
    default: return zone;
  }
}
