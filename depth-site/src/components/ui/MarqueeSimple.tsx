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
  gap = "clamp(12px, 2.5vw, 48px)",
}: MarqueeSimpleProps) {
  const items = React.Children.toArray(children).filter(Boolean);
  const styleVars = { "--marquee-gap": gap } as React.CSSProperties;

  return (
    <Marquee
      autoFill
      loop={0}
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      className={className}
      gradient={false}
      style={{ margin: 0, padding: 0 }}
    >
      <div
        style={{
          ...styleVars,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
      >
        {items.map((node, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              flex: "0 0 auto",
              marginInlineEnd: "var(--marquee-gap)",
            }}
          >
            {node}
          </span>
        ))}
      </div>
    </Marquee>
  );
}