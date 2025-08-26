"use client";
import React from 'react';
import { Progress as MantineProgress, RingProgress } from '@mantine/core';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface ProgressProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Progress value (0-100) */
  value: number;
  /** Size of the progress bar */
  size?: ProgressSize;
  /** Color theme */
  color?: ProgressColor;
  /** Radius of the progress bar */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show stripes animation */
  striped?: boolean;
  /** Whether to animate stripes */
  animate?: boolean;
  /** Label text */
  label?: string;
}

export interface RingProgressProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Progress sections */
  sections: Array<{
    value: number;
    color?: ProgressColor;
  }>;
  /** Size of the ring */
  size?: number;
  /** Thickness of the ring */
  thickness?: number;
  /** Color theme for single section */
  color?: ProgressColor;
  /** Label content */
  label?: React.ReactNode;
  /** Root color */
  rootColor?: string;
}

/**
 * Progress component for showing completion status
 * Built on top of Mantine Progress with design token integration
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress({
    className,
    style,
    value,
    size = 'md',
    color = 'primary',
    radius = 'sm',
    striped = false,
    animate = false,
    label,
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
          backgroundColor: 'var(--color-neutral-200)',
          overflow: 'hidden',
        },
        bar: {
          backgroundColor: `var(--color-${color === 'primary' ? 'primary' : 
                                        color === 'success' ? 'success' : 
                                        color === 'warning' ? 'warning' : 
                                        color === 'error' ? 'error' : 'neutral'}-500)`,
          transition: 'width 0.3s ease',
        },
      };

      return baseStyles;
    };

    return (
      <div>
        {label && (
          <div style={{
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 500,
            marginBottom: 'var(--space-2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{label}</span>
            <span>{value}%</span>
          </div>
        )}
        <MantineProgress
          ref={ref}
          className={className}
          style={style}
          value={value}
          size={size}
          color={getMantineColor()}
          radius={radius}
          striped={striped}
          animated={animate}
          styles={getCustomStyles()}
          {...props}
        />
      </div>
    );
  }
);

/**
 * Ring Progress component for circular progress display
 */
export const Progress_Ring = React.forwardRef<HTMLDivElement, RingProgressProps>(
  function ProgressRing({
    className,
    style,
    sections,
    size = 120,
    thickness = 12,
    color = 'primary',
    label,
    rootColor,
    ...props
  }, ref) {

    const getMantineColor = (sectionColor?: ProgressColor) => {
      const targetColor = sectionColor || color;
      switch (targetColor) {
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

    const processedSections = sections.map(section => ({
      value: section.value,
      color: getMantineColor(section.color),
    }));

    const getCustomStyles = () => {
      const baseStyles = {
        root: {
          fontFamily: 'var(--font-family)',
        },
      };

      return baseStyles;
    };

    return (
      <RingProgress
        ref={ref}
        className={className}
        style={style}
        sections={processedSections}
        size={size}
        thickness={thickness}
        label={label}
        rootColor={rootColor || 'var(--color-neutral-200)'}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default Progress;
