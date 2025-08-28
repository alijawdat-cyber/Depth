"use client";
import React from "react";
import { Badge as MantineBadge } from "@mantine/core";

export type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";
export type BadgeVariant = "light" | "filled" | "outline" | "dot" | "gradient";
export type BadgeColor = "primary" | "success" | "warning" | "error" | "info" | "gray" | "blue" | "green" | "red" | "yellow" | "purple" | "pink" | "indigo" | "teal" | "cyan" | "orange" | "lime";

export interface BadgeProps {
  /** Badge content */
  children?: React.ReactNode;
  /** Size of the badge */
  size?: BadgeSize;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Color theme */
  color?: BadgeColor;
  /** Border radius */
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Makes badge take full width */
  fullWidth?: boolean;
  /** Left section with icon */
  leftSection?: React.ReactNode;
  /** Right section with icon */
  rightSection?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Gradient configuration for gradient variant */
  gradient?: { from: string; to: string; deg?: number };
  /** Auto contrast for better text visibility */
  autoContrast?: boolean;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  {
    children,
    size = "sm",
    variant = "light",
    color = "primary",
    radius = "xl",
    fullWidth = false,
    leftSection,
    rightSection,
    className,
    style,
    gradient,
    autoContrast = true,
    onClick,
    ...props
  },
  ref
) {
  // Map our color names to CSS custom properties instead of Mantine colors
  const getMantineColor = (color: BadgeColor) => {
    // Return undefined to use CSS custom properties from our design system
    const colorMap: Record<BadgeColor, string | undefined> = {
      primary: undefined, // Will use --color-primary from tokens
      success: 'green',
      warning: 'yellow', 
      error: 'red',
      info: 'blue',
      gray: 'gray',
      blue: 'blue',
      green: 'green',
      red: 'red',
      yellow: 'yellow',
      purple: 'grape',
      pink: 'pink',
      indigo: 'indigo',
      teal: 'teal',
      cyan: 'cyan',
      orange: 'orange',
      lime: 'lime'
    };
    return colorMap[color];
  };

  // Custom styles for our design tokens integration
  const getCustomStyles = () => {
    const baseStyles: React.CSSProperties = {
      fontWeight: 500,
      fontSize: {
        xs: 'var(--fs-xs)',                                 /* 12px - حجم خط صغير جداً من tokens.css */
        sm: 'var(--fs-sm)',                                 /* 14px - حجم خط صغير من tokens.css */
        md: 'var(--fs-md)',                                 /* 16px - حجم خط متوسط من tokens.css */
        lg: 'var(--fs-lg)',                                 /* 18px - حجم خط كبير من tokens.css */
        xl: 'var(--fs-xl)'                                  /* 20px - حجم خط كبير جداً من tokens.css */
      }[size] || 'var(--fs-sm)',
      ...(style || {})
    };

    // Apply color-specific styles using our design tokens
    if (color === "primary") {
      switch (variant) {
        case "filled":
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-primary)',         /* لون أساسي من tokens.css */
            color: 'var(--color-text-inverse)',              /* نص أبيض من tokens.css */
          };
        case "light":
          return {
            ...baseStyles,
            backgroundColor: 'rgba(108, 43, 255, 0.15)',     /* لون أساسي شفاف */
            color: 'var(--color-primary)',                   /* لون أساسي من tokens.css */
          };
        case "outline":
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',                   /* لون أساسي من tokens.css */
            border: '1px solid var(--color-primary)',        /* حدود بلون أساسي من tokens.css */
          };
        default:
          return baseStyles;
      }
    }

    return baseStyles;
  };

  return (
    <MantineBadge
      ref={ref}
      className={className}
      size={size}
      variant={variant === "dot" ? "dot" : variant === "gradient" ? "gradient" : variant}
      color={color === "primary" ? "violet" : getMantineColor(color)}
      radius={radius}
      fullWidth={fullWidth}
      leftSection={leftSection}
      rightSection={rightSection}
      gradient={gradient}
      autoContrast={autoContrast}
      onClick={onClick}
      styles={{
        root: {
          // Use our design tokens for consistent spacing and colors
          '--badge-height': {
            xs: 'var(--space-sm)',                            /* 8px - مسافة صغيرة من tokens.css */
            sm: 'var(--space-md)',                            /* 12px - مسافة متوسطة من tokens.css */
            md: 'var(--space-lg)',                            /* 16px - مسافة كبيرة من tokens.css */
            lg: 'var(--space-xl)',                            /* 24px - مسافة كبيرة جداً من tokens.css */
            xl: 'var(--space-2xl)'                            /* 32px - مسافة كبيرة جداً من tokens.css */
          }[size] || 'var(--space-md)',
          borderRadius: {
            xs: 'var(--radius-sm)',                           /* 6px - زوايا صغيرة من tokens.css */
            sm: 'var(--radius-sm)',                           /* 6px - زوايا صغيرة من tokens.css */
            md: 'var(--radius-md)',                           /* 8px - زوايا متوسطة من tokens.css */
            lg: 'var(--radius-lg)',                           /* 12px - زوايا كبيرة من tokens.css */
            xl: '9999px'                                      /* دائرية كاملة - استثناء مقبول */
          }[radius] || 'var(--radius-md)',                    /* قيمة افتراضية من tokens.css */
          ...getCustomStyles(),
        },
        label: {
          fontWeight: 500,                                    /* استثناء - وزن ثابت للنص */
        },
        section: {
          '& svg': {
            width: '14px',                                    /* حجم أيقونة ثابت - مناسب للبادج */
            height: '14px',
          },
        },
      }}
      {...props}
    >
      {children}
    </MantineBadge>
  );
});

export default Badge;
