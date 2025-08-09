export type Member = {
  name: string;
  role: string;
  bio?: string;
  avatar?: string; // path under public/team
  instagram?: string;
  portfolio?: string;
};

// ملاحظة: حدث الأسماء بالمعلومات الحقيقية لأعضاء الفريق والمصورين
export const team: Member[] = [
  { name: "هبة محمد", role: "Studio & Creative Producer", bio: "إدارة الإنتاج داخل الاستوديو وتنسيق التسليمات.", avatar: "/window.svg" },
  { name: "محمد قاسم", role: "Senior Photographer & Video Editor", bio: "تصوير منتجات/لوكيشن ومونتاج فيديو.", avatar: "/window.svg" },
  { name: "رضا", role: "Photographer", bio: "تصوير منتجات وأشخاص ضمن جداول أسبوعية.", avatar: "/window.svg" },
  { name: "محمد الشمري", role: "Photographer", bio: "جلسات تصوير خفيفة ومساندة لفرق اللوكيشن.", avatar: "/window.svg" },
  { name: "حسن ماجد", role: "Scheduler & Meta Platforms Coordinator", bio: "تنسيق الجداول وإدارة منصات Meta.", avatar: "/window.svg" },
];


