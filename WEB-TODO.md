## WEB — TODO لإنشاء موقع Depth (مسار B — Next.js 14)

- هذا الملف هو خطة تنفيذ تفصيلية خطوة بخطوة لبناء موقع Depth باستخدام Next.js 14 (App Router) مع TypeScript، Tailwind CSS، Framer Motion، وتبنّي هوية الألوان/الخطوط/الموشن حسب أدلة الهوية.
- قاعدة توسيع المصطلحات: يتم توسيع أي اختصار عند ظهوره أول مرة، مثل SEO (Search Engine Optimization — تحسين محركات البحث)، CTA (Call To Action — دعوة لاتخاذ إجراء)، GA4 (Google Analytics 4 — تحليلات جوجل 4)، إلخ.
- مصادر الحقيقة SSOT (Single Source of Truth — مصدر واحد للحقيقة):
- الألوان/التوكنز: `Depth‑Brand‑Identity/02-Color-Palettes-Spec.html`
  - الأسعار/السياسات: `Depth‑Core‑Docs/6-Feasibility-and-Operations-FINAL.md`

---

### P0 — متطلبات وتمهيد (قبل البدء)
- [ ] تثبيت لون الأكسنت الافتراضي: Purple 2025 أو Indigo 2025 (حسب `02-Color-Palettes-Spec.html`).
- [x] قرار الأكسنت: Indigo 2025 (مع إمكانية سويتش لاحقاً لـ Purple 2025 للمعاينة فقط).
- [x] توفير ملفات خط دبي الحديث (Dubai) بصيغة WOFF2 (Regular/Medium/Bold) مع الرخصة. (منسوخة إلى `depth-site/public/fonts`)
- [ ] جمع 6–10 أمثلة Portfolio (صورة/ريل + وصف سطرين) بصيغ WebP/MP4 (MPEG‑4 Part 14 — إم بي إي جي‑4 جزء 14) أو WebM (WebM — صيغة فيديو ويب مفتوحة).
- [ ] نصوص أقسام الصفحة (Hero/Value/Process/Packages/FAQ/Contact) مختصرة.
- [ ] بريد رسمي + رقم واتساب + روابط سوشيال + عنوان الاستوديو.
- [ ] حسابات GA4 (Google Analytics 4 — تحليلات جوجل 4) + Meta Pixel (بكسل ميتا).

معايير القبول:
- **توفر كل الأصول أعلاه**؛ قرار الأكسنت مثبت؛ إمكانية النشر خلال 72 ساعة بعد P0.

---

### P1 — إنشاء المشروع وإعداد الستاك
- [ ] إنشاء مشروع Next.js 14 مع TypeScript وTailwind وESLint:
  ```bash
  npx create-next-app@latest depth-site --ts --eslint --app --src-dir --tailwind --use-npm --import-alias "@/*"
  ```
- [x] تثبيت مكتبات مساندة حديثة ومتوافقة:
  ```bash
  npm i framer-motion next-seo next-sitemap next-themes clsx tailwind-merge tailwind-variants lenis zod react-hook-form lucide-react
  npm i -D @types/node @types/react @types/react-dom @tailwindcss/typography @tailwindcss/forms @tailwindcss/container-queries autoprefixer postcss eslint-plugin-jsx-a11y @playwright/test
  ```
- [ ] إعداد Playwright (E2E (End To End — طرف لطرف)):
  ```bash
  npx playwright install --with-deps
  ```
 - [x] تم إعداد Playwright (المتصفحات منصّبة).
- [ ] (اختياري) إضافة Radix UI (Accessible Primitives — مكوّنات وصول جاهزة) وتهيئة shadcn/ui للمكونات المتوافقة:
  ```bash
  npm i @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-slot
  npx shadcn@latest init
  ```
- [ ] تمكين صور Next مع Sharp (افتراضي) وضبط `next.config.js` عند الحاجة (domains/video formats).
- [ ] إعداد `src/` كبنية رئيسية؛ نقل المسارات الافتراضية إذا لزم.

معايير القبول:
- **مشروع يبني محلياً بدون أخطاء**؛ Tailwind يعمل؛ صفحات App Router شغّالة.

