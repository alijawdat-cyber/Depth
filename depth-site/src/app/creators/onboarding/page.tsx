// الصفحة الرئيسية لنظام الـ Onboarding الاحترافي الموحد
'use client';

import { OnboardingProvider } from '@/hooks/useOnboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import Step1_AccountCreation from '@/components/onboarding/steps/Step1_AccountCreation';
import Step2_BasicInfo from '@/components/onboarding/steps/Step2_BasicInfo';
import Step3_Experience from '@/components/onboarding/steps/Step3_Experience';
import Step4_Portfolio from '@/components/onboarding/steps/Step4_Portfolio';
import Step5_Availability from '@/components/onboarding/steps/Step5_Availability';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component للمحتوى الداخلي
function OnboardingContent() {
  const { formData } = useOnboarding();
  const currentStep = formData.currentStep;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_AccountCreation />;
      case 2:
        return <Step2_BasicInfo />;
      case 3:
        return <Step3_Experience />;
      case 4:
        return <Step4_Portfolio />;
      case 5:
        return <Step5_Availability />;
      default:
        return <Step1_AccountCreation />;
    }
  };

  // أنيميشن variants للانتقالات السلسة
  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: 20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      x: -20,
      scale: 0.98
    }
  };

  const pageTransition = {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94] as const // easeOutQuart
  };

  return (
    <OnboardingLayout>
    {/* منع الاختلاف الأول بين SSR و العميل: إلغاء initial animation في أول تحميل */}
    <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
      // نحافظ على الانتقالات بين الخطوات فقط بعد التحميل الأول
      initial="initial"
      animate="animate"
      exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  );
}

// Component للتحقق من الصلاحيات
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // تجنب التحقق أثناء loading الجلسة
    if (status === 'loading') return;

    // إذا لم يكن هناك جلسة وليس loading، السماح بالوصول لصفحة التسجيل
    if (status === 'unauthenticated') {
      // يمكن للمستخدمين الجدد الوصول لصفحة onboarding للتسجيل
      return;
    }

    // إذا كان مسجل الدخول، التحقق من الدور
    if (session?.user && 'role' in session.user) {
      const userRole = (session.user as { role?: string }).role;
      if (userRole && userRole !== 'creator') {
        // توجيه غير المبدعين لصفحاتهم المناسبة
        switch (userRole) {
          case 'admin':
            router.push('/admin');
            break;
          case 'client':
            router.push('/portal');
            break;
          case 'employee':
            router.push('/employees');
            break;
          default:
            router.push('/');
        }
      }
    }
  }, [session, status, router]);

  // عرض loader أثناء تحميل الجلسة
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-500)] mx-auto mb-4" />
          <p className="text-[var(--muted)]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// الصفحة الرئيسية
export default function CreatorOnboardingPage() {
  // تحسين viewport للهواتف
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
  }, []);

  return (
    <AuthGuard>
      <OnboardingProvider>
        <div className="min-h-screen bg-[var(--bg)]">
          {/* خلفية ديكورية مع أنيميشن */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[var(--accent-500)]/10 to-[var(--accent-600)]/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1] // easeInOut
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[var(--accent-400)]/10 to-[var(--accent-500)]/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1], // easeInOut
                delay: 2
              }}
            ></motion.div>
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[var(--accent-300)]/5 to-[var(--accent-400)]/10 rounded-full blur-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            ></motion.div>
          </div>

          {/* المحتوى الرئيسي */}
          {/* إلغاء initial animation في الحمولة الأولى لتجنب أي اختلاف SSR */}
          <motion.div 
            className="relative z-10"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingContent />
          </motion.div>

          {/* تم إزالة الفوتر الخاص بالأونبوردن حسب الطلب. يبقى فوتر الموقع العام فقط. */}
        </div>
      </OnboardingProvider>
    </AuthGuard>
  );
}
