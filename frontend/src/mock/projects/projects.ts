// ================================ // ملف منظم
// مشاريع موحّدة (Projects) V2.1 - SSOT // وصف عام
// - يبني UnifiedProject من المهام ويحسب الإجماليات // سياسة
// - يعتمد على tasks + حسابات التسعير + أنواع المشاريع // الترابط
// ================================ // فاصل

import type { UnifiedProject, ProjectTotals } from '../types/projects'; // أنواع المشاريع
import type { ProjectTask } from '../types/projects'; // نوع المهمة
import { tasksByProject, isTaskLate, suggestCreatorsForTask } from './tasks'; // مهام المشروع + كشف التأخير + اقتراحات
import { calculateProjectTotalsFromTasks } from '../pricing/calculations'; // حساب الإجماليات
import { systemSettings } from '../system/systemSettings'; // إعدادات النظام (الهامش)
import { clientById } from '../core/clients'; // العملاء من SSOT
import { nowIso } from '../utils'; // أداة وقت موحّدة

// ...تم استبدال nowIso المحلي بنسخة utils

// مُدخل بناء مشروع مبسط // عقد الإدخال
interface NewProjectInput { // واجهة الإدخال
	id: string; // معرف المشروع
	name: string; // اسم مختصر
	title: string; // عنوان واضح
	description?: string; // وصف
	clientId: string; // معرف العميل
	industryId: string; // معرف الصناعة
	category: UnifiedProject['category']; // فئة المشروع
	location: 'studio' | 'client' | 'nearby' | 'outskirts' | 'far'; // موقع التنفيذ
	isRush?: boolean; // مستعجل
	requestedDate: string; // تاريخ الطلب
	deadline: string; // موعد التسليم
	status?: 'draft' | 'planning' | 'in-progress' | 'review' | 'completed' | 'cancelled' | 'on-hold' | 'pending' | 'active'; // حالة
	priority?: 'low' | 'normal' | 'high' | 'urgent'; // أولوية
	originalRequestId?: string; // طلب أصلي
	requestSubcategoryId?: string; // فئة من الطلب
} // نهاية الواجهة

// بناء مشروع موحّد من مهامه // الدالة الأساسية
// محوّل بسيط لحالات المشاريع نحو SSOT
const normalizeProjectStatus = (s?: NewProjectInput['status']): UnifiedProject['status'] => {
	if (!s) return 'active';
	// توحيد الشرطة السفلية والواصل
	const map: Record<string, UnifiedProject['status']> = {
		draft: 'draft',
		planning: 'planning',
		'in-progress': 'in-progress',
		review: 'review',
		completed: 'completed',
		cancelled: 'cancelled',
		'on-hold': 'on-hold',
		pending: 'pending',
		active: 'active',
	};
	return map[s] ?? 'active';
};

const deriveStatusFromTasks = (tasks: ProjectTask[], fallback: UnifiedProject['status']): UnifiedProject['status'] => {
	if (tasks.length === 0) return fallback;
	const counts = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);
	if ((counts['in_progress'] ?? 0) > 0) return 'in-progress';
	if ((counts['review'] ?? 0) > 0) return 'review';
	if ((counts['on_hold'] ?? 0) > 0) return 'on-hold';
	const total = tasks.length;
	const completed = counts['completed'] ?? 0;
	if (completed === total) return 'completed';
	return fallback;
};

