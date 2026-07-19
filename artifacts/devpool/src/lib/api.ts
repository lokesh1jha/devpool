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
  company?: { id: string; name: string } | null;
}

export const auth = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    role?: "CANDIDATE" | "EMPLOYER";
  }) =>
    request<{ token: string; user: AuthUser }>("/auth/register", {
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
    request<void>("/auth/logout", { method: "POST" }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
  publishedAt?: string;
  closedAt?: string;
  createdAt: string;
  company: { id: string; name: string; logoUrl?: string; website?: string };
  _count?: { applications: number };
}

export interface JobsListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const jobs = {
  list: (params?: {
    mine?: boolean;
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<JobsListResponse> => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, String(v)]),
          ),
        ).toString()
      : "";
    return request<JobsListResponse>(`/jobs${qs}`);
  },

  get: (id: string) => request<{ job: Job }>(`/jobs/${id}`),

  create: (body: {
    title: string;
    description: string;
    requirements?: string;
    location?: string;
    type?: Job["type"];
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    status?: "DRAFT" | "PUBLISHED";
  }) =>
    request<{ job: Job }>("/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Partial<Omit<Job, "id" | "createdAt" | "company">>) =>
    request<{ job: Job }>(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    request<void>(`/jobs/${id}`, { method: "DELETE" }),
};

// ─── Applications ─────────────────────────────────────────────────────────────

export interface ApplicationTimeline {
  id: string;
  stage: string;
  note?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  stage: string;
  coverLetter?: string;
  createdAt: string;
  job: { id: string; title: string; company: { id: string; name: string } };
  candidate: { id: string; name: string; email: string };
  timeline: ApplicationTimeline[];
}

export interface ApplicationsListResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const applications = {
  apply: (body: {
    jobId: string;
    coverLetter?: string;
    resumeSnapshot?: string;
  }) =>
    request<{ application: Application }>("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  list: (params?: { page?: number; limit?: number }) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)]),
          ),
        )
      : "";
    return request<ApplicationsListResponse>(`/applications${qs}`);
  },

  get: (id: string) => request<{ application: Application }>(`/applications/${id}`),

  updateStage: (id: string, body: { stage: string; note?: string }) =>
    request<{ application: Application }>(`/applications/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  withdraw: (id: string) =>
    request<{ application: Application }>(`/applications/${id}/withdraw`, {
      method: "POST",
    }),
};
