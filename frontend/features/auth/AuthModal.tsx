"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AuthForm } from "@/features/auth/AuthForm";
import { cn } from "@/shared/lib/cn";

const AUTH_PARAM = "auth";
const SIGN_IN_VALUE = "sign-in";
const AUTH_OPEN_EVENT = "java-start:auth-open";

type OpenAuthModalButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function OpenAuthModalButton({ className, children = "Sign in" }: OpenAuthModalButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function openModal() {
    const params = new URLSearchParams(searchParams.toString());
    params.set(AUTH_PARAM, SIGN_IN_VALUE);
    window.dispatchEvent(new Event(AUTH_OPEN_EVENT));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <button aria-haspopup="dialog" className={className} onClick={openModal} type="button">
      {children}
    </button>
  );
}

export function AuthModalHost() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLocallyOpen, setIsLocallyOpen] = useState(false);
  const isOpen = searchParams.get(AUTH_PARAM) === SIGN_IN_VALUE || isLocallyOpen;

  const closeModal = useCallback(() => {
    setIsLocallyOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete(AUTH_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const openModal = () => setIsLocallyOpen(true);
    window.addEventListener(AUTH_OPEN_EVENT, openModal);

    return () => {
      window.removeEventListener(AUTH_OPEN_EVENT, openModal);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeModal, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button
        aria-label="Close authentication dialog"
        className="absolute inset-0 cursor-pointer border-0 bg-[rgba(10,14,12,0.58)]"
        onClick={closeModal}
        type="button"
      />
      <section className="border-line relative mx-auto mt-7 grid max-h-[calc(100dvh-56px)] w-[min(calc(100%_-_24px),520px)] gap-5 overflow-y-auto rounded-lg border bg-[rgba(255,250,241,0.98)] p-7 shadow-[0_34px_90px_rgba(29,27,23,0.28)] sm:mt-12 sm:p-8">
        <button
          aria-label="Close"
          className="border-line text-ink absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full border bg-[#fffdf8] transition hover:-translate-y-px hover:border-[var(--brand-ring)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
          onClick={closeModal}
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

          <AuthForm mode="login" />

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
