# DevPool — Modern Job Board & ATS

A full-stack job board and applicant tracking system built as a pnpm monorepo on Replit.

## Architecture

### Monorepo layout
```
artifacts/
  devpool/       # React + Vite frontend  (port 21233, path /)
  api-server/    # Express backend API    (port 8080,  path /api)
```

### Stack
- **Frontend**: React 18, Vite 7, Tailwind CSS v4, shadcn/ui, TanStack Query, wouter
- **Backend**: Express, Prisma ORM, Neon PostgreSQL
- **Auth**: JWT (`jsonwebtoken`) + `bcryptjs`. Token stored in `localStorage` as `dp_token`, sent as `Authorization: Bearer <token>`.
- **Database**: Prisma schema at `artifacts/api-server/prisma/schema.prisma`, connected to Neon via `NEON_DATABASE_URL` secret.

### API proxy
In dev the Vite server proxies `/api/*` → `http://localhost:8080` (configured in `artifacts/devpool/vite.config.ts`). The frontend's `src/lib/api.ts` always uses relative `/api/…` paths so it works in both dev and production.

## Key files
| File | Purpose |
|---|---|
| `artifacts/devpool/src/lib/api.ts` | Typed fetch client — `auth`, `jobs`, `applications` namespaces |
| `artifacts/devpool/src/contexts/AuthContext.tsx` | JWT auth context — `signIn`, `signUp`, `signOut`, `user` |
| `artifacts/devpool/src/components/auth/ProtectedRoute.tsx` | Route guard with optional `roles` prop |
| `artifacts/api-server/src/routes/auth.ts` | POST /api/auth/register, login, GET /me, POST /logout |
| `artifacts/api-server/src/routes/jobs.ts` | Full CRUD for jobs (employer-scoped writes) |
| `artifacts/api-server/src/routes/applications.ts` | Apply, list (role-filtered), stage update |
| `artifacts/api-server/src/lib/prisma.ts` | Prisma client singleton |
| `artifacts/api-server/src/lib/jwt.ts` | `signToken` / `verifyToken` |
| `artifacts/api-server/src/middlewares/auth.ts` | `authenticate` + `requireRole(...roles)` |

## User roles
- `CANDIDATE` — browse jobs, apply, track applications
- `EMPLOYER` — post jobs, manage listings, view applicants
- `ADMIN` — all employer permissions + admin access

## Secrets required
| Secret | Purpose |
|---|---|
| `NEON_DATABASE_URL` | Neon PostgreSQL connection string |
| `SESSION_SECRET` | JWT signing secret |

## Running locally
Both workflows start automatically:
- **DevPool web**: `pnpm --filter @workspace/devpool run dev`
- **API Server**: `pnpm --filter @workspace/api-server run dev` (runs `prisma generate` → build → start)

## Schema migrations
To push schema changes to the database:
```
cd artifacts/api-server && pnpm exec prisma db push --schema=./prisma/schema.prisma
```

## User preferences
- Keep Supabase completely removed — auth and data use JWT + Prisma + Neon only.
