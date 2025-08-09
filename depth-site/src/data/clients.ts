export type Client = {
  name: string;
  slug: string;
  logo: string; // path under public/
  story?: string;
  website?: string;
};

// استخدم SVGs لحدة مثالية وحواف شفافة

export const clients: Client[] = [
  {
    name: "Clinica A",
    slug: "clinica-a",
    logo: "/clients/clinica-a.svg",
    story: "عيادة تجميل: إنتاج ريلز/Before-After تحت امتثال المنصات + إعداد حملات Leads بنماذج موافقة.",
  },
  {
    name: "BLO",
    slug: "blo",
    logo: "/clients/blo.svg",
    story: "سجاد فاخر: تصوير منتجات/Flatlays + إعلانات أداء لمواسم العيد والعروض الخاصة.",
  },
  {
    name: "In Off",
    slug: "in-off",
    logo: "/clients/in-off.svg",
    story: "علامة أزياء/لمتاجر: نظام محتوى أسبوعي + UTM Tracking + تحسين صفحات الهبوط.",
  },
  {
    name: "Nava",
    slug: "nava",
    logo: "/clients/nava.svg",
    story: "تجهيزات/مكاتب: جلسات تصوير داخل المكتب + حملات B2B Lead Gen.",
  },
  {
    name: "Sport & More",
    slug: "sport-and-more",
    logo: "/clients/sport-and-more.svg",
    story: "تجزئة رياضية: إنتاج محتوى داخل الاستوديو فوق المعرض + إدارة مواسم تخفيضات.",
  },
];


