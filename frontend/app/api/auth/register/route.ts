import { NextResponse } from "next/server";
import { registerSchema, type UserSummary } from "@/shared/api/contracts";
import { backendJson } from "@/shared/api/server";
import { SESSION_COOKIE, cookieOptions } from "@/shared/api/session";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Fill in name, email, and a stronger password." }, { status: 400 });
  }

  const result = await backendJson<{ token: string; user: UserSummary }>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json({ message: result.problem.detail ?? "Registration failed." }, { status: result.status });
  }

  const response = NextResponse.json({ user: result.data.user });
  response.cookies.set(SESSION_COOKIE, result.data.token, cookieOptions());
  return response;
}
