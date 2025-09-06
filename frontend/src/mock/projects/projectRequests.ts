// ================================ // ملف منظم
// طلبات المشاريع (Project Requests) V2.1 - SSOT // وصف عام
// - يحوّل طلب العميل إلى مهام قابلة للتسعير ثم مسودة مشروع // الهدف
// - يستهلك: clients + industries + subcategories + pricing // الترابط
// - يلتزم بقاعدة: requestSubcategoryId لا تتغير بعد التحويل // سياسة
// ================================ // فاصل

import type { // استيراد أنواع التسعير
	ProcessingLevel, // مستوى المعالجة
	ExperienceLevel, // مستوى الخبرة
	EquipmentTier, // فئة المعدات
	RushKey, // مفتاح الاستعجال
	LocationKey, // موقع التنفيذ
	OwnershipKey, // ملكية المعدات
} from '../types/pricing'; // مصدر الأنواع القياسية
import type { // استيراد أنواع المشاريع
	ProjectTask, // نوع المهمة
	UnifiedProject, // نوع المشروع الموحد
	ProjectTotals, // نوع الإجماليات
	SimpleUserRef, // مرجع مستخدم مبسط
} from '../types/projects'; // مصدر الأنواع
import { createTaskAndSuggest } from './tasks'; // منشئ المهمة مع التسعير + اقتراح
import { // خدمات الفئات الفرعية
	getSubcategoryById, // جلب كائن الفئة
} from '../services/subcategories'; // مصدر SSOT للفئات
import { // خدمات الصناعات
	getIndustryById, // جلب كائن الصناعة
} from '../services/industries'; // مصدر SSOT للصناعات
import { clientById } from '../core/clients'; // مصدر SSOT للعملاء
import { calculateProjectTotalsFromTasks } from '../pricing/calculations'; // حساب إجماليات المشروع
import { systemSettings } from '../system/systemSettings'; // إعدادات النظام (هامش الوكالة)
import { nowIso } from '../utils'; // أداة وقت موحّدة

// ...تم استبدال nowIso المحلي بنسخة utils

// تحويل معرف فئة رئيسية إلى فئة مشروع // تعيين ثابت
const toProjectCategory = (categoryId?: string): UnifiedProject['category'] => { // دالة الماب
	if (categoryId === 'cat_photo') return 'photography'; // تصوير
	if (categoryId === 'cat_video') return 'videography'; // فيديو
	if (categoryId === 'cat_design') return 'design'; // تصميم
	if (categoryId === 'cat_editing') return 'editing'; // مونتاج
	return 'mixed'; // افتراضي
}; // نهاية الدالة

// حالات الطلب (وفق الوثائق) // قيم مسموحة
export type ProjectRequestStatus = // نوع الحالة
	| 'pending' // بانتظار المعالجة
	| 'reviewing' // قيد المراجعة
	| 'approved' // موافَق عليه
	| 'rejected' // مرفوض
	| 'converted'; // تم تحويله

// واجهة طلب مشروع موحّدة // عقد الإدخال
export interface ProjectRequest { // نوع الطلب
	id: string; // معرف الطلب
	clientId: string; // معرف العميل
	industryId: string; // معرف الصناعة
	subcategoryId: string; // فئة فرعية مطلوبة
	quantity: number; // الكمية المطلوبة
	processing: ProcessingLevel; // مستوى المعالجة
	experience: ExperienceLevel; // مستوى الخبرة
	equipment: EquipmentTier; // فئة المعدات
	rush: RushKey; // استعجال التنفيذ
	ownership: OwnershipKey; // ملكية المعدات
	location: LocationKey; // موقع التنفيذ
	profileMultiplier?: number; // معامل ملف المبدع
	requestedDate: string; // تاريخ الطلب
	desiredDeadline: string; // الموعد المرغوب للتسليم
	notes?: string; // ملاحظات إضافية
	status: ProjectRequestStatus; // حالة الطلب
	createdAt?: string; // تاريخ الإنشاء (دعم للفهرسة)
	updatedAt?: string; // تاريخ التحديث (دعم للفهرسة)
} // نهاية الواجهة

