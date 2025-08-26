"use client";
import React from 'react';
import { Divider as MantineDivider } from '@mantine/core';

export type DividerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Divider orientation */
  orientation?: DividerOrientation;
  /** Size/thickness of the divider */
  size?: DividerSize;
  /** Visual variant of the line */
  variant?: DividerVariant;
  /** Color theme */
  color?: DividerColor;
  /** Label text to display in the center */
  label?: React.ReactNode;
  /** Position of the label */
  labelPosition?: 'left' | 'center' | 'right';
  /** Margin around the divider */
  my?: number | string;
  /** Margin horizontal */
  mx?: number | string;
}

/**
 * Divider component for visual separation of content
 * Built on top of Mantine Divider with design token integration
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  function Divider({
    className,
    style,
    orientation = 'horizontal',
    size = 'xs',
    variant = 'solid',
    color = 'neutral',
    label,
    labelPosition = 'center',
    my,
    mx,
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
        case 'neutral':
          return 'gray';
        default:
          return 'gray';
      }
    };

    const getCustomStyles = () => {
      const baseStyles = {
        root: {
          borderColor: `var(--color-${
            color === 'primary' ? 'primary' : 
            color === 'success' ? 'success' : 
            color === 'warning' ? 'warning' : 
            color === 'error' ? 'error' : 'neutral'
          }-${color === 'neutral' ? '300' : '400'})`,
          borderStyle: variant,
          borderWidth: orientation === 'horizontal' 
            ? `${size === 'xs' ? '0.5px' : size === 'sm' ? '1px' : size === 'md' ? '1.5px' : size === 'lg' ? '2px' : '2.5px'} 0 0 0`
            : `0 0 0 ${size === 'xs' ? '0.5px' : size === 'sm' ? '1px' : size === 'md' ? '1.5px' : size === 'lg' ? '2px' : '2.5px'}`,
        },
        label: {
          fontFamily: 'var(--font-family)',
          fontSize: 'var(--fs-sm)',
          fontWeight: 500,
          color: `var(--color-${
            color === 'primary' ? 'primary' : 
            color === 'success' ? 'success' : 
            color === 'warning' ? 'warning' : 
            color === 'error' ? 'error' : 'neutral'
          }-${color === 'neutral' ? '600' : '700'})`,
          padding: '0 var(--space-3)',
          backgroundColor: 'var(--color-background)',
        } as React.CSSProperties,
      };

      return baseStyles;
    };

    return (
      <MantineDivider
        ref={ref}
        className={className}
        style={style}
        orientation={orientation}
        size={size}
        color={getMantineColor()}
        label={label}
        labelPosition={labelPosition}
        my={my}
        mx={mx}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default Divider;
