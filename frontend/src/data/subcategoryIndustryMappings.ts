// ================================
// ربط الفئات الفرعية بالمجالات - طبقاً للمتطلبات V2.0
// ================================

export interface SubcategoryIndustryMapping {
  subcategoryId: string;
  industryIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockSubcategoryIndustryMappings: SubcategoryIndustryMapping[] = [
  // قبل/بعد - مناسبة لعيادات التجميل والمستشفيات والصالونات
  {
    subcategoryId: 'sub_before_after',
    industryIds: ['ind_beauty_clinics', 'ind_hospitals', 'ind_salons'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // تصوير طعام - للمطاعم والكافيهات
  {
    subcategoryId: 'sub_food_photo',
    industryIds: ['ind_restaurants', 'ind_cafes'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // تصوير منتجات - للمتاجر الإلكترونية ومحلات الملابس
  {
    subcategoryId: 'sub_product_photo',
    industryIds: ['ind_ecommerce', 'ind_fashion_stores'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // على موديل - لمحلات الملابس والصالونات
  {
    subcategoryId: 'sub_on_model',
    industryIds: ['ind_fashion_stores', 'ind_salons'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // تصوير داخلي - للفنادق والشركات العقارية
  {
    subcategoryId: 'sub_interior',
    industryIds: ['ind_hotels', 'ind_real_estate'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // تصوير فعاليات - للجامعات والشركات والفنادق
  {
    subcategoryId: 'sub_event_photo',
    industryIds: ['ind_universities', 'ind_companies', 'ind_hotels'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // فيديو دعائي - لجميع الشركات
  {
    subcategoryId: 'sub_corporate_ads',
    industryIds: ['ind_companies', 'ind_real_estate', 'ind_universities'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // شعار - لجميع الأنشطة التجارية
  {
    subcategoryId: 'sub_logo_design',
    industryIds: [
      'ind_restaurants', 'ind_fashion_stores', 'ind_beauty_clinics',
      'ind_ecommerce', 'ind_real_estate', 'ind_hospitals',
      'ind_hotels', 'ind_salons', 'ind_universities', 'ind_companies'
    ],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // هوية بصرية - للشركات والمتاجر الكبيرة
  {
    subcategoryId: 'sub_brand_identity',
    industryIds: ['ind_companies', 'ind_real_estate', 'ind_ecommerce', 'ind_universities'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // منشورات سوشيال - للمطاعم والصالونات والمحلات
  {
    subcategoryId: 'sub_social_posts',
    industryIds: ['ind_restaurants', 'ind_salons', 'ind_fashion_stores', 'ind_beauty_clinics'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // منيو - للمطاعم والكافيهات
  {
    subcategoryId: 'sub_menu_design',
    industryIds: ['ind_restaurants', 'ind_cafes'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // تصميم تغليف - للمتاجر الإلكترونية ومحلات الملابس
  {
    subcategoryId: 'sub_poster',
    industryIds: ['ind_ecommerce', 'ind_fashion_stores'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // فلات لاي - للمتاجر الإلكترونية ومحلات الملابس والصيدليات
  {
    subcategoryId: 'sub_flatlay',
    industryIds: ['ind_ecommerce', 'ind_fashion_stores', 'ind_hospitals'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // على مانيكان - لمحلات الملابس
  {
    subcategoryId: 'sub_on_mannequin',
    industryIds: ['ind_fashion_stores'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // 360 درجة - للمتاجر الإلكترونية والعقارات
  {
    subcategoryId: 'sub_360_photo',
    industryIds: ['ind_ecommerce', 'ind_real_estate'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // ريلز 30 ثانية - للمطاعم والصالونات والكافيهات
  {
    subcategoryId: 'sub_reels_30s',
    industryIds: ['ind_restaurants', 'ind_salons', 'ind_cafes', 'ind_beauty_clinics'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
  // فيديو دقيقة - للشركات والفنادق
  {
    subcategoryId: 'sub_video_1min',
    industryIds: ['ind_companies', 'ind_hotels', 'ind_universities'],
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-15T10:30:00.000Z',
  },
];
