"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/shared/api/client";
import type { UserSummary } from "@/shared/api/contracts";

type AccountDockProps = Readonly<{
  user: UserSummary;
}>;

function accountInitial(username: string) {
  return username.trim().slice(0, 1).toUpperCase() || "U";
}

export function AccountDock({ user }: AccountDockProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex w-full flex-none items-center gap-2 sm:w-auto">
      <div
        className="flex min-h-12 min-w-0 flex-1 items-center gap-2.5 rounded-full border border-[rgba(112,72,50,0.18)] bg-[rgba(255,250,241,0.88)] py-[5px] pr-3 pl-[5px] shadow-[0_10px_30px_rgba(29,27,23,0.08)] sm:w-[286px] sm:flex-none"
        aria-label="Signed in user"
      >
        <span
          className="grid size-[38px] flex-none place-items-center rounded-full bg-[var(--ink)] font-black text-[var(--panel)]"
          aria-hidden="true"
        >
          {accountInitial(user.username)}
        </span>
        <span className="grid min-w-0 flex-1 gap-px">
          <strong className="truncate text-xs">{user.username}</strong>
          <small className="truncate text-[11px] text-[var(--muted)]">{user.email}</small>
        </span>
        <span className="hidden flex-none rounded-full bg-[rgba(20,125,100,0.12)] px-2 py-1 text-[10px] font-black text-[var(--mint-strong)] sm:inline">
          {user.role}
        </span>
      </div>
      <button
        className="grid size-11 flex-none cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-[#fffdf8] text-[var(--ink)] transition-colors hover:border-[var(--brand-ring)] hover:text-[var(--brand)]"
        onClick={handleLogout}
        type="button"
        aria-label="Log out"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}
