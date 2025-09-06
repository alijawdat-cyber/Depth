// ================================
// حسابات التسعير الموحدة (SSOT)
// - تعمل على مستوى المهمة والمشروع وفق متطلبات V2.1
// - تعتمد على أنواع التسعير والمشاريع الموحّدة
// ================================

// استيراد الأنواع الأساسية للتسعير  // مفاتيح وعوامل وأنواع النتائج
import type {
  PricingModifier, // تعريف المعدّل
  PricingModifierCategory, // فئة المعدّل
  ProcessingLevel, // مستوى المعالجة
  ExperienceLevel, // مستوى الخبرة
  EquipmentTier, // فئة المعدات
  RushKey, // مفتاح الاستعجال
  LocationKey, // مفتاح الموقع
  OwnershipKey, // مفتاح الملكية
  PricingCalculation, // نتيجة الحساب
  PricingFactorsSnapshot, // لقطة العوامل
} from '../types/pricing';

// استيراد نوع إجماليات المشروع  // مجاميع مشتقة من المهام
import type { ProjectTotals } from '../types/projects';

// تقريب للأقرب 500 دينار  // قاعدة التقريب المعتمدة V2.1
export const roundToNearest500 = (n: number): number => {
  // حراسة القيم غير الصالحة  // منع NaN/Infinity
  if (!Number.isFinite(n)) return 0;
  // تطبيق التقريب إلى 500  // ضرب وقسمة لتطبيق القاعدة
  return Math.round(n / 500) * 500;
};

// جلب قيمة معدّل حسب الفئة والمفتاح  // يرجع 1 للمضاعِفات و0 للإضافات عند عدم العثور
export const getModifierByKey = (
  modifiers: PricingModifier[], // قائمة المعدّلات المتاحة
  category: PricingModifierCategory, // فئة المعدّل المطلوبة
  key: string // المفتاح المطلوب
): number => {
  // البحث عن المعدّل المطابق  // باستخدام الفئة والمفتاح
  const m = modifiers.find((x) => x.category === category && x.key === key && x.isActive);
  // إرجاع القيمة أو الافتراض  // 1 للمضاعِف و0 للإضافة إذا لم يوجد
  if (!m) return category === 'location' ? 0 : 1.0;
  return m.value;
};

// الحصول على إضافة الموقع  // يعيد قيمة addition أو 0 إن لم توجد
export const getLocationAddition = (
  modifiers: PricingModifier[], // قائمة المعدّلات
  location: LocationKey // مفتاح الموقع
): number => {
  // الحصول على قيمة الموقع  // category='location'
  const add = getModifierByKey(modifiers, 'location', location);
  // تأكيد أنها إضافة موجبة/صفر  // منع القيم السالبة غير المنطقية
  return Math.max(0, add);
};

// مدخلات تسعير مهمة  // ما يلزم لحساب سعر مهمة واحدة
export interface TaskPricingInput {
  basePrice: number; // السعر الأساسي للوحدة (من الفئة الفرعية)
  quantity: number; // الكمية المطلوبة
  processing: ProcessingLevel; // مفتاح المعالجة
  experience: ExperienceLevel; // مفتاح الخبرة
  equipment: EquipmentTier; // مفتاح المعدات
  rush: RushKey; // مفتاح الاستعجال
  ownership: OwnershipKey; // مفتاح الملكية
  location: LocationKey; // مفتاح الموقع
  profileMultiplier?: number; // معامل ملف المبدع (إن وجد)
}

// ناتج تسعير مهمة  // يتضمن لقطة العوامل والنتيجة المالية
export interface TaskPricingOutput {
  basePrice: number; // السعر الأساسي للوحدة
  factors: PricingFactorsSnapshot; // لقطة العوامل المستخدمة
  pricing: Pick<
    PricingCalculation,
    'unitCreatorPrice' | 'totalCreatorPrice' | 'agencyMarginPercent' | 'agencyMarginAmount' | 'clientPrice'
  >; // نتيجة الحساب
}

// سياسة الحساب: ضبط إضافة الموقع والتقريب
export interface PricingPolicyOptions {
  /**
   * true: إضافة الموقع تُطبّق مرة واحدة على مستوى المهمة (افتراضي SSOT)
   * false: توزيع الإضافة على مستوى الوحدة (سلوك قديم)
   */
  applyLocationPerTask?: boolean;
  /**
   * final: التقريب يحدث في النهاية فقط (افتراضي)
   * line+final: تقريب لسعر الوحدة ثم تقريب نهائي
   */
  roundingMode?: 'final' | 'line+final';
}

