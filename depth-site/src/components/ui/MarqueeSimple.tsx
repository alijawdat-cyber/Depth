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
  gap = "56px", // مسافة ثابتة بدلاً من clamp للحصول على نتيجة متسقة
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
    >
      {/* مهم: لا نضع wrapper div - العناصر مباشرة */}
      {items.map((node, i) => (
        <div
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            paddingInlineEnd: gap,
            flexShrink: 0, // يمنع انضغاط العناصر
          }}
        >
          {node}
        </div>
      ))}
    </Marquee>
  );
}