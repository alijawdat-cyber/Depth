import { Container } from "@/components/ui/Container";

export default function BlogPostPage() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        <h1 className="text-2xl md:text-3xl font-bold">عنوان التدوينة</h1>
        <p className="mt-4 text-[var(--slate-600)]">محتوى تجريبي — سيتم ربط CMS لاحقًا.</p>
      </Container>
    </main>
  );
}


