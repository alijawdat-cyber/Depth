"use client";
import React from "react";
import { Menu as MantineMenu, MenuTarget, MenuDropdown, MenuItem, MenuDivider, MenuLabel } from "@mantine/core";
import { ChevronDown } from "lucide-react";
import "./Menu.module.css";

export type MenuPosition = 
  | "bottom" | "left" | "right" | "top"
  | "bottom-end" | "bottom-start"
  | "left-end" | "left-start"
  | "right-end" | "right-start"
  | "top-end" | "top-start";

export interface MenuProps {
  /** Menu items */
  children: React.ReactNode;
  /** Menu trigger element */
  trigger?: React.ReactElement;
  /** Position of menu dropdown */
  position?: MenuPosition;
  /** Whether menu is opened */
  opened?: boolean;
  /** Default opened state */
  defaultOpened?: boolean;
  /** Disable menu */
  disabled?: boolean;
  /** Close menu on item click */
  closeOnItemClick?: boolean;
  /** Close menu on outside click */
  closeOnClickOutside?: boolean;
  /** Close menu on escape */
  closeOnEscape?: boolean;
  /** Menu width */
  width?: number | string;
  /** Z-index of menu */
  zIndex?: number;
  /** Whether to show arrow */
  withArrow?: boolean;
  /** Arrow size */
  arrowSize?: number;
  /** Arrow position */
  arrowPosition?: "center" | "side";
  /** Arrow offset */
  arrowOffset?: number;
  /** Menu radius */
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Menu shadow */
  shadow?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** On open change handler */
  onChange?: (opened: boolean) => void;
  /** On close handler */
  onClose?: () => void;
  /** On open handler */
  onOpen?: () => void;
}

