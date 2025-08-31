"use client";
import { useEffect, useRef, useState } from "react";

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
  const { durationMs = 900, startFrom = 0, delayMs = 0, easing = easeOutCubic, onDone, inView = true } = opts || {};
  const [value, setValue] = useState(startFrom);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!inView || doneRef.current) return;
    function frame(ts: number) {
      if (startRef.current == null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / durationMs);
      const eased = easing(t);
      const nextVal = startFrom + (target - startFrom) * eased;
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
  }, [target, durationMs, startFrom, delayMs, easing, onDone, inView]);

  return Math.round(value);
}
