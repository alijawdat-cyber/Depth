"use client";
import React from 'react';
import { SegmentedControl as MantineSegmentedControl } from '@mantine/core';

export type SegmentedControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SegmentedControlOrientation = 'horizontal' | 'vertical';

export interface SegmentedControlData {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Data for segments */
  data: (string | SegmentedControlData)[];
  /** Current selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Size of the control */
  size?: SegmentedControlSize;
  /** Orientation */
  orientation?: SegmentedControlOrientation;
  /** Whether control is disabled */
  disabled?: boolean;
  /** Whether control is readonly */
  readOnly?: boolean;
  /** Whether control is fullWidth */
  fullWidth?: boolean;
  /** Radius of the control */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Color when active */
  color?: string;
  /** Transition duration */
  transitionDuration?: number;
}

/**
 * SegmentedControl component for selecting between multiple options
 * Built on top of Mantine SegmentedControl with design token integration
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl({
    className,
    style,
    data,
    value,
    defaultValue,
    onChange,
    size = 'sm',
    orientation = 'horizontal',
    disabled = false,
    readOnly = false,
    fullWidth = false,
    radius = 'sm',
    color,
    transitionDuration = 200,
    ...props
  }, ref) {

    const getCustomStyles = () => {
      const baseStyles = {
        root: {
          backgroundColor: 'var(--color-neutral-100)',
          border: '1px solid var(--color-neutral-200)',
          borderRadius: `var(--radius-${radius})`,
          padding: 'var(--space-1)',
          gap: 'var(--space-1)',
        },
        label: {
          fontFamily: 'var(--font-family)',
          fontSize: size === 'xs' ? 'var(--fs-xs)' : 
                   size === 'sm' ? 'var(--fs-sm)' : 
                   size === 'md' ? 'var(--fs-md)' : 
                   size === 'lg' ? 'var(--fs-lg)' : 'var(--fs-xl)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--color-foreground)',
          padding: size === 'xs' ? 'var(--space-1) var(--space-2)' : 
                  size === 'sm' ? 'var(--space-2) var(--space-3)' : 
                  size === 'md' ? 'var(--space-3) var(--space-4)' : 
                  size === 'lg' ? 'var(--space-4) var(--space-5)' : 'var(--space-5) var(--space-6)',
          borderRadius: `var(--radius-${radius === 'xs' ? 'xs' : 'sm'})`,
          transition: `all ${transitionDuration}ms ease`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          
          '&[data-active]': {
            backgroundColor: color || 'var(--color-background)',
            color: 'var(--color-foreground)',
            boxShadow: 'var(--shadow-sm)',
            fontWeight: 'var(--fw-semibold)',
          },
          
          '&:hover:not([data-active]):not(:disabled)': {
            backgroundColor: 'var(--color-neutral-50)',
          },
          
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        } as React.CSSProperties,
        indicator: {
          backgroundColor: color || 'var(--color-background)',
          boxShadow: 'var(--shadow-sm)',
          borderRadius: `var(--radius-${radius === 'xs' ? 'xs' : 'sm'})`,
          transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        },
      };

      return baseStyles;
    };

    return (
      <MantineSegmentedControl
        ref={ref}
        className={className}
        style={style}
        data={data}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        size={size}
        orientation={orientation}
        disabled={disabled}
        readOnly={readOnly}
        fullWidth={fullWidth}
        radius={radius}
        color={color}
        transitionDuration={transitionDuration}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default SegmentedControl;
