// ================================
// ربط المبدعين بالفئات الفرعية - SSOT V2.1
// - يحدد اختصاصات/مهارات كل مبدع عبر subcategoryIds
// - يستخدم لاحقاً في الترشيحات والاسناد
// ================================

import type { SubcategorySSOT } from './subcategories';

export interface CreatorSubcategories {
	id: string; // المعرّف
	creatorId: string; // معرّف المبدع
	subcategoryIds: SubcategorySSOT['id'][]; // قائمة الفئات الفرعية التي يتقنها
	yearsOfExperience?: number; // خبرة تقريبية
	averageRating?: number; // تقييم تقريبي 0-5
	updatedAt: string; // آخر تحديث
}

export const CREATOR_SUBCATEGORIES_SCHEMA_VERSION = '2.1.0';

// بيانات وهمية أولية: نختار بضعة مبدعين افتراضيين وربطهم بفئات شائعة
export const creatorSubcategories: CreatorSubcategories[] = [
	{
		id: 'cs_creator_001',
		creatorId: 'creator_001',
		subcategoryIds: ['sub_product_photo', 'sub_flatlay', 'sub_360_photo'],
		yearsOfExperience: 3,
		averageRating: 4.6,
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'cs_creator_002',
		creatorId: 'creator_002',
		subcategoryIds: ['sub_food_photo', 'sub_interior', 'sub_reels_30s'],
		yearsOfExperience: 5,
		averageRating: 4.8,
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'cs_creator_003',
		creatorId: 'creator_003',
		subcategoryIds: ['sub_logo_design', 'sub_social_posts', 'sub_motion_graphics'],
		yearsOfExperience: 4,
		averageRating: 4.4,
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

// خرائط للوصول السريع
export const creatorSubcategoriesByCreator: Record<string, CreatorSubcategories> = Object.fromEntries(
	creatorSubcategories.map((c) => [c.creatorId, c])
);

// دوال مساعدة
export const getCreatorSubcategories = (creatorId: string): CreatorSubcategories | undefined =>
	creatorSubcategoriesByCreator[creatorId];

export const hasExpertiseInSubcategory = (creatorId: string, subcategoryId: SubcategorySSOT['id']): boolean => {
	const c = creatorSubcategoriesByCreator[creatorId];
	return !!c && c.subcategoryIds.includes(subcategoryId);
};

export const listCreatorsForSubcategory = (subcategoryId: SubcategorySSOT['id']): string[] =>
	creatorSubcategories.filter((c) => c.subcategoryIds.includes(subcategoryId)).map((c) => c.creatorId);

// سجل تجميعي
export const creatorSubcategoriesRegistry = {
	version: CREATOR_SUBCATEGORIES_SCHEMA_VERSION,
	count: creatorSubcategories.length,
	all: creatorSubcategories,
	byCreator: creatorSubcategoriesByCreator,
};
// Creator Subcategories V2.1 - ربط المبدع بالفئات الفرعية
