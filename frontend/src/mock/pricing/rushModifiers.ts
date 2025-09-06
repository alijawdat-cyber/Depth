// ================================
// معاملات الاستعجال (Rush) - SSOT
// - متوافقة مع متطلبات V2.1 وقيم البيانات القديمة
// - تستخدم ضمن حساب أسعار المهام (calculations)
// ================================

import type { PricingModifier } from '../types/pricing'; // استيراد نوع المعدّل

// قائمة معاملات الاستعجال القياسية  // normal | rush
export const rushModifiers: PricingModifier[] = [
  {
    id: 'rush_001_normal', // معرّف فريد
    category: 'rush', // فئة المعدّل
    name: 'عادي', // اسم عربي وصفي
    key: 'normal', // المفتاح البرمجي
    value: 1.0, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'تسليم عادي دون استعجال', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'rush_002_rush', // معرّف فريد
    category: 'rush', // فئة المعدّل
    name: 'مستعجل', // اسم عربي وصفي
    key: 'rush', // المفتاح البرمجي
    value: 1.2, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'تسليم مستعجل خلال 24-48 ساعة', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
];
// Rush Modifiers V2.1 - معاملات الاستعجال
