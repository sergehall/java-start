import type { LucideIcon } from "lucide-react";
import { Braces, Code2, Cookie, Database, Network, ServerCog, ShieldCheck, TestTubeDiagonal } from "lucide-react";

export type ArchitectureLayer = Readonly<{
  id: string;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  responsibilities: readonly string[];
  javaLessonHref: string;
  javaLessonLabel: string;
}>;

export type ArchitecturePrinciple = Readonly<{
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}>;

export const architectureLayers: readonly ArchitectureLayer[] = [
  {
    id: "browser-interface",
    icon: Code2,
    label: "Interface",
    title: "Next.js UI and routes",
    description:
      "The browser-facing layer renders pages, handles forms, keeps interactive state local, and calls server-side route boundaries when data must cross trust zones.",
    responsibilities: ["App Router pages", "Client interaction", "Form UX", "Server route boundaries"],
    javaLessonHref: "/java-basics/api",
    javaLessonLabel: "API boundaries"
  },
  {
    id: "session-boundary",
    icon: Cookie,
    label: "Session",
    title: "Secure session boundary",
    description:
      "Authentication state stays behind httpOnly cookies and server-side checks instead of trusting browser-only authorization decisions.",
    responsibilities: ["httpOnly cookies", "CSRF-aware requests", "safe error messages", "authorization checks"],
    javaLessonHref: "/java-basics/safety",
    javaLessonLabel: "Safety"
  },
  {
    id: "spring-application",
    icon: ServerCog,
    label: "Backend",
    title: "Spring Boot application",
    description:
      "Controllers translate HTTP, services orchestrate use cases, and domain objects protect business rules without depending on web framework details.",
    responsibilities: ["Controllers", "DTO validation", "application services", "domain rules"],
    javaLessonHref: "/java-basics/spring-boot",
    javaLessonLabel: "Spring Boot Basics"
  },
  {
    id: "domain-model",
    icon: Braces,
    label: "Domain",
    title: "Java domain model",
    description:
      "Types, records, collections, and exceptions turn loose request data into explicit concepts with names, invariants, and predictable behavior.",
    responsibilities: ["value objects", "records and enums", "collections", "exceptions"],
    javaLessonHref: "/java-basics/oop",
    javaLessonLabel: "OOP and domain modeling"
  },
  {
    id: "persistence-boundary",
    icon: Database,
    label: "Persistence",
    title: "PostgreSQL and repositories",
    description:
      "Repository code owns SQL, transactions, mapping, and resource lifecycle so application services do not leak storage details.",
    responsibilities: ["repositories", "PreparedStatement", "transactions", "mapping"],
    javaLessonHref: "/java-basics/io-persistence",
    javaLessonLabel: "I/O and persistence"
  },
  {
    id: "quality-loop",
    icon: TestTubeDiagonal,
    label: "Quality",
    title: "Focused test loop",
    description:
      "Unit, integration, API, and security-focused tests prove behavior at the layer where the risk actually lives.",
    responsibilities: ["unit tests", "API tests", "security cases", "integration checks"],
    javaLessonHref: "/java-basics/tests",
    javaLessonLabel: "Tests"
  }
];

export const architecturePrinciples: readonly ArchitecturePrinciple[] = [
  {
    icon: Network,
    title: "HTTP is a boundary, not the domain.",
    description: "Request and response details should end at controllers, route handlers, and DTO mapping.",
    href: "/java-basics/api"
  },
  {
    icon: ShieldCheck,
    title: "Security belongs at every entry point.",
    description: "Inputs, cookies, secrets, database values, and errors need explicit protection.",
    href: "/java-basics/safety"
  },
  {
    icon: TestTubeDiagonal,
    title: "Tests document the contract.",
    description: "A test should make the expected behavior easier to understand and harder to break.",
    href: "/java-basics/tests"
  }
];
