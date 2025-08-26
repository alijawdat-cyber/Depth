'use client';

import React from 'react';
import { Burger as MantineBurger } from '@mantine/core';
import type { BurgerProps as MantineBurgerProps } from '@mantine/core';

export interface BurgerProps extends Omit<MantineBurgerProps, 'size'> {
  /** Whether the burger is opened */
  opened: boolean;
  /** Function to toggle burger state */
  onClick?: () => void;
  /** Size of the burger */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Color of the burger lines */
  color?: string;
  /** Transition duration in ms */
  transitionDuration?: number;
}

export const Burger = React.forwardRef<HTMLButtonElement, BurgerProps>(
  ({ 
    opened, 
    onClick, 
    size = 'md',
    color,
    transitionDuration = 300,
    ...props 
  }, ref) => {
    return (
      <MantineBurger
        ref={ref}
        opened={opened}
        onClick={onClick}
        size={size}
        color={color}
        transitionDuration={transitionDuration}
        style={{
          '--burger-line-color': color || 'var(--depth-text-primary)',
          ...props.style,
        }}
        {...props}
      />
    );
  }
);

Burger.displayName = 'Burger';
