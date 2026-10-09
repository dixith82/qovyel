
import { Resend } from "resend";
import { env } from "../config/env.js";

let resendClient = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not configured.");
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function verifySmtpConnection() {
  const client = getResendClient();

  if (!client) {
    return { ok: false, reason: "Resend API key not configured" };
  }

  console.log("[email] Resend API client configured.");
  return { ok: true };
}

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

async function sendEmail({ to, subject, html, replyTo }) {
  const client = getResendClient();

  if (!client) {
    return { sent: false, reason: "Resend API key not configured" };
  }

  // Resend requires a verified sender domain for normal production sending.
  // Use a sender address configured and permitted in your Resend account.
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    console.error("[email] RESEND_FROM_EMAIL is not configured.");
    return { sent: false, reason: "Sender address not configured" };
  }

  const { data, error } = await client.emails.send({
    from,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error(`[email] Resend send failed: ${error.statusCode || "unknown"} ${error.message}`);
    return { sent: false, reason: error.message };
  }

  console.log(`[email] Email accepted by Resend: ${data?.id || "accepted"}`);
  return { sent: true, id: data?.id };
}

export async function sendAdminInquiryNotification(inquiry) {
  if (!env.email.adminEmail) {
    return { sent: false, reason: "Admin email not configured" };
  }

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

  return sendEmail({
    to: env.email.adminEmail,
    replyTo: inquiry.email,
    subject: `New QOVYEL Project Inquiry — ${inquiry.name}`,
    html: layout("New Project Inquiry", bodyHtml),
  });
}

export async function sendClientConfirmation(inquiry) {
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

  return sendEmail({
    to: inquiry.email,
    subject: "We Received Your QOVYEL Project Inquiry",
    html: layout("We Received Your Inquiry", bodyHtml),
  });
}
