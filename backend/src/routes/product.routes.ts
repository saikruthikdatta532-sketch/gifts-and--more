import { Router } from "express";
import * as ctrl from "../controllers/product.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { validateBody, validateQuery } from "../middleware/validate";
import { writeLimiter } from "../middleware/rateLimiter";
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  productQuerySchema,
} from "../schemas/product.schema";

const router = Router();

router.get("/", validateQuery(productQuerySchema), ctrl.getProducts);
router.get("/:slug", ctrl.getProductBySlug);

router.post(
  "/",
  writeLimiter,
  requireAuth,
  requireRole("ADMIN"),
  validateBody(createProductSchema),
  ctrl.postProduct
);

router.put(
  "/:id",
  writeLimiter,
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateProductSchema),
  ctrl.putProduct
);

router.patch(
  "/:id/stock",
  writeLimiter,
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateStockSchema),
  ctrl.patchStock
);

router.delete("/:id", writeLimiter, requireAuth, requireRole("ADMIN"), ctrl.deleteProductHandler);

export default router;
