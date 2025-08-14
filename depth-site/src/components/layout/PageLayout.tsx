"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean; // deprecated: Header is rendered by `SiteFrame`
  showFooter?: boolean; // deprecated: Footer is rendered by `SiteFrame`
  containerized?: boolean;
}

export default function PageLayout({ 
  children, 
  className = "",
  // Prevent header/footer duplication under RootLayout → SiteFrame
  showHeader = false,
  showFooter = false,
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
