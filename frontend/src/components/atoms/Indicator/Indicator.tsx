'use client';

import React from 'react';
import { Indicator as MantineIndicator } from '@mantine/core';
import type { IndicatorProps as MantineIndicatorProps } from '@mantine/core';

export interface IndicatorProps extends Omit<MantineIndicatorProps, 'size' | 'color'> {
  /** Indicator size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Indicator color */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
  /** Indicator position */
  position?: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start' | 'top-center' | 'bottom-center' | 'middle-end' | 'middle-start';
  /** Whether indicator should be shown */
  disabled?: boolean;
  /** Content inside indicator */
  label?: React.ReactNode;
  /** Whether to show dot */
  dot?: boolean;
  /** Element to wrap with indicator */
  children: React.ReactNode;
  /** Indicator offset */
  offset?: number;
  /** Indicator border width */
  withBorder?: boolean;
  /** Processing animation */
  processing?: boolean;
}

const getIndicatorColor = (color?: string) => {
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
    case 'info':
      return 'blue';
    default:
      return color || 'red';
  }
};

export const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ 
    size = 'md',
    color = 'error',
    position = 'top-end',
    disabled = false,
    label,
    offset = 0,
    withBorder = false,
    processing = false,
    children,
    ...props 
  }, ref) => {
    const mantineColor = getIndicatorColor(color);
    
    return (
      <MantineIndicator
        ref={ref}
        size={size}
        color={mantineColor}
        position={position}
        disabled={disabled}
        label={label}
        offset={offset}
        withBorder={withBorder}
        processing={processing}
        style={{
          '--indicator-color': color === 'primary' ? 'var(--depth-primary)' :
                               color === 'secondary' ? 'var(--depth-text-secondary)' :
                               color === 'success' ? 'var(--depth-success)' :
                               color === 'warning' ? 'var(--depth-warning)' :
                               color === 'error' ? 'var(--depth-error)' :
                               color === 'info' ? 'var(--depth-info)' : undefined,
          ...props.style,
        }}
        {...props}
      >
        {children}
      </MantineIndicator>
    );
  }
);

Indicator.displayName = 'Indicator';
