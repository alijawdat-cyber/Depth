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
          pauseOnHover={true}
          className="overflow-hidden"
        >
          {clients.map((c) => (
            <div key={c.slug} className="flex items-center justify-center mx-6 md:mx-8 lg:mx-12">
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={120}
                height={60}
                className="h-12 md:h-16 w-auto object-contain logo-enhanced opacity-90 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </MarqueeSimple>
      </Container>
    </section>
  );
}


