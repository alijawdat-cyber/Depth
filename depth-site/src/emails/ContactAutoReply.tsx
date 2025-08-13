import { 
  Html, Head, Preview, Body, Container, Section, Img, Text, Link, Hr 
} from "@react-email/components";
import { getSiteUrl } from "@/lib/constants/site";
import { SLA_MAP } from "@/config/inquiry";
import { ORG } from "@/lib/constants/org";

type Props = {
  type: "general" | "pricing" | "support" | "social" | "jobs";
  name: string;
  brandUrl: string;
  requestId?: string;
};

const SLAs = {
  general: `خلال ${SLA_MAP.general}`,
  pricing: `خلال ${SLA_MAP.pricing}`,
  support: `خلال ${SLA_MAP.support}`,
  social: `خلال ${SLA_MAP.social}`,
  jobs: `خلال ${SLA_MAP.jobs}`,
} as const;

const teamNames = {
  general: "خدمة العملاء",
  pricing: "فريق المبيعات",
  support: "فريق الدعم الفني",
  social: "فريق السوشيال ميديا",
  jobs: "فريق الموارد البشرية"
};

const icons = {
  general: "💬",
  pricing: "💰", 
  support: "🔧",
  social: "📱",
  jobs: "👥"
};

const preheaderText = {
  general: "استلمنا استفسارك—سنرد خلال 24 ساعة",
  pricing: "استلمنا طلب الأسعار—سنرد خلال 8 ساعات",
  support: "استلمنا طلب الدعم—سنرد خلال 6 ساعات", 
  social: "استلمنا طلب السوشيال ميديا—سنرد خلال 12 ساعة",
  jobs: "استلمنا طلب الوظيفة—سنرد خلال 72 ساعة"
};

export default function ContactAutoReply({ type, name, brandUrl, requestId }: Props) {
  const eta = SLAs[type] ?? SLAs.general;
  const teamName = teamNames[type];
  const icon = icons[type];
  const preheader = preheaderText[type];
  
  return (
    <Html dir="rtl" lang="ar">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={{
        background: "#ffffff", 
        color: "#1a1a1a", 
        fontFamily: '"Segoe UI", "Noto Sans Arabic", Tahoma, Arial, sans-serif',
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
          {/* Header with Logo - Full Logo SVG with fallback */}
          <Section style={{textAlign: "center", marginBottom: "24px", direction: "ltr"}}>
            <Img 
              src={`${brandUrl || getSiteUrl()}/brand/logo-wordmark.svg`} 
              alt="Depth Agency logo" 
              width="180" 
              height="40"
              style={{margin: "0 auto", display: "block"}}
            />
            <Text style={{ fontSize: "12px", color: "#6b7280", margin: "8px 0 0 0" }}>
              <span style={{direction: "ltr", unicodeBidi: "bidi-override"}}>Depth Agency</span>
            </Text>
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
              أهلاً وسهلاً {name}! {icon}
            </Text>
            
            <Text style={{
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0 0 24px 0",
              color: "#4a5568"
            }}>
              شكراً لك على تواصلك معنا! استلمنا رسالتك بنجاح وسيقوم <strong>{teamName}</strong> بالرد عليك <strong style={{color: "#621cf0"}}>{eta}</strong>.
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
                معرف الطلب: {requestId}
              </Text>
            )}
          </Section>

          {/* SLA Box */}
          <Section style={{
            background: "linear-gradient(135deg, #621cf0 0%, #6e42f0 100%)",
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
              وقت الاستجابة المتوقع
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
              للتواصل السريع:
            </Text>
            
            <Text style={{
              fontSize: "14px",
              margin: "0 0 8px 0",
              color: "#4a5568"
            }}>
              📧 البريد الإلكتروني: <Link 
                href={`mailto:${type === "pricing" ? "sales" : type === "support" ? "support" : type === "social" ? "social" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com`}
                style={{color: "#621cf0", textDecoration: "none", fontWeight: "600"}}
              >
                <span style={{direction: "ltr", unicodeBidi: "bidi-override", whiteSpace: "nowrap"}}>
                  {type === "pricing" ? "sales" : type === "support" ? "support" : type === "social" ? "social" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com
                </span>
              </Link>
            </Text>
            
            <Text style={{
              fontSize: "14px",
              margin: "0",
              color: "#4a5568"
            }}>
              📱 واتساب: <Link href={`https://wa.me/${ORG.phoneIntl.replace(/\D/g,'')}`} style={{color: "#621cf0", textDecoration: "none", fontWeight: "600"}}>
                <span style={{direction: "ltr", unicodeBidi: "bidi-override", whiteSpace: "nowrap"}}>+964 777 976 1547</span>
              </Link>
              {" "}| هاتف: <Link href="tel:+9647779761547" style={{color: "#621cf0", textDecoration: "none", fontWeight: "600"}}>
                <span style={{direction: "ltr", unicodeBidi: "bidi-override", whiteSpace: "nowrap"}}>+964 777 976 1547</span>
              </Link>
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
            textAlign: "right",
            direction: "rtl"
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
              📧 {type === "pricing" ? "sales" : type === "support" ? "support" : type === "social" ? "social" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com
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
              📱 +964 777 976 1547
            </Text>
            <Text style={{
              fontSize: "12px",
              color: "#4a5568",
              margin: "0"
            }}>
              📍 بغداد، العراق
            </Text>
          </Section>

          {/* Main Footer */}
          <Section style={{textAlign: "center"}}>
            <Text style={{
              fontSize: "16px",
              margin: "0 0 8px 0",
              color: "#2d3748"
            }}>
              تحياتنا الحارة،<br/>
              <strong style={{color: "#621cf0"}}>فريق Depth</strong>
            </Text>
            
            <Text style={{
              fontSize: "12px",
              color: "#666",
              margin: "0 0 8px 0"
            }}>
              نبني تجارب رقمية استثنائية
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
        </Container>
      </Body>
    </Html>
  );
}

// Plain-text version for fallback
export function renderContactAutoReplyText(props: Props) {
  const { type, name, requestId } = props;
  const eta = SLAs[type] ?? SLAs.general;
  const teamName = teamNames[type];
  const emailAddr = type === "pricing" ? "sales" : type === "support" ? "support" : type === "social" ? "social" : type === "jobs" ? "jobs" : "hello";

  return `
أهلاً وسهلاً ${name}!

شكراً لك على تواصلك معنا! استلمنا رسالتك بنجاح وسيقوم ${teamName} بالرد عليك ${eta}.

${requestId ? `معرف الطلب: ${requestId}` : ''}

للتواصل السريع:
📧 ${emailAddr}@depth-agency.com
📱 واتساب: +964 777 976 1547

تحياتنا الحارة،
فريق Depth
depth-agency.com
نبني تجارب رقمية استثنائية
  `.trim();
}