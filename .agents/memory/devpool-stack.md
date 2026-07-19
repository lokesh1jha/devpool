---
name: DevPool stack decisions
description: Key architecture choices for the DevPool job board — auth, database, proxy, port layout, and production-readiness audit findings.
---

## Auth
- JWT via `jsonwebtoken` + `bcryptjs`. Token key in localStorage: `dp_token`. Sent as `Authorization: Bearer <token>`.
- No Supabase, no sessions/cookies. `SESSION_SECRET` secret used for signing.
- `artifacts/api-server/src/lib/jwt.ts` — throws at startup if `SESSION_SECRET` is missing (no fallback).
- `artifacts/api-server/src/middlewares/auth.ts` — `authenticate` middleware + `requireRole(...roles)` factory.
- `AuthContext.signIn` and `signUp` both **return `AuthUser`** so callers can redirect by role immediately.

## Database
- Prisma ORM, schema at `artifacts/api-server/prisma/schema.prisma`.
- Neon PostgreSQL via `NEON_DATABASE_URL` secret.
- To push schema changes: `cd artifacts/api-server && pnpm exec prisma db push --schema=./prisma/schema.prisma`
- `prisma generate` runs automatically as part of the api-server dev script.

## Port layout
- **devpool frontend**: port 21233 (set via `PORT` env, path `/`)
- **api-server**: port 8080 (set via `PORT` env, path `/api`)

## Vite proxy
- `artifacts/devpool/vite.config.ts` proxies `/api/*` → `http://localhost:8080` in dev.
- Frontend `src/lib/api.ts` always uses relative `/api/…` paths — no hardcoded host needed.

## Security fixes applied (production audit)
- JWT: throws at startup if `SESSION_SECRET` not set (no hardcoded fallback).
- Global Express error handler added to `app.ts` (4-param middleware). All async routes re-throw to it.
- `express.json({ limit: "1mb" })` to prevent large-body DoS.
- Public `GET /jobs` hard-codes `status: PUBLISHED` — ignores any `?status=` from public callers.
- `GET /jobs?mine=true` requires EMPLOYER/ADMIN auth — returns that employer's own jobs across all statuses.
- All `:id` params validated as UUID before hitting Prisma (prevents P2023 raw 500 errors).
- `createJobSchema` now includes `status: "DRAFT"|"PUBLISHED"` — PostJobPage's publish choice is respected.
- `salaryMin`/`salaryMax` cross-field Zod refinement: `salaryMax >= salaryMin`.
- `GET /jobs/:id` returns 404 for non-PUBLISHED jobs unless requested by the owning employer/admin.
- Candidate withdraw: `POST /applications/:id/withdraw` endpoint added.
- `GET /applications` is now paginated (page/limit).
- `POST /auth/forgot-password` real endpoint (always returns 200, no user-existence leak).
- Timing-safe login: dummy bcrypt compare even when user not found.
- `name` trimmed + lowercased email on register.
- `DELETE /jobs/:id` and `POST /auth/logout` return 204.
- `EmployerDashboard` uses `jobs.list({ mine: true })` — only sees own jobs.
- SignIn redirects to role-appropriate dashboard (employer → `/dashboard/employer`).
- Both dashboards have error states + retry buttons.
- Job delete and application withdraw both show AlertDialog confirm before executing.

**Why:** Supabase was removed entirely per user request; JWT+Prisma+Neon gives full ownership of auth and data with no third-party auth dependency.
