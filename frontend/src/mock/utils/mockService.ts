// Mock Service V2.1 - خدمات البيانات الوهمية الموحدة للاستعلام/الفرز/الترقيم + CRUD  // تعريف الملف
import type { Paginated, SortOrder, Registry, ISODateString } from '../types/core'; // استيراد الأنواع المشتركة

// -------- أدوات مساعدة داخلية (Internal Utils) --------  // عنوان قسم الأدوات
const nowIso = (): ISODateString => new Date().toISOString(); // وقت ISO حالي

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null; // تحقّق كائن

const getByPath = (obj: unknown, path?: string): unknown => { // جلب قيمة بمسار متداخل
	if (!path) return undefined; // إن لم يوجد مسار
	let acc: unknown = obj; // متغير تراكمي
	for (const key of path.split('.')) { // اجتياز المفاتيح
		if (!isRecord(acc)) return undefined; // يجب أن يكون كائناً
		acc = (acc as Record<string, unknown>)[key]; // انتقال خطوة
	} // نهاية الحلقة
	return acc; // القيمة النهائية
}; // نهاية getByPath

const cmp = (a: unknown, b: unknown, order: SortOrder = 'asc'): number => { // مقارنة عامة للفرز
	const dir = order === 'asc' ? 1 : -1; // اتجاه الفرز
	if (a == null && b == null) return 0; // كلاهما فارغ
	if (a == null) return 1 * dir; // أ يذهب لآخر
	if (b == null) return -1 * dir; // ب يذهب لآخر
	if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b) * dir; // مقارنة نصوص
	if (typeof a === 'number' && typeof b === 'number') return (a - b) * dir; // مقارنة أرقام
	if (a instanceof Date && b instanceof Date) return (a.getTime() - b.getTime()) * dir; // تواريخ
	return String(a).localeCompare(String(b)) * dir; // تحويل عام للنص
}; // نهاية cmp

const asNumber = (x: unknown): number | undefined => { // تحويل لقيمة عددية عند الإمكان
	if (typeof x === 'number' && Number.isFinite(x)) return x; // رقم مباشر
	if (typeof x === 'string') { // إن كانت سلسلة
		const n = Number(x); // تحويل إلى رقم
		if (!Number.isNaN(n)) return n; // رقم صالح
		const d = Date.parse(x); // محاولة كتاريخ ISO
		if (!Number.isNaN(d)) return d; // تاريخ صالح
	} // نهاية شرط السلسلة
	return undefined; // غير قابل للمقارنة عددياً
}; // نهاية asNumber

// -------- تعريف المرشحات (Filters Definition) --------  // عنوان القسم
export type FilterOps<T = unknown> = { // عوامل تشغيل للفلترة
	eq?: T; // يساوي
	ne?: T; // لا يساوي
	in?: T[]; // ضمن قائمة
	contains?: unknown; // يحتوي (للأسطر/المصفوفات)
	gt?: unknown; // أكبر من
	gte?: unknown; // أكبر أو يساوي
	lt?: unknown; // أصغر من
	lte?: unknown; // أصغر أو يساوي
	startsWith?: string; // يبدأ بـ
	endsWith?: string; // ينتهي بـ
}; // نهاية FilterOps

export type Filters<T extends Record<string, unknown>> = Partial<{ [K in keyof T & string]?: T[K] | T[K][] | FilterOps<T[K]> }> & Record<string, unknown>; // نوع المرشحات

export type QueryOptions<T extends Record<string, unknown>> = { // خيارات الاستعلام العامة
	page?: number; // رقم الصفحة (افتراضي 1)
	limit?: number; // حجم الصفحة (افتراضي 20)
	sortBy?: keyof T | string; // الحقل أو المسار للفرز
	sortOrder?: SortOrder; // ترتيب الفرز asc/desc
	search?: string; // نص البحث
	searchFields?: (keyof T | string)[]; // الحقول المشاركة في البحث
	filters?: Filters<T>; // مرشحات كائنية
	predicate?: (item: T) => boolean; // دالة فلترة مخصصة
}; // نهاية QueryOptions

