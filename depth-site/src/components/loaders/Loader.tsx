"use client";
import * as React from "react";
import { useTheme } from "next-themes";

type LoaderProps = {
  dots?: number;
  size?: number; // pixel diameter per dot
  gap?: number; // pixel gap between dots
};

export default function Loader({ dots = 5, size = 14, gap = 16 }: LoaderProps) {
  const items = Array.from({ length: dots });
  const accent500 = "var(--accent-500)";
  const accent400 = "var(--accent-400)";
  const { resolvedTheme } = useTheme();
  
  // تحسين التعامل مع التحميل الأولي
  const getOverlayBg = () => {
    if (resolvedTheme === "dark") return "rgba(11,15,20,0.7)";
    if (resolvedTheme === "light") return "rgba(255,255,255,0.8)";
    // fallback للتحميل الأولي - يتكيف مع prefers-color-scheme
    return "rgba(var(--bg-rgb, 255,255,255), 0.8)";
  };
  
  const overlayBg = getOverlayBg();

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center backdrop-blur-sm" style={{ backgroundColor: overlayBg }}>
      <div className="flex items-center" style={{ gap }} aria-label="جاري التحميل">
        {items.map((_, i) => (
          <span
            key={i}
            className="inline-block rounded-full dotWave"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 30% 30%, ${accent400}, ${accent500})`,
              animation: `dotWave 1.2s ease-in-out ${i * 0.12}s infinite`,
              boxShadow: "0 2px 6px rgba(108,43,255,0.25)",
            }}
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes dotWave {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.85; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dotWave { animation: none !important; }
        }
      `}</style>
    </div>
  );
}


