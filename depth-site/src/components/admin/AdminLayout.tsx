"use client";

import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import AdminNavigation from "./AdminNavigation";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import Loader from "@/components/loaders/Loader";
import { Button } from "@/components/ui/Button";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  compact?: boolean;
}

export default function AdminLayout({ 
  children, 
  title, 
  description, 
  actions,
  compact = false 
}: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const userRole = (session?.user && (session.user as { role?: string })?.role) || 'client';
  const isAdmin = userRole === 'admin';

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-[var(--muted)]">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-[var(--card)] p-8 rounded-[var(--radius)] border border-[var(--elev)] text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-[var(--accent-500)]" />
          <h1 className="text-xl font-bold text-[var(--text)] mb-2">يجب تسجيل الدخول</h1>
          <p className="text-[var(--muted)] mb-6">
            تحتاج إلى تسجيل الدخول للوصول إلى لوحة الإدارة
          </p>
          <Button onClick={() => location.assign('/portal/auth/signin')}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-[var(--card)] p-8 rounded-[var(--radius)] border border-[var(--elev)] text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-xl font-bold text-[var(--text)] mb-2">لا تملك صلاحية الوصول</h1>
          <p className="text-[var(--muted)] mb-6">
            هذه الصفحة خاصة بمدراء النظام. استخدم بوابتك لمتابعة مشاريعك.
          </p>
          <Button onClick={() => location.assign('/portal')}>
            الانتقال إلى البوابة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Admin Navigation Header */}
      <div className="sticky top-0 z-30 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--elev)]">
        <Container>
          <div className="py-4">
            <AdminNavigation compact />
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <Container>
          {/* Page Header */}
          {(title || actions) && (
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                {title && (
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--text)] mb-1">
                      {title}
                    </h1>
                    {description && (
                      <p className="text-[var(--muted)] text-sm">
                        {description}
                      </p>
                    )}
                  </div>
                )}
                {actions && (
                  <div className="flex items-center gap-2">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Content */}
          {children}
        </Container>
      </div>
    </div>
  );
}
