import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Force this route to be dynamic — never statically generated at build time
export const dynamic = "force-dynamic";

// ─── Resend client (lazy init — avoids build-time crash when env var is missing) ───
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  return new Resend(apiKey);
}

// ─── Config ─────────────────────────────────────────────────────────────────
const SUPPORT_EMAIL = "gharpe.help@gmail.com";
const SENDER_EMAIL = "onboarding@resend.dev"; // Resend's testing sender; swap for support@gharpe.space once domain is verified
const MAX_MESSAGE_LENGTH = 2000;
const TIMESTAMP_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes — reject stale requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 messages per minute per email

// ─── Simple in-memory rate limiter (resets on cold start — fine for serverless) ───
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(email, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── HMAC verification (Web Crypto API — works in Edge + Node.js) ──────────
async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison to prevent timing attacks
    if (expected.length !== signature.length) return false;
    let result = 0;
    for (let i = 0; i < expected.length; i++) {
      result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}

// ─── POST handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userName, userEmail, timestamp, signature, pageUrl } = body;

    // 1. Validate required fields
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }
    if (!userName || !userEmail || !timestamp || !signature) {
      return NextResponse.json(
        { error: "Missing authentication fields." },
        { status: 401 }
      );
    }
    if (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // 2. Verify timestamp freshness (anti-replay)
    const ts = Number(timestamp);
    if (isNaN(ts) || Math.abs(Date.now() - ts) > TIMESTAMP_MAX_AGE_MS) {
      return NextResponse.json(
        { error: "Request expired. Please try again." },
        { status: 401 }
      );
    }

    // 3. Verify HMAC signature
    const hmacSecret = process.env.SUPPORT_HMAC_SECRET;
    if (!hmacSecret) {
      console.error("SUPPORT_HMAC_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }
    const payload = `${userName}:${userEmail}:${message.trim()}:${timestamp}`;
    if (!(await verifySignature(payload, signature, hmacSecret))) {
      return NextResponse.json(
        { error: "Invalid request signature." },
        { status: 401 }
      );
    }

    // 4. Rate limiting
    if (!checkRateLimit(userEmail)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // 5. Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // 6. Send email via Resend
    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    });

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #7C3AED, #B56CFF); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">📩 New Support Message — GharPe</h1>
        </div>
        <div style="background: #f8f9fc; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">User Name</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${escapeHtml(userName)}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">User Email</td><td style="padding: 8px 0; font-weight: 600; color: #111827;"><a href="mailto:${escapeHtml(userEmail)}">${escapeHtml(userEmail)}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Date/Time</td><td style="padding: 8px 0; color: #111827;">${escapeHtml(now)}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Page</td><td style="padding: 8px 0; color: #111827;"><a href="${escapeHtml(pageUrl || "N/A")}">${escapeHtml(pageUrl || "N/A")}</a></td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <h3 style="margin: 0 0 8px; color: #374151; font-size: 14px;">Message:</h3>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message.trim())}</div>
        </div>
      </div>
    `;

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: `GharPe Support <${SENDER_EMAIL}>`,
      to: [SUPPORT_EMAIL],
      subject: `Support Message from ${userName} — GharPe`,
      html: htmlContent,
      replyTo: userEmail,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Support API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

/** Minimal HTML escaping to prevent injection in email content */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