---

### P2 — الخطوط (Dubai + Inter) عبر next/font/local
- [ ] إضافة ملفات الخط إلى `public/fonts/`:
  - `Dubai-Regular.woff2`, `Dubai-Medium.woff2`, `Dubai-Bold.woff2`
  - Inter عبر `next/font/google` أو self-host حسب التفضيل.
  
  حالة الملفات (محدثة):
  - [x] `Dubai-Regular.woff2` موجود (تم تحويله من TTF → WOFF2).
  - [x] `Dubai-Medium.woff2` موجود (تم تحويله من TTF → WOFF2).
  - [x] `Dubai-Bold.woff2` موجود (تم تحويله من TTF → WOFF2).

  تحويل TTF (TrueType Font — خط تروتايب) إلى WOFF2 (Web Open Font Format 2 — تنسيق خطوط ويب مفتوح):
  ```bash
  brew install woff2 # مرة واحدة فقط
  cd "Depth/public/fonts"
  # تم التحويل والحذف: لا توجد ملفات TTF حالياً (Regular/Medium/Bold متوفرة كـ .woff2)
  ```
- [x] تعريف الخطوط في `app/layout.tsx`:
  ```ts
  import localFont from "next/font/local";
  export const dubai = localFont({
    src: [
      { path: "/fonts/Dubai-Regular.woff2", weight: "400", style: "normal" },
      { path: "/fonts/Dubai-Medium.woff2",  weight: "500", style: "normal" },
      { path: "/fonts/Dubai-Bold.woff2",    weight: "700", style: "normal" }
    ],
    variable: "--font-ar"
  });
  ```
- [x] تعيين العائلة الافتراضية حسب الاتجاه:
  ```tsx
  <html lang="ar" dir="rtl" className={`${dubai.variable}`}>
  ```
- [ ] تفعيل `font-display: swap` تلقائياً؛ Preload للـ WOFF2 الكبيرة (العناوين).

معايير القبول:
- **عرض الخط دبي بشكل صحيح** على كل الأجهزة مع FOUT (Flash Of Unstyled Text — وميض نص غير منسق) منخفض.

---

### P3 — الألوان والتوكنز وربط Tailwind (الأكسنت الافتراضي: Indigo 2025)
- [x] إنشاء/تعديل `app/globals.css` لتضمين توكنز من `02-Color-Palettes-Spec.html`:
  ```css
  :root{
    --ink-900:#0B0F14; --ink-800:#1A232C; --slate-600:#6A7D8F;
    --neutral-0:#FFFFFF; --neutral-50:#F6F8FA; --neutral-100:#EDF2F6; --neutral-200:#D9E1E9;
    --neutral-300:#C2CDD8; --neutral-400:#A9B7C5; --neutral-500:#90A1B2; --neutral-600:#6A7D8F;
    --neutral-700:#44515D; --neutral-800:#28313A; --neutral-900:#0B0F14;
    /* Accent (Indigo 2025 — الافتراضي) */
    --accent-200:#C3D0FF; --accent-300:#9AB1FF; --accent-400:#6A86FF; --accent-500:#3E5BFF; --accent-700:#253DB8;
    /* Aliases */
    --bg:var(--neutral-0); --text:var(--ink-900); --card:var(--neutral-50); --elev:var(--neutral-100);
    --bg-light:var(--bg); --text-light:var(--text); --bg-dark:var(--ink-900); --text-dark:#FFFFFF;
    /* Radii/Shadows/Focus */
    --radius:14px; --radius-sm:10px; --shadow:0 8px 30px rgba(0,0,0,.08);
    --focus:0 0 0 3px var(--neutral-0), 0 0 0 6px var(--accent-400);
  }
  /* معاينة اختيارية: سويتش إلى Purple 2025 عند الحاجة */
  [data-palette="purple2025"]{
    --accent-200:#D7C7FF; --accent-300:#B79AFF; --accent-400:#8E5BFF; --accent-500:#6C2BFF; --accent-700:#4A1FC9;
  }
  ```
