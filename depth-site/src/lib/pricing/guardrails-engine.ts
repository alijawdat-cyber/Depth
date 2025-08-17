// محرك الحواجز والهوامش - متوافق مع docs/catalog/06-Rate-Card-Strategy.md
// الغرض: ضمان الربحية وحماية الأسعار من التلاعب

export interface GuardrailsConfig {
  profitMargins: {
    minimum: number;      // 35% minimum
    standard: number;     // 50% standard
    premium: number;      // 65% premium
    luxury: number;       // 80% luxury
  };
  discountLimits: {
    maxDiscountPercent: number;
    requiresApproval: number;
    emergencyDiscount: number;
  };
  priceFloors: {
    [category: string]: {
      [subcategory: string]: {
        [processing: string]: number;
      };
    };
  };
}

export interface PricingValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  finalMargin: number;
  riskScore: number;
}

export const DEFAULT_GUARDRAILS: GuardrailsConfig = {
  profitMargins: {
    minimum: 0.45,    // 45% (Hard Stop)
    standard: 0.50,   // 50% (Target)
    premium: 0.65,    // 65%
    luxury: 0.80      // 80%
  },
  discountLimits: {
    maxDiscountPercent: 0.10,      // 10% (عقود طويلة/مجمّع)
    requiresApproval: 0.05,        // 5% (تخفيض يتطلب موافقة)
    emergencyDiscount: 0.30        // 30%
  },
  priceFloors: {
    'photography': {
      'product': {
        'basic': 15000,
        'enhanced': 25000,
        'premium': 35000
      },
      'portrait': {
        'basic': 20000,
        'enhanced': 30000,
        'premium': 45000
      }
    },
    'videography': {
      'product': {
        'basic': 50000,
        'enhanced': 75000,
        'premium': 100000
      }
    },
    'design': {
      'logo': {
        'basic': 25000,
        'enhanced': 50000,
        'premium': 100000
      }
    }
  }
};

export class GuardrailsEngine {
  private config: GuardrailsConfig;

  constructor(config: GuardrailsConfig = DEFAULT_GUARDRAILS) {
    this.config = config;
  }

  validateQuote(input: {
    items: Array<{
      category: string;
      subcategory: string;
      processing: string;
      quantity: number;
      unitPrice: number;
    }>;
    discount: number;
    clientTier: string;
  }): PricingValidationResult {
    const result: PricingValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      finalMargin: 0,
      riskScore: 0
    };

    // Validate discount limits
    if (input.discount > this.config.discountLimits.maxDiscountPercent) {
      result.errors.push(`التخفيض ${(input.discount * 100).toFixed(1)}% يتجاوز الحد الأقصى المسموح`);
      result.isValid = false;
    }

    if (input.discount > this.config.discountLimits.requiresApproval) {
      result.warnings.push(`التخفيض ${(input.discount * 100).toFixed(1)}% يتطلب موافقة الإدارة`);
    }

    // Validate price floors
    for (const item of input.items) {
      const priceFloor = this.config.priceFloors[item.category]?.[item.subcategory]?.[item.processing];
      if (priceFloor && item.unitPrice < priceFloor) {
        result.errors.push(`سعر ${item.subcategory} أقل من الحد الأدنى المسموح (${priceFloor.toLocaleString()} د.ع)`);
        result.isValid = false;
      }
    }

    // Calculate final margin
    result.finalMargin = this.calculateFinalMargin(input);
    
    if (result.finalMargin < this.config.profitMargins.minimum) {
      result.errors.push(`هامش الربح ${(result.finalMargin * 100).toFixed(1)}% أقل من الحد الأدنى المطلوب`);
      result.isValid = false;
    }

    return result;
  }

  private calculateFinalMargin(input: { discount: number }): number {
    const baseMargin = this.config.profitMargins.standard;
    const discountImpact = input.discount;
    return Math.max(0, baseMargin - discountImpact);
  }

  getConfig(): GuardrailsConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<GuardrailsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // دالة للتحقق من صحة طلب التعديل
  validateOverride(
    currentPrice: number,
    requestedPrice: number,
    guardrails: GuardrailsConfig
  ): PricingValidationResult {
    const result: PricingValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      finalMargin: 0,
      riskScore: 0
    };

    const discountPercent = ((currentPrice - requestedPrice) / currentPrice) * 100;
    
    // التحقق من حدود التخفيض
    if (discountPercent > guardrails.discountLimits.maxDiscountPercent * 100) {
      result.errors.push(`التخفيض ${discountPercent.toFixed(1)}% يتجاوز الحد الأقصى المسموح`);
      result.isValid = false;
    }

    if (discountPercent > guardrails.discountLimits.requiresApproval * 100) {
      result.warnings.push(`التخفيض ${discountPercent.toFixed(1)}% يتطلب موافقة الإدارة`);
    }

    // حساب الهامش المتوقع
    const marginEstimate = (requestedPrice - (currentPrice * 0.7)) / requestedPrice; // تقدير تقريبي
    result.finalMargin = marginEstimate;

    if (marginEstimate < guardrails.profitMargins.minimum) {
      result.errors.push(`الهامش المتوقع ${(marginEstimate * 100).toFixed(1)}% أقل من الحد الأدنى`);
      result.isValid = false;
    }

    return result;
  }
}

export const guardrailsEngine = new GuardrailsEngine();

// دالة مساعدة لاستخراج إعدادات الحواجز من Rate Card
export function extractGuardrailsConfig(rateCard: any): GuardrailsConfig {
  if (!rateCard) return DEFAULT_GUARDRAILS;
  
  // تحويل من RateCardGuardrails إلى GuardrailsConfig
  if (rateCard.guardrails) {
    return {
      profitMargins: {
        minimum: rateCard.guardrails.minMarginHardStop || DEFAULT_GUARDRAILS.profitMargins.minimum,
        standard: rateCard.guardrails.minMarginDefault || DEFAULT_GUARDRAILS.profitMargins.standard,
        premium: DEFAULT_GUARDRAILS.profitMargins.premium,
        luxury: DEFAULT_GUARDRAILS.profitMargins.luxury
      },
      discountLimits: DEFAULT_GUARDRAILS.discountLimits,
      priceFloors: DEFAULT_GUARDRAILS.priceFloors
    };
  }
  
  return DEFAULT_GUARDRAILS;
}

// دالة مساعدة للتحقق من صحة التعديل
export function validateOverride(
  currentPrice: number,
  requestedPrice: number,
  guardrails: GuardrailsConfig
): PricingValidationResult {
  return guardrailsEngine.validateOverride(currentPrice, requestedPrice, guardrails);
}
