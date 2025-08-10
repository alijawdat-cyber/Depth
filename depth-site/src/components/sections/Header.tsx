"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { useTheme } from "next-themes";
import { clsx } from "clsx";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/plans", label: "الخطط" },
  { href: "/services", label: "الخدمات" },
  { href: "/work", label: "الأعمال" },
  { href: "/about", label: "من نحن" },
  { href: "/blog", label: "المدونة" },
  { href: "/contact", label: "تواصل" },
];

// WhatsApp CTA is now replaced with internal /book route

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  // امنع تغيّر الأيقونة بين SSR والعميل لتجنّب hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--elev)]">
      <Container className="flex items-center justify-between h-14">
        <Link href="/" className="flex items-center" aria-label="Depth Home">
          <Image src="/depth-logo.svg" alt="Depth" width={135} height={30} className="h-7 md:h-8 lg:h-9 w-auto min-w-28 brand-logo" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--accent-500)] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={toggleTheme}
            aria-label="toggle theme"
            className="hidden sm:inline-flex"
          >
            {mounted ? (resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : null}
          </Button>
          <Link
            href="/book"
            className={clsx(buttonStyles({ variant: "primary", size: "md" }), "hidden sm:inline-flex")}
          >
            احجز جلسة
          </Link>
          <button aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--elev)]" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>
      {open ? (
        <div id="mobile-menu" className="md:hidden border-t border-[var(--elev)] bg-[var(--bg)]/95 backdrop-blur px-4 py-3">
          <nav className="grid gap-2 text-sm">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 rounded-[var(--radius-sm)] hover:bg-[var(--neutral-50)]">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="secondary" onClick={toggleTheme} aria-label="toggle theme" className="flex-1">
              <span suppressHydrationWarning>{mounted ? (resolvedTheme === "dark" ? "وضع فاتح" : "وضع داكن") : "تبديل الوضع"}</span>
            </Button>
            <Link
              href="/book"
              className={clsx(buttonStyles({ variant: "primary", size: "md" }), "flex-1 text-center")}
            >
              احجز جلسة
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}


