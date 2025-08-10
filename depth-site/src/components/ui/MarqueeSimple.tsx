"use client";

import Marquee from "react-fast-marquee";

type MarqueeSimpleProps = {
  children: React.ReactNode;
  speed?: number; // 1-500
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
};

export function MarqueeSimple({ 
  children, 
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = ""
}: MarqueeSimpleProps) {
  return (
    <Marquee
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      className={className}
      gradient={false} // نوقف التدرج لأن لدينا ستايل مخصص
      style={{
        // تأكد من عدم وجود margin أو padding غير مرغوب
        margin: 0,
        padding: 0,
      }}
    >
      <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
        {children}
      </div>
    </Marquee>
  );
}
