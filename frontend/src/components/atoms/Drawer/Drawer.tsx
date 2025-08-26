'use client';

import React from 'react';
import { Drawer as MantineDrawer } from '@mantine/core';
import type { DrawerProps as MantineDrawerProps } from '@mantine/core';

export interface DrawerProps extends Omit<MantineDrawerProps, 'size'> {
  /** Whether the drawer is opened */
  opened: boolean;
  /** Called when drawer should be closed */
  onClose: () => void;
  /** Drawer title */
  title?: React.ReactNode;
  /** Drawer position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Drawer size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string | number;
  /** Whether to show close button */
  withCloseButton?: boolean;
  /** Whether clicking overlay should close drawer */
  closeOnClickOutside?: boolean;
  /** Whether pressing escape should close drawer */
  closeOnEscape?: boolean;
  /** Drawer content */
  children?: React.ReactNode;
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ 
    opened,
    onClose,
    title,
    position = 'right',
    size = 'md',
    withCloseButton = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    children,
    ...props 
  }, ref) => {
    return (
      <MantineDrawer
        ref={ref}
        opened={opened}
        onClose={onClose}
        title={title}
        position={position}
        size={size}
        withCloseButton={withCloseButton}
        closeOnClickOutside={closeOnClickOutside}
        closeOnEscape={closeOnEscape}
        style={{
          '--drawer-bg': 'var(--depth-surface)',
          '--drawer-border': 'var(--depth-border)',
          '--drawer-shadow': 'var(--depth-shadow-lg)',
          ...props.style,
        }}
        {...props}
      >
        {children}
      </MantineDrawer>
    );
  }
);

Drawer.displayName = 'Drawer';