// -------- مُركّب الاستعلام (Query Engine) --------  // عنوان القسم
export const applyFilters = <T extends Record<string, unknown>>(items: T[], filters?: Filters<T>): T[] => { // تطبيق المرشحات
	if (!filters || !Object.keys(filters).length) return items.slice(); // لا مرشحات
	const evalOp = (val: unknown, op: FilterOps<unknown>): boolean => { // تقييم عامل تشغيل
		if (op.eq !== undefined && val !== op.eq) return false; // شرط eq
		if (op.ne !== undefined && val === op.ne) return false; // شرط ne
		if (op.in && Array.isArray(op.in) && !op.in.includes(val as never)) return false; // شرط in
		if (op.contains !== undefined) { // شرط contains
			if (Array.isArray(val)) { if (!val.includes(op.contains as never)) return false; } // مصفوفة
			else if (typeof val === 'string') { if (!val.toLowerCase().includes(String(op.contains).toLowerCase())) return false; } // نص
			else return false; // أنواع أخرى
		} // نهاية contains
	if (op.gt !== undefined) { const a = asNumber(val); const b = asNumber(op.gt); if (a === undefined || b === undefined || !(a > b)) return false; } // أكبر من (عدد/تاريخ)
	if (op.gte !== undefined) { const a = asNumber(val); const b = asNumber(op.gte); if (a === undefined || b === undefined || !(a >= b)) return false; } // أكبر أو يساوي
	if (op.lt !== undefined) { const a = asNumber(val); const b = asNumber(op.lt); if (a === undefined || b === undefined || !(a < b)) return false; } // أصغر من
	if (op.lte !== undefined) { const a = asNumber(val); const b = asNumber(op.lte); if (a === undefined || b === undefined || !(a <= b)) return false; } // أصغر أو يساوي
		if (op.startsWith !== undefined && typeof val === 'string' && !val.toLowerCase().startsWith(op.startsWith.toLowerCase())) return false; // يبدأ بـ
		if (op.endsWith !== undefined && typeof val === 'string' && !val.toLowerCase().endsWith(op.endsWith.toLowerCase())) return false; // ينتهي بـ
		return true; // مطابقة
	}; // نهاية evalOp
	return items.filter((it) => { // فلترة العناصر
		for (const rawKey of Object.keys(filters)) { // تكرار المفاتيح
			const rule = (filters as Record<string, unknown>)[rawKey]; // القاعدة
			const val = rawKey.includes('.') ? getByPath(it, rawKey) : (it as Record<string, unknown>)[rawKey]; // قيمة الحقل
			if (Array.isArray(rule)) { if (!rule.includes(val)) return false; continue; } // قائمة قيم
			if (isRecord(rule)) { if (!evalOp(val, rule as FilterOps<unknown>)) return false; continue; } // عوامل تشغيل
			if (rule !== undefined && val !== rule) return false; // تطابق مباشر
		} // نهاية الحلقة
		return true; // إبقاء العنصر
	}); // نهاية filter
}; // نهاية applyFilters

export const applySearch = <T extends Record<string, unknown>>(items: T[], query?: string, fields?: (keyof T | string)[]): T[] => { // تطبيق البحث
	const q = (query ?? '').trim().toLowerCase(); // تحضير النص
	if (!q) return items.slice(); // لا بحث
	const pick = (obj: unknown, k: string | keyof T) => (typeof k === 'string' && k.includes('.') ? getByPath(obj, k) : (obj as Record<string, unknown>)[k as string]); // جلب حقل
	return items.filter((it) => { // فلترة بالعناصر
		const keys = fields && fields.length ? fields : Object.keys(it); // الحقول المستهدفة
		for (const k of keys) { // المرور على الحقول
			const v = pick(it, k); // قيمة الحقل
			if (typeof v === 'string' && v.toLowerCase().includes(q)) return true; // تطابق نصي
			if (Array.isArray(v) && v.some((x) => String(x).toLowerCase().includes(q))) return true; // داخل مصفوفة
		} // نهاية الحلقة
		return false; // لا تطابق
	}); // نهاية filter
}; // نهاية applySearch

