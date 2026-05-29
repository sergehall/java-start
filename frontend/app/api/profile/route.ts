import { NextResponse } from "next/server";
import { backendJson, getSessionToken } from "@/shared/api/server";
import { profileUpdateSchema, type Profile } from "@/shared/api/contracts";
import { assertSameOriginRequest } from "@/shared/api/request-security";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await backendJson<Profile>("/api/v1/profile", { token });
  if (!result.ok) {
    return NextResponse.json(result.problem, { status: result.status });
  }
  return NextResponse.json(result.data);
}

export async function PUT(request: Request) {
  const sameOriginFailure = assertSameOriginRequest(request);
  if (sameOriginFailure) {
    return sameOriginFailure;
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = profileUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Profile data is invalid." }, { status: 400 });
  }

  const result = await backendJson<Profile>("/api/v1/profile", {
    token,
    method: "PUT",
    body: JSON.stringify(parsed.data)
  });
  if (!result.ok) {
    return NextResponse.json(result.problem, { status: result.status });
  }
  return NextResponse.json(result.data);
}
