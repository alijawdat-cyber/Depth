// Hook مخصص لإدارة حالة الـ Onboarding
'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { showSuccess, showError } from '@/lib/toast';
import type {
  OnboardingFormData,
  OnboardingState,
  OnboardingContextType,
  OnboardingStep,
  AccountCreationData,
  BasicInfoData,
  ExperienceData,
  PortfolioData,
  AvailabilityData,
  OnboardingProgress
} from '@/types/onboarding';
import type { EquipmentInventory } from '@/types/creators';

// الحالة الأولية للنموذج
const initialFormData: OnboardingFormData = {
  currentStep: 1,
  completedSteps: [],
  hasInteracted: false, // متغير لتتبع التفاعل مع النموذج
  account: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  },
  basicInfo: {
    role: 'photographer',
    city: '',
    canTravel: false,
    languages: ['ar'],
    primaryCategories: []
  },
  experience: {
    experienceLevel: 'beginner',
    experienceYears: '0-1',
    skills: [],
    previousClients: []
  },
  portfolio: {
    workSamples: [],
    socialMedia: {}
  },
  availability: {
    availability: 'flexible',
    weeklyHours: 20,
    preferredWorkdays: [],
    weeklyAvailability: [], // الجدول الأسبوعي المفصل
    timeZone: 'Asia/Baghdad',
    urgentWork: false
  },
  equipment: {
    cameras: [],
    lenses: [],
    lighting: [],
    audio: [],
    accessories: [],
    specialSetups: []
  },
  metadata: {
    startedAt: '', // سيتم تحديثه في useEffect لتجنب hydration mismatch
    source: 'web'
  }
};

// الحالة الأولية للـ UI
const initialState: OnboardingState = {
  loading: false,
  saving: false,
  error: null,
  success: false,
  canProceed: false,
  autoSaveEnabled: true,
  touchedFields: new Set<string>(),
  showValidation: false,
  loadingMessage: '' // رسالة التحميل المخصصة
};

