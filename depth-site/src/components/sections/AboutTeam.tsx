"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { team } from "@/data/team";
import Image from "next/image";

export default function AboutTeam() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading title="الفريق" subtitle="مصورون/محررون/إدارة أداء" align="center" className="mb-8" />
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <article key={m.name} className="rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)]">
              <div className="flex items-center gap-4">
                {m.avatar ? (
                  <Image src={m.avatar} alt={m.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                ) : null}
                <div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <div className="text-sm text-[var(--slate-600)]">{m.role}</div>
                </div>
              </div>
              {m.bio ? <p className="text-sm text-[var(--slate-600)] mt-3">{m.bio}</p> : null}
              <div className="flex gap-4 mt-3 text-sm">
                {m.instagram ? <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a> : null}
                {m.portfolio ? <a href={m.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a> : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}


