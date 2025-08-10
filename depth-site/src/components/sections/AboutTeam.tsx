"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { TEAM } from "@/data/team";
import Image from "next/image";

export default function AboutTeam() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading title="الفريق" subtitle="مصورون/محررون/إدارة أداء" align="center" className="mb-8" />
        {/* Founder spotlight */}
        {(() => {
          const founder = TEAM.find(
            (t) => t.id === "ali" || t.name.toLowerCase().includes("ali")
          );
          if (!founder) return null;
          return (
          <div className="rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)] mb-10 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 rounded-[var(--radius)]" />
                <Image src={founder.photo || "/team/ali-jawdat.jpg"} alt={founder.name} width={640} height={640} className="w-full h-64 md:h-full object-cover rounded-[var(--radius)]" />
              </div>
              <div className="flex-1 grid content-center">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--accent-500),#9F65FF)]">{founder.name}</h3>
                <div className="text-sm text-[var(--slate-600)] mb-3">{founder.roleAr || founder.roleEn}</div>
                {founder.quoteAr || founder.quoteEn ? (
                  <blockquote className="text-base leading-7">{founder.quoteAr || founder.quoteEn}</blockquote>
                ) : null}
              </div>
            </div>
          </div>
          );
        })()}
        <div className="grid gap-6 md:grid-cols-3">
          {TEAM.map((m) => (
            <article key={m.id} className="rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)]">
              <div className="flex items-center gap-4">
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                ) : null}
                <div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <div className="text-sm text-[var(--slate-600)]">{m.roleAr || m.roleEn}</div>
                </div>
              </div>
              {m.quoteAr || m.quoteEn ? (
                <p className="text-sm text-[var(--slate-600)] mt-3">{m.quoteAr || m.quoteEn}</p>
              ) : null}
              <div className="flex gap-4 mt-3 text-sm">
                {m.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {l.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}


