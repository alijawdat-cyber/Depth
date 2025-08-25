import React from 'react';

type Props = {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

export const Button: React.FC<Props> = ({ label, variant = 'primary', size = 'md', disabled }) => {
  const base = 'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const sizes: Record<NonNullable<Props['size']>, string> = {
    sm: 'h-8 px-3 text-[var(--fs-sm)]',
    md: 'h-10 px-4 text-[var(--fs-md)]',
    lg: 'h-12 px-5 text-[var(--fs-lg)]',
  };
  const variants: Record<NonNullable<Props['variant']>, string> = {
    primary: 'bg-[var(--color-action-primary-bg)] text-white hover:bg-[var(--color-action-primary-hover)] focus-visible:outline-[var(--color-primary)]',
    secondary: 'bg-[var(--color-bg-elevated)] text-[var(--color-fg-primary)] hover:opacity-90 focus-visible:outline-[var(--color-primary)]',
    outline: 'bg-transparent text-[var(--color-fg-primary)] border border-[var(--color-bd-default)] hover:bg-[var(--bg-secondary)] focus-visible:outline-[var(--color-primary)]',
    ghost: 'bg-transparent text-[var(--color-action-ghost-fg)] hover:bg-[var(--bg-secondary)] focus-visible:outline-[var(--color-primary)]',
  };
  const cls = [base, sizes[size], variants[variant], disabled ? 'opacity-50 pointer-events-none' : ''].join(' ');
  return (
    <button className={cls} disabled={disabled}>
      {label}
    </button>
  );
};
