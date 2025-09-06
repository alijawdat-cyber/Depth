// ================================
// معاملات الملكية (Ownership) - SSOT
// - متوافقة مع متطلبات V2.1 وقيم البيانات القديمة
// - تُستخدم لتعديل السعر حسب توفر معدات المبدع أو معدات الوكالة
// ================================

import type { PricingModifier } from '../types/pricing'; // استيراد نوع المعدّل

// قائمة معاملات الملكية القياسية  // owned | agency_equipment
export const ownershipModifiers: PricingModifier[] = [
  {
    id: 'own_001_owned', // معرّف فريد
    category: 'ownership', // فئة المعدّل
    name: 'بمعدات خاصة', // اسم عربي وصفي
    key: 'owned', // المفتاح البرمجي
    value: 1.0, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'المبدع يملك معدات خاصة', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
  {
    id: 'own_002_agency_equipment', // معرّف فريد
    category: 'ownership', // فئة المعدّل
    name: 'معدات الوكالة', // اسم عربي وصفي
    key: 'agency_equipment', // المفتاح البرمجي
    value: 0.9, // قيمة معامل الضرب
    type: 'multiplier', // نوع المعدّل (معامل ضرب)
    description: 'يستخدم معدات الوكالة (خصم من سعر المبدع)', // وصف مختصر
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // تاريخ الإنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // آخر تحديث
  },
];
