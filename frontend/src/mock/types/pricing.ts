// ================================
// أنواع وسياسات التسعير (SSOT)
// - هذا الملف هو المرجع المركزي لأنواع التسعير وعوامله عبر النظام كله
// - مستوحى ومطابق لمتطلبات V2.1 + توافق مع بيانات mock القديمة
// ================================

// مفاتيح مستويات المعالجة المدعومة  // raw | basic | color_correction | full_retouch | advanced_composite
export type ProcessingLevel = 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite';

// مفاتيح مستويات الخبرة للمبدعين  // fresh | experienced | expert
export type ExperienceLevel = 'fresh' | 'experienced' | 'expert';

// شرائح جودة/فئة المعدات  // silver | gold | platinum
export type EquipmentTier = 'silver' | 'gold' | 'platinum';

// مفتاح الاستعجال للتسليم  // normal | rush
export type RushKey = 'normal' | 'rush';

// مفاتيح نوع الموقع للتسعير  // studio | client | nearby | outskirts | far
export type LocationKey = 'studio' | 'client' | 'nearby' | 'outskirts' | 'far';

// مفتاح ملكية المعدات  // owned | agency_equipment
export type OwnershipKey = 'owned' | 'agency_equipment';

// تصنيف فئات معدّلات التسعير  // processing | experience | equipment | rush | location | ownership
export type PricingModifierCategory =
  | 'processing'
  | 'experience'
  | 'equipment'
  | 'rush'
  | 'location'
  | 'ownership';

// نوع تأثير المعدّل  // multiplier (معامل ضرب) | addition (إضافة ثابتة)
export type PricingModifierType = 'multiplier' | 'addition';

// تعريف المعدّل المعياري  // عنصر SSOT لكل عامل تسعير
export interface PricingModifier {
  id: string; // معرّف فريد للمعدّل
  category: PricingModifierCategory; // فئة المعدّل (معالجة/خبرة/معدّات/استعجال/موقع/ملكية)
  name: string; // اسم عربي/وصفي للمعدّل
  key: string; // المفتاح البرمجي المستخدم في الحسابات
  value: number; // قيمة المعدّل (معامل أو إضافة)
  type: PricingModifierType; // نوع المعدّل (ضرب/إضافة)
  description: string; // وصف مختصر للاستخدام والسياسة
  isActive: boolean; // فعالية المعدّل (للتبديل بدون حذف)
  createdAt: string; // تاريخ الإنشاء ISO
  updatedAt: string; // تاريخ التحديث ISO
}

// قاعدة/سياسة هامش الوكالة  // نسبة أساسية + قواعد تعديلية اختيارية
export interface AgencyMarginConfig {
  id: string; // معرّف الإعداد
  name: string; // اسم الإعداد (وصف سياسة الهامش)
  basePercentage: number; // النسبة الأساسية بصيغة عشرية (مثال 0.25 = 25%)
  rules: MarginRule[]; // قواعد سياقية تضيف/تخصم من النسبة الأساسية
  isActive: boolean; // فعّال أم لا
  createdAt: string; // إنشاء
  updatedAt: string; // تحديث
}

// قاعدة تعديل للهامش  // شرط وصفي + معامل تعديل
export interface MarginRule {
  id: string; // معرّف القاعدة
  condition: string; // شرط تطبيقي (مثال: new_client | vip_client | complex_project)
  modifier: number; // مقدار التعديل (مثال 0.25 = +25%)
  description: string; // وصف عربي للقاعدة
  isActive: boolean; // فعّالة أم لا
}

// لقطة عوامل التسعير المطبّقة على مهمة  // تُحفظ مع المهمة للشفافية والتتبع
export interface PricingFactorsSnapshot {
  experienceMultiplier: number; // معامل الخبرة
  equipmentMultiplier: number; // معامل المعدات
  processingMultiplier: number; // معامل المعالجة
  rushMultiplier: number; // معامل الاستعجال
  locationAddition: number; // إضافة الموقع (قيمة ثابتة)
  ownershipMultiplier?: number; // اختيارية: معامل الملكية إن وُجد
}

// نتيجة حساب التسعير لوحدة/مهمة  // تستخدم في المهام وعروض الأسعار
export interface PricingCalculation {
  basePrice: number; // السعر الأساسي قبل العوامل
  quantity: number; // الكمية
  unitCreatorPrice: number; // سعر المبدع للوحدة بعد العوامل والتقريب
  totalCreatorPrice: number; // السعر الإجمالي للمبدع
  agencyMarginPercent: number; // نسبة الهامش المستخدمة
  agencyMarginAmount: number; // مقدار الهامش
  clientPrice: number; // السعر النهائي للعميل
}

// نسخة مبسّطة لتعريف المفاتيح الموحّدة عبر النظام  // لضمان توحيد الاستيراد والاستخدام
export interface PricingKeys {
  processing: ProcessingLevel; // مفتاح المعالجة
  experience: ExperienceLevel; // مفتاح الخبرة
  equipment: EquipmentTier; // مفتاح المعدات
  rush: RushKey; // مفتاح الاستعجال
  location: LocationKey; // مفتاح الموقع
  ownership: OwnershipKey; // مفتاح الملكية
}

// رقم نسخة مخطط التسعير  // لتتبع التغييرات عبر الإصدارات
export const PRICING_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط الحالية
