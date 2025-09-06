// ================================ // نظام الإشعارات (Notifications) - SSOT V2.1
// - نموذج موحّد للإشعارات وقنوات التوصيل وفق مستند 03-api/features/06-notifications.md // التزام بالشكل والحقول
// - متوافق مع بيانات الموك القديمة في src/data/notifications.ts وواجهاتها في src/data/types.ts // تخفيض كلفة التوافق
// ================================

import type { ISODateString } from '../types/core'; // نوع تاريخ ISO من الأنواع الأساسية
import { resolveUserId } from '../core/users'; // حل userId موحد (FK -> users)

export const NOTIFICATIONS_SCHEMA_VERSION = '2.1.0'; // نسخة مخطط الإشعارات

// الفئات العليا (للتقارير والتفضيلات) // من الوثائق: project|payment|message|system|marketing
export type NotificationCategory = 'project' | 'payment' | 'message' | 'system' | 'marketing'; // فئة الإشعار

// أنواع الأحداث التفصيلية (للاستخدام داخل الفئات) // متوافقة مع الموك القديم
export type NotificationEvent = // أحداث دقيقة تعكس الحالات الشائعة
	| 'project_update' // تحديث مشروع عام
	| 'project_milestone' // إنجاز مرحلة مشروع
	| 'project_assigned' // تعيين مبدع لمشروع
	| 'project_delivery' // إشعار جاهزية التسليم
	| 'payment_reminder' // تذكير دفع
	| 'quote_sent' // إرسال عرض سعر
	| 'contract_signed' // توقيع عقد
	| 'admin_action_required' // إجراء أدمن مطلوب
	| 'message'; // رسالة/محادثة

// الأولوية // من الوثائق: low|medium|high|urgent
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'; // مستوى الأهمية

// الحالة العامة للقراءة في التطبيق // من الوثائق: unread|read
export type NotificationStatus = 'unread' | 'read'; // حالة القراءة

// إجراء تفاعلي ضمن الإشعار // متوافق مع src/data/types.ts NotificationAction
export interface SystemNotificationAction { // تعريف إجراء الإشعار
	type: 'view' | 'approve' | 'reject' | 'pay' | 'accept' | 'decline' | 'download' | 'review' | 'feedback' | 'reply' | 'view_gallery' | 'approve_delivery'; // نوع الإجراء
	label: string; // اسم الزر/الوصف
	url: string; // رابط التنفيذ
} // نهاية SystemNotificationAction

// قنوات التوصيل وحالاتها // مستوحاة من قسم التتبع والتسليم بالوثائق
export type ChannelDeliveryStatus = 'queued' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'; // حالة التوصيل

export interface InAppDelivery { status: ChannelDeliveryStatus; deliveredAt?: ISODateString; readAt?: ISODateString | null; clickedAt?: ISODateString | null; actions?: Array<{ action: string; clickedAt: ISODateString }>; } // قناة داخل التطبيق
export interface EmailDelivery { status: ChannelDeliveryStatus; deliveredAt?: ISODateString; openedAt?: ISODateString | null; clickedAt?: ISODateString | null; subject?: string; spamScore?: number; } // قناة البريد الإلكتروني
export interface SmsDelivery { status: ChannelDeliveryStatus; deliveredAt?: ISODateString; provider?: 'twilio' | 'local_gateway'; errorCode?: string; } // قناة الرسائل القصيرة
export interface WhatsappDelivery { status: ChannelDeliveryStatus; deliveredAt?: ISODateString; provider?: 'twilio' | 'meta'; errorCode?: string; } // قناة واتساب

export interface DeliveryChannels { inApp?: InAppDelivery; email?: EmailDelivery; sms?: SmsDelivery; whatsapp?: WhatsappDelivery; } // حاوية حالات القنوات

