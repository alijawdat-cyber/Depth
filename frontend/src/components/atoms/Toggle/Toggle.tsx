"use client";
import React from 'react';
import { Switch } from '@mantine/core';

export type ToggleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ToggleColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface ToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Toggle state */
  checked?: boolean;
  /** Default checked state for uncontrolled component */
  defaultChecked?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size of the toggle */
  size?: ToggleSize;
  /** Color theme */
  color?: ToggleColor;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
}

/**
 * Toggle component for binary state control
 * Built on top of Mantine Switch with design token integration
 */
export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  function Toggle({
    className,
    style,
    checked,
    defaultChecked,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    error,
    required = false,
    onChange,
    ...props
  }, ref) {

    const getMantineColor = () => {
      switch (color) {
        case 'primary':
          return 'blue';
        case 'secondary':
          return 'gray';
        case 'success':
          return 'green';
        case 'warning':
          return 'yellow';
        case 'error':
          return 'red';
        default:
          return 'blue';
      }
    };

    const getCustomStyles = () => {
      const baseStyles = {
        label: {
          fontFamily: 'var(--font-family)',
          fontSize: size === 'xs' ? 'var(--fs-xs)' : 
                   size === 'sm' ? 'var(--fs-sm)' : 
                   size === 'lg' ? 'var(--fs-lg)' : 
                   size === 'xl' ? 'var(--fs-xl)' : 'var(--fs-base)',
          fontWeight: 500,
          color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
        },
        description: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--space-1)',
        },
        error: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--color-text-error)',
          marginTop: 'var(--space-1)',
        },
        track: {
          backgroundColor: checked ? 
            `var(--color-${color === 'primary' ? 'primary' : 
                         color === 'success' ? 'success' : 
                         color === 'warning' ? 'warning' : 
                         color === 'error' ? 'error' : 'neutral'}-500)` :
            'var(--color-neutral-300)',
          borderColor: 'transparent',
          '&:hover': disabled ? {} : {
            backgroundColor: checked ?
              `var(--color-${color === 'primary' ? 'primary' : 
                           color === 'success' ? 'success' : 
                           color === 'warning' ? 'warning' : 
                           color === 'error' ? 'error' : 'neutral'}-600)` :
              'var(--color-neutral-400)',
          },
        },
        thumb: {
          backgroundColor: 'var(--color-bg-surface)',
          border: 'none',
        },
      };

      return baseStyles;
    };

    return (
      <Switch
        ref={ref}
        className={className}
        style={style}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        size={size}
        color={getMantineColor()}
        label={label}
        description={description}
        error={error}
        required={required}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default Toggle;
