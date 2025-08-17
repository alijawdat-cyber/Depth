// Component مشترك للحقول مع تصميم موحد واحترافي
'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useState, forwardRef } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  required?: boolean;
  description?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

interface TextareaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  required?: boolean;
  description?: string;
}

// Container عام للحقول
export function FormField({ 
  label, 
  required, 
  error, 
  success, 
  description, 
  children, 
  className = '' 
}: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      {/* Label */}
      <label className="block text-sm font-medium text-[var(--text)]">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      {/* Description */}
      {description && (
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          {description}
        </p>
      )}

      {/* Field Content */}
      <div className="relative">
        {children}
        
        {/* Success Indicator */}
        {success && !error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          >
            <Check size={16} className="text-green-500" />
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-600"
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Input Field مع تصميم احترافي
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    label, 
    value, 
    onChange, 
    error, 
    success, 
    required, 
    description, 
    icon, 
    showPasswordToggle,
    type = 'text',
    className = '',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <FormField
        label={label}
        required={required}
        error={error}
        success={success}
        description={description}
        className={className}
      >
        <div className="relative">
          {/* Right Icon */}
          {icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]">
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-200
              ${icon ? 'pr-12' : ''}
              ${showPasswordToggle ? 'pl-12' : ''}
              ${error 
                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : success
                ? 'border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500'
                : 'border-[var(--border)] bg-[var(--bg)] focus:ring-[var(--accent-500)] focus:border-[var(--accent-500)]'
              }
              text-[var(--text)] placeholder-[var(--muted)]
              focus:ring-2 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </FormField>
    );
  }
);

InputField.displayName = 'InputField';

// Textarea Field
export function TextareaField({ 
  label, 
  value, 
  onChange, 
  error, 
  success, 
  required, 
  description, 
  className = '',
  rows = 4,
  ...props 
}: TextareaFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      success={success}
      description={description}
      className={className}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none
          ${error 
            ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
            : success
            ? 'border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500'
            : 'border-[var(--border)] bg-[var(--bg)] focus:ring-[var(--accent-500)] focus:border-[var(--accent-500)]'
          }
          text-[var(--text)] placeholder-[var(--muted)]
          focus:ring-2 focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        {...props}
      />
    </FormField>
  );
}

// Checkbox Field مع تصميم جميل
interface CheckboxFieldProps {
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  description?: string | React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CheckboxField({ 
  label, 
  value, 
  onChange, 
  description, 
  error, 
  required, 
  disabled 
}: CheckboxFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div 
        className={`
          flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-alt)]'}
          ${error ? 'border-red-300 bg-red-50' : 'border-[var(--border)] bg-[var(--card)]'}
          ${value ? 'ring-2 ring-[var(--accent-500)]/20' : ''}
        `}
        onClick={() => !disabled && onChange(!value)}
      >
        {/* Custom Checkbox */}
        <div className={`
          w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center mt-0.5
          ${value 
            ? 'bg-[var(--accent-500)] border-[var(--accent-500)]' 
            : 'border-[var(--border)] bg-[var(--bg)]'
          }
        `}>
          {value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Check size={14} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* Label & Description */}
        <div className="flex-1">
          <label className={`block text-sm font-medium cursor-pointer ${
            error ? 'text-red-700' : 'text-[var(--text)]'
          }`}>
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </label>
          {description && (
            <p className={`text-xs mt-1 leading-relaxed ${
              error ? 'text-red-600' : 'text-[var(--muted)]'
            }`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-600 px-2"
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Select Field مخصص
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  success?: boolean;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({ 
  label, 
  value, 
  onChange, 
  options, 
  error, 
  success, 
  required, 
  description, 
  placeholder = 'اختر...', 
  disabled 
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      error={error}
      success={success}
      description={description}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200 appearance-none
          ${error 
            ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
            : success
            ? 'border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500'
            : 'border-[var(--border)] bg-[var(--bg)] focus:ring-[var(--accent-500)] focus:border-[var(--accent-500)]'
          }
          text-[var(--text)]
          focus:ring-2 focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom Arrow */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-[var(--muted)]">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </div>
    </FormField>
  );
}
