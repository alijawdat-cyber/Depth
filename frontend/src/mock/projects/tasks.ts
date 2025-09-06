// ================================ // ملف منظم
// مهام المشاريع (Tasks) V2.1 - SSOT // وصف عام
// - ينشئ مهام متوافقة مع الأنواع الموحدة // سياسة
// - يحسب التسعير من basePrice + modifiers + margin // آلية التسعير
// - يعتمد على خدمات subcategories + pricing // الترابط
// ================================ // فاصل
import type { // استيراد أنواع التسعير
	ProcessingLevel, // مستوى المعالجة
	ExperienceLevel, // مستوى الخبرة
	EquipmentTier, // فئة المعدات
	RushKey, // مفتاح الاستعجال
	LocationKey, // موقع التنفيذ
	OwnershipKey, // ملكية المعدات
} from '../types/pricing'; // مسار الأنواع
import type { ProjectTask, TaskStatus } from '../types/projects'; // أنواع المهام الموحدة
import { getSubcategoryBasePrice } from '../services/subcategories'; // جلب سعر الأساس للفئة الفرعية
import { getPricingContext } from '../pricing/index'; // سياق التسعير (modifiers + margin)
import { calculateTaskPrice, type PricingPolicyOptions } from '../pricing/calculations'; // دالة حساب سعر المهمة
import { nowIso } from '../utils'; // أداة وقت موحّدة
import { recommendCreatorsForSubcategory } from './creatorRecommendations';
import { creatorById } from '../core/creators';
import { getSubcategoryById } from '../services/subcategories';
import type { CreatorCity } from '../types/entities';

// سياسة افتراضية للتسعير (SSOT): إضافة موقع على مستوى المهمة + تقريب نهائي فقط
const defaultPricingPolicy: PricingPolicyOptions = { applyLocationPerTask: true, roundingMode: 'final' };

// مُدخل إنشاء مهمة جديدة // عقد الإدخال
export interface NewTaskInput { // واجهة الإدخال
	id: string; // معرف المهمة
	projectId: string; // معرف المشروع
	categoryId: string; // فئة رئيسية
	subcategoryId: string; // فئة فرعية
	quantity: number; // الكمية المطلوبة
	processing: ProcessingLevel; // مستوى المعالجة
	experience: ExperienceLevel; // مستوى الخبرة
	equipment: EquipmentTier; // شريحة المعدات
	rush: RushKey; // استعجال
	ownership: OwnershipKey; // ملكية المعدات
	location: LocationKey; // موقع التنفيذ
	profileMultiplier?: number; // معامل ملف المبدع
	status?: TaskStatus; // حالة مبدئية
	estimatedHours?: number; // ساعات تقديرية
	requirements?: string; // متطلبات
	specialInstructions?: string; // تعليمات خاصة
	notes?: string; // ملاحظات
	fileFormat?: string; // صيغة الملفات
	dimensions?: string; // الأبعاد
	colorProfile?: string; // نموذج الألوان
	// خيارات إضافية لسياق الترشيح التلقائي
	autoSuggest?: boolean;
	clientCity?: CreatorCity;
	dueDate?: string;
	budgetIQD?: number;
} // نهاية الواجهة

