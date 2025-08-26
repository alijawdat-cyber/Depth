"use client";
import React from "react";
import { TextInput } from "@mantine/core";
import { Eye, EyeOff } from "lucide-react";

export type InputFieldSize = "xs" | "sm" | "md" | "lg" | "xl";
export type InputFieldVariant = "default" | "filled" | "unstyled";
export type InputFieldType = "text" | "password" | "email" | "tel" | "search" | "url" | "number";

export interface InputFieldProps {
  /** Input size */
  fieldSize?: InputFieldSize;
  /** Input variant style */
  variant?: InputFieldVariant;
  /** Input type */
  type?: InputFieldType;
  /** Field label */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Helper text below input */
  description?: string;
  /** Error message */
  error?: string | boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Input value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Readonly state */
  readOnly?: boolean;
  /** Icon on left side */
  leftSection?: React.ReactNode;
  /** Icon on right side */
  rightSection?: React.ReactNode;
  /** Width of left section */
  leftSectionWidth?: number;
  /** Width of right section */
  rightSectionWidth?: number;
  /** Makes input take full width */
  fullWidth?: boolean;
  /** Auto complete attribute */
  autoComplete?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Maximum length */
  maxLength?: number;
  /** Minimum length */
  minLength?: number;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** ARIA label for password toggle */
  revealToggleAriaLabel?: string;
}

function sizeVars(size: InputFieldSize) {
  const sizeMap = {
    xs: { height: 'var(--field-h-xs)', fontSize: 'var(--fs-field-xs)', px: 'var(--field-px-xs)' },
    sm: { height: 'var(--field-h-sm)', fontSize: 'var(--fs-field-sm)', px: 'var(--field-px-sm)' },
    md: { height: 'var(--field-h-md)', fontSize: 'var(--fs-field-md)', px: 'var(--field-px-md)' },
    lg: { height: 'var(--field-h-lg)', fontSize: 'var(--fs-field-lg)', px: 'var(--field-px-lg)' },
    xl: { height: 'var(--field-h-xl)', fontSize: 'var(--fs-field-xl)', px: 'var(--field-px-xl)' },
  };
  
  return {
    height: sizeMap[size].height,
    fontSize: sizeMap[size].fontSize,
    paddingInline: sizeMap[size].px,
    borderRadius: 'var(--radius-md)',
    minHeight: sizeMap[size].height,
  } as React.CSSProperties;
}

