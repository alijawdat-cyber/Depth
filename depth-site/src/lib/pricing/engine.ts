import { RateCard, QuoteLineInput, QuotePreviewLineResult, QuotePreviewBreakdown } from '@/types/catalog';

export interface PricingEngineOptions {
  rateCard: RateCard;
  estimatedCosts?: Record<string, number>; // subcategoryId -> estimated cost IQD
}

export interface PricingEngineResult {
  lines: QuotePreviewLineResult[];
  totals: { iqd: number; usd?: number };
  guardrails?: { margin?: number; status?: 'ok' | 'warn' | 'hard_stop'; warnings?: string[] };
}

/**
 * محرك التسعير الأساسي - يطبق المعادلة حسب docs/catalog/11-Pricing-Engine.md
 * 
 * ترتيب الحساب:
 * 1. BasePriceIQD (من Rate Card)
 * 2. VerticalModifier (٪)
 * 3. ProcessingModifier (٪ أو نطاق)
 * 4. Rush (٪)
 * 5. Location (مبلغ ثابت IQD)
 * 6. Creator Tier (٪)
 * 7. Override (ضمن cap%)
 * 8. Rounding (آخر خطوة)
 */
export function calculateQuotePricing(
  lines: QuoteLineInput[],
  options: PricingEngineOptions
): PricingEngineResult {
  const { rateCard, estimatedCosts = {} } = options;
  const results: QuotePreviewLineResult[] = [];
  
  for (const line of lines) {
    const result = calculateLinePricing(line, rateCard, estimatedCosts[line.subcategoryId]);
    results.push(result);
  }
  
  // حساب الإجماليات
  const totalIQD = results.reduce((sum, line) => sum + line.lineTotalIQD, 0);
  
  // حساب الهامش العام (إذا توفرت التكاليف المقدرة)
  const totalEstimatedCost = results.reduce((sum, line) => {
    const cost = estimatedCosts[line.subcategoryId] || 0;
    return sum + (cost * line.qty);
  }, 0);
  
  let guardrails;
  if (totalEstimatedCost > 0) {
    const margin = (totalIQD - totalEstimatedCost) / totalIQD;
    const minMarginDefault = rateCard.guardrails?.minMarginDefault || 0.50;
    const minMarginHardStop = rateCard.guardrails?.minMarginHardStop || 0.45;
    
    let status: 'ok' | 'warn' | 'hard_stop' = 'ok';
    const warnings: string[] = [];
    
    if (margin < minMarginHardStop) {
      status = 'hard_stop';
      warnings.push(`الهامش ${(margin * 100).toFixed(1)}% أقل من الحد الأدنى ${(minMarginHardStop * 100)}%`);
    } else if (margin < minMarginDefault) {
      status = 'warn';
      warnings.push(`الهامش ${(margin * 100).toFixed(1)}% أقل من المستهدف ${(minMarginDefault * 100)}%`);
    }
    
    guardrails = { margin, status, warnings };
  }
  
  return {
    lines: results,
    totals: { iqd: totalIQD },
    guardrails
  };
}

/**
 * حساب تسعير سطر واحد
 */
