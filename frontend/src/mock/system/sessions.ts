// ================================ // الجلسات (Sessions) - SSOT V2.1
// - يتبع مخطط الوثائق: 02-database/01-database-schema.md (قسم sessions) // مرجع المخطط
// - جلسات مصادقة وهمية للاستهلاك المستقبلي بالواجهات // الغرض
// - تدعم إنشاء/تحديث نشاط/تجديد/إلغاء تنشيط الجلسات مع فهارس مبسطة // قدرات
// ================================ // ترويسة

import type { ISODateString } from '../types/core'; // نوع تاريخ ISO من الأنواع الأساسية

// أنواع مساعدة للمفاتيح // تعليق
export type SessionId = string; // معرف الجلسة (session_*)
export type UserId = string; // معرف المستخدم (client_* | creator_* | admin_* | sa_* ...)

// نوع المنصة حسب الوثائق // تعليق
export type SessionPlatform = 'android' | 'ios' | 'web'; // منصة الجلسة

// معلومات الجهاز // تعليق
export interface DeviceInfo { // معلومات جهاز
  model: string; // موديل الجهاز
  os: string; // نظام التشغيل
  version: string; // نسخة التطبيق/النظام
} // نهاية DeviceInfo

// الكيان الرئيسي للجلسة حسب المخطط // تعليق
export interface SessionEntity { // كيان Session
  id: SessionId; // معرف الجلسة
  userId: UserId; // معرف المستخدم
  token: string; // توكن مشفر (وهمي)
  platform: SessionPlatform; // المنصة
  deviceId: string; // معرف الجهاز
  deviceInfo: DeviceInfo; // معلومات الجهاز
  ipAddress: string; // عنوان IP
  userAgent: string; // وكيل المستخدم (UA)
  isActive: boolean; // فعّال؟
  lastActivity: ISODateString; // آخر نشاط
  expiresAt: ISODateString; // انتهاء الصلاحية
  createdAt: ISODateString; // تاريخ الإنشاء
  updatedAt: ISODateString; // آخر تحديث
} // نهاية SessionEntity

// مُدخل إنشاء جلسة // تعليق
export interface CreateSessionInput { // مدخل create
  userId: UserId; // معرف المستخدم
  platform: SessionPlatform; // المنصة
  deviceId: string; // معرف الجهاز
  deviceInfo: DeviceInfo; // معلومات الجهاز
  ipAddress: string; // عنوان IP
  userAgent: string; // وكيل المستخدم
} // نهاية CreateSessionInput

// سياسة صلاحية الجلسة (30 يوم) // تعليق
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 يوم بالثواني

// توابع وقت مساعدة // تعليق
const nowIso = (): ISODateString => new Date().toISOString() as ISODateString; // وقت الآن ISO
const addSeconds = (iso: ISODateString, seconds: number): ISODateString => new Date(new Date(iso).getTime() + seconds * 1000).toISOString() as ISODateString; // إضافة ثواني

// بيانات نموذجية أولية متوافقة مع مستخدمين حاليين // تعليق
export const sessions: SessionEntity[] = [ // قائمة الجلسات
  { id: 'session_001', userId: 'client_001', token: 'enc_token_s1', platform: 'web', deviceId: 'web_device_001', deviceInfo: { model: 'Chrome', os: 'macOS 14', version: '15.0.0' }, ipAddress: '185.60.216.35', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6)', isActive: true, lastActivity: '2025-09-04T15:58:00.000Z', expiresAt: '2025-10-04T15:58:00.000Z', createdAt: '2025-08-20T09:00:00.000Z', updatedAt: '2025-09-04T15:58:00.000Z' }, // جلسة عميل ويب
  { id: 'session_002', userId: 'creator_001', token: 'enc_token_s2', platform: 'android', deviceId: 'and_dev_001', deviceInfo: { model: 'Galaxy S23', os: 'Android 14', version: '2.3.1' }, ipAddress: '185.60.216.42', userAgent: 'okhttp/4.12.0', isActive: true, lastActivity: '2025-09-04T16:20:00.000Z', expiresAt: '2025-10-04T16:20:00.000Z', createdAt: '2025-08-21T10:10:00.000Z', updatedAt: '2025-09-04T16:20:00.000Z' }, // جلسة مبدع أندرويد
  { id: 'session_003', userId: 'admin_super_001', token: 'enc_token_s3', platform: 'ios', deviceId: 'ios_dev_001', deviceInfo: { model: 'iPhone 15 Pro', os: 'iOS 18', version: '2.3.1' }, ipAddress: '185.60.216.10', userAgent: 'DepthApp/2.3.1 (iOS 18)', isActive: false, lastActivity: '2025-08-29T08:00:00.000Z', expiresAt: '2025-09-28T08:00:00.000Z', createdAt: '2025-08-01T08:00:00.000Z', updatedAt: '2025-08-29T08:10:00.000Z' }, // جلسة قديمة منتهية/غير فعّالة
]; // نهاية البيانات

// فهارس مبسطة للوصول // تعليق
export const sessionsByUser: Record<UserId, SessionEntity[]> = sessions.reduce((acc, s) => { (acc[s.userId] ||= []).push(s); return acc; }, {} as Record<UserId, SessionEntity[]>); // حسب المستخدم
export const activeSessionsByUser: Record<UserId, SessionEntity[]> = Object.fromEntries(Object.entries(sessionsByUser).map(([k, arr]) => [k, arr.filter(s => s.isActive)])); // النشطة فقط

