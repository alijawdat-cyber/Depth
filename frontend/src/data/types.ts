// ================================
// أنواع البيانات والواجهات الأساسية
// ================================

// الأسماء والشركات العراقية
export const iraqiMaleNames = [
  'علي جواد كاظم', 'أحمد محمد حسن', 'محمد علي الربيعي', 'حسين جبار محمود',
  'كريم فاضل عبود', 'حيدر ماجد سالم', 'عمار طالب رشيد', 'فراس عبد الله',
];

export const iraqiFemaleNames = [
  'فاطمة أحمد علي', 'زينب حسن محمد', 'مريم كاظم جواد', 'سارة عبد الله',
  'نور علي حسين', 'ريم ماجد فاضل', 'هدى طالب كريم', 'دعاء محمود عبود',
];

export const iraqiCompanies = [
  'مطعم بيت بغداد', 'صالون الوردة الذهبية', 'شركة النور للتجارة', 'مجمع الحسين التجاري',
  'مطعم أم كلثوم', 'صيدلية الشفاء الحديثة', 'معرض السلام للسيارات', 'مخبز العائلة العراقية',
];

export const iraqiAreas = [
  { city: 'بغداد', area: 'الكرادة' },
  { city: 'بغداد', area: 'الجادرية' },
  { city: 'بغداد', area: 'المنصور' },
  { city: 'بصرة', area: 'العشار' },
  { city: 'أربيل', area: 'عنكاوة' },
  { city: 'دهوك', area: 'المركز' },
];

export const iraqiPhones = [
  '07701234567', '07809876543', '07751122334', '07663344556',
  '07512223456', '07734567890', '07889900112', '07556677889',
];

