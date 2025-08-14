## Depth — Color & Type One‑Pager (صفحة واحدة)

مصدر الحقيقة للألوان: `Depth‑Brand‑Identity/02-Color-Palettes-Spec.html` (SSOT — Single Source of Truth — مصدر واحد للحقيقة).

### Palette (لوحة الألوان)
- Neutrals / Ink: `--ink-900 #0B0F14`, `--ink-800 #1A232C`, `--slate-600 #6A7D8F`, ورامب محايد 0→900.
- Accent — Purple 2025 (افتراضي): `--accent-200 #D7C7FF`, `--accent-300 #B79AFF`, `--accent-400 #8E5BFF`, `--accent-500 #6C2BFF`, `--accent-700 #4A1FC9`.
- بديل Indigo 2025: `--accent-200 #C3D0FF`, `--accent-300 #9AB1FF`, `--accent-400 #6A86FF`, `--accent-500 #3E5BFF`, `--accent-700 #253DB8`.
- نسب الاستخدام: Neutrals 70–80%، ثانويات 10–20%، Accent ≤ 10%.

### Tokens (توكنز)
- Light: `--bg`، `--text` (aliases: `--bg-light` = `--bg`, `--text-light` = `--text`).
- Dark: `--bg-dark` = `--ink-900`، `--text-dark` = `#FFFFFF`.
- CTA (Call To Action — دعوة لاتخاذ إجراء): Primary = `--accent-500`، Hover = `--accent-700`، Disabled = `--accent-300`.
- Focus Ring: `--accent-400` (2–3px).

### Contrast (تباين)
- الهدف: ≥ 4.5:1 (WCAG (Web Content Accessibility Guidelines — إرشادات الوصول لمحتوى الويب) AA). تحقق تلقائي بملف الـ HTML (HyperText Markup Language — لغة توصيف النص الفائق).

### Typography (الخطوط)
- مرحلة الانطلاق (مجاني): Latin = Inter، Arabic = Noto Sans Arabic.
- مرحلة الترقية (مرخّصة): Latin = GT America / Söhne / Avenir Next، Arabic = 29LT Bukra / 29LT Azer / DIN Next Arabic.
- الاستخدام: Display=SemiBold، Body=Regular/Book، Tracking ضيق للعناوين.
- قفل ثنائي: DEPTH — ديبث (العربي 85% من الحجم ووزن أخف).

### Patterns & Motion (أنماط وحركة)
- Patterns: خطوط كنتورية 3–6% فوق `--ink-900`، و4–6% فوق `--neutral-50`.
- Motion: Intro 1.0s / Outro 0.7s / Ease Out، Parallax 16–24px.

### ملاحظات استخدام عملية
- شعار على الداكن: Stroke أبيض؛ على الفاتح: Stroke Ink.
- أزرار أساسية بالـ Accent فقط، وتجنّب الإفراط بالأكسنت (>10%).


