// ================================
// مجمّع الخدمات (Services Aggregator) - SSOT
// - يسهّل الاستيراد من مكان واحد
// - يصدر الفئات والفئات الفرعية والصناعات وروابط الصناعات واختصاصات المبدعين وسجلاتها
// ================================

export * from './categories'; // فئات رئيسية
export * from './subcategories'; // فئات فرعية
export * from './industries'; // صناعات
export * from './subcategoryIndustryLinks'; // روابط فئة ↔ صناعة
export * from './creatorSubcategories'; // اختصاصات المبدعين

// سجل مجمّع اختياري للاستخدام العام  // يمكن توسيعه لاحقاً
import { categoriesRegistry } from './categories'; // سجل الفئات
import { subcategoriesRegistry } from './subcategories'; // سجل الفئات الفرعية
import { industriesRegistry } from './industries'; // سجل الصناعات
import { subcategoryIndustryLinksRegistry } from './subcategoryIndustryLinks'; // سجل الروابط
import { creatorSubcategoriesRegistry } from './creatorSubcategories'; // سجل اختصاصات المبدعين

export const servicesRegistry = {
	categories: categoriesRegistry, // سجل الفئات
	subcategories: subcategoriesRegistry, // سجل الفئات الفرعية
	industries: industriesRegistry, // سجل الصناعات
	subcategoryIndustryLinks: subcategoryIndustryLinksRegistry, // سجل الروابط
	creatorSubcategories: creatorSubcategoriesRegistry, // سجل اختصاصات المبدعين
};
// Services Aggregator V2.1 - مجمّع الخدمات
