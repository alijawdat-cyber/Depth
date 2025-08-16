# Pricing Engine — IQD أولاً

## ترتيب الحساب (Order of Application)
1. BasePriceIQD (لكل Subcategory — يُدار من الـ Rate Card)
2. VerticalModifier (٪ حسب الـ vertical)
3. ProcessingModifier (Retouch +30–40%، RAW −10%)
4. Conditions: Rush٪، LocationZone (مبلغ ثابت IQD/جلسة)
5. Creator Tier Modifier (٪)
6. Override (ضمن `overrideCapPercent`) + فحص الهامش
7. Rounding (تقريب افتراضي 250 د.ع)
8. Taxes: لا يوجد حالياً (العراق)
9. Speed Bonus: داخلي فقط للمبدع (لا يغيّر سعر العميل)

## معادلات مختصرة
- priceAfterVertical = base * (1 + verticalPct)
- priceAfterProcessing = priceAfterVertical * (1 + processingPct)
- priceAfterRush = priceAfterProcessing * (1 + rushPct)
- priceWithLocation = priceAfterRush + locationIQD
- priceAfterTier = priceWithLocation * (1 + tierPct)
- final = overrideAllowed ? overrideValue : priceAfterTier
- finalRounded = round(final, 250)

## Guardrails
- margin = (sellPriceIQD − estimatedCostIQD) / sellPriceIQD
- minMarginDefault = 0.50، minMarginHardStop = 0.45
- يمنع الإرسال/النشر إذا انكسر hard stop.

## ملاحظات
- جميع الأرقام المرجعية تؤخذ من `docs/catalog/09-Seed/rate-card.json` حصراً.
- الـ USD عرضي فقط عند العرض، ويُثبت FX داخل Snapshot.
- تعرض شاشة الأدمن نطاقات مرجعية `baseRangesIQD` للاستئناس فقط؛ القرار النهائي يبقى لسعر السطر بعد المعاملات والـ Guardrails.

