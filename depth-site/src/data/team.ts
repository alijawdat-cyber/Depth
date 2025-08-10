export type TeamMember = {
  id: string;
  name: string;
  roleAr: string;
  roleEn: string;
  quoteAr: string;
  quoteEn: string;
  photo: string;
  links?: { label: string; href: string }[];
};

// صور الفريق يُفضّل WebP ~1200x900. مؤقتًا نستخدم الصورة المتوفرة + placeholders.
export const TEAM: TeamMember[] = [
  {
    id: "ali",
    name: "Ali Jawdat",
    roleAr: "المؤسس والرئيس التنفيذي",
    roleEn: "Founder & Principal",
    quoteAr:
      "أبني أنظمة محتوى تربط الإبداع بالمبيعات. السرعة عندي مدروسة والهدف أرقام تُقاس.",
    quoteEn:
      "I build content systems that convert. Thoughtful speed, measurable outcomes.",
    photo: "/team/ali-jawdat.jpg",
    links: [
      { label: "Portfolio", href: "/work" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
  },
  {
    id: "hiba",
    name: "Hiba Mohammed",
    roleAr: "Studio & Creative Producer",
    roleEn: "Studio & Creative Producer",
    quoteAr:
      "أدير الإنتاج كخط تجميع ذكي: جدول واضح، ملف نظيف، وتسليم يعمل من أول تصدير.",
    quoteEn:
      "Production as a smart assembly line—clean files, on-time, on-brand.",
    photo: "/window.svg",
  },
  {
    id: "moh-qasim",
    name: "Mohammed Qasim",
    roleAr: "مصور أول ومحرّر فيديو",
    roleEn: "Senior Photographer & Video Editor",
    quoteAr:
      "أوازن الضوء والحركة لصناعة قصص تبيع خلال ثوانٍ.",
    quoteEn:
      "Light + motion balanced to sell the story in seconds.",
    photo: "/window.svg",
  },
  {
    id: "reza",
    name: "Reza",
    roleAr: "مصور",
    roleEn: "Photographer",
    quoteAr: "تفاصيل نظيفة وصورة تتكلم قبل النص.",
    quoteEn: "Clean details. Images that speak before copy.",
    photo: "/window.svg",
  },
  {
    id: "moh-sh",
    name: "Mohammed Al-Shammari",
    roleAr: "مصور",
    roleEn: "Photographer",
    quoteAr: "ثبات، زوايا دقيقة، وتسليم بلا ضوضاء.",
    quoteEn: "Stability, precise angles, noise-free delivery.",
    photo: "/window.svg",
  },
  {
    id: "hasan",
    name: "Hasan Hashim",
    roleAr: "Scheduler & Meta Platforms Coordinator",
    roleEn: "Scheduler & Meta Platforms Coordinator",
    quoteAr:
      "منسوب نشر ثابت + تتبّع دقيق = نمو متوقع.",
    quoteEn:
      "Consistent publishing + precise tracking = predictable growth.",
    photo: "/window.svg",
  },
];


