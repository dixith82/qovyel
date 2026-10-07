import { prisma } from "../config/prisma.js";
import { sendAdminInquiryNotification, sendClientConfirmation } from "../services/emailService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/contact
export const submitContactInquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, company, service, budget, projectType, message } = req.body;

  const inquiry = await prisma.projectInquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      company: company || null,
      service: service || null,
      budget: budget || null,
      projectType: projectType || null,
      message,
    },
  });

  // Emails are best-effort: the inquiry is already safely stored, so a
  // down SMTP provider shouldn't turn into a 500 for the visitor. Failures
  // are logged, not thrown.
  const [adminResult, clientResult] = await Promise.allSettled([
    sendAdminInquiryNotification(inquiry),
    sendClientConfirmation(inquiry),
  ]);
  if (adminResult.status === "rejected") {
    const err = adminResult.reason;
    // eslint-disable-next-line no-console
    console.error(`[email] admin notification failed: code=${err?.code || "unknown"} message=${err?.message}`);
  }
  if (clientResult.status === "rejected") {
    const err = clientResult.reason;
    // eslint-disable-next-line no-console
    console.error(`[email] client confirmation failed: code=${err?.code || "unknown"} message=${err?.message}`);
  }

  return sendSuccess(
    res,
    { message: "Your project inquiry has been received." },
    201
  );
});
