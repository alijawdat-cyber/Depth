"use client";
import React from "react";

type ThemeMode = "light" | "dark" | "system";

type Props = {
  defaultTheme?: ThemeMode;
  children: React.ReactNode;
};

const STORAGE_KEY = "depth.theme";

export function ThemeProvider({ defaultTheme = "system", children }: Props) {
  const [theme, setTheme] = React.useState<ThemeMode>(defaultTheme);

  // Apply theme to <html data-theme>
  React.useEffect(() => {
    try {
      const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as ThemeMode | null;
      const initial: ThemeMode = saved ?? defaultTheme;
      setTheme(initial);
    } catch {}
  }, [defaultTheme]);

  React.useEffect(() => {
    const root = document.documentElement;
    const apply = (mode: ThemeMode) => {
      if (mode === "system") {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', mode);
      }
    };
    apply(theme);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => theme === 'system' && apply('system');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [theme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme: (mode: ThemeMode) => {
      setTheme(mode);
      try { localStorage.setItem(STORAGE_KEY, mode); } catch {}
    }
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

type Ctx = { theme: ThemeMode; setTheme: (m: ThemeMode) => void };
const ThemeContext = React.createContext<Ctx>({ theme: 'system', setTheme: () => {} });

export function useTheme(){
  return React.useContext(ThemeContext);
}
