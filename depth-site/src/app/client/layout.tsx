import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة العميل - Depth',
  description: 'لوحة تحكم العميل لإدارة المشاريع والملفات والموافقات',
};

export default function ClientLayout({
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