export const applySort = <T extends Record<string, unknown>>(items: T[], sortBy?: keyof T | string, sortOrder: SortOrder = 'asc'): T[] => { // تطبيق الفرز
	if (!sortBy) return items.slice(); // دون فرز
	const getVal = (it: T) => (typeof sortBy === 'string' && sortBy.includes('.') ? getByPath(it, sortBy) : (it as Record<string, unknown>)[sortBy as string]); // جلب القيمة
	return items.slice().sort((a, b) => cmp(getVal(a), getVal(b), sortOrder)); // ترتيب العناصر
}; // نهاية applySort

export const paginate = <T>(items: T[], page = 1, limit = 20): Paginated<T> => { // تنفيذ الترقيم
	const total = items.length; // إجمالي العناصر
	const start = (Math.max(1, page) - 1) * Math.max(1, limit); // بداية القص
	const end = start + Math.max(1, limit); // نهاية القص
	const pageItems = items.slice(start, end); // عناصر الصفحة
	const pages = limit > 0 ? Math.ceil(total / limit) : 0; // عدد الصفحات
	return { items: pageItems, total, page, pageSize: limit, pages }; // كائن Paginated
}; // نهاية paginate

export const queryArray = <T extends Record<string, unknown>>(all: T[], opts?: QueryOptions<T>): Paginated<T> => { // استعلام موحّد على مصفوفة
	const page = opts?.page ?? 1; // رقم الصفحة
	const limit = opts?.limit ?? 20; // حجم الصفحة
	const filtered = applyFilters(all, opts?.filters); // تطبيق المرشحات
	const searched = applySearch(filtered, opts?.search, opts?.searchFields as (keyof T | string)[] | undefined); // تطبيق البحث
	const sorted = applySort(searched, opts?.sortBy, opts?.sortOrder ?? 'asc'); // تطبيق الفرز
	return paginate(sorted, page, limit); // إعادة الترقيم
}; // نهاية queryArray

// -------- CRUD على سجل موحّد (Registry CRUD) --------  // عنوان القسم
export class MockService<T extends Record<string, unknown> & { id: string; createdAt?: ISODateString; updatedAt?: ISODateString }> { // فئة خدمة وهمية
	private registry: Registry<T>; // مرجع السجل الداخلي

	constructor(initial: T[] = []) { // باني الفئة
		this.registry = { list: initial.slice(), mapById: Object.fromEntries(initial.map((x) => [x.id, x])) }; // تهيئة السجل
	} // نهاية الباني

	get all(): T[] { return this.registry.list; } // قراءة جميع العناصر
	get byId(): Record<string, T> { return this.registry.mapById; } // خريطة حسب المعرّف

	refreshIndex(): void { // إعادة بناء الفهرس
		this.registry.mapById = Object.fromEntries(this.registry.list.map((x) => [x.id, x])); // بناء mapById
	} // نهاية refreshIndex

	find(id: string): T | undefined { // إيجاد عنصر بالمعرّف
		return this.registry.mapById[id]; // جلب من الخريطة
	} // نهاية find

	list(opts?: QueryOptions<T>): Paginated<T> { // سرد مع استعلام موحّد
		return queryArray(this.registry.list, opts); // تفويض للمحرك
	} // نهاية list

