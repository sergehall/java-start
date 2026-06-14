import type { LucideIcon } from "lucide-react";
import { BookOpenCheck, Braces, DatabaseZap, ShieldCheck } from "lucide-react";

export type JavaLabSnippet = Readonly<{
  id: string;
  title: string;
  label: string;
  code: string;
  output: string;
  lesson: string;
}>;

export type HomeLearningHighlight = Readonly<{
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}>;

export const javaLabSnippets: readonly JavaLabSnippet[] = [
  {
    id: "coffee-break",
    title: "CoffeeBreak.java",
    label: "Warm-up",
    code: `import java.util.List;

public final class CoffeeBreak {
    public static void main(String[] args) {
        List<String> ideas = List.of("types", "security", "tests");

        for (String idea : ideas) {
            System.out.println("Brew " + idea + " until it clicks.");
        }
    }
}`,
    output: "Brew types until it clicks.\nBrew security until it clicks.\nBrew tests until it clicks.",
    lesson: "A loop turns a small idea into a repeatable habit."
  },
  {
    id: "secret-guard",
    title: "SecretGuard.java",
    label: "Safety",
    code: `public final class SecretGuard {
    public String mask(String value) {
        if (value == null || value.isBlank()) {
            return "[missing]";
        }

        return "[secret:" + value.length() + "]";
    }
}`,
    output: "[secret:12]\nNo token leaked into the terminal.",
    lesson: "A safe boundary can be simple, explicit, and easy to test."
  },
  {
    id: "memory-mirror",
    title: "MemoryMirror.java",
    label: "Memory",
    code: `import java.util.ArrayList;
import java.util.List;

public final class MemoryMirror {
    public void compare() {
        int firstScore = 7;
        int copiedScore = firstScore;
        copiedScore++;

        List<String> topics = new ArrayList<>();
        List<String> sharedTopics = topics;
        sharedTopics.add("references");
    }
}`,
    output: "firstScore stays 7\ncopiedScore becomes 8\ntopics and sharedTopics point to the same list",
    lesson: "Primitive values copy differently than object references."
  }
];

export const homeLearningHighlights: readonly HomeLearningHighlight[] = [
  {
    title: "Java Fundamentals",
    description: "Open the visual map for syntax, OOP, collections, safety, API design, and focused tests.",
    href: "/java-basics",
    icon: BookOpenCheck
  },
  {
    title: "Secure Boundaries",
    description: "Keep validation, secrets, sessions, and HTTP concerns separated from the domain.",
    href: "/java-basics/safety",
    icon: ShieldCheck
  },
  {
    title: "Project Architecture",
    description: "Connect the Next.js surface with the Spring Boot backend and PostgreSQL persistence layer.",
    href: "/architecture",
    icon: DatabaseZap
  },
  {
    title: "Code Practice",
    description: "Use small Java examples to make memory, references, values, and tests easier to remember.",
    href: "/java-basics/types",
    icon: Braces
  }
];
