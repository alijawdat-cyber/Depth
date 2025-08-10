import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PlansClient from "@/components/pages/PlansClient";

export const metadata = {
  title: "الخطط",
  description: "مقارنة الباقات بالتفاصيل المتوقعة والنطاق والقيود.",
};
export default function PlansPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading
          title="الخطط"
          subtitle="قارن الباقات واختر الأنسب. التفاصيل والقيود موضّحة بوضوح"
          align="center"
          className="mb-10"
        />
        <PlansClient />
      </Container>
    </main>
  );
}


