import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import enquiryRoutes from "./enquiry.routes";
import revenueRoutes from "./revenue.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/revenue", revenueRoutes);
router.use("/admin", adminRoutes);

export default router;
