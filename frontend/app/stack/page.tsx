import type { Metadata } from "next";
import { ArrowRight, Code2, Cookie, Database, ServerCog } from "lucide-react";
import { AppShell } from "@/shared/ui/AppShell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/stack"
  },
  description: "Explore the Java Start stack: Next.js routes, secure sessions, Spring Boot APIs, and PostgreSQL.",
  title: "Stack Lab"
};

const stackSteps = [
  {
    icon: Code2,
    label: "Browser",
    title: "Next.js interface",
    description: "Pages, forms, route handlers, and the private cabinet experience."
  },
  {
    icon: Cookie,
    label: "Session",
    title: "httpOnly cookie",
    description: "The frontend stores the session safely and calls the backend through server-side routes."
  },
  {
    icon: ServerCog,
    label: "Backend",
    title: "Spring Boot API",
    description: "Security, validation, application services, and domain rules live in Java."
  },
  {
    icon: Database,
    label: "Database",
    title: "PostgreSQL",
    description: "User accounts, profile state, and dashboard data are persisted in Docker-backed local storage."
  }
];

export default function StackPage() {
  return (
    <AppShell active="stack" eyebrow="next-java://stack">
      <section className="grid grid-cols-4 gap-3.5 max-xl:grid-cols-2 max-lg:grid-cols-1" aria-label="Stack lab">
        {stackSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              className="border-line relative grid min-h-[300px] gap-3 rounded-lg border bg-[rgba(255,250,241,0.92)] p-5 shadow-[var(--shadow-card)]"
              key={step.title}
            >
              <div className="text-mint-strong grid size-12 place-items-center rounded-lg border border-[rgba(20,125,100,0.22)] bg-[#eef8f3]">
                <Icon size={24} />
              </div>
              <span className="text-muted text-xs font-black uppercase">{step.label}</span>
              <h2 className="m-0">{step.title}</h2>
              <p className="text-muted m-0 leading-relaxed">{step.description}</p>
              {index < stackSteps.length - 1 ? (
                <ArrowRight
                  className="text-brand absolute top-8 -right-[18px] z-10 max-lg:hidden"
                  size={20}
                  aria-hidden="true"
                />
              ) : null}
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
