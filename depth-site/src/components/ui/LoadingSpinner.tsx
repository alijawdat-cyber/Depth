"use client";

// مكون LoadingSpinner محسن مع أنماط متعددة
// الغرض: عرض حالات تحميل متنوعة وجذابة

import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-[var(--accent-500)]',
  secondary: 'text-[var(--muted)]',
  white: 'text-white',
  gray: 'text-gray-500'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

// Spinner variant
function SpinnerVariant({ size, color, className }: Pick<LoadingSpinnerProps, 'size' | 'color' | 'className'>) {
  return (
    <Loader2 
      className={clsx(
        'animate-spin',
        sizeClasses[size!],
        colorClasses[color!],
        className
      )} 
    />
  );
}

// Dots variant
function DotsVariant({ size, color, className }: Pick<LoadingSpinnerProps, 'size' | 'color' | 'className'>) {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
    xl: 'w-3 h-3'
  }[size!];

  return (
    <div className={clsx('flex space-x-1 rtl:space-x-reverse', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full animate-pulse',
            dotSize,
            colorClasses[color!].replace('text-', 'bg-')
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );
}

// Pulse variant
function PulseVariant({ size, color, className }: Pick<LoadingSpinnerProps, 'size' | 'color' | 'className'>) {
  return (
    <div
      className={clsx(
        'rounded-full animate-pulse',
        sizeClasses[size!],
        colorClasses[color!].replace('text-', 'bg-'),
        className
      )}
    />
  );
}

// Bars variant
function BarsVariant({ size, color, className }: Pick<LoadingSpinnerProps, 'size' | 'color' | 'className'>) {
  const barHeight = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8'
  }[size!];

  return (
    <div className={clsx('flex items-end space-x-1 rtl:space-x-reverse', className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={clsx(
            'w-1 animate-pulse',
            barHeight,
            colorClasses[color!].replace('text-', 'bg-')
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className = '',
  text
}: LoadingSpinnerProps) {
  const renderSpinner = () => {
    const props = { size, color, className: '' };
    
    switch (variant) {
      case 'dots':
        return <DotsVariant {...props} />;
      case 'pulse':
        return <PulseVariant {...props} />;
      case 'bars':
        return <BarsVariant {...props} />;
      default:
        return <SpinnerVariant {...props} />;
    }
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      {renderSpinner()}
      {text && (
        <div className={clsx(
          'font-medium',
          textSizeClasses[size],
          colorClasses[color]
        )}>
          {text}
        </div>
      )}
    </div>
  );
}

// مكونات مخصصة لحالات محددة
export function PageLoader({ text = 'جاري التحميل...' }: { text?: string }) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <LoadingSpinner size={size} color="white" variant="spinner" />;
}

export function CardLoader({ text }: { text?: string }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-8">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}

export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <LoadingSpinner size={size} variant="spinner" />;
}