- [ ] ربط Tailwind بهذه التوكنز داخل `tailwind.config.ts` (ألوان/ظلال/أنصاف أقطار/حاويات).
 - [x] تمكين Plugins: `@tailwindcss/typography`, `@tailwindcss/forms`, `@tailwindcss/container-queries`.

معايير القبول:
- **أزرار CTA** تستخدم `--accent-500` (Hover `--accent-700`، Disabled `--accent-300`). التباين ≥ 4.5:1.
 - السمة الافتراضية للأكسنت Indigo 2025 مفعّلة على الجذر.

---

### P4 — RTL (Right To Left — من اليمين لليسار) وTheme (Light/Dark)
- [x] جعل `dir="rtl"` افتراضياً، واستعمال خصائص CSS المنطقية (inline-start/inline-end) لتقليل فروع الـ CSS. (تم ضبطها في `layout.tsx`)
- [x] إضافة `next-themes` لتبديل الداكن/الفاتح عبر `data-theme` أو سمة على `html`.
- [x] تفعيل مزوّد الثيم (`ThemeProvider`) عبر كمبوننت `src/app/providers.tsx` وضبط `attribute="data-theme"`.
- [x] دعم CSS صريح لـ `[data-theme="dark"]` و`[data-theme="light"]` داخل `globals.css`.
- [ ] إن لزم: `tailwindcss-rtl` أو اعتماد خصائص منطقية فقط (مُفضّل).

معايير القبول:
- **تحويل الاتجاه** لا يكسر التخطيطات؛ سويتش Light/Dark يعمل بتوكنز.

---

### P5 — بنية الملفات والمكونات
- [ ] هيكلة المشروع:
  ```
  src/
    app/(site)/page.tsx
    app/layout.tsx
    app/globals.css
    components/
      ui/{Button,Badge,Card,Container,SectionHeading}.tsx
      sections/{Hero,Packages,PortfolioGrid,Process,FAQ,Contact,Footer,Header}.tsx
    content/portfolio/*.mdx
    lib/{seo.ts,analytics.ts,tokens.ts,forms.ts}
    public/{fonts,media}
  ```
- [ ] استخدام tailwind-variants أو class-variance-authority لواجهات متسقة للـ UI.
- [ ] أيقونات: `lucide-react` أو `phosphor-react` (اختياري).

معايير القبول:
- **مكونات UI معاد استخدامها** ومغلفة جيداً، بدون تكرار نمط.

---

### P6 — الأقسام والنسخ
- [ ] Hero: وعد القيمة (سرعة/هامش/قياس) + CTA مزدوج (احجز جلسة / اطلب عرض).
- [ ] Packages: Basic / Growth / Pro مع سطر إدارة الإعلانات 12% + حد أدنى (Basic/Growth $350، Pro $500).
- [ ] PortfolioGrid: 6–10 أمثلة، فلاتر بسيطة حسب النوع (reel/photo/motion).
- [ ] Process: 3–4 مراحل (Intake → إنتاج → مراجعات → تسليم/Ads) أيقونات + نص قصير.
- [ ] FAQ: 6–8 أسئلة مختصرة تغطي التسعير/الملكية/SLA (Service Level Agreement — اتفاقية مستوى الخدمة).
- [ ] Contact: واتساب/إيميل/موقع/خرائط.

معايير القبول:
- **كل الأقسام موجودة** ومتوافقة مع النصوص، CTA واضحة ومكررة أعلى/أسفل.

---

### P7 — الموشن (Framer Motion)
- [ ] Intro 1.0s / Outro 0.7s، Easing: Ease‑Out أساسي، In‑Out للانتقالات.
- [ ] Parallax: طبقتين–ثلاث، إزاحة 16–24px (بـ Framer Motion أو مع Lenis + transform).
- [ ] Logo Reveal: Scale‑in 96%→100% + Fade خفيف.
- [ ] احترام الوصول: تقليل الحركة عند `prefers-reduced-motion`.

معايير القبول:
- **حركة ناعمة وخفيفة**، بدون jank، تحترم `prefers-reduced-motion`.

---

