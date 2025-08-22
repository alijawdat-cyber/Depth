# Frontend Design Tokens (Draft)

Status: Draft — pending Brand sign‑off

هذه الوثيقة توحّد الألوان والخطوط والمسافات والظلال وحالات التفاعل وبريك‑بوينتس كمتغيرات CSS لاستخدامها عبر الواجهة.

## Principles
- SSOT للألوان والخطوط من `depth-site/docs/brand-identity/...`.
- RTL/LTR مدعوم عبر منطق اتجاه عام (body[dir]).
- Light/Dark مدعومان بمتغيرات جذرية.

## Tokens — Colors
```css
:root {
  /* Brand */
  --color-primary: #6C2BFF; /* Pending: align with Brand Spec */
  --color-primary-600: #4A1FC9;
  --color-accent: #f59e0b;   /* Gold (if kept) */

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
- Arabic: Dubai (fallbacks TBC)
- English: Inter (fallbacks TBC)

```css
:root {
  --font-ar: 'Dubai', system-ui, -apple-system, Segoe UI, Arial, sans-serif;
  --font-en: 'Inter', system-ui, -apple-system, Segoe UI, Arial, sans-serif;
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

## Next
- مزامنة الألوان من Brand Spec بالضبط، وتحديث `styles.css` لاحقاً.
- تأكيد خط Arabic/English النهائي.
