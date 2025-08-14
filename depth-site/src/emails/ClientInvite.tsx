import {
  Html, Head, Preview, Body, Container, Section, Img, Text, Link, Hr
} from "@react-email/components";
import { getSiteUrl } from "@/lib/constants/site";

type Props = {
  recipientName?: string;
  inviteUrl: string;
  brandUrl?: string;
};

export default function ClientInvite({ recipientName, inviteUrl, brandUrl }: Props) {
  const safeBrand = brandUrl || getSiteUrl();
  const preheader = "دعوة للانضمام إلى بوابة Depth";

  return (
    <Html dir="rtl" lang="ar">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={{ background: "#ffffff", color: "#1a1a1a", fontFamily: '"Segoe UI", "Noto Sans Arabic", Tahoma, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}>
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "16px", direction: "ltr" }}>
            <Img src={`${safeBrand}/brand/logo-wordmark.svg`} alt="Depth Agency" width="180" height="40" style={{ margin: "0 auto" }} />
          </Section>

          {/* Title */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Text style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>مرحباً {recipientName || ""} 👋</Text>
            <Text style={{ fontSize: "16px", color: "#475569", margin: "8px 0 0 0" }}>
              تمت دعوتك للانضمام إلى <strong>بوابة العميل الخاصة بـ Depth</strong> لمتابعة مشاريعك والملفات والموافقات بكل سهولة.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ background: "#f8f9fa", padding: "24px", borderRadius: "12px", textAlign: "center", border: "1px solid #e9ecef" }}>
            <Link
              href={inviteUrl}
              style={{ display: "inline-block", background: "#6C4CF5", color: "#fff", textDecoration: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: 700 }}
            >
              فتح البوابة وتسجيل الدخول
            </Link>
            <Text style={{ fontSize: "12px", color: "#64748b", margin: "12px 0 0 0", direction: "ltr" }}>
              {inviteUrl}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e9ecef", margin: "24px 0" }} />

          {/* Tips */}
          <Section style={{ background: "#f8f9fa", padding: "16px", borderRadius: "12px" }}>
            <Text style={{ fontSize: "14px", color: "#1f2937", margin: 0, fontWeight: 600 }}>ما الذي ستحصل عليه داخل البوابة؟</Text>
            <Text style={{ fontSize: "14px", color: "#475569", margin: "8px 0 0 0" }}>
              • متابعة التقدم والإحصاءات
              <br />• رفع وتنزيل الملفات
              <br />• الموافقات والتنبيهات الفورية
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", marginTop: "16px" }}>
            <Text style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>إذا لم تطلب هذه الدعوة يمكنك تجاهل هذا البريد.</Text>
            <Link href={safeBrand} style={{ color: "#6C4CF5", textDecoration: "none", fontSize: "12px", fontWeight: 600, display: "inline-block", marginTop: "8px" }}>depth-agency.com</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function renderClientInviteText({ recipientName, inviteUrl }: Props) {
  return `مرحباً ${recipientName || ''}\n\nتمت دعوتك للانضمام إلى بوابة العميل الخاصة بـ Depth.\nافتح الرابط التالي لتسجيل الدخول:\n${inviteUrl}\n\nإذا لم تطلب هذه الدعوة يمكنك تجاهل هذا البريد.`.trim();
}


