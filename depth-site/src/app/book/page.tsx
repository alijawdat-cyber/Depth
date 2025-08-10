"use client";
import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BookClient from "@/components/pages/BookClient";
import { useRouter } from "next/navigation";


export default function BookPage() {
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
        <SectionHeading
          title="احجز"
          subtitle="اختر وقتًا مناسبًا وأجب على 6 أسئلة بسيطة لنفهم سياقك بسرعة"
          align="center"
          className="mb-10"
        />
        <BookClient />
      </Container>
    </main>
  );
}


