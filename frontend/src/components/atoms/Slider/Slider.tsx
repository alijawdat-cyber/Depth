"use client";
import React from 'react';
import { Slider as MantineSlider, RangeSlider } from '@mantine/core';

export type SliderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface SliderProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Current value */
  value?: number;
  /** Default value for uncontrolled component */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Size of the slider */
  size?: SliderSize;
  /** Color theme */
  color?: SliderColor;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Show marks on track */
  marks?: Array<{ value: number; label?: string }>;
  /** Show value label */
  showLabelOnHover?: boolean;
  /** Always show value label */
  labelAlwaysOn?: boolean;
  /** Custom label formatter */
  labelFormat?: (value: number) => string;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Change end handler (when user stops dragging) */
  onChangeEnd?: (value: number) => void;
}

export interface RangeSliderProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Current value range */
  value?: [number, number];
  /** Default value range for uncontrolled component */
  defaultValue?: [number, number];
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Size of the slider */
  size?: SliderSize;
  /** Color theme */
  color?: SliderColor;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Show marks on track */
  marks?: Array<{ value: number; label?: string }>;
  /** Show value label */
  showLabelOnHover?: boolean;
  /** Always show value label */
  labelAlwaysOn?: boolean;
  /** Custom label formatter */
  labelFormat?: (value: number) => string;
  /** Change handler */
  onChange?: (value: [number, number]) => void;
  /** Change end handler (when user stops dragging) */
  onChangeEnd?: (value: [number, number]) => void;
}

/**
 * Slider component for numeric value selection
 * Built on top of Mantine Slider with design token integration
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  function Slider({
    className,
    style,
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    error,
    marks,
    showLabelOnHover = true,
    labelAlwaysOn = false,
    onChange,
    onChangeEnd,
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
        track: {
          backgroundColor: 'var(--color-neutral-200)',
        },
        bar: {
          backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                        color === 'success' ? 'success' : 
                                        color === 'warning' ? 'warning' : 
                                        color === 'error' ? 'error' : 'neutral'}-500)`,
        },
        thumb: {
          backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                        color === 'success' ? 'success' : 
                                        color === 'warning' ? 'warning' : 
                                        color === 'error' ? 'error' : 'neutral'}-500)`,
          borderColor: `var(--color-${color === 'primary' ? 'primary' : 
                                     color === 'success' ? 'success' : 
                                     color === 'warning' ? 'warning' : 
                                     color === 'error' ? 'error' : 'neutral'}-500)`,
          '&:hover': {
            transform: 'scale(1.1)',
          },
          '&:focus': {
            boxShadow: `0 0 0 2px var(--color-${color === 'primary' ? 'primary' : 
                                                color === 'success' ? 'success' : 
                                                color === 'warning' ? 'warning' : 
                                                color === 'error' ? 'error' : 'neutral'}-200)`,
          },
        },
        markLabel: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-text-secondary)',
        },
      };

      return baseStyles;
    };

    return (
      <div>
        {label && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-base)',
            fontWeight: 600,
            marginBottom: 'var(--space-2)',
          }}>
            {label}
          </div>
        )}
        {description && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-sm)',
            marginBottom: 'var(--space-3)',
          }}>
            {description}
          </div>
        )}
        <MantineSlider
          ref={ref}
          className={className}
          style={style}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          size={size}
          color={getMantineColor()}
          marks={marks}
          showLabelOnHover={showLabelOnHover}
          labelAlwaysOn={labelAlwaysOn}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
          styles={getCustomStyles()}
          {...props}
        />
        {error && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-sm)',
            marginTop: 'var(--space-2)',
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

/**
 * Range Slider component for selecting value ranges
 */
export const Slider_Range = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  function SliderRange({
    className,
    style,
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    size = 'md',
    color = 'primary',
    label,
    description,
    error,
    marks,
    showLabelOnHover = true,
    labelAlwaysOn = false,
    onChange,
    onChangeEnd,
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
        track: {
          backgroundColor: 'var(--color-neutral-200)',
        },
        bar: {
          backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                        color === 'success' ? 'success' : 
                                        color === 'warning' ? 'warning' : 
                                        color === 'error' ? 'error' : 'neutral'}-500)`,
        },
        thumb: {
          backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                        color === 'success' ? 'success' : 
                                        color === 'warning' ? 'warning' : 
                                        color === 'error' ? 'error' : 'neutral'}-500)`,
          borderColor: `var(--color-${color === 'primary' ? 'primary' : 
                                     color === 'success' ? 'success' : 
                                     color === 'warning' ? 'warning' : 
                                     color === 'error' ? 'error' : 'neutral'}-500)`,
          '&:hover': {
            transform: 'scale(1.1)',
          },
          '&:focus': {
            boxShadow: `0 0 0 2px var(--color-${color === 'primary' ? 'primary' : 
                                                color === 'success' ? 'success' : 
                                                color === 'warning' ? 'warning' : 
                                                color === 'error' ? 'error' : 'neutral'}-200)`,
          },
        },
        markLabel: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-text-secondary)',
        },
      };

      return baseStyles;
    };

    return (
      <div>
        {label && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-base)',
            fontWeight: 600,
            marginBottom: 'var(--space-2)',
          }}>
            {label}
          </div>
        )}
        {description && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-sm)',
            marginBottom: 'var(--space-3)',
          }}>
            {description}
          </div>
        )}
        <RangeSlider
          ref={ref}
          className={className}
          style={style}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          size={size}
          color={getMantineColor()}
          marks={marks}
          showLabelOnHover={showLabelOnHover}
          labelAlwaysOn={labelAlwaysOn}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
          styles={getCustomStyles()}
          {...props}
        />
        {error && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-sm)',
            marginTop: 'var(--space-2)',
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

export default Slider;
