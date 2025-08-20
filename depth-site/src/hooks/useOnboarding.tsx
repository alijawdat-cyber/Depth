// Hook مخصص لإدارة حالة الـ Onboarding
'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { enqueueSuccess, enqueueError } from '@/lib/toast-coalescer';
import { telemetry } from '@/lib/telemetry/client';
import type { OnboardingFormData, OnboardingContextType, OnboardingStep, AccountCreationData, BasicInfoData, ExperienceData, PortfolioData, AvailabilityData, OnboardingProgress } from '@/types/onboarding';
import type { EquipmentInventory } from '@/types/creators';
import { initialFormData, initialState, LOCAL_STORAGE_LEGACY_KEY as LEGACY_KEY, LOCAL_STORAGE_KEY as NEW_KEY } from './onboarding/constants';
import { onboardingReducer } from './onboarding/reducer';
import { validateStructured, ValidationResult } from './onboarding/validation';
// Feature flags removed: behavior now default. TODO: remove outputLevel fallback once legacy data migrated.

// Phase 3: Serial Remote Save Queue refs & helpers (يُستخدم فقط عندما تكون الأعلام مفعّلة)
// استخدام كائن بسيط بدلاً من useRef هنا لأننا في أعلى الملف خارج المكوّن.
// نسمح بأنواع مختلفة داخل السلسلة (نتجاهل النتيجة ونكتفي بالتسلسل)
const saveChainRefGlobal: { current: Promise<unknown> } = { current: Promise.resolve() };
async function backoff<T>(fn: () => Promise<T>, retries = 2, baseMs = 400): Promise<T> {
  let attempt = 0;
  while (true) {
    try { return await fn(); }
    catch (e) {
      if (attempt >= retries) throw e;
      await new Promise(r => setTimeout(r, baseMs * (2 ** attempt)));
      attempt++;
      // Track retry attempts
      telemetry.saveRetry(attempt);
    }
  }
}

// Phase 4: Validation V2 is handled by validateStructured (imported). Legacy inline implementation removed.
function toastSuccess(message: string): void { enqueueSuccess(message); }
function toastError(message: string): void { enqueueError(message); }


// Phase 2 constants & helpers (Debounce + Hash local save) imported
function djb2Hash(s: string) { let h = 5381; for (let i=0;i<s.length;i++) h = ((h<<5)+h) ^ s.charCodeAt(i); return h>>>0; }
function sanitizeForLocal(data: OnboardingFormData) {
  return {
    currentStep: data.currentStep,
    completedSteps: data.completedSteps,
    account: { fullName: data.account.fullName, email: data.account.email, phone: data.account.phone, agreeToTerms: data.account.agreeToTerms },
    basicInfo: data.basicInfo,
    experience: data.experience,
    portfolio: data.portfolio,
    availability: data.availability,
    equipment: data.equipment,
    metadata: { startedAt: data.metadata.startedAt, source: data.metadata.source },
    snapshotSchemaVersion: 1
  };
}

// initial state imported

