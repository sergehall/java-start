import { NextResponse } from "next/server";
import { loginSchema, type UserSummary } from "@/shared/api/contracts";
import { backendJson } from "@/shared/api/server";
import { SESSION_COOKIE, cookieOptions } from "@/shared/api/session";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Check email and password." }, { status: 400 });
  }

  const result = await backendJson<{ token: string; user: UserSummary }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json({ message: result.problem.detail ?? "Login failed." }, { status: result.status });
  }

  const response = NextResponse.json({ user: result.data.user });
  response.cookies.set(SESSION_COOKIE, result.data.token, cookieOptions());
  return response;
}
