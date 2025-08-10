import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { render } from "@react-email/render";
import ContactNotification from "@/emails/ContactNotification";
import ContactAutoReply from "@/emails/ContactAutoReply";

// Smart Routing Configuration
type Inquiry = "pricing" | "support" | "press" | "jobs" | "general";

const ROUTING_MAP: Record<Inquiry, string> = {
  pricing: "sales@depth-agency.com",
  support: "support@depth-agency.com", 
  press: "press@depth-agency.com",
  jobs: "jobs@depth-agency.com",
  general: "hello@depth-agency.com"
};

// Environment Configuration
const EMAIL_FROM = process.env.MAIL_FROM || "Depth <no-reply@depth-agency.com>";
const EMAIL_CC_ADMIN = process.env.MAIL_CC_ADMIN || "admin@depth-agency.com";
const BRAND_URL = process.env.BRAND_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://depth-agency.com";
const DRY_RUN = process.env.MAIL_DRY_RUN === "1";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5),
  type: z.enum(["general", "pricing", "support", "press", "jobs"]).default("general"),
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
    
    const { name, email, message, type, source, honeypot } = parsed.data;
    
    // Honeypot anti-spam check
    if (honeypot?.trim()) {
      console.log("Spam detected via honeypot, ignoring request");
      return NextResponse.json({ ok: true }); // Return success to not alert bots
    }

    // Smart Routing: Get target email based on inquiry type
    const targetEmail = ROUTING_MAP[type] || ROUTING_MAP.general;
    const subject = `[${type.toUpperCase()}] رسالة تواصل جديدة — Depth`;

    // Generate professional email templates
    const teamEmailHtml = render(ContactNotification({ 
      type, 
      name, 
      fromEmail: email, 
      message, 
      brandUrl: BRAND_URL 
    }));

    const autoreplyHtml = render(ContactAutoReply({ 
      type, 
      name, 
      brandUrl: BRAND_URL 
    }));

    // Auto-reply subject lines
    const autoreplySubjects = {
      general: "شكراً لك - سنعود إليك خلال 24 ساعة",
      pricing: "طلب عرض أسعار - سنعود إليك خلال 8 ساعات", 
      support: "طلب دعم فني - سنعود إليك خلال 6 ساعات",
      press: "استفسار إعلامي - سنعود إليك خلال 24 ساعة",
      jobs: "طلب وظيفة - سنعود إليك خلال 72 ساعة"
    };

    // DRY-RUN Mode: Log without sending
    if (DRY_RUN) {
      console.log("DRY-RUN Email Configuration:", {
        to: targetEmail,
        cc: EMAIL_CC_ADMIN,
        from: EMAIL_FROM,
        subject,
        type,
        autoreplySubject: autoreplySubjects[type],
        brandUrl: BRAND_URL,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        ok: true, 
        mode: "dry-run", 
        to: targetEmail,
        cc: EMAIL_CC_ADMIN
      });
    }

    // Production Mode: Send actual emails
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("contact route: missing RESEND_API_KEY env");
      return NextResponse.json({ ok: false, error: "missing_api_key" }, { status: 500 });
    }
    
    const resend = new Resend(apiKey);

    // 1) Send to appropriate department with admin CC
    await resend.emails.send({
      from: EMAIL_FROM,
      to: [targetEmail],
      cc: [EMAIL_CC_ADMIN],
      replyTo: email,
      subject,
      html: teamEmailHtml,
    });

    // 2) Send branded autoreply to user
    await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: autoreplySubjects[type],
      html: autoreplyHtml,
    });

    console.log(`Email routed successfully: ${type} -> ${targetEmail} + autoreply sent`);
    return NextResponse.json({ ok: true, sent: true });
    
  } catch (e) {
    console.error("contact route error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}