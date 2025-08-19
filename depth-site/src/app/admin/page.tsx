"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminRoot() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      // Not signed in, redirect to sign in
      router.push("/auth/signin?callbackUrl=/admin/dashboard");
      return;
    }

    const userRole = (session.user as { role?: string })?.role || 'client';
    
    if (userRole !== 'admin') {
      // Not admin, redirect to appropriate page
      router.push("/portal");
      return;
    }

    // Admin user, redirect to dashboard
    router.push("/admin/dashboard");
  }, [session, status, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        <p className="text-[var(--muted)]">جاري التحويل إلى لوحة التحكم...</p>
      </div>
    </div>
  );
}
