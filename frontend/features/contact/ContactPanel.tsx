"use client";

import { ExternalLink, Github, Mail, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  buildEmailAddress,
  buildEmailHref,
  buildPhoneHref,
  buildReadablePhoneNumber,
  contactParts
} from "@/features/contact/contact-obfuscation";

type RevealState = "email" | "phone";

export function ContactPanel() {
  const [revealed, setRevealed] = useState<Record<RevealState, boolean>>({
    email: false,
    phone: false
  });

  function reveal(kind: RevealState) {
    setRevealed((current) => ({ ...current, [kind]: true }));
  }

  return (
    <section className="mx-auto grid w-full max-w-[1180px] grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] gap-6 max-lg:grid-cols-1">
      <div className="grid content-center">
        <p className="text-brand mb-3 text-xs font-extrabold uppercase">Protected contacts</p>
        <h1 className="m-0 text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-normal">
          Reach the project owner without feeding scraper-friendly markup.
        </h1>
        <p className="text-muted max-w-[660px] text-lg leading-relaxed">
          Phone and email are assembled only after a user action. GitHub stays open because the profile is already
          public and useful for the learning workflow.
        </p>
      </div>

      <div className="grid content-center gap-3.5" aria-label="Contact channels">
        <article className="border-line grid min-h-[104px] grid-cols-[48px_minmax(0,1fr)] items-center gap-4 rounded-lg border bg-[rgba(255,250,241,0.92)] p-5 shadow-[var(--shadow-card)]">
          <span
            className="border-line text-brand grid size-12 place-items-center rounded-lg border bg-[#fffdf8]"
            aria-hidden="true"
          >
            <Phone size={22} />
          </span>
          <div>
            <span className="text-muted mb-2 block text-xs font-black uppercase">Phone</span>
            {revealed.phone ? (
              <a className="text-ink hover:text-brand-strong text-xl font-black break-words" href={buildPhoneHref()}>
                {buildReadablePhoneNumber()}
              </a>
            ) : (
              <button
                className="text-ink hover:text-brand-strong cursor-pointer border-0 bg-transparent p-0 text-left text-xl font-black"
                onClick={() => reveal("phone")}
                type="button"
              >
                Reveal phone
              </button>
            )}
          </div>
        </article>

        <article className="border-line grid min-h-[104px] grid-cols-[48px_minmax(0,1fr)] items-center gap-4 rounded-lg border bg-[rgba(255,250,241,0.92)] p-5 shadow-[var(--shadow-card)]">
          <span
            className="border-line text-brand grid size-12 place-items-center rounded-lg border bg-[#fffdf8]"
            aria-hidden="true"
          >
            <Mail size={22} />
          </span>
          <div>
            <span className="text-muted mb-2 block text-xs font-black uppercase">Email</span>
            {revealed.email ? (
              <a className="text-ink hover:text-brand-strong text-xl font-black break-words" href={buildEmailHref()}>
                {buildEmailAddress()}
              </a>
            ) : (
              <button
                className="text-ink hover:text-brand-strong cursor-pointer border-0 bg-transparent p-0 text-left text-xl font-black"
                onClick={() => reveal("email")}
                type="button"
              >
                Reveal email
              </button>
            )}
          </div>
        </article>

        <article className="grid min-h-[104px] grid-cols-[48px_minmax(0,1fr)] items-center gap-4 rounded-lg border border-[var(--brand-ring)] bg-[linear-gradient(135deg,var(--brand-wash),rgba(255,250,241,0.92)_58%)] p-5 shadow-[var(--shadow-card)]">
          <span
            className="border-line text-brand grid size-12 place-items-center rounded-lg border bg-[#fffdf8]"
            aria-hidden="true"
          >
            <Github size={22} />
          </span>
          <div>
            <span className="text-muted mb-2 block text-xs font-black uppercase">GitHub</span>
            <a
              className="text-ink hover:text-brand-strong inline-flex items-center gap-2 text-xl font-black break-words"
              href={contactParts.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              SergeHall
              <ExternalLink size={16} />
            </a>
          </div>
        </article>
      </div>

      <aside className="border-line text-muted col-start-2 flex items-center gap-3 rounded-lg border bg-[rgba(255,250,241,0.92)] px-[18px] py-4 shadow-[var(--shadow-card)] max-lg:col-auto">
        <ShieldCheck className="text-mint-strong shrink-0" size={22} />
        <p className="m-0">
          This is not a replacement for production anti-abuse controls, but it keeps the first page load cleaner for a
          learning project.
        </p>
      </aside>
    </section>
  );
}
