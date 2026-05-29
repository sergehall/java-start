import { redirect } from "next/navigation";
import { getCurrentUser, getLearningStates, getProfile } from "@/shared/api/server";
import { stateAccent } from "@/shared/lib/profile";
import { AppShell } from "@/shared/ui/AppShell";

export default async function StatesPage() {
  const [user, profile, options] = await Promise.all([getCurrentUser(), getProfile(), getLearningStates()]);

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <AppShell active="states" title="Learning states" eyebrow="java-start://states" user={user}>
      <section className="state-catalog">
        {options.map((option) => (
          <article
            className={option.value === profile.learningState ? "state-card state-card-active" : "state-card"}
            key={option.value}
          >
            <span>{stateAccent(option.value)}</span>
            <h2>{option.label}</h2>
            <p>{option.description}</p>
            {option.value === profile.learningState ? <strong>Current state</strong> : null}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
