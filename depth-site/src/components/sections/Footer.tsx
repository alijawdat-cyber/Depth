import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--elev)] py-10 text-sm text-[var(--slate-600)]">
      <Container className="grid gap-6 md:grid-cols-3 items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text)]">Depth</span>
          <span suppressHydrationWarning>© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-5">
          <Link href="/plans" className="hover:underline">الخطط</Link>
          <Link href="/services" className="hover:underline">الخدمات</Link>
          <Link href="/work" className="hover:underline">الأعمال</Link>
          <Link href="/about" className="hover:underline">من نحن</Link>
          <Link href="/blog" className="hover:underline">المدونة</Link>
          <Link href="/contact" className="hover:underline">تواصل</Link>
          <Link href="/book" className="hover:underline">حجز</Link>
          <Link href="/portal" className="hover:underline">بوابة العميل</Link>
          <Link href="/legal" className="hover:underline">الشروط</Link>
        </nav>
        <div className="flex justify-end gap-4">
          <a href="https://wa.me/9647779761547?text=مرحباً! أريد الاستفسار عن خدماتكم" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
          <a href="mailto:hello@depth-agency.com" className="hover:underline">Email</a>
          <a href="https://www.instagram.com/depth_agency/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          <a href="https://www.facebook.com/depthagency" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
        </div>
      </Container>
    </footer>
  );
}



