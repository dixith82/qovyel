import { prisma } from "../config/prisma.js";
import { SESSION_COOKIE, sessionCookieOptions, signSessionToken, verifyPassword } from "../services/authService.js";
import { ApiError } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  // Deliberately identical error for "no such user" and "wrong password" —
  // distinguishing them lets an attacker enumerate valid admin emails.
  if (!admin) throw new ApiError(401, "Invalid email or password.");

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password.");

  const token = signSessionToken(admin);
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());

  return sendSuccess(res, { id: admin.id, email: admin.email, name: admin.name });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(SESSION_COOKIE, { ...sessionCookieOptions(), maxAge: 0 });
  return sendSuccess(res, { message: "Logged out." });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, req.admin);
});
