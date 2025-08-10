"use client";

import { Container } from "@/components/ui/Container";
import { MarqueeSimple } from "@/components/ui/MarqueeSimple";
import { clients } from "@/data/clients";
import Image from "next/image";

export default function ClientsMarquee() {
  // تكرار قائمة العملاء مرتين لضمان الاستمرارية السلسة
  // إذا كان لديك 5 عملاء فقط، التكرار مرتين يعطي 10 عناصر
  const duplicatedClients = [...clients, ...clients];
  
  return (
    <section className="py-10">
      <Container>
        <MarqueeSimple
          speed={40}
          direction="left"
          pauseOnHover={true}
          className="overflow-hidden"
          gap="60px" // مسافة ثابتة ومناسبة بين الشعارات
        >
          {duplicatedClients.map((c, index) => (
            <div
              key={`${c.slug}-${index}`}
              className="flex items-center justify-center"
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