import { describe, expect, it } from "vitest";
import { isSameOriginRequest } from "@/shared/api/request-security";

describe("request origin guard", () => {
  it("allows same-origin mutating requests", () => {
    const request = new Request("http://localhost:3000/api/auth/logout", {
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000"
      },
      method: "POST"
    });

    expect(isSameOriginRequest(request)).toBe(true);
  });

  it("rejects cross-origin mutating requests", () => {
    const request = new Request("http://localhost:3000/api/auth/logout", {
      headers: {
        host: "localhost:3000",
        origin: "https://attacker.example"
      },
      method: "POST"
    });

    expect(isSameOriginRequest(request)).toBe(false);
  });
});