// منشئ مهمة مع تسعير محسوب // الدالة الأساسية
export const createTask = (input: NewTaskInput): ProjectTask => { // إنشاء مهمة
	const basePrice = getSubcategoryBasePrice(input.subcategoryId); // جلب سعر الأساس من الخدمة
	const ctx = getPricingContext(); // سياق التسعير (modifiers + margin)
	const policy = ctx.policy ?? defaultPricingPolicy;

	const pricing = calculateTaskPrice( // حساب التسعير
		{ // مدخلات الحساب
			basePrice, // سعر الأساس
			quantity: input.quantity, // الكمية
	processing: input.processing, // المعالجة
	experience: input.experience, // الخبرة
	equipment: input.equipment, // المعدات
	rush: input.rush, // الاستعجال
	ownership: input.ownership, // الملكية
	location: input.location, // الموقع
			profileMultiplier: input.profileMultiplier, // معامل الملف
		}, // نهاية المدخلات
		{ modifiers: ctx.modifiers, marginPercent: ctx.marginPercent, policy } // سياق الحساب
	); // نهاية الحساب

	const now = nowIso(); // وقت الآن
	return { // كائن المهمة النهائي
		id: input.id, // معرف المهمة
		projectId: input.projectId, // معرف المشروع
	categoryId: input.categoryId, // فئة رئيسية
	subcategoryId: input.subcategoryId, // فئة فرعية
	quantity: input.quantity, // الكمية
	processingLevel: input.processing, // مستوى المعالجة
	rushKey: input.rush, // الاستعجال
	ownershipKey: input.ownership, // الملكية
	locationKey: input.location, // الموقع

	// تخزين مفاتيح الخبرة/المعدات لضمان إعادة تسعير مطابقة
	experienceKey: input.experience,
	equipmentTier: input.equipment,

	suggestedCreators: [], // ترشيحات مبدعين
	assignedCreatorId: undefined, // مبدع معين
	assignedCreatorName: undefined, // اسم المبدع
	assignmentReason: undefined, // سبب التعيين
	pricingBasePrice: pricing.basePrice, // سعر الأساس للوحدة
	pricingFactors: pricing.factors, // لقطة العوامل
	pricing: pricing.pricing, // نواتج التسعير
	status: input.status ?? 'pending', // الحالة المبدئية
	dueDate: undefined, // تاريخ الاستحقاق (قابل للتعبئة لاحقاً)
	priority: 'normal', // أولوية افتراضية
	progress: 0, // نسبة الإنجاز
	estimatedHours: input.estimatedHours ?? 0, // ساعات تقديرية
	actualHours: undefined, // ساعات فعلية
	startDate: undefined, // تاريخ البدء
	plannedEndDate: undefined, // تاريخ الانتهاء المخطط
	completedDate: undefined, // تاريخ الإنجاز

	requirements: input.requirements, // متطلبات
	specialInstructions: input.specialInstructions, // تعليمات خاصة
	notes: input.notes, // ملاحظات

	referenceFiles: [], // ملفات مرجعية
	deliverableFiles: [], // ملفات تسليم
	fileFormat: input.fileFormat, // صيغة الملفات
	dimensions: input.dimensions, // الأبعاد
	colorProfile: input.colorProfile, // نموذج الألوان

	createdAt: now, // تاريخ الإنشاء
		updatedAt: now, // تاريخ التحديث
	}; // نهاية الكائن
}; // نهاية الدالة

// إنشاء + اقتراح تلقائي إذا فُعّل العلم
export const createTaskWithOptionalSuggest = (input: NewTaskInput, industryId?: string): ProjectTask => {
	const task = createTask(input);
	if (input && input.autoSuggest) {
		return suggestCreatorsForTask(task, industryId, 5, { clientCity: input.clientCity, rush: input.rush !== 'normal', dueDate: input.dueDate, budgetIQD: input.budgetIQD });
	}
	return task;
};
// تحديث تسعير مهمة موجودة (إعادة حساب) // أداة صيانة
export const recomputeTaskPricing = (task: ProjectTask): ProjectTask => { // إعادة حساب
	const basePrice = getSubcategoryBasePrice(task.subcategoryId); // جلب سعر الأساس
	const ctx = getPricingContext(); // سياق التسعير
	const policy = ctx.policy ?? defaultPricingPolicy;
	const assignedCreator = task.assignedCreatorId ? creatorById[task.assignedCreatorId] : undefined;
	const profileMultiplier = assignedCreator?.profileMultiplier ?? 1.0;
	const pricing = calculateTaskPrice(
		{
			basePrice,
			quantity: task.quantity,
			processing: task.processingLevel,
			// إن أردنا استخدام خبرة/معدات من ربط المبدع×الفئة الفرعية، يمكن حقنها لاحقاً
			experience: task.experienceKey,
			equipment: task.equipmentTier,
			rush: task.rushKey ?? 'normal',
			ownership: task.ownershipKey ?? 'owned',
			location: task.locationKey ?? 'studio',
			profileMultiplier,
		},
		{ modifiers: ctx.modifiers, marginPercent: ctx.marginPercent, policy }
	);

	return { // إرجاع نسخة جديدة
		...task, // نسخ بقية الحقول
		pricingBasePrice: pricing.basePrice, // تحديث الأساس
	pricingFactors: pricing.factors, // تحديث العوامل
	pricing: pricing.pricing, // تحديث النتائج
	updatedAt: nowIso(), // تحديث التاريخ
	}; // نهاية الكائن
}; // نهاية الدالة

