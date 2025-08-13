"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  // Optional: smooth scrolling via Lenis (if installed)
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const { default: Lenis } = await import("lenis");
        const lenis = new Lenis({
          smoothWheel: true,
          lerp: 0.08,
        });
        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        cleanup = () => lenis.destroy();
      } catch {
        // lenis is optional
      }
    })();
    return () => cleanup?.();
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
        <MotionConfig
          transition={{ type: "spring", stiffness: 170, damping: 26, mass: 0.8 }}
          reducedMotion="user"
        >
          {children}
        </MotionConfig>
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </SessionProvider>
  );
}


