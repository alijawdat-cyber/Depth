"use client";

import { Container } from "@/components/ui/Container";
import { clients } from "@/data/clients";
import Image from "next/image";

import { useEffect, useMemo, useRef, useState } from "react";

export default function ClientsMarquee() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [groupWidth, setGroupWidth] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(36); // px/s adaptive
  const [prefersReduced, setPrefersReduced] = useState(false);

  const logos = useMemo(() => clients, []);

  // Measure content width (debounced via rAF)
  useEffect(() => {
    if (!groupRef.current || !containerRef.current) return;
    let frame: number | null = null;
    const measure = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = groupRef.current!.scrollWidth;
        setGroupWidth(w);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    ro.observe(groupRef.current);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [logos]);

  // Adaptive speed per viewport & reduced motion preference
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      // أبطأ بالموبايل حتى لا يبدو سريع جدا
      if (w < 480) setSpeed(18);
      else if (w < 640) setSpeed(20);
      else if (w < 768) setSpeed(24);
      else if (w < 1024) setSpeed(30);
      else setSpeed(36);
    };
    calc();
    window.addEventListener('resize', calc, { passive: true });
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePref = () => setPrefersReduced(mql.matches);
    handlePref();
    mql.addEventListener('change', handlePref);
    return () => {
      window.removeEventListener('resize', calc);
      mql.removeEventListener('change', handlePref);
    };
  }, []);

  // دورة لا تقل عن 25 ثانية حتى تبقى القراءة مريحة
  const MIN_DURATION = 25;
  const durationSec = prefersReduced
    ? 0
    : groupWidth > 0
      ? Math.max(groupWidth / speed, MIN_DURATION)
      : MIN_DURATION;

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
              className={`flex w-max gap-[clamp(12px,4vw,32px)] ${prefersReduced ? '' : 'will-change-transform transform-gpu animate-[marquee_var(--duration)_linear_infinite]'}`}
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
                    className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 dark:invert dark:brightness-200 dark:contrast-125 dark:[filter:grayscale(100%)] dark:[--logo-color:#F2F4F7]"
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
                    className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 dark:invert dark:brightness-200 dark:contrast-125 dark:[filter:grayscale(100%)] dark:[--logo-color:#F2F4F7]"
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
        :global(html.dark) .brand-logo, :global(html.dark) img { filter: grayscale(100%) brightness(2) contrast(1.25); }
      `}</style>
    </section>
  );
}