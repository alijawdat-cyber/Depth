"use client";
import React from 'react';
import { Checkbox as MantineCheckbox } from '@mantine/core';

export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CheckboxColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface CheckboxProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Checkbox state */
  checked?: boolean;
  /** Default checked state for uncontrolled component */
  defaultChecked?: boolean;
  /** Indeterminate state (for partial selection) */
  indeterminate?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Color theme */
  color?: CheckboxColor;
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
  /** Value for form handling */
  value?: string;
  /** Name for form handling */
  name?: string;
}

/**
 * Checkbox component for multiple choice selections
 * Built on top of Mantine Checkbox with design token integration
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({
    className,
    style,
    checked,
    defaultChecked,
    indeterminate = false,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    error,
    required = false,
    onChange,
    value,
    name,
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
        root: {
          fontFamily: 'var(--font-family)',
        },
        label: {
          fontFamily: 'var(--font-family)',
          fontSize: size === 'xs' ? 'var(--fs-xs)' : 
                   size === 'sm' ? 'var(--fs-sm)' : 
                   size === 'lg' ? 'var(--fs-lg)' : 
                   size === 'xl' ? 'var(--fs-xl)' : 'var(--fs-base)',
          fontWeight: 500,
          color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
          paddingRight: 'var(--space-2)',
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
        input: {
          backgroundColor: 'var(--color-bg-surface)',
          borderColor: error ? 'var(--color-border-error)' : 'var(--color-border-default)',
          borderRadius: 'var(--radius-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: `var(--color-${color === 'primary' ? 'primary' : 
                               color === 'success' ? 'success' : 
                               color === 'warning' ? 'warning' : 
                               color === 'error' ? 'error' : 'neutral'}-500)`,
            boxShadow: `0 0 0 2px var(--color-${color === 'primary' ? 'primary' : 
                                                color === 'success' ? 'success' : 
                                                color === 'warning' ? 'warning' : 
                                                color === 'error' ? 'error' : 'neutral'}-200)`,
          },
          '&:checked': {
            backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                          color === 'success' ? 'success' : 
                                          color === 'warning' ? 'warning' : 
                                          color === 'error' ? 'error' : 'neutral'}-500) !important`,
            borderColor: `var(--color-${color === 'primary' ? 'primary' : 
                                       color === 'success' ? 'success' : 
                                       color === 'warning' ? 'warning' : 
                                       color === 'error' ? 'error' : 'neutral'}-500) !important`,
          },
          '&:checked:after': {
            content: '"✓"',
            display: 'block',
            color: 'white',
            fontSize: `${size === 'xs' ? '8px' : 
                        size === 'sm' ? '10px' : 
                        size === 'lg' ? '14px' : 
                        size === 'xl' ? '16px' : '12px'}`,
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: '1',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        },
      };

      return baseStyles;
    };

    return (
      <MantineCheckbox
        ref={ref}
        className={className}
        style={style}
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        size={size}
        color={getMantineColor()}
        label={label}
        description={description}
        error={error}
        required={required}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
        value={value}
        name={name}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default Checkbox;