function calculateLinePricing(
  line: QuoteLineInput,
  rateCard: RateCard,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  estimatedCostIQD?: number
): QuotePreviewLineResult {
  const warnings: string[] = [];
  
  // 1. السعر الأساسي
  const basePrice = rateCard.basePricesIQD?.[line.subcategoryId];
  if (!basePrice) {
    warnings.push(`لا يوجد سعر أساسي للفئة ${line.subcategoryId}`);
    return createErrorResult(line, warnings);
  }
  
  let currentPrice = basePrice;
  const breakdown: QuotePreviewBreakdown = {
    base: basePrice,
    afterVertical: basePrice,
    afterProcessing: basePrice,
    afterRush: basePrice,
    final: basePrice,
    finalRounded: basePrice
  };
  
  // 2. معامل المحور (Vertical)
  const verticalModifier = rateCard.verticalModifiers?.[line.vertical] || 0;
  currentPrice = currentPrice * (1 + verticalModifier);
  breakdown.afterVertical = currentPrice;
  
  // 3. معامل المعالجة (Processing)
  const processingModifier = getProcessingModifier(line.processing, rateCard);
  currentPrice = currentPrice * (1 + processingModifier);
  breakdown.afterProcessing = currentPrice;
  
  // 4. Rush (إذا كان مفعل)
  if (line.conditions?.rush) {
    const rushPct = rateCard.modifiers?.rushPct || 0;
    currentPrice = currentPrice * (1 + rushPct);
  }
  breakdown.afterRush = currentPrice;
  
  // 5. Location (مبلغ ثابت)
  let locationAmount = 0;
  if (line.conditions?.locationZone) {
    locationAmount = rateCard.locationZonesIQD?.[line.conditions.locationZone] || 0;
    currentPrice += locationAmount;
  }
  if (locationAmount > 0) {
    breakdown['+location'] = locationAmount;
  }
  
  // 6. Creator Tier
  if (line.tier) {
    const tierModifier = rateCard.modifiers?.creatorTierPct?.[line.tier] || 0;
    currentPrice = currentPrice * (1 + tierModifier);
    breakdown.afterTier = currentPrice;
  }
  
  // 7. Override (إذا موجود وضمن الحدود)
  if (line.overrideIQD && line.overrideIQD > 0) {
    const overrideCapPercent = rateCard.overrideCapPercent || 0.20;
    const maxAllowedPrice = currentPrice * (1 + overrideCapPercent);
    
    if (line.overrideIQD <= maxAllowedPrice) {
      currentPrice = line.overrideIQD;
      breakdown.overrideApplied = line.overrideIQD;
    } else {
      warnings.push(`السعر المخصص ${line.overrideIQD} يتجاوز الحد الأقصى ${maxAllowedPrice.toFixed(0)}`);
    }
  }
  
  breakdown.final = currentPrice;
  
  // 8. التقريب (آخر خطوة)
  const roundingIQD = rateCard.roundingIQD || 250;
  const finalRounded = Math.round(currentPrice / roundingIQD) * roundingIQD;
  breakdown.finalRounded = finalRounded;
  
  // حساب الإجمالي
  const lineTotalIQD = finalRounded * line.qty;
  
  return {
    subcategoryId: line.subcategoryId,
    qty: line.qty,
    breakdown,
    unitPriceIQD: finalRounded,
    lineTotalIQD,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * حساب معامل المعالجة
 */
function getProcessingModifier(processing: string, rateCard: RateCard): number {
  const levels = rateCard.processingLevels;
  if (!levels) return 0;
  
  switch (processing) {
    case 'raw_only':
      return levels.raw_only || -0.10; // افتراضي -10%
      
    case 'raw_basic':
      return levels.raw_basic || 0.00; // افتراضي 0%
      
    case 'full_retouch':
      const retouchLevel = levels.full_retouch;
      if (Array.isArray(retouchLevel)) {
        // نطاق [min, max] - نأخذ المتوسط
        return (retouchLevel[0] + retouchLevel[1]) / 2;
      }
      return retouchLevel || 0.35; // افتراضي 35%
      
    default:
      return 0;
  }
}

/**
 * إنشاء نتيجة خطأ
 */
function createErrorResult(line: QuoteLineInput, warnings: string[]): QuotePreviewLineResult {
  return {
    subcategoryId: line.subcategoryId,
    qty: line.qty,
    breakdown: {
      base: 0,
      afterVertical: 0,
      afterProcessing: 0,
      afterRush: 0,
      final: 0,
      finalRounded: 0
    },
    unitPriceIQD: 0,
    lineTotalIQD: 0,
    warnings
  };
}

/**
 * تحويل العملة (للعرض فقط - لا يؤثر على الحسابات)
 */
export function convertToUSD(iqd: number, fxRate: number = 1300): number {
  return Math.round((iqd / fxRate) * 100) / 100; // تقريب لأقرب سنت
}

/**
 * فحص صحة المدخلات
 */
export function validateQuoteInput(lines: QuoteLineInput[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!lines || lines.length === 0) {
    errors.push('يجب تحديد سطر واحد على الأقل');
    return { valid: false, errors };
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prefix = `السطر ${i + 1}:`;
    
    if (!line.subcategoryId) {
      errors.push(`${prefix} معرف الفئة الفرعية مطلوب`);
    }
    
    if (!line.qty || line.qty <= 0) {
      errors.push(`${prefix} الكمية يجب أن تكون أكبر من صفر`);
    }
    
    if (!line.vertical) {
      errors.push(`${prefix} المحور مطلوب`);
    }
    
    if (!line.processing) {
      errors.push(`${prefix} نوع المعالجة مطلوب`);
    }
    
    if (line.overrideIQD && line.overrideIQD < 0) {
      errors.push(`${prefix} السعر المخصص لا يمكن أن يكون سالبًا`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