// كيان الإشعار الموحد (نسخة النظام) // لا يتعارض بالاسم مع Notification الموجودة في data/types.ts
export interface SystemNotification { // تعريف إشعار النظام
	id: string; // معرف الإشعار
	recipientId: string; // مستلم الإشعار (user id)
	recipientType: 'client' | 'creator' | 'admin' | 'employee'; // نوع المستلم
	category: NotificationCategory; // الفئة العليا
	event: NotificationEvent; // الحدث التفصيلي
	priority: NotificationPriority; // الأولوية
	status: NotificationStatus; // حالة القراءة العامة
	title: string; // عنوان الإشعار
	message: string; // نص الإشعار
	details?: Record<string, string | number | boolean | Date>; // تفاصيل سياقية
	actions?: SystemNotificationAction[]; // إجراءات تفاعلية
	channels?: DeliveryChannels; // حالات القنوات
	createdAt: ISODateString; // تاريخ الإنشاء
	updatedAt: ISODateString; // تاريخ التحديث
	expiresAt?: ISODateString | null; // صلاحية الإنتهاء
	readAt?: ISODateString | null; // وقت القراءة
	clickedAt?: ISODateString | null; // وقت النقر العام
} // نهاية SystemNotification

// تفضيلات المستخدم // من قسم التفضيلات في الوثائق
export interface NotificationPreferences { // تفضيلات الإشعارات للمستخدم
	userId: string; // معرف المستخدم
	channels: { // إعدادات القنوات
		inApp: { enabled: boolean; priority: 'all' | 'high_only' | 'urgent_only'; }; // داخل التطبيق
		email: { enabled: boolean; frequency: 'immediate' | 'daily' | 'weekly'; quietHours?: { enabled: boolean; start: string; end: string; timezone?: string; }; }; // البريد
		sms: { enabled: boolean; phone?: string; priority: 'urgent_only' | 'high_only' | 'all'; }; // الرسائل القصيرة
		whatsapp: { enabled: boolean; phone?: string; priority: 'high_only' | 'all'; }; // واتساب
	}; // نهاية القنوات
	categories: Partial<Record<'project_updates' | 'payment_reminders' | 'messages' | 'marketing' | 'system_updates', { enabled: boolean; channels: Array<'inApp' | 'email' | 'sms' | 'whatsapp'>; priority?: NotificationPriority; }>>; // إعدادات الفئات
	language: 'ar' | 'en'; // اللغة
	timezone: string; // المنطقة الزمنية
} // نهاية NotificationPreferences

// سياسة القنوات الافتراضية (After) // من الوثائق: تعيين مبدع→ In-App+Email، طلب تعديل→ In-App+SMS، موافقة نهائية→ In-App+Email، مع فولباك SMS→Email
export const channelPolicy = (event: NotificationEvent): { inApp: boolean; email: boolean; sms: boolean; whatsapp: boolean } => { // سياسة قنوات افتراضية
	switch (event) { // اختيار حسب الحدث
		case 'project_assigned': return { inApp: true, email: true, sms: false, whatsapp: false }; // تعيين مبدع
		case 'project_update': return { inApp: true, email: true, sms: false, whatsapp: false }; // تحديث مشروع
		case 'project_delivery': return { inApp: true, email: true, sms: false, whatsapp: false }; // موافقة/تسليم نهائي
		case 'payment_reminder': return { inApp: true, email: true, sms: false, whatsapp: false }; // تذكير دفع
		case 'message': return { inApp: true, email: false, sms: true, whatsapp: true }; // رسائل فورية
		case 'admin_action_required': return { inApp: true, email: true, sms: true, whatsapp: false }; // طارئ للأدمن
		default: return { inApp: true, email: true, sms: false, whatsapp: false }; // افتراضي
	} // نهاية switch
}; // نهاية السياسة

// فولباك فشل SMS إلى Email // محاكاة بسيطة للفولباك المذكور
export const applySmsFallback = (channels: { inApp: boolean; email: boolean; sms: boolean; whatsapp: boolean }, smsFailed: boolean): { inApp: boolean; email: boolean; sms: boolean; whatsapp: boolean } => ({ // تفعيل الفولباك
	...channels, // قنوات الأصل
	email: channels.email || (smsFailed ? true : false), // تمكين البريد إذا فشل SMS
}); // نهاية الفولباك

