"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function FounderSpotlight() {
  const reduce = useReducedMotion();
  const img = (
    <div className="relative w-full max-w-sm mx-auto">
      <Image
        src="/team/ali-jawdat.jpg"
        alt="Ali Jawdat"
        width={640}
        height={640}
        className="w-full h-72 md:h-80 object-cover rounded-[var(--radius)]"
        priority
      />
      <div className="pointer-events-none absolute inset-0 rounded-[var(--radius)] bg-black/10" />
    </div>
  );

  return (
    <section className="py-16 md:py-24" id="founder">
      <Container>
        <SectionHeading title="عن المؤسس" subtitle="رؤية تنفيذ تركّز على النتائج" align="center" className="mb-8" />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {reduce ? (
            img
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 0.6, ease: "easeOut" }}>
              {img}
            </motion.div>
          )}
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--accent-500),#9F65FF)]">Ali Jawdat — Founder & Principal</h3>
            <p className="text-[var(--slate-600)] mt-2">نقود مشاريع الأداء والمحتوى بتركيز على السرعة، الهامش، والقياس الواضح.</p>
            <blockquote className="mt-4 text-base leading-7">“التصميم الجيد هو الذي يحرّك النتائج ويجعل القياس واضحًا—كل قرار مبني على بيانات واضحة وزمن تنفيذ منضبط.”</blockquote>
          </div>
        </div>
      </Container>
    </section>
  );
}