// اقتراح مبدعين لمهمة محددة (يعتمد الفئة الفرعية وصناعة المشروع)
export const suggestCreatorsForTask = (task: ProjectTask, industryId?: string, limit = 5, opts?: { clientCity?: CreatorCity; rush?: boolean; dueDate?: string; budgetIQD?: number }): ProjectTask => {
	const recos = recommendCreatorsForSubcategory({ subcategoryId: task.subcategoryId, industryId, limit, clientCity: opts?.clientCity, rush: opts?.rush, dueDate: opts?.dueDate, budgetIQD: opts?.budgetIQD });
	const suggestions = recos.map(r => ({ creatorId: r.creatorId, creatorName: r.creatorName, matchScore: r.score, reasons: r.reasons }));
	return { ...task, suggestedCreators: suggestions, updatedAt: nowIso() };
};

// تعيين مبدع لمهمة مع إعادة تسعير باستخدام profileMultiplier للمبدع
export const assignCreatorToTask = (task: ProjectTask, creatorId: string, reason?: string): ProjectTask => {
	const creator = creatorById[creatorId];
	const updated: ProjectTask = { ...task, assignedCreatorId: creatorId, assignedCreatorName: creator?.name, assignmentReason: reason, status: 'assigned', updatedAt: nowIso() };
	return recomputeTaskPricing(updated);
};

// تحديث فئة فرعية لمهمة: يحدّث السعر ويعيد الترشيحات
export const updateTaskSubcategory = (task: ProjectTask, newSubcategoryId: string, industryId?: string, opts?: { clientCity?: CreatorCity; rush?: boolean; dueDate?: string; budgetIQD?: number }): ProjectTask => {
	if (!getSubcategoryById(newSubcategoryId)) return task; // حماية
	const updated: ProjectTask = { ...task, subcategoryId: newSubcategoryId, updatedAt: nowIso() };
	const rePriced = recomputeTaskPricing(updated);
	return suggestCreatorsForTask(rePriced, industryId, 5, opts);
};

// إنشاء مهمة ثم اقتراح المبدعين مباشرةً (اختياري أثناء بناء المشروع)
export const createTaskAndSuggest = (input: NewTaskInput, industryId?: string, opts?: { clientCity?: CreatorCity; rush?: boolean; limit?: number; dueDate?: string; budgetIQD?: number }): ProjectTask => {
	const task = createTask(input);
	return suggestCreatorsForTask(task, industryId, opts?.limit ?? 5, { clientCity: opts?.clientCity, rush: opts?.rush, dueDate: opts?.dueDate, budgetIQD: opts?.budgetIQD });
};

// بيانات تجريبية صغيرة (seed) // أمثلة عملية
export const tasks: ProjectTask[] = [ // مصفوفة مهام
	createTask({ // مهمة 1
		id: 't_001_restaurant_product', // معرف
		projectId: 'p_001_restaurant', // مشروع
	categoryId: 'cat_photo', // فئة رئيسية
	subcategoryId: 'sub_product_photo', // فئة فرعية
	quantity: 12, // كمية
	processing: 'basic', // معالجة
	experience: 'experienced', // خبرة
	equipment: 'gold', // معدات
	rush: 'normal', // استعجال
	ownership: 'owned', // ملكية
	location: 'client', // موقع
		estimatedHours: 6, // ساعات تقديرية
		status: 'not_started', // حالة
	}), // نهاية العنصر
	createTask({ // مهمة 2
		id: 't_002_salon_reels', // معرف
		projectId: 'p_002_salon_campaign', // مشروع
	categoryId: 'cat_video', // فئة رئيسية
	subcategoryId: 'sub_reels_30s', // فئة فرعية
	quantity: 3, // كمية
		processing: 'color_correction', // معالجة
		experience: 'expert', // خبرة
		equipment: 'platinum', // معدات
		rush: 'rush', // استعجال
		ownership: 'agency_equipment', // ملكية
		location: 'outskirts', // موقع
		estimatedHours: 10, // ساعات
		status: 'in_progress', // حالة
	}), // نهاية العنصر
	createTask({ // مهمة 3
		id: 't_003_personal_session', // معرف
		projectId: 'p_004_personal_session', // مشروع
		categoryId: 'cat_photo', // فئة رئيسية
		subcategoryId: 'sub_portrait', // فئة فرعية
		quantity: 5, // كمية
		processing: 'full_retouch', // معالجة
		experience: 'experienced', // خبرة
		equipment: 'gold', // معدات
		rush: 'normal', // استعجال
		ownership: 'owned', // ملكية
		location: 'studio', // موقع
		estimatedHours: 4, // ساعات
		status: 'review', // حالة
	}), // نهاية العنصر
]; // نهاية المصفوفة

