import { prisma } from "../config/prisma.js";
import { SESSION_COOKIE, verifySessionToken } from "../services/authService.js";
import { sendError } from "../utils/apiResponse.js";

// Attaches req.admin when the session cookie is present and valid;
// otherwise responds 401. Every /api/admin/* route (except login) should
// sit behind this.
export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      return sendError(res, "Authentication required.", 401);
    }

    const payload = verifySessionToken(token);
    const admin = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin) {
      return sendError(res, "Authentication required.", 401);
    }

    req.admin = { id: admin.id, email: admin.email, name: admin.name };
    next();
  } catch {
    return sendError(res, "Invalid or expired session.", 401);
  }
}
