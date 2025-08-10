"use client";
import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ClientsGrid from "@/components/sections/ClientsGrid";
import { useRouter } from "next/navigation";

type Case = {
  client: string;
  title: string;
  result: string;
};

const cases: Case[] = [
  { client: "عميل A", title: "تحسين أداء الحملات", result: "+42% ROAS خلال 60 يوم" },
  { client: "عميل B", title: "نظام محتوى أسبوعي", result: "نمو 3x في التحويلات العضوية" },
  { client: "عميل C", title: "Landing + Tracking", result: "انخفاض CPA بنسبة 28%" },
];

export default function WorkPage() {
  const router = useRouter();
  
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
        <SectionHeading title="الأعمال" subtitle="اختيارات سريعة من نماذج العمل والنتائج" align="center" className="mb-10" />
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((c) => (
            <article key={c.client} className="rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)]">
              <div className="text-[var(--slate-600)] text-sm">{c.client}</div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm">{c.result}</p>
            </article>
          ))}
        </div>
      </Container>
      <ClientsGrid />
    </main>
  );
}