// عمليات مساعدة على الجلسات // تعليق
export const listSessions = (userId?: UserId): SessionEntity[] => userId ? (sessionsByUser[userId] || []).slice().sort((a,b) => (a.createdAt > b.createdAt ? -1 : 1)) : sessions.slice().sort((a,b) => (a.createdAt > b.createdAt ? -1 : 1)); // سرد الجلسات

// توليد معرف وتوكن بسيطين (وهميين) // تعليق
let seq = sessions.length; // عداد متسلسل
const nextSessionId = (): SessionId => `session_${String(++seq).padStart(3, '0')}`; // توليد معرف
const genToken = (): string => `enc_token_${Math.random().toString(36).slice(2, 10)}`; // توليد توكن

// إنشاء جلسة جديدة // تعليق
export const createSession = (input: CreateSessionInput): SessionEntity => { // إنشاء جلسة
  const now = nowIso(); // الآن
  const entity: SessionEntity = { // بناء الكيان
    id: nextSessionId(), // معرف جديد
    userId: input.userId, // المستخدم
    token: genToken(), // توكن
    platform: input.platform, // منصة
    deviceId: input.deviceId, // جهاز
    deviceInfo: input.deviceInfo, // معلومات
    ipAddress: input.ipAddress, // IP
    userAgent: input.userAgent, // UA
    isActive: true, // مفعّلة
    lastActivity: now, // آخر نشاط
    expiresAt: addSeconds(now, SESSION_TTL_SECONDS), // انتهاء
    createdAt: now, // إنشاء
    updatedAt: now, // تحديث
  }; // نهاية الكيان
  sessions.push(entity); // إضافة للمصفوفة
  (sessionsByUser[entity.userId] ||= []).push(entity); // تحديث فهرس المستخدم
  (activeSessionsByUser[entity.userId] ||= []).push(entity); // تحديث فهرس النشطة
  return entity; // إرجاع الكيان
}; // نهاية createSession

// تحديث آخر نشاط (touch) // تعليق
export const touchSession = (sessionId: SessionId): SessionEntity | undefined => { // تحديث نشاط
  const s = sessions.find(x => x.id === sessionId && x.isActive); // إيجاد الجلسة
  if (!s) return undefined; // إن لم توجد
  s.lastActivity = nowIso(); // تحديث النشاط
  s.updatedAt = s.lastActivity; // تحديث آخر تحديث
  return s; // إرجاع
}; // نهاية touch

// تجديد صلاحية الجلسة // تعليق
export const refreshSession = (sessionId: SessionId): SessionEntity | undefined => { // تجديد
  const s = sessions.find(x => x.id === sessionId && x.isActive); // إيجاد فعّالة
  if (!s) return undefined; // لا شيء
  const now = nowIso(); // الآن
  s.expiresAt = addSeconds(now, SESSION_TTL_SECONDS); // تمديد 30 يوم
  s.updatedAt = now; // تحديث
  return s; // إرجاع
}; // نهاية refresh

// إلغاء تنشيط جلسة (تسجيل خروج) // تعليق
export const revokeSession = (sessionId: SessionId): boolean => { // إلغاء تنشيط
  const s = sessions.find(x => x.id === sessionId); // إيجادها
  if (!s) return false; // لا توجد
  s.isActive = false; // تعطيل
  s.updatedAt = nowIso(); // تحديث
  const list = activeSessionsByUser[s.userId] || []; // جلب النشطة
  const idx = list.findIndex(x => x.id === sessionId); // موقعها
  if (idx >= 0) list.splice(idx, 1); // إزالة من النشطة
  return true; // تم
}; // نهاية revoke

// التحقق من صلاحية توكن جلسة // تعليق
export const isSessionValid = (token: string): boolean => { // صلاحية
  const s = sessions.find(x => x.token === token && x.isActive); // إيجاد
  if (!s) return false; // غير موجود
  return new Date(s.expiresAt).getTime() > Date.now(); // لم ينتهِ؟
}; // نهاية isSessionValid

// تلخيص للتقارير // تعليق
export const getSessionsSummary = () => { // ملخص
  const total = sessions.length; // إجمالي
  const active = sessions.filter(s => s.isActive).length; // نشطة
  const byPlatform = sessions.reduce<Record<SessionPlatform, number>>((acc, s) => { acc[s.platform] = (acc[s.platform] ?? 0) + 1; return acc; }, { android: 0, ios: 0, web: 0 }); // حسب منصة
  return { total, active, byPlatform }; // إخراج
}; // نهاية الملخص

// سجل/ريجستري // تعليق
export const SESSIONS_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط
export const sessionsRegistry = { // السجل
  version: SESSIONS_SCHEMA_VERSION, // النسخة
  count: sessions.length, // العدد
  all: sessions, // الكل
  byUser: sessionsByUser, // حسب المستخدم
  activeByUser: activeSessionsByUser, // النشطة حسب المستخدم
}; // نهاية السجل

// Sessions V2.1 - الجلسات // تذييل