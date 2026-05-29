"use client";

import Link from "next/link";
import { ArrowRight, Database, Flame, ShieldCheck, Zap } from "lucide-react";
import type { LearningStateOption, Profile, UserSummary } from "@/shared/api/contracts";
import { completionTone, stateAccent } from "@/shared/lib/profile";

type DashboardClientProps = {
  user: UserSummary;
  initialProfile: Profile;
  options: LearningStateOption[];
};

export function DashboardClient({ user, initialProfile, options }: DashboardClientProps) {
  const profile = initialProfile;
  const activeOption = options.find((option) => option.value === profile.learningState);

  return (
    <section className="grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-[18px] max-lg:grid-cols-1">
      <div className="border-line rounded-lg border bg-[linear-gradient(135deg,rgba(20,125,100,0.12),transparent_58%),rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-start gap-2.5">
          <ShieldCheck size={21} />
          <h2 className="m-0">Signed-in workspace</h2>
        </div>
        <p className="text-muted leading-relaxed">
          This cabinet belongs to {user.email}. The frontend session is stored in an httpOnly cookie, while Spring Boot
          verifies the JWT.
        </p>
        <div className="mt-[18px] grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3.5 gap-y-2">
          <span className="text-muted text-xs font-black uppercase">Username</span>
          <strong className="min-w-0 break-words">{user.username}</strong>
          <span className="text-muted text-xs font-black uppercase">Role</span>
          <strong className="min-w-0 break-words">{user.role}</strong>
        </div>
      </div>

      <div className="border-line rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <span className="text-muted font-extrabold">{completionTone(profile.completion)}</span>
          <strong>{profile.completion}%</strong>
        </div>
        <div className="mt-[18px] h-3 overflow-hidden rounded-full bg-[#e7ddd0]" aria-label="Profile completion">
          <span className="bg-mint block h-full" style={{ width: `${profile.completion}%` }} />
        </div>
        <p className="text-muted leading-relaxed">
          Profile completion grows when the goal, next step, and state are clearly described.
        </p>
      </div>

      <div className="rounded-lg border border-[rgba(20,125,100,0.22)] bg-[#eef8f3] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2.5">
          <Zap size={20} />
          <span className="text-muted font-extrabold">{stateAccent(profile.learningState)}</span>
        </div>
        <h2>{activeOption?.label ?? profile.learningState}</h2>
        <p>{activeOption?.description}</p>
      </div>

      <section className="border-line col-start-2 row-span-3 grid content-start gap-[22px] rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)] max-lg:col-auto max-lg:row-auto">
        <div className="flex items-center justify-start gap-2.5">
          <Flame size={22} />
          <h2 className="m-0">Today focus</h2>
        </div>
        <div className="border-line grid gap-2 rounded-lg border bg-[#fffdf8] p-4">
          <span className="text-muted text-xs font-black uppercase">Goal</span>
          <strong className="text-[clamp(1.1rem,2vw,1.45rem)] leading-tight">{profile.learningGoal}</strong>
        </div>
        <div className="border-line grid gap-2 rounded-lg border bg-[#fffdf8] p-4">
          <span className="text-muted text-xs font-black uppercase">Next step</span>
          <strong className="text-[clamp(1.1rem,2vw,1.45rem)] leading-tight">{profile.nextStep}</strong>
        </div>
        <div className="border-line grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 rounded-lg border bg-[#efe7db] bg-[linear-gradient(90deg,rgba(29,27,23,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(29,27,23,0.04)_1px,transparent_1px)] bg-[length:24px_24px] p-4 max-lg:grid-cols-1 max-lg:items-stretch">
          <div className="grid gap-1">
            <span className="text-muted text-xs font-black uppercase">Browser</span>
            <strong>Next.js</strong>
          </div>
          <ArrowRight className="max-lg:hidden" size={18} aria-hidden="true" />
          <div className="grid gap-1">
            <span className="text-muted text-xs font-black uppercase">API</span>
            <strong>Spring Boot</strong>
          </div>
          <ArrowRight className="max-lg:hidden" size={18} aria-hidden="true" />
          <div className="grid gap-1">
            <span className="text-muted text-xs font-black uppercase">State</span>
            <strong>PostgreSQL</strong>
          </div>
        </div>
        <Link
          className="bg-ink text-panel inline-flex min-h-[46px] justify-self-start rounded-lg border border-transparent px-[18px] font-extrabold transition duration-150 hover:-translate-y-px"
          href="/profile"
        >
          Edit profile
          <ArrowRight size={18} />
        </Link>
      </section>

      <div className="border-line rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2.5">
          <Database size={20} />
          <span className="text-muted font-extrabold">Persistence</span>
        </div>
        <h2>Profile snapshot</h2>
        <p className="text-muted leading-relaxed">Last updated: {new Date(profile.updatedAt).toLocaleString()}</p>
        <p className="text-muted leading-relaxed">Energy level: {profile.energyLevel}%</p>
      </div>
    </section>
  );
}
