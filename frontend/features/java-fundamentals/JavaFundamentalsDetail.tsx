import Link from "next/link";
import { ArrowLeft, ArrowRight, Code2, Lightbulb, Network } from "lucide-react";
import type { JavaArchitectureLink, JavaExample, JavaFundamentalsTopic } from "@/features/java-fundamentals/content";
import { iconByName } from "@/features/java-fundamentals/icons";

type JavaFundamentalsDetailProps = Readonly<{
  topic: JavaFundamentalsTopic;
}>;

export function JavaFundamentalsDetail({ topic }: JavaFundamentalsDetailProps) {
  const title = topic.kind === "module" ? topic.module.title : topic.pillar.label;
  const description = topic.kind === "module" ? topic.module.details : topic.pillar.description;
  const eyebrow = topic.kind === "module" ? topic.module.label : topic.pillar.text;
  const iconName = topic.kind === "module" ? topic.module.iconName : topic.pillar.iconName;
  const architectureLinks = topic.kind === "module" ? topic.module.architectureLinks : topic.pillar.architectureLinks;
  const Icon = iconByName[iconName];

  return (
    <section className="mx-auto grid w-full max-w-[1120px] gap-5" aria-label={`${title} lesson`}>
      <Link
        className="text-brand-strong inline-flex w-fit items-center gap-2 rounded-lg font-extrabold transition hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
        href="/java-basics"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Java Fundamentals map
      </Link>

      <article className="border-line grid gap-5 rounded-lg border bg-[rgba(255,250,241,0.92)] p-6 shadow-[var(--shadow-card)]">
        <header className="grid gap-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:items-start">
          <div className="text-mint-strong grid size-16 place-items-center rounded-lg border border-[rgba(20,125,100,0.22)] bg-[#eef8f3]">
            <Icon size={30} aria-hidden="true" />
          </div>
          <div>
            <p className="text-muted m-0 text-xs font-black uppercase">{eyebrow}</p>
            <h1 className="m-0 mt-2 text-[clamp(2.2rem,6vw,4.8rem)] leading-none tracking-normal">{title}</h1>
            <p className="text-muted m-0 mt-4 max-w-[820px] text-lg leading-relaxed">{description}</p>
          </div>
        </header>

        {topic.kind === "module" ? <ModuleBody topic={topic} /> : <PillarBody topic={topic} />}

        <ArchitectureLinks links={architectureLinks} />
      </article>

      <section className="grid gap-4" aria-label={`${title} code examples`}>
        {topic.examples.map((example) => (
          <CodeExampleCard example={example} key={example.id} />
        ))}
      </section>
    </section>
  );
}

function ArchitectureLinks({ links }: Readonly<{ links: readonly JavaArchitectureLink[] }>) {
  return (
    <section className="grid gap-3" aria-label="Where this appears in the project architecture">
      <strong className="text-muted flex items-center gap-2 text-xs uppercase">
        <Network size={16} aria-hidden="true" />
        Where this appears in the project
      </strong>
      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {links.map((link) => (
          <Link
            className="border-line grid gap-2 rounded-lg border bg-[#fffdf8] p-4 transition-transform hover:-translate-y-px hover:border-[var(--brand-ring)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
            href={link.href}
            key={link.href}
          >
            <span className="text-brand-strong inline-flex items-center gap-2 font-extrabold">
              {link.title}
              <ArrowRight size={16} aria-hidden="true" />
            </span>
            <span className="text-muted text-sm leading-relaxed">{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ModuleBody({ topic }: Readonly<{ topic: Extract<JavaFundamentalsTopic, { kind: "module" }> }>) {
  return (
    <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 max-lg:grid-cols-1">
      <section className="grid gap-2" aria-label={`${topic.module.title} topics`}>
        <strong className="text-muted text-xs uppercase">Core topics</strong>
        <ul className="m-0 grid grid-cols-2 gap-2 p-0 max-sm:grid-cols-1">
          {topic.module.topics.map((topicName) => (
            <li className="border-line list-none rounded-lg border bg-[#fffdf8] px-3 py-2 text-sm" key={topicName}>
              {topicName}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-2" aria-label={`${topic.module.title} outcomes`}>
        <strong className="text-muted text-xs uppercase">You should be able to</strong>
        <ul className="m-0 grid gap-2 p-0">
          {topic.module.outcomes.map((outcome) => (
            <li className="flex gap-2 text-sm leading-relaxed" key={outcome}>
              <span className="text-brand-strong mt-0.5 font-black" aria-hidden="true">
                /
              </span>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mb-0 rounded-lg bg-[var(--brand-wash)] px-3 py-2 text-sm font-extrabold text-[var(--brand-strong)] lg:col-span-2">
        Practice: {topic.module.practice}
      </p>
    </div>
  );
}

function PillarBody({ topic }: Readonly<{ topic: Extract<JavaFundamentalsTopic, { kind: "pillar" }> }>) {
  return (
    <section className="grid gap-2" aria-label={`${topic.pillar.label} principles`}>
      <strong className="text-muted text-xs uppercase">Principles</strong>
      <ul className="m-0 grid grid-cols-3 gap-2 p-0 max-lg:grid-cols-1">
        {topic.pillar.principles.map((principle) => (
          <li className="border-line list-none rounded-lg border bg-[#fffdf8] px-3 py-2 text-sm" key={principle}>
            {principle}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CodeExampleCard({ example }: Readonly<{ example: JavaExample }>) {
  return (
    <article className="bg-dark text-dark-text grid gap-4 rounded-lg border border-[var(--dark-line)] p-5 shadow-[var(--shadow-card)]">
      <header className="flex items-start gap-3">
        <span className="grid size-11 flex-none place-items-center rounded-lg border border-[var(--dark-line)] bg-[var(--dark-panel)] text-[var(--brand-soft)]">
          <Code2 size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="m-0 text-2xl leading-tight">{example.title}</h2>
          <p className="text-dark-muted m-0 mt-2 leading-relaxed">{example.goal}</p>
        </div>
      </header>

      <pre className="m-0 max-h-[520px] overflow-auto rounded-lg border border-[var(--dark-line)] bg-[#080b09] p-4 text-sm leading-relaxed text-[#f7f3eb]">
        <code>{example.code}</code>
      </pre>

      <div className="grid gap-2">
        <strong className="text-brand-soft flex items-center gap-2 text-sm uppercase">
          <Lightbulb size={16} aria-hidden="true" />
          Why this example matters
        </strong>
        <ul className="m-0 grid gap-2 p-0">
          {example.notes.map((note) => (
            <li className="text-dark-muted flex gap-2 text-sm leading-relaxed" key={note}>
              <span className="text-brand-soft mt-0.5" aria-hidden="true">
                -
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
