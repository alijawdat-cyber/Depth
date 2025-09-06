// ================================ // ملف منظم
// المدفوعات (Payments) V2.1 - SSOT // وصف عام
// - دفعات يدوية مرتبطة بالفواتير فقط (V2.0: manual فقط) // النطاق
// - يستهلك فواتير invoices لتثبيت الارتباط وحساب المجاميع // الترابط
// ================================ // فاصل

import { invoices } from './invoices'; // استيراد الفواتير (قائمة جاهزة)

// طريقة الدفع (حسب المواصفات V2.0) // manual فقط
export type PaymentMethod = 'manual'; // نوع الطريقة

// كيان الدفع (حسب القاموس) // شكل الدفعة
export interface Payment { // واجهة الدفع
	id: string; // معرف الدفعة pay_xxx
	invoiceId: string; // معرف الفاتورة المرتبطة
	clientId: string; // معرف العميل
	amount: number; // قيمة الدفعة (>0)
	method: PaymentMethod; // طريقة الدفع
	reference?: string; // مرجع/إيصال
	receivedAt: string; // تاريخ الاستلام
	verifiedBy?: string; // المدقق (بريد/معرف)
	verifiedAt?: string; // وقت التدقيق
	notes?: string; // ملاحظات
	createdAt: string; // تاريخ الإنشاء
	updatedAt: string; // آخر تحديث
} // نهاية الواجهة

// أدوات وقت // مساعدات بسيطة
const nowIso = (): string => new Date().toISOString(); // الآن بصيغة ISO

