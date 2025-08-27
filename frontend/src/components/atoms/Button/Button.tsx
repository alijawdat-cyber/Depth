"use client";
import React from "react";
import { Button as MantineButton } from "@mantine/core";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "compact-xs" | "compact-sm" | "compact-md" | "compact-lg" | "compact-xl";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gradient" | "danger";

export interface ButtonProps {
  /** Size of the button - supports compact variants for reduced padding */
  size?: ButtonSize;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Shows loading state with spinner */
  loading?: boolean;
  /** Icon displayed on the left side (automatically flipped in RTL) */
  leftSection?: React.ReactNode;
  /** Icon displayed on the right side (automatically flipped in RTL) */
  rightSection?: React.ReactNode;
  /** Makes button take full width of parent */
  fullWidth?: boolean;
  /** Disabled state - prevents interaction */
  disabled?: boolean;
  /** Content justification - useful for icons positioning */
  justify?: React.CSSProperties['justifyContent'];
  /** Gradient configuration for gradient variant */
  gradient?: { from: string; to: string; deg?: number };
  /** Auto contrast for better text visibility */
  autoContrast?: boolean;
  /** Custom loader props */
  loaderProps?: { type?: string; size?: number };
  /** Button content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Button type */
  type?: "button" | "submit" | "reset";
}

function sizeVars(size: ButtonSize) {
  // Handle compact sizes
  const isCompact = size.startsWith('compact-');
  const actualSize = isCompact ? size.replace('compact-', '') : size;
  
  return {
    height: isCompact ? `var(--btn-h-${actualSize}-compact)` : `var(--btn-h-${actualSize})`,
    paddingInline: `var(--btn-px-${actualSize})`,
    fontSize: `var(--fs-btn-${actualSize})`,
    minHeight: isCompact ? `var(--btn-h-${actualSize}-compact)` : undefined,
    gap: {
      xs: '0.375rem',
      sm: '0.5rem',
      md: '0.625rem',
      lg: '0.75rem',
      xl: '0.875rem'
    }[actualSize] || '0.625rem',
    borderRadius: 'var(--radius-md)'
  } as React.CSSProperties;
}

type VariantStyle = { 
  base: React.CSSProperties; 
  hoverBg?: string; 
  disabledBg?: string; 
  gradient?: { from: string; to: string; deg?: number };
};

function getVariantStyle(variant: ButtonVariant, customGradient?: { from: string; to: string; deg?: number }): VariantStyle {
  switch (variant) {
    case 'primary':
      return {
        base: {
          backgroundColor: 'var(--color-action-primary-bg)',
          color: 'var(--color-action-primary-fg)',
          border: '1px solid transparent',
          outline: 'none',
          transition: 'all 120ms ease',
        },
        hoverBg: 'var(--color-action-primary-hover)',
        disabledBg: 'var(--color-action-primary-disabled)'
      };
    case 'secondary':
      return {
        base: {
          backgroundColor: 'var(--color-action-secondary-bg)',
          color: 'var(--color-action-secondary-fg)',
          border: '1px solid var(--color-bd-default)',
          transition: 'all 120ms ease',
        },
        hoverBg: 'var(--color-action-secondary-hover)'
      };
    case 'outline':
      return {
        base: {
          backgroundColor: 'transparent',
          color: 'var(--color-action-outline-fg)',
          border: '1px solid var(--color-action-outline-bd)',
          transition: 'all 120ms ease',
        },
        hoverBg: 'var(--color-action-outline-hover)'
      };
    case 'ghost':
      return {
        base: {
          backgroundColor: 'transparent',
          color: 'var(--color-action-ghost-fg)',
          border: '1px solid transparent',
          transition: 'all 120ms ease',
        },
        hoverBg: 'var(--color-action-ghost-hover)'
      };
    case 'gradient':
      return {
        base: {
          background: customGradient 
            ? `linear-gradient(${customGradient.deg || 45}deg, ${customGradient.from}, ${customGradient.to})`
            : 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))',
          color: 'var(--color-white)',
          border: '1px solid transparent',
          transition: 'all 120ms ease',
        }
      };
    case 'danger':
      return {
        base: {
          backgroundColor: 'var(--color-danger)',
          color: 'var(--color-white)',
          border: '1px solid transparent',
          transition: 'all 120ms ease',
        },
        hoverBg: 'var(--color-danger-hover)'
      };
    default:
      return { base: {} };
  }
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { 
    className, 
    size = "md", 
    variant = "primary", 
    disabled, 
    loading, 
    leftSection, 
    rightSection, 
    fullWidth,
    justify,
    gradient,
    autoContrast,
    loaderProps,
    children, 
    style,
    onClick,
    type = "button",
    'aria-label': ariaLabel,
    ...props 
  },
  ref
) {
  const base: React.CSSProperties = {
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: justify || 'center',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
  };

  const v = getVariantStyle(variant, gradient);
  const s = { ...base, ...sizeVars(size), ...v.base, ...(style || {}) } as React.CSSProperties;

  return (
    <MantineButton
      ref={ref}
      leftSection={leftSection}
      rightSection={rightSection}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      justify={justify}
      autoContrast={autoContrast}
      loaderProps={loaderProps}
      className={className}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      styles={{
        root: {
          ...s,
          // Use Mantine's supported pseudo-class approach
          '&:hover:not(:disabled)': v.hoverBg ? { backgroundColor: v.hoverBg } : undefined,
          '&:disabled': {
            backgroundColor: v.disabledBg || 'var(--color-bg-disabled)',
            color: 'var(--color-fg-disabled)',
            opacity: v.disabledBg ? 1 : 0.6,
            cursor: 'not-allowed',
          },
          '&:focus': {
            outline: '2px solid var(--color-primary)',
            outlineOffset: '2px',
          },
          // Support for compact sizes
          ...(size.startsWith('compact-') && {
            minHeight: s.height,
            height: s.height,
          }),
        },
        section: {
          // RTL support for sections (automatically handled by Mantine)
          '& svg': {
            width: '1em',
            height: '1em',
          },
        },
        label: {
          fontWeight: 'inherit',
        },
      }}
      // Use unstyled variant to have full control over styling
      variant="unstyled"
      // Let Mantine handle size naturally
      size="md"
      {...props}
    >
      {children}
    </MantineButton>
  );
});

export default Button;
