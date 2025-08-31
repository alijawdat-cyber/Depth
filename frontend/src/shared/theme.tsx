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

  // قراءة وحفظ التفضيل فقط (بدون كتابة attribute)؛ التحكم بالـ scheme يتم داخل Mantine
  React.useEffect(() => {
    try {
      const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as ThemeMode | null;
      const initial: ThemeMode = saved ?? defaultTheme;
      setTheme(initial);
    } catch {}
  }, [defaultTheme]);

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
