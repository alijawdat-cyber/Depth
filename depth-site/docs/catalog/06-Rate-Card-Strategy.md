# استراتيجية التسعير (Rate Card Strategy)

## المعادلة العامة (بدون كود)
Final Price = Base (حسب الفئة الفرعية) ± Vertical Modifier + Processing + Conditions + Creator Modifier + Add‑ons

- Base: من جدول الأسعار الأساسي.
- Vertical Modifier: Clinics +10%، Furniture +5%، Fashion 0% (قابلة للتحديث).
- Processing: RAW −10%، RAW+Color 0%، Full Retouch +30–40% (المصدر: Rate Card).
- Conditions: Rush +35%، Location + مبلغ ثابت.
- Creator Modifier: 0% → +20% حسب تقييم الإدارة (دون نسب سلبية).
- Add‑ons: Models/Location/Props/Stylist/MUA/Source Files.

ملاحظة العملة: الأساس IQD. USD للعرض فقط وبـ FX يدوي محفوظ ضمن Snapshot عند الحاجة.
مصدر الحقيقة: `docs/catalog/09-Seed/rate-card.json`.

## Guardrails (حواجز)
- هامش ≥ 50% افتراضياً.
- مسموح النزول حتى 45% باستثناء مبرّر (Hard Stop).
- حدود دنيا/قصوى للسعر.
- إنذار امتثال لتجميلي/قبل‑بعد.

## أمثلة مختصرة
- Photo Flat Lay (Fashion, RAW+Color, Studio, Standard): Base 20,000 د.ع → Final ≈ 20,000 د.ع (قبل Modifier)
- نفس الأصل مع Creator Modifier +10%: ≈ 22,000 د.ع — يُراجع الهامش وفق الكلفة التقديرية.

## ربط العقود
- كل سطر تسليم يتولّد كبند SOW: مواصفات/كمية/سعر/SLA/امتثال.
- سياسات الدفع والجزاءات تُسحب حسب `docs/catalog/15-Taxes-and-Invoicing.md` والـ MSA (Kill Fee 25–50% وتمديد SLA عند تأخر العميل).

## تحديثات دورية
- مراجعة ربع سنوية للـ Base/Modifiers وفق السوق والأداء.
- حفظ التعديلات مع السبب والتاريخ (Audit).

مراجع: SLA → `docs/catalog/13-SLA-Matrix.md`، Location Zones → `docs/catalog/14-Location-Zones.md`.
