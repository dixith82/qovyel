import { sendError } from "../utils/apiResponse.js";

// Validates req.body against the given Zod schema. On success, replaces
// req.body with the parsed (trimmed/coerced) data so controllers always
// work with clean input. On failure, responds 400 with one message per
// field rather than letting a raw Zod error reach the client.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      }));
      return sendError(res, "Invalid request.", 400, errors);
    }
    req.body = result.data;
    next();
  };
}
