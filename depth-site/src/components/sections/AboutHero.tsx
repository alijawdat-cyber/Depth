"use client";
import { Container } from "@/components/ui/Container";
import { motion, useReducedMotion } from "framer-motion";

export default function AboutHero() {
  const reduce = useReducedMotion();
  return (
    <section dir="rtl" className="py-16 md:py-24">
      <Container>
        <motion.h1
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold tracking-tight"
        >
          رؤيتنا: محتوى يحرّك النتائج
        </motion.h1>
        <motion.p
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
          className="mt-3 text-[15px] md:text-lg text-[var(--slate-600)] max-w-3xl"
        >
          فريق صغير بقدرة تنفيذ عالية. نبني أنظمة محتوى وإنتاج تربط الإبداع بالمبيعات، مع سرعة مدروسة وهوامش واضحة وقياس دقيق.
        </motion.p>
      </Container>
    </section>
  );
}


