import { NextResponse } from "next/server";
import type { UserSummary } from "@/shared/api/contracts";
import { backendJson } from "@/shared/api/server";
import { setSessionCookie } from "@/shared/api/session";

type OAuthResponse = {
  token: string;
  user: UserSummary;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) {
    return redirectToAuthModal(request.url, "github_oauth_failed");
  }

  const result = await backendJson<OAuthResponse>("/api/v1/auth/oauth/github/complete", {
    method: "POST",
    body: JSON.stringify({ code, state })
  });

  if (!result.ok) {
    return redirectToAuthModal(request.url, "github_oauth_failed");
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  setSessionCookie(response, result.data.token);
  return response;
}

function redirectToAuthModal(requestUrl: string, reason: string) {
  const authUrl = new URL("/", requestUrl);
  authUrl.searchParams.set("auth", "sign-in");
  authUrl.searchParams.set("error", reason);
  return NextResponse.redirect(authUrl);
}
