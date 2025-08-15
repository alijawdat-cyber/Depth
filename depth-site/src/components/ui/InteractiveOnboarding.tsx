"use client";

import { useState, useEffect } from "react";
import OnboardingTooltip from "./OnboardingTooltip";

interface OnboardingStep {
  id: string;
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  requiredTab?: 'summary' | 'files' | 'approvals' | 'reports';
}

interface InteractiveOnboardingProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentTab?: string; // لزامنة الجولة مع التبويبات
  setTab?: (t: 'summary' | 'files' | 'approvals' | 'reports') => void;
}

export default function InteractiveOnboarding({ isActive, onComplete, onSkip, currentTab, setTab }: InteractiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [liveMessage, setLiveMessage] = useState<string>("");
  // focus trap state (reserved). We expose it via data-attribute for future styling hooks.
  const [trapActive, setTrapActive] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: "header",
      targetId: "portal-header",
      title: "مرحباً بك في البوابة!",
      content: "هذا هو مركز التحكم الخاص بك. من هنا يمكنك رؤية معلومات حسابك والتنقل بين الأقسام.",
      position: "bottom"
    },
    {
      id: "stats",
      targetId: "quick-stats",
      title: "إحصائياتك السريعة",
      content: "هنا ترى ملخص سريع لمشاريعك: التقدم العام، الميزانية، والمهام المعلقة.",
      position: "bottom"
    },
    {
      id: "tabs",
      targetId: "portal-tabs",
      title: "تبويبات البوابة",
      content: "استخدم هذه التبويبات للتنقل بين أقسام البوابة المختلفة.",
      position: "bottom"
    },
    {
      id: "actions",
      targetId: "quick-actions",
      title: "الإجراءات السريعة",
      content: "أزرار مفيدة للتواصل مع الفريق وتحديث البيانات وإدارة حسابك.",
      position: "top"
    },
    {
      id: "notifications",
      targetId: "notification-bell",
      title: "الإشعارات",
      content: "ستصلك هنا تنبيهات عن تحديثات مشاريعك وطلبات الموافقة.",
      position: "bottom"
    }
  ];

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      removeAllHighlights();
      return;
    }
    setIsVisible(true);
    setTrapActive(true);
    const step = steps[currentStep];
    if (step.requiredTab && currentTab && step.requiredTab !== currentTab) {
      setTab?.(step.requiredTab);
    }
    // إعادة التموضع والمتابعة عند تغير الحجم أو التمرير
    const target = document.getElementById(step.targetId);
    if (!target) {
      // إذا لم يوجد الهدف تخطَّ الخطوة
      setTimeout(() => handleNext(), 0);
      return;
    }
    highlightElement(step.targetId);
    setLiveMessage(step.title);
    setTrapActive(true);
    const ro = new ResizeObserver(() => highlightElement(step.targetId));
    ro.observe(target);
    const onScroll = () => highlightElement(step.targetId);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleSkip(); };
    window.addEventListener('keydown', onKey);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('keydown', onKey);
      setTrapActive(false);
    };
  }, [isActive, currentStep, currentTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const highlightElement = (targetId: string) => {
    // Remove previous highlights
    removeAllHighlights();
    
    // Add highlight to current element
    const element = document.getElementById(targetId);
    if (element) {
      element.classList.add('onboarding-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const removeAllHighlights = () => {
    steps.forEach(step => {
      const element = document.getElementById(step.targetId);
      if (element) {
        element.classList.remove('onboarding-highlight');
      }
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    removeAllHighlights();
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    removeAllHighlights();
    onSkip();
  };

  if (!isActive || !isVisible) return null;

  const currentStepData = steps[currentStep];
  const targetElement = document.getElementById(currentStepData.targetId);

  if (!targetElement) return null;

  return (
    <>
      {/* Live region for screen readers */}
      <div aria-live="polite" className="sr-only">{liveMessage}</div>

      {/* Backdrop mask */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40" onClick={handleSkip} />
      {/* CSS for highlighting */}
      <style jsx global>{`
        .onboarding-highlight {
          position: relative;
          z-index: 30;
          box-shadow: 0 0 0 4px rgba(var(--accent-500-rgb, 59, 130, 246), 0.3), 
                      0 0 0 8px rgba(var(--accent-500-rgb, 59, 130, 246), 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .onboarding-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid rgb(var(--accent-500-rgb, 59, 130, 246));
          border-radius: 12px;
          animation: pulse-border 2s infinite;
        }
        
        @keyframes pulse-border {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Skip Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleSkip}
          className="bg-[var(--card)] border border-[var(--elev)] px-3 py-2 rounded-lg text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors"
        >
          تخطي الجولة
        </button>
      </div>

      {/* Tooltip (focus trap container) */}
      <div className="relative z-50" role="dialog" aria-modal="true" data-trap-active={trapActive ? '1' : '0'}>
        <OnboardingTooltip
          isVisible={true}
          title={currentStepData.title}
          content={currentStepData.content}
          position={currentStepData.position}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onClose={handleSkip}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 1}
          currentStep={currentStep + 1}
          totalSteps={steps.length}
        />
      </div>
    </>
  );
}
