"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { clients } from "@/data/clients";
import Image from "next/image";

const items = [
  { name: "أحمد", role: "مدير تسويق", quote: "نتائج ملموسة خلال شهرين—وضوح في التقارير وسرعة بالتنفيذ." },
  { name: "سارة", role: "مؤسسة", quote: "انضباط عالي ومواعيد دقيقة—الباقات فعلاً تغطي كل المطلوب." },
  { name: "كريم", role: "Growth", quote: "UTM و Landing وتركيب تتبّع مزبوط—انخفض الـCPA بشكل ممتاز." },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-[var(--neutral-50)] dark:bg-[var(--ink-800)]">
      <Container>
        <SectionHeading title="قالوا عنّا" align="center" className="mb-8" />
        <Carousel options={{ loop: true }}>
          {items.map((t, idx) => (
            <figure key={t.name} className="min-w-0 shrink-0 basis-full md:basis-[48%] lg:basis-[32%] rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--bg)]">
              <blockquote className="text-sm text-[var(--slate-600)]">{t.quote}</blockquote>
              <figcaption className="mt-4 font-medium flex items-center gap-3">
                {clients[idx % clients.length] ? (
                  <Image
                    src={clients[idx % clients.length].logo}
                    alt="logo"
                    width={300}
                    height={84}
                    sizes="(min-width:1280px) 300px, (min-width:768px) 260px, 220px"
                    className="h-14 md:h-16 w-auto object-contain"
                  />
                ) : null}
                <span>{t.name} — <span className="text-[var(--slate-600)]">{t.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}


