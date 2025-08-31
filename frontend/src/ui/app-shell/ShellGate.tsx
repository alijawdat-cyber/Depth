"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { DepthAppShell } from './AppShell';

type Props = { children: React.ReactNode };

export function ShellGate({ children }: Props){
  const pathname = usePathname();
  
  // تحديد الدور حسب المسار - نظام موحد للكل
  const isAdmin = pathname?.startsWith('/admin');
  const isCreator = pathname?.startsWith('/creator');
  const isClient = pathname?.startsWith('/client');
  const isSalaried = pathname?.startsWith('/salaried');
  
  // تحديد الدور للنظام الموحد - كل الأدوار تستخدم نفس النظام
  const userRole = isAdmin ? 'admin' : 
                   isCreator ? 'creator' : 
                   isClient ? 'client' : 
                   isSalaried ? 'salariedEmployee' : 'guest';
  
  // نظام موحد لكل الأدوار بدون استثناءات
  return (
    <DepthAppShell userRole={userRole}>
      {children}
    </DepthAppShell>
  );
}
