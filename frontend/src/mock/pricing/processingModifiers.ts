// ================================
// معاملات المعالجة (Processing) - SSOT
// - متوافقة مع متطلبات V2.1 وقيم البيانات القديمة
// - تستخدم في حساب أسعار المهام عبر ملف calculations
// ================================

import type { PricingModifier } from '../types/pricing'; // استيراد نوع المعدّل

// قائمة معاملات المعالجة القياسية  // raw | basic | color_correction | full_retouch | advanced_composite
export const processingModifiers: PricingModifier[] = [
  {
    id: 'proc_001_raw', // معرّف فريد
    category: 'processing', // فئة المعدّل
    name: 'خام', // اسم وصفي بالعربية
    key: 'raw', // مفتاح برمجي مستخدم بالحساب
    value: 0.9, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'تسليم خام بدون معالجة', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'proc_002_basic', // معرّف فريد
    category: 'processing', // فئة المعدّل
    name: 'أساسي', // اسم وصفي بالعربية
    key: 'basic', // مفتاح برمجي مستخدم بالحساب
    value: 1.0, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'تعديلات أساسية (السعر الأساسي)', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'proc_003_color_correction', // معرّف فريد
    category: 'processing', // فئة المعدّل
    name: 'تصحيح ألوان', // اسم وصفي بالعربية
    key: 'color_correction', // مفتاح برمجي مستخدم بالحساب
    value: 1.1, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'تصحيح ألوان متقدم', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'proc_004_full_retouch', // معرّف فريد
    category: 'processing', // فئة المعدّل
    name: 'معالجة كاملة', // اسم وصفي بالعربية
    key: 'full_retouch', // مفتاح برمجي مستخدم بالحساب
    value: 1.3, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'ريتش وتحرير كامل', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'proc_005_advanced_composite', // معرّف فريد
    category: 'processing', // فئة المعدّل
    name: 'تركيب متقدم', // اسم وصفي بالعربية
    key: 'advanced_composite', // مفتاح برمجي مستخدم بالحساب
    value: 1.5, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'دمج وتركيب متقدم', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
];
// Processing Modifiers V2.1 - معاملات المعالجة
