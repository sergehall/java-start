import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/AuthForm";
import { getCurrentUser } from "@/shared/api/server";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center p-8 max-lg:p-[18px]">
      <section className="border-line grid w-full max-w-[460px] gap-6 rounded-lg border bg-[rgba(255,250,241,0.92)] p-8 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-brand mb-3 text-xs font-extrabold uppercase">New workspace</p>
          <h1 className="m-0 text-[2.6rem] leading-none tracking-normal">Create account</h1>
          <p className="text-muted leading-relaxed">Create your profile, verify email, then enter the dashboard.</p>
        </div>
        <AuthForm mode="register" />
        <p className="text-muted leading-relaxed">
          Already have an account?{" "}
          <Link
            className="text-brand-strong rounded-md font-extrabold underline decoration-[var(--brand-ring)] decoration-2 underline-offset-4 transition hover:text-[var(--brand)] hover:decoration-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
            href="/?auth=sign-in"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
