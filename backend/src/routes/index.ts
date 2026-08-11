import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

// Placeholder mounts — implemented in upcoming stages:
// router.use("/products", productRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/enquiries", enquiryRoutes);
// router.use("/revenue", revenueRoutes);
// router.use("/admin", adminRoutes);

export default router;
