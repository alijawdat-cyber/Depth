import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { getActiveRateCard } from '@/lib/catalog/read';
import { calculateQuotePricing, validateQuoteInput } from '@/lib/pricing/engine';
import { getCurrentFXRate, createFXSnapshot } from '@/lib/pricing/fx';
import { Quote, QuoteLine } from '@/types/catalog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { QuoteCreateRequest, QuoteUpdateRequest } from '@/types/catalog';

// Schema للتحقق من صحة المدخلات
const QuoteLineInputSchema = z.object({
  subcategoryId: z.string().min(1, 'معرف الفئة الفرعية مطلوب'),
  qty: z.number().int().positive('الكمية يجب أن تكون عدد صحيح موجب'),
  vertical: z.string().min(1, 'المحور مطلوب'),
  processing: z.enum(['raw_only', 'raw_basic', 'full_retouch']),
  conditions: z.object({
    rush: z.boolean().optional(),
    locationZone: z.string().optional()
  }).optional(),
  tier: z.enum(['T1', 'T2', 'T3']).optional(),
  overrideIQD: z.number().nonnegative().optional(),
  estimatedCostIQD: z.number().nonnegative().optional(),
  notes: z.string().optional()
});

const QuoteCreateSchema = z.object({
  clientEmail: z.string().email('بريد إلكتروني غير صحيح'),
  projectId: z.string().optional(),
  lines: z.array(QuoteLineInputSchema).min(1, 'يجب تحديد سطر واحد على الأقل'),
  notes: z.string().optional()
});

const QuoteUpdateSchema = z.object({
  id: z.string().min(1, 'معرف العرض مطلوب'),
  action: z.enum(['send', 'approve', 'reject']),
  reason: z.string().optional()
});

/**
 * POST /api/pricing/quote
 * 
 * إنشاء عرض سعر جديد (draft)
 * Auth: admin only
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // التحقق من المصادقة والصلاحيات
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح - تسجيل الدخول مطلوب', requestId },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role || 'client';
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية admin مطلوبة', requestId },
        { status: 403 }
      );
    }

    // قراءة وتحقق من البيانات
    const body = await req.json();
    const parseResult = QuoteCreateSchema.safeParse(body);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة', 
          details: errors,
          requestId 
        },
        { status: 400 }
      );
    }

    const { clientEmail, projectId, lines, notes } = parseResult.data;

    // التحقق من صحة المدخلات
    const validation = validateQuoteInput(lines);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'بيانات العرض غير صحيحة', 
          details: validation.errors,
          requestId 
        },
        { status: 400 }
      );
    }

    // الحصول على Rate Card النشط
    const rateCard = await getActiveRateCard();
    if (!rateCard) {
      return NextResponse.json(
        { 
          error: 'لا يوجد جدول أسعار نشط', 
          details: ['يجب تفعيل جدول أسعار من لوحة الإدارة'],
          requestId 
        },
        { status: 500 }
      );
    }

    // استخراج التكاليف المقدرة من المدخلات
    const estimatedCosts: Record<string, number> = {};
    for (const line of lines) {
      if (line.estimatedCostIQD && line.estimatedCostIQD > 0) {
        estimatedCosts[line.subcategoryId] = line.estimatedCostIQD;
      }
    }

    // حساب التسعير
    const pricingResult = calculateQuotePricing(lines, {
      rateCard,
      estimatedCosts
    });

    // تحويل إلى QuoteLine format
    const quoteLines: QuoteLine[] = lines.map((inputLine, index) => {
      const resultLine = pricingResult.lines[index];
      return {
        subcategoryId: inputLine.subcategoryId,
        qty: inputLine.qty,
        vertical: inputLine.vertical,
        processing: inputLine.processing,
        conditions: inputLine.conditions,
        tier: inputLine.tier,
        unitPriceIQD: resultLine.unitPriceIQD,
        calcBreakdown: resultLine.breakdown,
        notes: inputLine.notes,
        estimatedCostIQD: inputLine.estimatedCostIQD,
        overrideIQD: inputLine.overrideIQD
      };
    });

    // إضافة تحويل العملة
    const fxRate = getCurrentFXRate(rateCard.fxPolicy);
    const totalUSD = Math.round((pricingResult.totals.iqd / fxRate) * 100) / 100;

    // إنشاء Quote object
    const quote: Quote = {
      clientEmail,
      projectId: projectId || null,
      lines: quoteLines,
      totals: {
        iqd: pricingResult.totals.iqd,
        usd: totalUSD
      },
      guardrails: pricingResult.guardrails,
      status: 'draft',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.email
    };

    // حفظ في Firestore
    const docRef = await adminDb.collection('quotes').add(quote);
    const savedQuote = { ...quote, id: docRef.id };

    // تسجيل العملية للمراقبة
    console.log(`[quote-create] ${requestId} - Created by: ${session.user.email}, Client: ${clientEmail}, Lines: ${lines.length}, Total: ${pricingResult.totals.iqd} IQD`);

    return NextResponse.json({
      success: true,
      requestId,
      quote: savedQuote
    });

  } catch (error) {
    console.error(`[quote-create] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في إنشاء العرض', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pricing/quote
 * 
 * قائمة العروض مع فلترة
 * Auth: admin (يرى الكل) أو client (يرى الخاص به)
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح - تسجيل الدخول مطلوب', requestId },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role || 'client';
    const { searchParams } = new URL(req.url);
    
    // استخراج parameters
    const status = searchParams.get('status');
    const clientEmail = searchParams.get('clientEmail');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // بناء query
    let query = adminDb.collection('quotes').orderBy('createdAt', 'desc');

    // فلترة حسب الصلاحيات
    if (userRole === 'client') {
      // العميل يرى عروضه فقط
      query = query.where('clientEmail', '==', session.user.email);
    } else if (userRole === 'admin' && clientEmail) {
      // الأدمن يمكنه فلترة حسب عميل معين
      query = query.where('clientEmail', '==', clientEmail);
    }

    // فلترة حسب الحالة
    if (status && ['draft', 'sent', 'approved', 'rejected'].includes(status)) {
      query = query.where('status', '==', status);
    }

    // تطبيق pagination
    if (offset > 0) {
      const offsetSnapshot = await query.limit(offset).get();
      if (!offsetSnapshot.empty) {
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(limit);

    // تنفيذ Query
    const snapshot = await query.get();
    const quotes: Quote[] = [];

    snapshot.forEach(doc => {
      quotes.push({
        id: doc.id,
        ...doc.data()
      } as Quote);
    });

    // إحصائيات إضافية للأدمن
    let stats;
    if (userRole === 'admin') {
      const statsQuery = adminDb.collection('quotes');
      const [draftCount, sentCount, approvedCount, rejectedCount] = await Promise.all([
        statsQuery.where('status', '==', 'draft').get().then(snap => snap.size),
        statsQuery.where('status', '==', 'sent').get().then(snap => snap.size),
        statsQuery.where('status', '==', 'approved').get().then(snap => snap.size),
        statsQuery.where('status', '==', 'rejected').get().then(snap => snap.size)
      ]);

      stats = {
        draft: draftCount,
        sent: sentCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: draftCount + sentCount + approvedCount + rejectedCount
      };
    }

    return NextResponse.json({
      success: true,
      requestId,
      quotes,
      pagination: {
        limit,
        offset,
        hasMore: quotes.length === limit
      },
      stats
    });

  } catch (error) {
    console.error(`[quote-list] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في جلب العروض', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pricing/quote
 * 
 * تحديث حالة العرض (send/approve/reject)
 * Auth: admin أو client (للموافقة/الرفض فقط)
 */
