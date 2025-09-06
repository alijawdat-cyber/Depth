// ================================ // توفر المبدعين (Creator Availability) - SSOT V2.1
// - مصدر موحّد لجدولة وأعلام التوفر لاستهلاك خوارزميات الترشيح والجدولة
// - متوافق مع تعريفات src/data/types.ts لسهولة التبني المرحلي
// ================================

// ملاحظة: نحافظ على الشكل الحرفي كما في src/data/types.ts لخفض تكلفة التوافق
type DayOfWeek = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'; // أيام الأسبوع
type AvailabilityStatus = 'available' | 'busy' | 'blocked' | 'break'; // حالة التوفر

export interface CreatorAvailability { // إدخال توفر فردي لمبدع
  id: string; // معرف السجل
  creatorId: string; // معرف المبدع
  date: string; // التاريخ (YYYY-MM-DD)
  dayOfWeek: DayOfWeek; // يوم الأسبوع
  timeSlot: string; // خانة زمنية "HH:MM"
  status: AvailabilityStatus; // حالة التوفر
  projectId?: string; // إن كان مشغولاً بمشروع مرتبط
  blockReason?: string; // سبب الحجب/الإجازة
  notes?: string; // ملاحظات
  createdAt: string; // تاريخ الإنشاء
  updatedAt: string; // تاريخ التحديث
} // نهاية CreatorAvailability

export interface AvailabilityFlags { // أعلام توفّر عامة للمبدع
  id: string; // معرف العلم
  creatorId: string; // معرف المبدع
  rushAvailable: boolean; // هل يقبل أعمال مستعجلة
  travelAvailable: boolean; // هل يقبل السفر
  studioAvailable: boolean; // هل لديه/يمكنه استخدام استوديو
  weeklyHoursLimit: number; // حد الساعات الأسبوعية
  notes?: string; // ملاحظات إضافية
  updatedAt: string; // آخر تحديث
} // نهاية AvailabilityFlags

// بيانات نموذجية متوافقة مع سجلات المبدعين الحالية (mock/core/creators.ts)
export const creatorAvailability: CreatorAvailability[] = [ // جدول توفر مبدعين
  { id: 'av_cr_001', creatorId: 'creator_001', date: '2025-09-06', dayOfWeek: 'saturday', timeSlot: '09:00', status: 'available', notes: 'متاح صباح السبت', createdAt: '2025-09-04T10:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' }, // سيف
  { id: 'av_cr_002', creatorId: 'creator_002', date: '2025-09-07', dayOfWeek: 'sunday', timeSlot: '10:00', status: 'busy', projectId: 'p_002_salon_campaign', notes: 'مشغول بمونتاج فيديو', createdAt: '2025-09-04T10:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' }, // مناف
  { id: 'av_cr_003', creatorId: 'creator_003', date: '2025-09-08', dayOfWeek: 'monday', timeSlot: '13:00', status: 'blocked', blockReason: 'إجازة شخصية', createdAt: '2025-09-04T10:00:00.000Z', updatedAt: '2025-09-04T10:00:00.000Z' }, // ماريرز
]; // نهاية بيانات التوفر

export const availabilityFlags: AvailabilityFlags[] = [ // أعلام التوفر لكل مبدع
  { id: 'af_cr_001', creatorId: 'creator_001', rushAvailable: true, travelAvailable: true, studioAvailable: true, weeklyHoursLimit: 40, notes: 'جاهز لمشاريع تصوير/تصميم', updatedAt: '2025-09-04T09:30:00.000Z' }, // سيف
  { id: 'af_cr_002', creatorId: 'creator_002', rushAvailable: true, travelAvailable: false, studioAvailable: true, weeklyHoursLimit: 35, notes: 'لا يسافر خارج أربيل', updatedAt: '2025-09-04T09:30:00.000Z' }, // مناف
  { id: 'af_cr_003', creatorId: 'creator_003', rushAvailable: false, travelAvailable: true, studioAvailable: true, weeklyHoursLimit: 30, notes: 'يفضل الأعمال غير المستعجلة', updatedAt: '2025-09-04T09:30:00.000Z' }, // ماريرز
]; // نهاية الأعلام

// خرائط/مساعدات سريعة للوصول
export const availabilityByCreator: Record<string, CreatorAvailability[]> = creatorAvailability.reduce((acc, a) => { // خريطة توفر حسب المبدع
  (acc[a.creatorId] ||= []).push(a); return acc; // تجميع حسب creatorId
}, {} as Record<string, CreatorAvailability[]>); // تهيئة الخريطة

export const flagsByCreator: Record<string, AvailabilityFlags> = Object.fromEntries( // خريطة الأعلام حسب المبدع
  availabilityFlags.map(f => [f.creatorId, f]) // تحويل إلى entries
); // نهاية الخريطة

// دوال استعلام مختصرة
export const listAvailability = (creatorId?: string): CreatorAvailability[] => creatorId ? (availabilityByCreator[creatorId] || []) : creatorAvailability.slice(); // قائمة التوفر (كاملة/حسب مبدع)
export const getFlags = (creatorId: string): AvailabilityFlags | undefined => flagsByCreator[creatorId]; // أعلام المبدع

// Creator Availability V2.1 - توفر المبدعين // تذييل
// Creator Availability V2.1 - توفر المبدعين
