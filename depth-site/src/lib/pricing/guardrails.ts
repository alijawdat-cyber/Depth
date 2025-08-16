import { RateCard } from '@/types/catalog';

export interface MarginCheck {
  margin: number;
  status: 'ok' | 'warn' | 'hard_stop';
  warnings: string[];
  recommendations?: string[];
}

export interface GuardrailsConfig {
  minMarginDefault: number; // 0.50 = 50%
  minMarginHardStop: number; // 0.45 = 45%
  overrideCapPercent: number; // 0.20 = 20%
}

/**
 * فحص الهوامش وإرجاع التحذيرات والتوصيات
 */
export function checkMargins(
  sellPriceIQD: number,
  estimatedCostIQD: number,
  config: GuardrailsConfig
): MarginCheck {
  if (estimatedCostIQD <= 0) {
    return {
      margin: 0,
      status: 'warn',
      warnings: ['لا توجد تكلفة مقدرة للمقارنة'],
      recommendations: ['يرجى إدخال التكلفة المقدرة لحساب الهامش بدقة']
    };
  }

  const margin = (sellPriceIQD - estimatedCostIQD) / sellPriceIQD;
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let status: 'ok' | 'warn' | 'hard_stop' = 'ok';

  // فحص الحد الأدنى القاسي
  if (margin < config.minMarginHardStop) {
    status = 'hard_stop';
    warnings.push(
      `الهامش ${(margin * 100).toFixed(1)}% أقل من الحد الأدنى القاسي ${(config.minMarginHardStop * 100)}%`
    );
    warnings.push('لا يمكن إرسال هذا العرض للعميل');
    
    const minRequiredPrice = estimatedCostIQD / (1 - config.minMarginHardStop);
    recommendations.push(`السعر المطلوب للوصول للحد الأدنى: ${Math.ceil(minRequiredPrice).toLocaleString()} د.ع`);
    recommendations.push('قم بمراجعة التكلفة المقدرة أو زيادة السعر');
  }
  
  // فحص الحد الافتراضي
  else if (margin < config.minMarginDefault) {
    status = 'warn';
    warnings.push(
      `الهامش ${(margin * 100).toFixed(1)}% أقل من المستهدف ${(config.minMarginDefault * 100)}%`
    );
    
    const targetPrice = estimatedCostIQD / (1 - config.minMarginDefault);
    recommendations.push(`السعر المستهدف للهامش المطلوب: ${Math.ceil(targetPrice).toLocaleString()} د.ع`);
    recommendations.push('يُنصح بمراجعة السعر قبل الإرسال');
  }
  
  // هامش جيد
  else {
    recommendations.push(`هامش ممتاز ${(margin * 100).toFixed(1)}% - جاهز للإرسال`);
  }

  return {
    margin,
    status,
    warnings,
    recommendations
  };
}

/**
 * فحص صحة Override
 */
export function validateOverride(
  basePrice: number,
  overridePrice: number,
  config: GuardrailsConfig
): { valid: boolean; warnings: string[]; maxAllowed: number } {
  const maxAllowed = basePrice * (1 + config.overrideCapPercent);
  const warnings: string[] = [];
  
  if (overridePrice > maxAllowed) {
    warnings.push(
      `السعر المخصص ${overridePrice.toLocaleString()} د.ع يتجاوز الحد الأقصى ${maxAllowed.toLocaleString()} د.ع`
    );
    warnings.push(`الحد الأقصى المسموح: +${(config.overrideCapPercent * 100)}% من السعر الأساسي`);
    return { valid: false, warnings, maxAllowed };
  }
  
  return { valid: true, warnings: [], maxAllowed };
}

/**
 * حساب الهامش المطلوب لسعر معين
 */
export function calculateRequiredMargin(
  targetMargin: number,
  estimatedCost: number
): number {
  if (targetMargin >= 1 || targetMargin <= 0) {
    throw new Error('الهامش المستهدف يجب أن يكون بين 0 و 1');
  }
  
  return estimatedCost / (1 - targetMargin);
}

/**
 * تحليل حساسية الهامش
 */
