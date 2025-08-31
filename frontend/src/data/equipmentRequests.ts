import { EquipmentRequest } from './types';

// ================================
// طلبات المعدات الجديدة
// ================================

export const mockEquipmentRequests: EquipmentRequest[] = [
  // طلب معتمد من كريم المبتدئ
  {
    id: 'eqr_001_kareem_camera',
    creatorId: 'c_004_kareem',
    equipmentType: 'camera',
    brand: 'Canon',
    model: 'EOS R10',
    description: 'كاميرا مناسبة للمبتدئين في تصوير البورتريه',
    status: 'approved',
    adminNotes: 'معدة ممتازة للمبتدئين، معتمدة',
    reviewedBy: 'admin@depth-agency.com',
    reviewedAt: '2025-06-15T10:30:00.000Z',
    createdAt: '2025-06-10T14:20:00.000Z',
    updatedAt: '2025-06-15T10:30:00.000Z',
  },
  
  // طلب مرفوض من عمر
  {
    id: 'eqr_002_omar_camera',
    creatorId: 'c_006_omar_pending',
    equipmentType: 'camera',
    brand: 'RED',
    model: 'V-Raptor 8K',
    description: 'كاميرا سينمائية احترافية للمونتاج',
    status: 'rejected',
    adminNotes: 'معدة مكلفة جداً وغير مناسبة لمستوى المبدع الحالي',
    rejectionReason: 'المعدة المطلوبة تتجاوز مستوى الخبرة الحالي للمبدع',
    reviewedBy: 'admin@depth-agency.com',
    reviewedAt: '2025-08-27T16:45:00.000Z',
    createdAt: '2025-08-25T20:15:00.000Z',
    updatedAt: '2025-08-27T16:45:00.000Z',
  },

  // طلب قيد المراجعة من فاطمة
  {
    id: 'eqr_003_fatima_lens',
    creatorId: 'c_001_fatima',
    equipmentType: 'lens',
    brand: 'Canon',
    model: 'RF 100-500mm f/4.5-7.1L IS USM',
    description: 'عدسة تليفوتو للتصوير عن بعد والفعاليات',
    status: 'pending',
    createdAt: '2025-08-28T11:00:00.000Z',
    updatedAt: '2025-08-28T11:00:00.000Z',
  },

  // طلب يحتاج معلومات إضافية من علي
  {
    id: 'eqr_004_ali_lighting',
    creatorId: 'c_002_ali',
    equipmentType: 'lighting',
    brand: 'Aputure',
    model: 'LS 600d Pro',
    description: 'إضاءة LED قوية للفيديو',
    status: 'needs_info',
    adminNotes: 'نحتاج لمزيد من التفاصيل حول استخدام هذه الإضاءة في مشاريعك',
    reviewedBy: 'admin@depth-agency.com',
    reviewedAt: '2025-08-26T13:20:00.000Z',
    createdAt: '2025-08-24T09:30:00.000Z',
    updatedAt: '2025-08-26T13:20:00.000Z',
  },

  // طلب جديد من مريم للتصميم
  {
    id: 'eqr_005_maryam_tablet',
    creatorId: 'c_003_maryam',
    equipmentType: 'other',
    brand: 'Wacom',
    model: 'Cintiq Pro 24',
    description: 'شاشة رسم احترافية للتصميم الجرافيكي',
    status: 'pending',
    createdAt: '2025-08-29T08:15:00.000Z',
    updatedAt: '2025-08-29T08:15:00.000Z',
  },
];
