import morgan from "morgan";

// morgan's built-in "combined"/"dev" formats already log only
// method/route/status/response-time by design — they never include request
// bodies (so passwords, session secrets, and email credentials, which all
// live in JSON bodies or env vars, never reach the log stream).
export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms"
);
