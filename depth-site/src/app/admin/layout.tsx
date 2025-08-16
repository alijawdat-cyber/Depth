"use client";

// توثيق: قشرة (Shell) موحّدة لكل صفحات الأدمن
// الغرض: توحيد تجربة التنقل والإطارات البصرية عبر /admin/* بإظهار شريط تنقل إداري ثابت
// هذا يحقق الانتقال من الواجهة العامة القديمة إلى واجهة إدارية موحّدة متوافقة مع الوثائق

import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* شريط التنقل الإداري الثابت */}
      <AdminNavigation />
      {/* محتوى الصفحة الفرعية */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">{children}</div>
    </div>
  );
}


