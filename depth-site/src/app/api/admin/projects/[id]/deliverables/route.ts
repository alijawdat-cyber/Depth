import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// POST /api/admin/projects/[id]/deliverables
// إضافة تسليمة جديدة للمشروع مع حساب التسعير وفحص Guardrails
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
    const body = await req.json();
    const {
      subcategory,
      quantity,
      processing,
      isRush,
      locationZone,
      assignedTo
    } = body;

    // التحقق من صحة البيانات
    if (!subcategory?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'الفئة الفرعية مطلوبة' 
      }, { status: 400 });
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json({ 
        success: false, 
        error: 'الكمية يجب أن تكون أكبر من صفر' 
      }, { status: 400 });
    }

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

    // جلب السعر الأساسي من Rate Card
    let basePriceIQD = 0;
    let basePriceUSD = 0;
    let subcategoryNameAr = '';

    try {
      // جلب من Rate Card (مبسط - يحتاج تطوير أكثر)
      const rateCardQuery = await adminDb
        .collection('rate_card')
        .where('deliverable', '==', subcategory)
        .where('vertical', '==', projectData.vertical || 'fashion')
        .limit(1)
        .get();

      if (!rateCardQuery.empty) {
        const rateData = rateCardQuery.docs[0].data();
        basePriceIQD = rateData.basePriceIQD || 20000; // افتراضي
        basePriceUSD = rateData.basePriceUSD || 15;
        subcategoryNameAr = rateData.nameAr || subcategory;
      } else {
        // أسعار افتراضية حسب النوع
        const defaultPrices = getDefaultPrices(subcategory);
        basePriceIQD = defaultPrices.iqd;
        basePriceUSD = defaultPrices.usd;
        subcategoryNameAr = defaultPrices.nameAr;
      }
    } catch (error) {
      console.warn('Failed to fetch rate card, using defaults:', error);
      const defaultPrices = getDefaultPrices(subcategory);
      basePriceIQD = defaultPrices.iqd;
      basePriceUSD = defaultPrices.usd;
      subcategoryNameAr = defaultPrices.nameAr;
    }

    // تطبيق معاملات المعالجة (Processing Modifiers)
    let processingMultiplier = 1;
    switch (processing) {
      case 'raw_only':
        processingMultiplier = 0.9; // -10%
        break;
      case 'raw_basic':
        processingMultiplier = 1.0; // 0%
        break;
      case 'full_retouch':
        processingMultiplier = 1.35; // +35%
        break;
    }

    let pricePerUnitIQD = basePriceIQD * processingMultiplier;
    let pricePerUnitUSD = basePriceUSD * processingMultiplier;

    // تطبيق Rush Surcharge (حسب الوثائق)
    if (isRush) {
      pricePerUnitIQD *= 1.35; // +35%
      pricePerUnitUSD *= 1.35;
    }

    // تطبيق رسوم الموقع (Location Zones)
    let locationFeeIQD = 0;
    const zoneMap: Record<string, number> = {
      baghdad_center: 5000,
      baghdad_outer: 10000,
      provinces_near: 25000,
      provinces_far: 50000
    };
    if (locationZone && zoneMap[locationZone]) {
      locationFeeIQD = zoneMap[locationZone];
    }

    // إضافة رسوم الموقع للسعر الإجمالي (ليس لكل وحدة)
    const totalIQD = (pricePerUnitIQD * quantity) + locationFeeIQD;
    const totalUSD = (pricePerUnitUSD * quantity) + (locationFeeIQD / 1300); // تحويل تقريبي

    // تقريب الأسعار (حسب الوثائق - أقرب 250 د.ع)
    const roundedTotalIQD = Math.round(totalIQD / 250) * 250;
    const roundedTotalUSD = Math.round(totalUSD * 100) / 100;

    // حساب الهامش (مبسط)
    const estimatedCostIQD = roundedTotalIQD * 0.55; // افتراض تكلفة 55%
    const margin = Math.round(((roundedTotalIQD - estimatedCostIQD) / roundedTotalIQD) * 100);

    // جلب اسم المُسند إليه
    let assignedToName = '';
    if (assignedTo) {
      try {
        const creatorDoc = await adminDb
          .collection('creators')
          .doc(assignedTo)
          .get();
        
        if (creatorDoc.exists) {
          const creatorData = creatorDoc.data();
          assignedToName = creatorData?.name || 'مبدع غير محدد';
        }
      } catch (error) {
        console.warn('Failed to fetch creator name:', error);
      }
    }

    // إنشاء التسليمة الجديدة
    const newDeliverable = {
      id: `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subcategory,
      subcategoryNameAr,
      quantity,
      processing,
      conditions: {
        isRush,
        locationZone: locationZone || null,
        speedBonus: false // سيتم تحديثه لاحقاً حسب الأداء
      },
      assignedTo: assignedTo || null,
      assignedToName,
      pricePerUnitIQD: Math.round(pricePerUnitIQD),
      pricePerUnitUSD: Math.round(pricePerUnitUSD * 100) / 100,
      totalIQD: roundedTotalIQD,
      totalUSD: roundedTotalUSD,
      margin,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email
    };

    // تحديث المشروع بالتسليمة الجديدة
    const currentDeliverables = projectData.deliverables || [];
    const updatedDeliverables = [...currentDeliverables, newDeliverable];

    // حساب الإجماليات الجديدة للمشروع
    let projectTotalIQD = 0;
    let projectTotalUSD = 0;
    let totalMarginSum = 0;

    updatedDeliverables.forEach((del: any) => {
      projectTotalIQD += del.totalIQD || 0;
      projectTotalUSD += del.totalUSD || 0;
      totalMarginSum += del.margin || 0;
    });

    const projectAverageMargin = updatedDeliverables.length > 0 
      ? Math.round(totalMarginSum / updatedDeliverables.length) 
      : 0;

    // تحديد حالة Guardrail
    let guardrailStatus: 'safe' | 'warning' | 'danger' = 'safe';
    if (projectAverageMargin < 45) {
      guardrailStatus = 'danger';
    } else if (projectAverageMargin < 50) {
      guardrailStatus = 'warning';
    }

    // تحديث المشروع في قاعدة البيانات
    // بناء فهرس معياري للمعيّنين على مستوى المشروع لتمكين استعلامات القيود لاحقاً
    const assignedMemberIds = Array.from(new Set(
      updatedDeliverables
        .map((del: any) => del.assignedTo)
        .filter((v: string | null | undefined): v is string => Boolean(v))
    ));
    await adminDb
      .collection('projects')
      .doc(projectId)
      .update({
        deliverables: updatedDeliverables,
        totalIQD: projectTotalIQD,
        totalUSD: projectTotalUSD,
        margin: projectAverageMargin,
        guardrailStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: session.user.email,
        assignedMemberIds
      });

    return NextResponse.json({
      success: true,
      deliverables: updatedDeliverables,
      totalIQD: projectTotalIQD,
      totalUSD: projectTotalUSD,
      margin: projectAverageMargin,
      guardrailStatus
    });

  } catch (error) {
    console.error('Add deliverable error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'خطأ في إضافة التسليمة' 
    }, { status: 500 });
  }
}

// دالة للحصول على الأسعار الافتراضية
function getDefaultPrices(subcategory: string) {
  const defaults: { [key: string]: { iqd: number; usd: number; nameAr: string } } = {
    'photo_flat_lay': { iqd: 19500, usd: 15, nameAr: 'صورة — فلات لي' },
    'photo_lifestyle': { iqd: 23400, usd: 18, nameAr: 'صورة — لايف ستايل' },
    'photo_on_model': { iqd: 23400, usd: 18, nameAr: 'صورة — أون مودل' },
    'photo_ghost': { iqd: 26000, usd: 20, nameAr: 'صورة — مانيكان شبح' },
    'reel_try_on': { iqd: 156000, usd: 120, nameAr: 'ريل — تراي أون' },
    'reel_bts': { iqd: 143000, usd: 110, nameAr: 'ريل — كواليس' },
    'design_carousel': { iqd: 58500, usd: 45, nameAr: 'تصميم — كاروسيل' },
    'design_story_cover': { iqd: 32500, usd: 25, nameAr: 'تصميم — غلاف ستوري' }
  };

  return defaults[subcategory] || { iqd: 20000, usd: 15, nameAr: subcategory };
}
