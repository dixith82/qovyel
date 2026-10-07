import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// The single place errors are turned into HTTP responses. Anything thrown
// or passed to next() anywhere in the app ends up here — no controller
// should be formatting its own error response.
export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}`, errors: [] });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err instanceof ApiError ? err.status : err.status || 500;
  const errors = err instanceof ApiError ? err.errors : [];

  // Never leak stack traces, SQL errors, or internal paths in production.
  const message =
    status >= 500 && env.isProduction
      ? "Something went wrong. Please try again."
      : err.message || "Something went wrong. Please try again.";

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error("[error]", err);
  }

  res.status(status).json({ success: false, message, errors });
}
