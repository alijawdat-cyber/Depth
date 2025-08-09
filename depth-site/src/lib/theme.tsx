"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // حافظ على نفس الحالة الابتدائية بين السيرفر والعميل لتجنب أخطاء hydration
  const [theme, setTheme] = useState<Theme>("light");

  // بعد التركيب على العميل فقط، حدّد الثيم الفعلي من التخزين أو تفضيل النظام
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("theme") as Theme | null;
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  // في طور البناء/السيرفر قد لا يتوفر السياق؛ أعد قيمة افتراضية لمنع أخطاء prerender
  if (!ctx) {
    console.warn("useTheme must be used within ThemeProvider");
    return { theme: "light" as const, setTheme: () => {} };
  }
  return ctx;
}


