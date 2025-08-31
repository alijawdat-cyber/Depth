import { CreatorAvailability, AvailabilityFlags } from './types';

// ================================
// أوقات توفر المبدعين
// ================================

export const mockCreatorAvailability: CreatorAvailability[] = [
  // جدول فاطمة المصورة لهذا الأسبوع
  {
    id: 'av_001_fatima_sat_0900',
    creatorId: 'c_001_fatima',
    date: '2025-08-30',
    dayOfWeek: 'saturday',
    timeSlot: '09:00',
    status: 'available',
    notes: 'متاحة للتصوير الصباحي',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z',
  },
  {
    id: 'av_002_fatima_sat_1400',
    creatorId: 'c_001_fatima',
    date: '2025-08-30',
    dayOfWeek: 'saturday',
    timeSlot: '14:00',
    status: 'busy',
    projectId: 'p_001_restaurant',
    notes: 'مشغولة في مشروع مطعم بيت بغداد',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z',
  },
  
  // جدول علي فيديو
  {
    id: 'av_003_ali_sun_1000',
    creatorId: 'c_002_ali',
    date: '2025-08-31',
    dayOfWeek: 'sunday',
    timeSlot: '10:00',
    status: 'available',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z',
  },
  
  // مريم ديزاين مشغولة
  {
    id: 'av_004_maryam_mon_0900',
    creatorId: 'c_003_maryam',
    date: '2025-09-01',
    dayOfWeek: 'monday',
    timeSlot: '09:00',
    status: 'blocked',
    blockReason: 'إجازة شخصية',
    notes: 'غير متاحة هذا الأسبوع',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z',
  },
  
  // كريم المبتدئ متاح
  {
    id: 'av_005_kareem_tue_1500',
    creatorId: 'c_004_kareem',
    date: '2025-09-02',
    dayOfWeek: 'tuesday',
    timeSlot: '15:00',
    status: 'available',
    notes: 'متاح لمشاريع بورتريه',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z',
  },
  
  // حسين المونتير متاح
  {
    id: 'av_006_hussein_wed_0900',
    creatorId: 'c_005_hussein',
    date: '2025-09-03',
    dayOfWeek: 'wednesday',
    timeSlot: '09:00',
    status: 'available',
    notes: 'متاح لمشاريع المونتاج',
    createdAt: '2025-08-29T10:00:00.000Z',
    updatedAt: '2025-08-29T10:00:00.000Z',
  },
];

// أعلام التوفر للمبدعين
export const mockAvailabilityFlags: AvailabilityFlags[] = [
  // فاطمة - مصورة محترفة
  {
    id: 'af_001_fatima',
    creatorId: 'c_001_fatima',
    rushAvailable: true,
    travelAvailable: true,
    studioAvailable: true,
    weeklyHoursLimit: 40,
    notes: 'متاحة لكل أنواع المشاريع',
    updatedAt: '2025-08-20T14:30:00.000Z',
  },
  // علي - مصور فيديو
  {
    id: 'af_002_ali',
    creatorId: 'c_002_ali',
    rushAvailable: true,
    travelAvailable: false,
    studioAvailable: true,
    weeklyHoursLimit: 35,
    notes: 'لا يسافر خارج بغداد',
    updatedAt: '2025-08-20T14:30:00.000Z',
  },
  // مريم - مصممة جرافيك
  {
    id: 'af_003_maryam',
    creatorId: 'c_003_maryam',
    rushAvailable: false,
    travelAvailable: false,
    studioAvailable: true,
    weeklyHoursLimit: 30,
    notes: 'تعمل من الستوديو فقط',
    updatedAt: '2025-08-20T14:30:00.000Z',
  },
  // كريم - مبتدئ متوسط
  {
    id: 'af_004_kareem',
    creatorId: 'c_004_kareem',
    rushAvailable: false,
    travelAvailable: true,
    studioAvailable: true,
    weeklyHoursLimit: 25,
    notes: 'مبتدئ - لا يأخذ مشاريع مستعجلة',
    updatedAt: '2025-08-20T14:30:00.000Z',
  },
  // حسين - مونتير خبير  
  {
    id: 'af_005_hussein',
    creatorId: 'c_005_hussein',
    rushAvailable: true,
    travelAvailable: false,
    studioAvailable: true,
    weeklyHoursLimit: 45,
    notes: 'متخصص في المونتاج السريع',
    updatedAt: '2025-08-20T14:30:00.000Z',
  },
];
