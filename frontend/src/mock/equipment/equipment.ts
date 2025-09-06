// ================================ // ملف منظم
// المعدات (Equipment) V2.1 - SSOT // وصف عام
// - مصدر الحقيقة لقوائم معدات المبدعين والوكالة مع مستويات الجودة // الهدف
// - متوافق مع EquipmentTier من ../types/pricing ويقدم حساب tier مبسّط // التوافق
// ================================ // فاصل

import type { EquipmentTier } from '../types/pricing'; // استيراد نوع مستوى المعدات من التسعير

// تعريف مالك المعدّة // يمكن أن تكون ملك الوكالة أو المبدع
export type EquipmentOwner = { // نوع مالك
	type: 'agency' | 'creator'; // نوع المالك
	id: string; // معرف المالك (creator_001 أو agency_main)
}; // نهاية النوع

// فئات المعدّات الشائعة // كاميرا/عدسة/إضاءة/صوت/إكسسوارات
export type EquipmentCategory = 'camera' | 'lens' | 'lighting' | 'audio' | 'accessories'; // ENUM مبسّط

// حالة المعدّة // لتقييم الجودة
export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'needs_service'; // حالات معتمدة

// تعريف كيان معدّة // الحقول القياسية
export interface EquipmentItem { // واجهة العنصر
	id: string; // معرف فريد للمعدّة
	owner: EquipmentOwner; // مالك المعدّة
	category: EquipmentCategory; // فئة المعدّة
	brand: string; // علامة تجارية
	model: string; // موديل
	status: EquipmentCondition; // حالة المعدّة
	isApproved: boolean; // موافقة الإدارة
	purchaseDate?: string; // تاريخ الشراء (اختياري)
	serialNumber?: string; // رقم تسلسلي (اختياري)
	notes?: string; // ملاحظات (اختياري)
	addedAt: string; // تاريخ الإضافة
	updatedAt: string; // آخر تحديث
} // نهاية الواجهة

// نسخة مخطط المعدات // لتعقب الإصدار
export const EQUIPMENT_SCHEMA_VERSION = '2.1.0'; // نسخة 2.1.0

// مولد وقت ISO مبسّط // أداة وقت
const nowIso = (): string => new Date().toISOString(); // إرجاع الآن بصيغة ISO

// بيانات أولية (seed) مترابطة مع creators // عيّنات واقعية
export const equipment: EquipmentItem[] = [ // قائمة المعدات
	{ // عنصر 1: كاميرا لمبدع 1
		id: 'eq_creator001_cam', // معرف
		owner: { type: 'creator', id: 'creator_001' }, // مالك: مبدع
		category: 'camera', // فئة
		brand: 'Canon', // ماركة
		model: 'R6', // موديل
		status: 'excellent', // حالة
		isApproved: true, // موافق عليه
		purchaseDate: '2023-01-15', // تاريخ شراء
		serialNumber: 'CN-R6-001', // رقم تسلسلي
		notes: 'كاميرا فل فريم مناسبة للمنتجات والبورتريه', // ملاحظات
		addedAt: '2024-11-11T00:00:00.000Z', // إضافة
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // عنصر 2: عدسة لمبدع 1
		id: 'eq_creator001_lens', // معرف
		owner: { type: 'creator', id: 'creator_001' }, // مالك
		category: 'lens', // فئة
		brand: 'Canon', // ماركة
		model: '24-70mm f/2.8', // موديل
		status: 'good', // حالة
		isApproved: true, // موافق عليه
		addedAt: '2024-11-11T00:05:00.000Z', // إضافة
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // عنصر 3: إضاءة لمبدع 1 (بانتظار الموافقة)
		id: 'eq_creator001_light', // معرف
		owner: { type: 'creator', id: 'creator_001' }, // مالك
		category: 'lighting', // فئة
		brand: 'Godox', // ماركة
		model: 'V1', // موديل
		status: 'excellent', // حالة
		isApproved: false, // غير موافق عليه بعد
		notes: 'تحت المراجعة من الإدارة', // ملاحظة
		addedAt: '2025-08-10T09:00:00.000Z', // إضافة
		updatedAt: '2025-08-20T09:00:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // عنصر 4: كاميرا لمبدع 2
		id: 'eq_creator002_cam', // معرف
		owner: { type: 'creator', id: 'creator_002' }, // مالك
		category: 'camera', // فئة
		brand: 'Sony', // ماركة
		model: 'A7 IV', // موديل
		status: 'good', // حالة
		isApproved: true, // موافق عليه
		purchaseDate: '2022-10-05', // تاريخ شراء
		serialNumber: 'SN-A7IV-002', // رقم تسلسلي
		addedAt: '2024-10-05T00:00:00.000Z', // إضافة
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // عنصر 5: إضاءة لمبدع 2
		id: 'eq_creator002_light', // معرف
		owner: { type: 'creator', id: 'creator_002' }, // مالك
		category: 'lighting', // فئة
		brand: 'Godox', // ماركة
		model: 'SL60W', // موديل
		status: 'good', // حالة
		isApproved: true, // موافق عليه
		addedAt: '2024-10-06T00:00:00.000Z', // إضافة
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // عنصر 6: عدّة صوت لمبدع 3
		id: 'eq_creator003_audio', // معرف
		owner: { type: 'creator', id: 'creator_003' }, // مالك
		category: 'audio', // فئة
		brand: 'Rode', // ماركة
		model: 'Wireless GO II', // موديل
		status: 'fair', // حالة
		isApproved: true, // موافق عليه
		addedAt: '2025-01-20T00:00:00.000Z', // إضافة
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	}, // نهاية العنصر
	{ // عنصر 7: حامل وإكسسوارات للوكالة
		id: 'eq_agency_tripod', // معرف
		owner: { type: 'agency', id: 'agency_main' }, // مالك
		category: 'accessories', // فئة
		brand: 'Manfrotto', // ماركة
		model: 'MT055XPRO3', // موديل
		status: 'excellent', // حالة
		isApproved: true, // موافق عليه
		addedAt: '2023-12-01T08:00:00.000Z', // إضافة
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	}, // نهاية العنصر
]; // نهاية القائمة

