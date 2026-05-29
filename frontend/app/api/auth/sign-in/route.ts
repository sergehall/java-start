import { NextResponse } from "next/server";
import { signInSchema, type UserSummary } from "@/shared/api/contracts";
import { backendJson } from "@/shared/api/server";
import { assertSameOriginRequest } from "@/shared/api/request-security";
import { setSessionCookie } from "@/shared/api/session";

export async function POST(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const parsed = signInSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Check email and password." }, { status: 400 });
  }

  const result = await backendJson<{ token: string; user: UserSummary }>("/api/v1/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json({ message: result.problem.detail ?? "Sign in failed." }, { status: result.status });
  }

  const response = NextResponse.json({ user: result.data.user });
  setSessionCookie(response, result.data.token);
  return response;
}
