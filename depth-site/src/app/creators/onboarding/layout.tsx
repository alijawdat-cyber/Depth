// Layout خاص بصفحات الـ Onboarding
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'انضمام المبدعين - Depth Creative Platform',
  description: 'انضم إلى منصة Depth كمبدع محتوى واحصل على مشاريع مميزة من أفضل العلامات التجارية',
  keywords: 'مبدع محتوى، تصوير، فيديو، تصميم، فرص عمل، العراق',
  openGraph: {
    title: 'انضمام المبدعين - Depth Creative Platform',
    description: 'انضم إلى منصة Depth كمبدع محتوى واحصل على مشاريع مميزة',
    type: 'website',
    locale: 'ar_IQ',
  },
  robots: {
    index: false, // لا نريد فهرسة صفحات التسجيل في محركات البحث
    follow: false,
  }
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {children}
    </div>
  );
}