// فهارس مساعدة للوصول السريع // خرائط
export const tasksByProject: Record<string, ProjectTask[]> = tasks.reduce<Record<string, ProjectTask[]>>( // بناء خريطة
	(acc, t) => { // دالة التجميع
		(acc[t.projectId] ||= []).push(t); // دفع حسب المشروع
		return acc; // إرجاع المجمّع
	}, // نهاية الدالة
	{} // قيمة ابتدائية
); // نهاية الخريطة

// استعلامات مساعدة // دوال
export const listTasks = (): ProjectTask[] => tasks; // جميع المهام
export const listTasksByProject = (projectId: string): ProjectTask[] => tasksByProject[projectId] ?? []; // مهام مشروع
export const listActiveTasks = (): ProjectTask[] => tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled'); // مهام نشطة

// تلخيص سريع // تقرير مبسط
export const getTasksSummary = () => { // دالة التلخيص
	const total = tasks.length; // العدد الكلي
	const byStatus: Record<TaskStatus, number> = { // عدّاد حسب الحالة
		pending: 0, // بانتظار
		assigned: 0, // مُعيّن
		not_started: 0, // توافقي قديم
		in_progress: 0, // جارٍ
		review: 0, // مراجعة
		revision: 0, // تعديل
		completed: 0, // مكتمل
		on_hold: 0, // موقوف
		cancelled: 0, // ملغى
	}; // نهاية الكائن
	for (const t of tasks) byStatus[t.status]++; // تحديث العدادات
	return { total, byStatus }; // نتيجة التلخيص
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const TASKS_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط
export const tasksRegistry = { // سجل المهام
	version: TASKS_SCHEMA_VERSION, // نسخة
	count: tasks.length, // عدد
	byProject: tasksByProject, // خريطة بالمشاريع
	list: listTasks, // جميع المهام
	listByProject: listTasksByProject, // مهام مشروع
	listActive: listActiveTasks, // مهام نشطة
}; // نهاية السجل

// ملاحظة: سيعاد تصدير هذا الملف من ./index.ts لاحقاً حسب الطلب // تنسيق التصدير
// Projects V2.1 modules

// ================================
// امتدادات للفهرسة/التقارير: تأخير وأولوية
// ================================

// مهمة متأخرة إن كانت لها dueDate سابقة لوقت التنفيذ وحالتها ليست مكتملة/ملغاة
export const isTaskLate = (t: ProjectTask, nowIsoStr?: string): boolean => {
	if (!t.dueDate) return false;
	if (t.status === 'completed' || t.status === 'cancelled') return false;
	const nowMs = nowIsoStr ? new Date(nowIsoStr).getTime() : Date.now();
	return new Date(t.dueDate).getTime() < nowMs;
};

// خرائط مساعدة للفهرسة
export const tasksByStatus: Record<TaskStatus, ProjectTask[]> = tasks.reduce((acc, t) => {
	(acc[t.status] ||= []).push(t);
	return acc;
}, { pending: [], assigned: [], not_started: [], in_progress: [], review: [], revision: [], completed: [], on_hold: [], cancelled: [] } as Record<TaskStatus, ProjectTask[]>);

export const tasksByPriority: Record<'low' | 'normal' | 'high' | 'urgent', ProjectTask[]> = tasks.reduce((acc, t) => {
	const key = (t.priority ?? 'normal');
	(acc[key] ||= []).push(t);
	return acc;
}, { low: [], normal: [], high: [], urgent: [] } as Record<'low' | 'normal' | 'high' | 'urgent', ProjectTask[]>);

// سرد المهام المتأخرة لمشروع معيّن
export const listLateTasksByProject = (projectId: string, nowIsoStr?: string): ProjectTask[] => {
	const arr = tasksByProject[projectId] ?? [];
	return arr.filter(t => isTaskLate(t, nowIsoStr));
};

// تحديث السجل بخرائط جديدة
Object.assign(tasksRegistry, { byStatus: tasksByStatus, byPriority: tasksByPriority, listLateByProject: listLateTasksByProject, isTaskLate });
