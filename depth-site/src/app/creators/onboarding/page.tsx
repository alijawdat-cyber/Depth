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
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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

  return (
    <OnboardingLayout showNavigation showProgress>
      {renderCurrentStep()}
    </OnboardingLayout>
  );
}

// Component للتحقق من الصلاحيات
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // للمستخدمين المسجلين: التحقق من الدور
    if (session?.user) {
      if (session.user.role && session.user.role !== 'creator') {
        // إذا كان له دور آخر، توجيه للوحة التحكم المناسبة
        router.push('/portal');
        return;
      }
    }
    // للمستخدمين الجدد: يمكنهم الوصول للـ onboarding لإنشاء حساب
  }, [session, status, router]);

  // عرض شاشة تحميل أثناء التحقق
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent-500)] to-[var(--accent-600)] rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] mb-2">جاري التحميل...</h2>
          <p className="text-[var(--muted)]">يرجى الانتظار</p>
        </motion.div>
      </div>
    );
  }

  // السماح للمستخدمين الجدد بالوصول للـ onboarding
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
          {/* خلفية ديكورية */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[var(--accent-500)]/10 to-[var(--accent-600)]/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[var(--accent-400)]/10 to-[var(--accent-500)]/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[var(--accent-300)]/5 to-[var(--accent-400)]/10 rounded-full blur-3xl"></div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="relative z-10">
            <OnboardingContent />
          </div>

          {/* تم إزالة الفوتر الخاص بالأونبوردن حسب الطلب. يبقى فوتر الموقع العام فقط. */}
        </div>
      </OnboardingProvider>
    </AuthGuard>
  );
}
