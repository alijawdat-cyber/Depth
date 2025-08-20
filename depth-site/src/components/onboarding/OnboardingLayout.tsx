// Layout احترافي للـ Onboarding مع تصميم عصري ومتجاوب
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useOnboarding, useOnboardingProgress } from '@/hooks/useOnboarding';
import { useConnectivity } from '@/hooks/useConnectivity';
import { telemetry } from '@/lib/telemetry/client';
import OfflineBar from './OfflineBar';
import { 
  CheckCircle, 
  Clock, 
  Save, 
  ArrowLeft, 
  ArrowRight,
  User,
  Briefcase,
  Award,
  FileText,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showProgress?: boolean;
}

// تكوين الخطوات
const STEPS_CONFIG = [
  { 
    id: 1, 
    title: 'إنشاء الحساب', 
    subtitle: 'المعلومات الأساسية والمصادقة',
    icon: User,
    color: 'blue',
    estimatedTime: 5
  },
  { 
    id: 2, 
    title: 'المعلومات الأساسية', 
    subtitle: 'التخصص والموقع والمجالات',
    icon: Briefcase,
    color: 'green',
    estimatedTime: 3
  },
  { 
    id: 3, 
    title: 'الخبرة والمهارات', 
    subtitle: 'مستوى الخبرة والتخصصات',
    icon: Award,
    color: 'orange',
    estimatedTime: 4
  },
  { 
    id: 4, 
    title: 'معرض الأعمال', 
    subtitle: 'عينات الأعمال والحسابات الاجتماعية',
    icon: FileText,
    color: 'purple',
    estimatedTime: 6
  },
  { 
    id: 5, 
    title: 'التوفر والجدولة', 
    subtitle: 'أوقات العمل والتوفر',
    icon: Calendar,
    color: 'pink',
    estimatedTime: 3
  }
];

