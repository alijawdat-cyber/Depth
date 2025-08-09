"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { clients } from "@/data/clients";
import Image from "next/image";

export default function ClientsGrid() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading title="عملاؤنا" subtitle="قصص قصيرة وشعارات" align="center" className="mb-8" />
        <div className="grid gap-5 md:grid-cols-3">
          {clients.map((c) => (
            <article key={c.slug} className="rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)]">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={c.logo}
                  alt={`${c.name} logo`}
                  width={280}
                  height={80}
                  sizes="(min-width:1280px) 280px, (min-width:768px) 240px, 200px"
                  className="h-14 md:h-16 w-auto object-contain"
                />
                <h3 className="font-semibold">{c.name}</h3>
              </div>
              {c.story ? <p className="text-sm text-[var(--slate-600)]">{c.story}</p> : null}
              {c.website ? (
                <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-500)] hover:underline mt-3 inline-block">الموقع</a>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}


