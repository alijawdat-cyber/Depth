import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { getActiveRateCard } from '@/lib/catalog/read';
import { calculateQuotePricing, validateQuoteInput } from '@/lib/pricing/engine';
import { getCurrentFXRate, calculateUSDPreview } from '@/lib/pricing/fx';
// import { QuoteLineInput } from '@/types/catalog';

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
  estimatedCostIQD: z.number().nonnegative().optional()
});

const QuotePreviewRequestSchema = z.object({
  lines: z.array(QuoteLineInputSchema).min(1, 'يجب تحديد سطر واحد على الأقل'),
  includeFX: z.boolean().optional().default(false)
});

/**
 * POST /api/pricing/quote/preview
 * 
 * معاينة تسعير العرض قبل الإرسال
 * Auth: admin أو client
 */
export async function POST(req: NextRequest) {
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

    // التحقق من الصلاحيات (admin أو client)
    const userRole = (session.user as { role?: string }).role || 'client';
    if (!['admin', 'client'].includes(userRole)) {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية admin أو client مطلوبة', requestId },
        { status: 403 }
      );
    }

    // قراءة وتحقق من البيانات
    const body = await req.json();
    const parseResult = QuotePreviewRequestSchema.safeParse(body);
    
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

    const { lines, includeFX } = parseResult.data;

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

    // إضافة تحويل العملة إذا طُلب
    let totalsWithUSD = pricingResult.totals;
    if (includeFX) {
      const fxRate = getCurrentFXRate(rateCard.fxPolicy);
      const usdTotal = calculateUSDPreview(pricingResult.totals.iqd, fxRate);
      totalsWithUSD = {
        ...pricingResult.totals,
        usd: usdTotal
      };
    }

    // تسجيل العملية للمراقبة
    console.log(`[quote-preview] ${requestId} - User: ${session.user.email}, Role: ${userRole}, Lines: ${lines.length}, Total: ${pricingResult.totals.iqd} IQD`);

    // إرجاع النتيجة
    return NextResponse.json({
      success: true,
      requestId,
      lines: pricingResult.lines,
      totals: totalsWithUSD,
      guardrails: pricingResult.guardrails,
      meta: {
        rateCardVersion: rateCard.versionId,
        calculatedAt: new Date().toISOString(),
        fxRate: includeFX ? getCurrentFXRate(rateCard.fxPolicy) : undefined
      }
    });

  } catch (error) {
    console.error(`[quote-preview] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في حساب التسعير', 
        details: ['خطأ داخلي في الخادم'],
        requestId 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pricing/quote/preview
 * 
 * معلومات حول API التسعير (للتوثيق)
 */
export async function GET() {
  return NextResponse.json({
    name: 'Quote Preview API',
    version: '1.0.0',
    description: 'API لمعاينة تسعير العروض قبل الإرسال',
    endpoints: {
      POST: {
        description: 'حساب تسعير العرض',
        auth: 'admin أو client',
        body: {
          lines: 'QuoteLineInput[]',
          includeFX: 'boolean (optional)'
        },
        response: {
          success: 'boolean',
          requestId: 'string',
          lines: 'QuotePreviewLineResult[]',
          totals: '{ iqd: number, usd?: number }',
          guardrails: '{ margin?: number, status?: string, warnings?: string[] }',
          meta: 'object'
        }
      }
    },
    examples: {
      request: {
        lines: [
          {
            subcategoryId: 'photo_flat_lay',
            qty: 20,
            vertical: 'fashion',
            processing: 'raw_basic',
            conditions: { rush: false, locationZone: 'baghdad_center' }
          }
        ],
        includeFX: true
      }
    }
  });
}
