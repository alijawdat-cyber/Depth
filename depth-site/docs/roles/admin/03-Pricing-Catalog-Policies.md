# سياسات الكتالوغ والتسعير — Admin

## العملة و FX (سعر الصرف)
- العملة الأساسية: الدينار العراقي (IQD) — SSOT.
- تخزين:
  - Base IQD (أساسي)، Base USD (مشتق عبر FX).
  - Snapshot يتضمّن: fxRate, fxDate, fxSource (مثبّت لحظة إنشاء العرض).
- مثال:
  - FX=1300، Base USD 16$ ⇒ Base IQD 20,800 د.ع. عند إنشاء عرض، نثبت FX داخل Snapshot.
- ملاحظة: USD للعرض فقط، لا يدخل في الحسابات الداخلية؛ الأساس دائماً IQD.

## المعاملات (Modifiers)
- Processing (قابلة للتعديل): RAW Only −10%، RAW+Color 0%، Full Retouch +30–40% (القيم الدقيقة min/max في الـ Rate Card).
- Conditions (قابلة للتعديل):
  - Rush (مستعجل) — Surcharge على العميل (مثلاً +35%).
  - Speed Bonus — مكافأة داخلية للمبدع (مثلاً +10%) لا تظهر للعميل.
  - Location (Zones بالـ IQD): راجع `docs/catalog/14-Location-Zones.md`، تُحتسب كمبلغ ثابت/جلسة، و«per‑asset» مسموحة لحالات Volume داخل بغداد.

## Guardrails (حماية الهامش)
- الشرط: هامش ≥ 50% افتراضياً (minMarginDefault). مسموح النزول إلى 45% (minMarginHardStop) بموافقة خاصة موثقة.
- يمنع النشر/الإرسال إذا انكسر الحد.
- مثال سريع:
  - Subtotal بعد المعالجات = 31,200 د.ع (24$)، كلفة داخلية 16,250 د.ع (12.5$) ⇒ هامش ≈ 48% (مسموح).

## أمثلة حساب مختصرة
- ترتيب الحساب (Pricing Engine): Base → Vertical → Processing → Conditions (Rush٪ + Location IQD) → Creator Tier٪ → Override (ضمن cap) → Rounding → Guardrail.
- بلا Rush، Studio:
  - Base 20,000 د.ع + Retouch +30% ⇒ 26,000 د.ع.
- ويا Rush +35% (على العميل):
  - 26,000 × 1.35 = 35,100 د.ع + Location (Baghdad Center +5,000) = 40,100 د.ع → تقريب 40,000 د.ع.
- Speed Bonus (داخلي للمبدع):
  - إنجاز أسرع من SLA → Bonus داخلي، لا يغيّر سعر العميل.

## نطاقات مرجعية (Reference Ranges)
- يعرض الأدمن نطاق مرجعي لكل Subcategory من `baseRangesIQD` لمراجعة السعر الوسط/النهائي.
- النطاقات إرشادية فقط؛ المصدر الملزِم للسعر هو `basePricesIQD` بعد المعاملات والـ Guardrails.
 - تذكير داخل واجهة الأدمن: "النطاقات للعرض فقط. الحساب الفعلي يبنى على Base ثم المعاملات ثم فحص الهامش".

## الإصدارات (Versioning)
- كل تغيير أسعار/معاملات ينشر كإصدار (Version) بتاريخ سريان (Effective From).
- “عرض الفرق” يبيّن قبل/بعد لأهم الفئات مبيعاً، مع سبب التغيير.

## التقريب (Rounding)
- التقريب الافتراضي لأقرب 250 د.ع عند عرض الإجمالي/السطر للعميل (قابل للتعديل من الأدمن).

## Override Check
- لا يُقبَل أي Override يتجاوز `overrideCapPercent` (+20% افتراضياً) أو يكسر `minMarginHardStop` (45%).

مراجع: `docs/catalog/02-Processing-Levels.md`, `docs/catalog/06-Rate-Card-Strategy.md`.

## تسعير الأساس لكل فئة فرعية (Baseline IQD)
- الصور (كل الـ subcategories): 5,000–15,000 د.ع أساساً.
- الفيديو (مبدئياً):
  - Try-On/Product/Transitions/Testimonial: 45,000–120,000 د.ع.
  - BTS: 35,000–90,000 د.ع.
  - Lead Gen Ad: 75,000–180,000 د.ع.
- ملاحظة: يمكن تفصيل الفيديو حسب المدة (6–8s/15s/30–45s) في الـ Rate Card.
