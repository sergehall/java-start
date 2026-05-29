"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthForm } from "@/features/auth/AuthForm";
import { cn } from "@/shared/lib/cn";

const AUTH_PARAM = "auth";
const SIGN_IN_VALUE = "sign-in";

type AuthModalContextValue = {
  close: () => void;
  error: AuthModalError;
  isOpen: boolean;
  open: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

type AuthModalError = "github_oauth_failed" | null;

type AuthModalProviderProps = {
  children: ReactNode;
  initialError?: AuthModalError;
  initialOpen?: boolean;
};

export function AuthModalProvider({ children, initialError = null, initialOpen = false }: AuthModalProviderProps) {
  const [error, setError] = useState<AuthModalError>(initialError);
  const [isOpen, setIsOpen] = useState(initialOpen);

  const replaceAuthParam = useCallback((open: boolean) => {
    const url = new URL(window.location.href);
    if (open) {
      url.searchParams.set(AUTH_PARAM, SIGN_IN_VALUE);
    } else {
      url.searchParams.delete(AUTH_PARAM);
      url.searchParams.delete("error");
    }
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const open = useCallback(() => {
    setError(null);
    setIsOpen(true);
    replaceAuthParam(true);
  }, [replaceAuthParam]);

  const close = useCallback(() => {
    setError(null);
    setIsOpen(false);
    replaceAuthParam(false);
  }, [replaceAuthParam]);

  useEffect(() => {
    const handlePopState = () => {
      setIsOpen(new URL(window.location.href).searchParams.get(AUTH_PARAM) === SIGN_IN_VALUE);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const value = useMemo(() => ({ close, error, isOpen, open }), [close, error, isOpen, open]);

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

type OpenAuthModalButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function OpenAuthModalButton({ className, children = "Sign in" }: OpenAuthModalButtonProps) {
  const { open } = useAuthModal();

  return (
    <button aria-haspopup="dialog" className={className} onClick={open} type="button">
      {children}
    </button>
  );
}

export function AuthModalHost() {
  const { close, error, isOpen } = useAuthModal();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [close, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button
        aria-label="Close authentication dialog"
        className="absolute inset-0 cursor-pointer border-0 bg-[rgba(10,14,12,0.58)]"
        onClick={close}
        type="button"
      />
      <section className="border-line relative mx-auto mt-7 grid max-h-[calc(100dvh-56px)] w-[min(calc(100%_-_24px),520px)] gap-5 overflow-y-auto rounded-lg border bg-[rgba(255,250,241,0.98)] p-7 shadow-[0_34px_90px_rgba(29,27,23,0.28)] sm:mt-12 sm:p-8">
        <button
          aria-label="Close"
          className="border-line text-ink absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full border bg-[#fffdf8] transition hover:-translate-y-px hover:border-[var(--brand-ring)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
          onClick={close}
          type="button"
        >
          <X size={20} />
        </button>

        <div className="pointer-events-none absolute -top-24 -left-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(201,91,67,0.16),transparent_68%)]" />
        <div className="relative grid gap-5">
          <div className="pr-10">
            <p className="text-brand mb-3 text-xs font-extrabold uppercase">Member access</p>
            <h2 className="m-0 text-[clamp(1.9rem,5vw,2.45rem)] leading-[1.04] tracking-normal" id="auth-modal-title">
              Sign in to your account
            </h2>
            <p className="text-muted leading-relaxed">
              Return to your dashboard, learning state, and Spring Boot-backed session.
            </p>
          </div>

          {error === "github_oauth_failed" ? (
            <p className="m-0 rounded-lg border border-[#f0c2b8] bg-[#fff0ec] px-4 py-3 text-sm font-bold text-[#a63b2b]">
              GitHub sign in did not finish. Check the GitHub OAuth app settings and try again.
            </p>
          ) : null}

          <AuthForm mode="sign-in" />

          <p className="text-muted m-0 leading-relaxed">
            Need an account?{" "}
            <Link
              className={cn(
                "text-brand-strong rounded-md font-extrabold underline decoration-[var(--brand-ring)] decoration-2 underline-offset-4 transition",
                "hover:text-[var(--brand)] hover:decoration-[var(--brand)]",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
              )}
              href="/register"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("Auth modal components must be rendered inside AuthModalProvider.");
  }
  return context;
}
