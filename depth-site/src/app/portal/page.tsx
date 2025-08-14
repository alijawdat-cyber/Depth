"use client";
import { Container } from "@/components/ui/Container";
import PortalClientReal from "@/components/features/portal/PortalClientReal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PortalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If admin hits /portal, redirect to /admin
  useEffect(() => {
    const role = (session?.user && (session.user as { role?: string })?.role) || 'client';
    if (status === 'authenticated' && role === 'admin') {
      router.replace('/admin');
    }
  }, [status, session?.user, router]);
  
  // Show light loader while redirecting admins
  if (status === 'authenticated' && ((session?.user as { role?: string } | undefined)?.role === 'admin')) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--slate-600)]">إعادة التوجيه إلى لوحة الإدارة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="py-8 md:py-12">
        <Container>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                رجوع
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[var(--slate-600)]">متصل</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-2">بوابة العميل</h1>
              <p className="text-[var(--slate-600)]">مركز إدارة مشروعك وتتبع التقدم</p>
            </div>
          </div>
          
          <PortalClientReal />
        </Container>
      </main>
    </div>
  );
}


