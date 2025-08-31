Depth Frontend — منصة المكوّنات والشاشات

هذا المشروع يبني واجهة موحّدة لمكوّنات Depth وشاشاتها. نعتمد:
- Next.js (App Router)
- TypeScript
- Tailwind 4 (utilities) + CSS Variables للتوكنز
- RTL افتراضي

هيكلة متوقعة:
- src/components/ — المكوّنات (لاحقًا)
- src/screens/ — الشاشات (لاحقًا)
- tests/snapshots/ — لقطات Playwright (لاحقًا)

تشغيل محلي:
```bash
npm run dev # المنفذ 3030
```

ملاحظات:
- التوكنز مأخوذة من الوثيقة: documentation/06-frontend/01-design-tokens.md ومحقونة كـ CSS vars عبر `src/styles/00-tokens/tokens.css` ويتم تجميعها في `src/styles/01-base/globals.css`.
