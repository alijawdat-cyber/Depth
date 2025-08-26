"use client";
import React from "react";
// cn: دمج كلاسات بسيط
function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/*
  ملاحظات تصميم:
  - كل الألوان من التوكنز الدلالية: --color-action-*
  - المسافات والزوايا من: --space-*, --radius-*
  - حلقة التركيز (focus) من اللون الرئيسي.
*/

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, size = "md", variant = "primary", disabled, loading, leftIcon, rightIcon, children, style, ...props },
  ref
) {
  const isDisabled = disabled || loading;
  const base = "inline-flex items-center justify-center font-semibold transition-colors select-none whitespace-nowrap";
  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-[14px] gap-2",
    md: "h-10 px-4 text-[15px] gap-2.5",
    lg: "h-11 px-5 text-[16px] gap-3",
  };

  const radii = "rounded-[var(--radius-md)]";
  const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-fg)] hover:bg-[var(--color-action-primary-hover)] disabled:bg-[var(--color-action-primary-disabled)]",
  secondary: "bg-[var(--color-action-secondary-bg)] text-[var(--color-action-secondary-fg)] border border-[var(--color-bd-default)] hover:bg-[color-mix(in_oklab,var(--color-action-secondary-bg),black_6%)]",
    // تحسين التباين بالداكن: نخلي اللون يرث currentColor ونضمن حدود واضحة
  outline: "bg-transparent text-[var(--color-action-outline-fg)] border border-[var(--color-bd-strong)] hover:bg-[color-mix(in_oklab,currentColor,transparent_90%)]",
    ghost: "bg-transparent text-[var(--color-action-ghost-fg)]",
  };

  // نضمن لون نص الـ outline حتى لو قصة الـ Docs طبّقت لون عام غامق
  const forcedStyle = variant === 'outline' ? ({ color: 'var(--color-action-outline-fg)' } as React.CSSProperties) : undefined;

  return (
    <button
      ref={ref}
      className={cn(base, sizes[size], radii, ring, variants[variant], isDisabled && "opacity-60 cursor-not-allowed", className)}
      style={style ? { ...forcedStyle, ...style } : forcedStyle}
      disabled={isDisabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex -me-1" aria-hidden>{leftIcon}</span>}
      <span>{children}</span>
      {loading && (
        <span className="ms-2 inline-flex" aria-hidden>
          <span className="size-4 rounded-full border-2 border-[currentColor] border-t-transparent animate-spin" />
        </span>
      )}
      {rightIcon && <span className="inline-flex -ms-1" aria-hidden>{rightIcon}</span>}
    </button>
  );
});

export default Button;
