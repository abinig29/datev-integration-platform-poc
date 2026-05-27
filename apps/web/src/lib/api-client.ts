import { usePlatformStore } from "@/stores/platform-store";
import { ApiError, type ApiErrorBody } from "@/types/api";

const API_BASE = "/api";

function getSandboxHeader(): HeadersInit {
  const sandbox = usePlatformStore.getState().sandboxMode;
  return sandbox ? { "X-DATEV-Sandbox": "true" } : {};
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getSandboxHeader(),
      ...init?.headers,
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | ApiErrorBody) : null;

  if (!response.ok) {
    const body = (data ?? {
      code: "UnknownError",
      message: response.statusText,
    }) as ApiErrorBody;
    throw new ApiError(response.status, body);
  }

  return data as T;
}