// (Inline duplicate reducer removed – using imported onboardingReducer)

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

  // مفاتيح التخزين المحلي (مستوردة من constants)
  const LOCAL_STORAGE_KEY = LEGACY_KEY;
  const LOCAL_STORAGE_NEW_KEY = NEW_KEY;
  // removed unused localPersistedOnceRef
  const sessionPersistRef = useRef(false); // للتأكد أننا حفظنا في الخادم بعد توفر الجلسة مرة واحدة مبكرًا
  const hasLoadedRef = useRef(false); // منع تحميل البيانات المحفوظة أكثر من مرة
  // Phase 2 refs
  // removed legacy debounce timer ref (no longer used)
  const localHashRef = useRef<number>(0);
  const lastAutoHashRef = useRef<string>('');
  // Phase 1 storage migration refs
  const loadedFromRef = useRef<'new'|'old'|'none'>('none');
  // removed oldKeyDeletedRef & firstSuccessfulNewWriteRef (migration complete)

  // Helper: set loading with message
  const setLoadingWithMessage = useCallback((loading: boolean, msg?: string) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
    dispatch({ type: 'SET_LOADING_MESSAGE', payload: msg || '' });
  }, []);

  // Helper: step success message
  const getStepSuccessMessage = useCallback((step: number) => {
    switch (step) {
      case 1: return 'تم حفظ بيانات الحساب ✅';
      case 2: return 'تم حفظ المعلومات الأساسية ✅';
      case 3: return 'تم حفظ الخبرة ✅';
      case 4: return 'تم حفظ الملف ✅';
      case 5: return 'تم حفظ التوفر ✅';
      default: return 'تم الحفظ ✅';
    }
  }, []);

  // Local snapshot flush
  const flushLocalSave = useCallback((data?: OnboardingFormData) => {
    try {
      if (typeof window === 'undefined') return;
      const target = data || formData;
      if (target.currentStep <= 1) return;
      const sanitized = sanitizeForLocal(target);
      const serialized = JSON.stringify(sanitized);
      const hash = djb2Hash(serialized);
      if (hash === localHashRef.current) return;
      window.localStorage.setItem(LOCAL_STORAGE_NEW_KEY, serialized);
      localHashRef.current = hash;
      lastAutoHashRef.current = Date.now().toString();
    } catch {/* ignore */}
  }, [formData, LOCAL_STORAGE_NEW_KEY]);

  // Remote load
  const loadSavedProgress = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch('/api/creators/onboarding/progress');
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data?.data) {
        const data = json.data.data as Partial<OnboardingFormData>;
        const mergedStep = Math.max(formData.currentStep, data.currentStep || 1) as OnboardingStep;
        const mergedCompleted = Array.from(new Set([...(formData.completedSteps||[]), ...(data.completedSteps||[])])).sort();
        dispatch({ type: 'LOAD_SAVED_DATA', payload: { ...data, currentStep: mergedStep, completedSteps: mergedCompleted } });
        if (mergedStep !== formData.currentStep) dispatch({ type: 'SET_CURRENT_STEP', payload: mergedStep });
      }
    } catch (e) {
      logger.onboardingDebug('Remote load progress failed', { error: String(e) });
    }
  }, [session?.user?.email, formData.currentStep, formData.completedSteps]);

  // تحميل التقدم من localStorage (عرض فقط، بدون تنقل)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      {
        // Phase 1: قراءة البيانات المحفوظة للعرض فقط
        const rawNew = window.localStorage.getItem(LOCAL_STORAGE_NEW_KEY);
        if (rawNew) {
          loadedFromRef.current = 'new';
          logger.onboardingDebug('Local restore snapshot (new key)', { key: LOCAL_STORAGE_NEW_KEY });
          const parsed = JSON.parse(rawNew);
          if (parsed && typeof parsed === 'object') {
            // حفظ البيانات فقط بدون تغيير الخطوة الحالية
            if (parsed.currentStep > 1) {
              const mergedCompleted = Array.from(new Set([
                ...formData.completedSteps,
                ...(Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [])
              ])).sort();
              // تحديث البيانات فقط، الخطوة تبقى كما هي
              dispatch({ type: 'LOAD_SAVED_DATA', payload: { ...parsed, currentStep: formData.currentStep, completedSteps: mergedCompleted }});
            }
          }
        } else {
          // fallback legacy once
            const rawLegacy = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (rawLegacy) {
              loadedFromRef.current = 'old';
              logger.onboardingDebug('Local restore snapshot (legacy key)', { key: LOCAL_STORAGE_KEY });
              const parsed = JSON.parse(rawLegacy);
              if (parsed && typeof parsed === 'object') {
                // حفظ البيانات فقط بدون تغيير الخطوة الحالية
                if (parsed.currentStep > 1) {
                  const mergedCompleted = Array.from(new Set([
                    ...formData.completedSteps,
                    ...(Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [])
                  ])).sort();
                  // تحديث البيانات فقط، الخطوة تبقى كما هي
                  dispatch({ type: 'LOAD_SAVED_DATA', payload: { ...parsed, currentStep: formData.currentStep, completedSteps: mergedCompleted }});
                }
              }
            } else {
              loadedFromRef.current = 'none';
            }
        }
        if (loadedFromRef.current !== 'none') { logger.onboardingDebug('Local load source', { source: loadedFromRef.current }); }
      }
    } catch (e) {
      // ignore parsing errors
      console.warn('[onboarding] local restore error', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed legacy persistLocalProgress (migration complete, only flushLocalSave used)

  // Phase 2 schedule & flush (guarded by flag)

  // حفظ التقدم تلقائياً
  const saveProgress = useCallback(async (): Promise<boolean> => {
    // للمستخدمين الجدد في الخطوة الأولى، لا نحفظ التقدم حتى يتم إنشاء الحساب
    if (formData.currentStep === 1 && !session?.user?.email) {
      return true; // لا نحفظ في الخطوة الأولى للمستخدمين الجدد
    }
    
    if (!session?.user?.email || !uiState.autoSaveEnabled) return true;
    
    dispatch({ type: 'SET_SAVING', payload: true });
    
    try {
      // Sanitization للبيانات الحساسة عند الحفظ (Phase 1)
      const safeFormData = {
        ...formData,
        account: { ...formData.account, password: '', confirmPassword: '' }
      };

      const response = await fetch('/api/creators/onboarding/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: formData.currentStep,
          data: safeFormData,
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

  // Phase 3: غلاف تسلسلي لاستدعاء الحفظ البعيد
  const callRemoteSave = useCallback(() => {
    saveChainRefGlobal.current = saveChainRefGlobal.current
      .then(() => backoff(() => saveProgress()).then(() => undefined))
      .catch(err => console.error('[onboarding] save failed (queued)', err));
    return saveChainRefGlobal.current;
  }, [saveProgress]);

  // حفظ في الخادم بمجرد توفر الجلسة لأول مرة (بعد تعريف saveProgress)
  useEffect(() => {
    if (session?.user?.email && formData.currentStep > 1 && !sessionPersistRef.current) {
      // حفظ تلقائي عند توفر الجلسة
      callRemoteSave();
      sessionPersistRef.current = true;
    }
  }, [session?.user?.email, formData.currentStep, callRemoteSave]);

  // التحقق من صحة الخطوة الحالية
  const validateCurrentStep = useCallback((): boolean => {
    const step = formData.currentStep;
    
    // فحص أمان لبيانات النموذج
    if (!formData || !formData.account || !formData.basicInfo || !formData.experience || !formData.availability) {
      return false;
    }
    
    switch (step) {
      case 1: // Account Creation
        const isValidEmail = formData.account.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email);
        const isValidPhone = formData.account.phone?.trim();
        const isValidName = formData.account.fullName?.trim();
        // If already signed in, don't force password validation again
        if (session?.user) {
          return !!(isValidName && isValidEmail && isValidPhone && formData.account.agreeToTerms);
        }
        const isValidPassword = formData.account.password && formData.account.password.length >= 8;
        const passwordsMatch = formData.account.password === formData.account.confirmPassword;
        logger.onboardingDebug('Step 1 validation', {
          isValidName,
          isValidEmail,
          isValidPassword,
          passwordsMatch,
          isValidPhone,
          agreeToTerms: formData.account.agreeToTerms,
          sessionPresent: !!session?.user
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
          formData.basicInfo.city?.trim() &&
          formData.basicInfo.primaryCategories && formData.basicInfo.primaryCategories.length > 0
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
          formData.availability.weeklyHours && formData.availability.weeklyHours > 0
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
  }, [formData, session?.user]);

  // Phase 4: واجهات Validation V2 الآمنة
  const getStepValidationResult = useCallback((): ValidationResult => validateStructured(formData.currentStep, formData), [formData]);
  const canProceedSafe = useCallback(() => getStepValidationResult().isValid, [getStepValidationResult]);

  // الانتقال للخطوة التالية
  const nextStep = useCallback(async (): Promise<boolean> => {
    logger.onboardingDebug(`Starting step transition from ${formData.currentStep}`);
    logger.onboardingDebug(`Current session: ${session?.user ? 'logged in' : 'not logged in'}`);
    logger.onboardingDebug(`Form data validation: ${canProceedSafe()}`);
    
    // تفعيل عرض الأخطاء عند محاولة الانتقال
    dispatch({ type: 'SET_SHOW_VALIDATION', payload: true });
    
    if (!canProceedSafe()) {
      logger.onboardingDebug(`Validation failed for step ${formData.currentStep}`);
      dispatch({ type: 'SET_ERROR', payload: 'يرجى إكمال جميع الحقول المطلوبة' });
      return false;
    }
    
    // للخطوة الأولى: إنشاء الحساب (انتقال فوري سلس بدون انتظار زائف)
    if (formData.currentStep === 1 && !session?.user) {
      setLoadingWithMessage(true, 'جاري إنشاء حسابك...');
      dispatch({ type: 'SET_ERROR', payload: null });

      const silentSignInWithRetry = async (maxAttempts = 3): Promise<boolean> => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const result = await signIn('credentials', {
              email: formData.account.email.toLowerCase().trim(),
              password: formData.account.password,
              redirect: false
            });
            logger.onboardingDebug('Silent sign-in attempt', { attempt, ok: result?.ok, error: result?.error });
            if (result?.ok && !result?.error) return true;
          } catch (e) {
            logger.onboardingDebug('Silent sign-in exception', { attempt, error: String(e) });
          }
          // Backoff متزايد: 200ms ثم 500ms
          if (attempt < maxAttempts) await new Promise(r => setTimeout(r, attempt === 1 ? 200 : 500));
        }
        return false;
      };

      try {
        const response = await fetch('/api/creators/onboarding/create-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.account)
        });

        if (response.status === 409) {
          logger.onboardingDebug('Email exists: attempting immediate silent sign-in');
          const signedIn = await silentSignInWithRetry();
          if (signedIn) {
            toastSuccess('تم التحقق من الحساب ✅');
            dispatch({ type: 'COMPLETE_STEP', payload: 1 });
            dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
            dispatch({ type: 'SET_SHOW_VALIDATION', payload: false });
            setLoadingWithMessage(false, '');
            return true;
          }
          const errData = await response.json().catch(() => ({}));
          dispatch({ type: 'SET_ERROR', payload: errData.error || 'البريد مستخدم مسبقاً، سجّل دخولك يدويًا' });
          setLoadingWithMessage(false, '');
          return false;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'فشل في إنشاء الحساب');
        }

        const result = await response.json();
        logger.onboardingDebug('Account created successfully', { userId: result?.data?.userId });
        
        // انتقال فوري بدون انتظار تسجيل الدخول لتجنب الفلاش
        dispatch({ type: 'COMPLETE_STEP', payload: 1 });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
        dispatch({ type: 'SET_SHOW_VALIDATION', payload: false });

        // Phase 1: تصفير كلمات المرور في الذاكرة بعد نجاح الإنشاء (لوضع أمني أفضل)
        dispatch({ type: 'UPDATE_ACCOUNT', payload: { password: '', confirmPassword: '' } });
        
        // حفظ محلي تفاؤلي فوري
        const sanitizedForLocal = { ...formData, account: { ...formData.account, password: '', confirmPassword: '' }, currentStep: 2, completedSteps: [...formData.completedSteps, 1] };
        flushLocalSave(sanitizedForLocal as OnboardingFormData);
        setLoadingWithMessage(false, '');
        toastSuccess('تم إنشاء الحساب بنجاح ✅');

        // تشغيل تسجيل الدخول بصمت في الخلفية بدون تأثير على التنقل
        silentSignInWithRetry().then(ok => {
          if (!ok) {
            toastError('تم إنشاء الحساب، أعد تسجيل الدخول لاحقًا لضمان الحفظ السحابي');
          } else {
            logger.onboardingDebug('Silent sign-in completed post-transition');
          }
        });
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
      setLoadingWithMessage(true, 'حفظ سريع...');
      const saved = await saveProgress();
      if (!saved) { 
        setLoadingWithMessage(false, ''); 
        return false; 
      }
      toastSuccess(getStepSuccessMessage(formData.currentStep));
    }
    
    // تسجيل إكمال الخطوة
    dispatch({ type: 'COMPLETE_STEP', payload: formData.currentStep });
    
    // الانتقال للخطوة التالية
    if (formData.currentStep < 5) {
      flushLocalSave(formData);
      const nextStepNum = (formData.currentStep + 1) as OnboardingStep;
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStepNum });
      // إعادة تعيين validation للخطوة الجديدة
      dispatch({ type: 'SET_SHOW_VALIDATION', payload: false });
      setLoadingWithMessage(false, '');
      
      return true;
    }
    
    setLoadingWithMessage(false, '');
    return false;
  }, [formData, session, saveProgress, setLoadingWithMessage, getStepSuccessMessage, flushLocalSave, canProceedSafe]);

  // العودة للخطوة السابقة
  const prevStep = useCallback(() => {
    if (formData.currentStep > 1) {
      flushLocalSave(formData);
      const prevStepNum = (formData.currentStep - 1) as OnboardingStep;
      dispatch({ type: 'SET_CURRENT_STEP', payload: prevStepNum });
    }
  }, [formData, flushLocalSave]);

  // الانتقال لخطوة محددة
  const goToStep = useCallback((step: OnboardingStep) => {
    // التحقق من إمكانية الانتقال
    if (step <= formData.currentStep || formData.completedSteps.includes(step - 1 as OnboardingStep)) {
      flushLocalSave(formData);
      dispatch({ type: 'SET_CURRENT_STEP', payload: step });
    }
  }, [formData, flushLocalSave]);

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
        toastSuccess('تم إرسال طلبك بنجاح ووضعه قيد المراجعة ✅');
        
        // Phase 7: تتبع نجاح الإرسال
        telemetry.submitSuccess();        // توجيه للصفحة التالية بعد النجاح
        setTimeout(() => {
          try {
            router.push('/creators/projects');
          } catch (routerError) {
            logger.onboardingDebug('Router push error', { error: String(routerError) });
            // fallback لإعادة تحميل الصفحة
            window.location.href = '/creators/projects';
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
      toastError(errorMessage);
      
      // Phase 7: تتبع فشل الإرسال  
      telemetry.submitFail(errorMessage);
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
    // Phase 2: اشتقاق weeklyHours ومنع كتابة preferredWorkdays تحت العلم الموحد
  const payload: Partial<AvailabilityData> = { ...data };
    if (payload.weeklyAvailability) {
      const hrs = payload.weeklyAvailability
        .filter(d => d.available && d.startTime && d.endTime)
        .reduce((sum, d) => {
          const start = Date.parse(`2000-01-01T${d.startTime}`);
          const end = Date.parse(`2000-01-01T${d.endTime}`);
          if (isNaN(start) || isNaN(end) || end <= start) return sum;
          return sum + (end - start) / (1000 * 60 * 60);
        }, 0);
      payload.weeklyHours = parseFloat(hrs.toFixed(1));
    }
    dispatch({ type: 'UPDATE_AVAILABILITY', payload });
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
    
    // فحص أمان لبيانات النموذج
    if (!formData || !formData.account || !formData.basicInfo || !formData.experience || !formData.availability) {
      return ['بيانات النموذج غير مكتملة'];
    }
    
    switch (step) {
      case 1:
        if (!formData.account.fullName?.trim()) errors.push('الاسم الكامل مطلوب');
        if (!formData.account.email?.trim()) errors.push('البريد الإلكتروني مطلوب');
        if (formData.account.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email)) errors.push('البريد الإلكتروني غير صحيح');
        if (!formData.account.password) errors.push('كلمة المرور مطلوبة');
        if (formData.account.password && formData.account.password.length < 8) errors.push('كلمة المرور قصيرة جداً');
        if (formData.account.password !== formData.account.confirmPassword) errors.push('كلمات المرور غير متطابقة');
        if (!formData.account.phone?.trim()) errors.push('رقم الهاتف مطلوب');
        if (!formData.account.agreeToTerms) errors.push('يجب الموافقة على الشروط');
        break;
      
      case 2:
        if (!formData.basicInfo.role) errors.push('التخصص مطلوب');
        if (!formData.basicInfo.city?.trim()) errors.push('المدينة مطلوبة');
        if (!formData.basicInfo.primaryCategories || formData.basicInfo.primaryCategories.length === 0) errors.push('يجب اختيار مجال واحد على الأقل');
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
        if (!formData.availability.weeklyHours || formData.availability.weeklyHours <= 0) errors.push('عدد الساعات الأسبوعية مطلوب');
        
        // التحقق من التوفر الأسبوعي أو الأيام المفضلة
        const hasWeeklyAvailability = formData.availability.weeklyAvailability && 
          formData.availability.weeklyAvailability.some(day => day.available);
        const hasPreferredWorkdays = formData.availability.preferredWorkdays && formData.availability.preferredWorkdays.length > 0;
        
        if (!hasWeeklyAvailability && !hasPreferredWorkdays) {
          errors.push('يجب اختيار يوم واحد على الأقل للعمل');
        }
        break;
    }
    
    return errors;
  }, [formData]);

  // تحميل البيانات المحفوظة عند البدء (مرة واحدة فقط عند تسجيل الدخول)
  useEffect(() => {
    if (session?.user?.email && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadSavedProgress();
    }
  }, [session?.user?.email, loadSavedProgress]);

  // Phase 2: Debounced auto-save (600-800ms)
  const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedAutoSave = useCallback(() => {
    // Clear previous timer
    if (debouncedSaveRef.current) {
      clearTimeout(debouncedSaveRef.current);
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    debouncedSaveRef.current = setTimeout(() => {
      if (!uiState.saving && formData.currentStep > 1 && session?.user?.email) {
        abortControllerRef.current = new AbortController();
        callRemoteSave();
      }
    }, 700); // 700ms debounce
  }, [formData.currentStep, session?.user?.email, uiState.saving, callRemoteSave]);

  // Auto-save every 30 seconds (reduced from previous implementation)
  useEffect(() => {
    if (!uiState.autoSaveEnabled || uiState.loading) return;
    const id = setInterval(() => debouncedAutoSave(), 30000);
    return () => clearInterval(id);
  }, [uiState.autoSaveEnabled, uiState.loading, debouncedAutoSave]);

  // Phase 3: beforeunload محاولة تفريغ آخر عملية (best-effort)
  useEffect(() => {
    const handler = () => { /* best-effort */ };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Phase 2: flush on beforeunload / unmount
  useEffect(() => {
    const handler = () => flushLocalSave();
    window.addEventListener('beforeunload', handler);
    return () => { flushLocalSave(); window.removeEventListener('beforeunload', handler); };
  }, [flushLocalSave]);

  // تحديث canProceed عند تغيير البيانات
  useEffect(() => { dispatch({ type: 'SET_CAN_PROCEED', payload: canProceedSafe() }); }, [formData, canProceedSafe]);

  // دالة لتحديد إذا كان الحقل تم لمسه
  const markFieldTouched = useCallback((field: string) => {
    dispatch({ type: 'MARK_FIELD_TOUCHED', payload: field });
  }, []);

  // دالة للحصول على قيمة حقل محدد
  const getFieldValue = useCallback((field: string): string | boolean | string[] => {
    const parts = field.split('.');
    if (parts[0] === 'account') {
      return formData.account[parts[1] as keyof typeof formData.account] || '';
    } else if (parts[0] === 'basicInfo') {
      return formData.basicInfo[parts[1] as keyof typeof formData.basicInfo] || '';
    }
    return '';
  }, [formData]);

  // دالة للحصول على خطأ حقل محدد (بس إذا تم لمسه أو حاول الانتقال)
  const getFieldError = useCallback((field: string): string | undefined => {
    // لا تظهر الأخطاء إلا إذا حاول المستخدم الانتقال أو لمس الحقل
    if (!uiState.showValidation && !uiState.touchedFields.has(field)) {
      return undefined;
    }
    
    // لا تظهر خطأ إذا الحقل فارغ ولم يتم المس فعلياً
    const fieldValue = getFieldValue(field);
    const isEmpty = typeof fieldValue === 'string' ? !fieldValue.trim() : 
                   typeof fieldValue === 'boolean' ? false :
                   Array.isArray(fieldValue) ? fieldValue.length === 0 : false;
    
    if (isEmpty && !uiState.touchedFields.has(field) && !uiState.showValidation) {
      return undefined;
    }
    
    const stepErrors = getStepErrors(formData.currentStep);
    return stepErrors.find(error => error.includes(field)) || undefined;
  }, [uiState.touchedFields, uiState.showValidation, getStepErrors, formData.currentStep, getFieldValue]);

  // تعريف getFieldErrorV2 بعد getFieldError لتفادي استخدام قبل التعريف
  const getFieldErrorV2 = useCallback((fieldPath: string): string | undefined => {
    // نفس المنطق: لا تظهر أخطاء إذا لم يتم المس وما أكو validation صريح
    if (!uiState.showValidation && !uiState.touchedFields.has(fieldPath)) {
      return undefined;
    }
    
    const vr = getStepValidationResult();
    const e = vr.errors.find(er => er.field === fieldPath);
    
    // تحقق إضافي: لا تظهر خطأ إذا الحقل فارغ ولم يتم المس
    if (e) {
      const fieldValue = getFieldValue(fieldPath);
      const isEmpty = typeof fieldValue === 'string' ? !fieldValue.trim() : 
                     typeof fieldValue === 'boolean' ? false :
                     Array.isArray(fieldValue) ? fieldValue.length === 0 : false;
      
      if (isEmpty && !uiState.touchedFields.has(fieldPath) && !uiState.showValidation) {
        return undefined;
      }
    }
    
    return e?.message;
  }, [getStepValidationResult, uiState.showValidation, uiState.touchedFields, getFieldValue]);

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
  saveProgress, // إبقاء الأصل للتوافق
    submitOnboarding,
    resetForm,
    
    // Validation
    validateCurrentStep,
    getStepErrors,
  getFieldError,
  getFieldErrorV2,
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
