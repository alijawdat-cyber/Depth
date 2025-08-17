// Types موحدة لنظام الـ Onboarding الاحترافي
// تجمع كل البيانات المطلوبة في هيكل منطقي ومتدرج

import type { CreatorSkill, EquipmentInventory, WeeklyAvailability } from './creators';

export type CreatorRole = 'photographer' | 'videographer' | 'designer' | 'producer';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'professional';
export type AvailabilityType = 'full-time' | 'part-time' | 'weekends' | 'flexible';
export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

// المرحلة 1: إنشاء الحساب
export interface AccountCreationData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

// المرحلة 2: المعلومات الأساسية
export interface BasicInfoData {
  role: CreatorRole;
  city: string;
  canTravel: boolean;
  languages: string[];
  primaryCategories: ('photo' | 'video' | 'design')[];
}

// المرحلة 3: الخبرة والمهارات
export interface ExperienceData {
  experienceLevel: ExperienceLevel;
  experienceYears: string;
  skills: CreatorSkill[]; // استبدل specializations بـ skills مع subcategoryId
  specializations?: string[]; // احتفظ بالقديم للتوافق المؤقت
  previousClients?: string[];
}

// المرحلة 4: معرض الأعمال
export interface PortfolioData {
  portfolioUrl?: string;
  workSamples: WorkSample[];
  socialMedia: {
    instagram?: string;
    behance?: string;
    website?: string;
  };
}

export interface WorkSample {
  url: string;
  title: string;
  category: 'photo' | 'video' | 'design';
  description?: string;
}

// المرحلة 5: التوفر والتسعير
export interface AvailabilityData {
  availability: AvailabilityType;
  weeklyHours: number;
  preferredWorkdays: string[]; // احتفظ للتوافق المؤقت
  weeklyAvailability?: WeeklyAvailability[]; // الجدول المفصل الجديد
  timeZone: string;
  urgentWork: boolean;
}

// البيانات الكاملة للـ Onboarding
export interface OnboardingFormData {
  // معلومات الخطوة الحالية
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  
  // بيانات كل مرحلة
  account: AccountCreationData;
  basicInfo: BasicInfoData;
  experience: ExperienceData;
  portfolio: PortfolioData;
  availability: AvailabilityData;
  
  // معدات المبدع (جديد)
  equipment?: EquipmentInventory;
  
  // معلومات إضافية
  metadata: {
    startedAt: string;
    lastSavedAt?: string;
    source: 'web' | 'mobile' | 'admin';
    referralCode?: string;
  };
}

// حالة الـ Onboarding
export interface OnboardingState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
  canProceed: boolean;
  autoSaveEnabled: boolean;
}

// Context للـ Onboarding
export interface OnboardingContextType {
  formData: OnboardingFormData;
  state: OnboardingState;
  
  // Actions
  updateAccountData: (data: Partial<AccountCreationData>) => void;
  updateBasicInfo: (data: Partial<BasicInfoData>) => void;
  updateExperience: (data: Partial<ExperienceData>) => void;
  updatePortfolio: (data: Partial<PortfolioData>) => void;
  updateAvailability: (data: Partial<AvailabilityData>) => void;
  updateEquipment: (data: Partial<EquipmentInventory>) => void;
  
  // Navigation
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  
  // Data management
  saveProgress: () => Promise<boolean>;
  submitOnboarding: () => Promise<boolean>;
  resetForm: () => void;
  
  // Validation
  validateCurrentStep: () => boolean;
  getStepErrors: (step: OnboardingStep) => string[];
}

// تكوين خطوات الـ Onboarding
export interface OnboardingStepConfig {
  id: OnboardingStep;
  title: string;
  subtitle: string;
  icon: string;
  required: boolean;
  estimatedTime: number; // بالدقائق
  dependencies?: OnboardingStep[];
}

// استجابة API للـ Onboarding
export interface OnboardingApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    creatorId?: string;
    nextStep?: OnboardingStep;
    completionPercentage?: number;
  };
  requestId?: string;
}

// طلب حفظ التقدم
export interface SaveProgressRequest {
  step: OnboardingStep;
  data: Partial<OnboardingFormData>;
  autoSave?: boolean;
}

// طلب إرسال الـ Onboarding الكامل
export interface SubmitOnboardingRequest {
  formData: OnboardingFormData;
  skipOptionalSteps?: boolean;
}

// معلومات التقدم
export interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  completionPercentage: number;
  estimatedTimeRemaining: number; // بالدقائق
  canSkipToEnd: boolean;
  lastSavedAt?: string;
}

// تكوين الـ Validation لكل خطوة
export interface StepValidationRules {
  [key: number]: {
    required: (keyof OnboardingFormData)[];
    optional: (keyof OnboardingFormData)[];
    customValidators?: Array<(data: OnboardingFormData) => string | null>;
  };
}

// أخطاء التحقق
export interface ValidationError {
  field: string;
  message: string;
  step: OnboardingStep;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
