"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect admins out of portal area to /admin
  useEffect(() => {
    const role = (session?.user as { role?: string } | undefined)?.role || "client";
    if (status === "authenticated" && role === "admin") {
      router.replace("/admin");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">{children}</div>
  );
}


