"use client";
import React from "react";
import { Modal as MantineModal } from "@mantine/core";
import { X } from "lucide-react";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "auto";

export interface ModalProps {
  className?: string;
  children: React.ReactNode;
  opened: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  centered?: boolean;
  fullScreen?: boolean;
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  padding?: "xs" | "sm" | "md" | "lg" | "xl";
  withBorder?: boolean;
  overlayBlur?: number;
  overlayOpacity?: number;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    className,
    children,
    opened,
    onClose,
    title,
    size = "md",
    centered = true,
    fullScreen = false,
    withCloseButton = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    padding = "md",
    withBorder = false,
    overlayBlur = 3,
    overlayOpacity = 0.55,
    ...props
  }, ref) {

  const paddingValue = {
    xs: 'var(--space-3)',
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)',
    xl: 'var(--space-10)',
  }[padding];

  return (
    <MantineModal
      ref={ref}
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      fullScreen={fullScreen}
      withCloseButton={withCloseButton}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      padding={paddingValue}
      className={className}
      overlayProps={{
        blur: overlayBlur,
        backgroundOpacity: overlayOpacity,
        style: {
          backgroundColor: 'var(--color-bg-overlay)',
        }
      }}
      closeButtonProps={{
        icon: <X size={16} />,
        'aria-label': 'إغلاق النافذة'
      }}
      styles={{
        root: {
          direction: 'rtl',
        },
        content: {
          backgroundColor: 'var(--color-bg-elevated)',
          border: withBorder ? '1px solid var(--color-bd-default)' : 'none',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elevation-3)',
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid var(--color-bd-default)',
          paddingBottom: 'calc(var(--space-3) / 2)',
        },
        title: {
          color: 'var(--color-fg-primary)',
          fontWeight: 600,
          fontSize: 'var(--fs-lg)',
          direction: 'rtl',
          textAlign: 'right',
          margin: 0,
        },
        body: {
          color: 'var(--color-fg-primary)',
          direction: 'rtl',
          paddingTop: 'calc(var(--space-3) / 2)',
        },
        close: {
          color: 'var(--color-fg-secondary)',
          '&:hover': {
            backgroundColor: 'var(--color-action-ghost-hover)',
            color: 'var(--color-fg-primary)',
          }
        }
      }}
      {...props}
    >
      {children}
    </MantineModal>
  );
});

export default Modal;
