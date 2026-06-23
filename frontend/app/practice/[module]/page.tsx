import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CourseModuleSections } from "@/features/course-practice/CourseModuleSections";
import { courseModuleIds, getCourseModule, type CourseModule } from "@/features/course-practice/content";
import { AppShell } from "@/shared/ui/AppShell";

type PracticeModulePageProps = Readonly<{
  params: Promise<{
    module: string;
  }>;
}>;

export function generateStaticParams() {
  return courseModuleIds.map((module) => ({ module }));
}

export async function generateMetadata({ params }: PracticeModulePageProps): Promise<Metadata> {
  const { module: moduleId } = await params;
  const courseModule = getCourseModule(moduleId);

  if (!courseModule) {
    return {
      title: "CS56 Practice"
    };
  }

  return {
    alternates: {
      canonical: `/practice/${courseModule.id}`
    },
    description: courseModule.description,
    title: courseModule.title
  };
}

export default async function PracticeModulePage({ params }: PracticeModulePageProps) {
  const { module: moduleId } = await params;
  const courseModule = getCourseModule(moduleId);

  if (!courseModule || courseModule.isLocked) {
    notFound();
  }

  return (
    <AppShell active="practice" eyebrow="java-start://cs56-practice" title={courseModule.title}>
      <section className="mx-auto grid w-full max-w-[1120px] gap-5" aria-label={`${courseModule.title} practice`}>
        <Link
          className="text-brand-strong inline-flex w-fit items-center gap-2 rounded-lg font-extrabold transition hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
          href="/practice"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to practice modules
        </Link>

        <ModuleOverview module={courseModule} />

        {courseModule.sections.length > 0 ? (
          <CourseModuleSections assignments={courseModule.assignments} sections={courseModule.sections} />
        ) : null}

        {courseModule.assignments.length === 0 ? (
          <p className="border-line text-muted m-0 rounded-lg border bg-[rgba(255,250,241,0.92)] px-5 py-4 font-bold shadow-[var(--shadow-card)]">
            Homework for this module will live here.
          </p>
        ) : null}
      </section>
    </AppShell>
  );
}

function ModuleOverview({ module }: Readonly<{ module: CourseModule }>) {
  return (
    <article className="border-line grid gap-4 rounded-lg border bg-[rgba(255,250,241,0.92)] p-5 shadow-[var(--shadow-card)]">
      <div>
        <p className="text-muted m-0 text-xs font-black uppercase">{module.dateRange}</p>
        <h2 className="m-0 mt-2 text-[clamp(2rem,5vw,3.7rem)] leading-none tracking-normal">{module.displayTitle}</h2>
        <p className="text-muted m-0 mt-3 max-w-[820px] text-lg leading-relaxed">{module.description}</p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label={`${module.title} topics`}>
        {module.topics.map((topic) => (
          <span className="border-line rounded-lg border bg-[#fffdf8] px-3 py-1.5 text-sm font-bold" key={topic}>
            {topic}
          </span>
        ))}
      </div>
    </article>
  );
}
