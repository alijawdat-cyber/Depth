"use client";
import React from 'react';
import { Radio as MantineRadio, RadioGroup as MantineRadioGroup } from '@mantine/core';

export type RadioSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RadioColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface RadioProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Radio value */
  value: string;
  /** Checked state */
  checked?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size of the radio */
  size?: RadioSize;
  /** Color theme */
  color?: RadioColor;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Name for form grouping */
  name?: string;
}

export interface RadioGroupProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Current selected value */
  value?: string;
  /** Default selected value for uncontrolled component */
  defaultValue?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Size of all radios in group */
  size?: RadioSize;
  /** Color theme */
  color?: RadioColor;
  /** Group label */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Name for form handling */
  name?: string;
  /** Radio items */
  children: React.ReactNode;
}

/**
 * Radio component for single choice selection
 * Built on top of Mantine Radio with design token integration
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio({
    className,
    style,
    value,
    checked,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    error,
    onChange,
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
        radio: {
          backgroundColor: 'var(--color-bg-surface)',
          borderColor: error ? 'var(--color-border-error)' : 'var(--color-border-default)',
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
            borderColor: `var(--color-${color === 'primary' ? 'primary' : 
                                       color === 'success' ? 'success' : 
                                       color === 'warning' ? 'warning' : 
                                       color === 'error' ? 'error' : 'neutral'}-500) !important`,
            '&::before': {
              backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                            color === 'success' ? 'success' : 
                                            color === 'warning' ? 'warning' : 
                                            color === 'error' ? 'error' : 'neutral'}-500) !important`,
              transform: 'scale(0.6)',
            },
          },
        },
        inner: {
          '&:checked': {
            backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                          color === 'success' ? 'success' : 
                                          color === 'warning' ? 'warning' : 
                                          color === 'error' ? 'error' : 'neutral'}-500)`,
          },
        },
      };

      return baseStyles;
    };

    return (
      <MantineRadio
        ref={ref}
        className={className}
        style={style}
        value={value}
        checked={checked}
        disabled={disabled}
        size={size}
        color={getMantineColor()}
        label={label}
        description={description}
        error={error}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        name={name}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

/**
 * RadioGroup component for managing multiple radio options
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({
    className,
    style,
    value,
    defaultValue,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    error,
    required = false,
    onChange,
    name,
    children,
    ...props
  }, ref) {

    const getCustomStyles = () => {
      const baseStyles = {
        root: {
          fontFamily: 'var(--font-family)',
        },
        label: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-base)',
          fontWeight: 600,
          color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
        },
        description: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--space-1)',
          marginBottom: 'var(--space-3)',
        },
        error: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          color: 'var(--color-text-error)',
          marginTop: 'var(--space-2)',
        },
      };

      return baseStyles;
    };

    return (
      <MantineRadioGroup
        ref={ref}
        className={className}
        style={style}
        value={value}
        defaultValue={defaultValue}
        label={label}
        description={description}
        error={error}
        required={required}
        onChange={onChange}
        name={name}
        styles={getCustomStyles()}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const childProps = child.props as RadioProps;
            return React.cloneElement(child, {
              disabled: disabled || childProps.disabled,
              size: childProps.size || size,
              color: childProps.color || color,
            } as Partial<RadioProps>);
          }
          return child;
        })}
      </MantineRadioGroup>
    );
  }
);

export default Radio;
