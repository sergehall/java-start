import Link from "next/link";
import { Suspense } from "react";
import { VerifyEmailPanel } from "@/features/auth/VerifyEmailPanel";

export default function VerifyEmailPage() {
  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Account activation</p>
          <h1>Verify email</h1>
          <p className="muted">Use the email link to activate your Java Start cabinet.</p>
        </div>
        <Suspense fallback={<p className="muted">Loading verification state...</p>}>
          <VerifyEmailPanel />
        </Suspense>
        <p className="muted">
          Already verified? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
