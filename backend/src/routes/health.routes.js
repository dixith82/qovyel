import { Router } from "express";

const router = Router();

// GET /api/health
router.get("/", (req, res) => {
  res.status(200).json({ success: true, status: "healthy" });
});

export default router;
