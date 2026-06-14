"use client";

import { Keyboard, Play, RotateCcw, TerminalSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { javaLabSnippets } from "@/features/home/content";
import { cn } from "@/shared/lib/cn";

const TYPE_INTERVAL_MS = 16;

export function HomeJavaLab() {
  const [activeSnippetId, setActiveSnippetId] = useState(javaLabSnippets[0].id);
  const [visibleLength, setVisibleLength] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const [typingRunId, setTypingRunId] = useState(0);

  const activeSnippet = useMemo(
    () => javaLabSnippets.find((snippet) => snippet.id === activeSnippetId) ?? javaLabSnippets[0],
    [activeSnippetId]
  );
  const visibleCode = activeSnippet.code.slice(0, visibleLength);
  const isComplete = visibleLength >= activeSnippet.code.length;
  const progress = Math.round((visibleLength / activeSnippet.code.length) * 100);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleLength((currentLength) => {
        if (currentLength >= activeSnippet.code.length) {
          window.clearInterval(interval);
          return currentLength;
        }

        return currentLength + 1;
      });
    }, TYPE_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeSnippet, typingRunId]);

  function selectSnippet(snippetId: string) {
    setVisibleLength(0);
    setHasRun(false);
    setActiveSnippetId(snippetId);
    setTypingRunId((currentRunId) => currentRunId + 1);
  }

  function runSnippet() {
    setVisibleLength(activeSnippet.code.length);
    setHasRun(true);
  }

  function rewriteSnippet() {
    setVisibleLength(0);
    setHasRun(false);
    setTypingRunId((currentRunId) => currentRunId + 1);
  }

  return (
    <section
      className="border-line bg-dark text-dark-text grid gap-4 rounded-lg border p-4 shadow-[var(--shadow-card)] sm:p-5"
      aria-label="Interactive Java code lab"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-brand-soft m-0 font-mono text-xs font-black uppercase">Java code lab</p>
          <h2 className="m-0 mt-2 text-[clamp(1.8rem,4vw,2.7rem)] leading-none tracking-normal">
            {activeSnippet.title}
          </h2>
        </div>
        <div className="border-dark-line bg-dark-panel flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-black text-[var(--dark-muted)]">
          <Keyboard size={16} aria-hidden="true" />
          <span>{progress}% typed</span>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1" aria-label="Java lab scenarios">
        {javaLabSnippets.map((snippet) => (
          <button
            aria-pressed={snippet.id === activeSnippet.id}
            className={cn(
              "border-dark-line min-h-11 cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-extrabold text-[var(--dark-muted)] transition-colors hover:border-[var(--brand-ring)] hover:text-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]",
              snippet.id === activeSnippet.id && "text-brand-soft border-[var(--brand-ring)] bg-[var(--dark-panel)]"
            )}
            key={snippet.id}
            onClick={() => selectSnippet(snippet.id)}
            type="button"
          >
            {snippet.label}
          </button>
        ))}
      </div>

      <div className="border-dark-line overflow-hidden rounded-lg border bg-[#080b09]">
        <div className="border-dark-line flex items-center justify-between gap-3 border-b bg-[rgba(255,250,241,0.04)] px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#e36a52]" />
            <span className="size-2.5 rounded-full bg-[#d6a532]" />
            <span className="size-2.5 rounded-full bg-[#55a98e]" />
          </div>
          <span className="font-mono text-xs font-black text-[var(--dark-muted)]">main()</span>
        </div>
        <pre className="m-0 min-h-[300px] overflow-auto p-4 text-sm leading-relaxed text-[#f7f3eb] max-sm:min-h-[250px]">
          <code>
            {visibleCode}
            {!isComplete ? <span className="ml-1 inline-block h-4 w-2 bg-[var(--brand-soft)] align-middle" /> : null}
          </code>
        </pre>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 max-sm:grid-cols-1">
        <section className="border-dark-line bg-dark-panel grid min-h-[132px] gap-2 rounded-lg border p-4">
          <strong className="text-brand-soft flex items-center gap-2 text-sm uppercase">
            <TerminalSquare size={16} aria-hidden="true" />
            Terminal
          </strong>
          <pre className="m-0 font-mono text-sm leading-relaxed whitespace-pre-wrap text-[var(--dark-muted)]">
            {hasRun ? activeSnippet.output : "Waiting for javac and java..."}
          </pre>
          <p className="text-dark-muted m-0 text-sm leading-relaxed">{activeSnippet.lesson}</p>
        </section>

        <div className="grid gap-2 max-sm:grid-cols-2">
          <button
            className="bg-brand text-brand-contrast inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-extrabold transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
            onClick={runSnippet}
            type="button"
          >
            <Play size={16} aria-hidden="true" />
            Run
          </button>
          <button
            className="border-dark-line text-dark-text inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 text-sm font-extrabold transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-ring)]"
            onClick={rewriteSnippet}
            type="button"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Rewrite
          </button>
        </div>
      </div>
    </section>
  );
}
