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
                width={360}
                height={100}
                sizes="(min-width:1280px) 360px, (min-width:768px) 300px, 240px"
                className="h-16 md:h-20 w-auto object-contain min-w-28 logo-enhanced"
              />
            </span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}


