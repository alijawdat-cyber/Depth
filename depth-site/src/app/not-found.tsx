import Link from "next/link";

// تجنّب البناء المسبق لهاي الصفحة لأن بعض تبعيات الواجهة (React/SEO) تسبب خطأ وقت الـ prerender
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-[var(--slate-600)] mb-6">تأكد من الرابط أو ارجع للصفحة الرئيسية.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-[var(--radius)] px-5 h-11 text-sm font-medium bg-[var(--accent-500)] text-[var(--text-dark)] hover:bg-[var(--accent-700)]">
          رجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}


