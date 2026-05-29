import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/AuthForm";
import { getCurrentUser } from "@/shared/api/server";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center p-8 max-lg:p-[18px]">
      <section className="border-line grid w-full max-w-[460px] gap-6 rounded-lg border bg-[rgba(255,250,241,0.92)] p-8 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-brand mb-3 text-xs font-extrabold uppercase">Welcome back</p>
          <h1 className="m-0 text-[2.6rem] leading-none tracking-normal">Sign in</h1>
          <p className="text-muted leading-relaxed">Keep building your Java + Next.js dashboard.</p>
        </div>
        <AuthForm mode="login" />
        <p className="text-muted leading-relaxed">
          No account yet? <Link href="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