function firstStrongDir(s?: string): 'rtl' | 'ltr' {
  if (!s) return 'rtl';
  for (const ch of s) {
    const code = ch.codePointAt(0) ?? 0;
    // Arabic range
    if (code >= 0x0600 && code <= 0x06FF) return 'rtl';
    // Latin letters
    if ((code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)) return 'ltr';
    // Digits and common LTR symbols (+ for phone, @ . for emails)
    if ((code >= 0x30 && code <= 0x39) || ch === '+' || ch === '@' || ch === '.') return 'ltr';
  }
  return 'rtl';
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { 
    className, 
    fieldSize = 'md', 
    variant = 'default',
    type = 'text',
    label, 
    required,
    description, 
    error, 
    placeholder,
    value,
    defaultValue,
    disabled,
    readOnly,
    leftSection, 
    rightSection,
    leftSectionWidth,
    rightSectionWidth,
    fullWidth = true,
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    style, 
    onChange, 
    onFocus,
    onBlur,
    onKeyDown,
    revealToggleAriaLabel = 'إظهار/إخفاء كلمة المرور',
    'aria-label': ariaLabel,
    ...props 
  }, ref
) {
  // تحديد الاتجاه حسب المحتوى، مع استثناءات لكلمات المرور والإيميل
  const getDirection = (inputType: InputFieldType, content?: string): 'rtl' | 'ltr' => {
    if (inputType === 'password' || inputType === 'email' || inputType === 'tel' || inputType === 'url' || inputType === 'number') {
      return 'ltr';
    }
    return firstStrongDir(content);
  };

  const [dir, setDir] = React.useState<'rtl'|'ltr'>(
    getDirection(type, (value as string) ?? (defaultValue as string))
  );
  
  React.useEffect(() => {
    setDir(getDirection(type, (value as string) ?? (defaultValue as string)));
  }, [value, defaultValue, type]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDir(getDirection(type, event.currentTarget.value));
    onChange?.(event);
  };

  const getSectionWidth = (size: InputFieldSize) => {
    const widthMap = { xs: 28, sm: 32, md: 36, lg: 40, xl: 44 };
    return widthMap[size];
  };

  const sectionWidth = getSectionWidth(fieldSize);
  const iconSizeVar = `var(--field-icon-${fieldSize})`;

  const baseStyles = {
    backgroundColor: variant === 'filled' ? 'var(--color-bg-subtle)' : 'var(--color-bg-elevated)',
    color: 'var(--color-fg-primary)',
    border: variant === 'default' ? '1px solid var(--color-bd-default)' : 
            variant === 'filled' ? '1px solid transparent' : 'none',
    direction: dir,
    textAlign: dir === 'ltr' ? 'left' : 'right',
    unicodeBidi: 'plaintext',
    ...sizeVars(fieldSize),
    width: fullWidth ? '100%' : 'auto',
    ...(style || {}),
  } as React.CSSProperties;

  // Handle password type specifically
  const isPassword = type === 'password';
  const [revealed, setRevealed] = React.useState(false);

  // Password toggle button
  const passwordToggle = isPassword ? (
    <button
      type="button"
      aria-label={revealToggleAriaLabel}
      onClick={() => setRevealed(v => !v)}
      className="depth-password-toggle"
    >
      {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  ) : null;

  // Determine sections based on direction and password toggle
  const finalLeftSection = dir === 'ltr' ? leftSection : rightSection;
  const finalRightSection = dir === 'ltr' ? 
    (isPassword ? passwordToggle : rightSection) : 
    (isPassword ? passwordToggle : leftSection);

  const actualType = isPassword ? (revealed ? 'text' : 'password') : type;

  return (
    <TextInput
      ref={ref}
      type={actualType}
      label={label}
      required={required}
      description={description}
      error={error}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      readOnly={readOnly}
      leftSection={finalLeftSection}
      rightSection={finalRightSection}
      leftSectionWidth={leftSectionWidth || sectionWidth}
      rightSectionWidth={rightSectionWidth || sectionWidth}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      maxLength={maxLength}
      minLength={minLength}
      className={className}
      aria-label={ariaLabel}
      styles={{
        root: { 
          width: fullWidth ? '100%' : 'auto',
        },
        wrapper: {
          width: fullWidth ? '100%' : 'auto',
        },
        input: {
          ...baseStyles,
          '&::placeholder': { 
            color: 'var(--color-fg-secondary)',
            opacity: 0.6,
          },
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--color-primary)',
            boxShadow: `0 0 0 1px var(--color-primary)`,
          },
          '&:focus-visible': {
            outline: '2px solid var(--color-primary)',
            outlineOffset: '0px',
          },
          '&[data-invalid]': {
            borderColor: 'var(--color-danger)',
            '&:focus': {
              borderColor: 'var(--color-danger)',
              boxShadow: `0 0 0 1px var(--color-danger)`,
            },
          },
          '&:disabled': {
            backgroundColor: 'var(--color-bg-disabled)',
            color: 'var(--color-fg-disabled)',
            cursor: 'not-allowed',
            opacity: 0.6,
          },
        },
        section: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& svg': {
            width: iconSizeVar,
            height: iconSizeVar,
          },
          '& .depth-password-toggle': {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-fg-secondary)',
            '&:hover': {
              color: 'var(--color-fg-primary)',
            },
            '& svg': {
              width: iconSizeVar,
              height: iconSizeVar,
            },
          },
        },
        label: { 
          fontWeight: 600, 
          marginBottom: '0.25rem',
          color: 'var(--color-fg-primary)',
        },
        description: { 
          color: 'var(--color-fg-secondary)',
          fontSize: 'var(--fs-sm)',
          marginTop: '0.25rem',
        },
        error: { 
          color: 'var(--color-danger)',
          fontSize: 'var(--fs-sm)',
          marginTop: '0.25rem',
        }
      }}
      variant={variant}
      size={fieldSize}
      onChange={handleChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
});

export default InputField;
