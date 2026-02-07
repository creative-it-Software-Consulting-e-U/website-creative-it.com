import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

const ses = new SESv2Client({});
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL!;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

const SUBJECT_LABELS: Record<string, string> = {
  project: "New Project",
  consulting: "Consulting Inquiry",
  partnership: "Partnership Opportunity",
  careers: "Careers",
  other: "Other",
};

const MAX_LENGTHS: Record<string, number> = {
  name: 200,
  email: 320,
  company: 200,
  subject: 50,
  message: 5000,
};

interface ContactForm {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

function getCorsHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function respond(
  statusCode: number,
  body: Record<string, string>,
  origin?: string
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: getCorsHeaders(origin),
    body: JSON.stringify(body),
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const origin = event.headers?.origin;

  if (event.requestContext.http.method !== "POST") {
    return respond(405, { error: "Method not allowed" }, origin);
  }

  // Parse body
  let data: ContactForm;
  try {
    data = JSON.parse(event.body ?? "{}");
  } catch {
    return respond(400, { error: "Invalid JSON body" }, origin);
  }

  // Validate required fields
  const { name, email, subject, message, company } = data;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return respond(
      400,
      { error: "Missing required fields: name, email, subject, message" },
      origin
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return respond(400, { error: "Invalid email address" }, origin);
  }

  // Validate subject against allowed values
  if (!SUBJECT_LABELS[subject]) {
    return respond(
      400,
      { error: `Invalid subject. Allowed values: ${Object.keys(SUBJECT_LABELS).join(", ")}` },
      origin
    );
  }

  // Enforce length limits
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const value = data[field as keyof ContactForm];
    if (value && value.length > max) {
      return respond(
        400,
        { error: `${field} exceeds maximum length of ${max} characters` },
        origin
      );
    }
  }

  const subjectLabel = SUBJECT_LABELS[subject];
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeCompany = company?.trim() ? escapeHtml(company.trim()) : "";
  const safeMessage = escapeHtml(message.trim());

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#030520;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#030520;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0F1132;border-radius:16px;border:1px solid rgba(255,255,255,0.06);">
        <!-- Header -->
        <tr><td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <h1 style="margin:0;font-size:20px;font-weight:600;color:#F5F5F7;">New Contact Form Submission</h1>
          <p style="margin:8px 0 0;font-size:14px;color:#A163F1;">${subjectLabel}</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:0 0 20px;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6B7280;">Name</p>
              <p style="margin:0;font-size:16px;color:#F5F5F7;">${safeName}</p>
            </td></tr>
            <tr><td style="padding:0 0 20px;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6B7280;">Email</p>
              <p style="margin:0;font-size:16px;color:#23F0C3;">${safeEmail}</p>
            </td></tr>
            ${safeCompany ? `<tr><td style="padding:0 0 20px;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6B7280;">Company</p>
              <p style="margin:0;font-size:16px;color:#F5F5F7;">${safeCompany}</p>
            </td></tr>` : ""}
            <tr><td style="padding:0;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6B7280;">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#D1D5DB;white-space:pre-wrap;">${safeMessage}</p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 40px 24px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:12px;color:#6B7280;">Sent via creative-it.com contact form</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const textBody = `New Contact Form Submission
${subjectLabel}

Name: ${name.trim()}
Email: ${email.trim()}${company?.trim() ? `\nCompany: ${company.trim()}` : ""}

Message:
${message.trim()}

---
Sent via creative-it.com contact form`;

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: `"creative-it.com Contact Form" <noreply@creative-it.com>`,
        Destination: {
          ToAddresses: [RECIPIENT_EMAIL],
        },
        ReplyToAddresses: [email.trim()],
        Content: {
          Simple: {
            Subject: {
              Data: `[Contact Form] ${subjectLabel} — ${name.trim()}`,
              Charset: "UTF-8",
            },
            Body: {
              Html: {
                Data: htmlBody,
                Charset: "UTF-8",
              },
              Text: {
                Data: textBody,
                Charset: "UTF-8",
              },
            },
          },
        },
      })
    );

    return respond(200, { message: "Message sent successfully" }, origin);
  } catch (err) {
    console.error("SES send error:", err);
    return respond(
      500,
      { error: "Failed to send message. Please try again later." },
      origin
    );
  }
}