const buildUnifiedProject = (input: NewProjectInput, projectTasks: ProjectTask[]): UnifiedProject => { // بناء مشروع
	const marginPercent = systemSettings.defaultMarginPercent; // نسبة الهامش
	const totals: ProjectTotals = calculateProjectTotalsFromTasks({ // حساب الإجماليات
		tasks: projectTasks.map((t) => ({ // تحويل المهام لشكل الحساب
			basePrice: t.pricingBasePrice, // أساس
			quantity: t.quantity, // كمية
			totalCreatorPrice: t.pricing?.totalCreatorPrice ?? 0, // إجمالي المبدع
		})), // نهاية التحويل
		marginPercent, // نسبة الهامش
	}); // نهاية الحساب

		const clientEntity = clientById[input.clientId];
		const clientRef = clientEntity
			? { id: clientEntity.id, name: clientEntity.name }
			: { id: input.clientId, name: 'Unknown Client' }; // مرجع العميل من SSOT
	const now = nowIso(); // الوقت الآن

	const anyLate = projectTasks.some(t => isTaskLate(t)); // هل توجد مهام متأخرة

		// إن لم تكن للمهمة اقتراحات، اقترح بسرعة باستخدام مدينة العميل وحالة الاستعجال من المشروع
		const suggestedTasks: ProjectTask[] = projectTasks.map(t =>
			(t.suggestedCreators && t.suggestedCreators.length > 0)
			? t
		: suggestCreatorsForTask(t, input.industryId, 5, { clientCity: clientEntity?.location?.city, rush: input.isRush, dueDate: input.deadline, budgetIQD: undefined })
		);

	return { // كائن UnifiedProject
		id: input.id, // معرف
		name: input.name, // اسم
		title: input.title, // عنوان
		description: input.description, // وصف

		clientId: input.clientId, // معرف العميل
		client: clientRef, // مرجع عميل
		industryId: input.industryId, // صناعة

		category: input.category, // فئة المشروع
		tasks: suggestedTasks, // قائمة المهام (بعد حقن الاقتراحات)
		pricing: totals, // إجماليات التسعير

		status: deriveStatusFromTasks(projectTasks, normalizeProjectStatus(input.status)), // حالة مشتقة/موحدة
		priority: input.priority ?? 'normal', // أولوية
		isRush: input.isRush ?? false, // مستعجل
		location: input.location, // موقع
		isLate: anyLate, // متأخر إن وُجدت مهمة متأخرة
		overallProgress: Math.round(projectTasks.reduce((s, t) => s + (t.progress || 0), 0) / Math.max(1, projectTasks.length)), // تقدم إجمالي مبسط

		requestedDate: input.requestedDate, // تاريخ الطلب
		approvedDate: undefined, // تاريخ الموافقة
		startDate: undefined, // تاريخ البدء
		deadline: input.deadline, // موعد التسليم
		plannedDeliveryDate: input.deadline, // تاريخ تسليم مخطط (نفس deadline مبدئياً)
		completedDate: input.status === 'completed' ? input.deadline : undefined, // ملء تاريخ الإنهاء للمكتملة

		originalRequestId: input.originalRequestId, // طلب أصلي
		requestSubcategoryId: input.requestSubcategoryId, // فئة من الطلب

		createdBy: { id: 'admin_super_001', name: 'Super Admin' }, // منشئ
		approvedBy: undefined, // موافق
		isArchived: false, // أرشفة

		clientRequirements: undefined, // متطلبات
		internalNotes: undefined, // ملاحظات

		estimatedDuration: 7, // مدة تقديرية
		actualDuration: undefined, // مدة فعلية
		clientSatisfactionRating: undefined, // تقييم عميل

		tags: [], // وسوم
		complexity: 'medium', // تعقيد

		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الكائن
}; // نهاية الدالة

// تجميع مشاريع من المهام الحالية // بناء من seed
export const projects: UnifiedProject[] = [ // قائمة مشاريع
	buildUnifiedProject( // مشروع 1
		{ // مدخلات
			id: 'p_001_restaurant', // معرف
			name: 'Iraq Burger', // اسم
			title: 'Product Photography', // عنوان
			clientId: 'client_002', // عميل (مطعم)
			industryId: 'ind_food', // صناعة
			category: 'photography', // فئة
			location: 'client', // موقع
			requestedDate: '2025-08-18T09:00:00.000Z', // طلب
			deadline: '2025-09-01T17:00:00.000Z', // تسليم
			priority: 'high', // أولوية
			status: 'completed', // حالة
		}, // نهاية المدخلات
		tasksByProject['p_001_restaurant'] ?? [] // مهام المشروع
	), // نهاية العنصر
	buildUnifiedProject( // مشروع 2
		{ // مدخلات
			id: 'p_002_salon_campaign', // معرف
			name: 'Salon X Campaign', // اسم
			title: 'Reels Production', // عنوان
			clientId: 'client_002', // عميل
			industryId: 'ind_beauty', // صناعة
			category: 'videography', // فئة
			location: 'outskirts', // موقع
			requestedDate: '2025-08-20T08:30:00.000Z', // طلب
			deadline: '2025-09-05T18:00:00.000Z', // تسليم
			priority: 'urgent', // أولوية
			status: 'completed', // حالة
			isRush: true, // مستعجل
		}, // نهاية المدخلات
		tasksByProject['p_002_salon_campaign'] ?? [] // مهام المشروع
	), // نهاية العنصر
	buildUnifiedProject( // مشروع 3
		{ // مدخلات
			id: 'p_004_personal_session', // معرف
			name: 'Private Portrait', // اسم
			title: 'Portrait Session', // عنوان
			clientId: 'client_001', // عميل
			industryId: 'ind_beauty', // صناعة (was ind_personal → unified to valid SSOT id)
			category: 'photography', // فئة
			location: 'studio', // موقع
			requestedDate: '2025-08-22T10:00:00.000Z', // طلب
			deadline: '2025-09-03T16:00:00.000Z', // تسليم
			priority: 'normal', // أولوية
			status: 'completed', // حالة
		}, // نهاية المدخلات
		tasksByProject['p_004_personal_session'] ?? [] // مهام المشروع
	), // نهاية العنصر
]; // نهاية القائمة

// فهارس مساعدة للوصول // خرائط
export const projectMap: Record<string, UnifiedProject> = Object.fromEntries( // بناء خريطة
	projects.map((p) => [p.id, p]) // تحويل لمفاتيح
); // نهاية الخريطة

// استعلامات مساعدة // دوال
export const listProjects = (): UnifiedProject[] => projects; // جميع المشاريع
export const findProject = (id: string): UnifiedProject | undefined => projectMap[id]; // البحث بالمعرف
export const listActiveProjects = (): UnifiedProject[] => projects.filter((p) => p.status !== 'cancelled'); // مشاريع نشطة

// ملخص سريع // تقرير مبسط
export const getProjectsSummary = () => { // دالة التلخيص
	const total = projects.length; // العدد الكلي
	const totalTasks = projects.reduce((s, p) => s + p.tasks.length, 0); // مجموع المهام
	const totalQuantity = projects.reduce((s, p) => s + p.tasks.reduce((x, t) => x + t.quantity, 0), 0); // مجموع الكميات
	const totalClient = projects.reduce((s, p) => s + p.pricing.totalClientPrice, 0); // مجموع أسعار العملاء
	const byStatus = projects.reduce<Record<string, number>>((acc, p) => { acc[p.status] = (acc[p.status] ?? 0) + 1; return acc; }, {});
	const byClient = projects.reduce<Record<string, number>>((acc, p) => { acc[p.clientId] = (acc[p.clientId] ?? 0) + 1; return acc; }, {});
	const lateCount = projects.filter(p => p.isLate).length;
	return { total, totalTasks, totalQuantity, totalClient, byStatus, byClient, lateCount }; // نتيجة الملخص
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const PROJECTS_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط
export const projectsRegistry = { // سجل المشاريع
	version: PROJECTS_SCHEMA_VERSION, // نسخة
	count: projects.length, // عدد
	list: listProjects, // جميع المشاريع
	byId: projectMap, // خريطة المعرفات
}; // نهاية السجل

// خرائط مساعدة إضافية
export const projectsByStatus: Record<string, UnifiedProject[]> = projects.reduce((acc, p) => {
	(acc[p.status] ||= []).push(p);
	return acc;
}, {} as Record<string, UnifiedProject[]>);

export const projectsByClient: Record<string, UnifiedProject[]> = projects.reduce((acc, p) => {
	(acc[p.clientId] ||= []).push(p);
	return acc;
}, {} as Record<string, UnifiedProject[]>);

Object.assign(projectsRegistry, { byStatus: projectsByStatus, byClient: projectsByClient, summary: getProjectsSummary });

// ================================
// عروض مبسطة حسب الدور (Client/Creator/Admin)
// ================================

type ViewerRole = 'client' | 'creator' | 'admin';

export const shapeTaskFor = (t: ProjectTask, role: ViewerRole): Partial<ProjectTask> => {
	if (role === 'admin') return t; // عرض كامل
	if (role === 'creator') {
		// إخفاء سبب التعيين وهوية العميل الحساسة وأسعار العميل/الهامش والأساس/العوامل
			const creatorPricing: Partial<NonNullable<ProjectTask['pricing']>> | undefined = t.pricing
				? {
						unitCreatorPrice: t.pricing.unitCreatorPrice,
						totalCreatorPrice: t.pricing.totalCreatorPrice,
					}
				: undefined;
		return {
			...t,
			assignmentReason: undefined,
			pricingBasePrice: undefined,
			pricingFactors: undefined,
			pricing: creatorPricing as ProjectTask['pricing'] | undefined,
		};
	}
	// client: إخفاء أسماء/أسباب المبدعين وبعض الملاحظات
		const clientPricing: Partial<NonNullable<ProjectTask['pricing']>> | undefined = t.pricing
			? {
					clientPrice: t.pricing.clientPrice,
				}
			: undefined;
	return {
		...t,
		suggestedCreators: undefined,
		assignedCreatorId: undefined,
		assignedCreatorName: undefined,
		assignmentReason: undefined,
		notes: undefined,
		pricingBasePrice: undefined,
		pricingFactors: undefined,
		pricing: clientPricing as ProjectTask['pricing'] | undefined,
	};
};

export const shapeProjectFor = (p: UnifiedProject, role: ViewerRole): Partial<UnifiedProject> => {
	if (role === 'admin') return p;
	const shapedTasks = p.tasks.map(t => shapeTaskFor(t, role));
	const base = { ...(p as Omit<UnifiedProject, 'tasks'>), tasks: shapedTasks } as Partial<UnifiedProject>;
	if (role === 'client') {
		// لا نظهر ملاحظات داخلية
		return { ...base, internalNotes: undefined };
	}
	return base;
};