export function analyzeMarginSensitivity(
  sellPrice: number,
  estimatedCost: number
): {
  currentMargin: number;
  breakEvenPrice: number;
  marginAt10PercentDiscount: number;
  marginAt20PercentDiscount: number;
  costSensitivity: {
    at10PercentIncrease: number;
    at20PercentIncrease: number;
  };
} {
  const currentMargin = (sellPrice - estimatedCost) / sellPrice;
  const breakEvenPrice = estimatedCost;
  
  // تأثير الخصم على الهامش
  const priceWith10Discount = sellPrice * 0.9;
  const priceWith20Discount = sellPrice * 0.8;
  const marginAt10PercentDiscount = (priceWith10Discount - estimatedCost) / priceWith10Discount;
  const marginAt20PercentDiscount = (priceWith20Discount - estimatedCost) / priceWith20Discount;
  
  // تأثير زيادة التكلفة على الهامش
  const costWith10Increase = estimatedCost * 1.1;
  const costWith20Increase = estimatedCost * 1.2;
  const marginWithCost10Increase = (sellPrice - costWith10Increase) / sellPrice;
  const marginWithCost20Increase = (sellPrice - costWith20Increase) / sellPrice;
  
  return {
    currentMargin,
    breakEvenPrice,
    marginAt10PercentDiscount,
    marginAt20PercentDiscount,
    costSensitivity: {
      at10PercentIncrease: marginWithCost10Increase,
      at20PercentIncrease: marginWithCost20Increase
    }
  };
}

/**
 * إنشاء تقرير هامش مفصل
 */
export function generateMarginReport(
  lines: Array<{
    subcategoryId: string;
    qty: number;
    unitPrice: number;
    estimatedUnitCost?: number;
  }>,
  config: GuardrailsConfig
): {
  totalRevenue: number;
  totalCost: number;
  overallMargin: number;
  lineAnalysis: Array<{
    subcategoryId: string;
    revenue: number;
    cost: number;
    margin: number;
    status: 'ok' | 'warn' | 'hard_stop';
    warnings: string[];
  }>;
  summary: {
    linesAboveTarget: number;
    linesNeedAttention: number;
    linesBlocked: number;
    recommendations: string[];
  };
} {
  let totalRevenue = 0;
  let totalCost = 0;
  const lineAnalysis: Array<{
    subcategoryId: string;
    revenue: number;
    cost: number;
    margin: number;
    status: 'ok' | 'warn' | 'hard_stop';
    warnings: string[];
  }> = [];
  
  for (const line of lines) {
    const revenue = line.unitPrice * line.qty;
    const cost = (line.estimatedUnitCost || 0) * line.qty;
    
    totalRevenue += revenue;
    totalCost += cost;
    
    const marginCheck = checkMargins(revenue, cost, config);
    
    lineAnalysis.push({
      subcategoryId: line.subcategoryId,
      revenue,
      cost,
      margin: marginCheck.margin,
      status: marginCheck.status,
      warnings: marginCheck.warnings
    });
  }
  
  const overallMargin = totalCost > 0 ? (totalRevenue - totalCost) / totalRevenue : 0;
  
  // تحليل الخلاصة
  const linesAboveTarget = lineAnalysis.filter(l => l.status === 'ok').length;
  const linesNeedAttention = lineAnalysis.filter(l => l.status === 'warn').length;
  const linesBlocked = lineAnalysis.filter(l => l.status === 'hard_stop').length;
  
  const recommendations: string[] = [];
  
  if (linesBlocked > 0) {
    recommendations.push(`${linesBlocked} سطر محظور - يجب مراجعة الأسعار قبل الإرسال`);
  }
  
  if (linesNeedAttention > 0) {
    recommendations.push(`${linesNeedAttention} سطر يحتاج مراجعة - الهامش أقل من المستهدف`);
  }
  
  if (linesAboveTarget === lines.length) {
    recommendations.push('جميع الأسطر ضمن الهوامش المقبولة - جاهز للإرسال');
  }
  
  if (overallMargin < config.minMarginHardStop) {
    recommendations.push('الهامش الإجمالي أقل من الحد الأدنى - مراجعة شاملة مطلوبة');
  }
  
  return {
    totalRevenue,
    totalCost,
    overallMargin,
    lineAnalysis,
    summary: {
      linesAboveTarget,
      linesNeedAttention,
      linesBlocked,
      recommendations
    }
  };
}

/**
 * استخراج إعدادات Guardrails من Rate Card
 */
export function extractGuardrailsConfig(rateCard: RateCard): GuardrailsConfig {
  return {
    minMarginDefault: rateCard.guardrails?.minMarginDefault || 0.50,
    minMarginHardStop: rateCard.guardrails?.minMarginHardStop || 0.45,
    overrideCapPercent: rateCard.overrideCapPercent || 0.20
  };
}
