import * as React from "react";
import { clsx } from "clsx";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  fluid?: boolean;
};

export function Container({ className, fluid, ...props }: ContainerProps) {
  return (
    <div
      className={clsx(
        fluid ? "px-4 sm:px-6" : "max-w-[1200px] mx-auto px-4 sm:px-6",
        className
      )}
      {...props}
    />
  );
}


