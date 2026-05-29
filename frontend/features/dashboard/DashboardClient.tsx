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
    <section className="dashboard-grid">
      <div className="status-panel account-summary-panel">
        <div className="section-heading">
          <ShieldCheck size={21} />
          <h2>Signed-in workspace</h2>
        </div>
        <p className="muted">
          This cabinet belongs to {user.email}. The frontend session is stored in an httpOnly cookie, while Spring Boot
          verifies the JWT.
        </p>
        <div className="identity-grid">
          <span>Username</span>
          <strong>{user.username}</strong>
          <span>Role</span>
          <strong>{user.role}</strong>
        </div>
      </div>

      <div className="status-panel">
        <div className="meter-header">
          <span>{completionTone(profile.completion)}</span>
          <strong>{profile.completion}%</strong>
        </div>
        <div className="meter" aria-label="Profile completion">
          <span style={{ width: `${profile.completion}%` }} />
        </div>
        <p className="muted">Profile completion grows when the goal, next step, and state are clearly described.</p>
      </div>

      <div className="status-panel accent-panel">
        <div className="icon-line">
          <Zap size={20} />
          <span>{stateAccent(profile.learningState)}</span>
        </div>
        <h2>{activeOption?.label ?? profile.learningState}</h2>
        <p>{activeOption?.description}</p>
      </div>

      <section className="work-panel dashboard-main-panel">
        <div className="section-heading">
          <Flame size={22} />
          <h2>Today focus</h2>
        </div>
        <div className="focus-card">
          <span>Goal</span>
          <strong>{profile.learningGoal}</strong>
        </div>
        <div className="focus-card">
          <span>Next step</span>
          <strong>{profile.nextStep}</strong>
        </div>
        <div className="stack-flow">
          <div>
            <span>Browser</span>
            <strong>Next.js</strong>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
          <div>
            <span>API</span>
            <strong>Spring Boot</strong>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
          <div>
            <span>State</span>
            <strong>PostgreSQL</strong>
          </div>
        </div>
        <Link className="button button-primary panel-link" href="/profile">
          Edit profile
          <ArrowRight size={18} />
        </Link>
      </section>

      <div className="status-panel">
        <div className="icon-line">
          <Database size={20} />
          <span>Persistence</span>
        </div>
        <h2>Profile snapshot</h2>
        <p className="muted">Last updated: {new Date(profile.updatedAt).toLocaleString()}</p>
        <p className="muted">Energy level: {profile.energyLevel}%</p>
      </div>
    </section>
  );
}