export async function PUT(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح - تسجيل الدخول مطلوب', requestId },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role || 'client';

    // قراءة وتحقق من البيانات
    const body = await req.json();
    const parseResult = QuoteUpdateSchema.safeParse(body);
    
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة', 
          details: errors,
          requestId 
        },
        { status: 400 }
      );
    }

    const { id, action, reason } = parseResult.data;

    // جلب العرض الحالي
    const quoteDoc = await adminDb.collection('quotes').doc(id).get();
    if (!quoteDoc.exists) {
      return NextResponse.json(
        { error: 'العرض غير موجود', requestId },
        { status: 404 }
      );
    }

    const quote = { id: quoteDoc.id, ...quoteDoc.data() } as Quote;

    // فحص الصلاحيات
    if (userRole === 'client') {
      // العميل يمكنه فقط الموافقة أو الرفض على عروضه
      if (quote.clientEmail !== session.user.email) {
        return NextResponse.json(
          { error: 'غير مصرح - هذا العرض ليس لك', requestId },
          { status: 403 }
        );
      }
      
      if (!['approve', 'reject'].includes(action)) {
        return NextResponse.json(
          { error: 'غير مصرح - يمكنك فقط الموافقة أو الرفض', requestId },
          { status: 403 }
        );
      }

      if (quote.status !== 'sent') {
        return NextResponse.json(
          { error: 'لا يمكن تعديل هذا العرض في حالته الحالية', requestId },
          { status: 400 }
        );
      }
    } else if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية admin أو client مطلوبة', requestId },
        { status: 403 }
      );
    }

    // تطبيق التحديث
    const updateData: Partial<Quote> = {
      updatedAt: new Date().toISOString()
    };

    if (action === 'send') {
      if (quote.status !== 'draft') {
        return NextResponse.json(
          { error: 'يمكن إرسال العروض في حالة المسودة فقط', requestId },
          { status: 400 }
        );
      }
      updateData.status = 'sent';
    } 
    else if (action === 'approve') {
      if (quote.status !== 'sent') {
        return NextResponse.json(
          { error: 'يمكن الموافقة على العروض المرسلة فقط', requestId },
          { status: 400 }
        );
      }
      
      // إنشاء snapshot عند الموافقة
      const rateCard = await getActiveRateCard();
      if (rateCard) {
        const fxSnapshot = createFXSnapshot(
          quote.totals.iqd,
          getCurrentFXRate(rateCard.fxPolicy),
          'approval'
        );
        
        updateData.snapshot = {
          rateCardVersion: rateCard.versionId,
          fx: {
            rate: fxSnapshot.rate,
            date: fxSnapshot.date,
            source: fxSnapshot.source
          }
        };
      }
      
      updateData.status = 'approved';
    } 
    else if (action === 'reject') {
      if (quote.status !== 'sent') {
        return NextResponse.json(
          { error: 'يمكن رفض العروض المرسلة فقط', requestId },
          { status: 400 }
        );
      }
      updateData.status = 'rejected';
      if (reason) {
        updateData.notes = (quote.notes || '') + `\n[رفض]: ${reason}`;
      }
    }

    // تحديث في Firestore
    await adminDb.collection('quotes').doc(id).update(updateData);

    const updatedQuote = { ...quote, ...updateData };

    // تسجيل العملية للمراقبة
    console.log(`[quote-update] ${requestId} - Action: ${action}, Quote: ${id}, User: ${session.user.email}, Role: ${userRole}`);

    return NextResponse.json({
      success: true,
      requestId,
      quote: updatedQuote,
      action
    });

  } catch (error) {
    console.error(`[quote-update] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في تحديث العرض', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}
