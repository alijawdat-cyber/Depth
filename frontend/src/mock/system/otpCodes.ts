// ================================ // نظام أكواد التحقق (OTP) - SSOT V2.1
// - يتوافق مع وثائق المصادقة: 03-api/core/01-authentication.md (إرسال/تحقق/إعادة إرسال) // مرجع السياسات
// - يعكس السياسة: طول 6، صلاحية 5 دقائق، محاولات 3، مبرّد 60 ثانية، شركات العراق (آسياسيل/كورك/زين) // توافق محلي
// ================================

import type { ISODateString } from '../types/core'; // استيراد نوع التاريخ ISO من الأنواع المشتركة

export const OTP_SCHEMA_VERSION = '2.1.0'; // نسخة مخطط OTP

// شركات الاتصالات المعتمدة محلياً // prefixes وفق الوثائق
export type OTPCarrier = 'asiacell' | 'korek' | 'zain'; // نوع شركة الاتصالات
export const CARRIER_PREFIXES: Record<OTPCarrier, string[]> = { asiacell: ['0770', '0771', '0772', '0773', '0774'], korek: ['0750', '0751', '0752', '0753', '0754', '0755'], zain: ['0780', '0781', '0782', '0783', '0784'] }; // بادئات الأرقام

// مزوّد خدمة الإرسال // firebase أو محلي
export type OTPProvider = 'firebase' | 'local_gateway'; // مزوّد OTP

// غرض الإرسال // التسجيل/إعادة كلمة المرور/تغيير الهاتف
export type OTPPurpose = 'registration' | 'password_reset' | 'phone_change'; // غرض الرمز

// حالة جلسة OTP // قيد الانتظار/متحقق/منتهي/محظور
export type OTPStatus = 'pending' | 'verified' | 'expired' | 'blocked'; // حالة الجلسة

// تهيئة السياسة من الوثائق // طول 6، 300 ثانية، 3 محاولات، مبرّد 60 ثانية
export const otpPolicy = { codeLength: 6, expirySeconds: 300, maxAttempts: 3, cooldownSeconds: 60 } as const; // سياسة OTP

// كيان جلسة OTP المخزنة في النظام // يحاكي التخزين المؤقت لرموز الهاتف
export interface OTPEntry { // تعريف إدخال OTP
	sessionId: string; // معرف الجلسة (otp_session_unique_id)
	phoneNumber: string; // رقم الهاتف (محلي 07xx أو E164) حسب الإدخال
	carrier: OTPCarrier; // شركة الاتصالات
	provider: OTPProvider; // مزوّد الإرسال
	purpose: OTPPurpose; // الغرض
	code: string; // الرمز المرسل (للتجارب فقط)
	attempts: number; // عدد المحاولات المستهلكة
	maxAttempts: number; // الحد الأقصى للمحاولات
	status: OTPStatus; // حالة الجلسة
	expiresAt: ISODateString; // وقت الانتهاء
	cooldownUntil?: ISODateString | null; // وقت انتهاء المبرّد بين المحاولات
	lastSentAt: ISODateString; // آخر وقت إرسال
	verifiedAt?: ISODateString | null; // وقت التحقق إن وجد
	createdAt: ISODateString; // وقت الإنشاء
	updatedAt: ISODateString; // آخر تحديث
} // نهاية OTPEntry

