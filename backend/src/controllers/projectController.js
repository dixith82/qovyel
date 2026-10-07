import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/projects
export const listProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return sendSuccess(res, projects);
});

// GET /api/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) throw new ApiError(404, "Project not found.");
  return sendSuccess(res, project);
});
