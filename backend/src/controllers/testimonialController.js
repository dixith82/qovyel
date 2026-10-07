import { prisma } from "../config/prisma.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/testimonials
// Returns every testimonial as-is, including the isDemo flag, so the
// frontend can keep rendering its "Demo Testimonial" badge accurately
// rather than presenting placeholder content as a real client quote.
export const listTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return sendSuccess(res, testimonials);
});
