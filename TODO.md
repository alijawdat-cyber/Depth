## TODO — خطة تطوير شاملة (مرتكزة على 6‑FINAL)

ملاحظة: سيتم توسيع أي اختصار في كل مرّة يظهر فيها: SSOT (Single Source of Truth — مصدر واحد للحقيقة)، CTA (Call To Action — دعوة لاتخاذ إجراء)، OPEX (Operating Expenditure — المصاريف التشغيلية)، COGS (Cost of Goods Sold — كلفة البضاعة المباعة)، GTM (Go‑To‑Market — الذهاب إلى السوق)، SLA (Service Level Agreement — اتفاقية مستوى الخدمة)، SOP (Standard Operating Procedure — إجراء تشغيلي قياسي)، FX (Foreign Exchange — سعر الصرف)، CSV (Comma‑Separated Values — القيم مفصولة بفواصل)، PDF (Portable Document Format — صيغة مستند منقول)، SVG (Scalable Vector Graphics — رسومات متجهية قابلة للتدرّج)، EPS (Encapsulated PostScript — بوست سكريبت مغلف)، ICC (International Color Consortium — اتحاد اللون الدولي)، AEP (After Effects Project — مشروع أفتر إفكتس)، PRPROJ (Premiere Pro Project — مشروع بريمير برو)، MP4 (MPEG‑4 Part 14 — إم بي إي جي‑4 جزء 14)، WebM (صيغة فيديو ويب مفتوحة)، EPR (Encoder Preset — إعداد ترميز)، GA4 (Google Analytics 4 — تحليلات جوجل 4).

مصادر الحقيقة المعتمدة:
- التسعير/السياسات: `Depth‑Core‑Docs/6-Feasibility-and-Operations-FINAL.md` (SSOT — Single Source of Truth — مصدر واحد للحقيقة)
- الألوان/التوكنز: `Depth‑Brand‑Identity/02-Color-Palettes-Spec.html` (SSOT — Single Source of Truth — مصدر واحد للحقيقة)

---

### P0 — ضروري (تصحيح تناقضات وتثبيت المصدر) — خلال 48 ساعة

- [ ] توحيد توكنز CTA (Call To Action — دعوة لاتخاذ إجراء):
  - [ ] عدّل `Depth‑Brand‑Identity/02-Color-Palettes-Spec.md` حتى يطابق `.html` (Primary=`--accent-500`, Hover=`--accent-700`).
  - قبول: تعريف CTA (Call To Action — دعوة لاتخاذ إجراء) بالـ `.md` مطابق للـ `.html` حرفياً.

- [ ] توحيد توكنز الخلفية/النص للوضعين الفاتح/الداكن:
  - [ ] يا إمّا إضافة `--bg-light/--text-light/--bg-dark/--text-dark` في `.html`، أو تعديل `.md` لاستخدام `--bg/--text` المعرّفة.
  - قبول: لا توجد توكنز غير معرفة عبر أي ملف، والاستخدام موحّد.

- [ ] سياسة إدارة الإعلانات (Media Buying):
  - [ ] تثبيت 12% + حد أدنى (Basic/Growth Min $350, Pro Min $500) كما في §4.1.
  - [ ] تعديل كل المراجع: `Depth‑Core‑Docs/3-Marketing-and-GTM.md` (GTM — Go‑To‑Market — الذهاب إلى السوق)، `Depth‑Core‑Docs/2-Pricing-and-Margin.csv` (CSV — Comma‑Separated Values — القيم مفصولة بفواصل)، `Depth‑Core‑Docs/1-Contract-Pack(MSA-SOW-NDA)-Brief.md` (ملحق Media Buying).
  - قبول: لا بقايا لعبارة 10–15% في أي ملف؛ النسبة والحد الأدنى موحّدان.

- [ ] نقطة التعادل (Break‑Even) مقابل OPEX (Operating Expenditure — المصاريف التشغيلية) وCOGS (Cost of Goods Sold — كلفة البضاعة المباعة):
  - [ ] حسم منهج الحساب: (أ) هامش 50% → BE≈$4.8k، أو (ب) مساهمة 78% (COGS 22%) → BE≈$3.1k.
  - [ ] تحديث §8 في `6‑FINAL` وأي ذكر في `1-Objectives-and-90Day-Plan.md`.
  - قبول: رقم BE واحد ومتسق مع افتراضات OPEX/COGS.

- [ ] Rate Card نهائي (أسعار بيع):
  - [ ] اعتماد §4.2 في `6‑FINAL` كأسعار بيع نهائية.
  - [ ] تحديث `Depth‑Core‑Docs/2-Pricing-and-Margin.csv` (CSV — Comma‑Separated Values — القيم مفصولة بفواصل) و`Depth‑Core‑Docs/3-Marketing-and-GTM.md` (GTM — Go‑To‑Market — الذهاب إلى السوق) للتطابق.
  - قبول: لا اختلاف سعر لنفس الخدمة بين الملفات.

---

### P1 — تسليمات أساسية (جاهزية تصدير) — خلال 7–10 أيام

- [ ] One‑Pagers PDF (Portable Document Format — صيغة مستند منقول):
  - [ ] `Depth‑Brand‑Identity/assets-placeholders/02_Guides/Depth_Color-Type_OnePager.pdf` (تلخيص توكنز/CTA (Call To Action — دعوة لاتخاذ إجراء)/Contrast/Usage).
  - [ ] `Depth‑Brand‑Identity/assets-placeholders/02_Guides/Depth_Logo-Use_OnePager.pdf` (Grid/Min Sizes/Lockups/Misuse).
  - قبول: كل ملف ≤ صفحتين، متوافق مع `6‑FINAL` وهوية اللون.