// نسخة مخطط الطلبات // لتوثيق الإصدار
export const PROJECT_REQUESTS_SCHEMA_VERSION = '2.1.0'; // الإصدار

// بيانات تجريبية صغيرة (seed) // أمثلة عملية
export const projectRequests: ProjectRequest[] = [ // مصفوفة الطلبات
	{ // طلب 1
		id: 'req_001_restaurant_product', // معرف
		clientId: 'client_001', // عميل
		industryId: 'ind_food', // صناعة
		subcategoryId: 'sub_product_photo', // فئة فرعية
		quantity: 12, // كمية
		processing: 'basic', // معالجة
		experience: 'experienced', // خبرة
		equipment: 'gold', // معدات
		rush: 'normal', // استعجال
		ownership: 'owned', // ملكية
		location: 'client', // موقع
		profileMultiplier: 1.0, // معامل ملف
		requestedDate: '2025-08-18T09:00:00.000Z', // تاريخ الطلب
		desiredDeadline: '2025-09-01T17:00:00.000Z', // الموعد المرغوب
		notes: 'منتجات برغر وصوصات بعدد 12 قطعة', // ملاحظات
		status: 'approved', // حالة
		createdAt: '2025-08-18T09:00:00.000Z',
		updatedAt: '2025-08-18T09:00:00.000Z',
	}, // نهاية العنصر
	{ // طلب 2
		id: 'req_002_salon_reels', // معرف
		clientId: 'client_002', // عميل
		industryId: 'ind_beauty', // صناعة
		subcategoryId: 'sub_reels_30s', // فئة فرعية
		quantity: 3, // كمية
		processing: 'color_correction', // معالجة
		experience: 'expert', // خبرة
		equipment: 'platinum', // معدات
		rush: 'rush', // استعجال
		ownership: 'agency_equipment', // ملكية
		location: 'outskirts', // موقع
		profileMultiplier: 1.1, // معامل ملف
		requestedDate: '2025-08-20T08:30:00.000Z', // تاريخ
		desiredDeadline: '2025-09-05T18:00:00.000Z', // موعد
		notes: '3 ريلز لإعلان الصالون مع لقطات قبل/بعد', // ملاحظات
		status: 'approved', // حالة
		createdAt: '2025-08-20T08:30:00.000Z',
		updatedAt: '2025-08-20T08:30:00.000Z',
	}, // نهاية العنصر
	{ // طلب 3
		id: 'req_004_personal_session', // معرف
		clientId: 'client_001', // عميل
		industryId: 'ind_beauty', // صناعة (was ind_personal → unified to valid SSOT id)
		subcategoryId: 'sub_portrait', // فئة فرعية
		quantity: 5, // كمية
		processing: 'full_retouch', // معالجة
		experience: 'experienced', // خبرة
		equipment: 'gold', // معدات
		rush: 'normal', // استعجال
		ownership: 'owned', // ملكية
		location: 'studio', // موقع
		profileMultiplier: 1.0, // معامل ملف
		requestedDate: '2025-08-22T10:00:00.000Z', // تاريخ
		desiredDeadline: '2025-09-03T16:00:00.000Z', // موعد
		notes: 'جلسة شخصية داخل الاستوديو', // ملاحظات
		status: 'reviewing', // حالة
		createdAt: '2025-08-22T10:00:00.000Z',
		updatedAt: '2025-08-22T10:00:00.000Z',
	}, // نهاية العنصر
]; // نهاية المصفوفة

// فهارس مساعدة للوصول السريع // خرائط
export const projectRequestMap: Record<string, ProjectRequest> = Object.fromEntries( // بناء خريطة
	projectRequests.map((r) => [r.id, r]) // تحويل إلى أزواج
); // نهاية الخريطة
export const listProjectRequests = (): ProjectRequest[] => projectRequests.slice(); // جميع الطلبات
export const listPendingRequests = (): ProjectRequest[] => projectRequests.filter((r) => r.status === 'pending' || r.status === 'reviewing'); // بانتظار/مراجعة

