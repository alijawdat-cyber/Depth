// Data Generator V2.1 - مولد بيانات مترابطة (Clients/Creators/Projects/Tasks/Invoices/Payments)  // عنوان الملف

// ملاحظة عامة: هذا المولّد يبني بيانات مترابطة بشكل حتمي/شبه عشوائي لاختبارات الواجهة  // توضيح عام
// - يستخدم أنواع SSOT ووحدات الحساب/الفوترة الموجودة لضمان الاتساق مع النظام  // توافق
// - لا يغيّر قوائم SSOT الثابتة؛ يُرجع مصفوفات جديدة وروابط/فهارس مساعدة  // عدم تعديل المصدر

// -------- الاستيرادات (Types & Utils & Services) --------  // عنوان قسم الاستيراد
import type { ISODateString, Paginated, Registry } from '../types/core'; // أنواع أساسية مشتركة
import type { UnifiedProject, ProjectTask } from '../types/projects'; // أنواع المشاريع والمهام
import type { ProcessingLevel, ExperienceLevel, EquipmentTier, RushKey, LocationKey, OwnershipKey } from '../types/pricing'; // مفاتيح التسعير
import { calculateProjectTotalsFromTasks } from '../pricing/calculations'; // حساب مجاميع المشروع من المهام
import { systemSettings } from '../system/systemSettings'; // إعدادات النظام (الهامش/العملة)
import { subcategories, listSubcategoriesByCategory } from '../services/subcategories'; // فئات فرعية متاحة
import { listCreatorsForSubcategory } from '../services/creatorSubcategories'; // ربط المبدعين بالفئات
import { creators, creatorById, CreatorUser } from '../core/creators'; // قائمة المبدعين الأساسية
import { clients, ClientUser } from '../core/clients'; // قائمة العملاء الأساسية
import { createTask, type NewTaskInput } from '../projects/tasks'; // منشئ مهمة مع تسعير
import { createInvoiceFromProject, type Invoice } from '../finance/invoices'; // منشئ فاتورة من مشروع
import { createManualPayment, type Payment } from '../finance/payments'; // منشئ دفعة يدوية
import { buildRegistry } from './mockService'; // بناء سجل (Registry) سريع