export interface MenuItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Left section with icon */
  leftSection?: React.ReactNode;
  /** Right section */
  rightSection?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Color theme */
  color?: string;
  /** Close menu on click */
  closeMenuOnClick?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface MenuDividerProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface MenuLabelProps {
  /** Label content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(
  {
    children,
    trigger,
    position = "bottom-start",
    opened,
    defaultOpened,
    disabled = false,
    closeOnItemClick = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    width = 200,
    zIndex = 1000,
    withArrow = false,
    arrowSize = 4,
    arrowPosition = "center",
    arrowOffset = 5,
    radius = "md",
    shadow = "md",
    style,
    onChange,
    onClose,
    onOpen,
    ...props
  },
  ref
) {
  // RTL position mapping - flip horizontal positions for Arabic
  const getRTLPosition = (pos: MenuPosition): MenuPosition => {
    const rtlMapping: Record<MenuPosition, MenuPosition> = {
      'bottom-start': 'bottom-end',
      'bottom-end': 'bottom-start', 
      'top-start': 'top-end',
      'top-end': 'top-start',
      'left': 'right',
      'right': 'left',
      'left-start': 'right-start',
      'left-end': 'right-end',
      'right-start': 'left-start',
      'right-end': 'left-end',
      'bottom': 'bottom',
      'top': 'top'
    };
    return rtlMapping[pos] || pos;
  };

  const rtlPosition = getRTLPosition(position);

  // Default trigger if none provided
  const defaultTrigger = (
    <button
      className="menu-trigger"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        cursor: 'pointer',
        fontSize: 'var(--fs-sm)',
        direction: 'rtl', // RTL support
      }}
    >
      القائمة
      <ChevronDown size={16} />
    </button>
  );

  return (
    <div ref={ref}>
      <MantineMenu
        position={rtlPosition}
        opened={opened}
        defaultOpened={defaultOpened}
        disabled={disabled}
        closeOnItemClick={closeOnItemClick}
        closeOnClickOutside={closeOnClickOutside}
        closeOnEscape={closeOnEscape}
        width={width}
        zIndex={zIndex}
        withArrow={withArrow}
        arrowSize={arrowSize}
        arrowPosition={arrowPosition}
        arrowOffset={arrowOffset}
        radius={radius}
        shadow={shadow}
        onChange={onChange}
        onClose={onClose}
        onOpen={onOpen}
        styles={{
          dropdown: {
            // Use our design tokens for consistent styling
            borderRadius: {
              xs: 'var(--radius-sm)',
              sm: 'var(--radius-sm)',
              md: 'var(--radius-md)',
              lg: 'var(--radius-lg)',
              xl: 'var(--radius-lg)'
            }[radius] || 'var(--radius-md)',
            boxShadow: {
              xs: 'var(--elevation-1)',
              sm: 'var(--elevation-1)',
              md: 'var(--elevation-2)',
              lg: 'var(--elevation-2)',
              xl: 'var(--elevation-3)'
            }[shadow] || 'var(--elevation-2)',
            padding: 'var(--space-1)',
            direction: 'rtl', // RTL support for dropdown
            textAlign: 'right', // Align text to right for Arabic
            ...style,
          },
        }}
        {...props}
      >
        <MenuTarget>
          {trigger || defaultTrigger}
        </MenuTarget>
        
        <MenuDropdown>
          {children}
        </MenuDropdown>
      </MantineMenu>
    </div>
  );
});

// Menu Item Component
export const MenuItemComponent = React.forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItemComponent(
  {
    children,
    leftSection,
    rightSection,
    disabled = false,
    color,
    closeMenuOnClick = true,
    className,
    style,
    onClick,
    ...props
  },
  ref
) {
  return (
    <MenuItem
      ref={ref}
      className={className}
      leftSection={leftSection}
      rightSection={rightSection}
      disabled={disabled}
      color={color}
      closeMenuOnClick={closeMenuOnClick}
      onClick={onClick}
      styles={{
        item: {
          // Use our design tokens for consistent styling
          color: 'var(--color-fg-primary)',
          fontSize: 'var(--fs-sm)',
          borderRadius: 'var(--radius-sm)',
          direction: 'rtl', // RTL support for menu items
          textAlign: 'right', // Right align text for Arabic
          padding: 'var(--space-2) var(--space-3)',
          margin: '2px',
          transition: 'all var(--transition-fast)',
          '&:hover': {
            backgroundColor: 'var(--color-bg-secondary)',
          },
          '&:disabled': {
            color: 'var(--color-fg-disabled)',
            cursor: 'not-allowed',
          },
          ...style,
        },
        itemSection: {
          '& svg': {
            width: '1em',
            height: '1em',
          },
        },
      }}
      {...props}
    >
      {children}
    </MenuItem>
  );
});

// Menu Divider Component
export const MenuDividerComponent = React.forwardRef<HTMLDivElement, MenuDividerProps>(function MenuDividerComponent(
  {
    className,
    style,
    ...props
  },
  ref
) {
  return (
    <MenuDivider
      ref={ref}
      className={className}
      style={{
        borderTopColor: 'var(--color-border-primary)',
        margin: 'var(--space-1) 0',
        ...style,
      }}
      {...props}
    />
  );
});

// Menu Label Component
export const MenuLabelComponent = React.forwardRef<HTMLDivElement, MenuLabelProps>(function MenuLabelComponent(
  {
    children,
    className,
    style,
    ...props
  },
  ref
) {
  return (
    <MenuLabel
      ref={ref}
      className={className}
      style={{
        fontSize: 'var(--fs-xs)',
        fontWeight: 600,
        padding: 'var(--space-2) var(--space-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        direction: 'rtl', // RTL support for menu labels
        textAlign: 'right', // Right align text for Arabic
        ...style,
      }}
      {...props}
    >
      {children}
    </MenuLabel>
  );
});

// Export Menu and its sub-components
export { MenuItemComponent as MenuItem, MenuDividerComponent as MenuDivider, MenuLabelComponent as MenuLabel };

export default Menu;
