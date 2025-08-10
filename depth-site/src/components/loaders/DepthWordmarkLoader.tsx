"use client";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";

type Props = {
  text?: string;
  from?: string;
  to?: string;
  speed?: number;
  underlineHeight?: number;
  className?: string;
};

export default function DepthWordmarkLoader({
  text = "DEPTH",
  from = "#6C2BFF",
  to = "#9F65FF",
  speed = 1.6,
  underlineHeight = 3,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const spanStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    display: "inline-block",
  };

  return (
    <div
      className={`inline-flex flex-col items-center gap-3 select-none ${className}`}
      role="status"
      aria-label="جاري التحميل…"
    >
      {reduce ? (
        <>
          <span style={spanStyle} className="text-3xl font-bold tracking-wide">
            {text}
          </span>
          <div
            className="rounded-full"
            style={{
              height: underlineHeight,
              width: "60%",
              background: `linear-gradient(90deg, ${from}, ${to})`,
            }}
          />
        </>
      ) : (
        <>
          <motion.span
            style={spanStyle}
            className="text-3xl font-bold tracking-wide"
            animate={{
              y: [0, -2, 0],
              letterSpacing: ["0.02em", "0.06em", "0.02em"],
            }}
            transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
          <motion.div
            className="rounded-full"
            style={{
              height: underlineHeight,
              background: `linear-gradient(90deg, ${from}, ${to})`,
            }}
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{
              duration: speed + 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}


