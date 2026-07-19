import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { authenticate, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2).max(100).transform((s) => s.trim()),
  email: z.string().email().max(255).transform((s) => s.toLowerCase().trim()),
  password: z.string().min(8).max(72), // bcrypt max is 72 bytes
  role: z.enum(["CANDIDATE", "EMPLOYER"]).default("CANDIDATE"),
});

const loginSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
});

// ─── POST /auth/register ──────────────────────────────────────────────────────

router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, email, password, role } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true },
    });

    // Create companion profile
    if (role === "CANDIDATE") {
      await prisma.candidateProfile.create({ data: { userId: user.id } });
    } else if (role === "EMPLOYER") {
      await prisma.company.create({
        data: { userId: user.id, name: `${name}'s Company` },
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.status(201).json({ token, user });
  } catch (err) {
    throw err; // propagate to global error handler
  }
});

// ─── POST /auth/login ─────────────────────────────────────────────────────────

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    // Use constant-time comparison even if user not found to prevent timing attacks
    const dummyHash = "$2a$12$invalidhashfortimingprotection000000000000000000000000000";
    const valid = await bcrypt.compare(
      password,
      user?.passwordHash ?? dummyHash,
    );

    if (!user || !valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { passwordHash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    throw err;
  }
});

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        candidateProfile: true,
        company: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    throw err;
  }
});

// ─── POST /auth/forgot-password ───────────────────────────────────────────────
// Always returns 200 to avoid leaking which emails are registered.
// Email delivery is not yet implemented — this is the correct stub pattern.

router.post("/forgot-password", async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    // Check if user exists but don't reveal the result to the caller
    await prisma.user.findUnique({ where: { email: parsed.data.email } });
    // TODO: send reset email when email service is configured
  } catch {
    // Swallow silently — we always return 200
  }

  res.json({
    message:
      "If that email is registered, a password reset link will be sent shortly.",
  });
});

// ─── POST /auth/logout ────────────────────────────────────────────────────────
// JWT is stateless — the client discards the token. No server action needed.

router.post("/logout", (_req: Request, res: Response) => {
  res.status(204).end();
});

export default router;