		create(item: T): T { // إنشاء عنصر جديد
		const now = nowIso(); // زمن الآن
			const withTs = { ...item } as T & { createdAt?: ISODateString; updatedAt?: ISODateString }; // نسخة قابلة للتعديل
			if (!withTs.createdAt) withTs.createdAt = now; // تعيين createdAt
			withTs.updatedAt = now; // تعيين updatedAt
		this.registry.list.push(withTs); // دفع إلى القائمة
		this.registry.mapById[withTs.id] = withTs; // تحديث الخريطة
		return withTs; // إرجاع العنصر
	} // نهاية create

		update(id: string, patch: Partial<T>): T | undefined { // تحديث عنصر
		const cur = this.registry.mapById[id]; // العنصر الحالي
		if (!cur) return undefined; // غير موجود
		const now = nowIso(); // زمن الآن
			const next = { ...cur, ...patch } as T & { updatedAt?: ISODateString }; // دمج التصحيح
			next.updatedAt = now; // تحديث الطابع الزمني
		const idx = this.registry.list.findIndex((x) => x.id === id); // موضع في القائمة
		if (idx >= 0) this.registry.list[idx] = next; // استبدال بالقائمة
		this.registry.mapById[id] = next; // تحديث الخريطة
		return next; // إرجاع المحدّث
	} // نهاية update

		upsert(item: T): T { // إنشاء أو تحديث
		return this.find(item.id) ? (this.update(item.id, item) as T) : this.create(item); // قرار آلي
	} // نهاية upsert

		delete(id: string, opts?: { soft?: boolean }): boolean { // حذف عنصر
		const cur = this.registry.mapById[id]; // العنصر الحالي
		if (!cur) return false; // غير موجود
		if (opts?.soft) { // حذف منطقي
				const soft = cur as T & { isArchived?: boolean; deletedAt?: ISODateString }; // حقول لينة
				if ('isArchived' in cur) soft.isArchived = true; // تعيين مؤرشف
				if ('deletedAt' in cur) soft.deletedAt = nowIso(); // وقت الحذف
			this.update(id, cur); // تحديث العنصر
			return true; // تمت العملية
		} // نهاية soft
		this.registry.list = this.registry.list.filter((x) => x.id !== id); // إزالة من القائمة
		delete this.registry.mapById[id]; // إزالة من الخريطة
		return true; // تمت الإزالة
	} // نهاية delete
} // نهاية الفئة

// -------- دوال مساعدة جاهزة للاستخدام المباشر --------  // عنوان قسم إضافي
export const buildRegistry = <T extends { id: string }>(items: T[]): Registry<T> => ({ list: items.slice(), mapById: Object.fromEntries(items.map((x) => [x.id, x])) }); // بناء سجل سريع

export const queryRegistry = <T extends Record<string, unknown> & { id: string }>(registry: Registry<T>, opts?: QueryOptions<T>): Paginated<T> => queryArray<T>(registry.list, opts); // استعلام على سجل

export const sortByField = <T extends Record<string, unknown>>(items: T[], field: keyof T | string, order: SortOrder = 'asc'): T[] => applySort(items, field, order); // فرز مختصر

export const searchBy = <T extends Record<string, unknown>>(items: T[], q: string, fields?: (keyof T | string)[]): T[] => applySearch(items, q, fields); // بحث مختصر

export const filterBy = <T extends Record<string, unknown>>(items: T[], filters: Filters<T>): T[] => applyFilters(items, filters); // فلترة مختصرة

export const paginateOnly = paginate; // إعادة تصدير الترقيم كما هو

// ملاحظات توافقية:
// - يتوافق مع التوثيق: 03-api/core/00-api-conventions.md (page & limit) ويعيد pageSize = limit داخل Paginated<T>.  // توضيح 1
// - يدعم search + filters + sortBy/Order بشكل مرن (مسارات متداخلة مدعومة "a.b.c").  // توضيح 2
// - CRUD يعمل فوق Registry<T> المستخدم على نطاق الموك (list + mapById).  // توضيح 3
// - لا يعتمد على حالة خارجية ويمكن استخدامه مع أي وحدة موك في frontend/src/mock/*.  // توضيح 4

