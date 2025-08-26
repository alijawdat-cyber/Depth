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
  // Map our color names to Mantine colors or use CSS variables
  const getMantineColor = (color: BadgeColor) => {
    const colorMap: Record<BadgeColor, string> = {
      primary: "violet", // Maps to our --color-primary
      success: "green",
      warning: "yellow", 
      error: "red",
      info: "blue",
      gray: "gray",
      blue: "blue",
      green: "green",
      red: "red",
      yellow: "yellow",
      purple: "grape",
      pink: "pink",
      indigo: "indigo",
      teal: "teal",
      cyan: "cyan",
      orange: "orange",
      lime: "lime"
    };
    return colorMap[color] || "gray";
  };

  // Custom styles for our design tokens integration
  const getCustomStyles = () => {
    const baseStyles: React.CSSProperties = {
      fontWeight: 500,
      fontSize: {
        xs: '0.625rem',
        sm: '0.75rem',
        md: '0.875rem',
        lg: '1rem',
        xl: '1.125rem'
      }[size] || '0.75rem',
      ...(style || {})
    };

    // Apply color-specific styles using our design tokens
    if (color === "primary") {
      switch (variant) {
        case "filled":
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          };
        case "light":
          return {
            ...baseStyles,
            backgroundColor: 'color-mix(in oklab, var(--color-primary) 15%, transparent)',
            color: 'var(--color-primary)',
          };
        case "outline":
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)',
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
            xs: 'var(--space-4)',
            sm: 'var(--space-5)',
            md: 'var(--space-6)',
            lg: 'var(--space-8)',
            xl: 'var(--space-10)'
          }[size] || 'var(--space-5)',
          borderRadius: {
            xs: 'var(--radius-sm)',
            sm: 'var(--radius-sm)',
            md: 'var(--radius-md)',
            lg: 'var(--radius-lg)',
            xl: '9999px' // Full rounded
          }[radius] || '9999px',
          ...getCustomStyles(),
        },
        label: {
          fontWeight: 500,
        },
        section: {
          '& svg': {
            width: '0.875em',
            height: '0.875em',
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
