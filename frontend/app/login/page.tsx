import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/AuthForm";
import { getCurrentUser } from "@/shared/api/server";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center p-8 max-lg:p-[18px]">
      <section className="border-line grid w-full max-w-[460px] gap-6 rounded-lg border bg-[rgba(255,250,241,0.92)] p-8 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-brand mb-3 text-xs font-extrabold uppercase">Member access</p>
          <h1 className="m-0 text-[clamp(1.9rem,5vw,2.45rem)] leading-[1.04] tracking-normal">
            Sign in to your account
          </h1>
          <p className="text-muted leading-relaxed">
            Use your account to return to the dashboard, learning state, and Spring Boot-backed session.
          </p>
        </div>
        {params?.error === "github_oauth_failed" ? (
          <p className="m-0 rounded-lg border border-[#f0c2b8] bg-[#fff0ec] px-4 py-3 text-sm font-bold text-[#a63b2b]">
            GitHub sign in did not finish. Check the GitHub OAuth app settings and try again.
          </p>
        ) : null}
        <AuthForm mode="login" />
        <p className="text-muted leading-relaxed">
          Need an account?{" "}
          <Link
            className="text-brand-strong rounded-md font-extrabold underline decoration-[var(--brand-ring)] decoration-2 underline-offset-4 transition hover:text-[var(--brand)] hover:decoration-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
            href="/register"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
