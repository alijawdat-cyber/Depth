// أنواع البيانات الخاصة بالمبدعين والتقييم
// مستندة على docs/catalog/03-Creator-Intake-Form.md و 04-Admin-Evaluation-Form.md

export interface Creator {
  id: string;
  // الهوية والتواصل
  fullName: string;
  role: 'photographer' | 'videographer' | 'designer' | 'producer';
  city: string;
  canTravel: boolean;
  languages: string[]; // ['ar', 'en']
  contact: {
    email: string;
    whatsapp: string;
    instagram?: string;
  };

  // المهارات والخبرة
  skills: CreatorSkill[];
  verticals: string[]; // معرفات المحاور المفضلة
  
  // المعدات
  equipment: CreatorEquipmentItem[];
  
  // السعة والزمن
  capacity: {
    maxAssetsPerDay: number;
    weeklyAvailability: WeeklyAvailability[]; // جدول أسبوعي مفصل
    standardSLA: number; // بالساعات
    rushSLA: number; // بالساعات
  };

  // الامتثال
  compliance: {
    clinicsTraining: boolean;
    ndaSigned: boolean;
    equipmentAgreement: boolean;
  };

  // التسعير الداخلي
  internalCost: {
    photoPerAsset?: number; // IQD
    reelPerAsset?: number; // IQD
    dayRate?: number; // IQD
  };

  // معلومات النظام
  status: 'registered' | 'intake_submitted' | 'under_review' | 'approved' | 'rejected' | 'restricted';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  
  // التقييم والنتائج
  evaluation?: CreatorEvaluation;
  score?: number; // 0-100
  tier?: 'T1' | 'T2' | 'T3';
  modifier?: number; // النسبة المئوية للزيادة/النقصان
}

export interface CreatorSkill {
  subcategoryId: string; // معرف الفئة الفرعية
  proficiency: 'beginner' | 'intermediate' | 'pro';
  notes?: string;
  verified?: boolean; // تم التحقق من الإدارة
}

// أنواع المعدات المحدثة - مرتبطة بكتالوج المعدات
export type EquipmentCategory = 'camera' | 'lens' | 'lighting' | 'audio' | 'accessory' | 'special_setup';

export interface EquipmentCatalogItem {
  id: string;                // Firestore: equipment_catalog/{id}
  category: EquipmentCategory;
  brand: string;
  model: string;
  capabilities: string[];    // ['4k','macro','studio','gimbal',...]
  mount?: string;            // للعدسات
  compatibleMounts?: string[]; // للكاميرات
  type?: string;             // نوع فرعي
  focalLength?: string;      // للعدسات
  maxAperture?: string;      // للعدسات
  power?: string;            // للإضاءة
  size?: string;             // للمعدلات
}

export interface CreatorEquipmentItem {
  catalogId: string;         // ref → EquipmentCatalogItem.id
  owned: boolean;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  quantity: number;
  notes?: string;
  isCustom?: boolean;        // للمعدات المخصصة
  status?: 'pending_review' | 'approved' | 'rejected'; // حالة المراجعة للمعدات المخصصة
  customData?: {             // بيانات المعدة المخصصة
    name: string;
    brand: string;
    model: string;
    description: string;
  };
}

export interface EquipmentInventory {
  cameras: CreatorEquipmentItem[];
  lenses: CreatorEquipmentItem[];
  lighting: CreatorEquipmentItem[];
  audio: CreatorEquipmentItem[];
  accessories: CreatorEquipmentItem[];
  specialSetups: CreatorEquipmentItem[];
}

// مجموعات معدات جاهزة
export interface EquipmentPresetKit {
  id: string;
  name: string;
  nameAr: string;
  targetRole: 'photographer' | 'videographer' | 'designer' | 'producer';
  items: string[]; // catalogIds
  capabilities: string[];
  supportedVerticals: string[];
}

// جدول التوافق الأسبوعي المحدث
export interface WeeklyAvailability {
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  available: boolean;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  breakStart?: string; // HH:mm
  breakEnd?: string; // HH:mm
}

// نموذج التقييم من الإدارة
export interface CreatorEvaluation {
  id: string;
  creatorId: string;
  evaluatedBy: string;
  evaluatedAt: string;
  
  // المعايير الأساسية (من التوثيق)
  quality: {
    sharpnessDetail: number; // 1-5
    lightingExposure: number; // 1-5
    artDirection: number; // 1-5
    consistency: number; // 1-5
    notes?: string;
  };
  
  speed: {
    executionTime: number; // 1-5 مقابل SLA
    responseTime: number; // 1-5
    notes?: string;
  };
  
  reliability: {
    punctuality: number; // 1-5
    deliveryAccuracy: number; // 1-5
    notes?: string;
  };
  
  compliance: {
    clinicsCompliance: number; // 1-5
    policiesAdherence: number; // 1-5
    notes?: string;
  };
  
  // ملاءمة المعدات
  gearFit: {
    coversDeliverables: boolean;
    technicalNotes?: string;
  };
  
  // النتائج المحسوبة
  overallScore: number; // 0-100
  suggestedModifier: number; // نسبة مئوية
  suggestedTier: 'T1' | 'T2' | 'T3';
  workRestrictions?: string[]; // مثل "Studio only", "No Rush", "No Before-After"
  
  // توصيات التسعير
  pricingRecommendations: {
    affectedDeliverables: string[];
    reasons: string;
  };
}

// إحصائيات المبدعين
export interface CreatorsStats {
  total: number;
  byStatus: {
    registered: number;
    intake_submitted: number;
    under_review: number;
    approved: number;
    rejected: number;
    restricted: number;
  };
  byRole: {
    photographer: number;
    videographer: number;
    designer: number;
    producer: number;
  };
  byTier: {
    T1: number;
    T2: number;
    T3: number;
    unassigned: number;
  };
  averageScore: number;
  lastUpdated: string;
}

// طلب إنشاء مبدع جديد
export interface CreateCreatorRequest {
  fullName: string;
  role: Creator['role'];
  contact: Creator['contact'];
  city: string;
  canTravel: boolean;
  languages: string[];
  // باقي الحقول اختيارية في البداية
  skills?: CreatorSkill[];
  verticals?: string[];
  equipment?: CreatorEquipmentItem[];
  capacity?: Partial<Creator['capacity']>;
  compliance?: Partial<Creator['compliance']>;
  internalCost?: Partial<Creator['internalCost']>;
}

// طلب تحديث مبدع
export interface UpdateCreatorRequest extends Partial<CreateCreatorRequest> {
  id: string;
  status?: Creator['status'];
}

// استجابة قائمة المبدعين
export interface CreatorsListResponse {
  creators: Creator[];
  total: number;
  stats: CreatorsStats;
}
