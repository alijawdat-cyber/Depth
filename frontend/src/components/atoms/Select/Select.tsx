"use client";
import React from "react";
import { Select as MantineSelect } from "@mantine/core";
import { ChevronDown } from "lucide-react";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  className?: string;
  style?: React.CSSProperties;
  fieldSize?: SelectSize;
  label?: string;
  helperText?: string;
  error?: string;
  data: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | null, option: SelectOption | null) => void;
  leftIcon?: React.ReactNode;
  allowDeselect?: boolean;
  nothingFoundMessage?: string;
  maxDropdownHeight?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

function sizeVars(size: SelectSize) {
  return {
    height: `var(--field-h-${size})`,
    fontSize: `var(--fs-field-${size})`,
  } as React.CSSProperties;
}

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(function Select(
  { 
    className, 
    fieldSize = 'md', 
    label, 
    helperText, 
    error, 
    data,
    placeholder = "اختر من القائمة...",
    searchable = false,
    clearable = false,
    value, 
    defaultValue, 
    onChange,
    leftIcon,
    allowDeselect = true,
    nothingFoundMessage = "لا توجد نتائج",
    maxDropdownHeight = 220,
    disabled = false,
    required = false,
    style,
    name,
    id
  }, ref) {
  
  const sectionWidth = fieldSize === 'sm' ? 32 : fieldSize === 'lg' ? 40 : 36;
  const basePadding = `var(--field-px-${fieldSize})`;
  const hasLeftSection = Boolean(leftIcon);

  return (
    <MantineSelect
      ref={ref}
      data={data}
      value={value}
      defaultValue={defaultValue}
      onChange={(val, option) => {
        onChange?.(val, option as SelectOption | null);
      }}
      label={label}
      description={helperText}
      error={error}
      placeholder={placeholder}
      searchable={searchable}
      clearable={clearable}
      leftSection={leftIcon}
      rightSection={<ChevronDown size={16} />}
      leftSectionWidth={sectionWidth}
      rightSectionWidth={sectionWidth}
      allowDeselect={allowDeselect}
      nothingFoundMessage={nothingFoundMessage}
      maxDropdownHeight={maxDropdownHeight}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
      className={className}
      styles={{
        root: { width: '100%' },
        input: {
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-fg-primary)',
          border: '1px solid var(--color-bd-default)',
          borderRadius: 'var(--radius-md)',
          direction: 'rtl',
          textAlign: 'right',
          ...sizeVars(fieldSize),
          paddingInlineStart: hasLeftSection ? `calc(${basePadding} + ${sectionWidth}px)` : basePadding,
          paddingInlineEnd: `calc(${basePadding} + ${sectionWidth}px)`,
          '&::placeholder': { 
            color: 'var(--color-fg-secondary)' 
          },
          '&:focus': {
            outline: '2px solid var(--color-primary)',
            outlineOffset: '0px',
            borderColor: 'var(--color-primary)'
          },
          ...(style || {}),
        },
        section: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-fg-secondary)',
          width: `${sectionWidth}px`,
          '& svg': {
            width: `var(--field-icon-${fieldSize})`,
            height: `var(--field-icon-${fieldSize})`,
          },
        },
        dropdown: {
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-bd-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--elevation-2)',
        },
        option: {
          backgroundColor: 'transparent',
          color: 'var(--color-fg-primary)',
          direction: 'rtl',
          textAlign: 'right',
          '&[data-selected]': {
            backgroundColor: 'var(--color-action-primary-bg)',
            color: 'var(--color-action-primary-fg)',
          },
          '&:hover:not([data-selected])': {
            backgroundColor: 'var(--color-action-ghost-hover)',
          }
        },
        label: { 
          fontWeight: 600, 
          marginBottom: '4px',
          direction: 'rtl',
          textAlign: 'right'
        },
        description: { 
          color: 'var(--color-fg-secondary)',
          direction: 'rtl',
          textAlign: 'right'
        },
        error: { 
          marginTop: '4px',
          direction: 'rtl',
          textAlign: 'right'
        }
      }}
    />
  );
});

export default Select;
