"use client";
import { Container } from "@/components/ui/Container";
import { motion, useReducedMotion } from "framer-motion";

export default function AboutHero() {
  const reduce = useReducedMotion();
  return (
    <section dir="rtl" className="py-20 md:py-32">
      <Container>
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            من نحن
          </h1>
          <p className="text-xl md:text-2xl text-[var(--slate-600)] mb-8 leading-relaxed">
            رؤيتنا: محتوى يحرّك النتائج
          </p>
          <p className="text-lg text-[var(--slate-600)] max-w-3xl mx-auto leading-relaxed">
            فريق صغير بقدرة تنفيذ عالية. نبني أنظمة محتوى وإنتاج تربط الإبداع بالمبيعات، مع سرعة مدروسة وهوامش واضحة وقياس دقيق.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}


