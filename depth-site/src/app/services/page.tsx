"use client";
import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER;
  const WA_TEXT = process.env.NEXT_PUBLIC_WA_TEXT || "";
  const waHref = WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}` : "https://wa.me/";
  return (
    <main className="py-16 md:py-24">
      <Container>
        {/* زر الرجوع */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            رجوع
          </button>
        </div>
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
          <a href={waHref} target="_blank" rel="noopener noreferrer" className={clsx(buttonStyles({ variant: "primary" }))}>ابدأ الآن</a>
        </div>
      </Container>
    </main>
  );
}


