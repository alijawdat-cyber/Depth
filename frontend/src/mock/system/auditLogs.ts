// ================================ // سجل التدقيق (Audit Logs) - SSOT V2.1
// - تتبع أحداث حسّاسة (اعتماد مشروع، تعديل هامش، اعتماد مستخدم...) // مرجع للأمان والعمليات
// - تصميم خفيف ومتماسك مع RBAC وعمليات الـ Ops // قابل للتوسع لاحقاً
// ================================

import type { ISODateString } from '../types/core'; // نوع تاريخ ISO من الأنواع الأساسية

export const AUDIT_LOGS_SCHEMA_VERSION = '2.1.0'; // نسخة مخطط سجل التدقيق

// أحداث التدقيق القياسية وفق مصفوفة الأدوار // مقتبس من 99-reference/05-roles-matrix.md
export type AuditEvent = // اتحاد أحداث واضحة ومقيدة
  | 'PROJECT_APPROVED' // اعتماد مشروع
  | 'PRICE_OVERRIDE' // تعديل هامش/سعر يدوي
  | 'CREATOR_APPROVED' // اعتماد مبدع جديد
  | 'CLIENT_APPROVED' // اعتماد عميل
  | 'ROLE_CHANGED' // تغيير دور مستخدم
  | 'SEEDS_APPLIED'; // تطبيق بذور (Seeds)

// أنواع الهدف (المورد) المراقب // تساعد على التصفية لاحقاً
export type AuditTargetType = // موارد واردة في الوثائق
  | 'project' // مشروع
  | 'invoice' // فاتورة
  | 'payment' // دفعة
  | 'quote' // عرض سعر
  | 'contract' // عقد
  | 'seed' // بيانات بذور
  | 'user'; // مستخدم

// كيان سجل التدقيق // كل سطر يوثق فعلاً حساساً
export interface AuditLogEntry { // تعريف إدخال سجل التدقيق
  id: string; // معرف فريد للسجل
  event: AuditEvent; // نوع الحدث القياسي
  actorId: string; // معرف المنفّذ (admin/creator/client/salaried)
  actorKind: 'admin' | 'creator' | 'client' | 'salaried'; // نوع المنفّذ حسب الكيانات
  target?: { type: AuditTargetType; id: string }; // هدف العملية (اختياري)
  description?: string; // وصف مختصر قابل للقراءة
  metadata?: Record<string, string | number | boolean>; // بيانات إضافية للحدث
  createdAt: ISODateString; // طابع زمني بصيغة ISO
} // نهاية AuditLogEntry

// بيانات أولية واقعية متوافقة مع الكيانات الحالية // ترتبط بـ mock/core/*
export const auditLogs: AuditLogEntry[] = [ // مصفوفة سجلات التدقيق
  { // تطبيق بذور من قبل السوبر أدمن
    id: 'audit_001', // معرف السجل
    event: 'SEEDS_APPLIED', // حدث تطبيق البذور
    actorId: 'admin_super_001', // السوبر أدمن (from mock/core/admins)
    actorKind: 'admin', // نوع المنفّذ أدمن
    target: { type: 'seed', id: 'seeds_v2_1' }, // الهدف بيانات البذور V2.1
    description: 'تطبيق بيانات البذور للفئات والأسعار الأساسية (V2.1)', // وصف عربي موجز
    metadata: { version: '2.1.0' }, // بيانات إضافية: النسخة
    createdAt: '2025-09-01T10:00:00.000Z', // وقت التنفيذ
  },
  { // اعتماد مشروع من الأدمن
    id: 'audit_002', // معرف السجل
    event: 'PROJECT_APPROVED', // اعتماد مشروع
    actorId: 'admin_super_001', // الأدمن المنفّذ
    actorKind: 'admin', // نوع المنفّذ أدمن
    target: { type: 'project', id: 'p_002_salon_campaign' }, // مشروع واقعي موجود في بيانات المشاريع (data)
    description: 'تم اعتماد مشروع حملة صالون الوردة الذهبية', // وصف للحدث
    metadata: { priority: 'high', isRush: true }, // بيانات سياقية
    createdAt: '2025-08-22T09:20:00.000Z', // وقت الحدث
  },
  { // اعتماد مبدع جديد
    id: 'audit_003', // معرف السجل
    event: 'CREATOR_APPROVED', // اعتماد مبدع
    actorId: 'admin_001', // الأدمن الاعتيادي
    actorKind: 'admin', // نوع المنفّذ
    target: { type: 'user', id: 'creator_001' }, // المبدع المعتمد (from mock/core/creators)
    description: 'اعتماد حساب المبدع: سيف ذاخر العزاوي', // وصف عربي
    metadata: { city: 'Baghdad' }, // معلومات إضافية
    createdAt: '2025-08-21T10:15:00.000Z', // وقت الحدث
  },
  { // اعتماد عميل جديد
    id: 'audit_004', // معرف السجل
    event: 'CLIENT_APPROVED', // اعتماد عميل
    actorId: 'admin_001', // الأدمن الاعتيادي
    actorKind: 'admin', // نوع المنفّذ
    target: { type: 'user', id: 'client_001' }, // العميل المعتمد (from mock/core/clients)
    description: 'اعتماد عميل: بيت السماق للألبسة', // وصف للحدث
    metadata: { industryId: 'ind_fashion' }, // ارتباط بالصناعة
    createdAt: '2025-08-21T16:00:00.000Z', // وقت الاعتماد
  },
  { // تغيير دور مستخدم
    id: 'audit_005', // معرف السجل
    event: 'ROLE_CHANGED', // تعديل دور
    actorId: 'admin_super_001', // السوبر أدمن المنفّذ
    actorKind: 'admin', // نوع المنفّذ
    target: { type: 'user', id: 'admin_001' }, // الهدف أدمن آخر
    description: 'ترقية صلاحيات الأدمن الاعتيادي مؤقتاً لأغراض الدعم', // وصف للحدث
    metadata: { from: 'admin', to: 'admin' }, // قيمة صورية (لا توجد ترقية فعلية)
    createdAt: '2025-08-25T09:45:00.000Z', // وقت الحدث
  },
  { // تعديل هامش يدوي
    id: 'audit_006', // معرف السجل
    event: 'PRICE_OVERRIDE', // تعديل تسعير
    actorId: 'admin_super_001', // الأدمن المنفّذ
    actorKind: 'admin', // نوع المنفّذ
    target: { type: 'quote', id: 'q_2025_0001' }, // عرض سعر افتراضي
    description: 'تعديل هامش الوكالة لعروض عميل الصالون بسبب ولاء طويل', // سبب التعديل
    metadata: { oldMargin: 0.10, newMargin: 0.08 }, // تفاصيل التغيير
    createdAt: '2025-08-26T11:10:00.000Z', // وقت التنفيذ
  },
];

