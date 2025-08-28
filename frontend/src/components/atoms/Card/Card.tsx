"use client";
import React from "react";
import { Card as MantineCard } from "@mantine/core";

export type CardVariant = "elevated" | "outline" | "filled";
export type CardPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface CardProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Card content */
  children: React.ReactNode;
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Padding inside the card - uses spacing tokens */
  padding?: CardPadding;
  /** Makes card interactive with hover effects */
  clickable?: boolean;
  /** Shows loading skeleton */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Add border around card */
  withBorder?: boolean;
  /** Box shadow depth */
  shadow?: "none" | "sm" | "md" | "lg";
  /** Border radius - uses radius tokens */
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
}

export interface CardSectionProps {
  /** Inherit padding from Card */
  inheritPadding?: boolean;
  /** Add border to section */
  withBorder?: boolean;
  /** Padding for this section */
  p?: string | number;
  py?: string | number;
  px?: string | number;
  /** Margin for this section */
  m?: string | number;
  mt?: string | number;
  mb?: string | number;
  /** Section content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { 
    className,
    style,
    children,
    variant = "elevated",
    padding = "md",
    clickable = false,
    loading = false,
    onClick,
    withBorder = false,
    shadow = "sm",
    ...props
  }, ref) {

  const paddingValue = {
    none: 0,
    xs: 'var(--space-xs)',                                        /* 4px - مسافة صغيرة جداً من tokens.css */
    sm: 'var(--space-sm)',                                        /* 8px - مسافة صغيرة من tokens.css */
    md: 'var(--space-md)',                                        /* 12px - مسافة متوسطة من tokens.css */
    lg: 'var(--space-lg)',                                        /* 16px - مسافة كبيرة من tokens.css */
    xl: 'var(--space-xl)',                                        /* 24px - مسافة كبيرة جداً من tokens.css */
  }[padding];

  if (loading) {
    return (
      <MantineCard
        ref={ref}
        className={className}
        padding={paddingValue}
        styles={{
          root: {
            backgroundColor: 'var(--color-bg-secondary)',         /* خلفية ثانوية من tokens.css */
            border: '1px solid var(--color-border-primary)',      /* حدود من tokens.css */
            borderRadius: 'var(--radius-md)',                     /* زوايا متوسطة من tokens.css */
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(style || {}),
          }
        }}
        {...props}
      >
        <div style={{ 
          textAlign: 'center',
          fontSize: 'var(--fs-sm)'
        }}>
          جاري التحميل...
        </div>
      </MantineCard>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: 'var(--color-bg-secondary)',           /* خلفية ثانوية واضحة من tokens.css */
          border: withBorder ? '1px solid var(--color-border-primary)' : 'none',
          boxShadow: shadow !== 'none' ? `var(--shadow-${shadow === 'lg' ? 'lg' : shadow === 'md' ? 'md' : 'sm'})` : 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'var(--color-bg-primary)',             /* خلفية رئيسية من tokens.css */
          border: '1px solid var(--color-border-primary)',        /* حدود من tokens.css */
          boxShadow: 'none',
        };
      case 'filled':
        return {
          backgroundColor: 'var(--color-bg-secondary)',           /* خلفية ثانوية من tokens.css */
          border: 'none',
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  return (
    <MantineCard
      ref={ref}
      className={className}
      padding={paddingValue}
      onClick={clickable ? onClick : undefined}
      styles={{
        root: {
          borderRadius: 'var(--radius-md)',                       /* زوايا متوسطة من tokens.css */
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          ...getVariantStyles(),
          ...(clickable && {
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 'var(--shadow-md)',                      /* ظل متوسط من tokens.css */
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }),
          ...(style || {}),
        }
      }}
      {...props}
    >
      {children}
    </MantineCard>
  );
});

// Card Section component
export const CardSection = React.forwardRef<HTMLDivElement, CardSectionProps>(function CardSection(
  { 
    className, 
    inheritPadding = false,
    withBorder = false,
    children, 
    style,
    p, py, px,
    m, mt, mb,
    ...props 
  },
  ref
) {
  return (
    <MantineCard.Section
      ref={ref}
      className={className}
      inheritPadding={inheritPadding}
      withBorder={withBorder}
      p={p}
      py={py}
      px={px}
      m={m}
      mt={mt}
      mb={mb}
      style={style}
      {...props}
    >
      {children}
    </MantineCard.Section>
  );
});

// Attach Section to Card for API consistency
(Card as typeof Card & { Section: typeof CardSection }).Section = CardSection;

export default Card;
