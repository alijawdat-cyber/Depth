"use client";
import React from 'react';
import { Skeleton as MantineSkeleton } from '@mantine/core';

export interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Height of the skeleton */
  height?: number | string;
  /** Width of the skeleton */
  width?: number | string;
  /** Whether skeleton should be animated */
  animate?: boolean;
  /** Radius of the skeleton */
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether skeleton is visible */
  visible?: boolean;
  /** Content to show when not loading */
  children?: React.ReactNode;
}

export interface SkeletonTextProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Number of lines */
  lines?: number;
  /** Whether skeleton should be animated */
  animate?: boolean;
  /** Whether skeleton is visible */
  visible?: boolean;
  /** Content to show when not loading */
  children?: React.ReactNode;
}

export interface SkeletonCircleProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Size of the circle */
  size?: number;
  /** Whether skeleton should be animated */
  animate?: boolean;
  /** Whether skeleton is visible */
  visible?: boolean;
  /** Content to show when not loading */
  children?: React.ReactNode;
}

/**
 * Basic Skeleton component for loading states
 * Built on top of Mantine Skeleton with design token integration
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({
    className,
    style,
    height = 'auto',
    width = '100%',
    animate = true,
    radius = 'sm',
    visible = true,
    children,
    ...props
  }, ref) {

    const getCustomStyles = () => {
      return {
        root: {
          backgroundColor: 'var(--color-neutral-200)',
          '&::before': {
            background: animate 
              ? 'linear-gradient(90deg, transparent, var(--color-neutral-300), transparent)'
              : 'var(--color-neutral-300)',
          },
        } as React.CSSProperties,
      };
    };

    return (
      <MantineSkeleton
        ref={ref}
        className={className}
        style={style}
        height={height}
        width={width}
        animate={animate}
        radius={radius}
        visible={visible}
        styles={getCustomStyles()}
        {...props}
      >
        {children}
      </MantineSkeleton>
    );
  }
);

/**
 * Skeleton Text component for text loading states
 */
export const Skeleton_Text = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText({
    className,
    style,
    lines = 3,
    animate = true,
    visible = true,
    children,
    ...props
  }, ref) {

    if (!visible) {
      return <>{children}</>;
    }

    return (
      <div ref={ref} className={className} style={style} {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            height="1.2em"
            width={index === lines - 1 ? '75%' : '100%'}
            animate={animate}
            style={{ marginBottom: index < lines - 1 ? 'var(--space-2)' : 0 }}
          />
        ))}
      </div>
    );
  }
);

/**
 * Skeleton Circle component for avatar loading states
 */
export const Skeleton_Circle = React.forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle({
    className,
    style,
    size = 40,
    animate = true,
    visible = true,
    children,
    ...props
  }, ref) {

    return (
      <Skeleton
        ref={ref}
        className={className}
        style={style}
        height={size}
        width={size}
        radius={size / 2}
        animate={animate}
        visible={visible}
        {...props}
      >
        {children}
      </Skeleton>
    );
  }
);

export default Skeleton;
