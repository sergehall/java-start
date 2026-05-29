import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/shared/api/session";
import type { ApiProblem, LearningStateOption, Profile, UserSummary } from "@/shared/api/contracts";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

type BackendResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; problem: ApiProblem; status: number };

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function backendJson<T>(
  path: string,
  init: RequestInit & { token?: string } = {}
): Promise<BackendResult<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => ({}))) as unknown;
  if (!response.ok) {
    return { ok: false, problem: payload as ApiProblem, status: response.status };
  }
  return { ok: true, data: payload as T, status: response.status };
}

export async function getCurrentUser() {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }
  const result = await backendJson<UserSummary>("/api/v1/auth/me", { token });
  return result.ok ? result.data : null;
}

export async function getProfile() {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }
  const result = await backendJson<Profile>("/api/v1/profile", { token });
  return result.ok ? result.data : null;
}

export async function getLearningStates() {
  const result = await backendJson<LearningStateOption[]>("/api/v1/options/learning-states");
  return result.ok ? result.data : [];
}
