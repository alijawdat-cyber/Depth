// Onboarding constants & initial state (feature flags removed – default behavior)
import type { OnboardingFormData, OnboardingState } from '@/types/onboarding';

export const initialFormData: OnboardingFormData = {
  currentStep: 1,
  completedSteps: [],
  hasInteracted: false,
  account: { fullName: '', email: '', password: '', confirmPassword: '', phone: '', agreeToTerms: false },
  basicInfo: { role: 'photographer', city: '', canTravel: false, languages: ['ar'], primaryCategories: [] },
  experience: { experienceLevel: 'beginner', experienceYears: '0-1', skills: [], previousClients: [] },
  portfolio: { workSamples: [], socialMedia: {} },
  availability: { availability: 'flexible', weeklyHours: 20, preferredWorkdays: [], weeklyAvailability: [], timeZone: 'Asia/Baghdad', urgentWork: false },
  equipment: { cameras: [], lenses: [], lighting: [], audio: [], accessories: [], specialSetups: [] },
  metadata: { startedAt: '', source: 'web' }
};

export const initialState: OnboardingState = {
  loading: false,
  saving: false,
  error: null,
  success: false,
  canProceed: false,
  autoSaveEnabled: true,
  touchedFields: new Set<string>(),
  showValidation: false,
  loadingMessage: ''
};

export const LOCAL_STORAGE_LEGACY_KEY = 'onboarding_progress_v1';
export const LOCAL_STORAGE_KEY = 'onboarding:data';
export const LOCAL_STORAGE_MIGRATED_FLAG = 'onboarding:migrated';
export const LOCAL_SAVE_DEBOUNCE_MS = 600;
