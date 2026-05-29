"use client";

import { Save, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { updateProfile } from "@/shared/api/client";
import type { LearningState, LearningStateOption, Profile } from "@/shared/api/contracts";
import { stateAccent } from "@/shared/lib/profile";
import { cn } from "@/shared/lib/cn";
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
    <section className="border-line grid gap-[22px] rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-start gap-2.5">
        <Target size={22} />
        <h2 className="m-0">Profile controls</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-[rgba(20,125,100,0.22)] bg-[#eef8f3] p-3.5">
        <span className="text-muted text-xs font-black uppercase">{stateAccent(profile.learningState)}</span>
        <strong>{activeOption?.label ?? profile.learningState}</strong>
        <small className="text-muted font-extrabold">{profile.completion}% complete</small>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-lg:grid-cols-1">
        {options.map((option) => (
          <button
            className={cn(
              "border-line grid min-h-[104px] cursor-pointer gap-1.5 rounded-lg border bg-[#fffdf8] p-3.5 text-left",
              option.value === profile.learningState && "border-mint shadow-[inset_0_0_0_2px_rgba(20,125,100,0.2)]"
            )}
            key={option.value}
            onClick={() => setProfile((current) => ({ ...current, learningState: option.value as LearningState }))}
            type="button"
          >
            <strong>{option.label}</strong>
            <span className="text-muted leading-snug">{option.description}</span>
          </button>
        ))}
      </div>

      <label className="grid gap-2">
        <span className="text-muted text-sm font-extrabold">Energy</span>
        <input
          className="border-line text-ink min-h-[46px] w-full rounded-lg border bg-[#fffdf8] px-3 py-2.5"
          max={100}
          min={0}
          onChange={(event) => setProfile((current) => ({ ...current, energyLevel: Number(event.target.value) }))}
          type="range"
          value={profile.energyLevel}
        />
        <b>{profile.energyLevel}%</b>
      </label>

      <label className="grid gap-2">
        <span className="text-muted text-sm font-extrabold">Learning goal</span>
        <input
          className="border-line text-ink min-h-[46px] w-full rounded-lg border bg-[#fffdf8] px-3 py-2.5"
          maxLength={160}
          onChange={(event) => setProfile((current) => ({ ...current, learningGoal: event.target.value }))}
          value={profile.learningGoal}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-muted text-sm font-extrabold">Next step</span>
        <textarea
          className="border-line text-ink min-h-24 w-full resize-y rounded-lg border bg-[#fffdf8] px-3 py-2.5"
          maxLength={240}
          onChange={(event) => setProfile((current) => ({ ...current, nextStep: event.target.value }))}
          value={profile.nextStep}
        />
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button onClick={saveProfile} disabled={status === "saving"}>
          <Save size={18} />
          {status === "saving" ? "Saving" : "Save profile"}
        </Button>
        <span className={cn("text-muted font-extrabold", status === "error" && "text-[#a63b2b]")}>
          {status === "saved" ? "Saved" : status === "error" ? "Could not save" : ""}
        </span>
      </div>
    </section>
  );
}
