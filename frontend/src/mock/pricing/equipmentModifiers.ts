// ================================
// معاملات المعدات (Equipment) - SSOT
// - متوافقة مع متطلبات V2.1 وقيم البيانات القديمة
// - تستخدم ضمن حساب أسعار المهام (calculations)
// ================================

import type { PricingModifier } from '../types/pricing'; // استيراد نوع المعدّل

// قائمة معاملات المعدات القياسية  // silver | gold | platinum
export const equipmentModifiers: PricingModifier[] = [
	{
		id: 'eq_001_silver', // معرّف فريد
		category: 'equipment', // فئة المعدّل
		name: 'فضي', // اسم عربي وصفي
		key: 'silver', // المفتاح البرمجي
		value: 1.0, // قيمة معامل الضرب
		type: 'multiplier', // نوع المعدّل (معامل ضرب)
		description: 'معدات أساسية', // وصف مختصر
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
	},
	{
		id: 'eq_002_gold', // معرّف فريد
		category: 'equipment', // فئة المعدّل
		name: 'ذهبي', // اسم عربي وصفي
		key: 'gold', // المفتاح البرمجي
		value: 1.1, // قيمة معامل الضرب
		type: 'multiplier', // نوع المعدّل (معامل ضرب)
		description: 'معدات متوسطة', // وصف مختصر
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
	},
	{
		id: 'eq_003_platinum', // معرّف فريد
		category: 'equipment', // فئة المعدّل
		name: 'بلاتيني', // اسم عربي وصفي
		key: 'platinum', // المفتاح البرمجي
		value: 1.2, // قيمة معامل الضرب
		type: 'multiplier', // نوع المعدّل (معامل ضرب)
		description: 'معدات احترافية', // وصف مختصر
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
	},
];
