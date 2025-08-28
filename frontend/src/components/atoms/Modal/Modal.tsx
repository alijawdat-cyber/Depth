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
    xs: 'var(--space-md)',                                  /* مسافة متوسطة من tokens.css */
    sm: 'var(--space-lg)',                                  /* مسافة كبيرة من tokens.css */
    md: 'var(--space-xl)',                                  /* مسافة كبيرة جداً من tokens.css */
    lg: 'var(--space-2xl)',                                 /* مسافة كبيرة جداً من tokens.css */
    xl: 'var(--space-2xl)',                                 /* مسافة كبيرة جداً من tokens.css */
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',            /* أوفرلاي شبه شفاف ثابت */
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
          backgroundColor: 'var(--color-bg-secondary)',      /* خلفية ثانوية من tokens.css */
          border: withBorder ? '1px solid var(--color-border-primary)' : 'none', /* حدود من tokens.css */
          borderRadius: 'var(--radius-lg)',                  /* زوايا كبيرة من tokens.css */
          boxShadow: 'var(--shadow-lg)',                     /* ظل كبير من tokens.css */
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid var(--color-border-primary)', /* حدود من tokens.css */
          paddingBottom: 'calc(var(--space-md) / 2)',        /* مسافة متوسطة من tokens.css */
        },
        title: {
          color: 'var(--color-text-primary)',                /* لون نص أساسي من tokens.css */
          fontWeight: 600,
          fontSize: 'var(--fs-lg)',                          /* حجم خط كبير من tokens.css */
          direction: 'rtl',
          textAlign: 'right',
          margin: 0,
        },
        body: {
          color: 'var(--color-text-primary)',                /* لون نص أساسي من tokens.css */
          direction: 'rtl',
          paddingTop: 'calc(var(--space-md) / 2)',          /* مسافة متوسطة من tokens.css */
        },
        close: {
          color: 'var(--color-text-secondary)',              /* لون نص ثانوي من tokens.css */
          '&:hover': {
            backgroundColor: 'var(--color-bg-tertiary)',     /* خلفية ثلاثية عند التمرير من tokens.css */
            color: 'var(--color-text-primary)',              /* لون نص أساسي من tokens.css */
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
