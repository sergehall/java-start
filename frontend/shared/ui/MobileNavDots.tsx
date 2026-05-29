"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

type MobileNavItem = Readonly<{
  id: string;
  href: string;
  label: string;
}>;

type MobileNavDotsProps = Readonly<{
  active: string;
  items: readonly MobileNavItem[];
}>;

export function MobileNavDots({ active, items }: MobileNavDotsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative ml-auto hidden max-lg:block" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-label="Open navigation"
        className="bg-dark-panel text-brand-soft inline-flex h-[42px] w-[46px] cursor-pointer items-center justify-center rounded-full border border-[var(--dark-line)] aria-expanded:border-[var(--brand-ring)]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="block size-[5px] rounded-full bg-current" />
          <span className="block size-[5px] rounded-full bg-current" />
          <span className="block size-[5px] rounded-full bg-current" />
        </span>
      </button>

      {open ? (
        <nav
          className="border-line bg-panel absolute top-[calc(100%+10px)] right-0 z-40 grid min-w-[220px] gap-1.5 rounded-lg border p-2 shadow-[0_18px_50px_rgba(29,27,23,0.18)]"
          aria-label="Mobile navigation"
        >
          {items.map((item) => (
            <Link
              className={cn(
                "text-ink hover:text-brand-strong min-h-10 rounded-lg border border-transparent px-3 py-2.5 hover:border-[var(--brand-ring)] hover:bg-[var(--brand-wash)]",
                item.id === active && "text-brand-strong border-[var(--brand-ring)] bg-[var(--brand-wash)]"
              )}
              href={item.href}
              key={item.id}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
