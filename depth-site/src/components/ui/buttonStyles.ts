import { tv } from "tailwind-variants";

export const buttonStyles = tv({
  base:
    "inline-flex items-center justify-center rounded-[var(--radius)] px-5 h-11 min-h-[44px] min-w-[44px] text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)] shadow-[var(--shadow)]",
  variants: {
    variant: {
      primary:
        "bg-[var(--accent-500)] text-[var(--text-dark)] hover:bg-[var(--accent-700)] disabled:bg-[var(--accent-300)] tracking-tight",
      secondary:
        "bg-[var(--card)] text-[var(--text)] border border-[var(--elev)] hover:bg-[var(--neutral-50)] tracking-tight",
      ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--neutral-50)]",
    },
    size: {
      sm: "h-11 px-4 text-[13px] leading-none gap-1.5",
      md: "h-11 px-5 text-sm leading-none gap-1.5",
      lg: "h-12 px-6 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});


