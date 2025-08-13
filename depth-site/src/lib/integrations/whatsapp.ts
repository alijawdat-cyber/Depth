// WhatsApp automation and messaging utilities
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "9647779761547";

export interface WhatsAppMessageOptions {
  type: 'package' | 'service' | 'booking' | 'general' | 'pricing';
  packageName?: string;
  serviceName?: string;
  details?: string;
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function generateWhatsAppMessage(options: WhatsAppMessageOptions): string {
  const { type, packageName, serviceName, details, userInfo } = options;
  
  const baseGreeting = "مرحباً! أتواصل معكم من موقع Depth Agency";
  const signature = "\n\n---\nDepth Agency\n🎬 Performance + Content Marketing\n📍 Baghdad - Equipped Studio\n🌐 depth-agency.com";
  
  switch (type) {
    case 'package':
      return `${baseGreeting}
      
🎯 *استفسار عن الباقة: ${packageName}*

أود الحصول على تفاصيل أكثر عن:
• الخدمات المشمولة بالباقة
• مواعيد البدء المتاحة  
• إمكانية التخصيص حسب احتياجاتي
• طرق الدفع المتاحة
• مدة التنفيذ المتوقعة

${userInfo?.name ? `الاسم: ${userInfo.name}` : ''}
${userInfo?.email ? `البريد: ${userInfo.email}` : ''}
${userInfo?.phone ? `الهاتف: ${userInfo.phone}` : ''}
${details ? `\nتفاصيل إضافية: ${details}` : ''}

أنتظر ردكم لمناقشة التفاصيل وبدء التعاون.${signature}`;

    case 'service':
      return `${baseGreeting}
      
🎬 *استفسار عن خدمة: ${serviceName}*

أرغب في معرفة المزيد عن:
• نطاق الخدمة وما تشمله
• الأسعار والباقات المتاحة
• نماذج من الأعمال السابقة
• المدة الزمنية للتنفيذ
• متطلبات البدء

${userInfo?.name ? `الاسم: ${userInfo.name}` : ''}
${userInfo?.email ? `البريد: ${userInfo.email}` : ''}
${userInfo?.phone ? `الهاتف: ${userInfo.phone}` : ''}
${details ? `\nوصف المشروع: ${details}` : ''}

متحمس لمناقشة مشروعي معكم!${signature}`;

    case 'booking':
      return `${baseGreeting}
      
📅 *طلب حجز جلسة تصوير/استشارة*

أود حجز موعد لـ:
• مناقشة مشروع جديد
• جلسة تصوير في الاستوديو
• استشارة تسويقية
• مراجعة استراتيجية المحتوى

المواعيد المفضلة:
${details ? details : '• [يرجى تحديد المواعيد المناسبة]'}

معلومات التواصل:
${userInfo?.name ? `الاسم: ${userInfo.name}` : ''}
${userInfo?.email ? `البريد: ${userInfo.email}` : ''}
${userInfo?.phone ? `الهاتف: ${userInfo.phone}` : ''}

أتطلع لموعدنا قريباً!${signature}`;

    case 'pricing':
      return `${baseGreeting}
      
💰 *استفسار عن الأسعار والباقات*

أود الحصول على:
• جدول أسعار مفصل لجميع الخدمات
• مقارنة بين الباقات المختلفة  
• إمكانية التخصيص والتعديل
• العروض والخصومات المتاحة
• طرق الدفع والتقسيط

نوع المشروع/الخدمة المطلوبة:
${details ? details : '[يرجى تحديد نوع الخدمة]'}

${userInfo?.name ? `الاسم: ${userInfo.name}` : ''}
${userInfo?.email ? `البريد: ${userInfo.email}` : ''}
${userInfo?.phone ? `الهاتف: ${userInfo.phone}` : ''}

شكراً لكم!${signature}`;

    default:
      return `${baseGreeting}
      
🤝 *استفسار عام*

${details ? details : 'أود الاستفسار عن خدماتكم وكيفية التعاون معكم.'}

${userInfo?.name ? `الاسم: ${userInfo.name}` : ''}
${userInfo?.email ? `البريد: ${userInfo.email}` : ''}
${userInfo?.phone ? `الهاتف: ${userInfo.phone}` : ''}

في انتظار ردكم الكريم.${signature}`;
  }
}

export function createWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function openWhatsApp(options: WhatsAppMessageOptions): void {
  const message = generateWhatsAppMessage(options);
  const link = createWhatsAppLink(message);
  
  if (typeof window !== 'undefined') {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
}

// Predefined package messages
export const PACKAGES = {
  basic: {
    name: "Basic Package",
    arabicName: "الباقة الأساسية",
    price: "$1,200/شهر",
    features: [
      "2 أيام تصوير شهرياً",
      "8-10 تصاميم احترافية", 
      "6-8 ريلز قصيرة",
      "إدارة حساب واحد",
      "تقرير أداء شهري"
    ]
  },
  growth: {
    name: "Growth Package", 
    arabicName: "باقة النمو",
    price: "$1,800/شهر",
    features: [
      "3 أيام تصوير شهرياً",
      "15-18 تصميم احترافي",
      "10-12 ريل متقدم", 
      "إدارة حسابين",
      "استراتيجية محتوى",
      "تقارير أسبوعية"
    ]
  },
  pro: {
    name: "Pro Package",
    arabicName: "الباقة الاحترافية", 
    price: "$2,500/شهر",
    features: [
      "4 أيام تصوير شهرياً",
      "22-25 تصميم متقدم",
      "14-16 ريل احترافي",
      "إدارة متعددة الحسابات",
      "استراتيجية شاملة",
      "تحليلات متقدمة",
      "دعم أولوية"
    ]
  }
};

// Predefined service messages  
export const SERVICES = {
  content_production: {
    name: "Content Production",
    arabicName: "إنتاج المحتوى",
    description: "إنتاج محتوى مرئي احترافي للسوشيال ميديا"
  },
  photography: {
    name: "Photography Sessions", 
    arabicName: "جلسات التصوير",
    description: "جلسات تصوير احترافية في الاستوديو أو الخارج"
  },
  ads_management: {
    name: "Ads Management",
    arabicName: "إدارة الإعلانات", 
    description: "إدارة الحملات الإعلانية على جميع المنصات"
  },
  motion_graphics: {
    name: "Motion Graphics",
    arabicName: "موشن جرافيك",
    description: "تصميم وإنتاج الموشن جرافيك والأنيميشن"
  },
  social_media: {
    name: "Social Media Management",
    arabicName: "إدارة السوشيال ميديا",
    description: "إدارة شاملة لحساباتك على وسائل التواصل"
  }
};
