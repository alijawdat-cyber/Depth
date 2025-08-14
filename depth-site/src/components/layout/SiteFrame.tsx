"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { HIDE_HEADER_ON_PATTERNS, HIDE_FOOTER_ON_PATTERNS } from "@/lib/constants/layout";

/**
 * Global site frame that unifies Header/Footer rendering.
 * Applies smart show/hide rules by route so pages don't need
 * to import Header/Footer directly.
 */
export default function SiteFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const shouldHideHeader = HIDE_HEADER_ON_PATTERNS.some((re) => re.test(pathname || ""));
  const shouldHideFooter = HIDE_FOOTER_ON_PATTERNS.some((re) => re.test(pathname || ""));

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}


