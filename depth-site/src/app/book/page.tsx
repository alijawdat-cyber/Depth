import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BookClient from "@/components/pages/BookClient";

export const metadata = {
  title: "حجز",
  description: "احجز جلسة تعريف 20 دقيقة وأجب على أسئلة أهلية قصيرة.",
};
export default function BookPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
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


