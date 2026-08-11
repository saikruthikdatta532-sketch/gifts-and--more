import { Router } from "express";
import * as ctrl from "../controllers/category.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { validateBody } from "../middleware/validate";
import { writeLimiter } from "../middleware/rateLimiter";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";

const router = Router();

router.get("/", ctrl.getCategories);

router.post(
  "/",
  writeLimiter,
  requireAuth,
  requireRole("ADMIN"),
  validateBody(createCategorySchema),
  ctrl.postCategory
);

router.put(
  "/:id",
  writeLimiter,
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateCategorySchema),
  ctrl.putCategory
);

router.delete("/:id", writeLimiter, requireAuth, requireRole("ADMIN"), ctrl.deleteCategoryHandler);

export default router;