// خرائط مساعدة سريعة // لتسريع الوصول حسب المعرف/الحدث
export const auditLogById: Record<string, AuditLogEntry> = Object.fromEntries( // خريطة بالسجل عبر id
  auditLogs.map((e) => [e.id, e]) // إدراج كل سجل حسب المعرف
); // نهاية الخريطة

// دوال مساعدة شائعة الاستخدام // فلترة واستعلامات
export const listAuditLogs = (): AuditLogEntry[] => auditLogs.slice(); // إرجاع نسخة من السجلات
export const getAuditLogsByEvent = (event: AuditEvent): AuditLogEntry[] => auditLogs.filter((e) => e.event === event); // حسب الحدث
export const getAuditLogsByActor = (actorId: string): AuditLogEntry[] => auditLogs.filter((e) => e.actorId === actorId); // حسب المنفّذ
export const getAuditLogsByTarget = (type: AuditTargetType, id: string): AuditLogEntry[] => auditLogs.filter((e) => e.target?.type === type && e.target?.id === id); // حسب الهدف

// منشئ موحد لسجل جديد // يضمن الشكل القياسي
export const createAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'createdAt'> & { id?: string; createdAt?: ISODateString }): AuditLogEntry => ({ // إنشاء كائن سجل
  id: entry.id ?? `audit_${String(auditLogs.length + 1).padStart(3, '0')}`, // توليد id تلقائي إن لم يُمرّر
  createdAt: entry.createdAt ?? new Date().toISOString(), // طابع زمني افتراضي
  ...entry, // بقية الحقول
}); // نهاية المُنشئ

// إضافة سجل إلى القائمة (للمحاكاة) // تُستخدم في الاختبارات/العروض التوضيحية
export const appendAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'createdAt'> & { id?: string; createdAt?: ISODateString }): AuditLogEntry => { // دالة إضافة
  const newEntry = createAuditLog(entry); // بناء السجل الجديد
  auditLogs.unshift(newEntry); // إدراج في المقدمة لسهولة العرض
  auditLogById[newEntry.id] = newEntry; // تحديث الخريطة
  return newEntry; // إرجاع السجل المُضاف
}; // نهاية الإضافة

// سجل تجميعي بسيط (Registry) // يوفر إحصاءات سريعة
export const auditLogsRegistry = { // كائن السجل
  version: AUDIT_LOGS_SCHEMA_VERSION, // نسخة المخطط
  count: auditLogs.length, // إجمالي السجلات
  all: auditLogs, // جميع السجلات
  byId: auditLogById, // خريطة حسب المعرف
}; // نهاية السجل التجميعي

// Audit Logs V2.1 - سجل التدقيق // التذييل التعريفي
// Audit Logs V2.1 - سجلات التدقيق
