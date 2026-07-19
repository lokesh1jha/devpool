---
name: DevPool stack decisions
description: Key architecture choices for the DevPool job board — auth, database, proxy, port layout.
---

## Auth
- JWT via `jsonwebtoken` + `bcryptjs`. Token key in localStorage: `dp_token`. Sent as `Authorization: Bearer <token>`.
- No Supabase, no sessions/cookies. `SESSION_SECRET` secret used for signing.
- `artifacts/api-server/src/lib/jwt.ts` — `signToken` / `verifyToken`.
- `artifacts/api-server/src/middlewares/auth.ts` — `authenticate` middleware + `requireRole(...roles)` factory.

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

**Why:** Supabase was removed entirely per user request; JWT+Prisma+Neon gives full ownership of auth and data with no third-party auth dependency.