### P8 — الصور والفيديو
- [ ] استعمال `next/image` بصيغ WebP/AVIF، أحجام Responsive (`sizes`) وإستراتيجية `priority` للـ Hero.
- [ ] ضغط الصور مسبقاً (Squoosh/Sharp)؛ صور الغلاف ≤ 180KB إن أمكن.
- [ ] الفيديو: H.264 MP4 + Poster، كتم الصوت افتراضياً لو Autoplay.

معايير القبول:
- **LCP (Largest Contentful Paint — أكبر عنصر محتوى مرئي) ≤ 2.0s** على 4G؛ CLS (Cumulative Layout Shift — تجميعي إزاحة التخطيط) ≤ 0.05.

---

### P9 — SEO (Search Engine Optimization — تحسين محركات البحث) وOpen Graph
- [ ] `next-seo` لإدارة Titles/Descriptions/OG/Twitter.
- [ ] `next-sitemap` لتوليد `sitemap.xml` + `robots.txt`.
- [ ] JSON‑LD (JavaScript Object Notation for Linked Data — بيانات منظمة): `Organization`, `WebSite`, `Service`, `BreadcrumbList`.
- [ ] Canonical + H1/H2 هرمي + روابط داخلية.

معايير القبول:
- **Rich Results** تمر في اختبار Google؛ Lighthouse SEO ≥ 95.

---

### P10 — التحليلات والتتبّع
- [ ] تضمين GA4 (Google Analytics 4 — تحليلات جوجل 4) + Meta Pixel (بكسل ميتا) في `app/layout.tsx` أو مكون Analytics.
- [ ] أحداث:
  - GA4: `view_item_list`, `select_item`, `generate_lead`, `submit_form`.
  - Pixel: `ViewContent`, `Lead`, `Contact`.
- [ ] وسوم UTM (Urchin Tracking Module — وحدة تتبع Urchin) للحملات.

معايير القبول:
- **ظهور الأحداث في الوقت الحقيقي**؛ تحقق من DebugView/Pixel Helper.

---

### P11 — النماذج (Forms)
- [ ] Embed Typeform/Google Forms داخل قسم Contact/CTA.
- [ ] Webhook إلى Google Sheets + إشعار بريد.
- [ ] بديل (اختياري): نموذج محلي بـ React Hook Form + Zod + `app/api/lead/route.ts`.

معايير القبول:
- **استلام الإدخالات** بنجاح في Sheets/البريد؛ حالات خطأ واضحة للمستخدم.

---

### P12 — التجاوب (Responsiveness)
- [ ] Mobile‑first؛ نقاط توقف: 360/480/768/1024/1280/1536.
- [ ] أهداف لمس ≥ 44×44px؛ Typographic Scale متكيف؛ Grid مرن.
- [ ] دعم Light/Dark؛ اختبار على iOS/Android/Chrome/Safari/Firefox/Edge.

معايير القبول:
- **تجربة ممتازة على الموبايل** بلا تمرير أفقي؛ كل العناصر قابلة للمس بسهولة.

---

### P13 — الوصول (Accessibility)
- [ ] تباين AA (WCAG (Web Content Accessibility Guidelines — إرشادات الوصول لمحتوى الويب) AA) ≥ 4.5:1 للنصوص.
- [ ] تنقل لوحة المفاتيح كامل؛ Focus Ring 2–3px من الأكسنت؛ ARIA (Accessible Rich Internet Applications — تطبيقات إنترنت غنية قابلة للوصول) صحيحة.
- [ ] نص بديل للصور؛ عناوين منطقية.

معايير القبول:
- **axe-core/Lighthouse** بدون أخطاء حرجة؛ اختبارات لوحة المفاتيح ناجحة.

---

### P14 — الأداء (Performance) والميزانيات
- [ ] ميزانيات CWV (Core Web Vitals — مؤشرات ويب أساسية): LCP ≤ 2.0s، INP (Interaction to Next Paint — تفاعل إلى الطلاء التالي) ≤ 200ms، CLS ≤ 0.05.
- [ ] كود: تقسيم ديناميكي، `use client` فقط عند الحاجة، استيراد كسول للمكتبات الثقيلة.
- [ ] Fonts: Subset عند الإمكان، Preload للعناوين فقط.
- [ ] صور: Lazy/priority؛ Cache-Control قوي عبر Vercel CDN (Content Delivery Network — شبكة توصيل المحتوى).

