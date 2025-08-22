# Performance and Accessibility Budgets (Draft)

Status: Draft — to be enforced via CI later

## Web Performance Budgets
- Core Web Vitals (mobile): LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- JS bundle (initial): ≤ 180KB gz
- Total requests on first load: ≤ 35
- Images: serve AVIF/WebP, lazy-load below fold
- Fonts: use `font-display: swap`, subset Arabic/Latin where possible

## Accessibility (WCAG 2.1 AA)
- Color contrast ≥ 4.5:1 text/interactive; ≥ 3:1 for large text
- Keyboard navigable: focus order, visible focus ring
- Landmarks: header, nav, main, aside, footer
- ARIA only when needed; prefer semantic elements
- RTL/LTR: verify mirrored icons and logical properties (margin-inline, inset-inline)

## Testing & Checks
- Lighthouse CI thresholds: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90
- Axe checks integrated in E2E (Playwright)
- Manual auditing list per release: forms labels, alt text, focus traps, skip link

## Next
- Wire into CI later; add page-level budgets where needed.
