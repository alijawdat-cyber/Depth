"use client";
import React from 'react';
import { PinInput as MantinePinInput } from '@mantine/core';

export type PinInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type PinInputType = 'alphanumeric' | 'number';

export interface PinInputProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Number of inputs */
  length?: number;
  /** Input type */
  type?: PinInputType;
  /** Size of inputs */
  size?: PinInputSize;
  /** Whether inputs are disabled */
  disabled?: boolean;
  /** Whether to show error state */
  error?: boolean;
  /** Placeholder character */
  placeholder?: string;
  /** Whether inputs are one time code */
  oneTimeCode?: boolean;
  /** Default value */
  defaultValue?: string;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Complete handler (when all inputs filled) */
  onComplete?: (value: string) => void;
  /** Whether to mask input values */
  mask?: boolean;
  /** Input radius */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * PinInput component for entering verification codes or PINs
 * Built on top of Mantine PinInput with design token integration
 */
export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput({
    className,
    style,
    length = 4,
    type = 'number',
    size = 'md',
    disabled = false,
    error = false,
    placeholder = '○',
    oneTimeCode = false,
    defaultValue,
    value,
    onChange,
    onComplete,
    mask = false,
    radius = 'sm',
    ...props
  }, ref) {

    const getCustomStyles = () => {
      const baseStyles = {
        input: {
          fontFamily: 'var(--font-family)',
          fontSize: size === 'xs' ? 'var(--fs-sm)' : 
                   size === 'sm' ? 'var(--fs-md)' : 
                   size === 'md' ? 'var(--fs-lg)' : 
                   size === 'lg' ? 'var(--fs-xl)' : 'var(--fs-2xl)',
          fontWeight: 'var(--fw-semibold)',
          textAlign: 'center' as const,
          border: `var(--border-width-2) solid ${error ? 'var(--color-error-500)' : 'var(--color-neutral-300)'}`,
          backgroundColor: disabled ? 'var(--color-neutral-100)' : 'var(--color-background)',
          color: disabled ? 'var(--color-neutral-500)' : 'var(--color-foreground)',
          borderRadius: `var(--radius-${radius})`,
          transition: 'all 0.2s ease',
          
          '&:focus': {
            borderColor: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
            boxShadow: error 
              ? '0 0 0 3px var(--color-error-100)' 
              : '0 0 0 3px var(--color-primary-100)',
            outline: 'none',
          },
          
          '&::placeholder': {
            color: 'var(--color-neutral-400)',
            opacity: 1,
          },
        } as React.CSSProperties,
      };

      return baseStyles;
    };

    return (
      <MantinePinInput
        ref={ref}
        className={className}
        style={style}
        length={length}
        type={type}
        size={size}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        oneTimeCode={oneTimeCode}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        mask={mask}
        radius={radius}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default PinInput;
