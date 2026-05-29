import { Github } from "lucide-react";
import { authConfig } from "@/shared/config/auth";

export function SocialAuthActions() {
  if (!authConfig.githubOAuthUrl) {
    return (
      <button
        aria-disabled="true"
        className="bg-panel text-ink border-line inline-flex min-h-[52px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border px-5 font-extrabold opacity-60"
        title="GitHub OAuth is not connected to the Spring Boot backend yet."
        type="button"
      >
        <Github size={20} />
        Continue with GitHub
      </button>
    );
  }

  return (
    <a
      className="bg-panel text-ink border-line inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full border px-5 font-extrabold transition hover:-translate-y-px hover:border-[var(--brand-ring)]"
      href={authConfig.githubOAuthUrl}
    >
      <Github size={20} />
      Continue with GitHub
    </a>
  );
}
