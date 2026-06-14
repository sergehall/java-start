import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import {
  foundationPillars,
  getJavaModuleMapColumns,
  type FoundationPillar,
  type JavaModule
} from "@/features/java-fundamentals/content";
import { iconByName } from "@/features/java-fundamentals/icons";
import { AppShell } from "@/shared/ui/AppShell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/java-basics"
  },
  description:
    "Java Start learning map with dedicated pages for Java fundamentals, OOP, collections, errors, persistence, testing, Spring Boot, and security.",
  title: "Java Fundamentals"
};

export default function JavaBasicsPage() {
  const moduleColumns = getJavaModuleMapColumns();

  return (
    <AppShell active="java-basics" eyebrow="java-start://java-basics" title="Java Fundamentals">
      <section className="mx-auto grid w-full max-w-[1220px] gap-7" aria-label="Java Fundamentals map">
        <p className="text-muted m-0 max-w-[860px] text-lg leading-relaxed">
          This is the project learning map: from Java syntax to Spring Boot boundaries, security, and tests. Open any
          block to study one focused module with examples, practice goals, and production-style Java code.
        </p>

        <section
          className="border-line grid gap-4 rounded-lg border bg-[#efe7db] bg-[linear-gradient(90deg,rgba(29,27,23,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(29,27,23,0.05)_1px,transparent_1px)] bg-[length:30px_30px] p-5 shadow-[var(--shadow-card)]"
          aria-label="Java foundation visual map"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-lg:grid-cols-1">
            <div className="grid gap-3">
              {moduleColumns.primary.map((module) => (
                <ModuleMapLink iconTone="brand" key={module.id} module={module} />
              ))}
            </div>

            <CoreJavaHub />

            <div className="grid gap-3">
              {moduleColumns.secondary.map((module) => (
                <ModuleMapLink iconTone="mint" key={module.id} module={module} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1">
            {foundationPillars.map((pillar) => (
              <FoundationPillarLink key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}

function ModuleMapLink({ iconTone, module }: Readonly<{ iconTone: "brand" | "mint"; module: JavaModule }>) {
  const Icon = iconByName[module.iconName];
  const iconClassName =
    iconTone === "brand" ? "text-brand-strong bg-[var(--brand-wash)]" : "text-mint-strong bg-[#eef8f3]";

  return (
    <Link
      className="border-line grid min-h-[92px] grid-cols-[52px_1fr] items-center gap-4 rounded-lg border bg-[rgba(255,250,241,0.92)] p-4 transition-transform hover:-translate-y-px hover:border-[var(--brand-ring)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
      href={`/java-basics/${module.id}`}
    >
      <span className={`${iconClassName} grid size-12 place-items-center rounded-lg`}>
        <Icon size={24} aria-hidden="true" />
      </span>
      <span>
        <span className="text-muted block text-xs font-black uppercase">{module.label}</span>
        <strong className="block text-2xl leading-tight">{module.title}</strong>
      </span>
    </Link>
  );
}

function CoreJavaHub() {
  return (
    <div className="border-line bg-dark text-dark-text grid min-h-[236px] min-w-[236px] place-items-center rounded-lg border p-5 text-center shadow-[var(--shadow-dock)] max-lg:min-h-[180px] max-lg:min-w-0">
      <div>
        <BookOpenCheck className="mx-auto" size={42} aria-hidden="true" />
        <strong className="mt-4 block text-3xl leading-none">Core Java</strong>
        <span className="text-dark-muted mt-3 block text-sm font-bold">foundation map</span>
      </div>
    </div>
  );
}

function FoundationPillarLink({ pillar }: Readonly<{ pillar: FoundationPillar }>) {
  const Icon = iconByName[pillar.iconName];

  return (
    <Link
      className="border-line grid min-h-[190px] content-start gap-3 rounded-lg border bg-[rgba(255,250,241,0.92)] p-4 transition-transform hover:-translate-y-px hover:border-[var(--brand-ring)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
      href={`/java-basics/${pillar.id}`}
    >
      <Icon className="text-brand-strong" size={22} aria-hidden="true" />
      <strong className="block text-2xl leading-tight">{pillar.label}</strong>
      <span className="text-muted block text-lg leading-snug">{pillar.text}</span>
    </Link>
  );
}
