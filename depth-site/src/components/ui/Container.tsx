import * as React from "react";
import { clsx } from "clsx";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  fluid?: boolean;
};

export function Container({ className, fluid, ...props }: ContainerProps) {
  return (
    <div
      className={clsx(
        "w-full min-w-0",
        fluid 
          ? "px-3 sm:px-4 md:px-6" 
          : "max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
}


