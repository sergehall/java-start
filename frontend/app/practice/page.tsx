import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LockKeyhole } from "lucide-react";
import { courseModules, type CourseModule } from "@/features/course-practice/content";
import { AppShell } from "@/shared/ui/AppShell";

export const metadata: Metadata = {
  alternates: {
    canonical: "/practice"
  },
  description: "CS56 practice modules for homework and assignment work in the Java Start learning workspace.",
  title: "CS56 Practice"
};

export default function PracticePage() {
  return (
    <AppShell active="practice" eyebrow="java-start://cs56-practice" title="CS56 Practice">
      <section className="mx-auto grid w-full max-w-[1220px] gap-7" aria-label="CS56 practice modules">
        {courseModules.map((module) => (
          <PracticeModuleRow key={module.id} module={module} />
        ))}
      </section>
    </AppShell>
  );
}

function PracticeModuleRow({ module }: Readonly<{ module: CourseModule }>) {
  const rowContent = (
    <>
      <span className="grid size-5 flex-none place-items-center text-[var(--ink)]" aria-hidden="true">
        <ChevronRight size={17} strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[clamp(1.05rem,2vw,1.35rem)] font-extrabold text-[#3f4950]">
        {module.displayTitle}
      </span>
      {module.isLocked ? (
        <LockKeyhole className="ml-auto flex-none text-[var(--ink)]" size={22} strokeWidth={1.8} aria-label="Locked" />
      ) : null}
    </>
  );

  if (module.isLocked) {
    return (
      <div className="border-line flex min-h-[76px] items-center gap-3 bg-[#f0f2f3] px-5 py-4" aria-disabled="true">
        {rowContent}
      </div>
    );
  }

  return (
    <Link
      className="border-line flex min-h-[76px] items-center gap-3 bg-[#f0f2f3] px-5 py-4 transition-colors hover:border-[var(--brand-ring)] hover:bg-[#fffdf8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
      href={`/practice/${module.id}`}
    >
      {rowContent}
    </Link>
  );
}
