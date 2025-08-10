"use client";

import { clsx } from "clsx";
import * as React from "react";
import { buttonStyles } from "./buttonStyles"; // server-safe styles

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

export function Button({ className, variant, size, ...props }: ButtonProps) {
  const classes = buttonStyles({ variant, size });
  return (
    <button
      className={clsx(classes, className)}
      {...props}
      data-tv={classes}
      suppressHydrationWarning
    />
  );
}


