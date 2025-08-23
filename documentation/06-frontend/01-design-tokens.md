# Frontend Design Tokens

Status: Final — aligned with Brand SSOT (2025-08-24)

> ✅ **تم التحديث (2025-08-24):** قفل الألوان Primary #6C2BFF وAlternate #3E5BFF. مصدر الهوية البصرية محفوظ داخلياً ضمن هذا المستودع.

هذه الوثيقة توحّد الألوان والخطوط والمسافات والظلال وحالات التفاعل وبريك‑بوينتس كمتغيرات CSS لاستخدامها عبر الواجهة.

## Principles
- SSOT للألوان والخطوط: هذا الملف + المواصفات في `99-reference/00-resources.md`
- RTL/LTR مدعوم عبر منطق اتجاه عام (body[dir]).
- Light/Dark مدعومان بمتغيرات جذرية.

## Tokens — Colors
```css
:root {
  /* Brand (SSOT) */
  --color-primary: #6C2BFF; /* Purple 2025 */
  --color-primary-600: #4A1FC9;
  --color-alternate: #3E5BFF; /* Indigo 2025 */

  /* Base */
  --bg: #ffffff; --bg-secondary: #f8f9fa;
  --text: #1f2937; --text-secondary: #6b7280;
  --border: #e5e7eb; --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --bg: #0f172a; --bg-secondary: #1e293b;
  --text: #f1f5f9; --text-secondary: #94a3b8;
  --border: #334155; --shadow: 0 1px 3px rgba(0,0,0,0.3);
}
```

## Tokens — Typography
- Arabic: Dubai, system-ui, -apple-system, Segoe UI, Arial, sans-serif
- English: Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif

```css
:root {
  --font-ar: 'Dubai', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  --font-en: 'Inter', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

## Tokens — Spacing & Radius
```css
:root {
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px;
  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px;
}
```

## Tokens — Elevation
```css
:root {
  --elevation-1: 0 1px 3px rgba(0,0,0,0.1);
  --elevation-2: 0 4px 12px rgba(0,0,0,0.12);
  --elevation-3: 0 10px 24px rgba(0,0,0,0.16);
}
```

## Tokens — Breakpoints
```css
:root {
  --bp-sm: 480px; --bp-md: 768px; --bp-lg: 1024px; --bp-xl: 1400px;
}
```

## Component States (hover/focus/disabled)
- Focus ring: 2px outline using `--color-primary` with 2px offset.
- Disabled: reduce opacity to 0.5 and disable pointer events.

## Notes
- SSOT — مصدر الحقيقة الوحيد: عمود الألوان في 02-Color-Palettes-Spec.html.
- تستخدم الواجهات المتغير `--color-primary` كمرجع للحالات (hover/focus/active).
