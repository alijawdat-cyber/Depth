// ================================
// خدمة الفئات الرئيسية (Categories) - SSOT V2.1
// - مصدر الحقيقة لأكواد وأسماء الفئات الرئيسية
// - متوافقة مع الوثائق وقيم mock القديمة
// - تربط مع الفئات الفرعية عبر دوال مساعدة
// ================================

import { subcategories, type SubcategorySSOT } from './subcategories'; // ربط الفئات الفرعية

// تعريف واجهة الفئة الرئيسية  // بنية قياسية بسيطة
export interface CategorySSOT {
  id: string; // المعرّف
  code: 'photo' | 'video' | 'design' | 'editing'; // كود ثابت
  nameAr: string; // الاسم عربي
  nameEn: string; // الاسم إنجليزي
  displayOrder: number; // ترتيب العرض
  isActive: boolean; // فعّال
  createdAt: string; // تاريخ الإنشاء ISO
  updatedAt: string; // آخر تحديث ISO
}

// نسخة المخطط للفئات  // لمواءمة الإصدارات
export const CATEGORIES_SCHEMA_VERSION = '2.1.0'; // نسخة 2.1.0

// قائمة الفئات الرئيسية (SSOT)  // منقولة من mock القديمة
export const categories: CategorySSOT[] = [
  {
    id: 'cat_photo', // id
    code: 'photo', // كود
    nameAr: 'تصوير فوتوغرافي', // عربي
    nameEn: 'Photography', // إنجليزي
    displayOrder: 1, // ترتيب
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
  },
  {
    id: 'cat_video', // id
    code: 'video', // كود
    nameAr: 'إنتاج فيديو', // عربي
    nameEn: 'Video Production', // إنجليزي
    displayOrder: 2, // ترتيب
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
  },
  {
    id: 'cat_design', // id
    code: 'design', // كود
    nameAr: 'تصميم جرافيك', // عربي
    nameEn: 'Graphic Design', // إنجليزي
    displayOrder: 3, // ترتيب
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
  },
  {
    id: 'cat_editing', // id
    code: 'editing', // كود
    nameAr: 'مونتاج', // عربي
    nameEn: 'Video Editing', // إنجليزي
    displayOrder: 4, // ترتيب
    isActive: true, // فعّال
    createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
    updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
  },
];

// خرائط lookup سريعة  // للوصول المباشر
export const categoryById: Record<string, CategorySSOT> = Object.fromEntries(categories.map((c) => [c.id, c])); // id→فئة
export const categoryByCode: Record<CategorySSOT['code'], CategorySSOT> = Object.fromEntries(
  categories.map((c) => [c.code, c]) // code→فئة
) as Record<CategorySSOT['code'], CategorySSOT>; // تصنيف

// دوال مساعدة  // واجهة استخدام بسيطة
export const getCategoryById = (id: string): CategorySSOT | undefined => categoryById[id]; // جلب بالفئة id
export const getCategoryByCode = (code: CategorySSOT['code']): CategorySSOT | undefined => categoryByCode[code]; // جلب code
export const listCategories = (): CategorySSOT[] => categories.slice().sort((a, b) => a.displayOrder - b.displayOrder); // قائمة مرتبة

// ربط الفئات بالفئات الفرعية  // تصفية حسب categoryId
export const listSubcategoriesForCategory = (categoryId: string): SubcategorySSOT[] =>
  subcategories.filter((s) => s.categoryId === categoryId); // فئات فرعية للفئة

// سجل تجميعي  // لتسهيل الاستهلاك من الواجهات
export const categoriesRegistry = {
  version: CATEGORIES_SCHEMA_VERSION, // نسخة المخطط
  count: categories.length, // العدد
  all: categories, // الكل
  byId: categoryById, // حسب id
  byCode: categoryByCode, // حسب code
};
// Categories Service V2.1 - خدمة الفئات الرئيسية
// Categories V2.1 - الفئات الرئيسية
