// النظام الموحد للمستخدمين - المصدر الوحيد للحقيقة
// يحل محل: creators, clients, employees, admins collections المتفرقة

// أدوار الوصول الأساسية
export type UserRole = 'admin' | 'client' | 'creator' | 'employee';

// حالات المستخدم
export type UserStatus = 'active' | 'pending' | 'suspended' | 'deleted' | 'onboarding_started' | 'intake_submitted' | 'under_review';

// تخصصات المبدعين المهنية
export type CreatorSpecialty = 'photographer' | 'videographer' | 'designer' | 'producer';

// مستويات الخبرة
export type ExperienceLevel = 'beginner' | 'intermediate' | 'professional';

// حالة انضمام المبدع
export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';

// أنواع التوفر
export type AvailabilityType = 'full-time' | 'part-time' | 'weekends' | 'flexible';

// واجهة مهارة المبدع
export interface CreatorSkill {
  subcategoryId: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experienceYears: number;
  verified: boolean;
  notes?: string;
}

// واجهة عينة عمل
export interface WorkSample {
  url: string;
  title: string;
  category: 'photo' | 'video' | 'design';
  description?: string;
}

// واجهة معرض الأعمال
export interface Portfolio {
  workSamples: WorkSample[];
  socialMedia: {
    instagram?: string;
    behance?: string;
    website?: string;
  };
  portfolioUrl?: string;
}

// واجهة التوفر الأسبوعي
export interface WeeklyAvailability {
  day: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
}

// واجهة التوفر
export interface Availability {
  availability: AvailabilityType;
  weeklyHours: number;
  preferredWorkdays: string[];
  weeklyAvailability: WeeklyAvailability[];
  timeZone: string;
  urgentWork: boolean;
}

// واجهة المعدات
export interface Equipment {
  cameras: string[];
  lenses: string[];
  lighting: string[];
  audio: string[];
  accessories: string[];
  specialSetups: string[];
}

// ملف المبدع المفصل
export interface CreatorProfile {
  // التخصص المهني (وليس دور الوصول)
  specialty: CreatorSpecialty;
  
  // الموقع والحركة
  city: string;
  canTravel: boolean;
  
  // الخبرة والمهارات
  experienceLevel: ExperienceLevel;
  experienceYears: string;
  skills: CreatorSkill[];
  previousClients?: string[];
  
  // اللغات والمجالات
  languages: string[];
  primaryCategories: ('photo' | 'video' | 'design')[];
  
  // معرض الأعمال
  portfolio: Portfolio;
  
  // التوفر والجدولة
  availability: Availability;
  
  // المعدات
  equipment: Equipment;
  
  // حالة الانضمام
  onboardingStatus: OnboardingStatus;
  onboardingStep?: number;
  onboardingData?: Partial<Record<string, unknown>>; // للحفظ المؤقت أثناء الانضمام
  onboardingCompletedAt?: string;
  
  // معلومات تقييم الإدارة
  tier?: string;
  modifier?: number;
  approvedCategories?: string[];
  
  // معلومات إضافية
  bio?: string;
  preferredVerticals?: string[];
  rateOverrides?: Array<Record<string, unknown>>;
}

// ملف العميل
export interface ClientProfile {
  company?: string;
  industry?: string;
  website?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  preferredLanguage?: string;
  timeZone?: string;
  
  // معلومات التعاقد
  msaOnFile?: boolean;
  preferredCommunication?: 'email' | 'whatsapp' | 'phone';
  
  // تفضيلات المشاريع
  typicalBudgetRange?: string;
  preferredDeliveryMethod?: string;
}

// ملف الموظف
export interface EmployeeProfile {
  position: string;
  department: string;
  salary: number;
  permissions: string[];
  
  // معلومات العمل
  startDate: string;
  capacity: number; // ساعات أسبوعية
  skills?: string[];
  
  // معلومات الدعوة
  inviteId?: string;
  invitedBy?: string;
  invitedAt?: string;
  joinedAt?: string;
}

// المستخدم الموحد - المصدر الوحيد للحقيقة
export interface UnifiedUser {
  // المعرف الفريد
  id: string;
  
  // بيانات الهوية الأساسية
  email: string;
  name: string;
  
  // دور الوصول (وليس التخصص المهني)
  role: UserRole;
  
