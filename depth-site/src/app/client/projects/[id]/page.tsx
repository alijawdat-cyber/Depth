import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تفاصيل المشروع - Depth',
  description: 'عرض تفاصيل المشروع والملفات والموافقات',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">تفاصيل المشروع</h1>
          <p className="text-[var(--text-muted)]">مشروع رقم: {id}</p>
        </div>
        
        {/* TODO: Add ClientProjectDetail component */}
        <div className="bg-[var(--card)] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">تفاصيل المشروع</h2>
          <p className="text-[var(--text-muted)]">سيتم إضافة مكون تفاصيل المشروع هنا</p>
        </div>
      </div>
    </div>
  );
}
