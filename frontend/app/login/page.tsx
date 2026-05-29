import Link from "next/link";
import { AuthForm } from "@/features/auth/AuthForm";

export default function LoginPage() {
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