// بيانات نموذجية للإشعارات // متوافقة مع الوثائق وأسماء الحقول
// حل userId من Registry موحّد؛ يمكن استبداله لاحقاً بوحدة users الحقيقية
const resolveUserIdForRecipient = (entityId: string): string => resolveUserId(entityId);

export const systemNotifications: SystemNotification[] = [ // مصفوفة إشعارات النظام
	{ // تحديث مشروع للعميل (غير مقروء)
		id: 'notif_123abc', // معرف الإشعار
		recipientId: resolveUserIdForRecipient('client_002'), // مطابق لمشروع المطعم
		recipientType: 'client', // نوع المستلم
		category: 'project', // فئة المشروع
		event: 'project_update', // حدث تحديث المشروع
		priority: 'high', // أولوية عالية
		status: 'unread', // غير مقروء
		title: 'تحديث مشروع تصوير منتجات المطعم', // عنوان عربي
		message: 'تم رفع الصور النهائية للمراجعة', // رسالة عربية موجزة
		details: { projectId: 'p_001_restaurant', projectTitle: 'تصوير منتجات - Iraq Burger', deliverables: 20, actionRequired: true }, // تفاصيل مرتبطة
		actions: [ // إجراءات سريعة
			{ type: 'view', label: 'عرض الصور', url: '/projects/p_001_restaurant/gallery' }, // عرض المعرض
			{ type: 'approve', label: 'الموافقة على التسليم', url: '/projects/p_001_restaurant/approve' }, // اعتماد التسليم
		], // نهاية الإجراءات
		channels: { inApp: { status: 'delivered', deliveredAt: '2025-09-01T16:00:01.000Z', readAt: null, clickedAt: null }, email: { status: 'delivered', deliveredAt: '2025-09-01T16:00:05.000Z', subject: 'تحديث مشروعك' } }, // حالات القنوات
		createdAt: '2025-09-01T16:00:00.000Z', // تاريخ الإنشاء
		updatedAt: '2025-09-01T16:00:00.000Z', // تاريخ التحديث
		expiresAt: '2025-09-08T16:00:00.000Z', // صلاحية الانتهاء
		readAt: null, // لم تُقرأ بعد
		clickedAt: null, // لم يتم النقر
	}, // نهاية العنصر الأول
	{ // تذكير دفع (مقروء)
		id: 'notif_456def', // معرف الإشعار
		recipientId: resolveUserIdForRecipient('client_002'), // يبقى للفاتورة الخاصة بمشروع الصالون
		recipientType: 'client', // نوع المستلم
		category: 'payment', // فئة الدفع
		event: 'payment_reminder', // تذكير بالدفع
		priority: 'medium', // أولوية متوسطة
		status: 'read', // مُقروء
		title: 'تذكير بموعد دفع الفاتورة', // عنوان عربي
		message: 'فاتورة INV-2025-001234 مستحقة خلال 3 أيام', // رسالة عربية
		details: { invoiceId: 'inv_002_salon', invoiceNumber: 'INV-2025-001234', amount: 308000, currency: 'IQD', dueDate: '2025-09-15T23:59:59.000Z', overdueDays: 0 }, // تفاصيل الفاتورة
		actions: [ // إجراءات
			{ type: 'pay', label: 'دفع الآن', url: '/invoices/inv_002_salon/pay' }, // دفع فوري
			{ type: 'view', label: 'عرض الفاتورة', url: '/invoices/inv_002_salon' }, // عرض
		], // نهاية الإجراءات
		channels: { inApp: { status: 'delivered', deliveredAt: '2025-09-12T09:00:01.000Z', readAt: '2025-09-12T10:30:00.000Z', clickedAt: null }, email: { status: 'delivered', deliveredAt: '2025-09-12T09:00:05.000Z', openedAt: '2025-09-12T10:15:00.000Z' } }, // قنوات التوصيل
		createdAt: '2025-09-12T09:00:00.000Z', // الإنشاء
		updatedAt: '2025-09-12T10:30:00.000Z', // التحديث
		readAt: '2025-09-12T10:30:00.000Z', // وقت القراءة
	}, // نهاية العنصر الثاني
	{ // رسالة محادثة (مقروءة ومنقورة)
		id: 'notif_789ghi', // معرف الإشعار
		recipientId: resolveUserIdForRecipient('client_002'), // مطابق لهوية مشروع المطعم
		recipientType: 'client', // النوع
		category: 'message', // فئة الرسائل
		event: 'message', // حدث الرسالة
		priority: 'low', // أولوية منخفضة
		status: 'read', // حالة القراءة
		title: 'رسالة جديدة من المبدع', // عنوان عربي
		message: 'فاطمة الزهراء أرسلت رسالة حول موعد التصوير', // نص الرسالة
		details: { senderId: 'creator_001', senderName: 'سيف ذاخر العزاوي', senderRole: 'creator', messagePreview: 'أود تأكيد موعد جلسة التصوير غداً...', conversationId: 'conv_123abc' }, // تفاصيل المرسل (ID صالح)
		actions: [ { type: 'view', label: 'فتح المحادثة', url: '/messages/conv_123abc' } ], // إجراء واحد
		channels: { inApp: { status: 'delivered', deliveredAt: '2025-08-27T14:30:10.000Z', readAt: '2025-08-27T15:00:00.000Z', clickedAt: '2025-08-27T15:01:00.000Z', actions: [{ action: 'reply', clickedAt: '2025-08-27T15:01:00.000Z' }] } }, // قناة داخل التطبيق
		createdAt: '2025-08-27T14:30:00.000Z', // الإنشاء
		updatedAt: '2025-08-27T15:01:00.000Z', // التحديث
		readAt: '2025-08-27T15:00:00.000Z', // القراءة
		clickedAt: '2025-08-27T15:01:00.000Z', // النقر
	}, // نهاية العنصر الثالث
]; // نهاية بيانات الإشعارات

