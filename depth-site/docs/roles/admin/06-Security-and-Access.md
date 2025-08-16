# الأمان والوصول (Security & Access)

## الهوية والجلسة
- Session Claims: `role`, `scopes`, `orgId`, `userId`, `tier`.
- Role‑based Routing عبر `middleware.ts` لحماية المسارات حسب الدور.

## الأدوار/النطاقات (Roles & Scopes)
- أمثلة Scopes: `pricing.write`, `catalog.publish`, `contracts.send`, `approvals.manage`.
- تخصيص نطاقات فرعية لحسابات إدارية خاصة (مثل “مدير التسعير”).

## 2FA
- إلزام للأدمن (موصى به)، اختياري لغيره.

## الامتثال والسرية
- منع كشف المبدعين للعميل (فصل واجهات).
- Before/After (عيادات) يحتاج موافقة امتثال + قوالب إخلاء.

## التدقيق (Audit)
- يسجّل: من عدّل/أرسل/وافق/رفض، ماذا تغيّر، لماذا، متى.
- يظهر في: Catalog/Pricing/Projects/Contracts/Approvals.

## السياسات التقنية
- تثبيت FX داخل Snapshot.
- حماية الحد الأدنى للهامش (Guardrails) — يمنع الإرسال/النشر عند الخرق.
- قنوات الإرسال: Email + WhatsApp مع تسجيل القناة والوقت.