  // حالة الحساب
  status: UserStatus;
  
  // الأمان
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  
  // معلومات الاتصال
  phone?: string;
  avatar?: string;
  
  // الملفات الشخصية المتخصصة (حسب الدور)
  creatorProfile?: CreatorProfile;
  clientProfile?: ClientProfile;
  employeeProfile?: EmployeeProfile;
  
  // metadata النظام
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  
  // معلومات للمراجعة والتتبع
  source?: string; // 'web' | 'mobile' | 'admin' | 'invite'
  originalId?: string; // للمرجعية أثناء التحويل
  originalCollection?: string; // للمرجعية أثناء التحويل
  
  // إحصائيات وتتبع
  loginAttempts?: number;
  lockedUntil?: string;
  
  // إعدادات المستخدم
  preferences?: {
    language?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'auto';
  };
}

// واجهة للبحث والفلترة
export interface UserSearchFilters {
  role?: UserRole;
  status?: UserStatus;
  city?: string;
  specialty?: CreatorSpecialty;
  experienceLevel?: ExperienceLevel;
  skills?: string[];
  availability?: AvailabilityType;
}

// واجهة إحصائيات المستخدمين
export interface UserStats {
  total: number;
  byRole: Record<UserRole, number>;
  byStatus: Record<UserStatus, number>;
  verified: number;
  twoFactor: number;
  newThisMonth: number;
  activeToday: number;
}

// واجهة للبيانات القديمة من collections المختلفة
interface LegacyUserData extends Record<string, unknown> {
  email?: string;
  fullName?: string;
  name?: string;
  status?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  phone?: string;
  avatar?: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  source?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  onboardingProgress?: {
    currentStep?: number;
  };
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string;
  role?: string;
  city?: string;
  canTravel?: boolean;
  experienceLevel?: string;
  experienceYears?: string;
  skills?: CreatorSkill[];
  previousClients?: string[];
  languages?: string[];
  primaryCategories?: string[];
  portfolio?: Portfolio;
  availability?: Availability;
  equipment?: Equipment;
  tier?: string;
  modifier?: number;
  approvedCategories?: string[];
  bio?: string;
  preferredVerticals?: string[];
  rateOverrides?: Array<Record<string, unknown>>;
  // خصائص العميل
  company?: string;
  industry?: string;
  website?: string;
  size?: string;
  preferredLanguage?: string;
  timeZone?: string;
  msaOnFile?: boolean;
  preferredCommunication?: string;
  typicalBudgetRange?: string;
  preferredDeliveryMethod?: string;
  // خصائص الموظف
  position?: string;
  department?: string;
  salary?: number;
  permissions?: string[];
  startDate?: string;
  capacity?: number;
  inviteId?: string;
  invitedBy?: string;
  invitedAt?: string;
  joinedAt?: string;
}

// دوال مساعدة للتحويل
export const mapLegacyCreatorToUnified = (creatorData: LegacyUserData, docId: string): UnifiedUser => {
  return {
    id: docId,
    email: creatorData.email || creatorData.contact?.email || '',
    name: creatorData.fullName || creatorData.name || '',
    role: 'creator',
    status: mapCreatorStatus(creatorData.status),
    emailVerified: creatorData.emailVerified || false,
    twoFactorEnabled: creatorData.twoFactorEnabled || false,
    phone: creatorData.phone || creatorData.contact?.phone,
    avatar: creatorData.avatar || creatorData.photoURL,
    creatorProfile: {
      specialty: (creatorData.role as CreatorSpecialty) || 'photographer',
      city: creatorData.city || '',
      canTravel: creatorData.canTravel || false,
      experienceLevel: (creatorData.experienceLevel as ExperienceLevel) || 'beginner',
      experienceYears: creatorData.experienceYears || '0-1',
      skills: creatorData.skills || [],
      previousClients: creatorData.previousClients || [],
      languages: creatorData.languages || ['ar'],
      primaryCategories: (creatorData.primaryCategories as ('photo' | 'video' | 'design')[]) || [],
      portfolio: creatorData.portfolio || { workSamples: [], socialMedia: {} },
      availability: creatorData.availability || {
        availability: 'flexible',
        weeklyHours: 20,
        preferredWorkdays: [],
        weeklyAvailability: [],
        timeZone: 'Asia/Baghdad',
        urgentWork: false
      },
      equipment: creatorData.equipment || {
        cameras: [],
        lenses: [],
        lighting: [],
        audio: [],
        accessories: [],
        specialSetups: []
      },
      onboardingStatus: mapOnboardingStatus(creatorData),
      onboardingStep: creatorData.onboardingProgress?.currentStep,
      onboardingCompletedAt: creatorData.onboardingCompletedAt,
      tier: creatorData.tier,
      modifier: creatorData.modifier,
      approvedCategories: creatorData.approvedCategories,
      bio: creatorData.bio,
      preferredVerticals: creatorData.preferredVerticals,
      rateOverrides: creatorData.rateOverrides
    },
    createdAt: creatorData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: creatorData.lastLoginAt,
    source: creatorData.source || 'web',
    originalId: docId,
    originalCollection: 'creators'
  };
};

