"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

export type AccordionItem = { id: string; question: string; answer: string };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="divide-y divide-[var(--elev)] border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--card)]">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <button
              className="w-full text-start px-5 py-4 font-medium"
              onClick={() => setOpen(isOpen ? null : it.id)}
              aria-expanded={isOpen}
            >
              {it.question}
            </button>
            <div className={clsx("px-5 overflow-hidden transition-all", isOpen ? "max-h-96 pb-4" : "max-h-0")}
                 aria-hidden={!isOpen}
            >
              <p className="text-sm text-[var(--slate-600)]">{it.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