// إنشاء دفعة يدوية جديدة (factory) // دالة مساعدة
export const createManualPayment = (input: Omit<Payment, 'id' | 'method' | 'createdAt' | 'updatedAt'> & { id?: string; reference?: string }): Payment => { // إنشاء دفع
	const id = input.id ?? `pay_${Math.random().toString(36).slice(2, 8)}`; // توليد معرف
	const now = nowIso(); // الوقت الحالي
	return { // كائن الدفعة
		id, // معرف
		invoiceId: input.invoiceId, // فاتورة
		clientId: input.clientId, // عميل
		amount: input.amount, // قيمة
		method: 'manual', // طريقة
		reference: input.reference, // مرجع
		receivedAt: input.receivedAt, // مستلم في
		verifiedBy: input.verifiedBy, // مدقق
		verifiedAt: input.verifiedAt, // وقت التدقيق
		notes: input.notes, // ملاحظات
		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الكائن
}; // نهاية الدالة

// اختيار بعض الفواتير من السجل لبناء seed // انتقاء آمن
const pickInvoiceId = (predicate?: (id: string) => boolean): string | undefined => { // اختيار معرف
	const all = invoices.slice(); // نسخة من الفواتير
	if (predicate) { // إن وجد شرط
		const match = all.find((i) => predicate(i.id)); // بحث مطابق
		if (match) return match.id; // إرجاع إن وجد
	} // نهاية الشرط
	return all[0]?.id; // أول عنصر افتراضًا
}; // نهاية الدالة

// بيانات تجريبية (seed) للمدفوعات // أمثلة عملية
export const payments: Payment[] = [ // مصفوفة دفعات
	(() => { // دفعة 1: مرتبطة بفاتورة الصالون المثبتة
		const salonId = pickInvoiceId((id) => id === 'inv_002_salon') ?? pickInvoiceId(); // محاولة اختيار المعرف
		const inv = invoices.find((i) => i.id === salonId)!; // جلب الفاتورة
		return createManualPayment({ // إنشاء دفعة
			id: 'pay_002_salon_01', // معرف ثابت
			invoiceId: salonId!, // الفاتورة
			clientId: inv.clientId, // عميل الفاتورة
			amount: Math.min(308000, inv.amount.total), // قيمة مناسبة
			reference: 'REC-001', // إيصال
			receivedAt: '2025-08-27T10:30:00.000Z', // وقت الاستلام
			verifiedBy: 'finance@depth-agency.com', // مدقق
			verifiedAt: '2025-08-27T11:00:00.000Z', // وقت التدقيق
			notes: 'دفعة يدوية خارج النظام (فاتورة/عقد/كاش)', // ملاحظات
		}); // نهاية الإنشاء
	})(), // نهاية العنصر الأول
	(() => { // دفعة 2: لأي فاتورة أخرى (إن وجدت)
		const other = invoices.find((i) => i.id !== 'inv_002_salon') ?? invoices[0]; // اختيار أخرى
		return createManualPayment({ // إنشاء دفعة ثانية
			invoiceId: other.id, // فاتورة
			clientId: other.clientId, // عميل
			amount: Math.max(50000, Math.floor((other.amount.total || 0) * 0.25)), // 25% تقريبًا
			reference: 'REC-002', // إيصال
			receivedAt: '2025-09-01T09:45:00.000Z', // استلام
			verifiedBy: 'admin@depth-agency.com', // مدقق
			verifiedAt: '2025-09-01T10:00:00.000Z', // تدقيق
			notes: 'دفعة مقدمة 25%', // ملاحظات
		}); // نهاية الإنشاء
	})(), // نهاية العنصر الثاني
]; // نهاية المصفوفة

// فهارس مساعدة // خرائط وصول سريع
export const paymentsById: Record<string, Payment> = Object.fromEntries(payments.map((p) => [p.id, p])); // حسب المعرف
export const paymentsByInvoice: Record<string, Payment[]> = payments.reduce<Record<string, Payment[]>>((acc, p) => { // حسب الفاتورة
	(acc[p.invoiceId] ||= []).push(p); // دفع
	return acc; // إرجاع
}, {}); // نهاية الخريطة
export const paymentsByClient: Record<string, Payment[]> = payments.reduce<Record<string, Payment[]>>((acc, p) => { // حسب العميل
	(acc[p.clientId] ||= []).push(p); // دفع
	return acc; // إرجاع
}, {}); // نهاية الخريطة

// مجاميع لكل فاتورة // كشف سريع
export const sumPaidByInvoice = (invoiceId: string): number => { // مجموع مدفوع
	return (paymentsByInvoice[invoiceId] ?? []).reduce((s, p) => s + (p.amount || 0), 0); // جمع
}; // نهاية الدالة

// استعلامات عامة // دوال قراءة
export const listPayments = (): Payment[] => payments.slice(); // جميع الدفعات
export const listPaymentsByInvoice = (invoiceId: string): Payment[] => paymentsByInvoice[invoiceId] ?? []; // حسب الفاتورة
export const listPaymentsByClient = (clientId: string): Payment[] => paymentsByClient[clientId] ?? []; // حسب العميل

// ملخص سريع للمدفوعات // إحصاءات
export const getPaymentsSummary = () => { // تلخيص
	const total = payments.length; // عدد الدفعات
	const totalAmount = payments.reduce((s, p) => s + p.amount, 0); // مجموع القيم
	const byMethod: Record<PaymentMethod, number> = { manual: total }; // حسب الطريقة
	const invoicesWithPayments = Object.keys(paymentsByInvoice).length; // عدد الفواتير ذات الدفعات
	return { total, totalAmount, byMethod, invoicesWithPayments }; // نتيجة
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const PAYMENTS_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط
export const paymentsRegistry = { // السجل
	version: PAYMENTS_SCHEMA_VERSION, // نسخة
	count: payments.length, // عدد
	byId: paymentsById, // حسب المعرف
	byInvoice: paymentsByInvoice, // حسب الفاتورة
	byClient: paymentsByClient, // حسب العميل
	list: listPayments, // قائمة
	listByInvoice: listPaymentsByInvoice, // قائمة حسب فاتورة
	listByClient: listPaymentsByClient, // قائمة حسب عميل
	sumPaidByInvoice, // مجموع مدفوع لفتورة
	summary: getPaymentsSummary, // ملخص
}; // نهاية السجل
// Payments V2.1 - المدفوعات
// Finance V2.1 modules
