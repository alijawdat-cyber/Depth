import { 
  Html, Head, Preview, Body, Container, Section, Img, Text, Link, Hr 
} from "@react-email/components";

type Props = {
  type: "general" | "pricing" | "support" | "press" | "jobs";
  name: string;
  brandUrl: string;
  requestId?: string;
  lang?: "ar" | "en";
};

const content = {
  ar: {
    preheader: {
      general: "استلمنا استفسارك—سنرد خلال 24 ساعة",
      pricing: "استلمنا طلب الأسعار—سنرد خلال 8 ساعات",
      support: "استلمنا طلب الدعم—سنرد خلال 6 ساعات", 
      press: "استلمنا الاستفسار الإعلامي—سنرد خلال 24 ساعة",
      jobs: "استلمنا طلب الوظيفة—سنرد خلال 72 ساعة"
    },
    sla: { 
      general: "خلال 24 ساعة", 
      pricing: "خلال 8 ساعات", 
      support: "خلال 6 ساعات", 
      press: "خلال 24 ساعة", 
      jobs: "خلال 72 ساعة" 
    },
    teams: {
      general: "خدمة العملاء",
      pricing: "فريق المبيعات",
      support: "فريق الدعم الفني",
      press: "فريق العلاقات الإعلامية",
      jobs: "فريق الموارد البشرية"
    },
    greeting: "أهلاً وسهلاً",
    thanks: "شكراً لك على تواصلك معنا! استلمنا رسالتك بنجاح وسيقوم",
    willReply: "بالرد عليك",
    expectedResponse: "وقت الاستجابة المتوقع",
    quickContact: "للتواصل السريع:",
    email: "البريد الإلكتروني:",
    whatsapp: "واتساب: سيتم إضافة الرقم لاحقاً",
    regards: "تحياتنا الحارة،",
    team: "فريق Depth",
    tagline: "نبني تجارب رقمية استثنائية",
    requestId: "معرف الطلب:"
  },
  en: {
    preheader: {
      general: "We received your inquiry—will reply within 24 hours",
      pricing: "We received your pricing request—will reply within 8 hours",
      support: "We received your support request—will reply within 6 hours", 
      press: "We received your press inquiry—will reply within 24 hours",
      jobs: "We received your job application—will reply within 72 hours"
    },
    sla: { 
      general: "within 24 hours", 
      pricing: "within 8 hours", 
      support: "within 6 hours", 
      press: "within 24 hours", 
      jobs: "within 72 hours" 
    },
    teams: {
      general: "Customer Service Team",
      pricing: "Sales Team",
      support: "Technical Support Team",
      press: "Media Relations Team",
      jobs: "Human Resources Team"
    },
    greeting: "Hello",
    thanks: "Thank you for contacting us! We have successfully received your message and our",
    willReply: "will reply to you",
    expectedResponse: "Expected Response Time",
    quickContact: "For quick contact:",
    email: "Email:",
    whatsapp: "WhatsApp: Number will be added later",
    regards: "Warm regards,",
    team: "Depth Team",
    tagline: "Building exceptional digital experiences",
    requestId: "Request ID:"
  }
};

const icons = {
  general: "💬",
  pricing: "💰", 
  support: "🔧",
  press: "📰",
  jobs: "👥"
};

