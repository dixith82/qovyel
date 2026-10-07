import { prisma } from "../config/prisma.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/services
export const listServices = asyncHandler(async (req, res) => {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return sendSuccess(res, services);
});
