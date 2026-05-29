import { redirect } from "next/navigation";
import { ProfileEditor } from "@/features/profile/ProfileEditor";
import { getCurrentUser, getLearningStates, getProfile } from "@/shared/api/server";
import { AppShell } from "@/shared/ui/AppShell";

export default async function ProfilePage() {
  const [user, profile, options] = await Promise.all([getCurrentUser(), getProfile(), getLearningStates()]);

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <AppShell active="profile" title="Profile" eyebrow="java-start://profile" user={user}>
      <div className="content-grid">
        <section className="status-panel">
          <h2>Identity</h2>
          <p className="muted">This is the user visible to the frontend cabinet and verified by the backend token.</p>
          <div className="identity-grid">
            <span>Username</span>
            <strong>{user.username}</strong>
            <span>Email</span>
            <strong>{user.email}</strong>
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </section>
        <ProfileEditor initialProfile={profile} options={options} />
      </div>
    </AppShell>
  );
}
