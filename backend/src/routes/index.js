import { Router } from "express";
import { apiLimiter } from "../middleware/rateLimiter.js";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js";
import healthRoutes from "./health.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import projectsRoutes from "./projects.routes.js";
import servicesRoutes from "./services.routes.js";
import testimonialsRoutes from "./testimonials.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/contact", contactRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/auth", authRoutes);
// Public read endpoints share a looser default rate limit.
router.use("/projects", apiLimiter, projectsRoutes);
router.use("/services", apiLimiter, servicesRoutes);
router.use("/testimonials", apiLimiter, testimonialsRoutes);
router.use("/admin", adminRoutes);

export default router;
