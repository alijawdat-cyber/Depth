'use client';

import React from 'react';
import { Alert as MantineAlert } from '@mantine/core';
import type { AlertProps as MantineAlertProps } from '@mantine/core';

export interface AlertProps extends Omit<MantineAlertProps, 'variant' | 'color'> {
  /** Alert variant */
  variant?: 'light' | 'filled' | 'outline' | 'white';
  /** Alert color theme */
  color?: 'info' | 'success' | 'warning' | 'error' | string;
  /** Alert title */
  title?: React.ReactNode;
  /** Alert icon */
  icon?: React.ReactNode;
  /** Whether alert can be closed */
  withCloseButton?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Alert content */
  children?: React.ReactNode;
}

const getAlertColor = (color?: string) => {
  switch (color) {
    case 'info':
      return 'blue';
    case 'success':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    default:
      return color || 'blue';
  }
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'light',
    color = 'info',
    title,
    icon,
    withCloseButton = false,
    onClose,
    children,
    ...props 
  }, ref) => {
    const mantineColor = getAlertColor(color);
    
    return (
      <MantineAlert
        ref={ref}
        variant={variant}
        color={mantineColor}
        title={title}
        icon={icon}
        withCloseButton={withCloseButton}
        onClose={onClose}
        style={{
          '--alert-bg': color === 'info' ? 'var(--depth-info-subtle)' : 
                      color === 'success' ? 'var(--depth-success-subtle)' :
                      color === 'warning' ? 'var(--depth-warning-subtle)' :
                      color === 'error' ? 'var(--depth-error-subtle)' : undefined,
          '--alert-color': color === 'info' ? 'var(--depth-info)' : 
                          color === 'success' ? 'var(--depth-success)' :
                          color === 'warning' ? 'var(--depth-warning)' :
                          color === 'error' ? 'var(--depth-error)' : undefined,
          '--alert-border': color === 'info' ? 'var(--depth-info)' : 
                           color === 'success' ? 'var(--depth-success)' :
                           color === 'warning' ? 'var(--depth-warning)' :
                           color === 'error' ? 'var(--depth-error)' : undefined,
          ...props.style,
        }}
        {...props}
      >
        {children}
      </MantineAlert>
    );
  }
);

Alert.displayName = 'Alert';
