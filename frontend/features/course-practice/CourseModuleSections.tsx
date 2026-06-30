"use client";

import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileCode2,
  FileText,
  MessageSquare,
  Paperclip,
  Rocket,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  CourseAssignment,
  CourseAssignmentFile,
  CourseModuleItem,
  CourseModuleSection
} from "@/features/course-practice/content";

type CourseModuleSectionsProps = Readonly<{
  assignments: readonly CourseAssignment[];
  sections: readonly CourseModuleSection[];
}>;

export function CourseModuleSections({ assignments, sections }: CourseModuleSectionsProps) {
  const [openAssignmentId, setOpenAssignmentId] = useState<string | null>(null);
  const assignmentByTitle = useMemo(
    () => new Map(assignments.map((assignment) => [assignment.title, assignment])),
    [assignments]
  );
  const activeAssignment = assignments.find((assignment) => assignment.id === openAssignmentId) ?? null;

  return (
    <>
      <section className="grid gap-4" aria-label="Java Review module sections">
        {sections.map((section) => (
          <ModuleContentSection
            assignmentByTitle={assignmentByTitle}
            key={section.id}
            onOpenAssignment={setOpenAssignmentId}
            section={section}
          />
        ))}
      </section>

      <AssignmentModal assignment={activeAssignment} onClose={() => setOpenAssignmentId(null)} />
    </>
  );
}

