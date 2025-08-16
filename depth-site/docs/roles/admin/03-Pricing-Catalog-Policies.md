# سياسات الكتالوغ والتسعير — Admin

## العملة و FX (سعر الصرف)
- العملة الأساسية: الدينار العراقي (IQD). نعرض ونخزّن أيضاً الدولار (USD) عند الحاجة.
- تخزين:
  - Base IQD (رئيسي)، Base USD (مشتق) باستخدام FX.
  - Snapshot يتضمّن: fxRate, fxDate, fxSource (المصدر اليومي).
- مثال:
  - FX=1300، Base USD 16$ ⇒ Base IQD 20,800 د.ع. عند إنشاء عرض، نثبت FX داخل Snapshot.

## المعاملات (Modifiers)
- Processing (قابلة للتعديل): RAW Only −10%، RAW+Color 0%، Full Retouch +40…50%.
- Conditions (قابلة للتعديل):
  - Rush (مستعجل) — Surcharge على العميل (مثلاً +35%).
  - Speed Bonus — مكافأة داخلية للمبدع (مثلاً +10%) لا تظهر للعميل.
  - Location:
    - Depth Studio: 0 د.ع أو خصم (سياسة داخلية).
    - External (افتراضي Flat per Session): مناطق (Zones):
      - Baghdad Center: 0 د.ع.
      - Baghdad Outer Ring: +15,000 د.ع.
      - Nearby Provinces: +35,000 د.ع.
      - Distant Provinces: +65,000 د.ع.
    - خيار بديل: Flat per Asset (مبلغ/أصل) للحالات الخاصة.

## Guardrails (حماية الهامش)
- الشرط: هامش ≥ 45% لكل تسليمة.
- يمنع النشر/الإرسال إذا انكسر الحد.
- مثال سريع:
  - Subtotal بعد المعالجات = 31,200 د.ع (24$)، كلفة داخلية 16,250 د.ع (12.5$) ⇒ هامش ≈ 48% (مسموح).

## أمثلة حساب مختصرة
- بلا Rush، Studio:
  - Base 20,800 د.ع (16$) + Retouch +50% ⇒ 31,200 د.ع (24$).
- ويا Rush +35% (على العميل):
  - 31,200 × 1.35 = 42,120 د.ع (≈ 32.4$) + Location (Baghdad Outer +15,000) = 57,120 د.ع.
- Speed Bonus (داخلي للمبدع):
  - إنجاز أسرع من SLA → +10% Bonus من حصّة المبدع فقط، ما يغيّر سعر العميل.

## الإصدارات (Versioning)
- كل تغيير أسعار/معاملات ينشر كإصدار (Version) بتاريخ سريان (Effective From).
- “عرض الفرق” يبيّن قبل/بعد لأهم الفئات مبيعاً، مع سبب التغيير.

مراجع: `docs/catalog/02-Processing-Levels.md`, `docs/catalog/06-Rate-Card-Strategy.md`.
