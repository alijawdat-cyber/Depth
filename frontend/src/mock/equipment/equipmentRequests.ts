// ================================ // ملف منظم
// طلبات المعدات (Equipment Requests) V2.1 - SSOT // وصف عام
// - يغطي نوعين: طلبات إضافة معدات جديدة من المبدعين + حجوزات معدات لمشاريع/مهام // النطاق
// - يوفّر فهارس ودوال مساعدة للتحقق من التوفر والانتقالات البسيطة للحالات // الاستخدام
// ================================ // فاصل

import type { EquipmentCategory } from './equipment'; // نوع فئة المعدّة من ملف المعدات

// أداة وقت ISO // مساعدة عامة
const nowIso = (): string => new Date().toISOString(); // إرجاع الآن بصيغة ISO

// أنواع حالة طلب معدّة جديدة // القيم المسموحة
export type NewEquipmentRequestStatus = 'pending' | 'approved' | 'rejected' | 'needs_info'; // الحالات

// أنواع حالة حجز/ارتباط معدّة // دورة حياة الحجز
export type EquipmentBookingStatus = 'requested' | 'approved' | 'in_use' | 'returned' | 'rejected' | 'cancelled'; // الحالات

// نوع equipmentType وفق القاموس (أوسع من EquipmentCategory) // يشمل microphone و tripod
export type EquipmentType = EquipmentCategory | 'microphone' | 'tripod' | 'other'; // أنواع موسعة

// طلب إضافة معدّة جديدة من المبدع // كيان حسب القاموس
export interface NewEquipmentRequest { // واجهة الطلب
	id: string; // معرف الطلب
	creatorId: string; // معرف المبدع مقدم الطلب
	equipmentType: EquipmentType; // نوع المعدة المطلوبة
	brand: string; // الماركة المقترحة
	model: string; // الموديل المقترح
	description?: string; // وصف اختياري
	status: NewEquipmentRequestStatus; // حالة الطلب
	adminNotes?: string; // ملاحظات الأدمن
	rejectionReason?: string; // سبب الرفض إن وجد
	reviewedBy?: string; // من راجع
	reviewedAt?: string; // متى راجع
	createdAt: string; // تاريخ الإنشاء
	updatedAt: string; // آخر تحديث
} // نهاية الواجهة

// ربط/حجز معدّة لمشروع/مهمة // كيان حجز
export interface EquipmentBooking { // واجهة الحجز
	id: string; // معرف الحجز
	equipmentId: string; // معرف المعدّة
	projectId?: string; // معرف المشروع (اختياري)
	taskId?: string; // معرف المهمة (اختياري)
	assignmentType: 'project' | 'task'; // نوع الربط
	requiredFrom: string; // وقت البدء المطلوب (ISO)
	requiredTo: string; // وقت الانتهاء المطلوب (ISO)
	status: EquipmentBookingStatus; // حالة الحجز
	notes?: string; // ملاحظات
	createdBy: string; // من أنشأ الحجز (admin/user)
	createdAt: string; // تاريخ الإنشاء
	updatedAt: string; // آخر تحديث
} // نهاية الواجهة

// نسخة مخطط // لتتبع الإصدار
export const EQUIPMENT_REQUESTS_SCHEMA_VERSION = '2.1.0'; // النسخة

// بيانات seed لطلبات معدّات جديدة // أمثلة عملية
export const newEquipmentRequests: NewEquipmentRequest[] = [ // مصفوفة الطلبات
	{ // طلب 1: كاميرا R6 لمبدع 1
		id: 'eqr_creator001_camera_r6', // معرف
		creatorId: 'creator_001', // مبدع
		equipmentType: 'camera', // نوع
		brand: 'Canon', // ماركة
		model: 'R6 Mark II', // موديل
		description: 'ترقية للكاميرا الحالية لدعم تصوير 4K 60fps', // وصف
		status: 'pending', // حالة
		createdAt: '2025-08-20T10:00:00.000Z', // إنشاء
		updatedAt: '2025-08-20T10:00:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // طلب 2: إضاءة Godox V1 لمبدع 1
		id: 'eqr_creator001_light_v1', // معرف
		creatorId: 'creator_001', // مبدع
		equipmentType: 'lighting', // نوع
		brand: 'Godox', // ماركة
		model: 'V1', // موديل
		description: 'فلاش احترافي للاستوديو والتصوير الخارجي', // وصف
		status: 'approved', // حالة
		reviewedBy: 'admin_super_001', // مراجَع من
		reviewedAt: '2025-08-21T09:30:00.000Z', // وقت المراجعة
		adminNotes: 'موافقة مشروطة بتجربة لمدة شهر', // ملاحظة أدمن
		createdAt: '2025-08-18T08:00:00.000Z', // إنشاء
		updatedAt: '2025-08-21T09:30:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // طلب 3: مايك لمبدع 3 مرفوض
		id: 'eqr_creator003_mic', // معرف
		creatorId: 'creator_003', // مبدع
		equipmentType: 'microphone', // نوع
		brand: 'Rode', // ماركة
		model: 'NTG4+', // موديل
		description: 'مايك شوتغن لتغطية فعاليات', // وصف
		status: 'rejected', // حالة
		reviewedBy: 'admin_001', // مراجَع من
		reviewedAt: '2025-08-22T11:15:00.000Z', // وقت المراجعة
		rejectionReason: 'متوفر بديل في مخزون الوكالة', // سبب الرفض
		createdAt: '2025-08-20T12:00:00.000Z', // إنشاء
		updatedAt: '2025-08-22T11:15:00.000Z', // تحديث
	}, // نهاية العنصر
]; // نهاية القائمة

