import { Router, type Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";

const router = Router();

const uuidParam = z.string().uuid("Invalid ID format");

const applySchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().max(5000).optional(),
  resumeSnapshot: z.string().max(10_000).optional(),
});

const updateStageSchema = z.object({
  stage: z.enum([
    "APPLIED",
    "RESUME_REVIEWED",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEW_COMPLETED",
    "OFFER_SENT",
    "OFFER_ACCEPTED",
    "HIRED",
    "REJECTED",
    "WITHDRAWN",
  ]),
  note: z.string().max(2000).optional(),
});

const listApplicationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// ─── POST /applications — candidate applies ────────────────────────────────────

router.post(
  "/",
  authenticate,
  requireRole("CANDIDATE"),
  async (req: AuthRequest, res: Response) => {
    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { jobId, coverLetter, resumeSnapshot } = parsed.data;

    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId, status: "PUBLISHED", deletedAt: null },
      });
      if (!job) {
        res.status(404).json({ error: "Job not found or not accepting applications" });
        return;
      }

      const existing = await prisma.application.findUnique({
        where: { jobId_candidateId: { jobId, candidateId: req.user!.userId } },
      });
      if (existing && !existing.deletedAt) {
        res.status(409).json({ error: "Already applied to this job" });
        return;
      }

      const application = await prisma.application.create({
        data: {
          jobId,
          candidateId: req.user!.userId,
          coverLetter,
          resumeSnapshot,
          timeline: {
            create: { stage: "APPLIED", note: "Application submitted" },
          },
        },
        include: {
          job: { select: { id: true, title: true } },
          timeline: true,
        },
      });

      res.status(201).json({ application });
    } catch (err) {
      throw err;
    }
  },
);

// ─── GET /applications — list (paginated) ─────────────────────────────────────
// Candidate: own applications. Employer: applications on their jobs. Admin: all.

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const parsedQuery = listApplicationsSchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({ error: parsedQuery.error.flatten() });
    return;
  }

  const { page, limit } = parsedQuery.data;
  const skip = (page - 1) * limit;
  const { role, userId } = req.user!;

  try {
    const where = {
      deletedAt: null as null,
      ...(role === "CANDIDATE"
        ? { candidateId: userId }
        : role === "EMPLOYER"
          ? { job: { company: { userId } } }
          : {}),
    };

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              company: { select: { id: true, name: true } },
            },
          },
          candidate: { select: { id: true, name: true, email: true } },
          timeline: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    res.json({ applications, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    throw err;
  }
});

// ─── GET /applications/:id ─────────────────────────────────────────────────────

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const idResult = uuidParam.safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: idResult.data, deletedAt: null },
      include: {
        job: { include: { company: true } },
        candidate: {
          select: { id: true, name: true, email: true, candidateProfile: true },
        },
        timeline: { orderBy: { createdAt: "asc" } },
        notes: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        interviews: { orderBy: { scheduledAt: "asc" } },
        offers: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const { userId, role } = req.user!;
    const isCandidate = application.candidateId === userId;
    const isEmployer = application.job.company.userId === userId;
    if (!isCandidate && !isEmployer && role !== "ADMIN") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json({ application });
  } catch (err) {
    throw err;
  }
});

// ─── PATCH /applications/:id/stage — employer advances stage ──────────────────

router.patch(
  "/:id/stage",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const idResult = uuidParam.safeParse(req.params.id);
    if (!idResult.success) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const parsed = updateStageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { stage, note } = parsed.data;

    // Employers cannot advance to WITHDRAWN — that's a candidate action
    if (stage === "WITHDRAWN") {
      res.status(400).json({ error: "Use the withdraw endpoint to withdraw an application" });
      return;
    }

    try {
      const application = await prisma.application.findUnique({
        where: { id: idResult.data, deletedAt: null },
        include: { job: { include: { company: true } } },
      });

      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      if (
        req.user!.role !== "ADMIN" &&
        application.job.company.userId !== req.user!.userId
      ) {
        res.status(403).json({ error: "Not your application" });
        return;
      }

      const [updated] = await prisma.$transaction([
        prisma.application.update({
          where: { id: idResult.data },
          data: { stage },
        }),
        prisma.applicationTimeline.create({
          data: { applicationId: idResult.data, stage, note },
        }),
      ]);

      res.json({ application: updated });
    } catch (err) {
      throw err;
    }
  },
);

// ─── POST /applications/:id/withdraw — candidate withdraws ───────────────────

router.post(
  "/:id/withdraw",
  authenticate,
  requireRole("CANDIDATE"),
  async (req: AuthRequest, res: Response) => {
    const idResult = uuidParam.safeParse(req.params.id);
    if (!idResult.success) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    try {
      const application = await prisma.application.findUnique({
        where: { id: idResult.data, deletedAt: null },
      });

      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      if (application.candidateId !== req.user!.userId) {
        res.status(403).json({ error: "Not your application" });
        return;
      }
      if (["WITHDRAWN", "HIRED", "REJECTED"].includes(application.stage)) {
        res.status(400).json({ error: `Cannot withdraw an application with status: ${application.stage}` });
        return;
      }

      const [updated] = await prisma.$transaction([
        prisma.application.update({
          where: { id: idResult.data },
          data: { stage: "WITHDRAWN" },
        }),
        prisma.applicationTimeline.create({
          data: {
            applicationId: idResult.data,
            stage: "WITHDRAWN",
            note: "Withdrawn by candidate",
          },
        }),
      ]);

      res.json({ application: updated });
    } catch (err) {
      throw err;
    }
  },
);

export default router;
