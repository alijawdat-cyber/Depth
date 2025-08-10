"use client";

import { Container } from "@/components/ui/Container";
import { MarqueeSimple } from "@/components/ui/MarqueeSimple";
import { clients } from "@/data/clients";
import Image from "next/image";

export default function ClientsMarquee() {
  return (
    <section className="py-10">
      <Container>
        <MarqueeSimple
          speed={40}
          direction="left"
          pauseOnHover
          className="overflow-hidden"
          gap="clamp(10px, 3vw, 56px)"
        >
          {clients.map((c) => (
            <span key={c.slug} className="flex items-center justify-center">
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={120}
                height={60}
                sizes="(max-width:768px) 96px, 120px"
                className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </span>
          ))}
        </MarqueeSimple>
      </Container>
    </section>
  );
}