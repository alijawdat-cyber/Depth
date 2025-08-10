"use client";

import React from "react";
import Marquee from "react-fast-marquee";

type MarqueeSimpleProps = {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  gap?: string;
};

export function MarqueeSimple({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = "",
  gap = "60px", // توحيد القيمة مع ClientsMarquee
}: MarqueeSimpleProps) {
  const items = React.Children.toArray(children).filter(Boolean);
  
  return (
    <Marquee
      autoFill={true} // مهم جداً - يملأ العرض تلقائياً بالعناصر
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      gradient={false}
      className={className}
      style={{
        gap: gap, // استخدام CSS gap بدلاً من padding
      }}
    >
      {/* إزالة padding من العناصر لتجنب الفراغ الأخير */}
      {items.map((node, i) => (
        <div
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexShrink: 0, // يمنع انضغاط العناصر
            marginInlineEnd: gap, // استخدام margin بدلاً من padding
          }}
        >
          {node}
        </div>
      ))}
    </Marquee>
  );
}