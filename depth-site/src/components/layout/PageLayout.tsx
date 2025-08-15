"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerized?: boolean;
}

export default function PageLayout({ 
  children, 
  className = "",
  containerized = false
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-[var(--bg)] ${className}`}>
      <main className={containerized ? "container mx-auto px-4 py-8" : ""}>
        {children}
      </main>
    </div>
  );
}
