"use client";
import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { useRouter } from "next/navigation";



export default function LegalPage() {
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
          title="الشروط والسياسات"
          subtitle="نصوص مختصرة وواضحة، نسخة كاملة تتوفر عبر التوقيع الإلكتروني"
          align="center"
          className="mb-10"
        />
        <div className="prose prose-invert:prose md:prose-lg max-w-none">
          <h3>MSA/SOW مختصر</h3>
          <ul>
            <li>الملكية: تنتقل بعد السداد الكامل للدفعة المستحقة.</li>
            <li>الاستخدام: ترخيص تجاري كامل ضمن النطاق المتفق عليه.</li>
            <li>المراجعات: حسب الباقة؛ أي نطاق إضافي يُسعّر منفصلًا.</li>
          </ul>
          <h3>بند FX</h3>
          <p>
            أسعارنا بالدولار الأمريكي. التحصيل بالدينار العراقي حسب سعر صرف مرجعي 1 USD ≈ 1,400 IQD مع بند تسوية ±3% شهريًا.
          </p>
          <h3>الخصوصية</h3>
          <p>نحتفظ فقط بالبيانات الضرورية للتواصل والتنفيذ. لا نبيع بيانات العملاء.</p>
        </div>
      </Container>
    </main>
  );
}


