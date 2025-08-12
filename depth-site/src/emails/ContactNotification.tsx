import {
  Html, Head, Preview, Body, Container, Section, Img, Hr, Text, Link
} from "@react-email/components";

type Props = {
  type: "general" | "pricing" | "support" | "social" | "jobs";
  name: string;
  fromEmail: string;
  message: string;
  brandUrl: string; // e.g. https://depth-agency.com
  requestId?: string;
};

export default function ContactNotification({
  type, name, fromEmail, message, brandUrl, requestId
}: Props) {
  const labelStyle = {
    color: "#666", 
    fontSize: "12px", 
    marginBottom: "4px", 
    fontWeight: "600",
    textTransform: "uppercase" as const
  };
  
  const valueStyle = {
    marginTop: "0",
    marginBottom: "16px", 
    fontSize: "14px",
    lineHeight: "1.5"
  };
  
  const messageBox = {
    background: "#f8f9fa", 
    padding: "16px", 
    borderRadius: "8px", 
    lineHeight: "1.6",
    border: "1px solid #e9ecef",
    whiteSpace: "pre-wrap" as const
  };

  const typeLabels = {
    general: "استفسار عام",
    pricing: "طلب أسعار",
    support: "دعم فني", 
    social: "سوشيال ميديا",
    jobs: "طلب وظيفة"
  };

  const slaMap = {
    general: "24 ساعة",
    pricing: "8 ساعات", 
    support: "6 ساعات",
    social: "12 ساعة",
    jobs: "72 ساعة"
  };

  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>رسالة تواصل جديدة من {name} — Depth</Preview>
      <Body style={{
        background: "#ffffff", 
        color: "#1a1a1a", 
        fontFamily: '"Segoe UI", "Noto Sans Arabic", Tahoma, Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{
          maxWidth: "600px", 
          margin: "0 auto", 
          padding: "24px"
        }}>
          {/* Header with Logo - Full Logo SVG */}
          <Section style={{textAlign: "center", marginBottom: "24px", direction: "ltr"}}>
            <Img 
              src={`${brandUrl}/brand/logo-full.svg`} 
              alt="Depth Agency" 
              width="180" 
              height="40"
              style={{margin: "0 auto"}}
            />
          </Section>

          {/* Status Badge */}
          <Section style={{textAlign: "center", marginBottom: "24px"}}>
            <span style={{
              background: "#621cf0", 
              color: "white", 
              padding: "8px 16px", 
              borderRadius: "20px", 
              display: "inline-block", 
              fontWeight: "600",
              fontSize: "14px"
            }}>
              📧 رسالة تواصل جديدة
            </span>
          </Section>

          {/* Main Content */}
          <Section style={{
            background: "#f8f9fa",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e9ecef"
          }}>
            <Text style={labelStyle}>الاسم</Text>
            <Text style={valueStyle}>{name}</Text>

            <Text style={labelStyle}>البريد الإلكتروني</Text>
            <Text style={valueStyle}>
              <Link 
                href={`mailto:${fromEmail}`}
                style={{color: "#621cf0", textDecoration: "none"}}
              >
                {fromEmail}
              </Link>
            </Text>

            <Text style={labelStyle}>نوع الطلب</Text>
            <Text style={valueStyle}>
              <span style={{
                background: "#621cf0",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                {typeLabels[type]} — SLA: {slaMap[type]}
              </span>
            </Text>

            <Text style={labelStyle}>نص الرسالة</Text>
            <div style={messageBox}>
              {message}
            </div>

            {requestId && (
              <>
                <Text style={labelStyle}>معرف الطلب</Text>
                <Text style={{...valueStyle, fontFamily: "monospace", fontSize: "12px", color: "#666"}}>
                  {requestId}
                </Text>
              </>
            )}
          </Section>

          {/* Quick Reply Section */}
          <Section style={{
            background: "#621cf0",
            padding: "16px",
            borderRadius: "12px",
            margin: "16px 0",
            textAlign: "center"
          }}>
            <Text style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              margin: "0 0 8px 0"
            }}>
              رد سريع
            </Text>
            <Link 
              href={`mailto:${fromEmail}?subject=Re: [${type.toUpperCase()}] طلبك لدى Depth&body=شكراً لك ${name} على تواصلك معنا.%0A%0A`}
              style={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "600"
              }}
            >
              ✉️ رد الآن
            </Link>
          </Section>

          <Hr style={{
            borderColor: "#e9ecef", 
            margin: "24px 0",
            borderTop: "1px solid #e9ecef"
          }}/>

          {/* Footer */}
          <Section style={{textAlign: "center"}}>
            <Text style={{
              fontSize: "12px", 
              color: "#666",
              margin: "0 0 8px 0"
            }}>
              تم الإرسال من نموذج التواصل على الموقع
            </Text>
            <Link 
              href={brandUrl}
              style={{
                color: "#621cf0", 
                textDecoration: "none",
                fontSize: "12px",
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
export function renderContactNotificationText(props: Props) {
  const { type, name, fromEmail, message, requestId } = props;
  const typeLabels = {
    general: "استفسار عام",
    pricing: "طلب أسعار", 
    support: "دعم فني",
    social: "سوشيال ميديا",
    jobs: "طلب وظيفة"
  };

  return `
رسالة تواصل جديدة — Depth

الاسم: ${name}
البريد: ${fromEmail}
النوع: ${typeLabels[type]}
${requestId ? `معرف الطلب: ${requestId}` : ''}

الرسالة:
${message}

---
تم الإرسال من: depth-agency.com
للرد: ${fromEmail}
  `.trim();
}