// خرائط مساعدة // وصول سريع حسب المعرف
export const notificationById: Record<string, SystemNotification> = Object.fromEntries(systemNotifications.map(n => [n.id, n])); // خريطة إشعار حسب id

// قائمة مع فلترة بسيطة // status/type/priority
export const listNotifications = (filter?: { status?: NotificationStatus | 'all'; category?: NotificationCategory; priority?: NotificationPriority }): SystemNotification[] => { // إرجاع قائمة بالإشعارات
	let items = systemNotifications.slice(); // نسخة من القائمة
	if (filter?.status && filter.status !== 'all') items = items.filter(n => n.status === filter.status); // فلترة الحالة
	if (filter?.category) items = items.filter(n => n.category === filter.category); // فلترة الفئة
	if (filter?.priority) items = items.filter(n => n.priority === filter.priority); // فلترة الأولوية
	return items; // إرجاع العناصر
}; // نهاية الدالة

// تحديد إشعار كمقروء // يحاكي PUT /notifications/{id}/mark-read
export const markNotificationRead = (id: string, readAt: ISODateString = new Date().toISOString()): SystemNotification | undefined => { // وضع مقروء
	const n = notificationById[id]; // جلب الإشعار
	if (!n) return undefined; // إن لم يوجد
	n.status = 'read'; // تحديث الحالة
	n.readAt = readAt; // وقت القراءة
	n.channels = { ...(n.channels ?? {}), inApp: { ...(n.channels?.inApp ?? { status: 'delivered' as ChannelDeliveryStatus }), readAt } }; // تحديث قناة inApp
	n.updatedAt = readAt; // تحديث التوقيت
	return n; // إرجاع الكائن
}; // نهاية الدالة

// تحديد الكل كمقروء // يحاكي POST /notifications/mark-all-read
export const markAllNotificationsRead = (filter?: { category?: NotificationCategory; olderThan?: ISODateString }): { count: number; previousUnread: number; newUnread: number } => { // وضع الجميع مقروء
	const now = new Date().toISOString(); // توقيت التنفيذ
	const match = (n: SystemNotification) => (!filter?.category || n.category === filter.category) && (!filter?.olderThan || n.createdAt < filter.olderThan!) && n.status === 'unread'; // شرط المطابقة
	const previousUnread = systemNotifications.filter(n => n.status === 'unread').length; // قبل التنفيذ
	let count = 0; // عداد التحديث
	for (const n of systemNotifications) { if (match(n)) { n.status = 'read'; n.readAt = now; n.updatedAt = now; count++; } } // حلقة التحديث
	const newUnread = systemNotifications.filter(n => n.status === 'unread').length; // بعد التنفيذ
	return { count, previousUnread, newUnread }; // إحصاءات التغيير
}; // نهاية الدالة

