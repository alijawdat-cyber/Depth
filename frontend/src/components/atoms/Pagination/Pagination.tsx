'use client';

import React from 'react';
import { Pagination as MantinePagination } from '@mantine/core';
import type { PaginationProps as MantinePaginationProps } from '@mantine/core';

export interface PaginationProps extends Omit<MantinePaginationProps, 'size'> {
  /** Current active page */
  value?: number;
  /** Callback fired after click on page */
  onChange?: (page: number) => void;
  /** Total number of pages */
  total: number;
  /** Number of siblings displayed on the left/right side of selected page */
  siblings?: number;
  /** Number of elements visible on the left/right edges */
  boundaries?: number;
  /** Size of pagination elements */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Spacing between pagination elements */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Show first/last control buttons */
  withEdges?: boolean;
  /** Show previous/next control buttons */
  withControls?: boolean;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    value,
    onChange,
    total,
    siblings = 1,
    boundaries = 1,
    size = 'md',
    gap = 'xs',
    withEdges = false,
    withControls = true,
    ...props 
  }, ref) => {
    return (
      <MantinePagination
        ref={ref}
        value={value}
        onChange={onChange}
        total={total}
        siblings={siblings}
        boundaries={boundaries}
        size={size}
        gap={gap}
        withEdges={withEdges}
        withControls={withControls}
        style={{
          '--pagination-active-bg': 'var(--depth-primary)',
          '--pagination-active-color': 'var(--depth-primary-contrast)',
          '--pagination-hover-bg': 'var(--depth-surface-hover)',
          ...props.style,
        }}
        {...props}
      />
    );
  }
);

Pagination.displayName = 'Pagination';
