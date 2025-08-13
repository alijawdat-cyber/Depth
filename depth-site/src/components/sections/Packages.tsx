"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { PACKAGES } from "@/lib/integrations/whatsapp";

type Plan = {
  name: string;
  price: string;
  bullets: string[];
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: "$1,200/mo",
    bullets: ["2 أيام تصوير", "8–10 تصميم", "6–8 ريلز", "تقارير شهرية", "إدارة إعلانات +12% (حد أدنى $350)"],
  },
  {
    name: "Growth",
    price: "$1,800/mo",
    bullets: ["3 أيام تصوير", "15–18 تصميم", "10–12 ريلز", "تقارير نصف شهرية", "إدارة إعلانات +12% (حد أدنى $350)"],
  },
  {
    name: "Pro",
    price: "$2,500/mo",
    bullets: ["4 أيام تصوير", "22–25 تصميم", "14–16 ريلز + موشن خفيف", "Dashboard أسبوعي", "إدارة إعلانات +12% (حد أدنى $500)"],
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          title="الباقات الشهرية"
          subtitle="سرعة إنتاج + هامش مضبوط + قياس واضح"
          align="center"
          className="mb-8"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className="rounded-[var(--radius)] border border-[var(--elev)] p-5 bg-[var(--card)]">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="text-[var(--slate-600)]">{p.price}</div>
              </div>
              <ul className="text-sm space-y-1 mb-4 list-disc ps-5">
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <WhatsAppButton
                messageOptions={{
                  type: 'package',
                  packageName: p.name === 'Basic' ? PACKAGES.basic.arabicName :
                              p.name === 'Growth' ? PACKAGES.growth.arabicName :
                              PACKAGES.pro.arabicName,
                  details: `أود الاستفسار عن باقة ${p.name} بسعر ${p.price}. الخدمات المشمولة: ${p.bullets.join('، ')}`
                }}
                className="w-full"
              >
                اختر هذه الباقة
              </WhatsAppButton>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