export default function OnboardingLayout({ 
  children, 
  showNavigation = true, 
  showProgress = true 
}: OnboardingLayoutProps) {
  const { 
    formData, 
    state, 
    nextStep, 
    prevStep, 
    goToStep,
    submitOnboarding,
  getStepErrors,
  setLoadingWithMessage
  } = useOnboarding();
  
  const progress = useOnboardingProgress();
  const currentStepConfig = STEPS_CONFIG.find(s => s.id === formData.currentStep);
  const errors = getStepErrors(formData.currentStep);

  // Phase 7: تتبع عرض الخطوة
  useEffect(() => {
    telemetry.stepView(formData.currentStep);
  }, [formData.currentStep]);

  // Phase 5: اتصال الإنترنت - دائم التفعيل
  const { isOnline, addReconnectCallback } = useConnectivity();
  const [retryStatus, setRetryStatus] = useState<'idle' | 'retrying' | 'success' | 'failed'>('idle');

  // حارس: في حال بقي loading عالق بعد الانتقال للخطوة التالية يتم تصفيره
  useEffect(() => {
    // حارس أمان: إذا بقيت حالة التحميل فعّالة أكثر من 4 ثوان بدون saving نقوم بإيقافها
    if (state.loading && !state.saving) {
      const timeout = setTimeout(() => {
        if (state.loading && !state.saving) {
          setLoadingWithMessage(false, '');
        }
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [state.loading, state.saving, setLoadingWithMessage]);

  // معالج إعادة المحاولة عند عودة الاتصال - دائم التفعيل
  const handleRetryConnection = () => {
    setRetryStatus('retrying');
    // Track manual retry attempt
    telemetry.saveRetry(1);
    
    // محاولة إعادة الاتصال
    const timeoutId = setTimeout(() => {
      if (navigator.onLine) {
        setRetryStatus('success');
        // إخفاء رسالة النجاح بعد ثانيتين
        setTimeout(() => setRetryStatus('idle'), 2000);
      } else {
        setRetryStatus('failed');
        // إعادة تعيين بعد 3 ثوان
        setTimeout(() => setRetryStatus('idle'), 3000);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  };

  // إضافة callback لإعادة المحاولة عند عودة الاتصال - دائم التفعيل
  useEffect(() => {
    const retryCallback = () => {
      setRetryStatus('retrying');
      // Track retry attempt
      telemetry.saveRetry(1);
      
      // محاولة إعادة الاتصال
      const timeoutId = setTimeout(() => {
        if (navigator.onLine) {
          setRetryStatus('success');
          // إخفاء رسالة النجاح بعد ثانيتين
          setTimeout(() => setRetryStatus('idle'), 2000);
        } else {
          setRetryStatus('failed');
          // إعادة تعيين بعد 3 ثوان
          setTimeout(() => setRetryStatus('idle'), 3000);
        }
      }, 1500);

      return () => clearTimeout(timeoutId);
    };
    
    addReconnectCallback(retryCallback);
  }, [addReconnectCallback]);

  const handleNext = async () => {
    if (formData.currentStep === 5) {
      // الخطوة الأخيرة - إرسال النموذج
      await submitOnboarding();
    } else {
      await nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* خلفية بسيطة ونظيفة */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--accent-500)] rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[var(--accent-300)] rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Phase 5: شريط الاتصال المفقود - دائم التفعيل */}
        <OfflineBar 
          isOffline={!isOnline}
          hasUnsavedChanges={state.saving}
          onRetryConnection={handleRetryConnection}
          retryStatus={retryStatus}
        />

        {/* Header */}
        <header className="bg-[var(--card)]/80 backdrop-blur-sm border-b border-[var(--border)] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-10 h-10 bg-[var(--accent-500)] rounded-xl flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">D</span>
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-[var(--text)]">انضمام المبدعين</h1>
                  <p className="text-sm text-[var(--muted)]">
                    {currentStepConfig?.title} • الخطوة {formData.currentStep} من 5
                  </p>
                </div>
              </div>

              {/* Progress Info */}
              <div className="flex items-center gap-2 md:gap-4">
                {state.saving && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-[var(--accent-600)] bg-[var(--accent-50)] px-3 py-1 rounded-full"
                  >
                    <Save size={14} className="animate-pulse" />
                    <span className="text-sm">جاري الحفظ...</span>
                  </motion.div>
                )}
                
                <div className="flex items-center gap-2 text-[var(--muted)]">
                  <Clock size={16} />
                  <span className="text-sm">
                    ~{progress.estimatedTimeRemaining} دقائق متبقية
                  </span>
                </div>
                
                <div className="text-sm font-medium text-[var(--accent-600)]">
                  {Math.round(progress.completionPercentage)}% مكتمل
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        {showProgress && (
          <div className="bg-[var(--card)]/50 backdrop-blur-sm border-b border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-4 py-4">
              {/* Progress Steps - Desktop */}
              <div className="hidden md:block">
                <div className="flex items-center justify-between mb-4">
                  {STEPS_CONFIG.map((step) => {
                    const isCompleted = progress.completedSteps.includes(step.id as 1 | 2 | 3 | 4 | 5);
                    const isCurrent = formData.currentStep === step.id;
                    const isAccessible = step.id <= formData.currentStep || isCompleted;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: step.id * 0.05, duration: 0.3 }}
                        className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
                          isAccessible ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => isAccessible && formData.currentStep !== step.id && goToStep(step.id as 1 | 2 | 3 | 4 | 5)}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent
                            ? `bg-[var(--accent-500)] border-[var(--accent-500)] text-white shadow-lg shadow-[var(--accent-500)]/25`
                            : 'border-[var(--border)] text-[var(--muted)] bg-[var(--bg)]'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle size={20} />
                          ) : (
                            <step.icon size={20} />
                          )}
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            isCurrent ? 'text-[var(--accent-600)]' : 'text-[var(--text)]'
                          }`}>
                            {step.title}
                          </div>
                          <div className="text-xs text-[var(--muted)]">
                            ~{step.estimatedTime} دقائق
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--border)] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--accent-500)] rounded-full"
                  initial={false}
                  animate={{ width: `${progress.completionPercentage}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              {/* Mobile Progress */}
              <div className="md:hidden mt-3">
                <div className="text-center mb-3">
                  <div className="text-sm text-[var(--text)] font-medium">
                    {currentStepConfig?.title}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    الخطوة {formData.currentStep} من 5 • {Math.round(progress.completionPercentage)}% مكتمل
                  </div>
                </div>
                
                {/* Mobile Progress Bar */}
                <div className="w-full bg-[var(--neutral-200)] rounded-full h-2">
                  <motion.div
                    className="h-full bg-[var(--accent-500)] rounded-full"
                    initial={false}
                    animate={{ width: `${progress.completionPercentage}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Error Display */}
          <AnimatePresence>
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600" />
                  <div>
                    <div className="font-medium text-red-800">{state.error}</div>
                    {errors.length > 0 && (
                      <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Display */}
          <AnimatePresence>
            {state.success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center"
              >
                <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-800 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-green-700">جاري توجيهك للوحة التحكم...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Debug Info panel تمت إزالته نهائياً */}

          {/* Step Content */}
          <motion.div
            key={formData.currentStep}
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden"
          >
            {/* Step Header */}
            <div className="bg-[var(--accent-500)] p-6 text-white">
              <div className="flex items-center gap-4">
                {currentStepConfig && (
                  <>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <currentStepConfig.icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{currentStepConfig.title}</h2>
                      <p className="text-white/90">{currentStepConfig.subtitle}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Step Content - Remove form wrapper to prevent auto-submit */}
            <div className="p-8">
              {state.loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 size={48} className="text-[var(--accent-500)] animate-spin mx-auto mb-4" />
                    <p className="text-[var(--muted)]">جاري التحميل...</p>
                  </div>
                </div>
              ) : (
                children
              )}
            </div>
          </motion.div>

          {/* Navigation */}
          {showNavigation && !state.loading && !state.success && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={formData.currentStep === 1 || state.saving}
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <ArrowLeft size={18} />
                  السابق
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={(!state.canProceed && formData.hasInteracted) || state.saving || state.loading}
                  className="flex items-center gap-2 px-8 py-3 min-w-[140px]"
                  variant={formData.currentStep === 5 ? "primary" : "secondary"}
                  aria-busy={state.loading || state.saving}
                >
                  {state.loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {state.loadingMessage || (formData.currentStep === 1 ? 'جاري إنشاء الحساب...' : 'جاري الحفظ...')}
                    </>
                  ) : formData.currentStep === 5 ? (
                    <>
                      إرسال النموذج
                      <CheckCircle size={18} />
                    </>
                  ) : (
                    <>
                      التالي
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>

              {/* حالة الحفظ والتحقق أسفل الأزرار لتكون قريبة من المستخدم */}
              <div className="mt-3 flex items-center justify-center gap-4">
                {state.saving && (
                  <div className="flex items-center gap-2 text-[var(--accent-600)]">
                    <Save size={16} className="animate-pulse" />
                    <span className="text-sm">جاري الحفظ...</span>
                  </div>
                )}
                {!state.canProceed && errors.length > 0 && formData.hasInteracted && (
                  <div className="text-sm text-red-600">
                    {errors.length} خطأ يجب إصلاحه
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Skip Option للخطوات الاختيارية */}
          {progress.canSkipToEnd && formData.currentStep >= 4 && !state.success && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <Button
                variant="ghost"
                onClick={submitOnboarding}
                disabled={state.loading || state.saving}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                تخطي وإنهاء التسجيل
              </Button>
              <p className="text-xs text-[var(--muted)] mt-1">
                يمكنك إكمال التفاصيل لاحقاً من لوحة التحكم
              </p>
            </motion.div>
          )}
        </main>

        {/* إزالة الفوتر الخاص بالأونبوردن حسب الطلب */}
      </div>
    </div>
  );
}

// Component للـ Step Header المخصص
export function StepHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  step, 
  totalSteps 
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  step: number;
  totalSteps: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-500)] rounded-2xl mb-4 shadow-lg">
        <Icon size={28} className="text-white" />
      </div>
      <h2 className="text-3xl font-bold text-[var(--text)] mb-2">{title}</h2>
      <p className="text-[var(--muted)] max-w-md mx-auto">{subtitle}</p>
      <div className="text-sm text-[var(--accent-600)] mt-2">
        الخطوة {step} من {totalSteps}
      </div>
    </motion.div>
  );
}

// Component للـ Field Container
export function FieldContainer({ 
  label, 
  required = false, 
  error, 
  children, 
  description 
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text)]">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-[var(--muted)]">{description}</p>
      )}
      {children}
      {error && (
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          {error}
        </motion.p>
      )}
    </div>
  );
}