// دوال مساعدة أساسية // كشف شركة الاتصالات وتوليد الرمز والتوقيت
export const detectCarrier = (phoneNumber: string): OTPCarrier | undefined => { // كشف شركة الاتصالات من البادئة
	const p = phoneNumber.trim(); // تنظيف الفراغات
	const prefix = p.startsWith('+964') ? `0${p.slice(4, 7)}` + p.slice(7, 8) : p.slice(0, 4); // اشتقاق بادئة محلية (تقريبية)
	if (CARRIER_PREFIXES.asiacell.some(pre => p.startsWith(pre))) return 'asiacell'; // تحقق آسياسيل
	if (CARRIER_PREFIXES.korek.some(pre => p.startsWith(pre))) return 'korek'; // تحقق كورك
	if (CARRIER_PREFIXES.zain.some(pre => p.startsWith(pre))) return 'zain'; // تحقق زين
	if (CARRIER_PREFIXES.asiacell.includes(prefix as string)) return 'asiacell'; // تحقق إضافي من البادئة المحوّلة
	if (CARRIER_PREFIXES.korek.includes(prefix as string)) return 'korek'; // تحقق إضافي كورك
	if (CARRIER_PREFIXES.zain.includes(prefix as string)) return 'zain'; // تحقق إضافي زين
	return undefined; // غير معروفة
}; // نهاية detectCarrier

export const generateOtpCode = (len: number = otpPolicy.codeLength): string => String(Math.floor(Math.random() * 10 ** len)).padStart(len, '0'); // توليد رمز رقمي بطول محدد
export const addSeconds = (iso: ISODateString, seconds: number): ISODateString => new Date(new Date(iso).getTime() + seconds * 1000).toISOString(); // جمع ثواني لتاريخ
export const nowIso = (): ISODateString => new Date().toISOString() as ISODateString; // وقت الآن بصيغة ISO

// بيانات أولية للتجارب // جلسات تم إرسالها/متحقق منها
export const otpCodes: OTPEntry[] = [ // مصفوفة جلسات OTP
	{ sessionId: 'otp_sess_001', phoneNumber: '07719956000', carrier: 'asiacell', provider: 'firebase', purpose: 'registration', code: '123456', attempts: 0, maxAttempts: 3, status: 'pending', expiresAt: addSeconds('2025-09-05T10:00:00.000Z', 300), cooldownUntil: addSeconds('2025-09-05T10:00:00.000Z', 60), lastSentAt: '2025-09-05T10:00:00.000Z', verifiedAt: null, createdAt: '2025-09-05T10:00:00.000Z', updatedAt: '2025-09-05T10:00:00.000Z' }, // جلسة آسياسيل بانتظار التحقق
	{ sessionId: 'otp_sess_002', phoneNumber: '07501234567', carrier: 'korek', provider: 'firebase', purpose: 'password_reset', code: '654321', attempts: 1, maxAttempts: 3, status: 'pending', expiresAt: addSeconds('2025-09-05T09:50:00.000Z', 300), cooldownUntil: addSeconds('2025-09-05T09:55:00.000Z', 60), lastSentAt: '2025-09-05T09:55:00.000Z', verifiedAt: null, createdAt: '2025-09-05T09:50:00.000Z', updatedAt: '2025-09-05T09:55:00.000Z' }, // جلسة كورك بمحاولة واحدة
	{ sessionId: 'otp_sess_003', phoneNumber: '07811234567', carrier: 'zain', provider: 'firebase', purpose: 'phone_change', code: '112233', attempts: 0, maxAttempts: 3, status: 'verified', expiresAt: addSeconds('2025-09-05T09:00:00.000Z', 300), cooldownUntil: null, lastSentAt: '2025-09-05T09:00:00.000Z', verifiedAt: '2025-09-05T09:02:30.000Z', createdAt: '2025-09-05T09:00:00.000Z', updatedAt: '2025-09-05T09:02:30.000Z' }, // جلسة زين متحقق منها
]; // نهاية البيانات

// خريطة للوصول السريع حسب sessionId // byId
export const otpBySession: Record<string, OTPEntry> = Object.fromEntries(otpCodes.map(o => [o.sessionId, o])); // خريطة الجلسات

