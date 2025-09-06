// ================================
// مجمّع التسعير (Aggregator) - SSOT
// - يصدّر جميع معدّلات التسعير كحزمة واحدة
// - يبني خرائط سريعة lookup ويجهّز سياق الحساب
// - متوافق مع V2.1 ومع بنية mock الجديدة
// ================================

// استيراد الأنواع القياسية للتسعير  // مفاتيح وفئات ونسخة المخطّط
import type { PricingModifier, PricingModifierCategory } from '../types/pricing'; // أنواع المعدّلات
import { PRICING_SCHEMA_VERSION } from '../types/pricing'; // نسخة مخطّط التسعير

// استيراد مجموعات المعدّلات  // processing | experience | equipment | rush | location | ownership
import { processingModifiers } from './processingModifiers'; // معاملات المعالجة
import { experienceModifiers } from './experienceModifiers'; // معاملات الخبرة
import { equipmentModifiers } from './equipmentModifiers'; // معاملات المعدات
import { rushModifiers } from './rushModifiers'; // معاملات الاستعجال
import { locationAdditions } from './locationAdditions'; // إضافات الموقع (addition)
import { ownershipModifiers } from './ownershipModifiers'; // معاملات الملكية

// استيراد إعدادات النظام لهامش الوكالة  // مصدر الحقيقة لهامش الوكالة
import { systemSettings } from '../system/systemSettings'; // إعدادات النظام

// إعادة تصدير القوائم كما هي  // لتسهيل الاستيراد المباشر عند الحاجة
export {
	processingModifiers, // معاملات المعالجة
	experienceModifiers, // معاملات الخبرة
	equipmentModifiers, // معاملات المعدات
	rushModifiers, // معاملات الاستعجال
	locationAdditions, // إضافات الموقع
	ownershipModifiers, // معاملات الملكية
};

// مصفوفة موحدة تحتوي جميع المعدّلات  // تسلسُل ثابت حسب الفئات
export const allPricingModifiers: PricingModifier[] = [
	...processingModifiers, // معالجة
	...experienceModifiers, // خبرة
	...equipmentModifiers, // معدات
	...rushModifiers, // استعجال
	...locationAdditions, // موقع (addition)
	...ownershipModifiers, // ملكية
];

// خرائط بحسب الفئة لتسريع الوصول  // map: category -> PricingModifier[]
export const modifiersByCategory: Record<PricingModifierCategory, PricingModifier[]> = {
	processing: processingModifiers, // معالجة
	experience: experienceModifiers, // خبرة
	equipment: equipmentModifiers, // معدات
	rush: rushModifiers, // استعجال
	location: locationAdditions, // موقع
	ownership: ownershipModifiers, // ملكية
};

// خرائط lookup حسب المفتاح لكل فئة  // key -> value (number)
export const modifierValueMap = {
	// معالجة
	processing: Object.fromEntries(processingModifiers.map((m) => [m.key, m.value])) as Record<string, number>, // map معالجة
	// خبرة
	experience: Object.fromEntries(experienceModifiers.map((m) => [m.key, m.value])) as Record<string, number>, // map خبرة
	// معدات
	equipment: Object.fromEntries(equipmentModifiers.map((m) => [m.key, m.value])) as Record<string, number>, // map معدات
	// استعجال
	rush: Object.fromEntries(rushModifiers.map((m) => [m.key, m.value])) as Record<string, number>, // map استعجال
	// موقع (addition)
	location: Object.fromEntries(locationAdditions.map((m) => [m.key, m.value])) as Record<string, number>, // map موقع
	// ملكية
	ownership: Object.fromEntries(ownershipModifiers.map((m) => [m.key, m.value])) as Record<string, number>, // map ملكية
};

// سياق التسعير الجاهز للحساب  // يوفر modifiers + نسبة الهامش + نسخة المخطط
export const getPricingContext = () => {
	const marginPercent = systemSettings.defaultMarginPercent; // نسبة هامش الوكالة من الإعدادات
	return {
		modifiers: allPricingModifiers, // جميع المعدّلات
		marginPercent, // نسبة الهامش
		policy: { applyLocationPerTask: true, roundingMode: 'final' } as const, // سياسة افتراضية V2.1
		schemaVersion: PRICING_SCHEMA_VERSION, // نسخة مخطّط التسعير
	} as const; // كائن ثابت القراءة
};

// دالة مساعدة لإرجاع معدّل بالقيمة أو الافتراض  // تحترم نوع المعدّل
export const tryGetModifierValue = (
	category: PricingModifierCategory, // الفئة المطلوبة
	key: string, // المفتاح المطلوب
): number => {
	const list = modifiersByCategory[category]; // قائمة الفئة
	const found = list.find((m) => m.key === key && m.isActive); // البحث عن عنصر فعّال
	// قيمة افتراضية: للموقع 0 (addition) ولغيره 1.0 (multipliers)
	return found ? found.value : category === 'location' ? 0 : 1.0; // إرجاع القيمة أو الافتراض
};

// مخرجات تجميعية للوصول السريع  // تُستخدم في الواجهات/الخدمات
export const pricingRegistry = {
	version: PRICING_SCHEMA_VERSION, // نسخة المخطط
	marginPercent: systemSettings.defaultMarginPercent, // هامش الوكالة الافتراضي
	allModifiers: allPricingModifiers, // جميع المعدّلات
	byCategory: modifiersByCategory, // حسب الفئة
	valueMap: modifierValueMap, // خرائط القيم
};
// Pricing Aggregator V2.1 - مجمّع التسعير
