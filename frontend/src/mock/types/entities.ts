// ================================ // كيانات عامة مشتركة (Entities) - SSOT V2.1
// - تعريفات أنواع مجردة للكيانات الأساسية (أدمن/عميل/مبدع/موظف) // لا تعتمد على بيانات فعلية لتجنب الدوران بين الوحدات
// - متوافقة مع وثائق الأدوار والتعدادات (RBAC/Enums) ومع core.ts كمصدر للأنواع المشتركة // مرجع نموذجي للاستهلاك عبر الطبقات
// ================================

import type { ISODateString, PhoneE164, EmailString, CoreEntityBase, UserLifecycle, Registry } from './core'; // استيراد أنواع أساسية من core.ts

export const ENTITIES_SCHEMA_VERSION = '2.1.0'; // نسخة مخطط الكيانات العامة

// -------- الأدوار والأنواع التمييزية --------
export type SystemRole = 'super_admin' | 'admin' | 'creator' | 'client' | 'salariedEmployee'; // أدوار النظام الرسمية وفق RBAC
export type EntityKind = 'admin' | 'creator' | 'client' | 'salaried'; // نوع الكيان للتصنيف العام (يتماشى مع BasicUserRef.kind)

// -------- كيانات أساسية (تعريفات عامة محايدة) --------
export interface AdminEntity extends CoreEntityBase { // كيان أدمن عام يورث الأساس
  name: string; // الاسم الكامل
  email: EmailString; // البريد الإلكتروني
  phone?: PhoneE164; // الهاتف بصيغة E.164
  role: Extract<SystemRole, 'super_admin' | 'admin'>; // الدور الإداري (سوبر/أدمن)
  status?: UserLifecycle; // حالة دورة حياة المستخدم (اختياري)
} // نهاية AdminEntity

export interface ClientEntity extends CoreEntityBase { // كيان عميل عام يورث الأساس
  name: string; // الاسم التجاري/اسم العميل
  contactName: string; // جهة الاتصال
  email: EmailString; // البريد الإلكتروني
  phone?: PhoneE164; // الهاتف بصيغة E.164
  industryId: string; // معرّف الصناعة المرتبطة
  status?: UserLifecycle; // حالة دورة حياة المستخدم (اختياري)
} // نهاية ClientEntity

export type CreatorCity = 'Baghdad' | 'Erbil' | 'Basra' | 'Sulaymaniyah' | 'Najaf' | 'Karbala'; // مدن شائعة للمبدعين (اختيارية)
export interface CreatorEntity extends CoreEntityBase { // كيان مبدع عام يورث الأساس
  name: string; // الاسم الكامل
  email: EmailString; // البريد الإلكتروني
  phone?: PhoneE164; // الهاتف بصيغة E.164
  city?: CreatorCity; // المدينة (اختياري)
  profileMultiplier?: number; // معامل الملف الشخصي (يؤثر على التسعير إن استُخدم)
  status?: UserLifecycle; // حالة دورة حياة المستخدم (اختياري)
} // نهاية CreatorEntity

export type SalariedRole = 'photographer' | 'designer' | 'editor' | 'producer'; // أدوار الموظفين براتب
export interface SalariedEmployeeEntity extends CoreEntityBase { // كيان موظف براتب عام
  name: string; // الاسم الكامل
  email: EmailString; // البريد الإلكتروني
  phone?: PhoneE164; // الهاتف بصيغة E.164
  role: SalariedRole; // الدور الوظيفي
  monthlySalaryIQD: number; // الراتب الشهري بالدينار العراقي
  hiredAt: ISODateString; // تاريخ التعيين
  status?: UserLifecycle; // حالة دورة حياة المستخدم (اختياري)
} // نهاية SalariedEmployeeEntity

// -------- اتحاد كيانات مميّز بالنوع (Discriminated Union) --------
export type AdminSystemEntity = AdminEntity & { kind: Extract<EntityKind, 'admin'> }; // كيان أدمن مع حقل تمييزي kind
export type ClientSystemEntity = ClientEntity & { kind: Extract<EntityKind, 'client'> }; // كيان عميل مع حقل kind
export type CreatorSystemEntity = CreatorEntity & { kind: Extract<EntityKind, 'creator'> }; // كيان مبدع مع حقل kind
export type SalariedSystemEntity = SalariedEmployeeEntity & { kind: Extract<EntityKind, 'salaried'> }; // كيان موظف مع حقل kind
export type SystemEntity = AdminSystemEntity | ClientSystemEntity | CreatorSystemEntity | SalariedSystemEntity; // اتحاد شامل لجميع الكيانات

// -------- واجهات عرض عامة (Public Views) تُراعي الخصوصية --------
export type AdminPublicView = Omit<AdminEntity, 'email' | 'phone'>; // إخفاء وسائل الاتصال للأدمن في العرض العام
export type ClientPublicView = Pick<ClientEntity, 'id' | 'name' | 'industryId' | 'isActive' | 'createdAt' | 'updatedAt'>; // عرض عميل مبسّط
export type CreatorPublicView = Omit<CreatorEntity, 'email' | 'phone' | 'profileMultiplier'>; // إخفاء الحقول الحساسة للمبدع
export type SalariedPublicView = Omit<SalariedEmployeeEntity, 'email' | 'phone' | 'monthlySalaryIQD'>; // إخفاء الاتصال والراتب

// -------- سجلات قياسية (Registries) للاستفادة مع طبقات الموك --------
export type AdminRegistry = Registry<AdminEntity>; // سجل أدمن (قائمة + خريطة)
export type ClientRegistry = Registry<ClientEntity>; // سجل عملاء
export type CreatorRegistry = Registry<CreatorEntity>; // سجل مبدعين
export type SalariedRegistry = Registry<SalariedEmployeeEntity>; // سجل موظفين

// ملاحظات توافقية:
// - الأسماء تختلف عن أنواع mock/core لتجنّب التعارض (AdminUser vs AdminEntity) // يمكن ربطهما عبر محولات عند الحاجة
// - لا توجد تبعيات إلى بيانات فعلية، فقط أنواع مجردة للاستهلاك المشترك // الحفاظ على خفة ومرونة الطبقة
// - يمكن لاحقاً إعادة التصدير من types/index.ts عند الاستقرار // خطوة مستقلة لاحقة
