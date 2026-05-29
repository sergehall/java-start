import { ArrowRight, Code2, Cookie, Database, ServerCog } from "lucide-react";
import { AppShell } from "@/shared/ui/AppShell";

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
    <AppShell active="stack" title="Stack lab" eyebrow="next-java://stack">
      <section className="stack-lab">
        {stackSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="stack-step" key={step.title}>
              <div className="stack-step-icon">
                <Icon size={24} />
              </div>
              <span>{step.label}</span>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              {index < stackSteps.length - 1 ? (
                <ArrowRight className="stack-step-arrow" size={20} aria-hidden="true" />
              ) : null}
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
