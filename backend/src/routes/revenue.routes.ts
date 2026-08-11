import { Router } from "express";
import * as ctrl from "../controllers/revenue.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import { writeLimiter } from "../middleware/rateLimiter";
import { createRevenueSchema, updateRevenueSchema } from "../schemas/revenue.schema";

const router = Router();

router.use(requireAuth, requireRole("ADMIN")); // entire module is admin-only

router.get("/", ctrl.getRevenue);
router.post("/", writeLimiter, validateBody(createRevenueSchema), ctrl.postRevenue);
router.put("/:id", writeLimiter, validateBody(updateRevenueSchema), ctrl.putRevenue);

export default router;
