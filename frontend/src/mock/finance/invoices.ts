// ================================ // ملف منظم
// الفواتير (Invoices) V2.1 - SSOT // وصف عام
// - ينشئ فواتير من المشاريع/المهام مع عناصر بنود // النطاق
// - يستهلك: ../system/systemSettings للعملة + ../projects للبيانات // الترابط
// - الضرائب خارج النطاق (0 دائمًا) حسب المواصفات V2.0 // سياسة الضرائب
// ================================ // فاصل

import { getDefaultCurrency } from '../system/systemSettings'; // جلب العملة الافتراضية
import type { UnifiedProject, ProjectTask } from '../types/projects'; // أنواع المشروع والمهام
import { projects as projectModule } from '../projects'; // وحدة المشاريع

// أنواع حالات الفاتورة حسب القاموس // حالات رسمية
export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'; // حالات

// شروط الدفع حسب القاموس // خيارات الشروط
export type PaymentTerms = 'advance_50' | 'advance_100' | 'net_15' | 'net_30'; // أنواع الشروط

// عنصر بند الفاتورة // سطر مفصل
export interface InvoiceItem { // واجهة عنصر البند
	description: string; // وصف السطر
	quantity: number; // الكمية
	unitPrice: number; // سعر الوحدة (للعرض)
	total: number; // المجموع (معتمد)
} // نهاية الواجهة

// مبالغ الفاتورة // تجميعي
export interface InvoiceAmount { // واجهة المبلغ
	subtotal: number; // المجموع قبل الخصم
	tax: 0; // ضريبة = 0 دائمًا
	discount: number; // الخصم بالقيمة
	total: number; // المجموع النهائي
} // نهاية الواجهة

// كيان الفاتورة // الهيكل الكامل
export interface Invoice { // واجهة الفاتورة
	id: string; // معرف داخلي inv_xxx
	projectId: string; // معرف المشروع
	clientId: string; // معرف العميل
	number: string; // رقم الفاتورة التسلسلي INV-YYYY-XXXX
	status: InvoiceStatus; // حالة الفاتورة
	currency: 'IQD'; // العملة
	amount: InvoiceAmount; // مبالغ الفاتورة
	dueDate?: string; // تاريخ الاستحقاق
	issuedAt?: string; // تاريخ الإصدار
	notes?: string; // ملاحظات
	invoiceItems: InvoiceItem[]; // عناصر الفاتورة
	paymentTerms: PaymentTerms; // شروط الدفع
	relatedPaymentsCount: number; // عدد المدفوعات المرتبطة
	createdAt: string; // تاريخ الإنشاء
	updatedAt: string; // تاريخ التحديث
} // نهاية الواجهة

// أدوات وقت وهوية // مساعدات عامة
const nowIso = (): string => new Date().toISOString(); // الآن بصيغة ISO
const addDays = (iso: string, days: number): string => new Date(new Date(iso).getTime() + days * 86400000).toISOString(); // إضافة أيام
const pad = (n: number, w = 4): string => n.toString().padStart(w, '0'); // صفر بادينغ
const generateInvoiceId = (hint: string): string => `inv_${hint}_${Math.random().toString(36).slice(2, 6)}`; // توليد id
const generateInvoiceNumber = (seq: number): string => `INV-${new Date().getFullYear()}-${pad(seq, 6)}`; // رقم تسلسلي

// حساب تاريخ الاستحقاق من الشروط // net_15/net_30/advance
const calcDueDate = (issuedAt: string, terms: PaymentTerms): string => { // دالة الاستحقاق
	if (terms === 'net_15') return addDays(issuedAt, 15); // صافي 15 يوم
	if (terms === 'net_30') return addDays(issuedAt, 30); // صافي 30 يوم
	return issuedAt; // مقدم 50/100 → الاستحقاق فورًا
}; // نهاية الدالة

// بناء عناصر فاتورة من مهام المشروع // يحافظ على المجاميع
const buildInvoiceItemsFromTasks = (tasks: ProjectTask[]): InvoiceItem[] => { // تحويل المهام لبنود
	return tasks.map((t) => { // لكل مهمة
		const total = t.pricing?.clientPrice ?? 0; // إجمالي العميل للمهمة
		const qty = Math.max(1, t.quantity || 1); // ضمان كمية صحيحة
		const unit = Math.round(total / qty); // سعر وحدة تقريبي للعرض
		const desc = `مهمة ${t.subcategoryId}`; // وصف بسيط من الفئة الفرعية
		return { description: desc, quantity: qty, unitPrice: unit, total }; // عنصر البند
	}); // نهاية التحويل
}; // نهاية الدالة

// حساب مبالغ الفاتورة من البنود + خصم // الضرائب صفر
const calculateInvoiceAmount = (items: InvoiceItem[], discount = 0): InvoiceAmount => { // حساب المبالغ
	const subtotal = items.reduce((s, it) => s + (it.total || 0), 0); // جمع المجاميع
	const tax: 0 = 0 as const; // ضريبة ثابتة صفر
	const total = Math.max(0, subtotal - Math.max(0, discount)); // المجموع النهائي
	return { subtotal, tax, discount: Math.max(0, discount), total }; // نتيجة
}; // نهاية الدالة

