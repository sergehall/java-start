import Link from "next/link";
import { getCurrentUser } from "@/shared/api/server";
import type { UserSummary } from "@/shared/api/contracts";
import { cn } from "@/shared/lib/cn";
import { AccountDock } from "@/shared/ui/AccountDock";
import { MobileNavDots } from "@/shared/ui/MobileNavDots";

type NavItem = {
  id: string;
  href: string;
  label: string;
};

const publicNavigation: NavItem[] = [
  { id: "home", href: "/", label: "Home" },
  { id: "stack", href: "/stack", label: "Stack lab" },
  { id: "contact", href: "/contact", label: "Contact" }
];

const privateNavigation: NavItem[] = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard" },
  { id: "profile", href: "/profile", label: "Profile" },
  { id: "states", href: "/states", label: "Learning states" },
  { id: "stack", href: "/stack", label: "Stack lab" },
  { id: "contact", href: "/contact", label: "Contact" },
  { id: "settings", href: "/settings", label: "Settings" }
];

type AppShellProps = Readonly<{
  active: string;
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  user?: UserSummary | null;
}>;

export async function AppShell({ active, children, eyebrow = "java-start://learn", title, user }: AppShellProps) {
  const currentUser = user === undefined ? await getCurrentUser() : user;
  const navigation = currentUser ? privateNavigation : publicNavigation;

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-[var(--paper)] text-[var(--ink)] lg:grid-cols-[244px_minmax(0,1fr)]">
      <aside
        className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--dark-line)] bg-[var(--dark)] px-4 py-3 text-[var(--dark-text)] lg:min-h-dvh lg:flex-col lg:items-stretch lg:justify-start lg:border-r lg:border-b-0 lg:p-[22px]"
        aria-label="Primary navigation"
      >
        <Link className="flex items-center gap-3" href={currentUser ? "/dashboard" : "/"}>
          <span
            className="grid size-[42px] flex-none place-items-center rounded-lg border border-[rgba(199,221,204,0.28)] bg-[var(--dark-panel)] font-mono font-black text-[var(--brand-soft)]"
            aria-hidden="true"
          >
            JS
          </span>
          <span>
            <strong className="block">Java Start</strong>
            <small className="mt-1 hidden text-xs text-[var(--dark-muted)] sm:block">Next.js + Spring Boot</small>
          </span>
        </Link>

        <nav className="hidden gap-2 lg:grid" aria-label="Sections">
          {navigation.map((item) => (
            <Link
              className={cn(
                "min-h-10 rounded-lg border border-transparent px-3 py-2.5 text-[var(--dark-muted)] transition-colors hover:border-[var(--brand-ring)] hover:bg-[var(--dark-panel)] hover:text-[var(--brand-soft)]",
                item.id === active && "border-[var(--brand-ring)] bg-[var(--dark-panel)] text-[var(--brand-soft)]"
              )}
              href={item.href}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileNavDots active={active} items={navigation} />
      </aside>

      <main className="min-w-0 px-5 py-5 pb-10 sm:px-6 lg:px-[clamp(20px,4vw,42px)]">
        <header className="mb-7 grid gap-5 sm:flex sm:items-start sm:justify-between">
          <div>
            <p className="m-0 font-mono text-xs font-black text-[var(--brand)]">{eyebrow}</p>
            {title ? (
              <h1 className="mt-2 text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] tracking-normal">{title}</h1>
            ) : null}
          </div>
          {currentUser ? <AccountDock user={currentUser} /> : <AuthDock />}
        </header>

        {children}
      </main>
    </div>
  );
}

function AuthDock() {
  return (
    <div className="flex w-full max-w-[210px] items-center justify-stretch gap-2 sm:w-auto sm:justify-end">
      <Link
        className="border-line text-ink inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border bg-[#fffdf8] px-4 text-sm font-extrabold transition-transform hover:-translate-y-px sm:flex-none"
        href="/login"
      >
        Sign in
      </Link>
    </div>
  );
}