// Action types للـ Reducer
type OnboardingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_MESSAGE'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: boolean }
  | { type: 'SET_CAN_PROCEED'; payload: boolean }
  | { type: 'MARK_FIELD_TOUCHED'; payload: string }
  | { type: 'SET_SHOW_VALIDATION'; payload: boolean }
  | { type: 'UPDATE_ACCOUNT'; payload: Partial<AccountCreationData> }
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<BasicInfoData> }
  | { type: 'UPDATE_EXPERIENCE'; payload: Partial<ExperienceData> }
  | { type: 'UPDATE_PORTFOLIO'; payload: Partial<PortfolioData> }
  | { type: 'UPDATE_AVAILABILITY'; payload: Partial<AvailabilityData> }
  | { type: 'UPDATE_EQUIPMENT'; payload: Partial<EquipmentInventory> }
  | { type: 'UPDATE_METADATA'; payload: Partial<OnboardingFormData['metadata']> }
  | { type: 'SET_CURRENT_STEP'; payload: OnboardingStep }
  | { type: 'COMPLETE_STEP'; payload: OnboardingStep }
  | { type: 'SET_HAS_INTERACTED'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_SAVED_DATA'; payload: Partial<OnboardingFormData> };

// Reducer للـ Onboarding
function onboardingReducer(
  state: { formData: OnboardingFormData; uiState: OnboardingState },
  action: OnboardingAction
): { formData: OnboardingFormData; uiState: OnboardingState } {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, uiState: { ...state.uiState, loading: action.payload } };
    
    case 'SET_LOADING_MESSAGE':
      return { ...state, uiState: { ...state.uiState, loadingMessage: action.payload } };
    
    case 'SET_SAVING':
      return { ...state, uiState: { ...state.uiState, saving: action.payload } };
    
    case 'SET_ERROR':
      return { ...state, uiState: { ...state.uiState, error: action.payload } };
    
    case 'SET_SUCCESS':
      return { ...state, uiState: { ...state.uiState, success: action.payload } };
    
    case 'SET_CAN_PROCEED':
      return { ...state, uiState: { ...state.uiState, canProceed: action.payload } };
    
    case 'MARK_FIELD_TOUCHED':
      return { 
        ...state, 
        uiState: { 
          ...state.uiState, 
          touchedFields: new Set([...state.uiState.touchedFields, action.payload]) 
        } 
      };
    
    case 'SET_SHOW_VALIDATION':
      return { ...state, uiState: { ...state.uiState, showValidation: action.payload } };
    
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        formData: {
          ...state.formData,
          account: { ...state.formData.account, ...action.payload }
        }
      };
    
    case 'UPDATE_BASIC_INFO':
      return {
        ...state,
        formData: {
          ...state.formData,
          basicInfo: { ...state.formData.basicInfo, ...action.payload }
        }
      };
    
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        formData: {
          ...state.formData,
          experience: { ...state.formData.experience, ...action.payload }
        }
      };
    
    case 'UPDATE_PORTFOLIO':
      return {
        ...state,
        formData: {
          ...state.formData,
          portfolio: { ...state.formData.portfolio, ...action.payload }
        }
      };
    
    case 'UPDATE_AVAILABILITY':
      return {
        ...state,
        formData: {
          ...state.formData,
          availability: { ...state.formData.availability, ...action.payload }
        }
      };
    
    case 'UPDATE_EQUIPMENT':
      return {
        ...state,
        formData: {
          ...state.formData,
          equipment: { 
            cameras: [],
            lenses: [],
            lighting: [],
            audio: [],
            accessories: [],
            specialSetups: [],
            ...state.formData.equipment, 
            ...action.payload 
          }
        }
      };
    
    case 'UPDATE_METADATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          metadata: { ...state.formData.metadata, ...action.payload }
        }
      };
    
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        formData: { ...state.formData, currentStep: action.payload }
      };
    
    case 'COMPLETE_STEP':
      const completedSteps = [...state.formData.completedSteps];
      if (!completedSteps.includes(action.payload)) {
        completedSteps.push(action.payload);
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          completedSteps: completedSteps.sort()
        }
      };
    
    case 'SET_HAS_INTERACTED':
      return {
        ...state,
        formData: { ...state.formData, hasInteracted: action.payload }
      };
    
    case 'RESET_FORM':
      return {
        formData: initialFormData,
        uiState: initialState
      };
    
    case 'LOAD_SAVED_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Context للـ Onboarding
export const OnboardingContext = createContext<OnboardingContextType | null>(null);

// Hook لاستخدام الـ Onboarding Context
export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

