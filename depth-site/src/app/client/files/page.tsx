import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ملفاتي - Depth',
  description: 'عرض وإدارة جميع ملفات العميل',
};

export default function ClientFilesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">ملفاتي</h1>
          <p className="text-[var(--text-muted)]">عرض وإدارة جميع الملفات المرفوعة</p>
        </div>
        
        {/* TODO: Add ClientFilesList component */}
        <div className="bg-[var(--card)] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">مدير الملفات</h2>
          <p className="text-[var(--text-muted)]">سيتم إضافة مكون إدارة الملفات هنا</p>
        </div>
      </div>
    </div>
  );
}
