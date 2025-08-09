"use client";

import { tv } from "tailwind-variants";
import { clsx } from "clsx";
import * as React from "react";

export const buttonStyles = tv({
  base:
    "inline-flex items-center justify-center rounded-[var(--radius)] px-5 h-11 text-sm font-medium transition focus-visible:outline-none shadow-[var(--shadow)]",
  variants: {
    variant: {
      primary:
        "bg-[var(--accent-500)] text-[var(--text-dark)] hover:bg-[var(--accent-700)] disabled:bg-[var(--accent-300)]",
      secondary:
        "bg-[var(--card)] text-[var(--text)] border border-[var(--elev)] hover:bg-[var(--neutral-50)]",
      ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--neutral-50)]",
    },
    size: {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(buttonStyles({ variant, size }), className)}
      {...props}
      // حماية إضافية من اختلاف className بين SSR والعميل في dev
      data-tv={buttonStyles({ variant, size })}
      suppressHydrationWarning
    />
  );
}


