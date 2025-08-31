"use client"; // مكوّن عميل
import React from 'react'; // React
import { usePathname } from 'next/navigation'; // مسار الصفحة
import { DepthAppShell } from './AppShell'; // غلاف التطبيق

type Props = { children: React.ReactNode }; // خصائص المكوّن

export function ShellGate({ children }: Props){ // بوابة الشيل
  const pathname = usePathname(); // المسار الحالي
  const isAdmin = pathname?.startsWith('/admin'); // أدمن
  const isCreator = pathname?.startsWith('/creator'); // مبدع
  const isClient = pathname?.startsWith('/client'); // عميل
  const isSalaried = pathname?.startsWith('/salaried'); // موظف راتب
  const userRole = isAdmin ? 'admin' : isCreator ? 'creator' : isClient ? 'client' : isSalaried ? 'salariedEmployee' : 'guest'; // تحديد الدور
  return <DepthAppShell userRole={userRole}>{children}</DepthAppShell>; // نظام موحد لكل الأدوار
}
