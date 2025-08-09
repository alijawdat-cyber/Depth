"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button, buttonStyles } from "@/components/ui/Button";
import { useTheme } from "@/lib/theme";
import { clsx } from "clsx";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/services", label: "الخدمات" },
  { href: "/work", label: "الأعمال" },
  { href: "/about", label: "من نحن" },
  { href: "/blog", label: "المدونة" },
  { href: "/contact", label: "تواصل" },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--elev)]">
      <Container className="flex items-center justify-between h-14">
        <Link href="/" className="flex items-center" aria-label="Depth Home">
          <Image src="/depth-logo.svg" alt="Depth" width={400} height={85} className="h-16 md:h-20 w-auto min-w-32 logo-enhanced" />
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--accent-500)] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={toggleTheme} aria-label="toggle theme" className="hidden sm:inline-flex">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(buttonStyles({ variant: "primary", size: "md" }), "hidden sm:inline-flex")}
          >
            احجز جلسة
          </a>
          <button aria-label="menu" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--elev)]" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>
      {open ? (
        <div className="md:hidden border-t border-[var(--elev)] bg-[var(--bg)]/95 backdrop-blur px-4 py-3">
          <nav className="grid gap-2 text-sm">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 rounded-[var(--radius-sm)] hover:bg-[var(--neutral-50)]">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 mt-3">
            <Button variant="secondary" onClick={toggleTheme} aria-label="toggle theme" className="flex-1">
              {theme === "dark" ? "وضع فاتح" : "وضع داكن"}
            </Button>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(buttonStyles({ variant: "primary", size: "md" }), "flex-1 text-center")}
            >
              احجز جلسة
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}


