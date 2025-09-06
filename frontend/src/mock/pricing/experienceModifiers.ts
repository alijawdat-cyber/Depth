// ================================
// معاملات الخبرة (Experience) - SSOT
// - متوافقة مع متطلبات V2.1 وقيم البيانات القديمة
// - تستخدم ضمن حساب أسعار المهام (calculations)
// ================================

import type { PricingModifier } from '../types/pricing'; // استيراد نوع المعدّل

// قائمة معاملات الخبرة القياسية  // fresh | experienced | expert
export const experienceModifiers: PricingModifier[] = [
  {
    id: 'exp_001_fresh', // معرّف فريد
    category: 'experience', // فئة المعدّل
    name: 'مبتدئ', // اسم عربي وصفي
    key: 'fresh', // المفتاح البرمجي
    value: 1.0, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: '0-1 سنة خبرة', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'exp_002_experienced', // معرّف فريد
    category: 'experience', // فئة المعدّل
    name: 'متمرس', // اسم عربي وصفي
    key: 'experienced', // المفتاح البرمجي
    value: 1.1, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: '1-3 سنوات خبرة', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'exp_003_expert', // معرّف فريد
    category: 'experience', // فئة المعدّل
    name: 'خبير', // اسم عربي وصفي
    key: 'expert', // المفتاح البرمجي
    value: 1.2, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: '3+ سنوات خبرة', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
];
// Experience Modifiers V2.1 - معاملات الخبرة
