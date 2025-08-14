"use client";

import { clsx } from "clsx";

type BaseProps = {
  text: string;
  className?: string;
  children?: React.ReactNode;
};

export function StateLoading({ text, className }: BaseProps) {
  return (
    <div className={clsx("text-center py-12", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
      <p className="text-[var(--slate-600)]">{text}</p>
    </div>
  );
}

export function StateEmpty({ text, className, children }: BaseProps) {
  return (
    <div className={clsx("text-center py-12 bg-[var(--bg)] rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--elev)]", className)}>
      <p className="text-[var(--slate-600)] mb-4">{text}</p>
      {children}
    </div>
  );
}

export function StateError({ text, className, children }: BaseProps) {
  return (
    <div className={clsx("text-center py-12", className)}>
      <h3 className="text-xl font-semibold text-[var(--text)] mb-2">حدث خطأ</h3>
      <p className="text-[var(--slate-600)] mb-6">{text}</p>
      {children}
    </div>
  );
}


export const StatCardSkeleton = () => (
  <div className="h-28 bg-[var(--elev)] rounded-[var(--radius-lg)] animate-pulse" />
);

export const FileCardSkeleton = () => (
  <div className="h-40 bg-[var(--elev)] rounded-[var(--radius-lg)] animate-pulse" />
);


