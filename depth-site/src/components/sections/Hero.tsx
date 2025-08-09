"use client";

import { motion } from "framer-motion";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { clsx } from "clsx";

export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-[var(--bg)] text-[var(--text)]">
      <Container>
        <div className="grid gap-6 md:gap-8">
          <motion.h1
            className="text-3xl md:text-5xl font-bold tracking-tight"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            محتوى يحرّك النتائج — بسرعة، بهامش مضبوط، وقياس واضح.
          </motion.h1>
          <motion.p
            className="text-[var(--slate-600)] text-base md:text-lg max-w-prose"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            استوديو/وكالة Performance + Content. باقات شهرية وخدمات حسب الطلب.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(buttonStyles({ variant: "primary" }))}
            >
              احجز جلسة
            </a>
            <Link href="#packages" className={clsx(buttonStyles({ variant: "secondary" }))}>
              اطلب عرض
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}


