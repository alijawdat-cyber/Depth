"use client"; // مكوّن عميل
import React from "react"; // React

type ThemeMode = "light" | "dark" | "system"; // نوع الثيم
type Props = { defaultTheme?: ThemeMode; children: React.ReactNode; }; // خصائص المزود

const STORAGE_KEY = "depth.theme"; // مفتاح التخزين

export function ThemeProvider({ defaultTheme = "system", children }: Props){ // مزود الثيم
  const [theme, setTheme] = React.useState<ThemeMode>(defaultTheme); // حالة الثيم

  React.useEffect(() => { // قراءة وحفظ التفضيل فقط؛ التحكم بالـ scheme داخل Mantine
    try {
      const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as ThemeMode | null; // قيمة مخزونة
      const initial: ThemeMode = saved ?? defaultTheme; // قيمة أولية
      setTheme(initial); // ضبط
    } catch {} // تجاهل أخطاء التخزين
  }, [defaultTheme]); // تبعيات

  const value = React.useMemo(() => ({ // قيمة السياق
    theme, // الوضع الحالي
    setTheme: (mode: ThemeMode) => { // تحديث الثيم
      setTheme(mode); // ضبط
      try { localStorage.setItem(STORAGE_KEY, mode); } catch {} // حفظ
    }
  }), [theme]); // إعادة حساب عند التغيير

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>; // تغليف
}

type Ctx = { theme: ThemeMode; setTheme: (m: ThemeMode) => void }; // شكل السياق
const ThemeContext = React.createContext<Ctx>({ theme: 'system', setTheme: () => {} }); // سياق افتراضي

export function useTheme(){ return React.useContext(ThemeContext); } // هوك استعمال السياق
