import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PortalClient from "@/components/pages/PortalClient";

export const metadata = {
  title: "بوابة العميل (MVP)",
  description: "ملخص العقد، الملفات، الموافقات، التقارير — نسخة أولية.",
};

export default function PortalPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading title="بوابة العميل" subtitle="نسخة أولية — للعرض فقط" align="center" className="mb-6" />
        <PortalClient />
      </Container>
    </main>
  );
}


