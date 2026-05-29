import type { Profile, ProfileUpdatePayload, RegisterPayload, UserSummary } from "@/shared/api/contracts";
import type { LoginPayload } from "@/shared/api/contracts";

type ClientResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

async function clientJson<T>(path: string, init?: RequestInit): Promise<ClientResult<T>> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });
  const payload = (await response.json().catch(() => ({}))) as { message?: string; detail?: string };
  if (!response.ok) {
    return { ok: false, message: payload.message ?? payload.detail ?? "Something went wrong." };
  }
  return { ok: true, data: payload as T };
}

export function login(payload: LoginPayload) {
  return clientJson<{ user: UserSummary }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload: RegisterPayload) {
  return clientJson<{ user: UserSummary }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return clientJson<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function updateProfile(payload: ProfileUpdatePayload) {
  return clientJson<Profile>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
