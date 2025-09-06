// ================================
// خدمة الفئات الفرعية (Subcategories) - SSOT V2.1
// - مصدر الحقيقة لأسعار الأساس basePrice لكل فئة فرعية
// - متوافقة مع القيم التاريخية في mock القديمة ومع وثائق التسعير
// - توفّر خرائط lookup ودوال مساعدة للوصول السريع
// ================================

// تعريف واجهة الفئة الفرعية  // بنية قياسية وقابلة للتوسّع
export interface SubcategorySSOT {
	id: string; // المعرّف
	categoryId: string; // فئة رئيسية
	code: string; // كود فريد
	nameAr: string; // الاسم عربي
	nameEn: string; // الاسم إنجليزي
	basePrice: number; // سعر الأساس للوحدة
	description?: string; // وصف مختصر
	displayOrder: number; // ترتيب العرض
	isActive: boolean; // فعّال
	createdAt: string; // تاريخ الإنشاء ISO
	updatedAt: string; // آخر تحديث ISO
}

// نسخة المخطط المرجعية  // لمواءمة الإصدارات
export const SUBCATEGORIES_SCHEMA_VERSION = '2.1.0'; // نسخة 2.1.0

// قائمة الفئات الفرعية الموحدة (SSOT)  // منقولة ومنظّفة من mock القديمة
export const subcategories: SubcategorySSOT[] = [
	// تصوير فوتوغرافي
	{
		id: 'sub_flatlay', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'flatlay', // كود
		nameAr: 'فلات لاي', // اسم عربي
		nameEn: 'Flat Lay', // اسم إنجليزي
		basePrice: 10000, // سعر الأساس
		description: 'تصوير منتجات من الأعلى بترتيب فني', // وصف
		displayOrder: 1, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_before_after', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'before_after', // كود
		nameAr: 'قبل وبعد', // اسم عربي
		nameEn: 'Before/After', // اسم إنجليزي
		basePrice: 15000, // سعر الأساس
		description: 'تصوير مقارن قبل وبعد العلاج أو التغيير', // وصف
		displayOrder: 2, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_portrait', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'portrait', // كود
		nameAr: 'بورتريه', // اسم عربي
		nameEn: 'Portrait', // اسم إنجليزي
		basePrice: 12000, // سعر الأساس
		description: 'تصوير أشخاص بشكل احترافي', // وصف
		displayOrder: 3, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_on_model', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'on_model', // كود
		nameAr: 'على موديل', // اسم عربي
		nameEn: 'On Model', // اسم إنجليزي
		basePrice: 20000, // سعر الأساس
		description: 'تصوير منتجات على عارضين', // وصف
		displayOrder: 4, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_on_mannequin', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'on_mannequin', // كود
		nameAr: 'على مانيكان', // اسم عربي
		nameEn: 'On Mannequin', // اسم إنجليزي
		basePrice: 15000, // سعر الأساس
		description: 'تصوير ملابس على مانيكان', // وصف
		displayOrder: 5, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_food_photo', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'food_photo', // كود
		nameAr: 'تصوير طعام', // اسم عربي
		nameEn: 'Food Photography', // اسم إنجليزي
		basePrice: 10000, // سعر الأساس
		description: 'تصوير أطباق ومأكولات بشكل احترافي', // وصف
		displayOrder: 6, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_product_photo', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'product_photo', // كود
		nameAr: 'تصوير منتجات', // اسم عربي
		nameEn: 'Product Photography', // اسم إنجليزي
		basePrice: 8000, // سعر الأساس
		description: 'تصوير منتجات تجارية', // وصف
		displayOrder: 7, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_360_photo', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: '360_photo', // كود
		nameAr: '360 درجة', // اسم عربي
		nameEn: '360° Photography', // اسم إنجليزي
		basePrice: 25000, // سعر الأساس
		description: 'تصوير بانورامي 360 درجة', // وصف
		displayOrder: 8, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_interior', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'interior', // كود
		nameAr: 'تصوير داخلي', // اسم عربي
		nameEn: 'Interior Photography', // اسم إنجليزي
		basePrice: 30000, // سعر الأساس
		description: 'تصوير الديكور الداخلي والمساحات', // وصف
		displayOrder: 9, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_event_photo', // id
		categoryId: 'cat_photo', // فئة رئيسية
		code: 'event_photo', // كود
		nameAr: 'تصوير فعاليات', // اسم عربي
		nameEn: 'Event Photography', // اسم إنجليزي
		basePrice: 50000, // سعر الأساس
		description: 'تصوير فعاليات ومناسبات (بالساعة)', // وصف
		displayOrder: 10, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},

	// إنتاج فيديو
	{
		id: 'sub_reels_30s', // id
		categoryId: 'cat_video', // فئة رئيسية
		code: 'reels_30s', // كود
		nameAr: 'ريلز 30 ثانية', // اسم عربي
		nameEn: 'Reels 30s', // اسم إنجليزي
		basePrice: 35000, // سعر الأساس
		description: 'فيديو قصير للسوشيال ميديا', // وصف
		displayOrder: 1, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_video_1min', // id
		categoryId: 'cat_video', // فئة رئيسية
		code: 'video_1min', // كود
		nameAr: 'فيديو دقيقة', // اسم عربي
		nameEn: '1 Min Video', // اسم إنجليزي
		basePrice: 75000, // سعر الأساس
		description: 'فيديو ترويجي مدته دقيقة واحدة', // وصف
		displayOrder: 2, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_corporate_ads', // id
		categoryId: 'cat_video', // فئة رئيسية
		code: 'corporate_ads', // كود
		nameAr: 'إعلانات تجارية', // اسم عربي
		nameEn: 'Corporate Ads', // اسم إنجليزي
		basePrice: 150000, // سعر الأساس
		description: 'إعلانات تجارية احترافية', // وصف
		displayOrder: 3, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_event_coverage', // id
		categoryId: 'cat_video', // فئة رئيسية
		code: 'event_coverage', // كود
		nameAr: 'تغطية فعاليات', // اسم عربي
		nameEn: 'Event Coverage', // اسم إنجليزي
		basePrice: 100000, // سعر الأساس
		description: 'تغطية فيديو للفعاليات (بالساعة)', // وصف
		displayOrder: 4, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_testimonials', // id
		categoryId: 'cat_video', // فئة رئيسية
		code: 'testimonials', // كود
		nameAr: 'شهادات العملاء', // اسم عربي
		nameEn: 'Testimonials', // اسم إنجليزي
		basePrice: 60000, // سعر الأساس
		description: 'فيديو شهادات عملاء', // وصف
		displayOrder: 5, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},

	// تصميم جرافيك
	{
		id: 'sub_logo_design', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'logo_design', // كود
		nameAr: 'تصميم شعار', // اسم عربي
		nameEn: 'Logo Design', // اسم إنجليزي
		basePrice: 50000, // سعر الأساس
		description: 'تصميم شعار احترافي للعلامة التجارية', // وصف
		displayOrder: 1, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_brand_identity', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'brand_identity', // كود
		nameAr: 'هوية بصرية', // اسم عربي
		nameEn: 'Brand Identity', // اسم إنجليزي
		basePrice: 200000, // سعر الأساس
		description: 'تصميم هوية بصرية شاملة', // وصف
		displayOrder: 2, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_social_posts', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'social_posts', // كود
		nameAr: 'منشورات سوشيال ميديا', // اسم عربي
		nameEn: 'Social Media Posts', // اسم إنجليزي
		basePrice: 5000, // سعر الأساس
		description: 'تصميم منشورات لمنصات التواصل الاجتماعي (للقطعة الواحدة)', // وصف
		displayOrder: 3, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_brochure', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'brochure', // كود
		nameAr: 'بروشور', // اسم عربي
		nameEn: 'Brochure', // اسم إنجليزي
		basePrice: 30000, // سعر الأساس
		description: 'تصميم بروشور تعريفي', // وصف
		displayOrder: 4, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_menu_design', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'menu_design', // كود
		nameAr: 'تصميم منيو', // اسم عربي
		nameEn: 'Menu Design', // اسم إنجليزي
		basePrice: 40000, // سعر الأساس
		description: 'تصميم منيو مطعم أو كافيه', // وصف
		displayOrder: 5, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_poster', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'poster', // كود
		nameAr: 'بوستر', // اسم عربي
		nameEn: 'Poster', // اسم إنجليزي
		basePrice: 20000, // سعر الأساس
		description: 'تصميم بوستر إعلاني', // وصف
		displayOrder: 6, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_business_card', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'business_card', // كود
		nameAr: 'بزنس كارد', // اسم عربي
		nameEn: 'Business Card', // اسم إنجليزي
		basePrice: 15000, // سعر الأساس
		description: 'تصميم بطاقة أعمال احترافية', // وصف
		displayOrder: 7, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_packaging', // id
		categoryId: 'cat_design', // فئة رئيسية
		code: 'packaging', // كود
		nameAr: 'تصميم تغليف', // اسم عربي
		nameEn: 'Packaging Design', // اسم إنجليزي
		basePrice: 60000, // سعر الأساس
		description: 'تصميم تغليف منتجات', // وصف
		displayOrder: 8, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},

	// مونتاج
	{
		id: 'sub_basic_edit', // id
		categoryId: 'cat_editing', // فئة رئيسية
		code: 'basic_edit', // كود
		nameAr: 'مونتاج أساسي', // اسم عربي
		nameEn: 'Basic Edit', // اسم إنجليزي
		basePrice: 20000, // سعر الأساس
		description: 'مونتاج بسيط بدون تأثيرات معقدة', // وصف
		displayOrder: 1, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_advanced_edit', // id
		categoryId: 'cat_editing', // فئة رئيسية
		code: 'advanced_edit', // كود
		nameAr: 'مونتاج متقدم', // اسم عربي
		nameEn: 'Advanced Edit', // اسم إنجليزي
		basePrice: 40000, // سعر الأساس
		description: 'مونتاج متقدم مع تأثيرات وانتقالات احترافية', // وصف
		displayOrder: 2, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_color_grading', // id
		categoryId: 'cat_editing', // فئة رئيسية
		code: 'color_grading', // كود
		nameAr: 'تصحيح ألوان', // اسم عربي
		nameEn: 'Color Grading', // اسم إنجليزي
		basePrice: 15000, // سعر الأساس
		description: 'تصحيح وتحسين الألوان', // وصف
		displayOrder: 3, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_effects', // id
		categoryId: 'cat_editing', // فئة رئيسية
		code: 'effects', // كود
		nameAr: 'إضافة مؤثرات', // اسم عربي
		nameEn: 'Visual Effects', // اسم إنجليزي
		basePrice: 25000, // سعر الأساس
		description: 'إضافة مؤثرات بصرية', // وصف
		displayOrder: 4, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
	{
		id: 'sub_motion_graphics', // id
		categoryId: 'cat_editing', // فئة رئيسية
		code: 'motion_graphics', // كود
		nameAr: 'موشن جرافيك', // اسم عربي
		nameEn: 'Motion Graphics', // اسم إنجليزي
		basePrice: 50000, // سعر الأساس
		description: 'رسوم متحركة وموشن جرافيك', // وصف
		displayOrder: 5, // ترتيب
		isActive: true, // فعّال
		createdAt: '2025-01-01T00:00:00.000Z', // إنشاء
		updatedAt: '2025-08-15T10:30:00.000Z', // تحديث
	},
];

// خريطة lookup سريعة بالمعرّف  // id -> كائن Subcategory
export const subcategoryMap: Record<string, SubcategorySSOT> = Object.fromEntries(
	subcategories.map((s) => [s.id, s]) // تحويل مصفوفة إلى خريطة
);

// دوال مساعدة للوصول السريع  // واجهة استخدام بسيطة للخدمات الأخرى
export const getSubcategoryById = (id: string): SubcategorySSOT | undefined => subcategoryMap[id]; // جلب كائن الفئة
export const getSubcategoryBasePrice = (id: string): number => subcategoryMap[id]?.basePrice ?? 0; // سعر الأساس
export const isSubcategoryActive = (id: string): boolean => !!subcategoryMap[id]?.isActive; // حالة التفعيل
export const listSubcategoriesByCategory = (categoryId: string): SubcategorySSOT[] =>
	subcategories.filter((s) => s.categoryId === categoryId); // تصفية حسب الفئة

// سجل تجميعي للوصول  // لتسهيل الاستهلاك من الواجهات
export const subcategoriesRegistry = {
	version: SUBCATEGORIES_SCHEMA_VERSION, // نسخة المخطط
	count: subcategories.length, // عدد العناصر
	all: subcategories, // القائمة كاملة
	byId: subcategoryMap, // خريطة الوصول
};
// Subcategories Service V2.1 - خدمة الفئات الفرعية
