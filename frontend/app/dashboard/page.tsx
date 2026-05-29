import { redirect } from "next/navigation";
import { DashboardClient } from "@/features/dashboard/DashboardClient";
import { getCurrentUser, getLearningStates, getProfile } from "@/shared/api/server";
import { AppShell } from "@/shared/ui/AppShell";

export default async function DashboardPage() {
  const [user, profile, options] = await Promise.all([getCurrentUser(), getProfile(), getLearningStates()]);

  if (!user || !profile) {
    redirect("/?auth=sign-in&next=/dashboard");
  }

  return (
    <AppShell active="dashboard" title={`Hello, ${user.username}`} eyebrow="java-start://dashboard" user={user}>
      <DashboardClient user={user} initialProfile={profile} options={options} />
    </AppShell>
  );
}
