"use client";
import DepthWordmarkLoader from "@/components/loaders/DepthWordmarkLoader";

export default function Loading() {
  return (
  <div className="fixed inset-0 z-[9999] grid place-items-center bg-[var(--bg)] text-[var(--text)] pointer-events-none" aria-busy="true" aria-live="polite">
      <DepthWordmarkLoader />
    </div>
  );
}


