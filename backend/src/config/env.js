import "dotenv/config";

// Fail fast and clearly if required configuration is missing, rather than
// booting into a half-working server. EMAIL_* and DATABASE_URL are the two
// most common causes of silent production failures, so they're checked
// explicitly with actionable messages.
const required = ["DATABASE_URL", "SESSION_SECRET", "FRONTEND_URL"];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `[config] Missing required environment variable(s): ${missing.join(", ")}.\n` +
      "Copy .env.example to .env and fill these in before starting the server."
  );
  process.exit(1);
}

const emailConfigured = Boolean(
  process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
);

if (!emailConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[config] Email is not fully configured (EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD). " +
      "Contact form submissions will still be saved to the database, but no " +
      "notification or confirmation emails will be sent until this is set."
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL,
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,

  email: {
    configured: emailConfigured,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || "QOVYEL <no-reply@qovyel.com>",
    adminEmail: process.env.ADMIN_EMAIL,
  },

  // Public business contact details. These are not secrets — they're the
  // same phone/Instagram shown on the site — but are centralized here so
  // no component or email template hardcodes them individually.
  business: {
    phone: process.env.BUSINESS_PHONE || "",
    instagramHandle: process.env.INSTAGRAM_HANDLE || "",
    instagramUrl: process.env.INSTAGRAM_URL || "",
  },

  isProduction: (process.env.NODE_ENV || "development") === "production",
};
