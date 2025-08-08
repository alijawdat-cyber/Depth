## Depth — Color Palettes Spec (مساطر لونية — النسخة النهائية 2025)

المرجع النهائي للألوان هو ملف `02-Color-Palettes-Spec.html` الذي يعرّف توكنز CSS (Cascading Style Sheets — أوراق الأنماط المتتالية) ويوفّر معاينة وتباين تلقائي. المساران المعتمدان:

- **Palette A — Purple 2025 (بنفسجي حديث)**
- **Palette B — Indigo 2025 (أزرق غامق قريب للبنفسجي)**

---

### قواعد عامة (ثابتة)
- **Contrast**: النص والعلامات ≥ 4.5:1 (WCAG AA) على الفاتح والداكن.
- **Profiles**: شاشة sRGB؛ للطباعة CMYK (مغلف/Coated). للألوان النيون/البنفسج القوي يُفضَّل Spot/Pantone.
- **States**: Hover/Active = Accent أغمق 10–15%، Focus Ring 2px من لون الـ Accent.
- **Motion**: الـ Accent ≤ 10% من المشهد؛ Grain خفيف 2% على الخلفيات الداكنة.
- **Logo**: على الداكن Stroke أبيض؛ على الفاتح Stroke حبر Ink.
—

### استخدامات عملية (ملخّص معتمد)
- **Light Mode**: خلفية `--bg-light`؛ نص أساسي `--text-light`؛ الشعار Stroke `--text-light`.
- **Dark Mode**: خلفية `--bg-dark`؛ نص أساسي `--text-dark`؛ الشعار Stroke `--text-dark`.
 - **CTA (Call To Action — دعوة لاتخاذ إجراء)**: زر Primary = `--accent-500`، Hover = `--accent-700`, Disabled = `--accent-300` مع نص داكن `--ink-900` عند الحاجة.
- **Patterns**: خطوط كنتورية 3–6% فوق `--ink-900` أو 4–6% فوق `--neutral-50`.
- **Motion**: Reveal بخط Accent، Parallax 16–24px، مدة Intro 1.0s/Outro 0.7s.

---

### مخرجات
- يمكن توليد Swatches PDF وملف ASE (Adobe Swatch Exchange — تبادل حزم الألوان) للمسارين المعتمدين فقط.
- عند الطباعة الإنتاجية، ثبّت Pantone مطابق للأكسنت المختار (Purple/Indigo) بعد اختبار شاشة/مطبوعة.
