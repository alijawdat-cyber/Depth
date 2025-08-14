"use client";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  // Header/Footer are provided globally by the root layout
  return (
    <div className="min-h-screen bg-[var(--bg)]">{children}</div>
  );
}


