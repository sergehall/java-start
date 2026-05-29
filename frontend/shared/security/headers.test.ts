import { describe, expect, it } from "vitest";
import { createContentSecurityPolicy, SECURITY_HEADERS } from "@/shared/security/headers";

describe("security headers", () => {
  it("creates a production CSP without unsafe script execution", () => {
    const csp = createContentSecurityPolicy({ nonce: "test-nonce", isDevelopment: false });

    expect(csp).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it("sets nosniff for content type protection", () => {
    expect(SECURITY_HEADERS).toContainEqual({
      key: "X-Content-Type-Options",
      value: "nosniff"
    });
  });
});
