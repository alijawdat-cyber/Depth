"use client";

import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants/brand";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { useTheme } from "next-themes";
import { clsx } from "clsx";
import { Menu, X, Sun, Moon, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { NAV_ITEMS, CTA_ITEMS } from "@/lib/constants/nav";

// WhatsApp CTA is now replaced with internal /book route

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  // امنع تغيّر الأيقونة بين SSR والعميل لتجنّب hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const [open, setOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const role = (session?.user as { role?: string } | undefined)?.role || "client";

  // Close on ESC + return focus to menu button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setAcctOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    if (open || acctOpen) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [open, acctOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--elev)]">
      <Container className="flex items-center justify-between min-h-14 h-14">
        <Link href="/" className="flex items-center" aria-label="Depth Home">
          <Image src={BRAND.wordmark} alt="Depth" width={135} height={30} className="h-7 md:h-8 lg:h-9 w-auto min-w-28 brand-logo" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {NAV_ITEMS.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  "transition-colors",
                  active ? "text-[var(--accent-600)] underline underline-offset-4" : "hover:text-[var(--accent-500)]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={toggleTheme}
            aria-label="toggle theme"
            className="inline-flex"
          >
            {mounted ? (resolvedTheme === "dark" ? <Sun size={16} strokeWidth={1.25} className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Moon size={16} strokeWidth={1.25} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />) : null}
          </Button>
          {status === 'authenticated' ? (
            <div className="relative hidden sm:flex">
              <button
                aria-label="account menu"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--elev)] hover:bg-[var(--elev)]"
                onClick={() => setAcctOpen(!acctOpen)}
              >
                <User size={16} />
                <span className="text-sm">حسابي</span>
              </button>
              {acctOpen && (
                <div className="absolute top-full mt-2 right-0 w-44 bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-sm)] shadow-lg p-1 text-sm">
                  <Link href="/portal" className="block px-3 py-2 rounded hover:bg-[var(--elev)]" onClick={() => setAcctOpen(false)}>بوابتي</Link>
                  <Link href="/portal/profile" className="block px-3 py-2 rounded hover:bg-[var(--elev)]" onClick={() => setAcctOpen(false)}>ملفي</Link>
                  {role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 rounded hover:bg-[var(--elev)]" onClick={() => setAcctOpen(false)}>لوحة الأدمن</Link>
                  )}
                  <button className="w-full text-right px-3 py-2 rounded hover:bg-[var(--elev)]" onClick={() => { setAcctOpen(false); signOut({ callbackUrl: '/' }); }}>خروج</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href={CTA_ITEMS.signin.href} className={clsx(buttonStyles({ variant: 'secondary', size: 'md' }), 'hidden sm:inline-flex text-[12px] sm:text-[13px] leading-none px-2.5 sm:px-3 whitespace-nowrap')}>
                {CTA_ITEMS.signin.label}
              </Link>
              <Link href={CTA_ITEMS.book.href} className={clsx(buttonStyles({ variant: 'primary', size: 'md' }), 'hidden sm:inline-flex text-[12px] sm:text-[13px] leading-none px-2.5 sm:px-3 whitespace-nowrap')}>
                {CTA_ITEMS.book.label}
              </Link>
            </>
          )}
          <button aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--elev)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" ref={menuBtnRef}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>
      {open ? (
        <div id="mobile-menu" className="md:hidden border-t border-[var(--elev)] bg-[var(--bg)]/95 backdrop-blur px-4 py-3">
          <nav className="grid gap-2 text-base">
            {NAV_ITEMS.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    "py-3.5 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]",
                    active ? "bg-[var(--neutral-50)]" : "hover:bg-[var(--neutral-50)]"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="secondary" onClick={toggleTheme} aria-label="toggle theme" className="flex-1">
              <span suppressHydrationWarning>{mounted ? (resolvedTheme === "dark" ? "وضع فاتح" : "وضع داكن") : "تبديل الوضع"}</span>
            </Button>
            {status === 'authenticated' ? (
              <button className={clsx(buttonStyles({ variant: 'primary', size: 'md' }), 'flex-1 text-center')} onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }); }}>خروج</button>
            ) : (
              <>
                <Link href={CTA_ITEMS.signin.href} onClick={() => setOpen(false)} className={clsx(buttonStyles({ variant: 'secondary', size: 'md' }), 'flex-1 text-center whitespace-nowrap')}>{CTA_ITEMS.signin.label}</Link>
                <Link href={CTA_ITEMS.book.href} onClick={() => setOpen(false)} className={clsx(buttonStyles({ variant: 'primary', size: 'md' }), 'flex-1 text-center whitespace-nowrap')}>{CTA_ITEMS.book.label}</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}


