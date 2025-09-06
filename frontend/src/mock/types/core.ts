// ================================ // أنواع أساسية مشتركة (Core Types) - SSOT V2.1
// - ملف مرجعي موحّد للأنواع العامة (IDs, Timestamps, Result, Pagination...) // يساعد على توحيد الأنواع عبر التسعير/الخدمات/المشاريع
// - مُصمم ليكون منخفض الارتباط ويُستورد اختيارياً من باقي الوحدات // لتقليل التكرار وتيسير الصيانة
// - يستند إلى التوثيق: 99-reference/04-naming-conventions.md + 99-reference/02-enums-standard.md + 01-requirements/00-requirements-v2.0.md // مواءمة كاملة مع V2.1
// ================================

export const CORE_SCHEMA_VERSION = '2.1.0'; // رقم نسخة مخطط الأنواع الأساسية

// -------- القيَم الأساسية (Primitives) --------
export type ISODateString = string; // سلسلة تاريخ/وقت بصيغة ISO 8601 (UTC)
export type IQDAmount = number; // مبلغ بالدينار العراقي (قيمة صحيحة)
export type Percentage = number; // نسبة عشرية (0.10 = 10%)
export type Slug = string; // مفتاح نصي قياسي (kebab_case / snake_case حسب السياق)
export type EmailString = string; // بريد إلكتروني صالح RFC 5322 (تحقق عند الاستخدام)
export type PhoneE164 = string; // رقم هاتف E.164 (مثال: +964-7xx-xxx-xxxx)
export type LanguageCode = 'ar' | 'en'; // رمز اللغة المدعومة في الواجهة
export type CountryCode = 'IQ'; // رمز الدولة (العراق) كقيمة افتراضية
export type Currency = 'IQD'; // العملة المعتمدة داخلياً

// معرفات معنونة (Branded IDs) لمنع الخلط بين الكيانات المتقاربة
export type ID<T extends string = string> = string & { __brand: T }; // سلسلة مع وسم نوعي لضمان الدقة عند التجميع

// -------- مراجع وروابط بسيطة --------
export type CoreUserRef = { id: string; name: string }; // مرجع مستخدم مبسّط للعرض والربط
export type AdminRef = CoreUserRef; // مرجع أدمن مختصر
export type ClientRef = CoreUserRef; // مرجع عميل مختصر
export type CreatorRef = CoreUserRef; // مرجع مبدع مختصر
export type EmployeeRef = CoreUserRef; // مرجع موظف مختصر

export interface LinkRefs { // مراجع روابط اختيارية بين الكيانات
  industryId?: string; // معرّف الصناعة ذات الصلة
  categoryId?: string; // معرّف الفئة الرئيسية
  subcategoryId?: string; // معرّف الفئة الفرعية
  creatorId?: string; // معرّف المبدع
  clientId?: string; // معرّف العميل
  adminId?: string; // معرّف الأدمن
} // نهاية مراجع الروابط

// -------- طوابع زمنية وتفعيل --------
export interface Timestamps { createdAt: ISODateString; updatedAt: ISODateString } // طوابع زمنية قياسية (إنشاء/تحديث)
export interface SoftDeletable { isArchived?: boolean; deletedAt?: ISODateString } // أرشفة/حذف منطقي دون فقدان السجل
export type UserLifecycle = 'active' | 'inactive' | 'suspended'; // دورة حياة المستخدم حسب الدليل المعياري
export interface ActivationState { isActive: boolean; status?: UserLifecycle } // حالة التفعيل + مؤشر دورة الحياة

export interface CoreEntityBase extends Timestamps { // أساس موحّد لأي كيان
  id: string; // معرّف فريد (قد يكون UUID/Slug)
  isActive: boolean; // حالة تفعيل قياسية
} // نهاية أساس الكيانات

export interface AuditMeta { // بيانات تتبع وتدقيق اختيارية
  createdBy?: string; // من أنشأ السجل (id)
  updatedBy?: string; // آخر من حدّث السجل (id)
  approvedBy?: string; // من اعتمد السجل (id)
  approvedAt?: ISODateString; // وقت الاعتماد
} // نهاية بيانات التدقيق

// -------- نقود وتنسيقات --------
export interface Money { amount: IQDAmount; currency: Currency } // تمثيل مبلغ نقدي مع عملته
export type PricingTransparency = 'full' | 'no-margin' | 'creator-only' | 'none'; // شفافية التسعير (مرجع عرض)

// -------- مساعدات نوعية (Utility Types) --------
export type Dict<T = unknown> = Record<string, T>; // قاموس مفاتيح نصية لأي قيمة
export type Nullable<T> = T | null | undefined; // نوع اختياري موسّع
export type NonEmptyArray<T> = [T, ...T[]]; // مصفوفة غير فارغة (عنصر واحد على الأقل)
export type SortOrder = 'asc' | 'desc'; // ترتيب تصاعدي/تنازلي

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: NonNullable<T[P]> }; // فرض حقول لتصبح مطلوبة
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>; // تحويل بعض الحقول لاختيارية
export type Exact<T> = { [K in keyof T]: T[K] } & { }; // تطابق صارم مع مفاتيح النوع
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }; // اختيارية عميقة متداخلة

// -------- نتائج/إما (Result/Either) --------
export type Result<Ok, Err = { code: string; message: string }> = // نتيجة معيارية لعمليات وهمية
  | { ok: true; data: Ok } // حالة نجاح مع البيانات
  | { ok: false; error: Err }; // حالة فشل مع خطأ مُنظم

export type Either<L, R> = // تمثيل إما/أو بطرف واحد
  | { left: L; right?: never } // يسار فقط
  | { left?: never; right: R }; // يمين فقط

// -------- سجلات وترقيم صفحات --------
export type Registry<T extends { id: string }> = { list: T[]; mapById: Record<string, T> }; // سجل موحّد (قائمة + خريطة)
export type Paginated<T> = { items: T[]; total: number; page: number; pageSize: number; pages: number }; // تغليف ترقيم صفحات

// ملاحظات توافقية:
// - تجنّبنا تكرار الأسماء المعرّفة في './projects' و './pricing' (مثل ProjectStatus/TaskStatus) // تقليل التعارضات
// - يمكن استيراد هذه الأنواع في طبقات: mock/core/* + mock/services/* + mock/pricing/* + mock/projects/* // نقطة مشتركة
// - تُضيف وحدات لاحقة (entities.ts) أنواعًا أكثر خصوصية وتستورد من هذا الملف كأساس // فصل الاهتمام
