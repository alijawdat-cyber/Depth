"use client";
import { useEffect, useState } from "react";
import DepthWordmarkLoader from "@/components/loaders/DepthWordmarkLoader";

/**
 * Route-level loading UI.
 *
 * Previous version used a full-screen `position:fixed` overlay which triggered
 * Next.js dev warning: "Skipping auto-scroll behavior due to 'position: fixed'..."
 * The warning appears because the app router's scroll/focus restore logic skips
 * over fixed / sticky covering elements. We avoid that by:
 * 1. Removing `position:fixed` (use a normal block that fills viewport height).
 * 2. Adding a small delay to prevent flashing for ultra-fast transitions.
 * 3. Keeping it pointer-events-none & aria attributes for accessibility.
 */
export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay show to avoid flicker & unnecessary renders on very fast navigations.
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null; // Nothing rendered => no overlay => no warning.

  return (
    <div
      className="grid min-h-dvh place-items-center bg-[var(--bg)] text-[var(--text)] pointer-events-none select-none"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <DepthWordmarkLoader />
    </div>
  );
}


