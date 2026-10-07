import { Router } from "express";
import { login, logout, me } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "../models/validationSchemas.js";

const router = Router();

router.post("/login", loginLimiter, validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

export default router;
