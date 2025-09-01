"use client";

// ضبط مركزي للحركة مع احترام تفضيل تقليل الحركة من النظام
export type MotionOverrides = {
  durationMs?: number;
  delayMs?: number;
  enabled?: boolean;
};

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getMotionConfig(overrides?: MotionOverrides) {
  const reduced = getPrefersReducedMotion();
  const enabled = overrides?.enabled ?? !reduced;
  const durationMs = overrides?.durationMs ?? 2000; // ابطأ شوي حتى تكون الحركة أهدى
  const delayMs = overrides?.delayMs ?? 0;
  return { enabled, durationMs, delayMs } as const;
}
