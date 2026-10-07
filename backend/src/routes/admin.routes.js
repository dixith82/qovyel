import { Router } from "express";
import {
  adminListProjects,
  adminListTestimonials,
  createProject,
  createTestimonial,
  deleteInquiry,
  deleteProject,
  deleteTestimonial,
  getDashboard,
  getInquiry,
  listInquiries,
  listSubscribers,
  updateInquiryStatus,
  updateProject,
  updateTestimonial,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody } from "../middleware/validate.js";
import {
  inquiryStatusSchema,
  projectSchema,
  projectUpdateSchema,
  testimonialSchema,
  testimonialUpdateSchema,
} from "../models/validationSchemas.js";

const router = Router();

// Every route below requires a valid admin session.
router.use(requireAdmin);

router.get("/dashboard", getDashboard);

router.get("/inquiries", listInquiries);
router.get("/inquiries/:id", getInquiry);
router.patch("/inquiries/:id", validateBody(inquiryStatusSchema), updateInquiryStatus);
router.delete("/inquiries/:id", deleteInquiry);

router.get("/projects", adminListProjects);
router.post("/projects", validateBody(projectSchema), createProject);
router.patch("/projects/:id", validateBody(projectUpdateSchema), updateProject);
router.delete("/projects/:id", deleteProject);

router.get("/testimonials", adminListTestimonials);
router.post("/testimonials", validateBody(testimonialSchema), createTestimonial);
router.patch("/testimonials/:id", validateBody(testimonialUpdateSchema), updateTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

router.get("/subscribers", listSubscribers);

export default router;
