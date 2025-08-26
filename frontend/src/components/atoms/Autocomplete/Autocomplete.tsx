"use client";
import React from 'react';
import { Autocomplete as MantineAutocomplete } from '@mantine/core';

export type AutocompleteSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AutocompleteData {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface AutocompleteProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Data for autocomplete options */
  data: (string | AutocompleteData)[];
  /** Current value */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Label for the input */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string | boolean;
  /** Whether input is required */
  required?: boolean;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Size of the input */
  size?: AutocompleteSize;
  /** Radius of the input */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Change handler */
  onChange?: (value: string) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Maximum number of options to show */
  limit?: number;
  /** Whether dropdown should open on focus */
  dropdownOpened?: boolean;
  /** Whether to hide dropdown on option select */
  selectFirstOptionOnChange?: boolean;
}

/**
 * Autocomplete component for searchable select inputs
 * Built on top of Mantine Autocomplete with design token integration
 */
export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete({
    className,
    style,
    data,
    value,
    defaultValue,
    placeholder,
    label,
    description,
    error,
    required = false,
    disabled = false,
    size = 'sm',
    radius = 'sm',
    onChange,
    onBlur,
    onFocus,
    limit = 5,
    dropdownOpened,
    selectFirstOptionOnChange = false,
    ...props
  }, ref) {

    const getCustomStyles = () => {
      const baseStyles = {
        root: {
          fontFamily: 'var(--font-family)',
        },
        label: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--color-foreground)',
          marginBottom: 'var(--space-2)',
        },
        description: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-neutral-600)',
          marginTop: 'var(--space-1)',
        },
        error: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-error-600)',
          marginTop: 'var(--space-1)',
        },
        input: {
          fontFamily: 'var(--font-family)',
          fontSize: size === 'xs' ? 'var(--fs-xs)' : 
                   size === 'sm' ? 'var(--fs-sm)' : 
                   size === 'md' ? 'var(--fs-md)' : 
                   size === 'lg' ? 'var(--fs-lg)' : 'var(--fs-xl)',
          padding: size === 'xs' ? 'var(--space-2) var(--space-3)' : 
                  size === 'sm' ? 'var(--space-3) var(--space-4)' : 
                  size === 'md' ? 'var(--space-4) var(--space-5)' : 
                  size === 'lg' ? 'var(--space-5) var(--space-6)' : 'var(--space-6) var(--space-7)',
          border: `var(--border-width-1) solid ${error ? 'var(--color-error-500)' : 'var(--color-neutral-300)'}`,
          borderRadius: `var(--radius-${radius})`,
          backgroundColor: disabled ? 'var(--color-neutral-100)' : 'var(--color-background)',
          color: disabled ? 'var(--color-neutral-500)' : 'var(--color-foreground)',
          transition: 'all 0.2s ease',
          direction: 'ltr' as const,
          textAlign: 'left' as const,
          
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
        dropdown: {
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-neutral-200)',
          borderRadius: `var(--radius-${radius})`,
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-2)',
          marginTop: 'var(--space-1)',
          opacity: 1,
        } as React.CSSProperties,
        item: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: `var(--radius-${radius === 'xs' ? 'xs' : 'sm'})`,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          
          '&[data-selected]': {
            backgroundColor: 'var(--color-primary-500)',
            color: 'var(--color-background)',
          },
          
          '&:hover:not([data-selected])': {
            backgroundColor: 'var(--color-neutral-100)',
          },
        } as React.CSSProperties,
      };

      return baseStyles;
    };

    return (
      <MantineAutocomplete
        ref={ref}
        className={className}
        style={style}
        data={data}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        size={size}
        radius={radius}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        limit={limit}
        dropdownOpened={dropdownOpened}
        selectFirstOptionOnChange={selectFirstOptionOnChange}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default Autocomplete;
