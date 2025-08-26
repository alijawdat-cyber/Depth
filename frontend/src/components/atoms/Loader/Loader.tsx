"use client";
import React from "react";
import { Loader as MantineLoader } from "@mantine/core";

export type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type LoaderType = "oval" | "bars" | "dots";

export interface LoaderProps {
  /** Size of the loader */
  size?: LoaderSize;
  /** Type of loader animation */
  type?: LoaderType;
  /** Color of the loader */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(function Loader(
  {
    size = "md",
    type = "oval",
    color = "blue",
    className,
    style,
    ...props
  },
  ref
) {
  return (
    <MantineLoader
      ref={ref}
      className={className}
      size={size}
      type={type}
      color={color === "primary" ? "violet" : color}
      styles={{
        root: {
          // Use our primary color for default styling
          ...(color === "primary" && {
            color: 'var(--color-primary)',
          }),
          ...style,
        }
      }}
      {...props}
    />
  );
});

export default Loader;
