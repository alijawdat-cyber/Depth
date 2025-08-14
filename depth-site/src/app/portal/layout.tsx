"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />
      <main className="py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}


