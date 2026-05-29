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
    <div className="mobile-nav-dots" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-label="Open navigation"
        className="mobile-nav-button"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="sr-only">Open navigation</span>
        <span className="mobile-nav-dot-grid" aria-hidden="true">
          <span className="mobile-nav-dot" />
          <span className="mobile-nav-dot" />
          <span className="mobile-nav-dot" />
        </span>
      </button>

      {open ? (
        <nav className="mobile-nav-menu" aria-label="Mobile navigation">
          {items.map((item) => (
            <Link
              className={cn("mobile-nav-menu-link", item.id === active && "mobile-nav-menu-link-active")}
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