// تتبع النقر // يحاكي GET /notifications/{id}/delivery-status - تحديث clickedAt
export const trackNotificationClick = (id: string, action?: string, at: ISODateString = new Date().toISOString()): SystemNotification | undefined => { // تتبع النقر
	const n = notificationById[id]; // جلب الإشعار
	if (!n) return undefined; // غير موجود
	n.clickedAt = at; // تعيين وقت النقر
	n.channels = { ...(n.channels ?? {}), inApp: { ...(n.channels?.inApp ?? { status: 'delivered' as ChannelDeliveryStatus }), clickedAt: at, actions: action ? [ ...(n.channels?.inApp?.actions ?? []), { action, clickedAt: at } ] : n.channels?.inApp?.actions } }; // تحديث قناة inApp
	n.updatedAt = at; // تحديث وقت التعديل
	return n; // إرجاع الإشعار
}; // نهاية الدالة

// إنشاء إشعار جديد وإضافته // للتجارب والقصص
export const createNotification = (entry: Omit<SystemNotification, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string; createdAt?: ISODateString; updatedAt?: ISODateString; status?: NotificationStatus }): SystemNotification => { // منشئ إشعار
	const now = new Date().toISOString(); // وقت الآن
	const id = entry.id ?? `notif_${Math.random().toString(36).slice(2, 9)}`; // توليد معرف
	const notification: SystemNotification = { // بناء الكائن
		id, // المعرف
		recipientId: entry.recipientId, // المستلم
		recipientType: entry.recipientType, // نوع المستلم
		category: entry.category, // الفئة
		event: entry.event, // الحدث
		priority: entry.priority, // الأولوية
		status: entry.status ?? 'unread', // الحالة الافتراضية
		title: entry.title, // العنوان
		message: entry.message, // الرسالة
		details: entry.details, // التفاصيل
		actions: entry.actions, // الإجراءات
		channels: entry.channels, // القنوات
		createdAt: entry.createdAt ?? now, // الإنشاء
		updatedAt: entry.updatedAt ?? now, // التحديث
		expiresAt: entry.expiresAt ?? null, // الانتهاء
		readAt: entry.readAt ?? null, // القراءة
		clickedAt: entry.clickedAt ?? null, // النقر
	}; // نهاية الكائن
	systemNotifications.unshift(notification); // إدراج في المقدمة
	notificationById[id] = notification; // تحديث الخريطة
	return notification; // إرجاع العنصر الجديد
}; // نهاية المنشئ

// ملخص سريع للإحصاءات // مطابق لقسم الملخص في الوثائق
export const getNotificationsSummary = () => { // دالة ملخص
	const total = systemNotifications.length; // إجمالي الإشعارات
	const unread = systemNotifications.filter(n => n.status === 'unread').length; // عدد غير المقروء
	const urgent = systemNotifications.filter(n => n.priority === 'urgent').length; // عدد العاجل
	type DetailsWithAction = { actionRequired?: boolean } & Record<string, unknown>; // نوع مساعد للتضييق
	const actionRequired = systemNotifications.filter(n => (n.details as DetailsWithAction)?.actionRequired === true).length; // يحتاج إجراء
	return { total, unread, urgent, actionRequired }; // كائن الملخص
}; // نهاية الدالة

// سجل تجميعي (Registry) // لتوحيد الاستهلاك
export const notificationsRegistry = { // كائن السجل
	version: NOTIFICATIONS_SCHEMA_VERSION, // نسخة المخطط
	count: systemNotifications.length, // عدد العناصر
	all: systemNotifications, // جميع الإشعارات
	byId: notificationById, // خريطة حسب المعرف
}; // نهاية السجل

// Notifications V2.1 - نظام الإشعارات // تذييل تعريفي
