import {
  Html, Head, Preview, Body, Container, Section, Img, Hr, Text, Link, Heading
} from "@react-email/components";

type Props = {
  type: "general" | "pricing" | "support" | "press" | "jobs";
  name: string;
  fromEmail: string;
  message: string;
  brandUrl: string; // e.g. https://depth-agency.com
};

export default function ContactNotification({
  type, name, fromEmail, message, brandUrl,
}: Props) {
  const pill = {
    background: "#621cf0", 
    color: "white", 
    padding: "8px 16px", 
    borderRadius: "20px", 
    display: "inline-block", 
    fontWeight: "600",
    fontSize: "14px"
  };
  
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
    press: "استفسار إعلامي",
    jobs: "طلب وظيفة"
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
          {/* Header with Logo */}
          <Section style={{textAlign: "center", marginBottom: "24px"}}>
            <Img 
              src={`${brandUrl}/brand/logo-512.png`} 
              alt="Depth" 
              width="64" 
              height="64"
              style={{borderRadius: "12px"}}
            />
          </Section>

          {/* Status Badge */}
          <Section style={{textAlign: "center", marginBottom: "24px"}}>
            <span style={pill}>
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
                {typeLabels[type]}
              </span>
            </Text>

            <Text style={labelStyle}>نص الرسالة</Text>
            <div style={messageBox}>
              {message}
            </div>
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
