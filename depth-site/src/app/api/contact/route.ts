import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { render } from "@react-email/render";
import { v4 as uuidv4 } from "uuid";
import ContactNotification, { renderContactNotificationText } from "@/emails/ContactNotification";
import ContactAutoReply, { renderContactAutoReplyText } from "@/emails/ContactAutoReply";

// Smart Routing Configuration
type Inquiry = "pricing" | "support" | "social" | "jobs" | "general";

const ROUTING_MAP: Record<Inquiry, string> = {
  pricing: "sales@depth-agency.com",
  support: "support@depth-agency.com", 
  social: "social@depth-agency.com",
  jobs: "jobs@depth-agency.com",
  general: "hello@depth-agency.com"
};

// Environment Configuration
const EMAIL_FROM = process.env.MAIL_FROM || "Depth <no-reply@depth-agency.com>";
const EMAIL_CC_ADMIN = process.env.MAIL_CC_ADMIN || "admin@depth-agency.com";
const BRAND_URL = process.env.BRAND_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://depth-agency.com";
// DRY_RUN disabled for production - emails will always be sent
// const DRY_RUN = false;

const schema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  message: z.string().min(10, "الرسالة يجب أن تكون أكثر من 10 أحرف"),
  type: z.enum(["general", "pricing", "support", "social", "jobs"]).default("general"),
  source: z.string().optional(),
  honeypot: z.string().optional(),
});

// Rate limiting storage (in production, use Redis/database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3; // 3 requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  current.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({ 
        ok: false, 
        error: "rate_limit", 
        message: "تم إرسال عدد كبير من الطلبات. حاول مرة أخرى خلال 10 دقائق" 
      }, { status: 429 });
    }

    const json = await req.json();
    const parsed = schema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ 
        ok: false, 
        error: "validation", 
        details: parsed.error.issues 
      }, { status: 400 });
    }
    
    const { name, email, message, type, source, honeypot } = parsed.data;
    
    // Honeypot anti-spam check
    if (honeypot?.trim()) {
      console.log("Spam detected via honeypot, ignoring request");
      return NextResponse.json({ ok: true }); // Return success to not alert bots
    }

    // Generate unique request ID for tracking
    const requestId = uuidv4();
    const userAgent = req.headers.get("user-agent") || "";

    // Smart Routing: Get target email based on inquiry type
    const targetEmail = ROUTING_MAP[type] || ROUTING_MAP.general;
    
    // Enhanced subject with prefix
    const subject = `[DEPTH] ${type.toUpperCase()} — رسالة تواصل جديدة`;

    // Generate professional email templates with multipart (HTML + text)
    const teamEmailHtml = await render(ContactNotification({ 
      type, 
      name, 
      fromEmail: email, 
      message, 
      brandUrl: BRAND_URL,
      requestId
    }));

    const teamEmailText = renderContactNotificationText({
      type, 
      name, 
      fromEmail: email, 
      message, 
      brandUrl: BRAND_URL,
      requestId
    });

    const autoreplyHtml = await render(ContactAutoReply({ 
      type, 
      name, 
      brandUrl: BRAND_URL,
      requestId
    }));

    const autoreplyText = renderContactAutoReplyText({ 
      type, 
      name, 
      brandUrl: BRAND_URL,
      requestId
    });

    // Auto-reply subject lines with prefix
    const autoreplySubjects = {
      general: "[DEPTH] تأكيد استلام — سنعود إليك خلال 24 ساعة",
      pricing: "[DEPTH] طلب عرض أسعار — سنعود إليك خلال 8 ساعات", 
      support: "[DEPTH] طلب دعم فني — سنعود إليك خلال 6 ساعات",
      social: "[DEPTH] طلب سوشيال ميديا — سنعود إليك خلال 12 ساعة",
      jobs: "[DEPTH] طلب وظيفة — سنعود إليك خلال 72 ساعة"
    };

    // Enhanced logging
    const logData = {
      requestId,
      type,
      clientIP,
      userAgent,
      to: targetEmail,
      cc: EMAIL_CC_ADMIN,
      from: EMAIL_FROM,
      subject,
      autoreplySubject: autoreplySubjects[type],
      brandUrl: BRAND_URL,
      timestamp: new Date().toISOString(),
      mode: "PRODUCTION_EMAILS_ENABLED"
    };

    // DRY_RUN is disabled - proceeding with actual email sending
    console.log("📧 SENDING REAL EMAILS - Production Mode:", logData);

    // Production Mode: Send actual emails
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("contact route: missing RESEND_API_KEY env");
      return NextResponse.json({ ok: false, error: "missing_api_key" }, { status: 500 });
    }
    
    const resend = new Resend(apiKey);

    // Custom headers for tracking and analytics
    const customHeaders = {
      "X-Depth-Request-Type": type,
      "X-Depth-Request-Id": requestId,
      "X-Depth-Source": source || "contact-form",
      "X-Depth-Version": "2.0"
    };

    // 1) Send to appropriate department with admin CC (multipart)
    const teamEmailResult = await resend.emails.send({
      from: EMAIL_FROM,
      to: [targetEmail],
      cc: [EMAIL_CC_ADMIN],
      replyTo: email,
      subject,
      html: teamEmailHtml,
      text: teamEmailText,
      headers: customHeaders,
    });

    console.log("✅ Team email sent successfully:", {
      requestId,
      emailId: teamEmailResult.data?.id,
      to: targetEmail,
      cc: EMAIL_CC_ADMIN
    });

    // 2) Send branded autoreply to user (multipart)
    const autoreplyResult = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: autoreplySubjects[type],
      html: autoreplyHtml,
      text: autoreplyText,
      headers: {
        ...customHeaders,
        "X-Depth-Email-Type": "autoreply"
      },
    });

    console.log("✅ Auto-reply sent successfully:", {
      requestId,
      emailId: autoreplyResult.data?.id,
      to: email
    });

    // Enhanced success logging
    console.log(`Email routed successfully:`, {
      requestId,
      type,
      route: `${type} -> ${targetEmail}`,
      autoreply: "sent",
      clientIP,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      ok: true, 
      sent: true, 
      requestId,
      estimatedResponse: {
        general: "24 ساعة",
        pricing: "8 ساعات",
        support: "6 ساعات", 
        social: "12 ساعة",
        jobs: "72 ساعة"
      }[type]
    });
    
  } catch (e) {
    console.error("contact route error", e);
    return NextResponse.json({ 
      ok: false, 
      error: "server_error",
      message: "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى"
    }, { status: 500 });
  }
}