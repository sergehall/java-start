import { NextResponse } from "next/server";
import { registerSchema, type RegistrationResponse } from "@/shared/api/contracts";
import { backendJson } from "@/shared/api/server";
import { assertSameOriginRequest } from "@/shared/api/request-security";

export async function POST(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Fill in username, email, and a stronger password." }, { status: 400 });
  }

  const result = await backendJson<RegistrationResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json({ message: result.problem.detail ?? "Registration failed." }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
