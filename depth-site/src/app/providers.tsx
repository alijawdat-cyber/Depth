"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

type ProvidersProps = {
  children: React.ReactNode;
  /**
   * Pre-fetched session from the server (getServerSession) to ensure
   * identical SSR + first client render => prevents hydration mismatch
   * when Header / nav conditionally render based on auth state & role.
   */
  session: Session | null;
};

export default function Providers({ children, session }: ProvidersProps) {
  // Optional: smooth scrolling via Lenis (if installed)
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const { default: Lenis } = await import("lenis");
        const lenis = new Lenis({
          smoothWheel: true,
          // رفعت القيمة من 0.08 إلى 0.18 لجعل التمرير أسرع استجابة وأقل لزوجة
          lerp: 0.3,
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
    <SessionProvider session={session}>
      <ThemeProvider 
        attribute="data-theme" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
        enableColorScheme={false}
      >
        <MotionConfig
          transition={{ 
            type: "spring", 
            stiffness: 170, 
            damping: 26, 
            mass: 0.8,
            bounce: 0.2
          }}
          reducedMotion="user"
        >
          {children}
        </MotionConfig>
        
        {/* نظام الإشعارات المركزي - Sonner مخصص للعربية */}
        <Toaster 
          richColors 
          position="top-center"
          expand={true}
          closeButton={true}
          dir="rtl"
          toastOptions={{
            style: {
              fontFamily: 'Dubai, -apple-system, sans-serif',
              direction: 'rtl',
            },
            className: 'rtl-toast',
            duration: 4000,
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}