// -------- أدوات مساعدة عامة --------  // عنوان الأدوات
const nowIso = (): ISODateString => new Date().toISOString(); // وقت ISO حالي
const addDays = (iso: string, days: number): ISODateString => new Date(new Date(iso).getTime() + days * 86400000).toISOString(); // إضافة أيام
const pad = (n: number, w = 2): string => n.toString().padStart(w, '0'); // صفر بادينغ
const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min; // عدد صحيح عشوائي ضمن مجال
const randBool = (p = 0.5): boolean => Math.random() < p; // قيمة منطقية احتمالية
const choice = <T,>(arr: T[]): T => arr[Math.max(0, Math.floor(Math.random() * arr.length))]; // اختيار عنصر عشوائي من مصفوفة
const genId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 8)}`; // توليد معرف نصي بسيط

// -------- مفاتيح خيارات التوليد --------  // عنوان الخيارات
export interface DataGenOptions { // واجهة خيارات المولّد
	projectsCount?: number; // عدد المشاريع المطلوب توليدها
	tasksPerProject?: { min: number; max: number }; // مدى عدد المهام لكل مشروع
	assignCreators?: boolean; // إسناد مبدع للمهام عند توفر خبرة
	issueInvoices?: boolean; // إصدار فاتورة لكل مشروع
	paymentsPolicy?: 'none' | 'partial' | 'full' | 'random'; // سياسة إنشاء المدفوعات
	startDate?: ISODateString; // تاريخ مرجعي لبدء المشاريع
} // نهاية الواجهة

// -------- مولد مهام مشروع --------  // عنوان المولد الفرعي
const pickProcessing = (): ProcessingLevel => choice<ProcessingLevel>(['basic', 'color_correction', 'full_retouch']); // اختيار معالجة
const pickExperience = (): ExperienceLevel => choice<ExperienceLevel>(['experienced', 'expert']); // اختيار خبرة
const pickEquipment = (): EquipmentTier => choice<EquipmentTier>(['gold', 'platinum']); // اختيار معدات
const pickRush = (): RushKey => (randBool(0.25) ? 'rush' : 'normal'); // اختيار استعجال
const pickLocation = (): LocationKey => choice<LocationKey>(['studio', 'client', 'nearby', 'outskirts']); // اختيار موقع
const pickOwnership = (): OwnershipKey => (randBool(0.2) ? 'agency_equipment' : 'owned'); // اختيار ملكية

// اختيار فئة فرعية ومشتقاتها  // يفترض وجود عناصر في subcategories
const pickSubcategory = (categoryHint?: string) => { // دالة انتقاء فئة فرعية
	const pool = categoryHint ? listSubcategoriesByCategory(categoryHint) : subcategories; // مجموعة مرشحة
	return choice(pool); // اختيار عنصر عشوائي
}; // نهاية الدالة

// محاولة إسناد مبدع بناءً على خبرة الفئة الفرعية  // يستخدم خرائط الخبرات
const maybeAssignCreator = (subcategoryId: string): { assignedCreatorId?: string; assignedCreatorName?: string } => { // دالة الإسناد
	const possible = listCreatorsForSubcategory(subcategoryId); // قائمة المبدعين المناسبين
	if (!possible.length) return {}; // لا أحد مناسب
	const creatorId = choice(possible); // اختيار مبدع
	const c = creatorById[creatorId]; // جلب الكائن
	return c ? { assignedCreatorId: c.id, assignedCreatorName: c.name } : {}; // إرجاع معلومات الإسناد
}; // نهاية الدالة

// بناء مهمة جديدة مع تسعير  // يلتزم بـ NewTaskInput
const buildTask = (projectId: string, categoryId: string, profileMultiplier?: number, assignCreators = true): ProjectTask => { // دالة بناء مهمة
	const sc = pickSubcategory(categoryId); // فئة فرعية مناسبة
	const input: NewTaskInput = { // مُدخلات منشئ المهمة
		id: genId('t'), // معرف مهمة
		projectId, // معرف المشروع
		categoryId: sc.categoryId, // فئة رئيسية
		subcategoryId: sc.id, // فئة فرعية
		quantity: randInt(1, 8), // كمية
		processing: pickProcessing(), // معالجة
		experience: pickExperience(), // خبرة
		equipment: pickEquipment(), // معدات
		rush: pickRush(), // استعجال
		ownership: pickOwnership(), // ملكية
		location: pickLocation(), // موقع
		estimatedHours: randInt(2, 12), // ساعات تقديرية
		status: 'not_started', // حالة ابتدائية
		profileMultiplier, // معامل ملف (إن وجد)
	}; // نهاية المُدخلات
	const task = createTask(input); // إنشاء مهمة مع تسعير
	if (assignCreators) { // إن كان الإسناد مطلوباً
		const asg = maybeAssignCreator(task.subcategoryId); // محاولة الإسناد
		task.assignedCreatorId = asg.assignedCreatorId; // تعيين المعرف
		task.assignedCreatorName = asg.assignedCreatorName; // تعيين الاسم
		if (asg.assignedCreatorId && !task.pricingFactors?.ownershipMultiplier && input.ownership === 'agency_equipment') { // ضبط اختياري
			// لا تعديل إضافي حالياً؛ التسعير محسوب مسبقاً عبر createTask  // تعليق توضيحي
		} // نهاية الشرط
	} // نهاية الإسناد
	return task; // إرجاع المهمة
}; // نهاية الدالة

// -------- مولد مشروع موحّد --------  // عنوان المولد
const buildProject = (params: { // بارامترات بناء المشروع
	id?: string; // معرف اختياري
	name: string; // اسم مختصر
	title: string; // عنوان واضح
	client: ClientUser; // كائن العميل
	industryId: string; // معرف الصناعة
	category: UnifiedProject['category']; // فئة المشروع
	isRush?: boolean; // مستعجل
	location: LocationKey; // موقع التنفيذ
	requestedDate: ISODateString; // تاريخ الطلب
	deadline: ISODateString; // موعد التسليم
	tasks: ProjectTask[]; // مهام المشروع
	priority?: UnifiedProject['priority']; // أولوية
	status?: UnifiedProject['status']; // حالة
}): UnifiedProject => { // ناتج المشروع
	const marginPercent = systemSettings.defaultMarginPercent; // نسبة هامش الوكالة
	const totals = calculateProjectTotalsFromTasks({ // حساب مجاميع المشروع
		tasks: params.tasks.map((t) => ({ basePrice: t.pricingBasePrice, quantity: t.quantity, totalCreatorPrice: t.pricing?.totalCreatorPrice ?? 0 })), // تحويل المهام
		marginPercent, // نسبة الهامش
	}); // نهاية الحساب
	const now = nowIso(); // الآن
	return { // كائن UnifiedProject
		id: params.id ?? genId('p'), // معرف المشروع
		name: params.name, // اسم
		title: params.title, // عنوان
		description: undefined, // وصف اختياري
		clientId: params.client.id, // معرف العميل
		client: { id: params.client.id, name: params.client.name }, // مرجع عميل
		industryId: params.industryId, // صناعة
		industryName: undefined, // اسم الصناعة (اختياري)
		category: params.category, // فئة المشروع
		tasks: params.tasks, // مهام المشروع
		pricing: totals, // مجاميع التسعير
		status: params.status ?? 'active', // حالة
		priority: params.priority ?? 'normal', // أولوية
		isRush: params.isRush ?? false, // استعجال
		location: params.location, // موقع
		requestedDate: params.requestedDate, // تاريخ الطلب
		approvedDate: undefined, // تاريخ الموافقة
		startDate: undefined, // تاريخ البدء
		deadline: params.deadline, // موعد التسليم
		completedDate: undefined, // تاريخ الإنهاء
		originalRequestId: undefined, // طلب أصلي
		requestSubcategoryId: undefined, // فئة من الطلب
		createdBy: { id: 'admin_super_001', name: 'Super Admin' }, // منشئ
		approvedBy: undefined, // موافِق
		isArchived: false, // أرشفة
		clientRequirements: undefined, // متطلبات
		internalNotes: undefined, // ملاحظات
		estimatedDuration: randInt(3, 14), // مدة تقديرية
		actualDuration: undefined, // مدة فعلية
		clientSatisfactionRating: undefined, // تقييم عميل
		tags: [], // وسوم
		complexity: choice(['simple', 'medium', 'complex']) as UnifiedProject['complexity'], // تعقيد
		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الكائن
}; // نهاية الدالة

// -------- الواجهة الرئيسية للمولّد --------  // عنوان الواجهة
export interface GeneratedDataset { // شكل ناتج المولّد
	clients: ClientUser[]; // عملاء
	creators: CreatorUser[]; // مبدعون
	projects: UnifiedProject[]; // مشاريع
	tasks: ProjectTask[]; // مهام
	invoices: Invoice[]; // فواتير
	payments: Payment[]; // مدفوعات
	registries: { // سجلات مساعدة
		clients: Registry<ClientUser>; // سجل العملاء
		creators: Registry<CreatorUser>; // سجل المبدعين
		projects: Registry<UnifiedProject>; // سجل المشاريع
		tasks: Registry<ProjectTask>; // سجل المهام
		invoices: Registry<Invoice>; // سجل الفواتير
		payments: Registry<Payment>; // سجل المدفوعات
	}; // نهاية السجلات
	relations: { // علاقات/فهارس مشتقة
		tasksByProject: Record<string, ProjectTask[]>; // مهام حسب مشروع
		invoicesByProject: Record<string, Invoice[]>; // فواتير حسب مشروع
		paymentsByInvoice: Record<string, Payment[]>; // مدفوعات حسب فاتورة
	}; // نهاية العلاقات
	paginate<T>(list: T[], page?: number, limit?: number): Paginated<T>; // دالة ترقيم بسيطة
} // نهاية الواجهة

// تنفيذ التوليد الرئيسي  // دالة عامة قابلة للاستخدام في صفحات/اختبارات
export const generateDataset = (opts?: DataGenOptions): GeneratedDataset => { // دالة التوليد
	const options: Required<DataGenOptions> = { // تطبيق القيم الافتراضية
		projectsCount: opts?.projectsCount ?? 5, // عدد المشاريع الافتراضي
		tasksPerProject: opts?.tasksPerProject ?? { min: 1, max: 3 }, // مدى المهام الافتراضي
		assignCreators: opts?.assignCreators ?? true, // إسناد المبدعين افتراضياً
		issueInvoices: opts?.issueInvoices ?? true, // إصدار فواتير افتراضياً
		paymentsPolicy: opts?.paymentsPolicy ?? 'partial', // سياسة المدفوعات الافتراضية
		startDate: opts?.startDate ?? nowIso(), // تاريخ مرجعي افتراضي
	}; // نهاية الخيارات

	const baseClients = clients.slice(); // استخدام العملاء SSOT كنقطة انطلاق
	const baseCreators = creators.slice(); // استخدام المبدعين SSOT كنقطة انطلاق

	const outProjects: UnifiedProject[] = []; // قائمة المشاريع الناتجة
	const outTasks: ProjectTask[] = []; // قائمة المهام الناتجة
	const outInvoices: Invoice[] = []; // قائمة الفواتير الناتجة
	const outPayments: Payment[] = []; // قائمة المدفوعات الناتجة

	for (let i = 0; i < options.projectsCount; i++) { // حلقة توليد المشاريع
		const c = choice(baseClients); // اختيار عميل
		const industryId = c.industryId; // صناعة العميل
		const catKey = choice(['photography', 'videography', 'design', 'editing']) as UnifiedProject['category']; // فئة المشروع
		const categoryIdGuess = catKey === 'photography' ? 'cat_photo' : catKey === 'videography' ? 'cat_video' : catKey === 'design' ? 'cat_design' : 'cat_editing'; // تحويل لفئة رئيسية
		const projectId = genId('p'); // معرف مشروع جديد
		const creatorProfile = randBool(0.6) ? choice(baseCreators).profileMultiplier : undefined; // معامل ملف محتمل
		const tasksCount = randInt(options.tasksPerProject.min, options.tasksPerProject.max); // عدد المهام
		const pTasks: ProjectTask[] = []; // مهام المشروع المحلي
		for (let t = 0; t < tasksCount; t++) { // حلقة إنشاء مهام
			pTasks.push(buildTask(projectId, categoryIdGuess, creatorProfile, options.assignCreators)); // إنشاء مهمة ودفعها
		} // نهاية حلقة المهام
		const requested = addDays(options.startDate, randInt(-3, 2)); // تاريخ الطلب
		const deadline = addDays(options.startDate, randInt(7, 21)); // موعد التسليم
		const proj = buildProject({ // بناء المشروع النهائي
			id: projectId, // تثبيت المعرف
			name: `${c.name.split(' ')[0]} ${pad(i + 1)}`, // اسم مختصر
			title: catKey === 'photography' ? 'Product Photography' : catKey === 'videography' ? 'Reels Production' : catKey === 'design' ? 'Brand Design' : 'Advanced Editing', // عنوان
			client: c, // العميل
			industryId, // الصناعة
			category: catKey, // فئة المشروع
			isRush: randBool(0.2), // استعجال
			location: choice<LocationKey>(['studio', 'client', 'outskirts']), // موقع
			requestedDate: requested, // تاريخ الطلب
			deadline, // موعد التسليم
			tasks: pTasks, // مهام
			priority: choice(['low', 'normal', 'high', 'urgent']) as UnifiedProject['priority'], // أولوية
			status: choice(['active', 'in-progress', 'review']) as UnifiedProject['status'], // حالة
		}); // نهاية البناء
		outProjects.push(proj); // إضافة المشروع
		outTasks.push(...pTasks); // إضافة مهام المشروع

		if (options.issueInvoices) { // إصدار الفواتير عند الطلب
			const inv = createInvoiceFromProject(proj, { terms: 'net_15', issueNow: true }); // إنشاء فاتورة
			outInvoices.push(inv); // إضافة الفاتورة
			const payPolicy = options.paymentsPolicy; // سياسة الدفع
			if (payPolicy !== 'none') { // إن لم تكن بلا
				const total = inv.amount.total; // إجمالي الفاتورة
				if (payPolicy === 'full' || (payPolicy === 'random' && randBool(0.4))) { // دفع كامل
					outPayments.push(createManualPayment({ invoiceId: inv.id, clientId: inv.clientId, amount: total, reference: `REC-${pad(i + 1, 3)}`, receivedAt: addDays(inv.issuedAt ?? nowIso(), randInt(0, 5)) })); // دفعة كاملة
				} else { // دفع جزئي
					const part = Math.max(50000, Math.floor(total * choice([0.25, 0.4, 0.5]))); // جزء مناسب
					outPayments.push(createManualPayment({ invoiceId: inv.id, clientId: inv.clientId, amount: part, reference: `REC-${pad(i + 1, 3)}`, receivedAt: addDays(inv.issuedAt ?? nowIso(), randInt(0, 3)) })); // دفعة جزئية
				} // نهاية الفروع
			} // نهاية شرط سياسة الدفع
		} // نهاية إصدار الفواتير
	} // نهاية حلقة المشاريع

	// بناء سجلات (Registries)  // للوصول السريع لاحقاً
	const registries = { // كائن السجلات
		clients: buildRegistry(baseClients), // سجل العملاء
		creators: buildRegistry(baseCreators), // سجل المبدعين
		projects: buildRegistry(outProjects), // سجل المشاريع
		tasks: buildRegistry(outTasks), // سجل المهام
		invoices: buildRegistry(outInvoices), // سجل الفواتير
		payments: buildRegistry(outPayments), // سجل المدفوعات
	}; // نهاية السجلات

	// علاقات/فهارس مشتقة  // خرائط ربط سريعة
	const tasksByProject = outTasks.reduce<Record<string, ProjectTask[]>>((acc, t) => { (acc[t.projectId] ||= []).push(t); return acc; }, {}); // مهام حسب مشروع
	const invoicesByProject = outInvoices.reduce<Record<string, Invoice[]>>((acc, inv) => { (acc[inv.projectId] ||= []).push(inv); return acc; }, {}); // فواتير حسب مشروع
	const paymentsByInvoice = outPayments.reduce<Record<string, Payment[]>>((acc, p) => { (acc[p.invoiceId] ||= []).push(p); return acc; }, {}); // مدفوعات حسب فاتورة

	// دالة ترقيم بسيطة (page/limit)  // متوافقة مع Paginated<T>
	const paginate = <T,>(list: T[], page = 1, limit = 20): Paginated<T> => { // تنفيذ الترقيم
		const total = list.length; // إجمالي العناصر
		const start = (Math.max(1, page) - 1) * Math.max(1, limit); // بداية القص
		const end = start + Math.max(1, limit); // نهاية القص
		const items = list.slice(start, end); // عناصر الصفحة
		const pages = limit > 0 ? Math.ceil(total / limit) : 0; // عدد الصفحات
		return { items, total, page, pageSize: limit, pages }; // كائن Paginated
	}; // نهاية paginate

	return { // إرجاع المجموعة الناتجة
		clients: baseClients, // عملاء
		creators: baseCreators, // مبدعون
		projects: outProjects, // مشاريع
		tasks: outTasks, // مهام
		invoices: outInvoices, // فواتير
		payments: outPayments, // مدفوعات
		registries, // سجلات
		relations: { tasksByProject, invoicesByProject, paymentsByInvoice }, // علاقات
		paginate, // ترقيم
	}; // نهاية الكائن
}; // نهاية الدالة

// ملاحظة توافقية: يستهلك هذا المولّد وحدات SSOT فقط ولا يفرض شكلاً مختلفاً للكيانات  // توضيح
// - يعتمد على createTask لضمان اتساق التسعير لكل مهمة  // اتساق التسعير
// - يعتمد على calculateProjectTotalsFromTasks لاشتقاق مجاميع المشروع  // مجاميع صحيحة
// - يستخدم createInvoiceFromProject و createManualPayment لبناء تدفق مالي منطقي  // تكامل مالي
// - يضيف سجلات/فهارس لتسهيل استهلاك البيانات في الجداول والواجهات  // سهولة الاستهلاك
