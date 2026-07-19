// Central API client — all server calls go through here.
// Token is stored in localStorage and sent as Authorization: Bearer <token>.

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

function getToken(): string | null {
  return localStorage.getItem("dp_token");
}

export function saveToken(token: string): void {
  localStorage.setItem("dp_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("dp_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? "Request failed", data);
  }

  return data as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "EMPLOYER" | "ADMIN";
  emailVerified: boolean;
  candidateProfile?: unknown;
  company?: unknown;
}

export const auth = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    role?: "CANDIDATE" | "EMPLOYER";
  }) => request<{ token: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => request<{ user: AuthUser }>("/auth/me"),

  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  company: { id: string; name: string; logoUrl?: string };
  _count?: { applications: number };
}

export const jobs = {
  list: (params?: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const qs = params
      ? "?" + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)]),
          ),
        ).toString()
      : "";
    return request<{
      jobs: Job[];
      total: number;
      page: number;
      pages: number;
    }>(`/jobs${qs}`);
  },

  get: (id: string) => request<{ job: Job }>(`/jobs/${id}`),

  create: (body: Partial<Job>) =>
    request<{ job: Job }>("/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Partial<Job>) =>
    request<{ job: Job }>(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/jobs/${id}`, { method: "DELETE" }),
};

// ─── Applications ─────────────────────────────────────────────────────────────

export const applications = {
  apply: (body: {
    jobId: string;
    coverLetter?: string;
    resumeSnapshot?: string;
  }) =>
    request<{ application: unknown }>("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  list: () => request<{ applications: unknown[] }>("/applications"),

  get: (id: string) => request<{ application: unknown }>(`/applications/${id}`),

  updateStage: (
    id: string,
    body: { stage: string; note?: string },
  ) =>
    request<{ application: unknown }>(`/applications/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
