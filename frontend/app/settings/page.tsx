import { redirect } from "next/navigation";
import { CalendarDays, Cookie, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/shared/api/server";
import { AppShell } from "@/shared/ui/AppShell";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/?auth=sign-in&next=/settings");
  }

  return (
    <AppShell active="settings" title="Settings" eyebrow="java-start://settings" user={user}>
      <section className="grid grid-cols-3 gap-4 max-xl:grid-cols-1">
        <article className="border-line rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} />
            <span className="text-muted font-extrabold">Account</span>
          </div>
          <h2>{user.username}</h2>
          <p className="text-muted leading-relaxed">{user.email}</p>
        </article>
        <article className="border-line rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5">
            <Cookie size={20} />
            <span className="text-muted font-extrabold">Session</span>
          </div>
          <h2>httpOnly cookie</h2>
          <p className="text-muted leading-relaxed">
            The browser does not expose the session cookie to client-side JavaScript.
          </p>
        </article>
        <article className="border-line rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5">
            <CalendarDays size={20} />
            <span className="text-muted font-extrabold">Created</span>
          </div>
          <h2>{new Date(user.createdAt).toLocaleDateString()}</h2>
          <p className="text-muted leading-relaxed">This timestamp comes from the Spring Boot API.</p>
        </article>
      </section>
    </AppShell>
  );
}
