import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { architectureLayers, architecturePrinciples } from "@/features/architecture/content";
import { AppShell } from "@/shared/ui/AppShell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/architecture"
  },
  description:
    "Explore how Java fundamentals appear inside the Java Start architecture: Next.js UI, secure sessions, Spring Boot APIs, PostgreSQL, and tests.",
  title: "Project Architecture"
};

export default function ArchitecturePage() {
  return (
    <AppShell active="architecture" eyebrow="next-java://architecture" title="Project Architecture">
      <section className="mx-auto grid w-full max-w-[1220px] gap-7" aria-label="Project architecture map">
        <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(280px,0.45fr)] gap-5 max-lg:grid-cols-1">
          <div>
            <p className="text-muted m-0 max-w-[820px] text-lg leading-relaxed">
              This page connects the Java Fundamentals map to the actual project structure. Use it as the applied view:
              every architecture boundary points back to the Java lesson that explains the underlying idea.
            </p>
          </div>
          <Link
            className="border-line grid content-center gap-3 rounded-lg border bg-[rgba(255,250,241,0.92)] p-5 transition-transform hover:-translate-y-px hover:border-[var(--brand-ring)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
            href="/java-basics"
          >
            <BookOpenCheck className="text-brand-strong" size={24} aria-hidden="true" />
            <strong className="text-2xl leading-tight">Start from Java Fundamentals</strong>
            <span className="text-muted leading-relaxed">
              Review the concepts before following them through the stack.
            </span>
          </Link>
        </div>

        <section
          className="border-line grid gap-4 rounded-lg border bg-[#efe7db] bg-[linear-gradient(90deg,rgba(29,27,23,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(29,27,23,0.05)_1px,transparent_1px)] bg-[length:30px_30px] p-5 shadow-[var(--shadow-card)]"
          aria-label="Architecture layers"
        >
          <div className="grid grid-cols-3 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
            {architectureLayers.map((layer) => {
              const Icon = layer.icon;

              return (
                <article
                  className="border-line grid min-h-[330px] content-start gap-4 rounded-lg border bg-[rgba(255,250,241,0.94)] p-5 shadow-[var(--shadow-card)]"
                  id={layer.id}
                  key={layer.id}
                >
                  <div className="text-mint-strong grid size-12 place-items-center rounded-lg border border-[rgba(20,125,100,0.22)] bg-[#eef8f3]">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-muted text-xs font-black uppercase">{layer.label}</span>
                    <h2 className="m-0 mt-2 text-2xl leading-tight">{layer.title}</h2>
                  </div>
                  <p className="text-muted m-0 leading-relaxed">{layer.description}</p>
                  <ul className="m-0 grid grid-cols-2 gap-2 p-0 max-sm:grid-cols-1">
                    {layer.responsibilities.map((responsibility) => (
                      <li
                        className="border-line list-none rounded-lg border bg-[#fffdf8] px-3 py-2 text-sm font-bold text-[var(--muted)]"
                        key={responsibility}
                      >
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="text-brand-strong mt-auto inline-flex w-fit items-center gap-2 rounded-lg font-extrabold transition hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
                    href={layer.javaLessonHref}
                  >
                    Learn: {layer.javaLessonLabel}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3 max-lg:grid-cols-1" aria-label="Architecture principles">
          {architecturePrinciples.map((principle) => {
            const Icon = principle.icon;

            return (
              <Link
                className="border-line grid min-h-[190px] content-start gap-3 rounded-lg border bg-[rgba(255,250,241,0.92)] p-5 transition-transform hover:-translate-y-px hover:border-[var(--brand-ring)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
                href={principle.href}
                key={principle.title}
              >
                <Icon className="text-brand-strong" size={24} aria-hidden="true" />
                <strong className="text-2xl leading-tight">{principle.title}</strong>
                <span className="text-muted leading-relaxed">{principle.description}</span>
              </Link>
            );
          })}
        </section>
      </section>
    </AppShell>
  );
}
