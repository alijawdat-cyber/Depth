import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "الشروط والسياسات",
  description: "عقود مختصرة، سياسة الملكية، بند FX ±3%",
};

// تصدير ثابت عند النشر على GitHub Pages
export const dynamic = "force-static";

export default function LegalPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
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


