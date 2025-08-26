"use client";
import React from "react";
import { Tabs as MantineTabs } from "@mantine/core";

export type TabsVariant = "default" | "outline" | "pills";
export type TabsOrientation = "horizontal" | "vertical";
export type TabsPlacement = "left" | "right";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  className?: string;
  style?: React.CSSProperties;
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | null) => void;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  placement?: TabsPlacement;
  keepMounted?: boolean;
  allowTabDeactivation?: boolean;
  loop?: boolean;
  activateTabWithKeyboard?: boolean;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    className,
    style,
    items,
    defaultValue,
    value,
    onChange,
    variant = "default",
    orientation = "horizontal",
    placement = "right",
    keepMounted = true,
    allowTabDeactivation = false,
    loop = true,
    activateTabWithKeyboard = true,
    ...props
  }, ref) {

  const isVertical = orientation === "vertical";
  
  return (
    <MantineTabs
      ref={ref}
      className={className}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      orientation={orientation}
      placement={placement}
      keepMounted={keepMounted}
      allowTabDeactivation={allowTabDeactivation}
      loop={loop}
      activateTabWithKeyboard={activateTabWithKeyboard}
      styles={{
        root: {
          direction: 'rtl',
          ...(style || {}),
        },
        list: {
          direction: 'rtl',
          borderColor: 'var(--color-bd-default)',
          ...(variant === 'outline' && {
            borderBottom: isVertical ? 'none' : '1px solid var(--color-bd-default)',
            borderRight: isVertical && placement === 'left' ? '1px solid var(--color-bd-default)' : 'none',
            borderLeft: isVertical && placement === 'right' ? '1px solid var(--color-bd-default)' : 'none',
          }),
          gap: variant === 'pills' ? 'var(--space-2)' : '0',
        },
        tab: {
          backgroundColor: 'transparent',
          color: 'var(--color-fg-secondary)',
          border: 'none',
          borderRadius: variant === 'pills' ? 'var(--radius-md)' : '0',
          padding: `var(--space-3) var(--space-4)`,
          fontSize: 'var(--fs-md)',
          fontWeight: 500,
          direction: 'rtl',
          textAlign: 'right',
          transition: 'all 0.2s ease',
          
          '&:hover': {
            backgroundColor: variant === 'pills' ? 'var(--color-action-ghost-hover)' : 'transparent',
            color: 'var(--color-fg-primary)',
          },
          
          '&[data-active]': {
            backgroundColor: variant === 'pills' ? 'var(--color-action-primary-bg)' : 'transparent',
            color: variant === 'pills' ? 'var(--color-action-primary-fg)' : 'var(--color-primary)',
            borderColor: variant !== 'pills' ? 'var(--color-primary)' : 'transparent',
          },

          '&[data-disabled]': {
            color: 'var(--color-fg-secondary)',
            opacity: 0.5,
            cursor: 'not-allowed',
          }
        },
        panel: {
          backgroundColor: 'transparent',
          color: 'var(--color-fg-primary)',
          direction: 'rtl',
          padding: isVertical ? 'var(--space-4)' : 'var(--space-4) 0 0 0',
        }
      }}
      {...props}
    >
      <MantineTabs.List>
        {items.map((item) => (
          <MantineTabs.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            leftSection={item.icon}
          >
            {item.label}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {items.map((item) => (
        <MantineTabs.Panel key={item.value} value={item.value}>
          {item.children}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
});

export default Tabs;
