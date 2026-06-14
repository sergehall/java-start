import Link from "next/link";
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
  return (
    <details className="group relative ml-auto hidden max-lg:block">
      <summary
        aria-label="Open navigation"
        className="bg-dark-panel text-brand-soft inline-flex h-[42px] w-[46px] cursor-pointer list-none items-center justify-center rounded-full border border-[var(--dark-line)] group-open:border-[var(--brand-ring)] [&::-webkit-details-marker]:hidden"
      >
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="block size-[5px] rounded-full bg-current" />
          <span className="block size-[5px] rounded-full bg-current" />
          <span className="block size-[5px] rounded-full bg-current" />
        </span>
      </summary>

      <nav
        className="border-line bg-panel absolute top-[calc(100%+10px)] right-0 z-40 hidden min-w-[220px] gap-1.5 rounded-lg border p-2 shadow-[0_18px_50px_rgba(29,27,23,0.18)] group-open:grid"
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
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
