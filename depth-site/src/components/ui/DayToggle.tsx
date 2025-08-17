// مكون Toggle للأيام مع تصميم احترافي
'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface DayToggleProps {
  day: {
    id: string;
    label: string;
    shortLabel: string;
    emoji: string;
  };
  isActive: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  showEmoji?: boolean;
}

export default function DayToggle({
  day,
  isActive,
  isDisabled = false,
  onClick,
  size = 'md',
  variant = 'default',
  showEmoji = true
}: DayToggleProps) {
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  const getVariantContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <div className="text-center">
            <div className="text-lg mb-1">{showEmoji ? day.emoji : ''}</div>
            <div className="font-medium">{day.shortLabel}</div>
          </div>
        );
      
      case 'detailed':
        return (
          <div className="text-center p-2">
            <div className="text-2xl mb-2">{showEmoji ? day.emoji : ''}</div>
            <div className="font-bold text-sm">{day.label}</div>
            <div className="text-xs text-[var(--muted)] mt-1">
              {isActive ? 'متاح' : 'غير متاح'}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <div className="text-xl mb-1">{showEmoji ? day.emoji : ''}</div>
            <div className="font-medium">{day.shortLabel}</div>
          </div>
        );
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      className={`
        relative ${sizeClasses[size]} rounded-2xl border-2 transition-all duration-200
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
        ${isActive
          ? 'bg-[var(--accent-500)] border-[var(--accent-500)] text-white shadow-lg shadow-[var(--accent-500)]/25'
          : 'bg-[var(--card)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent-300)] hover:bg-[var(--accent-50)]'
        }
      `}
    >
      {/* محتوى اليوم */}
      {getVariantContent()}
      
      {/* مؤشر الحالة */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isActive ? 1 : 0, 
          opacity: isActive ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
      >
        <Check size={12} className="text-white" />
      </motion.div>

      {/* مؤشر عدم الإتاحة */}
      {!isActive && variant === 'detailed' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-2xl"
        >
          <X size={size === 'lg' ? 24 : 16} className="text-red-500" />
        </motion.div>
      )}

      {/* تأثير الضوء عند التفعيل */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
        />
      )}
    </motion.button>
  );
}

// مكون مجموعة الأيام
interface DayToggleGroupProps {
  days: Array<{
    id: string;
    label: string;
    shortLabel: string;
    emoji: string;
  }>;
  selectedDays: string[];
  onChange: (selectedDays: string[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  showEmoji?: boolean;
  maxSelection?: number;
  minSelection?: number;
  label?: string;
  error?: string;
  required?: boolean;
}

export function DayToggleGroup({
  days,
  selectedDays,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  showEmoji = true,
  maxSelection,
  minSelection,
  label,
  error,
  required = false
}: DayToggleGroupProps) {
  
  const handleDayToggle = (dayId: string) => {
    if (disabled) return;

    const isSelected = selectedDays.includes(dayId);
    let newSelection: string[];

    if (isSelected) {
      // إلغاء التحديد
      if (minSelection && selectedDays.length <= minSelection) {
        return; // لا يمكن إلغاء التحديد إذا وصلنا للحد الأدنى
      }
      newSelection = selectedDays.filter(id => id !== dayId);
    } else {
      // إضافة التحديد
      if (maxSelection && selectedDays.length >= maxSelection) {
        return; // لا يمكن إضافة المزيد إذا وصلنا للحد الأقصى
      }
      newSelection = [...selectedDays, dayId];
    }

    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-[var(--text)]">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </label>
          
          {/* عداد التحديد */}
          <div className="text-xs text-[var(--muted)]">
            {selectedDays.length} من {days.length} أيام
            {maxSelection && ` (الحد الأقصى: ${maxSelection})`}
          </div>
        </div>
      )}

      {/* شبكة الأيام */}
      <div className={`
        grid gap-3
        ${variant === 'detailed' 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-4 sm:grid-cols-7'
        }
      `}>
        {days.map((day) => (
          <DayToggle
            key={day.id}
            day={day}
            isActive={selectedDays.includes(day.id)}
            isDisabled={disabled}
            onClick={() => handleDayToggle(day.id)}
            size={size}
            variant={variant}
            showEmoji={showEmoji}
          />
        ))}
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}

      {/* نصائح إضافية */}
      {variant === 'detailed' && (
        <div className="bg-[var(--accent-50)] border border-[var(--accent-200)] rounded-lg p-3">
          <div className="text-sm text-[var(--accent-700)]">
            <p className="font-medium mb-1">💡 نصائح:</p>
            <ul className="space-y-1 text-xs">
              <li>• اختر الأيام التي تكون متاحاً فيها للعمل</li>
              <li>• يمكنك تغيير التوفر لاحقاً من لوحة التحكم</li>
              {maxSelection && <li>• يمكنك اختيار حتى {maxSelection} أيام كحد أقصى</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
