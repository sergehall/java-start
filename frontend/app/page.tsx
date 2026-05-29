import type { Metadata } from "next";
import { ArrowRight, Code2, Coffee, LockKeyhole, Sparkles } from "lucide-react";
import { OpenAuthModalButton } from "@/features/auth/AuthModal";
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
      <section className="mx-auto grid w-full max-w-[1180px] grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] items-center gap-10 max-lg:grid-cols-1">
        <div>
          <p className="text-brand mb-3 text-xs font-extrabold uppercase">Next.js + Java Spring Boot</p>
          <h1 className="m-0 text-[clamp(2.8rem,9vw,6.4rem)] leading-none tracking-normal">
            Fullstack learning without pretending the stack is magic.
          </h1>
          <p className="text-muted max-w-[660px] text-lg leading-relaxed">
            A learning dashboard where frontend and backend work as a pair: Next.js keeps the web interface fast, while
            Java owns security, data, and a clear API.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <OpenAuthModalButton
              className="bg-ink text-panel inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg border border-transparent px-[18px] font-extrabold transition duration-150 hover:-translate-y-px"
              mode="sign-up"
            >
              Get started
              <ArrowRight size={18} />
            </OpenAuthModalButton>
            <OpenAuthModalButton className="border-line text-ink inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg border bg-transparent px-[18px] font-extrabold transition duration-150 hover:-translate-y-px" />
          </div>
        </div>

        <div
          className="border-line grid min-h-[520px] grid-cols-1 place-items-center gap-[18px] rounded-lg border bg-[#efe7db] bg-[linear-gradient(90deg,rgba(29,27,23,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(29,27,23,0.04)_1px,transparent_1px)] bg-[length:32px_32px] p-7 max-lg:min-h-0"
          aria-label="Application stack preview"
        >
          <div className="border-line border-t-blue flex w-full max-w-[360px] flex-col items-start gap-3 rounded-lg border border-t-[5px] bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
            <Code2 size={24} />
            <span className="text-muted font-extrabold">Next.js</span>
            <strong className="text-2xl">UI, routes, BFF</strong>
          </div>
          <div className="h-1 w-[min(280px,70%)] bg-[repeating-linear-gradient(90deg,var(--mint),var(--mint)_12px,transparent_12px,transparent_22px)]" />
          <div className="border-line border-t-brand flex w-full max-w-[360px] flex-col items-start gap-3 rounded-lg border border-t-[5px] bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
            <Coffee size={24} />
            <span className="text-muted font-extrabold">Spring Boot</span>
            <strong className="text-2xl">Auth, API, domain</strong>
          </div>
          <div className="border-line flex w-[min(360px,100%)] items-center gap-2.5 rounded-lg border bg-[rgba(255,250,241,0.92)] px-4 py-3.5 shadow-[var(--shadow-card)]">
            <LockKeyhole size={18} />
            <span className="text-muted font-extrabold">httpOnly session cookie</span>
          </div>
          <div className="border-line flex w-[min(360px,100%)] items-center gap-2.5 rounded-lg border bg-[rgba(255,250,241,0.92)] px-4 py-3.5 shadow-[var(--shadow-card)]">
            <Sparkles size={18} />
            <span className="text-muted font-extrabold">Learning state cabinet</span>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
