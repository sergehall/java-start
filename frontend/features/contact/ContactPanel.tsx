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
    <section className="contact-layout">
      <div className="contact-intro">
        <p className="eyebrow">Protected contacts</p>
        <h1>Reach the project owner without feeding scraper-friendly markup.</h1>
        <p className="lead">
          Phone and email are assembled only after a user action. GitHub stays open because the profile is already
          public and useful for the learning workflow.
        </p>
      </div>

      <div className="contact-grid" aria-label="Contact channels">
        <article className="contact-card">
          <span className="contact-icon" aria-hidden="true">
            <Phone size={22} />
          </span>
          <div>
            <span className="contact-label">Phone</span>
            {revealed.phone ? (
              <a className="contact-value" href={buildPhoneHref()}>
                {buildReadablePhoneNumber()}
              </a>
            ) : (
              <button className="contact-reveal-button" onClick={() => reveal("phone")} type="button">
                Reveal phone
              </button>
            )}
          </div>
        </article>

        <article className="contact-card">
          <span className="contact-icon" aria-hidden="true">
            <Mail size={22} />
          </span>
          <div>
            <span className="contact-label">Email</span>
            {revealed.email ? (
              <a className="contact-value" href={buildEmailHref()}>
                {buildEmailAddress()}
              </a>
            ) : (
              <button className="contact-reveal-button" onClick={() => reveal("email")} type="button">
                Reveal email
              </button>
            )}
          </div>
        </article>

        <article className="contact-card contact-card-accent">
          <span className="contact-icon" aria-hidden="true">
            <Github size={22} />
          </span>
          <div>
            <span className="contact-label">GitHub</span>
            <a
              className="contact-value contact-value-row"
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

      <aside className="contact-note">
        <ShieldCheck size={22} />
        <p>
          This is not a replacement for production anti-abuse controls, but it keeps the first page load cleaner for a
          learning project.
        </p>
      </aside>
    </section>
  );
}
