"use client";
import React from "react";
import { Avatar as MantineAvatar } from "@mantine/core";
import { User } from "lucide-react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type AvatarVariant = "filled" | "light" | "outline" | "transparent" | "gradient";

export interface AvatarProps {
  /** Avatar image source */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Visual variant */
  variant?: AvatarVariant;
  /** Color theme for placeholder */
  color?: string;
  /** Border radius */
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Name to generate initials from */
  name?: string;
  /** Custom initials (overrides name-based initials) */
  initials?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Gradient configuration for gradient variant */
  gradient?: { from: string; to: string; deg?: number };
  /** Auto contrast for better text visibility */
  autoContrast?: boolean;
  /** Custom placeholder component */
  placeholder?: React.ReactNode;
  /** Image loading error handler */
  onError?: () => void;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

// Generate initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    size = "md",
    variant = "light",
    color = "blue",
    radius = "xl", 
    name,
    initials,
    className,
    style,
    gradient,
    autoContrast = true,
    placeholder,
    onError,
    onClick,
    ...props
  },
  ref
) {
  // Generate initials if name provided but no custom initials
  const displayInitials = initials || (name ? getInitials(name) : undefined);
  
  // Default placeholder with user icon
  const defaultPlaceholder = placeholder || (
    <User 
      size={typeof size === 'number' ? size / 2 : {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28
      }[size] || 20} 
    />
  );

  return (
    <MantineAvatar
      ref={ref}
      className={className}
      src={src}
      alt={alt || name}
      size={size}
      variant={variant}
      color={color}
      radius={radius}
      gradient={gradient}
      autoContrast={autoContrast}
      onError={onError}
      onClick={onClick}
      styles={{
        root: {
          // Use our design tokens for consistent styling
          backgroundColor: variant === "light" ? 'var(--color-bg-secondary)' : undefined,
          border: variant === "outline" ? '2px solid var(--color-border-primary)' : undefined,
          transition: 'all var(--transition-fast)',
          cursor: onClick ? 'pointer' : 'default',
          ...(onClick && {
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 'var(--elevation-2)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            }
          }),
          ...style,
        },
        placeholder: {
          color: variant === "light" ? 'var(--color-fg-secondary)' : undefined,
          backgroundColor: variant === "filled" ? color : undefined,
        },
      }}
      {...props}
    >
      {/* Show initials if available, otherwise show placeholder */}
      {displayInitials || defaultPlaceholder}
    </MantineAvatar>
  );
});

export default Avatar;
