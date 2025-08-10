export type Testimonial = {
  id: string;
  quote: string;
  person: { name: string; role: string; avatarUrl?: string };
  client: { name: string; slug: string; logo: string; url?: string };
  rating: number; // 1–5
  results?: string[]; // short chips like "+42% ROAS"
  dateISO?: string;
  caseUrl?: string;
  videoUrl?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "blo-1",
    quote: "نتائج ملموسة خلال شهرين—وضوح في التقارير وسرعة بالتنفيذ.",
    person: { name: "أحمد", role: "مدير تسويق" },
    client: { name: "BLO", slug: "blo", logo: "/clients/blo.svg" },
    rating: 5,
    results: ["+42% ROAS/60 يوم", "UTM مضبوط"],
    dateISO: "2025-02-01",
    caseUrl: "/work",
  },
  {
    id: "clinica-1",
    quote: "انضباط عالي ومواعيد دقيقة—الباقات فعلاً تغطي كل المطلوب.",
    person: { name: "سارة", role: "مؤسِّسة" },
    client: { name: "Clinica A", slug: "clinica-a", logo: "/clients/clinica-a.svg" },
    rating: 5,
    results: ["Before/After compliant", "Leads مؤهلة"],
    dateISO: "2025-01-20",
  },
  {
    id: "inoff-1",
    quote: "UTM و Landing وتركيب تتبّع مضبوط—انخفض الـCPA بشكل ممتاز.",
    person: { name: "كريم", role: "Growth" },
    client: { name: "IN OFF", slug: "in-off", logo: "/clients/in-off.svg" },
    rating: 4,
    results: ["-28% CPA", "نظام محتوى أسبوعي"],
    dateISO: "2025-01-05",
  },
];


