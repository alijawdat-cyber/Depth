'use client';

import React from 'react';
import { Notification as MantineNotification } from '@mantine/core';
import type { NotificationProps as MantineNotificationProps } from '@mantine/core';

export interface NotificationProps extends Omit<MantineNotificationProps, 'color'> {
  /** Notification variant */
  variant?: 'light' | 'filled' | 'outline';
  /** Notification color theme */
  color?: 'info' | 'success' | 'warning' | 'error' | string;
  /** Notification title */
  title?: React.ReactNode;
  /** Notification icon */
  icon?: React.ReactNode;
  /** Whether notification can be closed */
  withCloseButton?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Notification content */
  children?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Auto close after specified time (ms) */
  autoClose?: number | boolean;
}

const getNotificationColor = (color?: string) => {
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

export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ 
    variant = 'light',
    color = 'info',
    title,
    icon,
    withCloseButton = true,
    onClose,
    loading = false,
    autoClose,
    children,
    ...props 
  }, ref) => {
    const mantineColor = getNotificationColor(color);
    
    // Handle auto close
    React.useEffect(() => {
      if (autoClose && typeof autoClose === 'number' && onClose) {
        const timer = setTimeout(onClose, autoClose);
        return () => clearTimeout(timer);
      }
    }, [autoClose, onClose]);
    
    return (
      <MantineNotification
        ref={ref}
        color={mantineColor}
        title={title}
        icon={icon}
        withCloseButton={withCloseButton}
        onClose={onClose}
        loading={loading}
        style={{
          '--notification-bg': color === 'info' ? 'var(--depth-info-subtle)' : 
                              color === 'success' ? 'var(--depth-success-subtle)' :
                              color === 'warning' ? 'var(--depth-warning-subtle)' :
                              color === 'error' ? 'var(--depth-error-subtle)' : undefined,
          '--notification-color': color === 'info' ? 'var(--depth-info)' : 
                                 color === 'success' ? 'var(--depth-success)' :
                                 color === 'warning' ? 'var(--depth-warning)' :
                                 color === 'error' ? 'var(--depth-error)' : undefined,
          '--notification-border': color === 'info' ? 'var(--depth-info)' : 
                                  color === 'success' ? 'var(--depth-success)' :
                                  color === 'warning' ? 'var(--depth-warning)' :
                                  color === 'error' ? 'var(--depth-error)' : undefined,
          ...props.style,
        }}
        {...props}
      >
        {children}
      </MantineNotification>
    );
  }
);

Notification.displayName = 'Notification';
