"use client";
import { useEffect, useRef, useState } from "react";
import { getMotionConfig } from "./config";

type EasingFn = (t: number) => number;

const easeOutCubic: EasingFn = (t) => 1 - Math.pow(1 - t, 3);

export function useCountUp(
  target: number,
  opts?: {
    durationMs?: number;
    startFrom?: number;
    delayMs?: number;
    easing?: EasingFn;
    onDone?: () => void;
    inView?: boolean; // gate by visibility
  }
) {
  const { durationMs: dMs, startFrom, delayMs: dlyMs, easing = easeOutCubic, onDone, inView = true } = opts || {};
  const motion = getMotionConfig({ durationMs: dMs, delayMs: dlyMs });
  const durationMs = motion.durationMs;
  const delayMs = motion.delayMs;
  // إذا ماكو startFrom، نختار نقطة انطلاق قريبة من الهدف حتى يبين التغيير فورًا
  const computeSmartStart = (t: number): number => {
    if (!isFinite(t)) return 0;
    const abs = Math.abs(t);
    const delta = Math.max(3, Math.round(abs * 0.15)); // فرق أولي واضح
    if (t > 0) return Math.max(0, t - delta);
    if (t < 0) return Math.min(0, t + delta);
    return 0;
  };
  const resolvedStart = startFrom ?? computeSmartStart(target);
  const [value, setValue] = useState(resolvedStart);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!inView || doneRef.current) return;
    // إذا الحركة معطلة، نطفر مباشرةً للقيمة الهدف
    if (!motion.enabled) {
      setValue(target);
      doneRef.current = true;
      onDone?.();
      return;
    }
    function frame(ts: number) {
      if (startRef.current == null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / durationMs);
      const eased = easing(t);
      const nextVal = resolvedStart + (target - resolvedStart) * eased;
      setValue(nextVal);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        doneRef.current = true;
        onDone?.();
      }
    }
    const timer: number = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(frame);
    }, delayMs);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [target, durationMs, resolvedStart, delayMs, easing, onDone, inView, motion.enabled]);

  return Math.round(value);
}
