import type { LucideIcon } from "lucide-react";
import {
  Binary,
  BookOpenCheck,
  Boxes,
  Braces,
  Database,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TestTube2
} from "lucide-react";
import type { JavaFundamentalsIcon } from "@/features/java-fundamentals/content";

export const iconByName: Record<JavaFundamentalsIcon, LucideIcon> = {
  binary: Binary,
  book: BookOpenCheck,
  boxes: Boxes,
  braces: Braces,
  database: Database,
  gitBranch: GitBranch,
  layers: Layers3,
  lock: LockKeyhole,
  network: Network,
  server: ServerCog,
  shield: ShieldCheck,
  sparkles: Sparkles,
  testTube: TestTube2
};