// Provider للـ Onboarding Context
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [{ formData, uiState }, dispatch] = useReducer(onboardingReducer, {
    formData: initialFormData,
    uiState: initialState
  });

  // تحديث startedAt بعد mount لتجنب hydration mismatch
  useEffect(() => {
    if (!formData.metadata.startedAt) {
      dispatch({ 
        type: 'UPDATE_METADATA', 
        payload: { startedAt: new Date().toISOString() } 
      });
    }
  }, [formData.metadata.startedAt]);

    // Helper لتحديد رسالة النجاح لكل خطوة
  const getStepSuccessMessage = useCallback((step: number): string => {
    const messages: Record<number, string> = {
      1: 'تم إنشاء الحساب بنجاح! 🎉',
      2: 'تم حفظ معلوماتك الأساسية بنجاح! ✅',
      3: 'تم حفظ محفظة أعمالك بنجاح! 🎨',
      4: 'تم حفظ معلومات الدفع بنجاح! 💳',
      5: 'مبروك! تم إكمال عملية التسجيل بنجاح! 🚀'
    };
    return messages[step] || 'تم الحفظ بنجاح!';
  }, []);

  // Helper لتحديث حالة التحميل مع رسالة
  const setLoadingWithMessage = useCallback((loading: boolean, message: string = 'جارٍ التحميل...') => {
    dispatch({ type: 'SET_LOADING', payload: loading });
    dispatch({ type: 'SET_LOADING_MESSAGE', payload: message });
  }, []);

  // تحميل البيانات المحفوظة عند بدء الجلسة
  const loadSavedProgress = useCallback(async () => {
    // للمستخدمين الجدد، لا نحمل بيانات محفوظة
    if (!session?.user?.email) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch('/api/creators/onboarding/progress');
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          const savedFormData = result.data.formData || result.data;
          if (savedFormData) {
            dispatch({ type: 'LOAD_SAVED_DATA', payload: savedFormData });
            if (typeof savedFormData.currentStep === 'number') {
              dispatch({ type: 'SET_CURRENT_STEP', payload: savedFormData.currentStep });
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load saved progress:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [session?.user?.email]);

  // حفظ التقدم تلقائياً
  const saveProgress = useCallback(async (): Promise<boolean> => {
    // للمستخدمين الجدد في الخطوة الأولى، لا نحفظ التقدم حتى يتم إنشاء الحساب
    if (formData.currentStep === 1 && !session?.user?.email) {
      return true; // لا نحفظ في الخطوة الأولى للمستخدمين الجدد
    }
    
    if (!session?.user?.email || !uiState.autoSaveEnabled) return true;
    
    dispatch({ type: 'SET_SAVING', payload: true });
    
    try {
      const response = await fetch('/api/creators/onboarding/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: formData.currentStep,
          data: formData,
          autoSave: true
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.data?.lastSavedAt) {
          // تحديث lastSavedAt في metadata
          dispatch({ 
            type: 'LOAD_SAVED_DATA', 
            payload: { 
              metadata: { 
                ...formData.metadata, 
                lastSavedAt: result.data.lastSavedAt 
              } 
            } 
          });
        }
        dispatch({ type: 'SET_ERROR', payload: null });
        return true;
      } else {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'فشل في الحفظ التلقائي' });
      return false;
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [session?.user?.email, formData, uiState.autoSaveEnabled]);

  // التحقق من صحة الخطوة الحالية
  const validateCurrentStep = useCallback((): boolean => {
    const step = formData.currentStep;
    
    switch (step) {
      case 1: // Account Creation
        const isValidEmail = formData.account.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email);
        const isValidPassword = formData.account.password.length >= 8;
        const passwordsMatch = formData.account.password === formData.account.confirmPassword;
        const isValidPhone = formData.account.phone.trim();
        const isValidName = formData.account.fullName.trim();
        
        logger.onboardingDebug('Step 1 validation', {
          isValidName,
          isValidEmail,
          isValidPassword,
          passwordsMatch,
          isValidPhone,
          agreeToTerms: formData.account.agreeToTerms
        });
        
        return !!(
          isValidName &&
          isValidEmail &&
          isValidPassword &&
          passwordsMatch &&
          isValidPhone &&
          formData.account.agreeToTerms
        );
      
      case 2: // Basic Info
        return !!(
          formData.basicInfo.role &&
          formData.basicInfo.city.trim() &&
          formData.basicInfo.primaryCategories.length > 0
        );
      
      case 3: // Experience
        return !!(
          formData.experience.experienceLevel &&
          formData.experience.experienceYears
          // المهارات اختيارية - لا نتطلبها للانتقال
        );
      
      case 4: // Portfolio
        return true; // خطوة اختيارية بالكامل
      
      case 5: // Availability
        const hasBasicAvailability = !!(
          formData.availability.availability &&
          formData.availability.weeklyHours > 0
        );
        
        const hasWorkdays = (formData.availability.preferredWorkdays?.length || 0) > 0;
        const hasWeeklyAvailability = !!(formData.availability.weeklyAvailability?.some(day => day.available));
        
        logger.onboardingDebug('Step 5 validation', {
          availability: formData.availability.availability,
          weeklyHours: formData.availability.weeklyHours,
          preferredWorkdaysLength: formData.availability.preferredWorkdays?.length || 0,
          hasWeeklyAvailability,
          hasBasicAvailability,
          hasWorkdays
        });
        
        return hasBasicAvailability && (hasWorkdays || hasWeeklyAvailability);
      
      default:
        return false;
    }
  }, [formData]);

  // الانتقال للخطوة التالية
  const nextStep = useCallback(async (): Promise<boolean> => {
    logger.onboardingDebug(`Starting step transition from ${formData.currentStep}`);
    logger.onboardingDebug(`Current session: ${session?.user ? 'logged in' : 'not logged in'}`);
    logger.onboardingDebug(`Form data validation: ${validateCurrentStep()}`);
    
    // تفعيل عرض الأخطاء عند محاولة الانتقال
    dispatch({ type: 'SET_SHOW_VALIDATION', payload: true });
    
    if (!validateCurrentStep()) {
      logger.onboardingDebug(`Validation failed for step ${formData.currentStep}`);
      dispatch({ type: 'SET_ERROR', payload: 'يرجى إكمال جميع الحقول المطلوبة' });
      return false;
    }
    
    // للخطوة الأولى: إنشاء الحساب إذا لم يكن موجود
    if (formData.currentStep === 1 && !session?.user) {
      setLoadingWithMessage(true, 'جاري إنشاء حسابك...');
      dispatch({ type: 'SET_ERROR', payload: null }); // مسح الأخطاء السابقة
      
      try {
        // إنشاء حساب جديد
        const response = await fetch('/api/creators/onboarding/create-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.account)
        });
        
        const attemptSilentSignIn = async () => {
          try {
            const signInResult = await signIn('credentials', {
              email: formData.account.email.toLowerCase().trim(),
              password: formData.account.password,
              redirect: false
            });
            logger.onboardingDebug('Silent sign-in result', { ok: signInResult?.ok, error: signInResult?.error });
            return signInResult?.ok && !signInResult?.error;
          } catch (e) {
            logger.onboardingDebug('Silent sign-in exception', { error: String(e) });
            return false;
          }
        };

        if (response.status === 409) {
          // البريد موجود - نحاول تسجيل الدخول مباشرةً
            logger.onboardingDebug('Email already exists, trying silent sign-in');
            const signedIn = await attemptSilentSignIn();
            if (signedIn) {
              dispatch({ type: 'COMPLETE_STEP', payload: 1 });
              dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
              dispatch({ type: 'SET_SHOW_VALIDATION', payload: false });
              setLoadingWithMessage(false, '');
              showSuccess('تم التحقق من حسابك، نكمل للخطوة ٢');
              return true;
            } else {
              // فشل التوقيع - نبقيه في نفس الخطوة لكن نوضح الرسالة
              const errData = await response.json().catch(() => ({}));
              dispatch({ type: 'SET_ERROR', payload: errData.error || 'البريد مستخدم مسبقاً، حاول تسجيل الدخول' });
              setLoadingWithMessage(false, '');
              return false;
            }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          logger.onboardingDebug('Account creation failed', { status: response.status, error: errorData.error });
          throw new Error(errorData.error || 'فشل في إنشاء الحساب');
        }
        
        const result = await response.json();
        logger.onboardingDebug('Account created successfully', { userId: result?.data?.userId, email: formData.account.email });
        showSuccess('تم إنشاء حسابك بنجاح! 🎉', 'مرحباً بك في Depth Agency');
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const signedIn = await attemptSilentSignIn();
        if (!signedIn) {
          // السماح بالانتقال مع تنبيه بسيط بدلاً من حبس المستخدم
          logger.onboardingDebug('Proceeding to step 2 without active session');
          showError('تم إنشاء الحساب لكن نحتاج تسجيل دخول لاحقاً لإكمال الحفظ');
        }
        // في كل الأحوال نكمل للخطوة التالية كي لا يعيد المستخدم تعبئة البيانات
        dispatch({ type: 'COMPLETE_STEP', payload: 1 });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
        dispatch({ type: 'SET_SHOW_VALIDATION', payload: false });
        setLoadingWithMessage(false, '');
        return true;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في إنشاء الحساب';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        setLoadingWithMessage(false, '');
        return false;
      }
    }
    
    // للخطوات الأخرى: حفظ التقدم قبل الانتقال
    if (formData.currentStep > 1) {
      setLoadingWithMessage(true, 'جاري حفظ بياناتك...');
      const saved = await saveProgress();
      if (!saved) {
        setLoadingWithMessage(false, '');
        return false;
      }
      
      // عرض رسالة النجاح المخصصة للخطوة
      const successMessage = getStepSuccessMessage(formData.currentStep);
      showSuccess(successMessage);
      
      // انتظار قصير لعرض الرسالة
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // تسجيل إكمال الخطوة
    dispatch({ type: 'COMPLETE_STEP', payload: formData.currentStep });
    
    // الانتقال للخطوة التالية
    if (formData.currentStep < 5) {
      const nextStepNum = (formData.currentStep + 1) as OnboardingStep;
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStepNum });
      // إعادة تعيين validation للخطوة الجديدة
      dispatch({ type: 'SET_SHOW_VALIDATION', payload: false });
      setLoadingWithMessage(false, '');
      return true;
    }
    
    setLoadingWithMessage(false, '');
    return false;
  }, [formData, session, validateCurrentStep, saveProgress, setLoadingWithMessage, getStepSuccessMessage]);

  // العودة للخطوة السابقة
  const prevStep = useCallback(() => {
    if (formData.currentStep > 1) {
      const prevStepNum = (formData.currentStep - 1) as OnboardingStep;
      dispatch({ type: 'SET_CURRENT_STEP', payload: prevStepNum });
    }
  }, [formData.currentStep]);

  // الانتقال لخطوة محددة
  const goToStep = useCallback((step: OnboardingStep) => {
    // التحقق من إمكانية الانتقال
    if (step <= formData.currentStep || formData.completedSteps.includes(step - 1 as OnboardingStep)) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: step });
    }
  }, [formData.currentStep, formData.completedSteps]);

  // إرسال الـ Onboarding الكامل
  const submitOnboarding = useCallback(async (): Promise<boolean> => {
    // منع تشغيل متعدد
    if (uiState.loading || uiState.saving) {
      logger.onboardingDebug('Submit blocked - already in progress');
      return false;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // التحقق من صحة البيانات قبل الإرسال
      const isValid = validateCurrentStep();
      logger.onboardingDebug('Submit validation result', { isValid, step: formData.currentStep });
      
      if (!isValid) {
        dispatch({ type: 'SET_SHOW_VALIDATION', payload: true });
        // إنشاء رسالة خطأ بسيطة بدلاً من استدعاء getStepErrors
        const basicErrors = [];
        if (formData.currentStep === 5) {
          if (!formData.availability.availability) basicErrors.push('نوع التوفر مطلوب');
          if (!formData.availability.weeklyHours) basicErrors.push('عدد الساعات الأسبوعية مطلوب');
          if (!(formData.availability.preferredWorkdays?.length > 0 || formData.availability.weeklyAvailability?.some(day => day.available))) {
            basicErrors.push('يجب اختيار يوم واحد على الأقل للعمل');
          }
        }
        throw new Error('يرجى إكمال جميع الحقول المطلوبة' + (basicErrors.length > 0 ? ': ' + basicErrors.join(', ') : ''));
      }

      logger.onboardingDebug('Submitting onboarding data', {
        step: formData.currentStep,
        hasAccount: !!formData.account.fullName,
        hasAvailability: !!formData.availability.availability
      });

      const response = await fetch('/api/creators/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          skipOptionalSteps: false
        })
      });
      
      const responseData = await response.json();
      logger.onboardingDebug('Submit response', { 
        ok: response.ok, 
        status: response.status,
        success: responseData.success,
        error: responseData.error 
      });
      
      if (response.ok && responseData.success) {
        dispatch({ type: 'SET_SUCCESS', payload: true });
        showSuccess('تم إرسال طلبك بنجاح! سيتم مراجعته خلال 24-48 ساعة.');
        
        // توجيه للصفحة التالية بعد النجاح
        setTimeout(() => {
          try {
            router.push('/creators?onboarding=completed');
          } catch (routerError) {
            logger.onboardingDebug('Router push error', { error: String(routerError) });
            // fallback لإعادة تحميل الصفحة
            window.location.href = '/creators?onboarding=completed';
          }
        }, 2000);
        
        return true;
      } else {
        throw new Error(responseData.error || 'فشل في إرسال النموذج');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      logger.onboardingDebug('Submit error', { error: errorMessage, originalError: error });
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [formData, router, uiState.loading, uiState.saving, validateCurrentStep]);

  // دالة لتحديث حالة التفاعل
  const setHasInteracted = useCallback(() => {
    if (!formData.hasInteracted) {
      dispatch({ type: 'SET_HAS_INTERACTED', payload: true });
    }
  }, [formData.hasInteracted]);

  // دوال التحديث لكل قسم
  const updateAccountData = useCallback((data: Partial<AccountCreationData>) => {
    setHasInteracted();
    dispatch({ type: 'UPDATE_ACCOUNT', payload: data });
  }, [setHasInteracted]);

  const updateBasicInfo = useCallback((data: Partial<BasicInfoData>) => {
    setHasInteracted();
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: data });
  }, [setHasInteracted]);

  const updateExperience = useCallback((data: Partial<ExperienceData>) => {
    setHasInteracted();
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: data });
  }, [setHasInteracted]);

  const updatePortfolio = useCallback((data: Partial<PortfolioData>) => {
    setHasInteracted();
    dispatch({ type: 'UPDATE_PORTFOLIO', payload: data });
  }, [setHasInteracted]);

  const updateAvailability = useCallback((data: Partial<AvailabilityData>) => {
    setHasInteracted();
    dispatch({ type: 'UPDATE_AVAILABILITY', payload: data });
  }, [setHasInteracted]);

  const updateEquipment = useCallback((data: Partial<EquipmentInventory>) => {
    setHasInteracted();
    dispatch({ type: 'UPDATE_EQUIPMENT', payload: data });
  }, [setHasInteracted]);

  // إعادة تعيين النموذج
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // الحصول على أخطاء خطوة محددة
  const getStepErrors = useCallback((step: OnboardingStep): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1:
        if (!formData.account.fullName.trim()) errors.push('الاسم الكامل مطلوب');
        if (!formData.account.email.trim()) errors.push('البريد الإلكتروني مطلوب');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email)) errors.push('البريد الإلكتروني غير صحيح');
        if (!formData.account.password) errors.push('كلمة المرور مطلوبة');
        if (formData.account.password.length < 8) errors.push('كلمة المرور قصيرة جداً');
        if (formData.account.password !== formData.account.confirmPassword) errors.push('كلمات المرور غير متطابقة');
        if (!formData.account.phone.trim()) errors.push('رقم الهاتف مطلوب');
        if (!formData.account.agreeToTerms) errors.push('يجب الموافقة على الشروط');
        break;
      
      case 2:
        if (!formData.basicInfo.role) errors.push('التخصص مطلوب');
        if (!formData.basicInfo.city.trim()) errors.push('المدينة مطلوبة');
        if (formData.basicInfo.primaryCategories.length === 0) errors.push('يجب اختيار مجال واحد على الأقل');
        break;
      
      case 3:
        if (!formData.experience.experienceLevel) errors.push('مستوى الخبرة مطلوب');
        if (!formData.experience.experienceYears) errors.push('سنوات الخبرة مطلوبة');
        // المهارات اختيارية - يمكن إضافتها لاحقاً
        break;
      
      case 4:
        // Portfolio خطوة اختيارية - يمكن تخطيها
        // لا توجد حقول إلزامية في هذه الخطوة
        break;
      
      case 5:
        if (!formData.availability.availability) errors.push('نوع التوفر مطلوب');
        if (formData.availability.weeklyHours <= 0) errors.push('عدد الساعات الأسبوعية مطلوب');
        
        // التحقق من التوفر الأسبوعي أو الأيام المفضلة
        const hasWeeklyAvailability = formData.availability.weeklyAvailability && 
          formData.availability.weeklyAvailability.some(day => day.available);
        const hasPreferredWorkdays = formData.availability.preferredWorkdays.length > 0;
        
        if (!hasWeeklyAvailability && !hasPreferredWorkdays) {
          errors.push('يجب اختيار يوم واحد على الأقل للعمل');
        }
        break;
    }
    
    return errors;
  }, [formData]);

  // تحميل البيانات المحفوظة عند البدء
  useEffect(() => {
    if (session?.user?.email) {
      loadSavedProgress();
    }
  }, [session?.user?.email, loadSavedProgress]);

  // Auto-save كل 30 ثانية
  useEffect(() => {
    if (!uiState.autoSaveEnabled || uiState.loading) return;
    
    const autoSaveInterval = setInterval(() => {
      if (!uiState.saving && formData.currentStep > 1) {
        saveProgress();
      }
    }, 30000); // 30 ثانية
    
    return () => clearInterval(autoSaveInterval);
  }, [uiState.autoSaveEnabled, uiState.loading, uiState.saving, formData.currentStep, saveProgress]);

  // تحديث canProceed عند تغيير البيانات
  useEffect(() => {
    const canProceed = validateCurrentStep();
    dispatch({ type: 'SET_CAN_PROCEED', payload: canProceed });
  }, [formData.account, formData.basicInfo, formData.experience, formData.portfolio, formData.availability, formData.currentStep, validateCurrentStep]);

  // دالة لتحديد إذا كان الحقل تم لمسه
  const markFieldTouched = useCallback((field: string) => {
    dispatch({ type: 'MARK_FIELD_TOUCHED', payload: field });
  }, []);

  // دالة للحصول على خطأ حقل محدد (بس إذا تم لمسه أو حاول الانتقال)
  const getFieldError = useCallback((field: string): string | undefined => {
    // لا تظهر الأخطاء إلا إذا حاول المستخدم الانتقال أو لمس الحقل
    if (!uiState.showValidation && !uiState.touchedFields.has(field)) {
      return undefined;
    }
    
    const stepErrors = getStepErrors(formData.currentStep);
    return stepErrors.find(error => error.includes(field)) || undefined;
  }, [uiState.touchedFields, uiState.showValidation, getStepErrors, formData.currentStep]);

  // قيم الـ Context
  const contextValue: OnboardingContextType = {
    formData,
    state: uiState,
    
    // Actions
    updateAccountData,
    updateBasicInfo,
    updateExperience,
    updatePortfolio,
    updateAvailability,
    updateEquipment,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    
    // Data management
    saveProgress,
    submitOnboarding,
    resetForm,
    
    // Validation
    validateCurrentStep,
    getStepErrors,
    getFieldError,
    markFieldTouched,
    
    // UI helpers
    setLoadingWithMessage
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook للحصول على معلومات التقدم
export function useOnboardingProgress(): OnboardingProgress {
  const { formData } = useOnboarding();
  
  const totalSteps = 5;
  const completionPercentage = (formData.completedSteps.length / totalSteps) * 100;
  
  // تقدير الوقت المتبقي (بالدقائق)
  const stepTimes = [5, 3, 4, 6, 3]; // وقت تقديري لكل خطوة
  const estimatedTimeRemaining = stepTimes.slice(formData.currentStep - 1).reduce((a, b) => a + b, 0);
  
  return {
    currentStep: formData.currentStep,
    completedSteps: formData.completedSteps,
    completionPercentage,
    estimatedTimeRemaining,
    canSkipToEnd: formData.completedSteps.length >= 3, // يمكن تخطي الخطوات الاختيارية
    lastSavedAt: formData.metadata.lastSavedAt
  };
}