export const mapLegacyClientToUnified = (clientData: LegacyUserData, docId: string): UnifiedUser => {
  return {
    id: docId,
    email: clientData.email || '',
    name: clientData.name || clientData.fullName || '',
    role: 'client',
    status: (clientData.status as UserStatus) || 'active',
    emailVerified: clientData.emailVerified || false,
    twoFactorEnabled: clientData.twoFactorEnabled || false,
    phone: clientData.phone,
    avatar: clientData.avatar || clientData.photoURL,
    clientProfile: {
      company: clientData.company,
      industry: clientData.industry,
      website: clientData.website,
      size: clientData.size as 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | undefined,
      preferredLanguage: clientData.preferredLanguage || 'ar',
      timeZone: clientData.timeZone || 'Asia/Baghdad',
      msaOnFile: clientData.msaOnFile || false,
      preferredCommunication: clientData.preferredCommunication as 'email' | 'whatsapp' | 'phone' | undefined || 'email',
      typicalBudgetRange: clientData.typicalBudgetRange,
      preferredDeliveryMethod: clientData.preferredDeliveryMethod
    },
    createdAt: clientData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: clientData.lastLoginAt,
    source: clientData.source || 'web',
    originalId: docId,
    originalCollection: 'clients'
  };
};

export const mapLegacyEmployeeToUnified = (employeeData: LegacyUserData, docId: string): UnifiedUser => {
  return {
    id: docId,
    email: employeeData.email || '',
    name: employeeData.name || employeeData.fullName || '',
    role: 'employee',
    status: (employeeData.status as UserStatus) || 'active',
    emailVerified: employeeData.emailVerified || false,
    twoFactorEnabled: employeeData.twoFactorEnabled || false,
    phone: employeeData.phone,
    avatar: employeeData.avatar || employeeData.photoURL,
    employeeProfile: {
      position: employeeData.position || '',
      department: employeeData.department || '',
      salary: employeeData.salary || 0,
      permissions: employeeData.permissions || [],
      startDate: employeeData.startDate || employeeData.createdAt || new Date().toISOString(),
      capacity: employeeData.capacity || 40,
      skills: employeeData.skills as string[] | undefined,
      inviteId: employeeData.inviteId,
      invitedBy: employeeData.invitedBy,
      invitedAt: employeeData.invitedAt,
      joinedAt: employeeData.joinedAt
    },
    createdAt: employeeData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: employeeData.lastLoginAt,
    source: employeeData.source || 'invite',
    originalId: docId,
    originalCollection: 'employees'
  };
};

// دوال مساعدة للتحويل
function mapCreatorStatus(status: string | undefined): UserStatus {
  if (!status) return 'pending';
  
  switch (status) {
    case 'onboarding_started': return 'onboarding_started';
    case 'intake_submitted': return 'intake_submitted';
    case 'under_review': return 'under_review';
    case 'approved': return 'active';
    case 'rejected': return 'suspended';
    case 'active': return 'active';
    case 'suspended': return 'suspended';
    default: return 'pending';
  }
}

function mapOnboardingStatus(creatorData: LegacyUserData): OnboardingStatus {
  if (creatorData.onboardingCompleted) return 'completed';
  if (creatorData.status === 'onboarding_started') return 'in_progress';
  if (creatorData.status === 'intake_submitted') return 'completed';
  return 'not_started';
}

// تصدير المساعدات
export {
  mapCreatorStatus,
  mapOnboardingStatus
};
