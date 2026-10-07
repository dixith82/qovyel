import { prisma } from "../config/prisma.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/newsletter/subscribe
export const subscribeToNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) {
    // Not an error from the visitor's point of view — they're already
    // subscribed, which is the outcome they wanted.
    return sendSuccess(res, { message: "You're already subscribed." });
  }

  await prisma.newsletterSubscriber.create({ data: { email } });
  return sendSuccess(res, { message: "Successfully subscribed." }, 201);
});
