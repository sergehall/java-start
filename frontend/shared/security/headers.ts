type CspOptions = {
  nonce: string;
  isDevelopment: boolean;
};

export const SECURITY_HEADERS = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"
  }
] as const;

export function createContentSecurityPolicy({ nonce, isDevelopment }: CspOptions) {
  const scriptSources = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  if (isDevelopment) {
    scriptSources.push("'unsafe-eval'");
  }

  const styleSources = ["'self'", isDevelopment ? "'unsafe-inline'" : `'nonce-${nonce}'`];
  const connectSources = isDevelopment
    ? ["'self'", "http://localhost:*", "http://127.0.0.1:*", "ws://localhost:*", "ws://127.0.0.1:*"]
    : ["'self'"];

  const directives: Array<[string, string[]]> = [
    ["default-src", ["'self'"]],
    ["script-src", scriptSources],
    ["style-src", styleSources],
    ["img-src", ["'self'", "blob:", "data:"]],
    ["font-src", ["'self'"]],
    ["connect-src", connectSources],
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["frame-src", ["'none'"]],
    ["frame-ancestors", ["'none'"]],
    ["manifest-src", ["'self'"]]
  ];

  return directives.map(([directive, values]) => `${directive} ${values.join(" ")}`).join("; ");
}