// فحوصات مساعدة للحالة // انتهاء/إمكانية المحاولة/الإرسال
export const isExpired = (entry: OTPEntry, at: ISODateString = nowIso()): boolean => entry.expiresAt <= at || entry.status === 'expired'; // هل الجلسة منتهية
export const attemptsRemaining = (entry: OTPEntry): number => Math.max(0, entry.maxAttempts - entry.attempts); // المحاولات المتبقية
export const canAttempt = (entry: OTPEntry, at: ISODateString = nowIso()): boolean => entry.status === 'pending' && !isExpired(entry, at) && attemptsRemaining(entry) > 0 && (!entry.cooldownUntil || entry.cooldownUntil <= at); // هل يمكن المحاولة
export const canResend = (entry: OTPEntry, at: ISODateString = nowIso()): boolean => entry.status !== 'blocked' && !isExpired(entry, at) && (!entry.cooldownUntil || entry.cooldownUntil <= at); // هل يمكن إعادة الإرسال

// نتيجة الإرسال كما في الوثائق // otpSession/phone/expire/attemptsRemaining/carrier/provider
export interface OtpSendResult { // نتيجة send
	otpSession: string; // معرف الجلسة
	phoneNumber: string; // رقم الهاتف
	expiresIn: number; // ثواني الصلاحية
	attemptsRemaining: number; // محاولات متبقية
	carrier: OTPCarrier; // شركة الاتصالات
	provider: OTPProvider; // مزوّد الإرسال
} // نهاية OtpSendResult

// إرسال OTP (محاكاة) // يحاكي POST /auth/otp/send
export const sendOtp = (phoneNumber: string, purpose: OTPPurpose, provider: OTPProvider = 'firebase'): OtpSendResult => { // دالة إرسال OTP
	const carrier = detectCarrier(phoneNumber) ?? 'asiacell'; // تقدير شركة الاتصالات
	const sessionId = `otp_${Math.random().toString(36).slice(2, 10)}`; // توليد معرف جلسة
	const code = generateOtpCode(); // توليد الرمز
	const createdAt = nowIso(); // وقت الإنشاء
	const entry: OTPEntry = { sessionId, phoneNumber, carrier, provider, purpose, code, attempts: 0, maxAttempts: otpPolicy.maxAttempts, status: 'pending', expiresAt: addSeconds(createdAt, otpPolicy.expirySeconds), cooldownUntil: addSeconds(createdAt, otpPolicy.cooldownSeconds), lastSentAt: createdAt, verifiedAt: null, createdAt, updatedAt: createdAt }; // كيان الجلسة
	otpCodes.unshift(entry); // إضافة في المقدمة
	otpBySession[sessionId] = entry; // تحديث الخريطة
	return { otpSession: sessionId, phoneNumber, expiresIn: otpPolicy.expirySeconds, attemptsRemaining: otpPolicy.maxAttempts, carrier, provider }; // نتيجة الإرسال
}; // نهاية sendOtp

