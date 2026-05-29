import Link from "next/link";
import { AuthForm } from "@/features/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">New workspace</p>
          <h1>Create account</h1>
          <p className="muted">Create your profile and enter the dashboard right away.</p>
        </div>
        <AuthForm mode="register" />
        <p className="muted">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
