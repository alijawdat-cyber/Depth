'use client';

import React from 'react';
import { Stepper as MantineStepper } from '@mantine/core';
import type { StepperProps as MantineStepperProps } from '@mantine/core';

export interface StepperProps extends Omit<MantineStepperProps, 'size'> {
  /** Current active step */
  active: number;
  /** Callback fired when step is clicked */
  onStepClick?: (stepIndex: number) => void;
  /** Step size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Stepper orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Icon size */
  iconSize?: number;
  /** Icon position relative to step body */
  iconPosition?: 'left' | 'right';
  /** Allow clicking on future steps */
  allowNextStepsSelect?: boolean;
  /** Color of active and completed steps */
  color?: string;
  /** Completion icon */
  completedIcon?: React.ReactNode;
  /** Progress icon */
  progressIcon?: React.ReactNode;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ 
    active,
    onStepClick,
    size = 'md',
    orientation = 'horizontal',
    iconSize,
    iconPosition = 'left',
    allowNextStepsSelect = false,
    color,
    completedIcon,
    progressIcon,
    children,
    ...props 
  }, ref) => {
    return (
      <MantineStepper
        ref={ref}
        active={active}
        onStepClick={onStepClick}
        size={size}
        orientation={orientation}
        iconSize={iconSize}
        iconPosition={iconPosition}
        allowNextStepsSelect={allowNextStepsSelect}
        color={color || 'var(--depth-primary)'}
        completedIcon={completedIcon}
        progressIcon={progressIcon}
        style={{
          '--stepper-color': color || 'var(--depth-primary)',
          '--stepper-icon-size': iconSize ? `${iconSize}px` : undefined,
          ...props.style,
        }}
        {...props}
      >
        {children}
      </MantineStepper>
    );
  }
);

Stepper.displayName = 'Stepper';

// Export Step component
export const Step = MantineStepper.Step;
