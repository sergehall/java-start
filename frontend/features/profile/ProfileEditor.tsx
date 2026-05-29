"use client";

import { Save, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { updateProfile } from "@/shared/api/client";
import type { LearningState, LearningStateOption, Profile } from "@/shared/api/contracts";
import { stateAccent } from "@/shared/lib/profile";
import { Button } from "@/shared/ui/Button";

type ProfileEditorProps = Readonly<{
  initialProfile: Profile;
  options: LearningStateOption[];
}>;

export function ProfileEditor({ initialProfile, options }: ProfileEditorProps) {
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

  return (
    <section className="work-panel profile-editor">
      <div className="section-heading">
        <Target size={22} />
        <h2>Profile controls</h2>
      </div>

      <div className="status-strip">
        <span>{stateAccent(profile.learningState)}</span>
        <strong>{activeOption?.label ?? profile.learningState}</strong>
        <small>{profile.completion}% complete</small>
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
          {status === "saving" ? "Saving" : "Save profile"}
        </Button>
        <span className={`save-state save-state-${status}`}>
          {status === "saved" ? "Saved" : status === "error" ? "Could not save" : ""}
        </span>
      </div>
    </section>
  );
}
