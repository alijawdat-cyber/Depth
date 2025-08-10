"use client";
import { Container } from "@/components/ui/Container";
import { motion, useReducedMotion } from "framer-motion";

export default function AboutStory() {
  const reduce = useReducedMotion();
  return (
    <section dir="rtl" className="py-8 md:py-12">
      <Container>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="md:col-span-2"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-3">قصة التأسيس</h2>
            <p className="text-[15px] leading-7 text-[var(--slate-600)]">
              بدأنا بفكرة بسيطة: تحويل الإنتاج إلى سلسلة توريد ذكية تربط فريق المحتوى بالأداء. من جلسة التصوير إلى القياس على لوحة التحكم، كل خطوة تعمل بانسجام.
            </p>
          </motion.div>
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.06 }}
          >
            <h3 className="font-semibold mb-2">قيم العمل</h3>
            <ul className="text-[15px] text-[var(--slate-600)] space-y-1 list-disc pr-5">
              <li>سرعة مدروسة</li>
              <li>هوامش صحية</li>
              <li>قياس واضح</li>
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}


