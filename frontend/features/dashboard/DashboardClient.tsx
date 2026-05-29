"use client";

import { LogOut, Save, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { logout, updateProfile } from "@/shared/api/client";
import type { LearningState, LearningStateOption, Profile, UserSummary } from "@/shared/api/contracts";
import { completionTone, stateAccent } from "@/shared/lib/profile";
import { Button } from "@/shared/ui/Button";

type DashboardClientProps = {
  user: UserSummary;
  initialProfile: Profile;
  options: LearningStateOption[];
};

export function DashboardClient({ user, initialProfile, options }: DashboardClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const activeOption = useMemo(
    () => options.find((option) => option.value === profile.learningState),
    [options, profile.learningState]
  );

  async function saveProfile() {
    setStatus("saving");
    const result = await updateProfile({
      learningState: profile.learningState,
      energyLevel: profile.energyLevel,
      learningGoal: profile.learningGoal,
      nextStep: profile.nextStep
    });
    if (!result.ok) {
      setStatus("error");
      return;
    }
    setProfile(result.data);
    setStatus("saved");
  }

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Personal cabinet</p>
          <h1>Hello, {user.displayName}</h1>
        </div>
        <Button variant="ghost" onClick={handleLogout} aria-label="Log out">
          <LogOut size={18} />
          Log out
        </Button>
      </header>

      <section className="dashboard-grid">
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

        <section className="work-panel">
          <div className="section-heading">
            <Target size={22} />
            <h2>Learning state</h2>
          </div>

          <div className="state-grid">
            {options.map((option) => (
              <button
                className={option.value === profile.learningState ? "state-choice active" : "state-choice"}
                key={option.value}
                onClick={() => setProfile((current) => ({ ...current, learningState: option.value as LearningState }))}
                type="button"
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>

          <label className="field">
            <span>Energy</span>
            <input
              max={100}
              min={0}
              onChange={(event) => setProfile((current) => ({ ...current, energyLevel: Number(event.target.value) }))}
              type="range"
              value={profile.energyLevel}
            />
            <b>{profile.energyLevel}%</b>
          </label>

          <label className="field">
            <span>Learning goal</span>
            <input
              maxLength={160}
              onChange={(event) => setProfile((current) => ({ ...current, learningGoal: event.target.value }))}
              value={profile.learningGoal}
            />
          </label>

          <label className="field">
            <span>Next step</span>
            <textarea
              maxLength={240}
              onChange={(event) => setProfile((current) => ({ ...current, nextStep: event.target.value }))}
              value={profile.nextStep}
            />
          </label>

          <div className="save-row">
            <Button onClick={saveProfile} disabled={status === "saving"}>
              <Save size={18} />
              {status === "saving" ? "Saving" : "Save"}
            </Button>
            <span className={`save-state save-state-${status}`}>
              {status === "saved" ? "Saved" : status === "error" ? "Could not save" : ""}
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}
