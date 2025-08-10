"use client";
import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";

type Testimonial = {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatar?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "blo",
    name: "BLO",
    title: "Client",
    quote:
      "Immediate ownership on process and schedule. Clean handoffs and measurable results.",
    avatar: "/clients/blo.svg",
  },
  {
    id: "clinica-a",
    name: "Clinica A",
    title: "Client",
    quote:
      "Great service. On-time delivery and consistent quality across channels.",
    avatar: "/clients/clinica-a.svg",
  },
];

function Decorations() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const xCircle = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yCircle = useTransform(scrollYProgress, [0, 1], [10, -20]);
  const xGrid = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const tapeRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <>
      {/* Right circle */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-80px] top-16 h-[260px] w-[260px] rounded-full"
        style={reduce ? undefined : { x: xCircle, y: yCircle }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--slate-300)" strokeWidth="2" />
        </svg>
      </motion.div>

      {/* Left grid paper + tape */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-40px] top-36 rotate-[-8deg]"
        style={reduce ? undefined : { x: xGrid }}
      >
        <div className="relative">
          {/* tape */}
          <motion.div
            className="absolute -top-3 left-6 h-6 w-16 rounded-[2px] bg-[var(--slate-200)] dark:bg-[var(--slate-700)]"
            style={reduce ? undefined : { rotate: tapeRotate }}
          />
          {/* grid card (data-uri background) */}
          <div
            className="h-24 w-36 rounded-xl ring-1 ring-[var(--elev)] shadow-sm bg-[var(--card)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--slate-300) 1px, transparent 0)",
              backgroundSize: "12px 12px",
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

export default function TrustSection() {
  const reduce = useReducedMotion();
  const headingVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  } as const;

  return (
    <section dir="rtl" className="relative py-16 md:py-20 bg-[var(--slate-50)] dark:bg-[var(--slate-900)] text-[var(--ink-900)]">
      <Decorations />
      <Container>
        <motion.h2
          variants={headingVariants}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-10% 0px" }}
          className="text-2xl md:text-4xl font-semibold mb-8"
        >
          عملاؤنا يثقون بنا
        </motion.h2>

        <div className="grid gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.id}
              variants={cardVariants}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-10% 0px" }}
              className={
                "mx-auto w-full rounded-3xl ring-1 ring-[var(--elev)] shadow-sm bg-[var(--card)]/90 p-5 md:p-6 " +
                (i === 1 ? "md:ml-auto md:w-[88%]" : "md:w-[92%]")
              }
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full ring-1 ring-[var(--elev)] shadow-sm object-contain grayscale"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full ring-1 ring-[var(--elev)] grid place-items-center bg-[var(--card)]/90 shadow-sm">
                    <span className="font-semibold text-[var(--ink-700)]">{t.name.charAt(0)}</span>
                  </div>
                )}

                {/* Body */}
                <div className="flex-1">
                  <p className="text-[15px] leading-7 text-[var(--ink-700)]">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-3 text-[13px] text-[var(--ink-600)]">
                    <span className="font-semibold">{t.name}</span>
                    <span className="mx-1">—</span>
                    <span>{t.title}</span>
                  </div>
                </div>
              </div>

              {/* Optional dots decoration on second card */}
              {i === 1 ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-6 bottom-[-14px] rotate-[-12deg] opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(currentColor 1px, transparent 1.5px)",
                    backgroundSize: "10px 10px",
                  }}
                >
                  <div className="h-16 w-24" />
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}


