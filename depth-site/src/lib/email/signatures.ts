interface DepartmentConfig {
  name: string;
  title: string;
  email: string;
  tagline: string;
}

const DEPARTMENT_CONFIG: Record<string, DepartmentConfig> = {
  admin: {
    name: "علي جودت",
    title: "المؤسس والمدير العام",
    email: "admin@depth-agency.com",
    tagline: "وكالة محتوى وتسويق أداء"
  },
  hello: {
    name: "فريق خدمة العملاء",
    title: "Depth Agency",
    email: "hello@depth-agency.com",
    tagline: "🚀 نحن هنا لمساعدتك! تواصل معنا في أي وقت"
  },
  sales: {
    name: "فريق المبيعات",
    title: "Depth Agency",
    email: "sales@depth-agency.com",
    tagline: "💰 احصل على عرض أسعار مخصص لمشروعك"
  },
  support: {
    name: "فريق الدعم الفني",
    title: "Depth Agency",
    email: "support@depth-agency.com",
    tagline: "🔧 نحن هنا لحل مشاكلك التقنية بسرعة"
  },
  billing: {
    name: "فريق المحاسبة",
    title: "Depth Agency",
    email: "billing@depth-agency.com",
    tagline: "💼 خدمات محاسبية دقيقة وشفافة لنجاح أعمالك"
  },
  invoices: {
    name: "فريق الفواتير",
    title: "Depth Agency",
    email: "invoices@depth-agency.com",
    tagline: "🧾 إدارة احترافية للفواتير والمدفوعات"
  },
  jobs: {
    name: "فريق التوظيف",
    title: "Depth Agency",
    email: "jobs@depth-agency.com",
    tagline: "👥 انضم لفريقنا المتميز! فرص مهنية رائعة بانتظارك"
  },
  legal: {
    name: "فريق الشؤون القانونية",
    title: "Depth Agency",
    email: "legal@depth-agency.com",
    tagline: "⚖️ استشارات قانونية موثوقة لحماية أعمالك"
  },
  marketing: {
    name: "فريق التسويق",
    title: "Depth Agency",
    email: "marketing@depth-agency.com",
    tagline: "📈 نساعدك في الوصول لجمهورك المثالي بإبداع"
  },
  social: {
    name: "فريق السوشيال ميديا",
    title: "Depth Agency",
    email: "social@depth-agency.com",
    tagline: "📱 نبني حضورك الرقمي بمحتوى إبداعي يجذب العملاء"
  },
  studio: {
    name: "فريق الإنتاج الداخلي",
    title: "Depth Agency",
    email: "studio@depth-agency.com",
    tagline: "🎨 نحول أفكارك لأعمال إبداعية متميزة"
  }
};

const COMMON_INFO = {
  website: "depth-agency.com",
  phone: "+964 777 976 1547",
  location: "بغداد، العراق",
  logo: "https://depth-agency.com/brand/icon-apple-512.png"
};

export function generateHTMLSignature(department: string): string {
  const config = DEPARTMENT_CONFIG[department];
  if (!config) {
    throw new Error(`Department "${department}" not found`);
  }

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        * { direction: rtl; text-align: right; }
        .signature-container { font-family: 'Dubai', 'Segoe UI', 'Tahoma', Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.4; max-width: 600px; background: #ffffff; }
        .logo-section { margin-bottom: 20px; text-align: center; width: 100%; direction: ltr; }
        .logo-section img { display: block; width: 180px; height: auto; margin: 0 auto; }
        .main-content { border-right: 3px solid #5e17eb; padding-right: 15px; }
        .name { font-weight: bold; font-size: 16px; color: #5e17eb; margin-bottom: 3px; }
        .title { color: #666666; margin-bottom: 10px; font-size: 14px; }
        .contact-info { margin: 10px 0; }
        .contact-item { margin: 3px 0; color: #333333; }
        .tagline { font-size: 12px; color: #5e17eb; font-weight: bold; margin-top: 8px; }
    </style>
</head>
<body>
    <div class="signature-container">
        <div class="logo-section">
            <img src="${COMMON_INFO.logo}" alt="Depth Agency" />
        </div>
        <div class="main-content">
            <div class="name">${config.name}</div>
            <div class="title">${config.title}</div>
            <div class="contact-info">
                <div class="contact-item">📧 ${config.email}</div>
                <div class="contact-item">🌐 ${COMMON_INFO.website}</div>
                <div class="contact-item">📱 ${COMMON_INFO.phone}</div>
                <div class="contact-item">📍 ${COMMON_INFO.location}</div>
            </div>
            <div class="tagline">${config.tagline}</div>
        </div>
    </div>
</body>
</html>`;
}

export function generateTextSignature(department: string): string {
  const config = DEPARTMENT_CONFIG[department];
  if (!config) {
    throw new Error(`Department "${department}" not found`);
  }

  return `
${config.name}
${config.title}

📧 ${config.email}
🌐 ${COMMON_INFO.website}
📱 ${COMMON_INFO.phone}
📍 ${COMMON_INFO.location}

${config.tagline}

---
Depth Agency - محتوى يحرك النتائج
`;
}

export function generateAllSignatures(): Record<string, { html: string; text: string }> {
  const signatures: Record<string, { html: string; text: string }> = {};
  Object.keys(DEPARTMENT_CONFIG).forEach(department => {
    signatures[department] = {
      html: generateHTMLSignature(department),
      text: generateTextSignature(department)
    };
  });
  return signatures;
}

export function getAvailableDepartments(): string[] {
  return Object.keys(DEPARTMENT_CONFIG);
}

export function getDepartmentInfo(department: string): DepartmentConfig | null {
  return DEPARTMENT_CONFIG[department] || null;
}



