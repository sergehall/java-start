export const contactParts = {
  emailDomain: ["gmail", "com"],
  emailLocal: ["serge", "hall", "dev"],
  githubUrl: "https://github.com/SergeHall",
  phone: ["+", "1", "347", "210", "2000"]
} as const;

export function buildEmailAddress() {
  return `${contactParts.emailLocal.join(".")}@${contactParts.emailDomain.join(".")}`;
}

export function buildPhoneNumber() {
  return contactParts.phone.join("");
}

export function buildReadablePhoneNumber() {
  const [, country, area, prefix, line] = contactParts.phone;
  return `+${country} ${area} ${prefix} ${line}`;
}

export function buildEmailHref() {
  return `mailto:${buildEmailAddress()}`;
}

export function buildPhoneHref() {
  return `tel:${buildPhoneNumber()}`;
}

export function buildObfuscatedEmailLabel() {
  return `${contactParts.emailLocal.join(".")} at ${contactParts.emailDomain.join(" dot ")}`;
}
