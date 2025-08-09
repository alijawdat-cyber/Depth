export const metadata = {
  title: "المدونة",
  description: "ملاحظات عملية حول الأداء والمحتوى وقياس النتائج.",
};

// تجنّب البناء المسبق حتى لا يصير تعارض مع مزوّدات الواجهة وقت الـ prerender
export const dynamic = "force-dynamic";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BlogPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading title="المدونة" subtitle="قريبًا" align="center" />
      </Container>
    </main>
  );
}


