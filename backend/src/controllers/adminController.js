import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ---- Inquiries -------------------------------------------------------

// GET /api/admin/inquiries
export const listInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  const inquiries = await prisma.projectInquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return sendSuccess(res, inquiries);
});

// GET /api/admin/inquiries/:id
export const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await prisma.projectInquiry.findUnique({ where: { id: req.params.id } });
  if (!inquiry) throw new ApiError(404, "Inquiry not found.");
  return sendSuccess(res, inquiry);
});

// PATCH /api/admin/inquiries/:id  (status update — validated against the
// InquiryStatus enum by validateBody(inquiryStatusSchema) upstream)
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  try {
    const inquiry = await prisma.projectInquiry.update({
      where: { id: req.params.id },
      data: { status },
    });
    return sendSuccess(res, inquiry);
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Inquiry not found.");
    throw err;
  }
});

// DELETE /api/admin/inquiries/:id
export const deleteInquiry = asyncHandler(async (req, res) => {
  try {
    await prisma.projectInquiry.delete({ where: { id: req.params.id } });
    return sendSuccess(res, { message: "Inquiry deleted." });
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Inquiry not found.");
    throw err;
  }
});

// ---- Projects ----------------------------------------------------------

// GET /api/admin/projects
export const adminListProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return sendSuccess(res, projects);
});

// POST /api/admin/projects
export const createProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.create({ data: req.body });
  return sendSuccess(res, project, 201);
});

// PATCH /api/admin/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
    return sendSuccess(res, project);
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Project not found.");
    throw err;
  }
});

// DELETE /api/admin/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    return sendSuccess(res, { message: "Project deleted." });
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Project not found.");
    throw err;
  }
});

// ---- Testimonials --------------------------------------------------------

// GET /api/admin/testimonials
export const adminListTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return sendSuccess(res, testimonials);
});

// POST /api/admin/testimonials
export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.create({ data: req.body });
  return sendSuccess(res, testimonial, 201);
});

// PATCH /api/admin/testimonials/:id
export const updateTestimonial = asyncHandler(async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
    return sendSuccess(res, testimonial);
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Testimonial not found.");
    throw err;
  }
});

// DELETE /api/admin/testimonials/:id
export const deleteTestimonial = asyncHandler(async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    return sendSuccess(res, { message: "Testimonial deleted." });
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Testimonial not found.");
    throw err;
  }
});

// ---- Subscribers ---------------------------------------------------------

// GET /api/admin/subscribers
export const listSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });
  return sendSuccess(res, subscribers);
});

// ---- Dashboard -----------------------------------------------------------

// GET /api/admin/dashboard
// Every number here is a live COUNT query — nothing is hardcoded or
// estimated, per the "no fake statistics" requirement.
export const getDashboard = asyncHandler(async (req, res) => {
  const [total, newCount, contacted, inProgress, completed, closed, totalProjects, totalSubscribers] =
    await Promise.all([
      prisma.projectInquiry.count(),
      prisma.projectInquiry.count({ where: { status: "NEW" } }),
      prisma.projectInquiry.count({ where: { status: "CONTACTED" } }),
      prisma.projectInquiry.count({ where: { status: "IN_PROGRESS" } }),
      prisma.projectInquiry.count({ where: { status: "COMPLETED" } }),
      prisma.projectInquiry.count({ where: { status: "CLOSED" } }),
      prisma.project.count(),
      prisma.newsletterSubscriber.count(),
    ]);

  return sendSuccess(res, {
    inquiries: {
      total,
      new: newCount,
      contacted,
      inProgress,
      completed,
      closed,
    },
    totalProjects,
    totalSubscribers,
  });
});
