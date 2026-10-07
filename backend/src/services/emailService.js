import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (!env.email.configured) return null;
  if (transporter) return transporter;

  // Gmail (and SMTP generally) uses two different TLS modes depending on
  // the port: 465 is "implicit TLS" (the whole connection is TLS from the
  // first byte), 587 is plaintext that then upgrades via STARTTLS.
  // Picking the wrong combination of secure/requireTLS for the configured
  // port is the single most common cause of SMTP connection failures —
  // including the "self-signed certificate in certificate chain" error,
  // which is almost always a local TLS-intercepting proxy or antivirus
  // (Kaspersky, Avast, Bitdefender, a corporate/VPN proxy) rather than
  // anything wrong with Gmail's real certificate or this code. That is
  // fixed by trusting the *real* intercepting root CA via the Node
  // NODE_EXTRA_CA_CERTS environment variable — never by disabling
  // certificate verification.
  const port = env.email.port;
  const secure = port === 465;

  transporter = nodemailer.createTransport({
    host: env.email.host,
    port,
    secure,
    // For 587 (secure: false), require the STARTTLS upgrade to actually
    // succeed rather than silently falling back to an unencrypted
    // connection if the server doesn't offer it.
    requireTLS: !secure,
    auth: { user: env.email.user, pass: env.email.password },
  });

  // eslint-disable-next-line no-console
  console.log(
    `[email] SMTP transporter configured: host=${env.email.host} port=${port} secure=${secure} user=${env.email.user}`
  );

  return transporter;
}

/**
 * Verifies the SMTP connection and authentication without sending a real
 * message. Safe to call at server startup and safe to log: only the
 * host/port/user and the error code/message are ever logged — never the
 * password or any other secret.
 */
export async function verifySmtpConnection() {
  if (!env.email.configured) {
    // eslint-disable-next-line no-console
    console.warn("[email] SMTP verification skipped — email is not configured (EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD).");
    return { ok: false, reason: "not configured" };
  }

  const t = getTransporter();
  try {
    await t.verify();
    // eslint-disable-next-line no-console
    console.log("[email] SMTP verification successful");
    return { ok: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[email] SMTP verification failed: code=${err.code || "unknown"} message=${err.message}`);
    return { ok: false, reason: err.message, code: err.code };
  }
}

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// The "QOVYEL / WHERE IDEAS BECOME DIGITAL." letterhead block required at
// the top of every QOVYEL email (admin notification and client
// confirmation alike).
const letterhead = `
  <p style="margin:0 0 2px;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#ffffff;">QOVYEL</p>
  <p style="margin:0 0 28px;font-size:11px;letter-spacing:0.14em;color:#8a8a8a;text-transform:uppercase;">Where ideas become digital.</p>
`;

const layout = (title, bodyHtml) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#000;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;color:#f5f5f2;">
      ${letterhead}
      <h1 style="font-size:22px;margin:0 0 20px;color:#ffffff;">${title}</h1>
      ${bodyHtml}
    </div>
  </body>
</html>`;

const field = (label, value) =>
  value
    ? `<p style="margin:0 0 10px;font-size:14px;"><strong style="color:#aaa;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
    : "";

const sectionHeading = (text) =>
  `<p style="margin:28px 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#777;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">${escapeHtml(text)}</p>`;

/**
 * Notifies QOVYEL of a new inquiry at env.email.adminEmail. Returns
 * silently (does not throw) if email isn't configured, since a missing
 * SMTP config shouldn't fail the contact-form submission itself — the
 * inquiry is already saved to the database by the time this runs.
 */
export async function sendAdminInquiryNotification(inquiry) {
  const t = getTransporter();
  if (!t || !env.email.adminEmail) return { sent: false, reason: "email not configured" };

  const submittedAt = new Date(inquiry.createdAt);

  const bodyHtml = `
    ${sectionHeading("Client Details")}
    ${field("Name", inquiry.name)}
    ${field("Email", inquiry.email)}
    ${field("Phone", inquiry.phone)}
    ${field("Company", inquiry.company)}

    ${sectionHeading("Project Details")}
    ${field("Service", inquiry.service)}
    ${field("Budget", inquiry.budget)}
    ${field("Project Type", inquiry.projectType)}

    ${sectionHeading("Message")}
    <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(inquiry.message)}</p>

    ${sectionHeading("Inquiry ID")}
    <p style="margin:0;font-size:14px;">${escapeHtml(inquiry.id)}</p>

    ${sectionHeading("Submitted")}
    <p style="margin:0;font-size:14px;">${escapeHtml(submittedAt.toUTCString())}</p>
  `;

  await t.sendMail({
    from: env.email.from,
    to: env.email.adminEmail,
    replyTo: inquiry.email,
    subject: `New QOVYEL Project Inquiry — ${inquiry.name}`,
    html: layout("New Project Inquiry", bodyHtml),
  });
  // eslint-disable-next-line no-console
  console.log("[email] admin notification sent");
  return { sent: true };
}

/**
 * Confirms receipt to the client who submitted the form. Deliberately
 * does not promise a specific response time. Same non-throwing behavior
 * as the admin notification above.
 */
export async function sendClientConfirmation(inquiry) {
  const t = getTransporter();
  if (!t) return { sent: false, reason: "email not configured" };

  const bodyHtml = `
    <p style="font-size:14px;line-height:1.6;">Hi ${escapeHtml(inquiry.name)},</p>
    <p style="font-size:14px;line-height:1.6;">Thank you for reaching out to QOVYEL.</p>
    <p style="font-size:14px;line-height:1.6;">We've received your project inquiry successfully.</p>
    ${
      env.business.instagramHandle
        ? `${sectionHeading("Instagram")}<p style="margin:0;font-size:14px;">${escapeHtml(env.business.instagramHandle)}</p>`
        : ""
    }
  `;

  await t.sendMail({
    from: env.email.from,
    to: inquiry.email,
    subject: "We Received Your QOVYEL Project Inquiry",
    html: layout("We Received Your Inquiry", bodyHtml),
  });
  // eslint-disable-next-line no-console
  console.log("[email] client confirmation sent");
  return { sent: true };
}
