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
      <div className="grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-[18px] max-lg:grid-cols-1">
        <section className="border-line rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
          <h2>Identity</h2>
          <p className="text-muted leading-relaxed">
            This is the user visible to the frontend cabinet and verified by the backend token.
          </p>
          <div className="mt-[18px] grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3.5 gap-y-2">
            <span className="text-muted text-xs font-black uppercase">Username</span>
            <strong className="min-w-0 break-words">{user.username}</strong>
            <span className="text-muted text-xs font-black uppercase">Email</span>
            <strong className="min-w-0 break-words">{user.email}</strong>
            <span className="text-muted text-xs font-black uppercase">Role</span>
            <strong className="min-w-0 break-words">{user.role}</strong>
          </div>
        </section>
        <ProfileEditor initialProfile={profile} options={options} />
      </div>
    </AppShell>
  );
}
