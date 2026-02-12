/**
 * Base API client: authenticated fetch with JSON and error handling.
 * Use getAuthToken() from your auth provider (e.g. Amplify Auth) when available.
 */
export type ApiError = {
  code: string;
  message: string;
  status: number;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export type GetAuthToken = () => Promise<string | null>;

let authTokenProvider: GetAuthToken | null = null;

export function setAuthTokenProvider(provider: GetAuthToken | null): void {
  authTokenProvider = provider;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { baseUrl?: string } = {}
): Promise<T> {
  const { baseUrl: overrideBase, ...init } = options;
  const base = overrideBase ?? (await import("./config")).apiConfig.baseUrl;
  if (!base) {
    throw new ApiClientError("API base URL not configured", 0, "NO_BASE_URL");
  }
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers as HeadersInit);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const token = authTokenProvider ? await authTokenProvider() : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });
  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const errBody = typeof body === "object" && body && "message" in body ? body : { message: res.statusText };
    throw new ApiClientError(
      (errBody as { message?: string }).message ?? res.statusText,
      res.status,
      (errBody as { code?: string }).code,
      body
    );
  }

  return body as T;
}

export async function apiGet<T>(path: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined });
}

export async function apiPut<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined });
}

export async function apiPatch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined });
}

export async function apiDelete<T>(path: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(path, { ...options, method: "DELETE" });
}