// التحقق من OTP (محاكاة) // يحاكي POST /auth/otp/verify
export const verifyOtp = (otpSession: string, code: string, at: ISODateString = nowIso()): { verified: true; phoneNumber: string; verifiedAt: ISODateString } | { verified: false; error: { code: 'INVALID_OTP' | 'EXPIRED_OTP' | 'BLOCKED_OTP'; message: string; details: { attemptsRemaining: number; cooldownUntil: ISODateString | null } } } => { // دالة التحقق
	const entry = otpBySession[otpSession]; // جلب الجلسة
	if (!entry) return { verified: false, error: { code: 'INVALID_OTP', message: 'جلسة غير معروفة', details: { attemptsRemaining: 0, cooldownUntil: null } } }; // جلسة مفقودة
	if (isExpired(entry, at)) { entry.status = 'expired'; entry.updatedAt = at; return { verified: false, error: { code: 'EXPIRED_OTP', message: 'انتهت صلاحية الرمز', details: { attemptsRemaining: attemptsRemaining(entry), cooldownUntil: entry.cooldownUntil ?? null } } }; } // صلاحية منتهية
	if (entry.status === 'blocked') return { verified: false, error: { code: 'BLOCKED_OTP', message: 'تم حظر الجلسة بعد محاولات فاشلة', details: { attemptsRemaining: 0, cooldownUntil: entry.cooldownUntil ?? null } } }; // محظور
	if (!canAttempt(entry, at)) return { verified: false, error: { code: 'INVALID_OTP', message: 'محاولة غير مسموحة حالياً (مبرّد أو لا توجد محاولات)', details: { attemptsRemaining: attemptsRemaining(entry), cooldownUntil: entry.cooldownUntil ?? null } } }; // لا يمكن المحاولة
	if (entry.code === code) { entry.status = 'verified'; entry.verifiedAt = at; entry.updatedAt = at; return { verified: true, phoneNumber: entry.phoneNumber, verifiedAt: at }; } // نجاح
	entry.attempts += 1; // زيادة المحاولات
	entry.updatedAt = at; // تحديث الوقت
	entry.cooldownUntil = addSeconds(at, otpPolicy.cooldownSeconds); // تفعيل مبرّد
	if (attemptsRemaining(entry) <= 0) { entry.status = 'blocked'; } // حظر عند الاستهلاك
	return { verified: false, error: { code: 'INVALID_OTP', message: 'رمز التحقق غير صحيح', details: { attemptsRemaining: attemptsRemaining(entry), cooldownUntil: entry.cooldownUntil ?? null } } }; // فشل
}; // نهاية verifyOtp

// إعادة إرسال OTP (محاكاة) // يحاكي POST /auth/otp/resend
export const resendOtp = (otpSession: string, at: ISODateString = nowIso()): OtpSendResult | { error: { code: 'CANNOT_RESEND' | 'SESSION_NOT_FOUND' | 'EXPIRED_OTP' | 'BLOCKED_OTP'; message: string } } => { // دالة إعادة الإرسال
	const entry = otpBySession[otpSession]; // جلب الجلسة
	if (!entry) return { error: { code: 'SESSION_NOT_FOUND', message: 'الجلسة غير موجودة' } }; // جلسة مفقودة
	if (entry.status === 'blocked') return { error: { code: 'BLOCKED_OTP', message: 'الجلسة محظورة' } }; // محظور
	if (isExpired(entry, at)) { entry.status = 'expired'; entry.updatedAt = at; return { error: { code: 'EXPIRED_OTP', message: 'انتهت صلاحية الجلسة' } }; } // منتهية الصلاحية
	if (!canResend(entry, at)) return { error: { code: 'CANNOT_RESEND', message: 'لا يمكن إعادة الإرسال الآن (مبرّد نشط)' } }; // مبرّد فعّال
	entry.code = generateOtpCode(); // توليد رمز جديد
	entry.lastSentAt = at; // تحديث وقت الإرسال
	entry.cooldownUntil = addSeconds(at, otpPolicy.cooldownSeconds); // تحديث المبرّد
	entry.updatedAt = at; // تحديث عام
	return { otpSession: entry.sessionId, phoneNumber: entry.phoneNumber, expiresIn: Math.max(0, Math.floor((new Date(entry.expiresAt).getTime() - new Date(at).getTime()) / 1000)), attemptsRemaining: attemptsRemaining(entry), carrier: entry.carrier, provider: entry.provider }; // نتيجة الإرسال
}; // نهاية resendOtp

// سجل تجميعي سريع (Registry) // لمراقبة الحالة في الواجهات
export const otpRegistry = { // كائن السجل
	version: OTP_SCHEMA_VERSION, // نسخة المخطط
	count: otpCodes.length, // عدد الجلسات
	bySession: otpBySession, // خريطة حسب sessionId
	pending: otpCodes.filter(o => o.status === 'pending'), // قائمة المعلّق
	verified: otpCodes.filter(o => o.status === 'verified'), // قائمة المتحقق
	blocked: otpCodes.filter(o => o.status === 'blocked'), // قائمة المحظور
}; // نهاية السجل

// OTP V2.1 - نظام أكواد التحقق // تذييل تعريفي