// حساب سعر مهمة واحدة  // يطبق جميع العوامل والتقريب والهامش
export const calculateTaskPrice = (
  input: TaskPricingInput, // مدخلات المهمة
  ctx: { modifiers: PricingModifier[]; marginPercent: number; policy?: PricingPolicyOptions } // سياق: معدّلات + نسبة الهامش + سياسة
): TaskPricingOutput => {
  // ضمان الكمية الدنيا  // منع القسمة على صفر
  const qty = Math.max(1, input.quantity);
  // تعيين معامل الملف الشخصي  // افتراضي 1.0 إن لم يحدد
  const profile = input.profileMultiplier ?? 1.0;

  // جلب معاملات الضرب  // معالجة/خبرة/معدات/استعجال/ملكية
  const processingMod = getModifierByKey(ctx.modifiers, 'processing', input.processing);
  const experienceMod = getModifierByKey(ctx.modifiers, 'experience', input.experience);
  const equipmentMod = getModifierByKey(ctx.modifiers, 'equipment', input.equipment);
  const rushMod = getModifierByKey(ctx.modifiers, 'rush', input.rush);
  const ownershipMod = getModifierByKey(ctx.modifiers, 'ownership', input.ownership);
  // إضافة الموقع  // سياسة: per-task افتراضياً
  const locationAddition = getLocationAddition(ctx.modifiers, input.location);
  const applyPerTask = ctx.policy?.applyLocationPerTask ?? true;
  const roundingMode = ctx.policy?.roundingMode ?? 'final';

  // حساب سعر الوحدة الخام (بدون إضافة الموقع عند applyPerTask)
  const rawUnitBase =
    input.basePrice *
    profile *
    processingMod *
    experienceMod *
    equipmentMod *
    rushMod *
    ownershipMod;

  // إن كانت الإضافة per-unit نوزعها على الوحدات، وإلا نضيفها على إجمالي المهمة لاحقاً
  const rawUnit = applyPerTask ? rawUnitBase : rawUnitBase + (locationAddition / qty);

  // التقريب لسعر الوحدة حسب السياسة
  const unitUnrounded = rawUnit;
  const unitCreatorPrice = (roundingMode === 'line+final') ? roundToNearest500(unitUnrounded) : unitUnrounded;
  let totalCreatorPrice = unitCreatorPrice * qty;
  if (applyPerTask) {
    totalCreatorPrice += locationAddition; // إضافة الموقع مرة واحدة على مستوى المهمة
  }
  if (roundingMode === 'final') {
    totalCreatorPrice = roundToNearest500(totalCreatorPrice); // تقريب نهائي فقط
  }

  // حساب هامش الوكالة  // باستخدام النسبة من الإعدادات
  const agencyMarginAmount = roundToNearest500(totalCreatorPrice * ctx.marginPercent);
  // حساب سعر العميل النهائي  // جمع سعر المبدع + الهامش ثم التقريب
  const clientPrice = roundToNearest500(totalCreatorPrice + agencyMarginAmount);

  // بناء لقطة العوامل  // لحفظ الشفافية والتتبع
  const factors: PricingFactorsSnapshot = {
    experienceMultiplier: experienceMod,
    equipmentMultiplier: equipmentMod,
    processingMultiplier: processingMod,
    rushMultiplier: rushMod,
    locationAddition,
    ownershipMultiplier: ownershipMod,
  };

  // إرجاع النتيجة  // القيم النهائية للمهمة
  return {
    basePrice: input.basePrice,
    factors,
    pricing: {
  // قيمة الوحدة لغرض العرض؛ عند final-only قد لا تكون مقربة على مستوى السطر
  unitCreatorPrice,
      totalCreatorPrice,
      agencyMarginPercent: ctx.marginPercent,
      agencyMarginAmount,
      clientPrice,
    },
  };
};

// شكل مبسّط لتجميع أسعار المهام  // لدالة مجاميع المشروع
export interface TaskPricingLike {
  basePrice?: number; // سعر الأساس للوحدة (اختياري)
  quantity?: number; // الكمية (اختياري)
  totalCreatorPrice: number; // مجموع سعر المبدع للمهمة
}

// حساب مجاميع مشروع من قائمة مهام  // يجمع الأساس والمبدع ويطبق الهامش
export const calculateProjectTotalsFromTasks = (
  params: { tasks: TaskPricingLike[]; marginPercent: number } // مدخلات: المهام + نسبة الهامش
): ProjectTotals => {
  // جمع مجموع الأساس  // ضرب basePrice * quantity إن توفرت
  const totalBasePrice = params.tasks.reduce((sum, t) => sum + (t.basePrice ?? 0) * (t.quantity ?? 0), 0);
  // جمع مجموع أسعار المبدعين  // من المهام
  const totalCreatorPrice = params.tasks.reduce((sum, t) => sum + (t.totalCreatorPrice || 0), 0);
  // حساب هامش الوكالة  // تطبيق التقريب
  const agencyMarginAmount = roundToNearest500(totalCreatorPrice * params.marginPercent);
  // حساب سعر العميل النهائي  // تطبيق التقريب النهائي
  const totalClientPrice = roundToNearest500(totalCreatorPrice + agencyMarginAmount);

  // إرجاع المجاميع  // وفق نوع ProjectTotals
  return {
    totalBasePrice,
    totalCreatorPrice,
    totalClientPrice,
    totalMarginAmount: agencyMarginAmount,
    marginPercentage: params.marginPercent,
  };
};
// Calculations V2.1 - حسابات التسعير
