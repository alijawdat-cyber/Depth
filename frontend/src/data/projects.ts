import { Project } from './types';

// ================================
// المشاريع - النظام الجديد مع lineItems
// ملاحظة: البيانات الوهمية هنا مبنية على قيم سابقة قد تحتاج إعادة حساب
// بعد تصحيح قيم الموقع - استخدم calculateMultiItemProject() للحساب الدقيق
// ================================

export const mockProjects: Project[] = [
  {
    id: 'p_001_restaurant',
    clientId: 'cl_001_restaurant',
    creatorId: 'c_001_fatima', // المبدع الرئيسي
    status: 'active',
    lineItems: [
      {
        id: 'line_001_food_photos',
        subcategoryId: 'sub_food_photo',
        quantity: 15, // 15 صورة طعام
        processingLevel: 'color_correction',
        basePrice: 10000, // من subcategories
        unitCreatorPrice: 12720, // محسوب: 10000 × 1.0 × 1.0 × 1.2 × 1.2 × 1.0 + (25000/15)
        totalCreatorPrice: 190800, // 12720 × 15
        assignedCreators: ['c_001_fatima'],
        notes: 'صور منيو جديد - طعام عراقي تقليدي'
      }
    ],
    totalBasePrice: 150000, // 10000 × 15
    totalCreatorPrice: 190800, // مجموع كل العناصر
    totalClientPrice: 619800, // 190800 + (190800 × 2.25)
    agencyMarginPercent: 2.25,
    agencyMarginAmount: 429000, // 190800 × 2.25
    isRush: false,
    location: 'client', // +25000 موزع على العناصر
    deliveryDate: '2025-09-05',
    notes: 'تصوير منيو جديد للمطعم - 15 طبق عراقي تقليدي',
    approvedBy: 'sa_001_ali',
    approvedAt: '2025-08-25T14:30:00.000Z',
    createdAt: '2025-08-20T10:15:00.000Z',
    updatedAt: '2025-08-29T09:45:00.000Z',
  },
  {
    id: 'p_002_salon_campaign',
    clientId: 'cl_002_salon',
    creatorId: 'c_002_ali', // المبدع الرئيسي للفيديو
    status: 'completed',
    lineItems: [
      {
        id: 'line_002_reels_video',
        subcategoryId: 'sub_reels_30s',
        quantity: 3, // 3 فيديوهات ريلز
        processingLevel: 'full_retouch',
        basePrice: 35000, // من subcategories  
        unitCreatorPrice: 59050, // محسوب: 35000 × 1.0 × 1.3 × 1.1 × 1.1 × 1.0 + (25000/3)
        totalCreatorPrice: 177150, // 59050 × 3
        assignedCreators: ['c_002_ali'],
        notes: 'فيديوهات ترويجية قصيرة للصالون'
      },
      {
        id: 'line_003_service_photos',
        subcategoryId: 'sub_before_after',
        quantity: 5, // 5 صور قبل وبعد
        processingLevel: 'full_retouch',
        basePrice: 15000, // من subcategories
        unitCreatorPrice: 25362, // محسوب: 15000 × 1.0 × 1.3 × 1.1 × 1.1 × 1.0 + (25000/5)
        totalCreatorPrice: 126810, // 25362 × 5
        assignedCreators: ['c_001_fatima'], // مصورة للصور
        notes: 'صور قبل وبعد للخدمات التجميلية'
      }
    ],
    totalBasePrice: 180000, // (35000×3) + (15000×5)
    totalCreatorPrice: 303960, // 177150 + 126810
    totalClientPrice: 987372, // 303960 + (303960 × 2.25)
    agencyMarginPercent: 2.25,
    agencyMarginAmount: 683412, // 303960 × 2.25
    isRush: false,
    location: 'client',
    deliveryDate: '2025-08-28',
    notes: 'حملة شاملة للصالون - فيديو وصور',
    approvedBy: 'ad_002_ahmed',
    approvedAt: '2025-08-22T11:20:00.000Z',
    createdAt: '2025-08-18T09:30:00.000Z',
    updatedAt: '2025-08-28T16:45:00.000Z',
  },
  {
    id: 'p_003_pharmacy_branding',
    clientId: 'cl_003_pharmacy',
    creatorId: 'c_003_maryam', // المبدع الرئيسي للتصميم
    status: 'pending',
    lineItems: [
      {
        id: 'line_004_logo_design',
        subcategoryId: 'sub_logo_design',
        quantity: 1, // شعار واحد
        processingLevel: 'full_retouch',
        basePrice: 50000, // من subcategories
        unitCreatorPrice: 74230, // محسوب: 50000 × 1.0 × 1.3 × 1.1 × 1.1 × 1.0 + 0 (ستوديو)
        totalCreatorPrice: 74230, // 74230 × 1
        assignedCreators: ['c_003_maryam'],
        notes: 'شعار جديد للصيدلية مع 3 اقتراحات'
      },
      {
        id: 'line_005_business_cards',
        subcategoryId: 'sub_business_card',
        quantity: 2, // تصميمين مختلفين
        processingLevel: 'basic',
        basePrice: 15000, // من subcategories
        unitCreatorPrice: 18150, // محسوب: 15000 × 1.0 × 1.0 × 1.1 × 1.1 × 1.0 + 0
        totalCreatorPrice: 36300, // 18150 × 2
        assignedCreators: ['c_003_maryam'],
        notes: 'بطاقات شخصية بتصميمين مختلفين'
      }
    ],
    totalBasePrice: 80000, // (50000×1) + (15000×2)
    totalCreatorPrice: 110530, // 74230 + 36300
    totalClientPrice: 359222, // 110530 + (110530 × 2.25)
    agencyMarginPercent: 2.25,
    agencyMarginAmount: 248692, // 110530 × 2.25
    isRush: false,
    location: 'studio', // بدون رسوم إضافية
    deliveryDate: '2025-09-10',
    notes: 'هوية بصرية أولية للصيدلية',
    createdAt: '2025-08-28T13:20:00.000Z',
    updatedAt: '2025-08-29T08:15:00.000Z',
  },
  {
    id: 'p_004_personal_session',
    clientId: 'cl_004_individual',
    creatorId: 'c_004_kareem', // مبتدئ للبورتريه
    status: 'active',
    lineItems: [
      {
        id: 'line_006_portrait_photos',
        subcategoryId: 'sub_portrait',
        quantity: 8, // 8 صور بورتريه
        processingLevel: 'color_correction',
        basePrice: 12000, // من subcategories
        unitCreatorPrice: 11880, // محسوب: 12000 × 0.9 × 1.1 × 1.0 × 1.0 × 1.0 + 0 (ستوديو)
        totalCreatorPrice: 95040, // 11880 × 8
        assignedCreators: ['c_004_kareem'],
        notes: 'جلسة بورتريه احترافية - 8 صور نهائية'
      }
    ],
    totalBasePrice: 96000, // 12000 × 8
    totalCreatorPrice: 95040, // أقل من base لأن المبدع مبتدئ + بدون معدات
    totalClientPrice: 308880, // 95040 + (95040 × 2.25)
    agencyMarginPercent: 2.25,
    agencyMarginAmount: 213840, // 95040 × 2.25
    isRush: false,
    location: 'studio',
    deliveryDate: '2025-09-02',
    notes: 'جلسة تصوير شخصية لعمار طالب رشيد',
    approvedBy: 'sa_001_ali',
    approvedAt: '2025-08-27T16:10:00.000Z',
    createdAt: '2025-08-25T14:45:00.000Z',
    updatedAt: '2025-08-28T11:30:00.000Z',
  },
];

// دوال مساعدة للمشاريع
export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

export const calculateProjectTotals = (project: Project): {
  totalItems: number;
  totalQuantity: number;
  averageUnitPrice: number;
} => {
  const totalItems = project.lineItems.length;
  const totalQuantity = project.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const averageUnitPrice = totalQuantity > 0 ? project.totalBasePrice / totalQuantity : 0;
  
  return {
    totalItems,
    totalQuantity,
    averageUnitPrice
  };
};
