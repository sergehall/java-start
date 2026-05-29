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
    <main className="auth-screen">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in</h1>
          <p className="muted">Keep building your Java + Next.js dashboard.</p>
        </div>
        <AuthForm mode="login" />
        <p className="muted">
          No account yet? <Link href="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
