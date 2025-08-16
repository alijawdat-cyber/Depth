"use client";

import { CheckCircle } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showDescription?: boolean;
}

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
  className = "",
  orientation = 'horizontal',
  showDescription = true
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`${className}`}>
      <div className={`
        flex ${isHorizontal ? 'flex-row items-center justify-between' : 'flex-col space-y-4'}
      `}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = onStepClick && (isCompleted || isActive);

          return (
            <div
              key={step.id}
              className={`
                flex items-center
                ${isHorizontal ? 'flex-col text-center' : 'flex-row text-right'}
                ${isClickable ? 'cursor-pointer' : ''}
                ${isHorizontal && index < steps.length - 1 ? 'flex-1' : ''}
              `}
              onClick={() => isClickable && onStepClick(index + 1)}
            >
              {/* خط الاتصال للوضع الأفقي */}
              {isHorizontal && index > 0 && (
                <div className={`
                  flex-1 h-0.5 -ml-4 -mr-4 mb-4
                  ${isCompleted ? 'bg-[var(--accent-500)]' : 'bg-[var(--elev)]'}
                `} />
              )}

              {/* أيقونة الخطوة */}
              <div className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-full border-2 transition-all duration-200
                ${isCompleted 
                  ? 'bg-[var(--accent-500)] border-[var(--accent-500)] text-white' 
                  : isActive 
                  ? 'bg-[var(--accent-100)] border-[var(--accent-500)] text-[var(--accent-600)]'
                  : 'bg-[var(--card)] border-[var(--elev)] text-[var(--muted)]'
                }
                ${isClickable ? 'hover:scale-105' : ''}
                ${isHorizontal ? 'mb-3' : 'ml-4'}
              `}>
                {isCompleted ? (
                  <CheckCircle size={20} />
                ) : step.icon ? (
                  <step.icon size={20} />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* معلومات الخطوة */}
              <div className={`
                ${isHorizontal ? 'text-center' : 'flex-1 mr-4'}
              `}>
                <h4 className={`
                  text-sm font-medium transition-colors
                  ${isActive ? 'text-[var(--text)]' : 'text-[var(--muted)]'}
                `}>
                  {step.title}
                </h4>
                {showDescription && step.description && (
                  <p className={`
                    text-xs mt-1 transition-colors
                    ${isActive ? 'text-[var(--muted)]' : 'text-[var(--muted-light)]'}
                  `}>
                    {step.description}
                  </p>
                )}
              </div>

              {/* خط الاتصال للوضع العمودي */}
              {!isHorizontal && index < steps.length - 1 && (
                <div className={`
                  w-0.5 h-8 mr-9 mt-2
                  ${stepNumber < currentStep ? 'bg-[var(--accent-500)]' : 'bg-[var(--elev)]'}
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* شريط التقدم للوضع الأفقي */}
      {isHorizontal && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)]">
              الخطوة {currentStep} من {steps.length}
            </span>
            <span className="text-xs text-[var(--muted)]">
              {Math.round((currentStep / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[var(--elev)] rounded-full h-2">
            <div
              className="bg-[var(--accent-500)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// مكون للتنقل بين الخطوات
interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  submitDisabled?: boolean;
  loading?: boolean;
}

export function StepperNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  nextLabel = "التالي",
  previousLabel = "السابق", 
  submitLabel = "إنهاء",
  nextDisabled = false,
  previousDisabled = false,
  submitDisabled = false,
  loading = false
}: StepperNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-[var(--elev)]">
      <div>
        {!isFirstStep && onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={previousDisabled || loading}
            className="px-4 py-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {previousLabel}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isLastStep ? (
          onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitDisabled || loading}
              className="px-6 py-2 bg-[var(--accent-500)] text-white rounded-[var(--radius)] hover:bg-[var(--accent-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {submitLabel}
            </button>
          )
        ) : (
          onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled || loading}
              className="px-6 py-2 bg-[var(--accent-500)] text-white rounded-[var(--radius)] hover:bg-[var(--accent-600)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {nextLabel}
            </button>
          )
        )}
      </div>
    </div>
  );
}
