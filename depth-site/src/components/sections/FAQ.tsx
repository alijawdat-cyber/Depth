"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";

const items = [
  { id: "f1", question: "كيف تتم البداية؟", answer: "جلسة تعارف سريعة، ثم عرض مختصر، وبعدها بدء تجريبي لمدة 30 يوم." },
  { id: "f2", question: "هل هناك التزام طويل؟", answer: "الباقات شهرية ويمكن الإلغاء أو الترقية في أي وقت." },
  { id: "f3", question: "كيف يتم القياس؟", answer: "لوحات تحكم وتقارير دورية مع UTM وتتبع واضح على كل قناة." },
];

export default function FAQ() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading title="أسئلة شائعة" align="center" className="mb-8" />
        <Accordion items={items} />
      </Container>
    </section>
  );
}


