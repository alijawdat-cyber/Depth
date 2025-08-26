"use client";
import React from 'react';
import { MultiSelect as MantineMultiSelect } from '@mantine/core';

export type MultiSelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface MultiSelectData {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface MultiSelectProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Data for multiselect options */
  data: (string | MultiSelectData)[];
  /** Current selected values */
  value?: string[];
  /** Default selected values */
  defaultValue?: string[];
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
  size?: MultiSelectSize;
  /** Radius of the input */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Change handler */
  onChange?: (values: string[]) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Maximum number of options to show */
  limit?: number;
  /** Whether to show search input */
  searchable?: boolean;
  /** Whether to hide selected options from dropdown */
  hidePickedOptions?: boolean;
  /** Text for clear all button */
  clearButtonProps?: React.ComponentPropsWithoutRef<'button'>;
}

/**
 * MultiSelect component for selecting multiple options
 * Built on top of Mantine MultiSelect with design token integration
 */
export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(
  function MultiSelect({
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
    limit = 10,
    searchable = true,
    hidePickedOptions = false,
    clearButtonProps,
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
          minHeight: size === 'xs' ? '32px' : 
                    size === 'sm' ? '36px' : 
                    size === 'md' ? '42px' : 
                    size === 'lg' ? '50px' : '60px',
          padding: size === 'xs' ? 'var(--space-1) var(--space-3)' : 
                  size === 'sm' ? 'var(--space-2) var(--space-4)' : 
                  size === 'md' ? 'var(--space-3) var(--space-5)' : 
                  size === 'lg' ? 'var(--space-4) var(--space-6)' : 'var(--space-5) var(--space-7)',
          border: `var(--border-width-1) solid ${error ? 'var(--color-error-500)' : 'var(--color-neutral-300)'}`,
          borderRadius: `var(--radius-${radius})`,
          backgroundColor: disabled ? 'var(--color-neutral-100)' : 'var(--color-background)',
          color: disabled ? 'var(--color-neutral-500)' : 'var(--color-foreground)',
          transition: 'all 0.2s ease',
          
          '&:focus': {
            borderColor: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
            boxShadow: error 
              ? '0 0 0 3px var(--color-error-100)' 
              : '0 0 0 3px var(--color-primary-100)',
            outline: 'none',
          },
        } as React.CSSProperties,
        pill: {
          backgroundColor: 'var(--color-primary-100)',
          color: 'var(--color-primary-800)',
          fontSize: 'var(--fs-xs)',
          fontWeight: 'var(--fw-medium)',
          border: '1px solid var(--color-primary-200)',
          borderRadius: `var(--radius-${radius === 'xs' ? 'xs' : 'sm'})`,
          padding: 'var(--space-1) var(--space-2)',
          margin: 'var(--space-1)',
        },
        dropdown: {
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-neutral-200)',
          borderRadius: `var(--radius-${radius})`,
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-2)',
          marginTop: 'var(--space-1)',
        },
        item: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: `var(--radius-${radius === 'xs' ? 'xs' : 'sm'})`,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          
          '&[data-selected]': {
            backgroundColor: 'var(--color-primary-50)',
            color: 'var(--color-primary-700)',
            fontWeight: 'var(--fw-medium)',
          },
          
          '&:hover:not([data-selected])': {
            backgroundColor: 'var(--color-neutral-100)',
          },
        } as React.CSSProperties,
      };

      return baseStyles;
    };

    return (
      <MantineMultiSelect
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
        searchable={searchable}
        hidePickedOptions={hidePickedOptions}
        clearButtonProps={clearButtonProps}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default MultiSelect;
