import { Router } from "express";
import { subscribeToNewsletter } from "../controllers/newsletterController.js";
import { newsletterLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import { newsletterSubscribeSchema } from "../models/validationSchemas.js";

const router = Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", newsletterLimiter, validateBody(newsletterSubscribeSchema), subscribeToNewsletter);

export default router;
