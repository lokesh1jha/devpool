import { Router, type Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";
import { verifyToken } from "../lib/jwt.js";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const uuidParam = z.string().uuid("Invalid ID format");

const createJobSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(50_000),
    requirements: z.string().max(50_000).optional(),
    location: z.string().max(200).optional(),
    type: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
      .default("FULL_TIME"),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    salaryCurrency: z.string().length(3).default("USD"),
    // Employer can choose to publish immediately or save as draft
    status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  })
  .refine(
    (d) =>
      d.salaryMin === undefined ||
      d.salaryMax === undefined ||
      d.salaryMax >= d.salaryMin,
    { message: "salaryMax must be ≥ salaryMin", path: ["salaryMax"] },
  );

const updateJobSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(50_000).optional(),
    requirements: z.string().max(50_000).optional(),
    location: z.string().max(200).optional(),
    type: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
      .optional(),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    salaryCurrency: z.string().length(3).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).optional(),
  })
  .refine(
    (d) =>
      d.salaryMin === undefined ||
      d.salaryMax === undefined ||
      d.salaryMax >= d.salaryMin,
    { message: "salaryMax must be ≥ salaryMin", path: ["salaryMax"] },
  );

const listJobsSchema = z.object({
  /** When true (EMPLOYER/ADMIN only): return the caller's own jobs across all statuses */
  mine: z
    .string()
    .transform((v) => v === "true" || v === "1")
    .optional()
    .default("false"),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
    .optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── GET /jobs ────────────────────────────────────────────────────────────────
// Public (status forced to PUBLISHED).
// With ?mine=true + EMPLOYER auth: returns caller's own jobs across all statuses.

router.get("/", async (req: AuthRequest, res: Response) => {
  // Opportunistically attach user if a valid token is present (non-blocking)
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // Invalid token — treat as unauthenticated for this public route
    }
  }

  const parsed = listJobsSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { mine, status, type, search, page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  try {
    // ── mine=true branch: employer sees only their own jobs ──────────────────
    if (mine) {
      if (!req.user || !["EMPLOYER", "ADMIN"].includes(req.user.role)) {
        res.status(403).json({ error: "Only employers can use mine=true" });
        return;
      }

      const company = await prisma.company.findUnique({
        where: { userId: req.user.userId },
      });
      if (!company) {
        res.status(404).json({ error: "Company profile not found" });
        return;
      }

      const baseWhere = {
        companyId: company.id,
        deletedAt: null as null,
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      };

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where: baseWhere,
          include: {
            company: { select: { id: true, name: true, logoUrl: true } },
            _count: { select: { applications: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.job.count({ where: baseWhere }),
      ]);

      res.json({ jobs, total, page, limit, pages: Math.ceil(total / limit) });
      return;
    }

    // ── Public branch: always force PUBLISHED ────────────────────────────────
    const publicWhere = {
      deletedAt: null as null,
      status: "PUBLISHED" as const,
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                company: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: publicWhere,
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.job.count({ where: publicWhere }),
    ]);

    res.json({ jobs, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    throw err;
  }
});

// ─── GET /jobs/:id ────────────────────────────────────────────────────────────
// Public for PUBLISHED jobs. Draft/closed jobs require the owning employer.

router.get("/:id", async (req: AuthRequest, res: Response) => {
  const idResult = uuidParam.safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).json({ error: "Invalid job ID" });
    return;
  }

  // Opportunistically attach user
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {}
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: idResult.data, deletedAt: null },
      include: {
        company: {
          select: { id: true, name: true, logoUrl: true, website: true },
        },
      },
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    // Non-published jobs are only visible to the owning employer or admin
    if (job.status !== "PUBLISHED") {
      if (!req.user) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      if (req.user.role !== "ADMIN") {
        const company = await prisma.company.findUnique({
          where: { userId: req.user.userId },
        });
        if (!company || company.id !== job.companyId) {
          res.status(404).json({ error: "Job not found" });
          return;
        }
      }
    }

    res.json({ job });
  } catch (err) {
    throw err;
  }
});

// ─── POST /jobs ───────────────────────────────────────────────────────────────

router.post(
  "/",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    try {
      const company = await prisma.company.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!company) {
        res.status(400).json({ error: "Company profile not found. Please complete your employer profile." });
        return;
      }

      const { status, ...jobData } = parsed.data;

      const job = await prisma.job.create({
        data: {
          ...jobData,
          companyId: company.id,
          status,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
        include: { company: { select: { id: true, name: true } } },
      });

      res.status(201).json({ job });
    } catch (err) {
      throw err;
    }
  },
);

// ─── PATCH /jobs/:id ──────────────────────────────────────────────────────────

router.patch(
  "/:id",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const idResult = uuidParam.safeParse(req.params.id);
    if (!idResult.success) {
      res.status(400).json({ error: "Invalid job ID" });
      return;
    }

    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    try {
      const company = await prisma.company.findUnique({
        where: { userId: req.user!.userId },
      });

      const job = await prisma.job.findUnique({
        where: { id: idResult.data },
      });
      if (!job || job.deletedAt) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      if (req.user!.role !== "ADMIN" && job.companyId !== company?.id) {
        res.status(403).json({ error: "Not your job" });
        return;
      }

      const data = { ...parsed.data } as Record<string, unknown>;
      if (parsed.data.status === "PUBLISHED" && job.status !== "PUBLISHED") {
        data.publishedAt = new Date();
      }
      if (parsed.data.status === "CLOSED" && job.status !== "CLOSED") {
        data.closedAt = new Date();
      }

      const updated = await prisma.job.update({
        where: { id: idResult.data },
        data,
        include: { company: { select: { id: true, name: true } } },
      });

      res.json({ job: updated });
    } catch (err) {
      throw err;
    }
  },
);

// ─── DELETE /jobs/:id (soft delete) ──────────────────────────────────────────

router.delete(
  "/:id",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const idResult = uuidParam.safeParse(req.params.id);
    if (!idResult.success) {
      res.status(400).json({ error: "Invalid job ID" });
      return;
    }

    try {
      const company = await prisma.company.findUnique({
        where: { userId: req.user!.userId },
      });

      const job = await prisma.job.findUnique({ where: { id: idResult.data } });
      if (!job || job.deletedAt) {
        res.status(404).json({ error: "Job not found" });
        return;
      }
      if (req.user!.role !== "ADMIN" && job.companyId !== company?.id) {
        res.status(403).json({ error: "Not your job" });
        return;
      }

      await prisma.job.update({
        where: { id: idResult.data },
        data: { deletedAt: new Date() },
      });

      res.status(204).end();
    } catch (err) {
      throw err;
    }
  },
);

export default router;
