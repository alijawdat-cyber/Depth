# Cost Model — موحّد

## موظف (Employee)
- employee.internalCostIQDPerDay
- capacityPerDay (عدد الأصول/يوم)
- توزيع الكلفة على الأصول ضمن المشروع لأغراض حساب الهامش فقط (لا تظهر للعميل).

## مبدع (Creator/Freelancer)
- creator.netBaselineIQDPerAsset لكل Subcategory (اختياري)
- أو dayRateIQD مع تحويل على عدد الأصول في اليوم.
- تُستخدم لضمان الـ Guardrail فقط، لا تُعرض للعميل.

## الهامش (Margin)
- الصيغة: margin = (sellPriceIQD − estimatedCostIQD) / sellPriceIQD
- السياسات:
  - minMarginDefault = 0.50
  - minMarginHardStop = 0.45

## مصادر البيانات
- الأسعار من rate-card.json
- الكلف من Profiles أو إدخال أدمن.
