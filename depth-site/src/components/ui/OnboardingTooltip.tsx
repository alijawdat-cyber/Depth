"use client";

// Remove unused import
import { Button } from "@/components/ui/Button";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingTooltipProps {
  isVisible: boolean;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  onPrevious?: () => void;
  onClose: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function OnboardingTooltip({
  isVisible,
  title,
  content,
  position,
  onNext,
  onPrevious,
  onClose,
  isFirst = false,
  isLast = false,
  currentStep = 1,
  totalSteps = 1,
}: OnboardingTooltipProps) {
  if (!isVisible) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[var(--card)]';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[var(--card)]';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[var(--card)]';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[var(--card)]';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[var(--card)]';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Tooltip */}
      <div className={`absolute z-50 ${getPositionClasses()}`}>
        {/* Arrow */}
        <div className={`absolute w-0 h-0 border-[8px] ${getArrowClasses()}`} />
        
        {/* Content */}
        <div className="bg-[var(--card)] border border-[var(--elev)] rounded-lg shadow-lg p-4 max-w-xs">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text)] text-sm">{title}</h3>
              <span className="text-xs text-[var(--slate-500)] bg-[var(--bg)] px-2 py-1 rounded">
                {currentStep}/{totalSteps}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--slate-400)] hover:text-[var(--text)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Content */}
          <p className="text-sm text-[var(--slate-600)] mb-4 leading-relaxed">
            {content}
          </p>
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i + 1 === currentStep
                      ? 'bg-[var(--accent-500)]'
                      : i + 1 < currentStep
                      ? 'bg-green-500'
                      : 'bg-[var(--elev)]'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {!isFirst && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onPrevious}
                  className="text-xs"
                >
                  <ArrowLeft size={12} className="mr-1" />
                  السابق
                </Button>
              )}
              
              {!isLast && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={onNext}
                  className="text-xs"
                >
                  التالي
                  <ArrowRight size={12} className="ml-1" />
                </Button>
              )}
              
              {isLast && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={onClose}
                  className="text-xs"
                >
                  إنهاء
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
