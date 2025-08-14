"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  containerized?: boolean;
}

export default function PageLayout({ 
  children, 
  className = "",
  showHeader = true,
  showFooter = true,
  containerized = false
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[var(--bg)] to-[var(--elev)] ${className}`}>
      {showHeader && <Header />}
      <main className={containerized ? "container mx-auto px-4 py-8" : ""}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
