"use client";

import { motion, useReducedMotion } from "framer-motion";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { clsx } from "clsx";

export default function Hero() {
  const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;
  const WA_TEXT = process.env.NEXT_PUBLIC_WA_TEXT || "";
  const waHref = WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}` : "https://wa.me/";
  const reduce = useReducedMotion();
  
  // تحسين للموبايل - حركات أبسط
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const simpleTransition = { duration: isMobile ? 0.3 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };
  
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg)] text-[var(--text)]">
      <Container>
        <div className="grid gap-6 md:gap-8">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={reduce ? undefined : simpleTransition}
          >
            محتوى يحرّك النتائج — بسرعة، بهامش مضبوط، وقياس واضح.
          </motion.h1>
          <motion.p
            className="text-[var(--slate-600)] text-sm sm:text-base md:text-lg max-w-prose leading-relaxed"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={reduce ? undefined : { ...simpleTransition, delay: 0.1 }}
          >
            استوديو/وكالة Performance + Content. باقات شهرية وخدمات حسب الطلب.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={reduce ? undefined : { ...simpleTransition, delay: 0.2 }}
          >
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(buttonStyles({ variant: "primary" }))}
            >
              احجز جلسة
            </a>
            <Link href="/join" className={clsx(buttonStyles({ variant: "secondary" }))}>
              انضم إلينا
            </Link>
            <Link href="/auth/signin" className={clsx(buttonStyles({ variant: "ghost" }))}>
              تسجيل الدخول
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}


