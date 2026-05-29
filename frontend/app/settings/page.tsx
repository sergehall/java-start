import { redirect } from "next/navigation";
import { CalendarDays, Cookie, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/shared/api/server";
import { AppShell } from "@/shared/ui/AppShell";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell active="settings" title="Settings" eyebrow="java-start://settings" user={user}>
      <section className="settings-grid">
        <article className="status-panel">
          <div className="icon-line">
            <ShieldCheck size={20} />
            <span>Account</span>
          </div>
          <h2>{user.username}</h2>
          <p className="muted">{user.email}</p>
        </article>
        <article className="status-panel">
          <div className="icon-line">
            <Cookie size={20} />
            <span>Session</span>
          </div>
          <h2>httpOnly cookie</h2>
          <p className="muted">The browser does not expose the session cookie to client-side JavaScript.</p>
        </article>
        <article className="status-panel">
          <div className="icon-line">
            <CalendarDays size={20} />
            <span>Created</span>
          </div>
          <h2>{new Date(user.createdAt).toLocaleDateString()}</h2>
          <p className="muted">This timestamp comes from the Spring Boot API.</p>
        </article>
      </section>
    </AppShell>
  );
}
