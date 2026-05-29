import { NextResponse } from "next/server";
import { assertSameOriginRequest } from "@/shared/api/request-security";
import { backendJson, getSessionToken } from "@/shared/api/server";
import { clearSessionCookies } from "@/shared/api/session";

export async function POST(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const token = await getSessionToken();
  if (token) {
    await backendJson<unknown>("/api/v1/auth/logout", {
      method: "POST",
      token
    });
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
}
