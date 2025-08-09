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
            <span key={c.slug} className="flex items-center justify-center shrink-0 opacity-90 hover:opacity-100 transition w-[180px]">
              <img
                src={c.logo}
                alt={`${c.name} logo`}
                className="h-14 md:h-16 w-auto object-contain logo-enhanced"
                loading="eager"
                decoding="async"
              />
            </span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}


