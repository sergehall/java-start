"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login, register } from "@/shared/api/client";
import { loginSchema, registerSchema, type LoginPayload, type RegisterPayload } from "@/shared/api/contracts";
import { Button } from "@/shared/ui/Button";

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthFormValues = LoginPayload & Partial<Pick<RegisterPayload, "username">>;

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const schema = mode === "login" ? loginSchema : registerSchema;
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      username: ""
    }
  });

  async function onSubmit(values: AuthFormValues) {
    setError(null);

    if (mode === "register") {
      const result = await register({
        email: values.email,
        password: values.password,
        username: values.username ?? ""
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push(`/verify-email?${new URLSearchParams({ email: result.data.email, sent: "1" }).toString()}`);
      return;
    }

    const result = await login({ email: values.email, password: values.password });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      {mode === "register" ? (
        <label className="grid gap-2">
          <span className="text-muted text-sm font-extrabold">Username</span>
          <input
            className="border-line text-ink min-h-[46px] w-full rounded-lg border bg-[#fffdf8] px-3 py-2.5"
            autoComplete="username"
            {...registerField("username")}
          />
          {errors.username ? <small className="m-0 text-[#a63b2b]">{errors.username.message}</small> : null}
        </label>
      ) : null}

      <label className="grid gap-2">
        <span className="text-muted text-sm font-extrabold">Email</span>
        <input
          className="border-line text-ink min-h-[46px] w-full rounded-lg border bg-[#fffdf8] px-3 py-2.5"
          autoComplete="email"
          inputMode="email"
          {...registerField("email")}
        />
        {errors.email ? <small className="m-0 text-[#a63b2b]">{errors.email.message}</small> : null}
      </label>

      <label className="grid gap-2">
        <span className="text-muted text-sm font-extrabold">Password</span>
        <input
          className="border-line text-ink min-h-[46px] w-full rounded-lg border bg-[#fffdf8] px-3 py-2.5"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          type="password"
          {...registerField("password")}
        />
        {errors.password ? <small className="m-0 text-[#a63b2b]">{errors.password.message}</small> : null}
      </label>

      {error ? <p className="m-0 text-[#a63b2b]">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
        {mode === "login" ? "Sign in" : "Send verification email"}
      </Button>
    </form>
  );
}
