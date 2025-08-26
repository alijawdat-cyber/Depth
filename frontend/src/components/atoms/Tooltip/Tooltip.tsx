"use client";
import React from "react";
import { Tooltip as MantineTooltip } from "@mantine/core";

export type TooltipPosition = 
  | "bottom" | "left" | "right" | "top"
  | "bottom-end" | "bottom-start"
  | "left-end" | "left-start"
  | "right-end" | "right-start"
  | "top-end" | "top-start";

export interface TooltipProps {
  /** Tooltip content */
  label: React.ReactNode;
  /** Position of tooltip */
  position?: TooltipPosition;
  /** Whether tooltip is opened */
  opened?: boolean;
  /** Controlled opened state */
  defaultOpened?: boolean;
  /** Disable tooltip */
  disabled?: boolean;
  /** Delay in ms before showing tooltip */
  openDelay?: number;
  /** Delay in ms before hiding tooltip */
  closeDelay?: number;
  /** Color theme */
  color?: string;
  /** Tooltip background color */
  bg?: string;
  /** Text color */
  c?: string;
  /** Font size */
  fz?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Multiline tooltip */
  multiline?: boolean;
  /** Width for multiline tooltip */
  w?: number | string;
  /** Tooltip radius */
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Whether to show arrow */
  withArrow?: boolean;
  /** Arrow size */
  arrowSize?: number;
  /** Arrow position */
  arrowPosition?: "center" | "side";
  /** Arrow offset */
  arrowOffset?: number;
  /** Z-index of tooltip */
  zIndex?: number;
  /** Whether tooltip should be kept mounted */
  keepMounted?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Tooltip target element */
  children: React.ReactElement;
  /** Events that trigger tooltip */
  events?: { hover: boolean; focus: boolean; touch: boolean };
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    label,
    position = "top",
    opened,
    defaultOpened,
    disabled = false,
    openDelay = 0,
    closeDelay = 0,
    color,
    bg,
    c,
    fz = "sm",
    multiline = false,
    w,
    radius = "md",
    withArrow = true,
    arrowSize = 4,
    arrowPosition = "center",
    arrowOffset = 5,
    zIndex = 1000,
    keepMounted = false,
    className,
    style,
    children,
    events = { hover: true, focus: true, touch: false },
    ...props
  }
) {
  return (
    <MantineTooltip
      label={label}
      position={position}
      opened={opened}
      defaultOpened={defaultOpened}
      disabled={disabled}
      openDelay={openDelay}
      closeDelay={closeDelay}
      color={color}
      multiline={multiline}
      w={w}
      radius={radius}
      withArrow={withArrow}
      arrowSize={arrowSize}
      arrowPosition={arrowPosition}
      arrowOffset={arrowOffset}
      zIndex={zIndex}
      keepMounted={keepMounted}
      className={className}
      events={events}
      styles={{
        tooltip: {
          // Use our design tokens for consistent styling
          backgroundColor: bg || 'var(--color-bg-secondary)',
          color: c || 'var(--color-fg-primary)',
          fontSize: typeof fz === 'string' ? {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem'
          }[fz] || '0.875rem' : fz,
          borderRadius: {
            xs: 'var(--radius-sm)',
            sm: 'var(--radius-sm)',
            md: 'var(--radius-md)',
            lg: 'var(--radius-lg)',
            xl: 'var(--radius-lg)'
          }[radius] || 'var(--radius-md)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--elevation-2)',
          maxWidth: multiline ? (w || '200px') : '300px',
          wordWrap: multiline ? 'break-word' : 'normal',
          whiteSpace: multiline ? 'normal' : 'nowrap',
          ...style,
        },
        arrow: {
          borderColor: 'var(--color-border-primary)',
        }
      }}
      {...props}
    >
      {children}
    </MantineTooltip>
  );
});

export default Tooltip;
