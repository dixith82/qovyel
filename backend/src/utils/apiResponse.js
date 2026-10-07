// Every route responds through one of these two, so the frontend can rely
// on a single, predictable shape rather than guessing per-endpoint.

export function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendError(res, message, status = 400, errors = []) {
  return res.status(status).json({ success: false, message, errors });
}
