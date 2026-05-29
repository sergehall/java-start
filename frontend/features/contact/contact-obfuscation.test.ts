import { describe, expect, it } from "vitest";
import {
  buildEmailAddress,
  buildEmailHref,
  buildObfuscatedEmailLabel,
  buildPhoneHref,
  buildPhoneNumber,
  buildReadablePhoneNumber
} from "@/features/contact/contact-obfuscation";

describe("contact obfuscation", () => {
  it("assembles the contact channels from non-contiguous parts", () => {
    expect(buildPhoneNumber()).toBe(["+", "1", "347", "210", "2000"].join(""));
    expect(buildReadablePhoneNumber()).toBe(["+1", "347", "210", "2000"].join(" "));
    expect(buildPhoneHref()).toBe(["tel:+", "1", "347", "210", "2000"].join(""));

    expect(buildEmailAddress()).toBe([["serge", "hall", "dev"].join("."), ["gmail", "com"].join(".")].join("@"));
    expect(buildEmailHref()).toBe(
      ["mailto:", ["serge", "hall", "dev"].join("."), "@", ["gmail", "com"].join(".")].join("")
    );
    expect(buildObfuscatedEmailLabel()).toBe([["serge", "hall", "dev"].join("."), " at gmail dot com"].join(""));
  });
});
