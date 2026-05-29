import { NextResponse } from "next/server";
import { signUpSchema, type RegistrationResponse } from "@/shared/api/contracts";
import { backendJson } from "@/shared/api/server";
import { assertSameOriginRequest } from "@/shared/api/request-security";

export async function POST(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const parsed = signUpSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Check username, email, and password." }, { status: 400 });
  }

  const result = await backendJson<RegistrationResponse>("/api/v1/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json({ message: result.problem.detail ?? "Sign up failed." }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
