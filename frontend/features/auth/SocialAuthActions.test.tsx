import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

async function renderSocialAuthActions() {
  const { SocialAuthActions } = await import("@/features/auth/SocialAuthActions");
  return render(<SocialAuthActions />);
}

describe("SocialAuthActions", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("renders only the GitHub social option when OAuth is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_OAUTH_URL", "");
    await renderSocialAuthActions();

    expect(screen.queryByText(/continue with google/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with github/i })).toHaveAttribute("aria-disabled", "true");
  });

  it("uses the configured GitHub OAuth URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_GITHUB_OAUTH_URL", "http://localhost:8080/api/v1/auth/oauth/github/start");
    await renderSocialAuthActions();

    expect(screen.getByRole("link", { name: /continue with github/i })).toHaveAttribute(
      "href",
      "http://localhost:8080/api/v1/auth/oauth/github/start"
    );
  });
});
