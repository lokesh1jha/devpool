import { Router, type Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  authenticate,
  requireRole,
  type AuthRequest,
} from "../middlewares/auth.js";

const router = Router();

const applySchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().optional(),
  resumeSnapshot: z.string().optional(),
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
  note: z.string().optional(),
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
  },
);

// ─── GET /applications — list (candidate: own, employer: their jobs) ──────────

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { role, userId } = req.user!;

  const applications = await prisma.application.findMany({
    where: {
      deletedAt: null,
      ...(role === "CANDIDATE"
        ? { candidateId: userId }
        : role === "EMPLOYER"
          ? { job: { company: { userId } } }
          : {}),
    },
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
  });

  res.json({ applications });
});

// ─── GET /applications/:id ─────────────────────────────────────────────────────

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const application = await prisma.application.findUnique({
    where: { id: req.params.id, deletedAt: null },
    include: {
      job: { include: { company: true } },
      candidate: {
        select: {
          id: true,
          name: true,
          email: true,
          candidateProfile: true,
        },
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
});

// ─── PATCH /applications/:id/stage — employer advances stage ─────────────────

router.patch(
  "/:id/stage",
  authenticate,
  requireRole("EMPLOYER", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    const parsed = updateStageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { stage, note } = parsed.data;

    const application = await prisma.application.findUnique({
      where: { id: req.params.id, deletedAt: null },
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
        where: { id: req.params.id },
        data: { stage },
      }),
      prisma.applicationTimeline.create({
        data: { applicationId: req.params.id, stage, note },
      }),
    ]);

    res.json({ application: updated });
  },
);

export default router;
