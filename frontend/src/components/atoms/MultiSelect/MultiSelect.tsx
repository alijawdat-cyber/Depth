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
          marginBottom: 'var(--space-sm)',                     /* 8px - مسافة صغيرة من tokens.css */
        },
        description: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-text-muted)',                   /* نص خافت من tokens.css */
          marginTop: 'var(--space-xs)',                        /* 4px - مسافة صغيرة جداً من tokens.css */
        },
        error: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-error)',                        /* لون خطأ من tokens.css */
          marginTop: 'var(--space-xs)',                        /* 4px - مسافة صغيرة جداً من tokens.css */
        },
        input: {
          fontFamily: 'var(--font-family)',
          fontSize: size === 'xs' ? 'var(--fs-xs)' : 
                   size === 'sm' ? 'var(--fs-sm)' : 
                   size === 'md' ? 'var(--fs-md)' : 
                   size === 'lg' ? 'var(--fs-lg)' : 'var(--fs-xl)',
          minHeight: size === 'xs' ? 'var(--height-input-sm)' :     /* الحد الأدنى للارتفاع من tokens.css */
                    size === 'sm' ? 'var(--height-input-sm)' : 
                    size === 'md' ? 'var(--height-input-md)' : 
                    size === 'lg' ? 'var(--height-input-lg)' : 'var(--height-input-lg)', /* أحجام موحدة من tokens.css */
          padding: size === 'xs' ? 'var(--space-xs) var(--space-md)' :     /* مسافات من tokens.css */
                  size === 'sm' ? 'var(--space-sm) var(--space-lg)' : 
                  size === 'md' ? 'var(--space-md) var(--space-xl)' : 
                  size === 'lg' ? 'var(--space-lg) var(--space-xl)' : 'var(--space-xl) var(--space-2xl)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border-primary)'}`, /* حدود من tokens.css */
          borderRadius: `var(--radius-md)`,                     /* زوايا متوسطة من tokens.css */
          backgroundColor: disabled ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)', /* خلفيات من tokens.css */
          color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)', /* ألوان نص من tokens.css */
          transition: 'all 0.2s ease',
          
          '&:focus': {
            borderColor: error ? 'var(--color-error)' : 'var(--color-primary)', /* ألوان من tokens.css */
            boxShadow: error 
              ? '0 0 0 3px var(--color-error-light)'           /* لون خطأ فاتح من tokens.css */
              : '0 0 0 3px var(--color-primary-light)',        /* لون أساسي فاتح من tokens.css */
            outline: 'none',
          },
        } as React.CSSProperties,
        pill: {
          backgroundColor: 'var(--color-primary)',             /* لون أساسي من tokens.css */
          color: 'var(--color-text-inverse)',                  /* نص أبيض من tokens.css */
          fontSize: 'var(--fs-xs)',                            /* حجم خط صغير من tokens.css */
          fontWeight: 600,                                     /* وزن خط ثابت */
          border: '1px solid var(--color-primary-hover)',     /* حدود بلون أساسي داكن من tokens.css */
          borderRadius: 'var(--radius-sm)',                   /* زوايا صغيرة من tokens.css */
          padding: 'var(--space-xs) var(--space-sm)',         /* مسافات من tokens.css */
          margin: 'var(--space-xs)',                          /* هامش صغير من tokens.css */
        },
        dropdown: {
          backgroundColor: 'var(--color-bg-secondary)',       /* خلفية ثانوية من tokens.css */
          border: '1px solid var(--color-border-primary)',    /* حدود من tokens.css */
          borderRadius: 'var(--radius-md)',                   /* زوايا متوسطة من tokens.css */
          boxShadow: 'var(--shadow-lg)',                      /* ظل كبير من tokens.css */
          padding: 'var(--space-sm)',                         /* مسافة صغيرة من tokens.css */
          marginTop: 'var(--space-xs)',                       /* مسافة صغيرة جداً من tokens.css */
        },
        item: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          padding: 'var(--space-sm) var(--space-md)',         /* مسافات من tokens.css */
          borderRadius: 'var(--radius-sm)',                   /* زوايا صغيرة من tokens.css */
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          
          '&[data-selected]': {
            backgroundColor: 'var(--color-primary-light)',     /* لون أساسي فاتح من tokens.css */
            color: 'var(--color-primary)',                  /* لون أساسي من tokens.css */
            fontWeight: 'var(--fw-medium)',
          },
          
          '&:hover:not([data-selected])': {
            backgroundColor: 'var(--color-bg-secondary)',       /* خلفية ثانوية من tokens.css */
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
