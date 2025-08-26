"use client";
import React from 'react';
import { Rating as MantineRating } from '@mantine/core';

export type RatingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface RatingProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Current rating value */
  value?: number;
  /** Default rating value */
  defaultValue?: number;
  /** Maximum rating value */
  count?: number;
  /** Size of rating */
  size?: RatingSize;
  /** Whether rating is readonly */
  readOnly?: boolean;
  /** Whether rating allows fractions */
  fractions?: number;
  /** Custom empty symbol */
  emptySymbol?: React.ReactNode;
  /** Custom full symbol */
  fullSymbol?: React.ReactNode;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Hover handler */
  onHover?: (value: number) => void;
  /** Symbol color when filled */
  color?: string;
  /** Highlight selected rating */
  highlightSelectedOnly?: boolean;
}

/**
 * Rating component for star ratings and reviews
 * Built on top of Mantine Rating with design token integration
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  function Rating({
    className,
    style,
    value,
    defaultValue = 0,
    count = 5,
    size = 'md',
    readOnly = false,
    fractions = 1,
    emptySymbol,
    fullSymbol,
    onChange,
    onHover,
    color,
    highlightSelectedOnly = false,
    ...props
  }, ref) {

    const getCustomStyles = () => {
      const symbolSize = size === 'xs' ? '16px' : 
                        size === 'sm' ? '20px' : 
                        size === 'md' ? '24px' : 
                        size === 'lg' ? '32px' : '40px';

      const baseStyles = {
        root: {
          gap: size === 'xs' ? 'var(--space-1)' : 
               size === 'sm' ? 'var(--space-1)' : 
               'var(--space-2)',
        },
        symbolBody: {
          width: symbolSize,
          height: symbolSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        input: {
          cursor: readOnly ? 'default' : 'pointer',
        },
      } as const;

      return baseStyles;
    };

    const getDefaultSymbol = (filled: boolean) => (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill={filled ? (color || 'var(--color-warning-400)') : 'none'}
        stroke={filled ? 'none' : 'var(--color-neutral-400)'}
        strokeWidth="2"
        style={{
          transition: 'all 0.2s ease',
          filter: filled ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none',
        }}
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    );

    return (
      <MantineRating
        ref={ref}
        className={className}
        style={style}
        value={value}
        defaultValue={defaultValue}
        count={count}
        size={size}
        readOnly={readOnly}
        fractions={fractions}
        emptySymbol={emptySymbol || getDefaultSymbol(false)}
        fullSymbol={fullSymbol || getDefaultSymbol(true)}
        onChange={onChange}
        onHover={onHover}
        color={color}
        highlightSelectedOnly={highlightSelectedOnly}
        styles={getCustomStyles()}
        {...props}
      />
    );
  }
);

export default Rating;