// بيانات seed لحجوزات معدات مرتبطة بالمشاريع/المهام // أمثلة عمل
export const equipmentBookings: EquipmentBooking[] = [ // مصفوفة الحجوزات
	{ // حجز 1: كاميرا creator_001 لمهمة مطاعم
		id: 'eb_p001_task001_cam', // معرف
		equipmentId: 'eq_creator001_cam', // معرف المعدّة
		projectId: 'p_001_restaurant', // مشروع
		taskId: 't_001_restaurant_product', // مهمة
		assignmentType: 'task', // نوع الربط
		requiredFrom: '2025-08-28T09:00:00.000Z', // من
		requiredTo: '2025-08-28T17:00:00.000Z', // إلى
		status: 'approved', // حالة
		notes: 'استخدام في موقع العميل مع إضاءة إضافية', // ملاحظات
		createdBy: 'admin_super_001', // أنشأه
		createdAt: '2025-08-25T10:00:00.000Z', // إنشاء
		updatedAt: '2025-08-26T14:00:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // حجز 2: إضاءة creator_002 لحجز مشروع صالون
		id: 'eb_p002_light', // معرف
		equipmentId: 'eq_creator002_light', // معرف المعدّة
		projectId: 'p_002_salon_campaign', // مشروع
		assignmentType: 'project', // نوع الربط
		requiredFrom: '2025-09-01T10:00:00.000Z', // من
		requiredTo: '2025-09-03T18:00:00.000Z', // إلى
		status: 'requested', // حالة
		notes: 'تحضير معدات احتياط', // ملاحظات
		createdBy: 'admin_001', // أنشأه
		createdAt: '2025-08-27T09:30:00.000Z', // إنشاء
		updatedAt: '2025-08-27T09:30:00.000Z', // تحديث
	}, // نهاية العنصر
]; // نهاية القائمة

// فهارس سريعة // خرائط للوصول
export const equipmentRequestsByCreator: Record<string, NewEquipmentRequest[]> = newEquipmentRequests.reduce<Record<string, NewEquipmentRequest[]>>( // خريطة طلبات حسب المبدع
	(acc, r) => { // دالة التجميع
		(acc[r.creatorId] ||= []).push(r); // دفع الطلب
		return acc; // إرجاع المجمع
	}, // نهاية الدالة
	{} // قيمة ابتدائية
); // نهاية الخريطة

export const bookingsByEquipment: Record<string, EquipmentBooking[]> = equipmentBookings.reduce<Record<string, EquipmentBooking[]>>( // خريطة حجوزات حسب المعدّة
	(acc, b) => { // دالة التجميع
		(acc[b.equipmentId] ||= []).push(b); // دفع الحجز
		return acc; // إرجاع
	}, // نهاية الدالة
	{} // قيمة ابتدائية
); // نهاية الخريطة

export const bookingsByProject: Record<string, EquipmentBooking[]> = equipmentBookings.reduce<Record<string, EquipmentBooking[]>>( // خريطة حسب المشروع
	(acc, b) => { // دالة التجميع
		if (b.projectId) (acc[b.projectId] ||= []).push(b); // دفع إن توفّر مشروع
		return acc; // إرجاع
	}, // نهاية الدالة
	{} // قيمة ابتدائية
); // نهاية الخريطة

export const bookingsByTask: Record<string, EquipmentBooking[]> = equipmentBookings.reduce<Record<string, EquipmentBooking[]>>( // خريطة حسب المهمة
	(acc, b) => { // دالة التجميع
		if (b.taskId) (acc[b.taskId] ||= []).push(b); // دفع إن توفّرت مهمة
		return acc; // إرجاع
	}, // نهاية الدالة
	{} // قيمة ابتدائية
); // نهاية الخريطة

// التحقق من التداخل الزمني البسيط // أداة
const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => { // هل تتداخل الفترات؟
	const s1 = Date.parse(aStart); // بداية الأولى
	const e1 = Date.parse(aEnd); // نهاية الأولى
	const s2 = Date.parse(bStart); // بداية الثانية
	const e2 = Date.parse(bEnd); // نهاية الثانية
	return s1 < e2 && s2 < e1; // شرط التداخل
}; // نهاية الدالة

// فحص توفر معدّة ضمن فترة // يعتمد على الحجوزات الموافق عليها/قيد الاستخدام
export const isEquipmentAvailable = (equipmentId: string, fromIso: string, toIso: string): boolean => { // توفر المعدّة
	const list = bookingsByEquipment[equipmentId] ?? []; // حجوزات المعدّة
	return !list.some((b) => // لا يوجد تداخل مع حجوزات فعالة
		(b.status === 'approved' || b.status === 'in_use') && overlaps(b.requiredFrom, b.requiredTo, fromIso, toIso) // شرط التداخل
	); // النتيجة
}; // نهاية الدالة

