"use client";
import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const node = ref.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.2, ...(options || {}) });
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, options]);

  return { ref, inView } as const;
}