function ModuleContentSection({
  assignmentByTitle,
  onOpenAssignment,
  section
}: Readonly<{
  assignmentByTitle: ReadonlyMap<string, CourseAssignment>;
  onOpenAssignment: (assignmentId: string) => void;
  section: CourseModuleSection;
}>) {
  return (
    <details className="border-line group rounded-lg border bg-[rgba(255,250,241,0.92)] shadow-[var(--shadow-card)]">
      <summary className="flex min-h-[64px] cursor-pointer list-none items-center gap-3 px-5 py-4 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand-ring)] [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="text-brand-strong transition-transform group-open:rotate-90"
          size={18}
          strokeWidth={3}
          aria-hidden="true"
        />
        <span className="text-lg font-extrabold text-[var(--ink)]">{section.title}</span>
      </summary>
      <div className="border-line border-t">
        {section.items.length > 0 ? (
          <div className="overflow-hidden">
            {section.items.map((item) => (
              <ModuleContentItem
                assignment={assignmentByTitle.get(item.title) ?? null}
                item={item}
                key={item.id}
                onOpenAssignment={onOpenAssignment}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted m-0 px-5 py-4 text-lg leading-relaxed">{section.description}</p>
        )}
      </div>
    </details>
  );
}

function ModuleContentItem({
  assignment,
  item,
  onOpenAssignment
}: Readonly<{
  assignment: CourseAssignment | null;
  item: CourseModuleItem;
  onOpenAssignment: (assignmentId: string) => void;
}>) {
  if (item.type === "Page") {
    return (
      <div className="border-line grid min-h-[86px] grid-cols-[44px_minmax(0,1fr)] items-center gap-4 border-b px-5 py-4 last:border-b-0 sm:px-10">
        <FileText className="text-[var(--ink)]" size={30} strokeWidth={1.8} aria-hidden="true" />
        <strong className="min-w-0 text-xl leading-tight font-extrabold text-[var(--ink)] sm:text-2xl">
          {item.title}
        </strong>
      </div>
    );
  }

  if (item.type === "File") {
    return (
      <div className="border-line grid min-h-[86px] grid-cols-[44px_minmax(0,1fr)] items-center gap-4 border-b px-5 py-4 last:border-b-0 sm:px-10">
        <Paperclip className="text-[var(--ink)]" size={30} strokeWidth={1.8} aria-hidden="true" />
        <strong className="min-w-0 text-xl leading-tight font-extrabold text-[var(--ink)] sm:text-2xl">
          {item.title}
        </strong>
      </div>
    );
  }

  if (item.type === "Quiz") {
    return (
      <div className="border-line grid min-h-[86px] grid-cols-[44px_minmax(0,1fr)] items-center gap-4 border-b px-5 py-4 last:border-b-0 sm:px-10">
        <Rocket className="text-[var(--ink)]" size={30} strokeWidth={2.2} aria-hidden="true" />
        <span className="min-w-0">
          <strong className="block text-xl leading-tight font-extrabold text-[var(--ink)] sm:text-2xl">
            {item.title}
          </strong>
          {item.dueLabel || item.points ? (
            <span className="text-muted mt-1 flex flex-wrap gap-x-5 gap-y-1 text-base font-semibold">
              {item.dueLabel ? <span>{item.dueLabel}</span> : null}
              {item.points ? <span>{item.points}</span> : null}
            </span>
          ) : null}
        </span>
      </div>
    );
  }

  if (item.type === "Discussion") {
    return (
      <div className="border-line grid min-h-[86px] grid-cols-[44px_minmax(0,1fr)] items-center gap-4 border-b px-5 py-4 last:border-b-0 sm:px-10">
        <MessageSquare className="text-[var(--ink)]" size={30} strokeWidth={1.8} aria-hidden="true" />
        <span className="min-w-0">
          <strong className="block text-xl leading-tight font-extrabold text-[var(--ink)] sm:text-2xl">
            {item.title}
          </strong>
          {item.dueLabel || item.points ? (
            <span className="text-muted mt-1 flex flex-wrap gap-x-5 gap-y-1 text-base font-semibold">
              {item.dueLabel ? <span>{item.dueLabel}</span> : null}
              {item.points ? <span>{item.points}</span> : null}
            </span>
          ) : null}
        </span>
      </div>
    );
  }

  if (item.type === "Assignment" && !assignment) {
    return (
      <div className="border-line grid min-h-[86px] grid-cols-[44px_minmax(0,1fr)] items-center gap-4 border-b px-5 py-4 last:border-b-0 sm:px-10">
        <Rocket className="text-[var(--ink)]" size={30} strokeWidth={2.2} aria-hidden="true" />
        <span className="min-w-0">
          <strong className="block text-xl leading-tight font-extrabold text-[var(--ink)] sm:text-2xl">
            {item.title}
          </strong>
          {item.dueLabel || item.points ? (
            <span className="text-muted mt-1 flex flex-wrap gap-x-5 gap-y-1 text-base font-semibold">
              {item.dueLabel ? <span>{item.dueLabel}</span> : null}
              {item.points ? <span>{item.points}</span> : null}
            </span>
          ) : null}
        </span>
      </div>
    );
  }

  const content = (
    <>
      <span className="text-muted text-xs font-black uppercase">{item.type}</span>
      <span className="min-w-0">
        <strong className="block truncate text-lg leading-tight text-[var(--ink)] max-md:whitespace-normal">
          {item.title}
        </strong>
        {item.dueLabel || item.points ? (
          <span className="text-muted mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold">
            {item.dueLabel ? <span>{item.dueLabel}</span> : null}
            {item.points ? <span>{item.points}</span> : null}
          </span>
        ) : null}
      </span>
      <ChevronRight className="text-brand-strong max-md:hidden" size={18} aria-hidden="true" />
    </>
  );

  if (assignment) {
    return (
      <button
        className="border-line grid min-h-[68px] w-full cursor-pointer grid-cols-[112px_minmax(0,1fr)_auto] items-center gap-4 border-0 border-b bg-transparent px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#fffdf8] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand-ring)] max-md:grid-cols-1 max-md:items-start max-md:gap-2"
        onClick={() => onOpenAssignment(assignment.id)}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="border-line grid min-h-[68px] grid-cols-[112px_minmax(0,1fr)_auto] items-center gap-4 border-b px-4 py-3 last:border-b-0 max-md:grid-cols-1 max-md:items-start max-md:gap-2">
      {content}
    </div>
  );
}

function AssignmentModal({
  assignment,
  onClose
}: Readonly<{
  assignment: CourseAssignment | null;
  onClose: () => void;
}>) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const selectedFile = getSelectedFile(assignment?.starterFiles ?? [], selectedFileName);

  useEffect(() => {
    if (!assignment) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [assignment, onClose]);

  if (!assignment) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-modal-title"
    >
      <button
        aria-label="Close assignment dialog"
        className="absolute inset-0 cursor-pointer border-0 bg-[rgba(10,14,12,0.58)]"
        onClick={onClose}
        type="button"
      />
      <section className="border-line relative grid max-h-[78dvh] w-full max-w-[760px] gap-4 overflow-y-auto rounded-lg border bg-[rgba(255,250,241,0.98)] p-4 shadow-[0_34px_90px_rgba(29,27,23,0.28)] sm:p-5">
        <button
          aria-label="Close"
          className="border-line text-ink absolute top-4 right-4 z-20 grid size-10 cursor-pointer place-items-center rounded-full border bg-[#fffdf8] transition hover:border-[var(--brand-ring)] hover:text-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
          onClick={onClose}
          type="button"
        >
          <X size={19} aria-hidden="true" />
        </button>

        <header className="grid gap-2 pr-12">
          <p className="text-brand m-0 text-xs font-extrabold uppercase">
            {assignment.type} / Due {assignment.dueLabel}
          </p>
          <h2 className="m-0 text-[clamp(1.7rem,3vw,2.35rem)] leading-none tracking-normal" id="assignment-modal-title">
            {assignment.title}
          </h2>
          <p className="text-muted m-0 max-w-[720px] text-base leading-relaxed">{assignment.summary}</p>
        </header>

        <div className="grid gap-4">
          <AssignmentChecklist assignment={assignment} />
          <StarterFileViewer
            files={assignment.starterFiles}
            selectedFile={selectedFile}
            selectedFileName={selectedFile?.fileName ?? null}
            onSelectFile={setSelectedFileName}
          />
        </div>
      </section>
    </div>
  );
}

function AssignmentChecklist({ assignment }: Readonly<{ assignment: CourseAssignment }>) {
  return (
    <div className="grid gap-4">
      <section
        className="border-line grid gap-2 rounded-lg border bg-[#fffdf8] p-3"
        aria-label="Assignment requirements"
      >
        <strong className="text-brand-strong flex items-center gap-2 text-sm uppercase">
          <CheckCircle2 size={16} aria-hidden="true" />
          Requirements
        </strong>
        <ul className="m-0 grid gap-2 p-0">
          {assignment.requirements.map((requirement) => (
            <li className="text-muted flex gap-2 text-sm leading-normal" key={requirement}>
              <span className="text-brand-strong mt-0.5" aria-hidden="true">
                -
              </span>
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-line grid gap-2 rounded-lg border bg-[#fffdf8] p-3" aria-label="Rubric checkpoints">
        <strong className="text-brand-strong flex items-center gap-2 text-sm uppercase">
          <ClipboardCheck size={16} aria-hidden="true" />
          Rubric
        </strong>
        <ul className="m-0 grid gap-2 p-0">
          {assignment.rubric.map((item) => (
            <li className="text-muted text-sm leading-normal" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StarterFileViewer({
  files,
  onSelectFile,
  selectedFile,
  selectedFileName
}: Readonly<{
  files: readonly CourseAssignmentFile[];
  onSelectFile: (fileName: string) => void;
  selectedFile: CourseAssignmentFile | null;
  selectedFileName: string | null;
}>) {
  return (
    <section className="bg-dark text-dark-text grid gap-3 rounded-lg border border-[var(--dark-line)] p-3">
      <header className="grid gap-2">
        <strong className="text-brand-soft flex items-center gap-2 text-sm uppercase">
          <FileCode2 size={16} aria-hidden="true" />
          Starter files
        </strong>
        <p className="text-dark-muted m-0 text-sm leading-relaxed">
          These files are completed practice references for reviewing structure, validation, and console flow.
        </p>
      </header>

      <div className="grid gap-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
          {files.map((file) => (
            <button
              className={`border-dark-line min-h-11 min-w-0 cursor-pointer rounded-lg border px-3 py-2 text-left font-mono text-sm transition-colors ${
                file.fileName === selectedFileName
                  ? "bg-[var(--brand-soft)] text-[var(--ink)]"
                  : "bg-dark-panel text-dark-muted hover:text-dark-text"
              }`}
              key={file.fileName}
              onClick={() => onSelectFile(file.fileName)}
              type="button"
            >
              <span className="block truncate">{file.fileName}</span>
            </button>
          ))}
        </div>

        {selectedFile ? (
          <div className="grid min-w-0 gap-3">
            <div className="border-dark-line bg-dark-panel flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0">
                <strong className="font-mono text-[var(--brand-soft)]">{selectedFile.fileName}</strong>
                <p className="text-dark-muted m-0 mt-1 text-sm leading-relaxed">{selectedFile.description}</p>
              </div>
              <a
                className="border-dark-line text-brand-soft inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-extrabold transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
                download={selectedFile.fileName}
                href={toDownloadHref(selectedFile.fileName)}
              >
                <Download size={16} aria-hidden="true" />
                Download
              </a>
            </div>
            <pre className="border-dark-line m-0 max-h-[320px] overflow-auto rounded-lg border bg-[#080b09] p-4 text-sm leading-relaxed text-[#f7f3eb]">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function getSelectedFile(files: readonly CourseAssignmentFile[], selectedFileName: string | null) {
  return files.find((file) => file.fileName === selectedFileName) ?? files[0] ?? null;
}

function toDownloadHref(fileName: string) {
  return `/api/practice/java-review/files/${encodeURIComponent(fileName)}`;
}
