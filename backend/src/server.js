import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import { verifySmtpConnection } from "./services/emailService.js";
import { requestLogger } from "./utils/logger.js";

const app = express();

// Behind a reverse proxy (Render/Railway both put one in front of the
// app), this is required for rate-limiting and secure cookies to see the
// real client IP/protocol instead of the proxy's.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true, // required so the httpOnly session cookie is sent/received
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(requestLogger);

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, async () => {
  // eslint-disable-next-line no-console
  console.log(`[qovyel-backend] listening on port ${env.port} (${env.nodeEnv})`);
  // eslint-disable-next-line no-console
  console.log(`[qovyel-backend] accepting requests from ${env.frontendUrl}`);

  // The server is already listening and accepting requests by this point
  // (app.listen's callback runs after the socket is bound) — awaiting here
  // only orders the verification log output, it does not delay startup or
  // block any incoming request. verifySmtpConnection() itself never
  // throws, so a bad SMTP config cannot crash the process either.
  await verifySmtpConnection();
});
