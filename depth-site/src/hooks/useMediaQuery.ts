"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook for responsive media queries
 * Returns true if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // تجنب SSR issues
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    
    // تعيين القيمة الأولية
    setMatches(mediaQuery.matches);

    // دالة التحديث
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // الاستماع للتغييرات
    mediaQuery.addEventListener("change", handler);

    // تنظيف
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Prebuilt breakpoints للاستخدام المباشر
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
export const useIsLargeScreen = () => useMediaQuery("(min-width: 1440px)");
