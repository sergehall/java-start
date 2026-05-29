import { redirect } from "next/navigation";
import { DashboardClient } from "@/features/dashboard/DashboardClient";
import { getCurrentUser, getLearningStates, getProfile } from "@/shared/api/server";

export default async function DashboardPage() {
  const [user, profile, options] = await Promise.all([getCurrentUser(), getProfile(), getLearningStates()]);

  if (!user || !profile) {
    redirect("/login");
  }

  return <DashboardClient user={user} initialProfile={profile} options={options} />;
}
