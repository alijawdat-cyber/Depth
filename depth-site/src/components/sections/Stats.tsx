"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";

type Stat = { label: string; value: number; suffix?: string };
const stats: Stat[] = [
  { label: "حملات مُدارة", value: 120, suffix: "+" },
  { label: "أصول محتوى", value: 3500, suffix: "+" },
  { label: "متوسط تحسّن ROAS", value: 42, suffix: "%" },
  { label: "تخفيض CPA", value: 28, suffix: "%" },
];

function useCount(ref: React.RefObject<HTMLSpanElement | null>, to: number, duration = 1400) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // تحسين للموبايل - تقليل التحديثات
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const updateInterval = isMobile ? 50 : 16; // أقل تحديثات للموبايل
    
    let start: number | null = null;
    let lastUpdate = 0;
    const from = 0;
    
    const step = (ts: number) => {
      if (start === null) start = ts;
      
      // تحديث أقل للموبايل
      if (ts - lastUpdate < updateInterval) {
        requestAnimationFrame(step);
        return;
      }
      lastUpdate = ts;
      
      const p = Math.min((ts - start) / duration, 1);
      const val = Math.floor(from + (to - from) * p);
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
    };
    // في iOS Safari، rAF قد يبطؤ أثناء التمرير. نضمن بدء العد بعد أول frame مرئي.
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [ref, to, duration]);
}

export default function Stats() {
  return (
    <section className="py-12">
      <Container className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[var(--radius)] border border-[var(--elev)] p-5 bg-[var(--card)] text-center">
            <StatNumber value={s.value} suffix={s.suffix} />
            <div className="text-sm text-[var(--slate-600)] mt-1">{s.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}

function StatNumber({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useCount(ref, value);
  return (
    <div className="text-2xl font-bold">
      <span ref={ref}>0</span>{suffix}
    </div>
  );
}


