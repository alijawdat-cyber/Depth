export const metadata = {
  title: "الخدمات",
  description: "باقات شهرية وخدمات مخصصة: إنتاج محتوى، إدارة إعلانات، إستراتيجية وأتمتة.",
};

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/Button";
import { clsx } from "clsx";

const services = [
  {
    title: "إنتاج المحتوى",
    bullets: ["تصوير منتجات وخدمات", "تصميمات سوشال", "ريلز وموشن خفيف", "نسخ كتابة (Copy)"]
  },
  {
    title: "Performance Marketing",
    bullets: ["إعلانات Meta/Google", "Landing Pages", "UTM & Tracking", "تقارير ولوحات تحكم"]
  },
  {
    title: "الإستراتيجية والأتمتة",
    bullets: ["تخطيط شهري/ربع سنوي", "Calendar & Ops", "CRM & Flows", "تحسينات متواصلة"]
  },
];

export default function ServicesPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading title="الخدمات" subtitle="حلول كاملة من التخطيط للإنتاج للتوزيع والقياس" align="center" className="mb-10" />
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)]">
              <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
              <ul className="list-disc ps-5 space-y-1 text-sm text-[var(--slate-600)]">
                {s.bullets.map((b) => (<li key={b}>{b}</li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className={clsx(buttonStyles({ variant: "primary" }))}>ابدأ الآن</a>
        </div>
      </Container>
    </main>
  );
}