export default function ContactAutoReplyBilingual({ type, name, brandUrl, requestId, lang = "ar" }: Props) {
  const t = content[lang];
  const eta = t.sla[type];
  const teamName = t.teams[type];
  const icon = icons[type];
  const preheader = t.preheader[type];
  const isArabic = lang === "ar";
  
  return (
    <Html dir={isArabic ? "rtl" : "ltr"} lang={lang}>
      <Head />
      <Preview>{preheader}</Preview>
      <Body style={{
        background: "#ffffff", 
        color: "#1a1a1a", 
        fontFamily: isArabic ? '"Segoe UI", "Noto Sans Arabic", Tahoma, Arial, sans-serif' : '"Segoe UI", "Inter", Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        {/* Hidden preheader text */}
        <div style={{
          display: "none", 
          overflow: "hidden", 
          lineHeight: "1px", 
          opacity: 0, 
          maxHeight: 0, 
          maxWidth: 0
        }}>
          {preheader}
        </div>

        <Container style={{
          maxWidth: "600px", 
          margin: "0 auto", 
          padding: "24px"
        }}>
          {/* Header with Logo - Full Logo SVG */}
          <Section style={{textAlign: "center", marginBottom: "32px", direction: "ltr"}}>
            <Img 
              src={`${brandUrl}/brand/logo-full.svg`} 
              alt="Depth Agency" 
              width="180" 
              height="40"
              style={{margin: "0 auto"}}
            />
          </Section>

          {/* Main Content */}
          <Section style={{textAlign: "center", marginBottom: "32px"}}>
            <Text style={{
              fontSize: "24px", 
              fontWeight: "700",
              margin: "0 0 16px 0",
              color: "#1a1a1a",
              lineHeight: "1.3"
            }}>
              {t.greeting} {name}! {icon}
            </Text>
            
            <Text style={{
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0 0 24px 0",
              color: "#4a5568"
            }}>
              {t.thanks} <strong>{teamName}</strong> {t.willReply} <strong style={{color: "#621cf0"}}>{eta}</strong>.
            </Text>

            {requestId && (
              <Text style={{
                fontSize: "12px",
                color: "#666",
                fontFamily: "monospace",
                background: "#f8f9fa",
                padding: "8px 12px",
                borderRadius: "6px",
                display: "inline-block",
                margin: "0 0 16px 0"
              }}>
                {t.requestId} {requestId}
              </Text>
            )}
          </Section>

          {/* SLA Box */}
          <Section style={{
            background: "linear-gradient(135deg, #621cf0 0%, #7c3aed 100%)",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            <Text style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              opacity: "0.9"
            }}>
              {t.expectedResponse}
            </Text>
            <Text style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
              margin: "0"
            }}>
              {eta}
            </Text>
          </Section>

          {/* Contact Info */}
          <Section style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "24px"
          }}>
            <Text style={{
              fontSize: "14px",
              fontWeight: "600",
              margin: "0 0 12px 0",
              color: "#2d3748"
            }}>
              {t.quickContact}
            </Text>
            
            <Text style={{
              fontSize: "14px",
              margin: "0 0 8px 0",
              color: "#4a5568"
            }}>
              📧 {t.email} <Link 
                href={`mailto:${type === "pricing" ? "sales" : type === "support" ? "support" : type === "press" ? "press" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com`}
                style={{color: "#621cf0", textDecoration: "none", fontWeight: "600"}}
              >
                {type === "pricing" ? "sales" : type === "support" ? "support" : type === "press" ? "press" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com
              </Link>
            </Text>
            
            <Text style={{
              fontSize: "14px",
              margin: "0",
              color: "#4a5568"
            }}>
              📱 {t.whatsapp}
            </Text>
          </Section>

          <Hr style={{
            borderColor: "#e9ecef", 
            margin: "24px 0"
          }}/>

          {/* Team Signature Footer */}
          <Section style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "16px",
            textAlign: isArabic ? "right" : "left",
            direction: isArabic ? "rtl" : "ltr"
          }}>
            <Text style={{
              fontSize: "14px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              color: "#621cf0"
            }}>
              {teamName}
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#2d3748",
              margin: "0 0 4px 0"
            }}>
              Depth Agency
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#4a5568",
              margin: "0 0 2px 0"
            }}>
              📧 {type === "pricing" ? "sales" : type === "support" ? "support" : type === "press" ? "press" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#4a5568",
              margin: "0 0 2px 0"
            }}>
              🌐 depth-agency.com
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#4a5568",
              margin: "0 0 2px 0"
            }}>
              📱 +964 771 995 6000
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#4a5568",
              margin: "0"
            }}>
              📍 {isArabic ? "بغداد، العراق" : "Baghdad, Iraq"}
            </Text>
          </Section>

          {/* Footer - Unified Branding */}
          <Section style={{textAlign: "center"}}>
            <Text style={{
              fontSize: "16px",
              margin: "0 0 8px 0",
              color: "#2d3748"
            }}>
              {t.regards}<br/>
              <strong style={{color: "#621cf0"}}>{t.team}</strong>
            </Text>
            
            <Text style={{
              fontSize: "12px",
              color: "#666",
              margin: "0 0 8px 0"
            }}>
              {t.tagline}
            </Text>
            
            <Link 
              href={brandUrl}
              style={{
                color: "#621cf0", 
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              depth-agency.com
            </Link>
          </Section>

          {/* Language Toggle Note */}
          <Section style={{
            textAlign: "center",
            marginTop: "24px",
            padding: "12px",
            background: "#f8f9fa",
            borderRadius: "8px"
          }}>
            <Text style={{
              fontSize: "11px",
              color: "#666",
              margin: 0
            }}>
              {isArabic 
                ? "This message is also available in English upon request" 
                : "هذه الرسالة متوفرة أيضاً باللغة العربية عند الطلب"
              }
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Plain-text version for fallback
export function renderContactAutoReplyBilingualText(props: Props) {
  const { type, name, requestId, lang = "ar" } = props;
  const t = content[lang];
  const eta = t.sla[type];
  const teamName = t.teams[type];
  const emailAddr = type === "pricing" ? "sales" : type === "support" ? "support" : type === "press" ? "press" : type === "jobs" ? "jobs" : "hello";

  return `
${t.greeting} ${name}!

${t.thanks} ${teamName} ${t.willReply} ${eta}.

${requestId ? `${t.requestId} ${requestId}` : ''}

${t.quickContact}
📧 ${emailAddr}@depth-agency.com
📱 ${t.whatsapp}

${t.regards}
${t.team}
depth-agency.com
${t.tagline}
  `.trim();
}
