export const metadata = {
  title: "المدونة",
  description: "ملاحظات عملية حول الأداء والمحتوى وقياس النتائج.",
};

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


