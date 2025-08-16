import * as React from "react";
import { clsx } from "clsx";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
  // description: alias for subtitle (backward compatibility with existing usages)
  description?: string;
  align?: "start" | "center" | "end";
  // optional actions node (e.g., header buttons on the right)
  actions?: React.ReactNode;
};

export default function SectionHeading({ title, subtitle, description, align = "start", actions, className, ...rest }: Props) {
  const alignCls = align === "center" ? "text-center" : align === "end" ? "text-end" : "text-start";
  const sub = subtitle ?? description;
  
  if (actions) {
    return (
      <div className={clsx("", className)} {...rest}>
        <div className={clsx("flex items-start justify-between gap-4", alignCls)}>
          <div className="grid gap-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
            {sub ? (
              <p className="text-[var(--slate-600)] max-w-prose md:mx-auto">{sub}</p>
            ) : null}
          </div>
          <div className="shrink-0">
            {actions}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={clsx("grid gap-2", alignCls, className)} {...rest}>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {sub ? (
        <p className="text-[var(--slate-600)] max-w-prose md:mx-auto">{sub}</p>
      ) : null}
    </div>
  );
}


