import type { ContactValues } from "@/lib/contact-schema";

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

// Keep this deterministic: Resend requires the same payload for a retried key.
// Never reuse formatEnquiry here; that helper labels downloaded copies unsent.
export function buildContactEmail(values: ContactValues) {
  const fields = [
    ["Name", values.fullName],
    ["Email", values.email],
    ["Company / agency", values.company],
    ["Phone", values.phone || "Not provided"],
    ["Role needed", values.role],
  ];
  const text = [
    "REAL ESTATE STAFF — NEW WEBSITE ENQUIRY",
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    values.message,
    "",
    "Use Reply in your email app to respond directly to the sender.",
  ].join("\n");
  const rows = fields
    .map(
      ([label, value]) => `
    <tr><th scope="row" align="left" style="padding:12px 16px 12px 0;border-bottom:1px solid #dce4dd;vertical-align:top;color:#003f32;font-weight:600;">${escapeHtml(label)}</th>
    <td style="padding:12px 0;border-bottom:1px solid #dce4dd;overflow-wrap:anywhere;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const message = escapeHtml(values.message).replace(/\r\n?|\n/g, "<br />");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>New staffing enquiry</title></head>
<body style="margin:0;padding:24px 12px;background:#f7f8f3;color:#405f57;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;">
  <table role="presentation" style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse;background:#ffffff;">
    <tr><td style="padding:28px;background:#003f32;color:#ffffff;"><p style="margin:0 0 12px;font-size:16px;">REAL ESTATE STAFF · People behind property</p><h1 style="margin:0;font-size:28px;line-height:1.3;">New staffing enquiry</h1></td></tr>
    <tr><td style="padding:24px 28px;"><table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.6;">${rows}</table>
      <h2 style="margin:28px 0 12px;color:#003f32;font-size:20px;">Message</h2>
      <div style="padding:20px;background:#eaf0e7;overflow-wrap:anywhere;">${message}</div>
      <p style="margin:24px 0 0;">Use <strong>Reply</strong> in your email app to respond directly to the sender.</p>
    </td></tr>
  </table>
</body></html>`;
  return { subject: `New staffing enquiry: ${values.role}`, text, html };
}
