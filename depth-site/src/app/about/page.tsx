export const metadata = {
  title: "من نحن",
  description: "Depth — استوديو/وكالة Performance + Content يركز على النتائج ووضوح القياس.",
};

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AboutTeam from "@/components/sections/AboutTeam";

export default function AboutPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading title="من نحن" subtitle="ثقافة تنفيذ، قياس واضح، ونتائج قابلة للتكرار" align="center" className="mb-10" />
        <div className="prose prose-invert:max-w-none max-w-prose md:mx-auto text-[var(--slate-600)]">
          <p>
            Depth تبني أنظمة محتوى وأداء تسويقي متكاملة. نشتغل بخطط شهرية واضحة، مع باقات تناسب مراحل النمو المختلفة.
            هدفنا تسريع الاختبار، تحسين الهامش، وتثبيت قياس واضح لقرارات أسرع.
          </p>
          <p>
            فريقنا يجمع بين التصوير، التصميم، النسخ، إدارة الإعلانات، وتحليل البيانات — تحت خط زمني منضبط.
          </p>
        </div>
      </Container>
      <AboutTeam />
    </main>
  );
}


