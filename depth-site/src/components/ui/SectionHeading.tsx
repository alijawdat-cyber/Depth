import * as React from "react";
import { clsx } from "clsx";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
  align?: "start" | "center" | "end";
};

export default function SectionHeading({ title, subtitle, align = "start", className, ...rest }: Props) {
  const alignCls = align === "center" ? "text-center" : align === "end" ? "text-end" : "text-start";
  return (
    <div className={clsx("grid gap-2", alignCls, className)} {...rest}>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="text-[var(--slate-600)] max-w-prose md:mx-auto">{subtitle}</p>
      ) : null}
    </div>
  );
}


