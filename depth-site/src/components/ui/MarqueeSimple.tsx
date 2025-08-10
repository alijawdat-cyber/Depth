"use client";

import React from "react";
import Marquee from "react-fast-marquee";

type MarqueeSimpleProps = {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
};

export function MarqueeSimple({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: MarqueeSimpleProps) {
  return (
    <Marquee
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      gradient={false}
      className={className}
      autoFill={true}
    >
      {children}
    </Marquee>
  );
}