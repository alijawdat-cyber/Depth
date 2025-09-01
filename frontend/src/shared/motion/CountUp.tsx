"use client";
import React, { ElementType } from "react";
import { useInViewOnce } from "./useInViewOnce";
import { useCountUp } from "./useCountUp";
import { getMotionConfig } from "./config";
import { formatNumber } from "@/shared/format";

type Props<T extends ElementType> = {
  value: number;
  startFrom?: number;
  durationMs?: number;
  delayMs?: number;
  format?: (n: number) => string;
  className?: string;
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function CountUp<T extends ElementType = 'span'>(
  { value, startFrom = 0, durationMs, delayMs, format, className, as, ...rest }: Props<T>
){
  const Tag = (as || 'span') as ElementType;
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const n = useCountUp(value, { startFrom, durationMs, delayMs, inView });
  const text = format ? format(n) : formatNumber(n);
  const cls = ["tabularNumbers", className].filter(Boolean).join(" ");
  return <Tag ref={ref as unknown as React.Ref<HTMLElement>} className={cls} {...rest}>{text}</Tag>;
}

type ProgressProps = {
  value: number; // 0-100
  durationMs?: number;
  delayMs?: number;
  className?: string;
};

export function AnimatedProgress({ value, durationMs, delayMs, className }: ProgressProps){
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const motion = getMotionConfig({ durationMs, delayMs });
  const n = useCountUp(value, { startFrom: 0, durationMs, delayMs, inView });
  return (
  <div ref={ref} className={["motion-progress", className].filter(Boolean).join(" ")}> 
      <div className="motion-progress-bar" style={{ inlineSize: `${Math.min(100, n)}%`, transitionDuration: motion.enabled ? undefined : '0s' }} />
    </div>
  );
}
