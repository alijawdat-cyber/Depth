## Pricing-and-Margin.xlsx — إرشادات الصيغ

ملاحظة: الملف الفعلي Excel (Microsoft Excel — مايكروسوفت إكسل) يُنشأ خارجياً، هنا صيغ مقترحة للنسخ في Excel/Google Sheets.

### خلايا أساس
- FX (Foreign Exchange — سعر الصرف) في الخلية `B1` (مثال: 1400).
- جدول الخدمات: الأعمدة
  - A: Service
  - B: Internal_COGS_IQD
  - C: Internal_COGS_USD = `=IF(B2>0, B2/$B$1, 0)`
  - D: Sell_Price_USD (من §4.2 في `6‑FINAL`)
  - E: Margin_pct = `=IF(D2>0, 1 - C2/D2, "")`
  - F: Notes

### حساسية FX ±3%
- FX_low = `=B1*(1-0.03)`
- FX_high = `=B1*(1+0.03)`

### خصم داخلي 15–25%
- Price_Internal_20% = `=D2*(1-0.20)` (Default)
- Price_Internal_15% = `=D2*(1-0.15)`
- Price_Internal_25% = `=D2*(1-0.25)`

### تحقق
- طابق Sell_Price_USD مع `6‑FINAL`.
- Margin ≥ 45% للخدمات المفردة المستهدفة.


