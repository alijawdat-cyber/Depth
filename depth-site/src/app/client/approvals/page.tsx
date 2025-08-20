import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'موافقاتي - Depth',
  description: 'عرض وإدارة جميع الموافقات المطلوبة',
};

export default function ClientApprovalsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">موافقاتي</h1>
          <p className="text-[var(--text-muted)]">مراجعة والرد على الموافقات المطلوبة</p>
        </div>
        
        {/* TODO: Add ClientApprovalsList component */}
        <div className="bg-[var(--card)] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">قائمة الموافقات</h2>
          <p className="text-[var(--text-muted)]">سيتم إضافة مكون قائمة الموافقات هنا</p>
        </div>
      </div>
    </div>
  );
}