// إنشاء فاتورة من مشروع موّحد // الدالة الأساسية
export const createInvoiceFromProject = (project: UnifiedProject, opts?: { // واجهة الخيارات
	terms?: PaymentTerms; // شروط الدفع
	discount?: number; // خصم اختياري
	notes?: string; // ملاحظات
	idHint?: string; // تلميح للمعرف
	seq?: number; // تسلسل للرقم
	issueNow?: boolean; // إصدار الآن (المعتمد)
}): Invoice => { // ناتج فاتورة
	const currency = getDefaultCurrency(); // العملة من الإعدادات
	const issuedAt = opts?.issueNow ? nowIso() : undefined; // تاريخ الإصدار
	const terms: PaymentTerms = opts?.terms ?? 'net_15'; // الشروط الافتراضية
	const dueDate = issuedAt ? calcDueDate(issuedAt, terms) : undefined; // الاستحقاق إن أُصدرت
	const items = buildInvoiceItemsFromTasks(project.tasks); // بناء البنود
	const amount = calculateInvoiceAmount(items, opts?.discount ?? 0); // حساب المبالغ
	const id = generateInvoiceId(opts?.idHint ?? project.id); // توليد معرف
	const number = opts?.seq ? generateInvoiceNumber(opts.seq) : generateInvoiceNumber(Math.floor(Math.random() * 100000)); // رقم
	const now = nowIso(); // الآن
	return { // كائن الفاتورة
		id, // معرف
		projectId: project.id, // مشروع
		clientId: project.clientId, // عميل
		number, // رقم
		status: opts?.issueNow ? 'issued' : 'draft', // حالة
		currency, // عملة
		amount, // مبالغ
		dueDate, // استحقاق
		issuedAt, // إصدار
		notes: opts?.notes, // ملاحظات
		invoiceItems: items, // بنود
		paymentTerms: terms, // شروط
		relatedPaymentsCount: 0, // مدفوعات مرتبطة
		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الكائن
}; // نهاية الدالة

// تحضير Seeds للفواتير من المشاريع الحالية // بيانات تجريبية
const buildSeedInvoices = (): Invoice[] => { // بناء seeds
	const list: Invoice[] = []; // مصفوفة ناتجة
	const allProjects: UnifiedProject[] = projectModule.projects; // جميع المشاريع
	for (const p of allProjects) { // حلقة على المشاريع
		if (p.id === 'p_002_salon_campaign') { // مشروع الصالون
			const inv = createInvoiceFromProject(p, { terms: 'net_15', issueNow: true, idHint: '002_salon', seq: 1234, notes: 'فاتورة الحملة - تصوير ريلز' }); // إنشاء
			list.push({ ...inv, id: 'inv_002_salon', number: 'INV-2025-001234' }); // تثبيت معرف ورقم معروفة
			continue; // التالي
		} // نهاية الشرط
		if (p.status === 'active' || p.status === 'in-progress' || p.status === 'review') { // حالات فعالة
			list.push(createInvoiceFromProject(p, { terms: 'net_15', issueNow: true })); // فاتورة صادرة
		} else { // حالات أخرى
			list.push(createInvoiceFromProject(p, { terms: 'net_15', issueNow: false })); // مسودة
		} // نهاية الفروع
	} // نهاية الحلقة
	return list; // إرجاع القائمة
}; // نهاية الدالة

// بيانات seed جاهزة // إنشاء فعلي
export const invoices: Invoice[] = buildSeedInvoices(); // فواتير مبنية من المشاريع

// فهارس للوصول السريع // خرائط
export const invoicesById: Record<string, Invoice> = Object.fromEntries(invoices.map((i) => [i.id, i])); // خريطة حسب id
export const invoicesByProject: Record<string, Invoice[]> = invoices.reduce<Record<string, Invoice[]>>((acc, inv) => { // خريطة حسب مشروع
	(acc[inv.projectId] ||= []).push(inv); // دفع للائحة
	return acc; // إرجاع
}, {}); // نهاية الخريطة
export const invoicesByClient: Record<string, Invoice[]> = invoices.reduce<Record<string, Invoice[]>>((acc, inv) => { // خريطة حسب عميل
	(acc[inv.clientId] ||= []).push(inv); // دفع للائحة
	return acc; // إرجاع
}, {}); // نهاية الخريطة

// استعلامات عامة // دوال قراءة
export const listInvoices = (): Invoice[] => invoices.slice(); // جميع الفواتير
export const findInvoice = (id: string): Invoice | undefined => invoicesById[id]; // البحث بالمعرف
export const listInvoicesByProject = (projectId: string): Invoice[] => invoicesByProject[projectId] ?? []; // حسب المشروع
export const listInvoicesByClient = (clientId: string): Invoice[] => invoicesByClient[clientId] ?? []; // حسب العميل

// ملخص سريع للفواتير // إحصاءات
export const getInvoicesSummary = () => { // دالة التلخيص
	const total = invoices.length; // العدد
	const byStatus: Record<InvoiceStatus, number> = { draft: 0, issued: 0, partially_paid: 0, paid: 0, overdue: 0, cancelled: 0 }; // عدادات
	let subtotal = 0; // مجاميع فرعية
	let totalAmount = 0; // مجاميع نهائية
	for (const inv of invoices) { // حلقة
		byStatus[inv.status]++; // تحديث حالة
		subtotal += inv.amount.subtotal; // جمع فرعي
		totalAmount += inv.amount.total; // جمع نهائي
	} // نهاية الحلقة
	return { total, byStatus, subtotal, totalAmount, currency: getDefaultCurrency() }; // نتيجة الملخص
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const INVOICES_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط
export const invoicesRegistry = { // السجل
	version: INVOICES_SCHEMA_VERSION, // نسخة
	count: invoices.length, // عدد
	byId: invoicesById, // خريطة معرف
	byProject: invoicesByProject, // حسب مشروع
	byClient: invoicesByClient, // حسب عميل
	list: listInvoices, // قائمة
	find: findInvoice, // بحث
	summary: getInvoicesSummary, // تلخيص
}; // نهاية السجل
// Invoices V2.1 - الفواتير
