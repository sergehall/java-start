import { NextResponse } from "next/server";
import { backendJson, getSessionToken } from "@/shared/api/server";
import type { UserSummary } from "@/shared/api/contracts";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await backendJson<UserSummary>("/api/v1/auth/me", { token });
  if (!result.ok) {
    return NextResponse.json(result.problem, { status: result.status });
  }
  return NextResponse.json(result.data);
}
