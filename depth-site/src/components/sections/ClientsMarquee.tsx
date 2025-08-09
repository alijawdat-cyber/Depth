"use client";

import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { clients } from "@/data/clients";
// ملاحظة: لملفات SVG المحلية نستخدم <img> بدل next/image لتفادي مشاكل الترصيع/الأمان

export default function ClientsMarquee() {
  return (
    <section className="py-10">
      <Container>
        <Marquee>
          {clients.map((c) => (
            <span key={c.slug} className="flex items-center shrink-0 opacity-90 hover:opacity-100 transition px-12">
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                className="h-20 md:h-24 w-auto object-contain min-w-32 logo-enhanced"
                loading="lazy"
                decoding="async"
              />
            </span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}


