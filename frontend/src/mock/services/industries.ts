// ================================
// خدمة الصناعات (Industries) - SSOT V2.1
// - مصدر الحقيقة لأسماء وصنف الصناعات للاستخدام عبر المشاريع/الترشيحات
// - يوفر خرائط lookup ودوال مساعدة وسجل تجميعي
// ================================

export interface IndustrySSOT {
	id: string; // المعرّف
	code:
		| 'fashion'
		| 'food'
		| 'beauty'
		| 'tech'
		| 'real_estate'
		| 'automotive'
		| 'healthcare'
		| 'education'
		| 'hospitality'
		| 'e_commerce'
		| 'media_entertainment'
		| 'finance'; // كود ثابت
	nameAr: string; // الاسم عربي
	nameEn: string; // الاسم إنجليزي
	description?: string; // وصف مختصر
	displayOrder: number; // ترتيب العرض
	isActive: boolean; // فعّال
	createdAt: string; // إنشاء ISO
	updatedAt: string; // تحديث ISO
}

export const INDUSTRIES_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط

// قائمة الصناعات القياسية للاستخدام العام (SSOT)
export const industries: IndustrySSOT[] = [
	{
		id: 'ind_fashion',
		code: 'fashion',
		nameAr: 'الأزياء',
		nameEn: 'Fashion',
		description: 'علامات وماركات الملابس والإكسسوارات',
		displayOrder: 1,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_food',
		code: 'food',
		nameAr: 'الأغذية',
		nameEn: 'Food & Beverage',
		description: 'مطاعم، مقاهي، ومنتجات غذائية',
		displayOrder: 2,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_beauty',
		code: 'beauty',
		nameAr: 'التجميل',
		nameEn: 'Beauty & Cosmetics',
		description: 'مراكز تجميل، منتجات عناية بالبشرة والشعر',
		displayOrder: 3,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_tech',
		code: 'tech',
		nameAr: 'التقنية',
		nameEn: 'Technology',
		description: 'شركات تقنية، تطبيقات، أجهزة وإلكترونيات',
		displayOrder: 4,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_real_estate',
		code: 'real_estate',
		nameAr: 'العقارات',
		nameEn: 'Real Estate',
		description: 'بيع وشراء وتأجير العقارات والمجمعات',
		displayOrder: 5,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_automotive',
		code: 'automotive',
		nameAr: 'السيارات',
		nameEn: 'Automotive',
		description: 'وكالات سيارات، خدمات ومستلزمات',
		displayOrder: 6,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_healthcare',
		code: 'healthcare',
		nameAr: 'الرعاية الصحية',
		nameEn: 'Healthcare',
		description: 'مستشفيات، عيادات، ومختبرات',
		displayOrder: 7,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_education',
		code: 'education',
		nameAr: 'التعليم',
		nameEn: 'Education',
		description: 'مدارس، جامعات، دورات تدريبية',
		displayOrder: 8,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_hospitality',
		code: 'hospitality',
		nameAr: 'الضيافة',
		nameEn: 'Hospitality',
		description: 'فنادق، منتجعات، فعاليات ضيافة',
		displayOrder: 9,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_e_commerce',
		code: 'e_commerce',
		nameAr: 'التجارة الإلكترونية',
		nameEn: 'E-commerce',
		description: 'متاجر إلكترونية ومنصات البيع عبر الإنترنت',
		displayOrder: 10,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_media',
		code: 'media_entertainment',
		nameAr: 'الإعلام والترفيه',
		nameEn: 'Media & Entertainment',
		description: 'قنوات، إنتاج إعلامي، ترفيه',
		displayOrder: 11,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
	{
		id: 'ind_finance',
		code: 'finance',
		nameAr: 'القطاع المالي',
		nameEn: 'Finance',
		description: 'مصارف، خدمات مالية، تأمين',
		displayOrder: 12,
		isActive: true,
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-08-15T10:30:00.000Z',
	},
];

// خرائط lookup للوصول السريع
export const industryById: Record<string, IndustrySSOT> = Object.fromEntries(
	industries.map((i) => [i.id, i])
);
export const industryByCode: Record<IndustrySSOT['code'], IndustrySSOT> = Object.fromEntries(
	industries.map((i) => [i.code, i])
) as Record<IndustrySSOT['code'], IndustrySSOT>;

// دوال مساعدة
export const getIndustryById = (id: string): IndustrySSOT | undefined => industryById[id];
export const getIndustryByCode = (
	code: IndustrySSOT['code']
): IndustrySSOT | undefined => industryByCode[code];
export const listIndustries = (): IndustrySSOT[] =>
	industries.slice().sort((a, b) => a.displayOrder - b.displayOrder);

// سجل تجميعي
export const industriesRegistry = {
	version: INDUSTRIES_SCHEMA_VERSION,
	count: industries.length,
	all: industries,
	byId: industryById,
	byCode: industryByCode,
};
// Industries Service V2.1 - خدمة الصناعات
