import { redirect } from "next/navigation";
import { getCurrentUser, getLearningStates, getProfile } from "@/shared/api/server";
import { cn } from "@/shared/lib/cn";
import { stateAccent } from "@/shared/lib/profile";
import { AppShell } from "@/shared/ui/AppShell";

export default async function StatesPage() {
  const [user, profile, options] = await Promise.all([getCurrentUser(), getProfile(), getLearningStates()]);

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <AppShell active="states" title="Learning states" eyebrow="java-start://states" user={user}>
      <section className="grid grid-cols-5 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {options.map((option) => (
          <article
            className={cn(
              "border-line grid min-h-[220px] gap-2.5 rounded-lg border bg-[rgba(255,250,241,0.92)] p-[18px] shadow-[var(--shadow-card)]",
              option.value === profile.learningState && "border-mint shadow-[inset_0_0_0_2px_rgba(20,125,100,0.16)]"
            )}
            key={option.value}
          >
            <span className="text-muted text-xs font-black uppercase">{stateAccent(option.value)}</span>
            <h2 className="m-0">{option.label}</h2>
            <p className="text-muted m-0 leading-normal">{option.description}</p>
            {option.value === profile.learningState ? (
              <strong className="text-mint-strong self-end">Current state</strong>
            ) : null}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
