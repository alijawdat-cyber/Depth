import { 
  Html, Head, Preview, Body, Container, Section, Img, Text, Link, Hr 
} from "@react-email/components";

type Props = {
  type: "general" | "pricing" | "support" | "press" | "jobs";
  name: string;
  brandUrl: string;
};

const SLAs = { 
  general: "خلال 24 ساعة", 
  pricing: "خلال 8 ساعات", 
  support: "خلال 6 ساعات", 
  press: "خلال 24 ساعة", 
  jobs: "خلال 72 ساعة" 
} as const;

const teamNames = {
  general: "خدمة العملاء",
  pricing: "فريق المبيعات",
  support: "فريق الدعم الفني",
  press: "فريق العلاقات الإعلامية",
  jobs: "فريق الموارد البشرية"
};

const icons = {
  general: "💬",
  pricing: "💰", 
  support: "🔧",
  press: "📰",
  jobs: "👥"
};

export default function ContactAutoReply({ type, name, brandUrl }: Props) {
  const eta = SLAs[type] ?? SLAs.general;
  const teamName = teamNames[type];
  const icon = icons[type];
  
  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>شكراً لك {name} - استلمنا رسالتك!</Preview>
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
          <Section style={{textAlign: "center", marginBottom: "32px"}}>
            <Img 
              src={`${brandUrl}/brand/logo-512.png`} 
              alt="Depth" 
              width="80" 
              height="80"
              style={{borderRadius: "16px"}}
            />
          </Section>

          {/* Main Content */}
          <Section style={{textAlign: "center", marginBottom: "32px"}}>
            <Text style={{
              fontSize: "24px", 
              fontWeight: "700",
              margin: "0 0 16px 0",
              color: "#1a1a1a"
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
                href={`mailto:${type === "pricing" ? "sales" : type === "support" ? "support" : type === "press" ? "press" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com`}
                style={{color: "#621cf0", textDecoration: "none"}}
              >
                {type === "pricing" ? "sales" : type === "support" ? "support" : type === "press" ? "press" : type === "jobs" ? "jobs" : "hello"}@depth-agency.com
              </Link>
            </Text>
            
            <Text style={{
              fontSize: "14px",
              margin: "0",
              color: "#4a5568"
            }}>
              📱 واتساب: <strong>سيتم إضافة الرقم لاحقاً</strong>
            </Text>
          </Section>

          <Hr style={{
            borderColor: "#e9ecef", 
            margin: "24px 0"
          }}/>

          {/* Footer */}
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