// واجهات نظام التسعير
export interface PricingModifier {
  id: string;
  category: 'processing' | 'experience' | 'equipment' | 'rush' | 'location' | 'ownership';
  name: string;
  key: string;
  value: number;
  type: 'multiplier' | 'addition';
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyMarginConfig {
  id: string;
  name: string;
  basePercentage: number; // نسبة واحدة بسيطة - مثل 2.25 = 225% ضمن النطاق 150%-300%
  rules: MarginRule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarginRule {
  id: string;
  condition: string;
  modifier: number;
  description: string;
  isActive: boolean;
}

export interface PricingCalculation {
  basePrice: number;
  modifiers: {
    processing: { key: string; value: number; };
    experience: { key: string; value: number; };
    equipment: { key: string; value: number; };
    rush: { key: string; value: number; };
    ownership: { key: string; value: number; };
  };
  locationAddition: number;
  creatorPrice: number;
  agencyMarginPercent: number;
  agencyMarginAmount: number;
  clientPrice: number;
}

// واجهات المستخدمين والأدمن
export interface User {
  uid: string;
  phone: string;
  email?: string;
  role: 'creator' | 'client' | 'salariedEmployee' | 'admin' | 'super_admin';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  userId: string;
  adminLevel: 'admin' | 'super_admin';
  fullName: string;
  phone: string;
  addedBy?: string;
  permissions: {
    canManageUsers: boolean;
    canManageProjects: boolean;
    canManagePayments: boolean;
    canViewReports: boolean;
    canManageSettings: boolean;
    canManageAdmins: boolean;
  };
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// واجهات الفواتير والدفعات
export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  clientId: string;
  status: 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  currency: 'IQD';
  amount: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  dueDate: Date;
  issuedAt: Date;
  paidAt?: Date;
  paymentTerms: 'advance_100' | 'advance_50' | 'net_15' | 'net_30';
  lineItems: InvoiceLineItem[];
  relatedPaymentsCount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  method: 'manual'; // V2.0 supports only manual payments
  reference?: string;
  receivedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  status: 'pending_verification' | 'verified' | 'disputed';
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// واجهات المبدعين
export interface Creator {
  id: string;
  userId: string;
  fullName: string;
  displayName: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  portfolioImages?: string[]; // ≤10 صور للبورتفوليو
  location: { city: string; area: string; };
  specialties: ('photo' | 'video' | 'design' | 'editing')[];
  experienceLevel: 'fresh' | 'experienced' | 'expert';
  yearsOfExperience: number;
  equipmentTier: 'silver' | 'gold' | 'platinum';
  hasOwnEquipment: boolean;
  onboardingStatus: 'pending' | 'active' | 'completed' | 'approved' | 'rejected' | 'in_progress';
  onboardingStep: number; // 1-5 خطوات التسجيل
  billingAddress?: {
    governorate: string;
    area: string;
    street: string;
    buildingNumber?: string;
    nearestLandmark?: string;
  };
  isAvailable: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string; // admin email
  rating: number;
  totalReviews: number;
  completedProjects: number;
  responseTimeHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// واجهات العملاء
export interface Client {
  id: string;
  userId: string;
  fullName: string;
  companyName?: string;
  businessType: 'individual' | 'company';
  industry?: string; // معرف المجال الصناعي - مطلوب للشركات
  location: { city: string; area: string; };
  preferredLanguage: 'ar' | 'en';
  totalSpent: number;
  totalProjects: number;
  rating: number;
  paymentTerms: 'advance_100' | 'advance_50' | 'net_15' | 'net_30';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// واجهات الموظفين بالراتب
export interface SalariedEmployee {
  id: string;
  userId: string;
  fullName: string;
  department: 'photography' | 'videography' | 'design' | 'editing' | 'admin';
  jobTitle: string;
  employmentType: 'full_time' | 'part_time' | 'contract';
  monthlySalary: number;
  skills: string[];
  isActive: boolean;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

// واجهات الفئات والفئات الفرعية
export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  code: string;
  basePrice: number;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// واجهة المجالات الصناعية
export interface Industry {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// واجهات المعدات
export interface Equipment {
  id: string;
  ownerId: string; // معرف المبدع
  type: 'camera' | 'lens' | 'lighting' | 'microphone' | 'tripod' | 'other';
  brand: string;
  model: string;
  status: 'excellent' | 'good' | 'needs_approval';
  purchaseDate?: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentRequest {
  id: string;
  creatorId: string;
  equipmentType: 'camera' | 'lens' | 'lighting' | 'microphone' | 'tripod' | 'other';
  brand: string;
  model: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  adminNotes?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// واجهات التوفر والجدولة
export interface CreatorAvailability {
  id: string;
  creatorId: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  timeSlot: string; // "09:00", "09:30", etc
  status: 'available' | 'busy' | 'blocked' | 'break';
  projectId?: string;
  blockReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityFlags {
  id: string;
  creatorId: string;
  rushAvailable: boolean;
  travelAvailable: boolean;
  studioAvailable: boolean;
  weeklyHoursLimit: number;
  notes?: string;
  updatedAt: string;
}

// واجهات المشاريع
// واجهة عناصر المشروع الفردية
export interface ProjectLineItem {
  id: string;
  subcategoryId: string;
  quantity: number;
  processingLevel: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite';
  basePrice: number;        // السعر الأساسي للوحدة الواحدة
  unitCreatorPrice: number; // سعر المبدع للوحدة الواحدة (بعد المعدلات)
  totalCreatorPrice: number; // unitCreatorPrice × quantity
  assignedCreators: string[]; // قائمة المبدعين المعينين لهذا العنصر
  notes?: string;
}

export interface Project {
  id: string;
  clientId: string;
  creatorId?: string; // المبدع الرئيسي (للمشاريع البسيطة)
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  
  // نظام العناصر المتعددة الجديد
  lineItems: ProjectLineItem[];
  
  // معلومات التسعير الإجمالية
  totalBasePrice: number;        // مجموع basePrice × quantity لكل عنصر
  totalCreatorPrice: number;     // مجموع totalCreatorPrice لكل عنصر
  totalClientPrice: number;      // totalCreatorPrice + هامش الوكالة
  agencyMarginPercent: number;   // نسبة هامش الوكالة
  agencyMarginAmount: number;    // المبلغ الفعلي لهامش الوكالة
  
  // تفاصيل المشروع
  isRush: boolean;
  location: 'studio' | 'client' | 'nearby' | 'outskirts' | 'far';
  deliveryDate: string;
  notes?: string;
  
  // الموافقة
  approvedBy?: string;
  approvedAt?: string;
  
  // التواريخ
  createdAt: string;
  updatedAt: string;
}

// واجهات الإشعارات
export interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'client' | 'creator' | 'admin' | 'employee';
  type: 'project_milestone' | 'payment_reminder' | 'project_assigned' | 'admin_action_required' | 'project_delivery' | 'quote_sent' | 'contract_signed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  isRead: boolean;
  actions?: NotificationAction[];
  details?: Record<string, string | number | boolean | Date>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationAction {
  type: 'view' | 'approve' | 'reject' | 'pay' | 'accept' | 'decline' | 'download' | 'review' | 'feedback';
  label: string;
  url: string;
}

// واجهات طلبات المشاريع
export interface ProjectRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  processingLevel: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite';
  requirements: {
    deliverables: string[];
    style: string;
    usage: string;
  };
  budget: { min: number; max: number; currency: 'IQD'; };
  location: 'studio' | 'client' | 'nearby' | 'outskirts' | 'far';
  isRush: boolean;
  preferredDeliveryDate: string;
  status: 'pending_review' | 'reviewing' | 'approved' | 'rejected' | 'converted_to_project';
  adminNotes?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  assignedCreatorId?: string;
  convertedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

// واجهات عروض الأسعار
export interface Quote {
  id: string;
  projectRequestId: string;
  clientId: string;
  title: string;
  description: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: 'IQD';
  };
  breakdown: { [key: string]: number; };
  assignedCreator: {
    id: string;
    name: string;
    rate: number;
  };
  terms: string[];
  clientResponse?: {
    status: 'accepted' | 'rejected';
    respondedAt: string;
    notes?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// واجهات العقود
export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  creatorId: string;
  contractNumber: string;
  title: string;
  status: 'draft' | 'sent' | 'pending_signatures' | 'signed' | 'completed' | 'cancelled';
  contractValue: number;
  currency: 'IQD';
  startDate: string;
  deliveryDate: string;
  paymentTerms: {
    schedule: 'advance_100' | 'advance_60' | 'advance_50' | 'net_15' | 'net_30';
    advance: number;
    onDelivery: number;
  };
  scope: {
    deliverables: string[];
    exclusions: string[];
  };
  signatures?: {
    client?: ContractSignature;
    creator?: ContractSignature;
    agency?: ContractSignature;
  };
  documentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractSignature {
  signedBy: string;
  signedAt: string;
  ipAddress: string;
}
