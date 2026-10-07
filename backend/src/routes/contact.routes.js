import { Router } from "express";
import { submitContactInquiry } from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import { contactInquirySchema } from "../models/validationSchemas.js";

const router = Router();

// POST /api/contact
router.post("/", contactLimiter, validateBody(contactInquirySchema), submitContactInquiry);

export default router;
