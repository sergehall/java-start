import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAMES } from "@/shared/api/session";
import { createContentSecurityPolicy, SECURITY_HEADERS } from "@/shared/security/headers";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/states", "/settings"] as const;

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = createContentSecurityPolicy({
    nonce,
    isDevelopment: process.env.NODE_ENV === "development"
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  requestHeaders.set("x-nonce", nonce);

  const applySecurityHeaders = (response: NextResponse) => {
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
    for (const header of SECURITY_HEADERS) {
      response.headers.set(header.key, header.value);
    }

    return response;
  };

  const next = () =>
    applySecurityHeaders(
      NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
    );

  const redirect = (url: URL) => applySecurityHeaders(NextResponse.redirect(url));

  const { pathname } = request.nextUrl;
  const hasSession = SESSION_COOKIE_NAMES.some((cookieName) => Boolean(request.cookies.get(cookieName)?.value));

  if (isProtectedPath(pathname) && !hasSession) {
    const authUrl = new URL("/", request.url);
    authUrl.searchParams.set("auth", "sign-in");
    authUrl.searchParams.set("next", pathname);
    return redirect(authUrl);
  }

  return next();
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
  ]
};
