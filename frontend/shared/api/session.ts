import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "java_start_session";
export const LEGACY_SESSION_COOKIE = "java_start_token";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const SESSION_COOKIE_NAMES = [SESSION_COOKIE, LEGACY_SESSION_COOKIE] as const;

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

export function expiredCookieOptions() {
  return {
    ...cookieOptions(),
    maxAge: 0,
    expires: new Date(0)
  };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, cookieOptions());
  response.cookies.set(LEGACY_SESSION_COOKIE, "", expiredCookieOptions());
}

export function clearSessionCookies(response: NextResponse) {
  for (const cookieName of SESSION_COOKIE_NAMES) {
    response.cookies.set(cookieName, "", expiredCookieOptions());
  }
}
