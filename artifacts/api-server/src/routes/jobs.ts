import { Router, type Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requirements: z.string().optional(),
  location: z.string().optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
    .default("FULL_TIME"),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  salaryCurrency: z.string().default("USD"),
});

const updateJobSchema = createJobSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).optional(),
});

const listJobsSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
    .optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── GET /jobs (public) ───────────────────────────────────────────────────────

router.get("/", async (req: AuthRequest, res: Response) => {
  const parsed = listJobsSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { status, type, search, page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(status ? { status } : { status: "PUBLISHED" as const }),
    ...(type ? { type } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
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
      where,
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  res.json({ jobs, total, page, limit, pages: Math.ceil(total / limit) });
});

// ─── GET /jobs/:id (public) ───────────────────────────────────────────────────

router.get("/:id", async (req: AuthRequest, res: Response) => {
  const job = await prisma.job.findUnique({
    where: { id: req.params.id, deletedAt: null },
    include: {
      company: { select: { id: true, name: true, logoUrl: true, website: true } },
    },
  });

  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  res.json({ job });
});

// ─── POST /jobs (employer only) ───────────────────────────────────────────────

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

    const company = await prisma.company.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!company) {
      res.status(400).json({ error: "Company profile not found" });
      return;
    }

    const job = await prisma.job.create({
      data: { ...parsed.data, companyId: company.id },
      include: { company: { select: { id: true, name: true } } },
    });

    res.status(201).json({ job });
  },
);

// ─── PATCH /jobs/:id (employer only, own jobs) ────────────────────────────────

router.patch(
  "/:id",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const company = await prisma.company.findUnique({
      where: { userId: req.user!.userId },
    });

    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
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
      where: { id: req.params.id },
      data,
      include: { company: { select: { id: true, name: true } } },
    });

    res.json({ job: updated });
  },
);

// ─── DELETE /jobs/:id (employer only, soft delete) ────────────────────────────

router.delete(
  "/:id",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const company = await prisma.company.findUnique({
      where: { userId: req.user!.userId },
    });

    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job || job.deletedAt) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    if (req.user!.role !== "ADMIN" && job.companyId !== company?.id) {
      res.status(403).json({ error: "Not your job" });
      return;
    }

    await prisma.job.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });

    res.json({ message: "Job deleted" });
  },
);

export default router;
