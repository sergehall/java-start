import { describe, expect, it } from "vitest";
import { completionTone, stateAccent } from "@/shared/lib/profile";

describe("profile helpers", () => {
  it("maps completion score to a user-facing tone", () => {
    expect(completionTone(100)).toBe("Ready to ship");
    expect(completionTone(70)).toBe("Strong start");
    expect(completionTone(45)).toBe("Needs focus");
    expect(completionTone(10)).toBe("Fresh profile");
  });

  it("maps learning states to compact accents", () => {
    expect(stateAccent("BUILDING")).toBe("Build");
    expect(stateAccent("STUCK")).toBe("Unblock");
  });
});