// تلخيص سريع لحالات الطلبات // تقرير مبسط
export const getProjectRequestsSummary = () => { // دالة التلخيص
	const total = projectRequests.length; // العدد الكلي
	const byStatus: Record<ProjectRequestStatus, number> = { // عدّاد حسب الحالة
		pending: 0, // بانتظار
		reviewing: 0, // مراجعة
		approved: 0, // موافَق
		rejected: 0, // مرفوض
		converted: 0, // محوّل
	}; // نهاية الكائن
	for (const r of projectRequests) byStatus[r.status]++; // تحديث العدادات
	return { total, byStatus }; // نتيجة التلخيص
}; // نهاية الدالة

// بناء مهمة واحدة من طلب // تحويل مباشر
const buildTaskFromRequest = (params: { // عقد الإدخال
	req: ProjectRequest; // الطلب
	projectId: string; // معرف المشروع الناتج
	taskId?: string; // معرف المهمة الاختياري
	clientCity?: import('../types/entities').CreatorCity; // مدينة العميل للسياق
}): ProjectTask => { // نوع الخرج
	const sub = getSubcategoryById(params.req.subcategoryId); // جلب كائن الفئة
	const categoryId = sub?.categoryId ?? 'cat_unknown'; // تحديد الفئة الرئيسية
	const baseInput = { // مدخلات الإنشاء
		id: params.taskId ?? `t_from_${params.req.id}`, // معرف المهمة
		projectId: params.projectId, // ربط بالمشروع
		categoryId, // فئة رئيسية
		subcategoryId: params.req.subcategoryId, // فئة فرعية
		quantity: params.req.quantity, // كمية
		processing: params.req.processing, // معالجة
		experience: params.req.experience, // خبرة
		equipment: params.req.equipment, // معدات
		rush: params.req.rush, // استعجال
		ownership: params.req.ownership, // ملكية
		location: params.req.location, // موقع
		profileMultiplier: params.req.profileMultiplier, // معامل ملف
		estimatedHours: Math.max(1, Math.ceil(params.req.quantity / 3)), // ساعات تقديرية
		status: 'not_started', // حالة ابتدائية
		requirements: params.req.notes, // متطلبات
		specialInstructions: undefined, // تعليمات خاصة
		notes: undefined, // ملاحظات داخلية
		fileFormat: undefined, // صيغة الملفات
		dimensions: undefined, // أبعاد
		colorProfile: undefined, // ألوان
	} as const;
	// إنشاء مع اقتراحات مباشرةً حسب مدينة العميل وحالة الاستعجال
	return createTaskAndSuggest(baseInput, params.req.industryId, { clientCity: params.clientCity, rush: params.req.rush !== 'normal', dueDate: params.req.desiredDeadline });
}; // نهاية الدالة

// مسودة مشروع ناتجة عن طلب // شكل وسيط
export interface RequestConversionDraft { // نوع المسودة
	project: UnifiedProject; // مشروع موحّد
	tasks: ProjectTask[]; // مهام مشتقة
	pricing: ProjectTotals; // إجماليات
} // نهاية الواجهة

