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
              <div className="flex items-center justify-center mb-4">
                <Image
                  src={c.logo}
                  alt={`${c.name} logo`}
                  width={200}
                  height={80}
                  className="h-16 md:h-20 w-auto object-contain min-w-28 logo-enhanced"
                  loading="lazy"
                />
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


