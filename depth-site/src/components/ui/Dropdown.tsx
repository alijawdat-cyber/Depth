"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownOption<T extends string | number = string> = {
  value: T;
  label: string;
};

export type DropdownProps<T extends string | number = string> = {
  value: T | "";
  onChange: (v: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
};

export default function Dropdown<T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = "اختر",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  disabled,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / ESC
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current || !btnRef.current) return;
      if (
        !menuRef.current.contains(e.target as Node) &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--elev)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] disabled:opacity-50 ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate text-sm">
          {selected ? selected.label : (
            <span className="text-[var(--muted)]">{placeholder}</span>
          )}
        </span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          className={`absolute z-50 mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] shadow-lg ring-1 ring-[var(--elev)] p-1 ${menuClassName}`}
        >
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-right px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors ${
                opt.value === value
                  ? "bg-[var(--elev)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:bg-[var(--elev)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


