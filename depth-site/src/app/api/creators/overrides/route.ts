import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getActiveRateCard } from '@/lib/catalog/read';
import { calculateQuotePricing } from '@/lib/pricing/engine';

// GET /api/creators/overrides
// جلب طلبات Override الخاصة بالمبدع
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // 'pending', 'approved', 'rejected', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع للحصول على ID
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات المبدع' 
      }, { status: 404 });
    }

    const creatorId = creatorQuery.docs[0].id;

    // بناء الاستعلام لطلبات Override
    let overridesQuery = adminDb
      .collection('pricing_overrides')
      .where('creatorId', '==', creatorId);

    // فلترة حسب الحالة
    if (status && status !== 'all') {
      overridesQuery = overridesQuery.where('status', '==', status);
    }

    // ترتيب وتحديد العدد
    overridesQuery = overridesQuery
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const overridesSnapshot = await overridesQuery.get();
    const overrides = [];

    for (const doc of overridesSnapshot.docs) {
      const overrideData = doc.data();
      
      // جلب بيانات الـ deliverable من الكتالوغ
      let deliverableName = overrideData.deliverable;
      let verticalName = overrideData.vertical || 'عام';
      
      try {
        if (overrideData.deliverable) {
          const deliverableDoc = await adminDb
            .collection('catalog_subcategories')
            .doc(overrideData.deliverable)
            .get();
          
          if (deliverableDoc.exists) {
            const d = deliverableDoc.data() as Record<string, unknown>;
            deliverableName = (d?.nameAr as string) || deliverableName;
          }
        }

        if (overrideData.vertical) {
          const verticalDoc = await adminDb
            .collection('catalog_verticals')
            .doc(overrideData.vertical)
            .get();
          
          if (verticalDoc.exists) {
            const v = verticalDoc.data() as Record<string, unknown>;
            verticalName = (v?.nameAr as string) || verticalName;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch catalog data:', error);
      }

      overrides.push({
        id: doc.id,
        deliverable: overrideData.deliverable,
        deliverableName,
        vertical: overrideData.vertical,
        verticalName,
        processing: overrideData.processing,
        conditions: overrideData.conditions,
        priority: overrideData.priority,
        
        // الأسعار
        currentPriceIQD: overrideData.currentPriceIQD || null,
        requestedPriceIQD: overrideData.requestedPriceIQD,
        requestedPriceUSD: overrideData.requestedPriceUSD || null,
        
        // السبب والتفاصيل
        reason: overrideData.reason,
        justification: overrideData.justification,
        validUntil: overrideData.validUntil,
        
        // الحالة والمراجعة
        status: overrideData.status,
        adminNotes: overrideData.adminNotes || null,
        reviewedBy: overrideData.reviewedBy || null,
        reviewedAt: overrideData.reviewedAt || null,
        
        // التواريخ
        createdAt: overrideData.createdAt,
        updatedAt: overrideData.updatedAt,
        
        // معلومات إضافية
        usageCount: overrideData.usageCount || 0,
        maxUsage: overrideData.maxUsage || null,
        isActive: overrideData.status === 'approved' && 
                  (!overrideData.validUntil || new Date(overrideData.validUntil) > new Date())
      });
    }

    // إحصائيات سريعة
    const allOverridesSnapshot = await adminDb
      .collection('pricing_overrides')
      .where('creatorId', '==', creatorId)
      .get();

    const stats = {
      total: allOverridesSnapshot.size,
      pending: 0,
      approved: 0,
      rejected: 0,
      active: 0
    };

    allOverridesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      stats[data.status as keyof typeof stats]++;
      
      if (data.status === 'approved' && 
          (!data.validUntil || new Date(data.validUntil) > new Date())) {
        stats.active++;
      }
    });

    return NextResponse.json({
      success: true,
      overrides,
      stats
    });

  } catch (error) {
    console.error('[creators.overrides.get] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}

// POST /api/creators/overrides
// إنشاء طلب Override جديد
// في حال عدم وجود rate card سنعتمد افتراضات حذرة
const FALLBACK_OVERRIDE_CAP_PERCENTAGE = 20; // +20%

function validateOverrideRequest(currentPrice: number, requestedPrice: number, capPercent: number): { isValid: boolean; error?: string; } {
  const priceIncrease = ((requestedPrice - currentPrice) / Math.max(currentPrice, 1)) * 100;
  if (priceIncrease > capPercent) {
    return {
      isValid: false,
      error: `الزيادة المطلوبة (${priceIncrease.toFixed(1)}%) تتجاوز الحد الأعلى المسموح (${capPercent}%)`
    };
  }
  return { isValid: true };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const body = await req.json();
    const {
      deliverable,
      vertical,
      processing,
      conditions,
      priority,
      requestedPriceIQD,
      requestedPriceUSD,
      reason,
      justification,
      validUntil,
      maxUsage
    } = body;

    // التحقق من صحة البيانات
    if (!deliverable?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Deliverable مطلوب' 
      }, { status: 400 });
    }

    if (!requestedPriceIQD || requestedPriceIQD <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'السعر المطلوب بالدينار العراقي مطلوب وأكبر من صفر' 
      }, { status: 400 });
    }

    if (!reason?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'سبب طلب التعديل مطلوب' 
      }, { status: 400 });
    }

    // حساب السعر الحالي عبر محرك التسعير (qty=1)
    let currentPriceIQD = 0;
    let overrideCapPercent = FALLBACK_OVERRIDE_CAP_PERCENTAGE;
    try {
      const rateCard = await getActiveRateCard();
      if (rateCard) {
        overrideCapPercent = Math.round((rateCard.overrideCapPercent ?? (FALLBACK_OVERRIDE_CAP_PERCENTAGE / 100)) * 100);
        const pricing = calculateQuotePricing([
          {
            subcategoryId: deliverable,
            qty: 1,
            vertical: vertical || 'general',
            processing: (processing || 'full_retouch'),
            conditions: conditions && typeof conditions === 'object' ? conditions : undefined
          }
        ] as any, { rateCard, estimatedCosts: {} });
        currentPriceIQD = pricing.lines[0]?.unitPriceIQD || 0;
      }
    } catch (error) {
      console.warn('Failed to compute current price via engine:', error);
    }

    // التحقق من Override Cap (من الـ Rate Card إن وجد)
    const validation = validateOverrideRequest(currentPriceIQD, requestedPriceIQD, overrideCapPercent);
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false, 
        error: validation.error 
      }, { status: 400 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات المبدع' 
      }, { status: 404 });
    }

    const creatorId = creatorQuery.docs[0].id;
    const creatorData = creatorQuery.docs[0].data();

    // التحقق من وجود طلب مماثل قيد المراجعة
    const existingOverrideQuery = await adminDb
      .collection('pricing_overrides')
      .where('creatorId', '==', creatorId)
      .where('deliverable', '==', deliverable)
      .where('vertical', '==', vertical || null)
      .where('processing', '==', processing || 'full_retouch')
      .where('status', '==', 'pending')
      .limit(1)
      .get();

    if (!existingOverrideQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'يوجد طلب مماثل قيد المراجعة بالفعل' 
      }, { status: 400 });
    }

    // currentPriceIQD تم حسابه عبر المحرك أعلاه

    const now = new Date().toISOString();
    const overrideId = `override_${creatorId}_${Date.now()}`;

    // إنشاء طلب Override
    const overrideData = {
      id: overrideId,
      creatorId,
      creatorName: creatorData.fullName,
      creatorEmail: email,
      
      // تفاصيل الخدمة
      deliverable,
      vertical: vertical || null,
      processing: processing || 'full_retouch',
      conditions: conditions || 'studio',
      priority: priority || 'standard',
      
      // الأسعار
      currentPriceIQD,
      requestedPriceIQD,
      requestedPriceUSD: requestedPriceUSD || null,
      
      // السبب والتبرير
      reason: reason.trim(),
      justification: justification?.trim() || null,
      
      // صلاحية الطلب
      validUntil: validUntil || null,
      maxUsage: maxUsage || null,
      usageCount: 0,
      
      // الحالة
      status: 'pending',
      adminNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      
      // التواريخ
      createdAt: now,
      updatedAt: now
    };

    await adminDb.collection('pricing_overrides').doc(overrideId).set(overrideData);

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'creator_override_request_created',
      entityType: 'pricing_override',
      entityId: overrideId,
      userId: email,
      timestamp: now,
      details: {
        creatorName: creatorData.fullName,
        deliverable,
        vertical,
        currentPriceIQD,
        requestedPriceIQD,
        reason: reason.trim()
      }
    });

    // إشعار الأدمن بالطلب الجديد
    try {
      await adminDb.collection('notifications').add({
        type: 'creator_override_request',
        title: 'طلب تعديل سعر جديد',
        message: `${creatorData.fullName} طلب تعديل سعر لـ ${deliverable}`,
        targetRole: 'admin',
        entityType: 'pricing_override',
        entityId: overrideId,
        createdAt: now,
        read: false,
        priority: priority === 'rush' ? 'high' : 'normal'
      });
    } catch (error) {
      console.warn('[overrides] Failed to create notification:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب تعديل السعر بنجاح',
      overrideId,
      status: 'pending'
    }, { status: 201 });

  } catch (error) {
    console.error('[creators.overrides.post] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}
