import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, GitBranch, ShieldCheck } from "lucide-react";
import { OpenAuthModalButton } from "@/features/auth/AuthModal";
import { homeLearningHighlights } from "@/features/home/content";
import { HomeJavaLab } from "@/features/home/HomeJavaLab";
import { AppShell } from "@/shared/ui/AppShell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  },
  description: "Learn how a Next.js frontend and Java Spring Boot backend work together in a practical fullstack app.",
  title: "Fullstack Java and Next.js Learning"
};

type HomePageProps = {
  searchParams?: Promise<{
    auth?: string;
    error?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const authMode = params?.auth === "sign-up" ? "sign-up" : "sign-in";
  const shouldOpenAuth = params?.auth === "sign-in" || params?.auth === "sign-up";

  return (
    <AppShell
      active="home"
      eyebrow="next-java://home"
      initialAuthError={params?.error === "github_oauth_failed" ? "github_oauth_failed" : null}
      initialAuthMode={authMode}
      initialAuthOpen={shouldOpenAuth}
    >
      <div className="mx-auto grid w-full max-w-[1240px] gap-8">
        <section className="grid grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] items-center gap-8 max-lg:grid-cols-1">
          <div className="grid gap-6">
            <div>
              <p className="text-brand mb-3 text-xs font-extrabold uppercase">Next.js + Java Spring Boot</p>
              <h1 className="m-0 max-w-[720px] text-[clamp(2.55rem,5.8vw,4.7rem)] leading-none tracking-normal">
                Learn Java by watching the stack come alive.
              </h1>
              <p className="text-muted max-w-[680px] text-lg leading-relaxed">
                Java Start connects the fundamentals, Spring Boot boundaries, secure sessions, PostgreSQL persistence,
                and a Next.js interface into one practical learning workspace.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                "Write small Java examples that explain memory, input safety, and behavior.",
                "Move from syntax to domain design without mixing HTTP code into business rules.",
                "Use focused tests as proof instead of hoping the application still works."
              ].map((item) => (
                <div className="flex gap-3 text-sm font-bold text-[var(--muted)]" key={item}>
                  <CheckCircle2 className="mt-0.5 flex-none text-[var(--mint)]" size={18} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="bg-ink text-panel inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg border border-transparent px-[18px] font-extrabold transition duration-150 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
                href="/java-basics"
              >
                Open Java map
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <OpenAuthModalButton
                className="border-line text-ink inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg border bg-transparent px-[18px] font-extrabold transition duration-150 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
                mode="sign-up"
              >
                Create account
              </OpenAuthModalButton>
            </div>
          </div>

          <HomeJavaLab />
        </section>

        <section className="grid grid-cols-[minmax(0,0.82fr)_minmax(280px,0.5fr)] gap-4 max-lg:grid-cols-1">
          <div className="border-line grid grid-cols-2 gap-3 rounded-lg border bg-[rgba(255,250,241,0.72)] p-3 shadow-[var(--shadow-card)] max-md:grid-cols-1">
            {homeLearningHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className="border-line grid min-h-[168px] content-start gap-3 rounded-lg border bg-[#fffdf8] p-4 transition-transform hover:-translate-y-px hover:border-[var(--brand-ring)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
                  href={item.href}
                  key={item.title}
                >
                  <Icon className="text-brand-strong" size={24} aria-hidden="true" />
                  <strong className="text-2xl leading-tight">{item.title}</strong>
                  <span className="text-muted leading-relaxed">{item.description}</span>
                </Link>
              );
            })}
          </div>

          <aside className="border-line bg-dark text-dark-text grid content-between gap-5 rounded-lg border p-5 shadow-[var(--shadow-card)]">
            <div className="grid gap-4">
              <Code2 className="text-brand-soft" size={28} aria-hidden="true" />
              <h2 className="m-0 text-3xl leading-tight">One project, four boundaries.</h2>
              <p className="text-dark-muted m-0 leading-relaxed">
                Build the mental model once: the browser handles interaction, Java owns domain rules, the API protects
                boundaries, and tests prove behavior.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { icon: Code2, label: "Next.js UI" },
                { icon: GitBranch, label: "Java domain flow" },
                { icon: ShieldCheck, label: "Secure API boundary" }
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    className="border-dark-line bg-dark-panel flex items-center gap-3 rounded-lg border px-4 py-3"
                    key={item.label}
                  >
                    <Icon className="text-brand-soft" size={18} aria-hidden="true" />
                    <span className="font-extrabold text-[var(--dark-muted)]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
