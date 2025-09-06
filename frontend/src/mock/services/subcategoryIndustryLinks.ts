// ================================
// روابط الفئة الفرعية ←→ الصناعة - SSOT V2.1
// - تحدد ملاءمة subcategory لصناعة معينة لتغذية الاقتراحات
// - يمكن أن تحمل score (0-100) وتوصيف بسيط
// ================================

import type { SubcategorySSOT } from './subcategories';
import type { IndustrySSOT } from './industries';

export interface SubcategoryIndustryLink {
	id: string; // المعرّف
	subcategoryId: SubcategorySSOT['id']; // فئة فرعية
	industryId: IndustrySSOT['id']; // صناعة
	score: number; // 0-100 درجة الملاءمة
	notes?: string; // ملاحظة اختيارية
	createdAt: string; // إنشاء
	updatedAt: string; // تحديث
}

export const SUBCATEGORY_INDUSTRY_LINKS_SCHEMA_VERSION = '2.1.0';

// مجموعة روابط أولية منطقية بالاعتماد على شيوع الاستخدام
export const subcategoryIndustryLinks: SubcategoryIndustryLink[] = [
	// تصوير منتجات مناسب للتجارة الإلكترونية والأزياء والأغذية
	{
		id: 'link_product_ecom',
		subcategoryId: 'sub_product_photo',
		industryId: 'ind_e_commerce',
		score: 95,
		notes: 'منتجات متجر إلكتروني',
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_product_fashion',
		subcategoryId: 'sub_product_photo',
		industryId: 'ind_fashion',
		score: 90,
		notes: 'أزياء وإكسسوارات',
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_product_food',
		subcategoryId: 'sub_product_photo',
		industryId: 'ind_food',
		score: 80,
		notes: 'منتجات غذائية/تعريفية',
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},

	// تصوير طعام مناسب لقطاع الأغذية والضيافة والتجارة الإلكترونية
	{
		id: 'link_food_food',
		subcategoryId: 'sub_food_photo',
		industryId: 'ind_food',
		score: 95,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_food_hospitality',
		subcategoryId: 'sub_food_photo',
		industryId: 'ind_hospitality',
		score: 88,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_food_ecom',
		subcategoryId: 'sub_food_photo',
		industryId: 'ind_e_commerce',
		score: 75,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},

	// تصوير داخلي مناسب للعقارات والضيافة
	{
		id: 'link_interior_realestate',
		subcategoryId: 'sub_interior',
		industryId: 'ind_real_estate',
		score: 95,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_interior_hospitality',
		subcategoryId: 'sub_interior',
		industryId: 'ind_hospitality',
		score: 85,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},

	// Reels/video قصير مناسب للتجارة الإلكترونية/الموضة/التجميل/التقنية
	{
		id: 'link_reels_ecom',
		subcategoryId: 'sub_reels_30s',
		industryId: 'ind_e_commerce',
		score: 90,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_reels_fashion',
		subcategoryId: 'sub_reels_30s',
		industryId: 'ind_fashion',
		score: 85,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_reels_beauty',
		subcategoryId: 'sub_reels_30s',
		industryId: 'ind_beauty',
		score: 82,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'link_reels_tech',
		subcategoryId: 'sub_reels_30s',
		industryId: 'ind_tech',
		score: 78,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

// خرائط للوصول السريع
export const linksBySubcategory: Record<string, SubcategoryIndustryLink[]> = subcategoryIndustryLinks.reduce(
	(acc, l) => {
		(acc[l.subcategoryId] ||= []).push(l);
		return acc;
	},
	{} as Record<string, SubcategoryIndustryLink[]>
);

export const linksByIndustry: Record<string, SubcategoryIndustryLink[]> = subcategoryIndustryLinks.reduce(
	(acc, l) => {
		(acc[l.industryId] ||= []).push(l);
		return acc;
	},
	{} as Record<string, SubcategoryIndustryLink[]>
);

// دوال مساعدة
export const listIndustriesForSubcategory = (subcategoryId: string): SubcategoryIndustryLink[] =>
	(linksBySubcategory[subcategoryId] || []).slice().sort((a, b) => b.score - a.score);

export const listSubcategoriesForIndustry = (industryId: string): SubcategoryIndustryLink[] =>
	(linksByIndustry[industryId] || []).slice().sort((a, b) => b.score - a.score);

// سجل تجميعي
export const subcategoryIndustryLinksRegistry = {
	version: SUBCATEGORY_INDUSTRY_LINKS_SCHEMA_VERSION,
	count: subcategoryIndustryLinks.length,
	all: subcategoryIndustryLinks,
	bySubcategory: linksBySubcategory,
	byIndustry: linksByIndustry,
};
// Subcategory ↔ Industry Links V2.1 - روابط الصناعات
