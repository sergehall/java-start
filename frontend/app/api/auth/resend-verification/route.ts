import { NextResponse } from "next/server";
import { resendVerificationSchema, type RegistrationResponse } from "@/shared/api/contracts";
import { assertSameOriginRequest } from "@/shared/api/request-security";
import { backendJson } from "@/shared/api/server";

export async function POST(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const parsed = resendVerificationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Enter a valid email." }, { status: 400 });
  }

  const result = await backendJson<RegistrationResponse>("/api/v1/auth/email/resend", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json(
      { message: result.problem.detail ?? "Could not queue verification email." },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data);
}