// إنشاء حجز جديد (غير مُثبت) // دالة مبسّطة
export const createBookingDraft = (input: Omit<EquipmentBooking, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { id?: string; status?: EquipmentBookingStatus; }): EquipmentBooking => { // إنشاء مسودة
	const id = input.id ?? `eb_${Math.random().toString(36).slice(2, 8)}`; // توليد معرف
	const now = nowIso(); // الوقت الآن
	return { // كائن الحجز
		...input, // نسخ المدخلات
		id, // معرف
		status: input.status ?? 'requested', // حالة ابتدائية
		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الإرجاع
}; // نهاية الدالة

// انتقالات حالة طلب معدّة جديدة // دوال نقية تعيد نسخة محدّثة
export const approveNewEquipmentRequest = (req: NewEquipmentRequest, reviewedBy: string, adminNotes?: string): NewEquipmentRequest => ({ // موافقة
	...req, // نسخ
	status: 'approved', // حالة
	reviewedBy, // مراجع
	reviewedAt: nowIso(), // وقت
	adminNotes, // ملاحظات
	updatedAt: nowIso(), // تحديث
}); // نهاية الدالة

export const rejectNewEquipmentRequest = (req: NewEquipmentRequest, reviewedBy: string, reason: string): NewEquipmentRequest => ({ // رفض
	...req, // نسخ
	status: 'rejected', // حالة
	reviewedBy, // مراجع
	reviewedAt: nowIso(), // وقت
	rejectionReason: reason, // سبب
	updatedAt: nowIso(), // تحديث
}); // نهاية الدالة

export const requestMoreInfo = (req: NewEquipmentRequest, reviewedBy: string, adminNotes?: string): NewEquipmentRequest => ({ // يحتاج معلومات
	...req, // نسخ
	status: 'needs_info', // حالة
	reviewedBy, // مراجع
	reviewedAt: nowIso(), // وقت
	adminNotes, // ملاحظات
	updatedAt: nowIso(), // تحديث
}); // نهاية الدالة

// استعلامات مساعدة // دوال قراءة
export const listNewEquipmentRequests = (): NewEquipmentRequest[] => newEquipmentRequests.slice(); // جميع الطلبات
export const listRequestsByCreator = (creatorId: string): NewEquipmentRequest[] => equipmentRequestsByCreator[creatorId] ?? []; // حسب المبدع
export const listBookingsByProject = (projectId: string): EquipmentBooking[] => bookingsByProject[projectId] ?? []; // حجوزات مشروع
export const listBookingsByTask = (taskId: string): EquipmentBooking[] => bookingsByTask[taskId] ?? []; // حجوزات مهمة
export const listBookingsByEquipment = (equipmentId: string): EquipmentBooking[] => bookingsByEquipment[equipmentId] ?? []; // حجوزات معدّة

// ملخص سريع // تقارير مبسطة
export const getEquipmentRequestsSummary = () => { // دالة التلخيص
	const totalNew = newEquipmentRequests.length; // عدد طلبات المعدّات الجديدة
	const byStatus: Record<NewEquipmentRequestStatus, number> = { pending: 0, approved: 0, rejected: 0, needs_info: 0 }; // عدّاد حالات
	for (const r of newEquipmentRequests) byStatus[r.status]++; // تحديث العدادات
	const totalBookings = equipmentBookings.length; // عدد الحجوزات
	const activeBookings = equipmentBookings.filter((b) => b.status === 'approved' || b.status === 'in_use').length; // حجوزات فعالة
	return { totalNew, byStatus, totalBookings, activeBookings, generatedAt: nowIso() }; // نتيجة الملخص
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const equipmentRequestsRegistry = { // السجل
	version: EQUIPMENT_REQUESTS_SCHEMA_VERSION, // نسخة
	newRequests: newEquipmentRequests, // بيانات الطلبات
	bookings: equipmentBookings, // بيانات الحجوزات
	byCreator: equipmentRequestsByCreator, // فهرس حسب المبدع
	byEquipment: bookingsByEquipment, // فهرس حسب المعدّة
	byProject: bookingsByProject, // فهرس حسب المشروع
	byTask: bookingsByTask, // فهرس حسب المهمة
	isAvailable: isEquipmentAvailable, // فحص التوفر
	createBookingDraft, // إنشاء مسودة حجز
	approveNew: approveNewEquipmentRequest, // موافقة طلب جديد
	rejectNew: rejectNewEquipmentRequest, // رفض طلب جديد
	requestMoreInfo, // طلب معلومات إضافية
	listNewEquipmentRequests, // قراءة الطلبات
	listBookingsByProject, // قراءة حجوزات مشروع
	listBookingsByTask, // قراءة حجوزات مهمة
	listBookingsByEquipment, // قراءة حجوزات معدّة
	summary: getEquipmentRequestsSummary, // تلخيص
}; // نهاية السجل
// Equipment Requests V2.1 - طلبات المعدات