معايير القبول:
- **Lighthouse ≥ 95** (Performance/Best Practices/SEO/Accessibility) على Desktop/Mobile.

---

### P15 — الاختبارات وQA (Quality Assurance — ضمان الجودة)
- [ ] Playwright لاختبارات E2E (End To End — طرف لطرف):
  - Smoke: تحميل الصفحة/عمل الـ CTA/إرسال النموذج.
  - Visual: لقطة أقسام رئيسية.
- [ ] ESLint/TypeScript نظيفين؛ تحذيرات صفرية.

معايير القبول:
- **CI يمر أخضر**؛ اختبارات Playwright ناجحة، بدون Flaky.

---

### P16 — النشر وDNS (Domain Name System — نظام أسماء النطاقات)
- [ ] إنشاء مشروع على Vercel؛ إعداد بيئة Production + Previews.
- [ ] ربط الدومين؛ تفعيل HTTPS؛ التحقق من Headers/Caching.
- [ ] إعداد متغيرات البيئة إذا استُخدمت مفاتيح.
- [x] توثيق إعداد البريد/الدومين في `EMAIL-DOMAIN-SETUP.md` (MX/SPF/DKIM/DMARC، مجموعات، 2FA).
- [x] إضافة سجلات DNS على Squarespace (MX/SPF/DMARC)، وتوليد/نشر DKIM 2048‑bit من Admin Console.

معايير القبول:
- **الموقع مباشر** على الدومين الرسمي؛ زمن استجابة سريع عالمي.

---

### P17 — المراقبة (Observability) والتقارير
- [ ] Vercel Analytics مفعّل؛ لقطات CWV.
- [ ] اختيارياً: Sentry (Error/Performance Monitoring — مراقبة الأخطاء/الأداء).
- [ ] تقارير أسبوعية مختصرة (زيارات/تحويلات/أداء/ملاحظات).

معايير القبول:
- **لوحة مراقبة أساسية** تظهر الزيارات والتحويلات والأداء.

---

### P18 — التوثيق والتسليم
- [ ] README للموقع: كيفية التشغيل، البناء، النشر، إدارة المحتوى، خرائط المجلدات.
- [ ] صفحة Tokens/Guidelines مختصرة تربط بـ `02-Color-Palettes-Spec.html`.
- [ ] Export لقيم الألوان كـ JSON (JavaScript Object Notation — صيغة كائن جافاسكربت) للاستخدامات الأخرى (اختياري).

معايير القبول:
- **توثيق واضح** يكفي لمطور/مصمم يستلم الشغل بدون أسئلة كثيرة.

---

### أوامر مفيدة (مختصرة)
```bash
# تشغيل محلي
npm run dev

# بناء وفحص الإنتاج
npm run build && npm run start

# توليد خريطة الموقع
npx next-sitemap

# اختبارات Playwright
npx playwright test
```

---

### قائمة القبول النهائي (Acceptance Checklist)
- [ ] الهوية مطابقة: ألوان/توكنز/موشن/خط دبي.
- [ ] الصفحة كاملة الأقسام: Hero/Packages/Portfolio/Process/FAQ/Contact.
- [ ] SEO/OG/Sitemap/robots/JSON‑LD صحيحة.
- [ ] Analytics/Pixel تعمل وتلتقط الأحداث.
- [ ] أداء: LCP ≤ 2.0s، CLS ≤ 0.05، Lighthouse ≥ 95.
- [ ] وصول: تباين AA، تنقل لوحة المفاتيح، Focus واضح، Alt نصوص.
- [ ] تجاوب ممتاز على الشاشات الشائعة.
- [ ] نشر على الدومين + مراقبة أساسية مفعّلة.
- [ ] بريد الدومين يعمل (MX/SPF/DKIM/DMARC مفعّلة) وفق `EMAIL-DOMAIN-SETUP.md`.

— انتهى —


