// ================================
// المبدعون (Creators) - SSOT V2.1
// - ثلاثة مبدعين فقط متوافقين مع creatorSubcategories
// ================================

import { creatorSubcategoriesByCreator } from '../services/creatorSubcategories';

export interface CreatorUser {
	id: string; // المعرّف
	userId?: string; // FK -> users (u_*)
	name: string; // الاسم الكامل
	email: string; // البريد
	phone?: string; // الهاتف
	city?: 'Baghdad' | 'Erbil' | 'Basra' | 'Sulaymaniyah' | 'Najaf' | 'Karbala'; // مدينة اختيارية
	profileMultiplier?: number; // معامل الملف يؤثر على التسعير إن استخدم
	isActive: boolean; // فعّال
	createdAt: string; // إنشاء
	updatedAt: string; // تحديث
}

export const CREATORS_SCHEMA_VERSION = '2.1.0';

export const creators: CreatorUser[] = [
	{
		id: 'creator_001',
		userId: 'u_creator_001',
		name: 'سيف ذاخر العزاوي',
		email: 'saif.dh@depth.example',
		phone: '+964-780-101-2020',
		city: 'Baghdad',
		profileMultiplier: 1.05,
		isActive: true,
		createdAt: '2024-11-11T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'creator_002',
		userId: 'u_creator_002',
		name: 'مناف أيهم البياتي',
		email: 'munaf.a@depth.example',
		phone: '+964-781-303-4040',
		city: 'Erbil',
		profileMultiplier: 1.1,
		isActive: true,
		createdAt: '2024-10-05T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'creator_003',
		userId: 'u_creator_003',
		name: 'ماريز عماد الخالدي',
		email: 'mariz.k@depth.example',
		phone: '+964-770-505-6060',
		city: 'Baghdad',
		profileMultiplier: 1.0,
		isActive: true,
		createdAt: '2025-01-20T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

// خرائط ودوال مساعدة
export const creatorById: Record<string, CreatorUser> = Object.fromEntries(
	creators.map((c) => [c.id, c])
);

export const listCreators = (): CreatorUser[] => creators.slice();

export const getCreatorExpertiseSubcategories = (creatorId: string): string[] =>
	creatorSubcategoriesByCreator[creatorId]?.subcategoryIds || [];

export const creatorsRegistry = {
	version: CREATORS_SCHEMA_VERSION,
	count: creators.length,
	all: creators,
	byId: creatorById,
};
// Creators V2.1 - المبدعون
