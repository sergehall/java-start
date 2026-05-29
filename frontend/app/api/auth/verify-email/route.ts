import { NextResponse } from "next/server";
import { emailVerificationSchema, type UserSummary } from "@/shared/api/contracts";
import { assertSameOriginRequest } from "@/shared/api/request-security";
import { backendJson } from "@/shared/api/server";
import { setSessionCookie } from "@/shared/api/session";

export async function POST(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const parsed = emailVerificationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Verification link is invalid." }, { status: 400 });
  }

  const result = await backendJson<{ token: string; user: UserSummary }>("/api/v1/auth/email/verify", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json(
      { message: result.problem.detail ?? "Email verification failed." },
      { status: result.status }
    );
  }

  const response = NextResponse.json({ user: result.data.user });
  setSessionCookie(response, result.data.token);
  return response;
}
