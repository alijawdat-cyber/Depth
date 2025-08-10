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
          {/* مهم: كل عنصر يحتاج wrapper مع margin محدد */}
          {clients.map((c) => (
            <div
              key={c.slug}
              className="mx-8" // استخدام Tailwind margin horizontal
              style={{ display: 'inline-block' }} // مهم جداً
            >
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={120}
                height={60}
                sizes="(max-width:768px) 96px, 120px"
                className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                priority={false}
              />
            </div>
          ))}
        </MarqueeSimple>
      </Container>
    </section>
  );
}