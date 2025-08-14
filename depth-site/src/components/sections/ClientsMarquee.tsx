"use client";

import { Container } from "@/components/ui/Container";
import { clients } from "@/data/clients";
import Image from "next/image";

import { useEffect, useMemo, useRef, useState } from "react";

export default function ClientsMarquee() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [groupWidth, setGroupWidth] = useState<number>(0);
  const SPEED = 45; // px/s

  const logos = useMemo(() => clients, []);

  useEffect(() => {
    if (!groupRef.current || !containerRef.current) return;
    const measure = () => {
      const w = groupRef.current!.scrollWidth;
      const cw = containerRef.current!.clientWidth;
      setGroupWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, [logos]);

  // مدة الدورة بالثواني بناءً على عرض المجموعة وسرعة الحركة
  const durationSec = groupWidth > 0 ? groupWidth / SPEED : 20;

  return (
    <section className="py-10">
      <Container>
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            ["--groupW" as unknown as string]: groupWidth ? `${groupWidth}px` : undefined,
            ["--duration" as unknown as string]: `${durationSec}s`,
          }}
        >
          <div
            className="flex w-max gap-[clamp(12px,4vw,32px)] will-change-transform transform-gpu animate-[marquee_var(--duration)_linear_infinite]"
          >
            {/* Group A */}
            <div ref={groupRef} className="flex w-max gap-[clamp(12px,4vw,32px)]">
              {logos.map((c) => (
                <div key={`A-${c.slug}`} className="w-[84px] sm:w-[96px] md:w-[120px] shrink-0">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    width={120}
                    height={60}
                    sizes="(max-width:768px) 84px, (max-width:1024px) 96px, 120px"
                    className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 dark:invert dark:brightness-200 dark:contrast-125 dark:opacity-95"
                    loading="lazy"
                    priority={false}
                  />
                </div>
              ))}
            </div>
            {/* Group B = clone of A */}
            <div className="flex w-max gap-[clamp(12px,4vw,32px)]">
              {logos.map((c, idx) => (
                <div key={`B-${c.slug}-${idx}`} className="w-[84px] sm:w-[96px] md:w-[120px] shrink-0">
                  <Image
                    src={c.logo}
                    alt={`${c.name} logo`}
                    width={120}
                    height={60}
                    sizes="(max-width:768px) 84px, (max-width:1024px) 96px, 120px"
                    className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 dark:invert dark:brightness-200 dark:contrast-125 dark:opacity-95"
                    loading="lazy"
                    priority={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * var(--groupW))); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[marquee_var(--duration)_linear_infinite] {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}