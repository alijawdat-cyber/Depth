import React from 'react';
import { ThemeIcon as MantineThemeIcon, ThemeIconProps } from '@mantine/core';

/**
 * خصائص مكون أيقونة السمة
 */
export interface ThemeIconComponentProps extends ThemeIconProps {
  /** محتوى الأيقونة */
  children: React.ReactNode;
  /** حجم الأيقونة */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** نصف القطر للزوايا */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** متغير الأسلوب */
  variant?: 'filled' | 'light' | 'outline' | 'default' | 'white' | 'gradient';
  /** لون السمة */
  color?: string;
  /** تدرج اللون (للمتغير gradient) */
  gradient?: { from: string; to: string; deg?: number };
  /** إعدادات التدرج */
  autoContrast?: boolean;
  /** تسمية للوصول */
  'aria-label'?: string;
}

/**
 * مكون أيقونة السمة - ThemeIcon
 * يعرض أيقونة مع خلفية ملونة تتماشى مع سمة التطبيق
 */
const ThemeIcon = React.forwardRef<HTMLDivElement, ThemeIconComponentProps>(
  ({ 
    children,
    size = 'md',
    radius = 'sm',
    variant = 'filled',
    color = 'blue',
    gradient,
    autoContrast = true,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    return (
      <MantineThemeIcon
        ref={ref}
        size={size}
        radius={radius}
        variant={variant}
        color={color}
        gradient={gradient}
        autoContrast={autoContrast}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </MantineThemeIcon>
    );
  }
);

ThemeIcon.displayName = 'ThemeIcon';

export default ThemeIcon;