- [ ] أصول الشعار النهائية:
  - [ ] `Depth_Logo_Primary_Lockup_Latin_SRGB.svg` (SVG — Scalable Vector Graphics — رسومات متجهية قابلة للتدرّج)
  - [ ] `Depth_Logo_Primary_Lockup_Bilingual_SRGB.svg` (SVG — Scalable Vector Graphics — رسومات متجهية قابلة للتدرّج)
  - [ ] صادرات للطباعة: PDF (Portable Document Format — صيغة مستند منقول) / EPS (Encapsulated PostScript — بوست سكريبت مغلف).
  - قبول: وضع الملفات داخل `assets-placeholders/01_Logo/` وبنِسَب القفل الصحيحة (العربي 85%).

- [ ] Presets وملفات مساندة للتصدير:
  - [ ] PDF `.joboptions` (PDF/X‑4) (PDF — Portable Document Format — صيغة مستند منقول).
  - [ ] Adobe Media Encoder `.epr` (EPR — Encoder Preset — إعداد ترميز) لـ H.264 وWebM (WebM — صيغة فيديو ويب مفتوحة).
  - [ ] ICC Profiles (ICC — International Color Consortium — اتحاد اللون الدولي) لـ sRGB/CMYK.
  - [ ] قوالب AEP (AEP — After Effects Project — مشروع أفتر إفكتس) وPRPROJ (PRPROJ — Premiere Pro Project — مشروع بريمير برو) للـ Intro/Outro/LowerThird + رندرز MP4 (MP4 — MPEG‑4 Part 14 — إم بي إي جي‑4 جزء 14)/WebM.
  - قبول: الملفات تحت `assets-placeholders/03_Motion/` و`export-presets/` حسب الوصف.

- [ ] Excel ديناميكي بدل CSV (CSV — Comma‑Separated Values — القيم مفصولة بفواصل):
  - [ ] إنشاء `Depth‑Core‑Docs/Pricing-and-Margin.xlsx` بخلايا FX (Foreign Exchange — سعر الصرف) ديناميكية وحساب Margin تلقائي.
  - [ ] تضمين سيناريوهات خصم داخلي 15–25% وحساسية FX ±3%.
  - قبول: الأرقام تطابق §4 في `6‑FINAL` مع توليد Margin تلقائي.

---

### P2 — جاهزية مبيعات/تشغيل — خلال 2–3 أسابيع

- [ ] قوالب العقود القابلة للتعبئة:
  - [ ] MSA (Master Services Agreement — اتفاقية خدمات رئيسية) / SOW (Statement of Work — بيان/أمر عمل) / NDA (Non‑Disclosure Agreement — اتفاقية عدم إفشاء) كـ Word/Google Docs.
  - [ ] ملحقات: Equipment / Model / Influencer / Media Buying (12% + Min) محدثة ومتطابقة مع `6‑FINAL`.
  - قبول: قوالب قابلة للتوقيع وخانات تعبئة واضحة.

- [ ] Website Light (خطة التنفيذ السريع):
  - [ ] نصوص Hero/Value/Process/Packages/CTA (CTA — Call To Action — دعوة لاتخاذ إجراء) جاهزة.
  - [ ] Template (Notion + Super/Layer) أو Static بسيط؛ نشر خلال 72 ساعة؛ تتبع GA4 (GA4 — Google Analytics 4 — تحليلات جوجل 4) + Meta Pixel (Meta Pixel — بكسل ميتا).
  - قبول: صفحة عاملة مع نموذج Brief وتتبّع مفعل.

- [ ] Google Sheets (MVP — Minimum Viable Product — الحد الأدنى من المنتج القابل للتطبيق):
  - [ ] Tabs: Clients / Projects / Deliverables / Tasks / Assets / Reviews / Invoices.
  - [ ] أعمدة متوافقة مع SOP (Standard Operating Procedure — إجراء تشغيلي قياسي) للتسمية/المراجعات/التسليم/الحالة.
  - قبول: قوالب مشتركة جاهزة للاستخدام.

---

### P3 — حوكمة وإصدارات — خلال 1–2 أسبوع

- [ ] Versioning (إدارة الإصدارات):
  - [ ] إضافة ختم إصدار (مثلًا: `v2025‑08‑XX`) وتاريخ أعلى الملفات الأساسية.
  - قبول: كل ملف أساسي يحتوي نسخة/تاريخ واضح.

- [ ] SSOT (Single Source of Truth — مصدر واحد للحقيقة) — إشارة صريحة:
  - [ ] إضافة سطر "مصدر الحقيقة" في بداية الملفات: `6‑FINAL` للتسعير/السياسات و`02‑Color‑Palettes‑Spec.html` للألوان.
  - قبول: كل ملف يشير بوضوح لمصدر الحقيقة المناسب.

- [ ] `PRICING‑RATE‑CARD.md` (ملخص نهائي):
  - [ ] إنشاء في `Depth‑Core‑Docs/` يقتبس §4 من `6‑FINAL` + رسوم الإعلانات + الخصم الداخلي.
  - قبول: صفحة واحدة نظيفة، روابط لـ Excel و`6‑FINAL`.

---

### تتبّع واعتماد

- عند إكمال أي بند: (1) تحديث الملفات، (2) فحص الروابط المتقاطعة، (3) ذكر رقم النسخة والتاريخ.
- أي تعديل على FX (Foreign Exchange — سعر الصرف) أو الأسعار يُصدَّر أولًا في `6‑FINAL` وExcel، ثم تُحدَّث بقية الملفات التابعة (GTM — Go‑To‑Market — الذهاب إلى السوق، CSV — Comma‑Separated Values — القيم مفصولة بفواصل، عقود، إلخ).


