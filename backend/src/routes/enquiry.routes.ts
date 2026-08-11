import { Router } from "express";
import * as ctrl from "../controllers/enquiry.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { validateBody, validateQuery } from "../middleware/validate";
import { writeLimiter } from "../middleware/rateLimiter";
import { createEnquirySchema, updateEnquirySchema, enquiryQuerySchema } from "../schemas/enquiry.schema";

const router = Router();

// Admin-only: view all enquiries (internal CRM)
router.get("/", requireAuth, requireRole("ADMIN"), validateQuery(enquiryQuerySchema), ctrl.getEnquiries);

// Public: anyone can submit an enquiry (e.g. bulk order form) without login
router.post("/", writeLimiter, validateBody(createEnquirySchema), ctrl.postEnquiry);

// Admin-only: update status/notes
router.put(
  "/:id",
  writeLimiter,
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateEnquirySchema),
  ctrl.putEnquiry
);

export default router;
