"use client";

import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { resendVerification, verifyEmail } from "@/shared/api/client";
import { Button } from "@/shared/ui/Button";

type VerifyState = "idle" | "verifying" | "verified" | "failed";

type ResendForm = {
  email: string;
};

export function VerifyEmailPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";
  const sent = searchParams.get("sent") === "1";
  const didVerify = useRef(false);
  const [state, setState] = useState<VerifyState>(token ? "verifying" : "idle");
  const [message, setMessage] = useState(
    sent ? "Verification email sent. Open the link in your inbox to activate the cabinet." : null
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ResendForm>({
    defaultValues: {
      email
    }
  });

  useEffect(() => {
    if (!token || didVerify.current) {
      return;
    }
    didVerify.current = true;
    const verificationToken = token;

    async function runVerification() {
      setState("verifying");
      const result = await verifyEmail({ token: verificationToken });
      if (!result.ok) {
        setState("failed");
        setMessage(result.message);
        return;
      }

      setState("verified");
      setMessage("Email verified. Opening your dashboard...");
      router.refresh();
      window.setTimeout(() => router.replace("/dashboard"), 700);
    }

    void runVerification();
  }, [router, token]);

  async function onResend(values: ResendForm) {
    setMessage(null);
    const result = await resendVerification(values);
    setMessage(result.ok ? result.data.message : result.message);
  }

  return (
    <div className="form-stack">
      <div className="status-panel">
        <div className="icon-line">
          {state === "verifying" ? <Loader2 className="spin" size={20} /> : <MailCheck size={20} />}
          <span>{state === "verified" ? "Verified" : "Email verification"}</span>
        </div>
        <p className="muted">
          {token
            ? "We are checking the verification link from your email."
            : "Create an account first, then use the verification link from your inbox."}
        </p>
        {message ? <p className={state === "failed" ? "form-error" : "form-success"}>{message}</p> : null}
      </div>

      {state !== "verified" ? (
        <form className="form-stack" onSubmit={handleSubmit(onResend)}>
          <label className="field">
            <span>Email</span>
            <input autoComplete="email" inputMode="email" {...register("email", { required: true })} />
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spin" size={18} /> : <ArrowRight size={18} />}
            Send a fresh link
          </Button>
        </form>
      ) : null}
    </div>
  );
}
