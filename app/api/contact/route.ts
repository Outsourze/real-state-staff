import { contactSchema } from "@/lib/contact-schema";
import { buildContactEmail } from "@/lib/contact-email";
import { z } from "zod";

const MAX_BODY_BYTES = 16 * 1024;
const TIMEOUT_MS = 10_000;
const resendSettingsSchema = z.object({
  apiKey: z.string().trim().min(1).regex(/^\S+$/),
  from: z.string().trim().email(),
  to: z.string().trim().email(),
});

function json(message: string, status: number, code: string) {
  return Response.json(
    { message, code },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

async function readLimitedBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";

  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("Request too large");
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next may expose an internal localhost URL behind a public host/proxy.
  // Compare the browser Origin against the incoming Host and protocol instead.
  const internalUrl = new URL(request.url);
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol === "https" || forwardedProtocol === "http"
      ? `${forwardedProtocol}:`
      : internalUrl.protocol;
  const publicHost = request.headers.get("host") || internalUrl.host;
  let publicOrigin: string;
  try {
    publicOrigin = new URL(`${protocol}//${publicHost}`).origin;
  } catch {
    return json(
      "Please send your enquiry from this website.",
      403,
      "invalid_origin",
    );
  }
  if (origin && origin !== publicOrigin) {
    return json(
      "Please send your enquiry from this website.",
      403,
      "invalid_origin",
    );
  }

  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return json(
      "Please submit the enquiry form as JSON.",
      415,
      "invalid_content_type",
    );
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json(
      "Your enquiry is too long. Please shorten it and try again.",
      413,
      "too_large",
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(await readLimitedBody(request));
  } catch (error) {
    return error instanceof RangeError
      ? json(
          "Your enquiry is too long. Please shorten it and try again.",
          413,
          "too_large",
        )
      : json(
          "We could not read your enquiry. Please check the form and try again.",
          400,
          "invalid_json",
        );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      "Please check your details and complete all required fields.",
      400,
      "invalid_fields",
    );
  }

  if (parsed.data.website?.trim()) {
    return json(
      "We could not send this enquiry. Please try again.",
      400,
      "invalid_fields",
    );
  }

  const submissionId = request.headers.get("idempotency-key");
  if (
    submissionId !== null &&
    !z.string().uuid().safeParse(submissionId).success
  ) {
    return json(
      "Please reload the page and try submitting your enquiry again.",
      400,
      "invalid_request",
    );
  }

  const resendSettings = {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
  };
  // Partial Resend configuration must fail closed, rather than silently sending
  // through another service. Once Resend is selected, never fall back on errors.
  const useResend = Object.values(resendSettings).some((value) =>
    Boolean(value?.trim()),
  );
  let destination: URL;
  let deliveryHeaders: Record<string, string>;
  let deliveryBody: string;

  if (useResend) {
    const configured = resendSettingsSchema.safeParse(resendSettings);
    if (!configured.success) {
      return json(
        "Our enquiry service is not configured yet. Your enquiry has not been sent. Please save or copy your details for now.",
        503,
        "not_connected",
      );
    }
    const { apiKey, from, to } = configured.data;
    destination = new URL("https://api.resend.com/emails");
    deliveryHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "User-Agent": "real-estate-staff/1.0",
      "Idempotency-Key": `contact/${submissionId ?? crypto.randomUUID()}`,
    };
    deliveryBody = JSON.stringify({
      from: `Real Estate Staff <${from}>`,
      to: [to],
      reply_to: parsed.data.email,
      ...buildContactEmail(parsed.data),
    });
  } else {
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (!webhook) {
      return json(
        "Our enquiry form is not connected yet. Your enquiry has not been sent. Please save or copy your details for now.",
        503,
        "not_connected",
      );
    }
    try {
      destination = new URL(webhook);
      if (
        destination.protocol !== "https:" ||
        destination.username ||
        destination.password
      ) {
        throw new Error("Invalid webhook URL");
      }
    } catch {
      return json(
        "The enquiry service is unavailable. Your enquiry has not been sent. Please save a copy for now.",
        503,
        "not_connected",
      );
    }
    const { website: honeypot, ...enquiry } = parsed.data;
    void honeypot;
    deliveryHeaders = {
      "Content-Type": "application/json",
      ...(process.env.CONTACT_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
        : {}),
    };
    deliveryBody = JSON.stringify({
      source: "real-estate-staff-website",
      submittedAt: new Date().toISOString(),
      ...enquiry,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const startedAt = Date.now();
  let phase: "request" | "receipt" = "request";
  const reportFailure = (
    reason: "upstream_rejected" | "timeout" | "network_error" | "invalid_receipt",
    upstreamStatus?: number,
    errorType?: "TypeError" | "SyntaxError" | "AbortError" | "Error" | "unknown",
  ) => {
    // Fixed diagnostic fields only: never log credentials, addresses, payloads,
    // provider response bodies or exception messages (which may contain them).
    console.error(JSON.stringify({
      event: "contact_delivery_failed",
      provider: useResend ? "resend" : "webhook",
      reason,
      phase,
      ...(upstreamStatus === undefined ? {} : { upstreamStatus }),
      ...(errorType === undefined ? {} : { errorType }),
      elapsedMs: Date.now() - startedAt,
    }));
  };

  try {
    const response = await fetch(destination, {
      method: "POST",
      headers: deliveryHeaders,
      body: deliveryBody,
      signal: controller.signal,
      redirect: "error",
      cache: "no-store",
    });

    if (!response.ok) {
      reportFailure("upstream_rejected", response.status);
      if (useResend && response.status === 429) {
        return json(
          "Our enquiry service has reached its sending limit. Your enquiry has not been sent. Please save a copy and try again later.",
          429,
          "rate_limited",
        );
      }
      if (
        useResend &&
        (response.status >= 500 ||
          response.status === 409 ||
          response.status === 408)
      ) {
        return json(
          "We could not confirm delivery. Your details are still here. Please save a copy and check with the team before trying again.",
          502,
          "delivery_unknown",
        );
      }
      return json(
        "The enquiry service could not accept your message. Please save a copy and try again later.",
        502,
        "delivery_failed",
      );
    }

    if (useResend) {
      phase = "receipt";
      const receipt: unknown = await response.json();
      if (
        !receipt ||
        typeof receipt !== "object" ||
        !("id" in receipt) ||
        typeof receipt.id !== "string" ||
        !receipt.id.trim()
      ) {
        throw new Error("Missing email receipt");
      }
    }

    return json(
      "Thank you. Your enquiry has been submitted. We look forward to learning more about your team.",
      200,
      "received",
    );
  } catch (error) {
    const errorType =
      error instanceof Error &&
      ["TypeError", "SyntaxError", "AbortError", "Error"].includes(error.name)
        ? (error.name as "TypeError" | "SyntaxError" | "AbortError" | "Error")
        : "unknown";
    reportFailure(
      controller.signal.aborted
        ? "timeout"
        : phase === "receipt"
          ? "invalid_receipt"
          : "network_error",
      undefined,
      errorType,
    );
    return json(
      "We could not confirm delivery. Your details are still here. Please save a copy and check with the team before trying again.",
      502,
      "delivery_unknown",
    );
  } finally {
    clearTimeout(timeout);
  }
}
