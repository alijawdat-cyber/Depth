import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getActiveRateCard } from '@/lib/catalog/read';
import { calculateQuotePricing } from '@/lib/pricing/engine';
import { getCurrentFXRate, calculateUSDPreview } from '@/lib/pricing/fx';

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
      assignedTo,
      estimatedCostIQD
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

    // جلب Rate Card النشط كمصدر الحقيقة الوحيد
    const rateCard = await getActiveRateCard();
    if (!rateCard) {
      return NextResponse.json({ 
        success: false, 
        error: 'لا يوجد جدول أسعار نشط' 
      }, { status: 500 });
    }

    // بناء سطر تسعير موحّد واستخدام محرك التسعير
    const lineInput = [{
      subcategoryId: subcategory,
      qty: quantity,
      vertical: projectData.vertical || 'fashion',
      processing,
      conditions: {
        rush: Boolean(isRush),
        locationZone: locationZone || undefined
      }
    }];

    // تقدير التكلفة لكل وحدة (اختياري) — إذا لم تُمرر، نعتمد 55% كافتراض مرحلي
    const unitEstimatedCost = typeof estimatedCostIQD === 'number' && estimatedCostIQD >= 0
      ? estimatedCostIQD
      : undefined;
    const estimatedCosts = unitEstimatedCost !== undefined
      ? { [subcategory]: unitEstimatedCost }
      : { [subcategory]: 0.55 * (rateCard.basePricesIQD?.[subcategory] || 0) };

    const pricing = calculateQuotePricing(lineInput as any, { rateCard, estimatedCosts });
    const result = pricing.lines[0];

    // اسم عربي للفئة الفرعية (إن وُجد في المشروع الحالي)
    let subcategoryNameAr = subcategory;
    try {
      const subSnap = await adminDb.collection('catalog_subcategories').doc(subcategory).get();
      if (subSnap.exists) {
        subcategoryNameAr = (subSnap.data()?.nameAr as string) || subcategory;
      }
    } catch {}

    // FX حسب سياسة الريت كارد
    const fxRate = getCurrentFXRate(rateCard.fxPolicy);
    const totalUSD = calculateUSDPreview(result.lineTotalIQD, fxRate);

    // الهامش وفق الحواجز (إن توفر تقدير التكلفة)
    const lineMarginPct = pricing.guardrails?.margin !== undefined
      ? Math.round((pricing.guardrails.margin || 0) * 100)
      : undefined;

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

    // إنشاء التسليمة الجديدة (مستندة إلى محرك التسعير)
    const newDeliverable = {
      id: `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subcategory,
      subcategoryNameAr,
      quantity,
      processing,
      conditions: {
        isRush,
        locationZone: locationZone || null,
        speedBonus: false
      },
      assignedTo: assignedTo || null,
      assignedToName,
      pricePerUnitIQD: result.unitPriceIQD,
      pricePerUnitUSD: Math.round((result.unitPriceIQD / fxRate) * 100) / 100,
      totalIQD: result.lineTotalIQD,
      totalUSD: totalUSD,
      // حفظ تكلفة تقديرية لكل وحدة لكي نحسب الهامش على مستوى المشروع لاحقاً
      unitEstimatedCostIQD: estimatedCosts[subcategory] || 0,
      margin: lineMarginPct,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email
    } as Record<string, unknown>;

    // تحديث المشروع بالتسليمة الجديدة
    const currentDeliverables = projectData.deliverables || [];
    const updatedDeliverables = [...currentDeliverables, newDeliverable];

    // حساب الإجماليات الجديدة للمشروع + الهامش وفق الحواجز
    let projectTotalIQD = 0;
    let projectTotalUSD = 0;
    let projectEstimatedCostTotalIQD = 0;

    updatedDeliverables.forEach((del: any) => {
      const qty = Number(del.quantity) || 0;
      const unitCost = Number(del.unitEstimatedCostIQD) || 0;
      projectTotalIQD += del.totalIQD || 0;
      projectTotalUSD += del.totalUSD || 0;
      projectEstimatedCostTotalIQD += unitCost * qty;
    });

    let projectMarginPct: number | null = null;
    if (projectTotalIQD > 0 && projectEstimatedCostTotalIQD > 0) {
      projectMarginPct = Math.round(((projectTotalIQD - projectEstimatedCostTotalIQD) / projectTotalIQD) * 100);
    }

    // تحديد حالة Guardrail بناءً على Rate Card
    const minHard = Math.round((rateCard.guardrails?.minMarginHardStop ?? 0.45) * 100);
    const minDefault = Math.round((rateCard.guardrails?.minMarginDefault ?? 0.50) * 100);
    let guardrailStatus: 'safe' | 'warning' | 'danger' = 'safe';
    if (projectMarginPct !== null) {
      if (projectMarginPct < minHard) guardrailStatus = 'danger';
      else if (projectMarginPct < minDefault) guardrailStatus = 'warning';
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
        estimatedCostTotalIQD: projectEstimatedCostTotalIQD,
        margin: projectMarginPct,
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
      estimatedCostTotalIQD: projectEstimatedCostTotalIQD,
      margin: projectMarginPct,
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
