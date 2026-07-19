import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import jobsRouter from "./jobs.js";
import applicationsRouter from "./applications.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/jobs", jobsRouter);
router.use("/applications", applicationsRouter);

export default router;
