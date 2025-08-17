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

    if (!session?.user) {
      // توجيه لصفحة تسجيل الدخول مع العودة للـ onboarding
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent('/creators/onboarding'));
      return;
    }

    // التحقق من نوع المستخدم
    if (session.user.role && session.user.role !== 'creator') {
      // إذا كان له دور آخر، توجيه للوحة التحكم المناسبة
      router.push('/portal');
      return;
    }
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

  // إذا لم يكن مسجل دخول، لا نعرض شيء (سيتم التوجيه)
  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}

// الصفحة الرئيسية
export default function CreatorOnboardingPage() {
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

          {/* Footer إضافي للمساعدة */}
          <footer className="relative z-10 bg-[var(--card)]/80 backdrop-blur-sm border-t border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                  <span>© 2024 Depth Creative Platform</span>
                  <span>•</span>
                  <span>نظام انضمام المبدعين المطور</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <a 
                    href="mailto:support@depth.com" 
                    className="text-sm text-[var(--accent-600)] hover:underline"
                  >
                    تحتاج مساعدة؟ تواصل معنا
                  </a>
                  <span className="text-[var(--border)]">|</span>
                  <a 
                    href="/legal#privacy" 
                    className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    سياسة الخصوصية
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </OnboardingProvider>
    </AuthGuard>
  );
}
