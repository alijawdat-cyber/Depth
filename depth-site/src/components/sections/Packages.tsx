"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { clsx } from "clsx";

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
  const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;
  const WA_TEXT = process.env.NEXT_PUBLIC_WA_TEXT || "";
  const waHref = WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}` : "https://wa.me/";
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
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(buttonStyles({ variant: "primary", size: "md" }), "w-full text-center")}
              >
                ابدأ الآن
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


