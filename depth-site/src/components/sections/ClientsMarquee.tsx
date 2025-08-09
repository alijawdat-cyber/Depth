"use client";

import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { clients } from "@/data/clients";
import Image from "next/image";

export default function ClientsMarquee() {
  return (
    <section className="py-10">
      <Container>
        <Marquee>
          {clients.map((c) => (
            <span key={c.slug} className="flex items-center opacity-80 hover:opacity-100 transition px-10">
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={280}
                height={80}
                sizes="(min-width:1280px) 280px, (min-width:768px) 240px, 200px"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}


