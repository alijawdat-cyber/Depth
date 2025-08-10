import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { renderContactEmail } from "@/lib/emailTemplate";

const EMAIL_FROM = process.env.EMAIL_FROM || "Depth <hello@depth-agency.com>";
const EMAIL_TO = process.env.EMAIL_TO || "admin@depth-agency.com";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5),
  source: z.string().optional(),
  honeypot: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    const { name, email, message, source, honeypot } = parsed.data;
    if (honeypot) {
      // bot
      return NextResponse.json({ ok: true });
    }

    // lazy init Resend to avoid build-time failures
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("contact route: missing RESEND_API_KEY env");
      return NextResponse.json({ ok: false, error: "missing_api_key" }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    // send to admin (no-op if no API key yet)
    const subject = `رسالة جديدة من ${name} (${email})`;
    const html = renderContactEmail({ name, email, message, source });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [EMAIL_TO, "hello@depth-agency.com"],
      replyTo: email,
      subject,
      html,
    });
    // confirmation to sender (optional)
    void resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: "تم استلام رسالتك — Depth",
      html: `<p>شكرًا ${name}! استلمنا رسالتك وسنعود لك قريبًا.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact route error", e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