// خرائط وصول سريعة // فهارس
export const equipmentById: Record<string, EquipmentItem> = Object.fromEntries( // بناء خريطة بالمعرف
	equipment.map((e) => [e.id, e]) // تحويل المصفوفة لأزواج [id, item]
); // نهاية الخريطة

export const equipmentByOwner: Record<string, EquipmentItem[]> = equipment.reduce<Record<string, EquipmentItem[]>>( // خريطة حسب المالك
	(acc, item) => { // دالة التجميع
		const key = `${item.owner.type}:${item.owner.id}`; // مفتاح مركب
		(acc[key] ||= []).push(item); // دفع العنصر تحت المالك
		return acc; // إرجاع المجمع
	}, // نهاية الدالة
	{} // قيمة ابتدائية
); // نهاية الخريطة

// دوال مساعدة للاستعلام // واجهات استخدام بسيطة
export const listEquipment = (): EquipmentItem[] => equipment.slice(); // قائمة كاملة
export const listEquipmentByOwner = (owner: EquipmentOwner): EquipmentItem[] => // حسب المالك
	equipmentByOwner[`${owner.type}:${owner.id}`] ?? []; // إرجاع أو مصفوفة فارغة
export const listApprovedEquipment = (owner?: EquipmentOwner): EquipmentItem[] => { // العناصر الموافق عليها
	if (!owner) return equipment.filter((e) => e.isApproved); // كل الموافقات
	return listEquipmentByOwner(owner).filter((e) => e.isApproved); // موافقات لمالك محدد
}; // نهاية الدالة

// حساب مستوى المعدّات للمبدع // قاعدة تقديرية مبسّطة
export const calculateCreatorEquipmentTier = (creatorId: string): EquipmentTier => { // تحديد tier
	const items = listEquipmentByOwner({ type: 'creator', id: creatorId }); // جلب معدات المبدع
	const hasCamera = items.some((i) => i.category === 'camera' && i.isApproved); // كاميرا موافق عليها
	const hasLens = items.some((i) => i.category === 'lens' && i.isApproved); // عدسة موافق عليها
	const hasLighting = items.some((i) => i.category === 'lighting' && i.isApproved); // إضاءة موافق عليها
	const hasExcellent = items.some((i) => i.status === 'excellent' && i.isApproved); // حالة ممتازة
	if (hasCamera && hasLens && hasLighting && hasExcellent) return 'platinum'; // معيار بلاتيني
	if ((hasCamera && hasLens) || (hasCamera && hasLighting) || hasExcellent) return 'gold'; // معيار ذهبي
	if (hasCamera || hasLens || hasLighting) return 'silver'; // معيار فضي
	return 'silver'; // افتراضي فضي عند عدم توفر معدات
}; // نهاية الدالة

// جلب معامل المستوى (مرجع تسعيري) // مطابق للـ Enums Standard
export const getTierModifier = (tier: EquipmentTier): number => { // إرجاع معامل
	return tier === 'platinum' ? 1.2 : tier === 'gold' ? 1.1 : 1.0; // قيم قياسية
}; // نهاية الدالة

// ملخص مستوى معدات المبدع // معلومات سريعة
export const getCreatorTierSummary = (creatorId: string) => { // دالة تلخيص
	const tier = calculateCreatorEquipmentTier(creatorId); // حساب المستوى
	const modifier = getTierModifier(tier); // معامل المستوى
	const items = listEquipmentByOwner({ type: 'creator', id: creatorId }); // قائمة المعدات
	const counts = items.reduce( // إحصاء حسب الفئة
		(acc, it) => { // دالة التجميع
			acc[it.category] = (acc[it.category] ?? 0) + 1; // زيادة العدد
			return acc; // إرجاع المجمع
		}, // نهاية الدالة
		{} as Record<EquipmentCategory, number> // خريطة نتائج
	); // نهاية التجميع
	return { creatorId, tier, modifier, counts, generatedAt: nowIso() }; // نتيجة الملخص
}; // نهاية الدالة

// سجل تجميعي للوصول العام // Registry
export const equipmentRegistry = { // السجل
	version: EQUIPMENT_SCHEMA_VERSION, // نسخة
	count: equipment.length, // عدد
	all: equipment, // كل العناصر
	byId: equipmentById, // خريطة حسب المعرف
	byOwner: equipmentByOwner, // خريطة حسب المالك
	list: listEquipment, // دالة قائمة
	listByOwner: listEquipmentByOwner, // دالة حسب مالك
	listApproved: listApprovedEquipment, // دالة موافقات
	calculateCreatorTier: calculateCreatorEquipmentTier, // دالة حساب tier
	getTierModifier, // دالة معامل
	getCreatorTierSummary, // دالة ملخص
}; // نهاية السجل
// Equipment V2.1 - المعدات
