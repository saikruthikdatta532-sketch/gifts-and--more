import { Router } from "express";
import * as ctrl from "../controllers/admin.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/dashboard", ctrl.getDashboard);
router.get("/logs", ctrl.getLogs);

export default router;
