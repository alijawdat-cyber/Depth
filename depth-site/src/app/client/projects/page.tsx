import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مشاريعي - Depth',
  description: 'عرض جميع مشاريع العميل وحالتها',
};

export default function ClientProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">مشاريعي</h1>
          <p className="text-[var(--text-muted)]">عرض وإدارة جميع مشاريعك</p>
        </div>
        
        {/* TODO: Add ClientProjectsList component */}
        <div className="bg-[var(--card)] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">قائمة المشاريع</h2>
          <p className="text-[var(--text-muted)]">سيتم إضافة مكون قائمة المشاريع هنا</p>
        </div>
      </div>
    </div>
  );
}