// تحويل طلب إلى مسودة مشروع + مهام // تحويل كامل
export const convertRequestToProjectDraft = (req: ProjectRequest): RequestConversionDraft => { // دالة التحويل
	const sub = getSubcategoryById(req.subcategoryId); // جلب الفئة
	const categoryMain = toProjectCategory(sub?.categoryId); // فئة المشروع
	const projectId = `p_from_${req.id}`; // معرف المشروع الناتج
	const clientCity = clientById[req.clientId]?.location?.city; // مدينة العميل إن وجدت
	const task = buildTaskFromRequest({ req, projectId, clientCity }); // بناء المهمة + اقتراح
	const tasks: ProjectTask[] = [task]; // قائمة المهام
	const marginPercent = systemSettings.defaultMarginPercent; // نسبة الهامش
	const totals: ProjectTotals = calculateProjectTotalsFromTasks({ // حساب الإجماليات
		tasks: tasks.map((t) => ({ // تحويل للمدخل المبسط
			basePrice: t.pricingBasePrice, // أساس
			quantity: t.quantity, // كمية
			totalCreatorPrice: t.pricing?.totalCreatorPrice ?? 0, // إجمالي المبدع
		})), // نهاية التحويل
		marginPercent, // هامش
	}); // نهاية الحساب

	const client: SimpleUserRef = { // مرجع العميل
		id: req.clientId,
		name: clientById[req.clientId]?.name ?? 'Unknown Client',
	};
	const industry = getIndustryById(req.industryId); // جلب الصناعة
	const subNameAr = sub?.nameAr ?? 'خدمة'; // اسم عربي
	const projectName = `${client.name} • ${subNameAr}`; // اسم مختصر
	const projectTitle = `${subNameAr} x${req.quantity}`; // عنوان واضح
	const now = nowIso(); // الآن

	const project: UnifiedProject = { // كائن المشروع
		id: projectId, // معرف
		name: projectName, // اسم
		title: projectTitle, // عنوان
		description: req.notes, // وصف

		clientId: req.clientId, // عميل
		client, // مرجع عميل
		industryId: req.industryId, // صناعة
		industryName: industry?.nameAr, // اسم صناعة

		category: categoryMain, // فئة مشروع
		tasks, // مهام
		pricing: totals, // إجماليات

		status: 'pending', // حالة
		priority: req.rush === 'rush' ? 'urgent' : 'normal', // أولوية
		isRush: req.rush !== 'normal', // مستعجل
		location: req.location, // موقع

		requestedDate: req.requestedDate, // تاريخ الطلب
		approvedDate: undefined, // تاريخ الموافقة
		startDate: undefined, // تاريخ البدء
		deadline: req.desiredDeadline, // الموعد النهائي
		completedDate: undefined, // تاريخ الإنجاز

		originalRequestId: req.id, // ربط بالطلب
		requestSubcategoryId: req.subcategoryId, // فئة الطلب

		createdBy: { id: 'admin_super_001', name: 'Super Admin' }, // منشئ
		approvedBy: undefined, // موافق
		isArchived: false, // مؤرشف؟

		clientRequirements: undefined, // متطلبات عميل
		internalNotes: undefined, // ملاحظات داخلية

		estimatedDuration: Math.max(1, Math.ceil(req.quantity / 3)), // مدة تقديرية
		actualDuration: undefined, // مدة فعلية
		clientSatisfactionRating: undefined, // تقييم

		tags: [sub?.code ?? 'request'], // وسوم
		complexity: 'medium', // تعقيد

		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الكائن

	return { project, tasks, pricing: totals }; // نتيجة التحويل
}; // نهاية الدالة

// تحويل جميع الطلبات الموافق عليها إلى مسودات // أداة دفعية
export const convertApprovedRequestsToDrafts = (): RequestConversionDraft[] => { // دالة جماعية
	return projectRequests // قائمة الطلبات
		.filter((r) => r.status === 'approved') // موافَق عليها
		.map((r) => convertRequestToProjectDraft(r)); // تحويل لكل عنصر
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const projectRequestsRegistry = { // السجل
	version: PROJECT_REQUESTS_SCHEMA_VERSION, // نسخة
	count: projectRequests.length, // عدد
	all: projectRequests, // القائمة
	byId: projectRequestMap, // خريطة
	list: listProjectRequests, // دالة
	listPending: listPendingRequests, // دالة
	convertApproved: convertApprovedRequestsToDrafts, // دالة
}; // نهاية السجل
// Project Requests V2.1 - طلبات المشاريع
