## خطة عمل شاملة لإعادة ترتيب وبناء الموقع وفق التوثيق (Iraq‑Arabic)

⚠️ ملاحظة تشغيلية حرجة — هذا الملف هو المرجع التنفيذي الأساسي (SSOT‑Execution)
- أي مهمة ما تنطلق إلا بعد «تحليل أولي دقيق» مزدوج: ملفات التوثيق `docs/*` + الكود الحالي `src/*` (قبل التنفيذ) حتى نتجنّب النسيان والأخطاء.
- كل عملية/مهمة لازم تتبعها «مراجعة/تحليل لاحق» يثبت أثر التغيير قبل/بعد، ويذكر أي تبعيات أو روابط لملفات ثانية تحتاج تعديل.
- لازم تحديث «لوحة التشيكبوكس» (§36 و§40) فور كل مهمة: علّمها مكتملة، أضف ملاحظات تبعية (cross‑file impacts) وروابط الكومِت/PR إن وجدت.
- تذكير فحوصات لكل مهمة: اختبارات وحدة/تكامل، مراجعة واجهات عربي/RTL، وتجربة على بيئة Staging/نشر الدومين للتأكد من سريان التغيير فعلاً.
- إذا ظهرت ملفات أخرى تتأثر: أذكرها صراحةً كملاحظة تبعية مع مساراتها الدقيقة، وأضف مهام مرتبطة في §36 وملخص تأثيرات في §41 (قبل/بعد) حتى نظل متزامنين.

هاي الخطة مفصّلة خطوة بخطوة حتى نحول التوثيق إلى كود شغّال، مع مسارات الملفات، قبل/بعد، وأمثلة شاشات. مرتبة على سبعات (Sprints) وباقي الأقسام أدناه.

---

### 1) الهدف العام (TL;DR)
- نبني مصدر حقيقة واحد (SSOT) للكتالوغ والتسعير داخل Firestore (Catalog + Rate Card).
- نطبّق Pricing Engine حسب `docs/catalog/11-Pricing-Engine.md`، ونطلع Quotes/SOW بإدارة إصدارات (Versions/Snapshots) وGuardrails.
- نحدّث لوحة الأدمن والبوابة حتى تدعم: Pricing/Quotes/SOW/Approvals، وبعدها نكمل Overrides/Creator/Employee تدريجياً.

---

### 2) ربط الوثائق بالمنتج (Mapping)
- `docs/catalog/01-Taxonomy-Catalog.md` → Collections: `catalog_categories`, `catalog_subcategories`, `catalog_verticals`.
- `docs/catalog/09-Seed/taxonomy.json` → Seed أولي للـ Catalog.
- `docs/catalog/06-Rate-Card-Strategy.md` + `docs/catalog/09-Seed/rate-card.json` → Collection: `pricing_rate_card` (نسخ/إصدارات).
- `docs/catalog/11-Pricing-Engine.md` → `src/lib/pricing/engine.ts` + `/api/pricing/quote/preview`.
- `docs/catalog/08-SOW-Templates.md` → `src/app/api/contracts/sow/generate/route.ts` (+ PDF/R2).
- `docs/catalog/07-Governance-and-Versions.md` → `src/lib/governance/*` + Admin Governance UI.
- `docs/roles/*` → حماية المسارات + تبويبات Admin/Portal، والـ Overrides لاحقاً.
- `docs/catalog/14-Location-Zones.md` → ضمن `pricing_rate_card.locationZonesIQD` ويطبّق داخل Engine.
- `docs/catalog/13-SLA-Matrix.md` → عرض ETA رمزي في Quote/SOW (optional MVP).

---

### 3) خارطة سبعات (Sprints) واقعية
1) SSOT الكتالوغ + Seed + Endpoints قراءة (يومين).
2) Pricing Engine + Quote Preview API + صفحة Pricing للأدمن (3 أيام).
3) Quotes CRUD + Client Approve + Snapshot FX/Version + SOW Generate/Store (3–4 أيام).
4) Governance (Versions/Diff/Audit) + Overrides (3 أيام).
5) Compliance/SLA/Polish + Notifications (2–3 أيام).
6) Roles (Creator/Employee) أولية (2–3 أيام).

ملاحظة: نبدأ بالفئات + Rate Card مو بالأدوار حتى كل الشاشات تبني على مصدر وحيد مضبوط.

---

### 4) سكيما Firestore (مقترحة)
- `catalog_categories` { id, nameAr, nameEn, order }
- `catalog_subcategories` { id, categoryId(ref), nameAr, nameEn, desc, defaults{ ratios[], formats[], processingLevels[], verticalsAllowed[], complianceTags[] }, priceRangeKey }
- `catalog_verticals` { id, nameAr, nameEn, modifierPct }
- `pricing_rate_card` {
  versionId, effectiveFrom, status('active'|'archived'),
  basePricesIQD{ key:number }, baseRangesIQD{ key:[min,max] },
  processingLevels{ raw_only, raw_basic, full_retouch },
  modifiers{ rushPct, creatorTierPct{T1,T2,T3}, rawPct?, retouchMinPct?, retouchMaxPct? },
  verticalModifiers{ beauty,furniture,fashion,default },
  locationZonesIQD{ baghdad_center, baghdad_outer, provinces_near, provinces_far },
  overrideCapPercent, guardrails{ minMarginDefault, minMarginHardStop }, roundingIQD,
  fxPolicy{ mode,lastRate,lastDate,source }
}
- `quotes` {
  clientEmail, projectId?, lines[ { subcategoryId, qty, vertical, processing, conditions{ rush:boolean, locationZone?:string },
  unitPriceIQD, calcBreakdown, notes?, estimatedCostIQD? } ], totals{ iqd, usd? },
  guardrails{ margin, warnings[] }, status('draft'|'sent'|'approved'|'rejected'),
  snapshot{ rateCardVersion, fx{ rate,date,source } }, createdAt, updatedAt
}
- `sow` { quoteId, projectId, status('generated'|'sent'|'signed'), pdfUrl, fields, createdAt }
- (لاحقاً) `overrides` { creatorId, scope{ subcategoryId, vertical?, client?, project? }, requestedPriceIQD, reason, status, validFrom/To, checks }

Indexes (مقترحة لاحقاً):
- `projects` by clientEmail, status.
- `files` by projectId, status, createdAt desc.
- `quotes` by clientEmail, status, createdAt desc.
- `catalog_subcategories` by categoryId.

---

### 5) ملفات جديدة — إضافة
- أنواع:
  - جديد: `src/types/catalog.ts`
    - يحتوي: `Category`, `Subcategory`, `Vertical`, `RateCard`, `Quote`, `QuoteLine`, `SOW`, إلخ.

- كتالوغ/Seed/قراءة:
  - جديد: `src/lib/catalog/seed.ts` (يقرأ `docs/catalog/09-Seed/taxonomy.json` و`rate-card.json` ويزرع Firestore)
  - جديد: `src/lib/catalog/read.ts` (قراءة منظمة + caching light)
  - جديد: `src/app/api/catalog/seed/route.ts` (POST, Admin)
  - جديد: `src/app/api/catalog/subcategories/route.ts` (GET)
  - جديد: `src/app/api/catalog/verticals/route.ts` (GET)
  - جديد: `src/app/api/pricing/rate-card/active/route.ts` (GET)

- التسعير (Engine):
  - جديد: `src/lib/pricing/engine.ts` (ترتيب التطبيق + rounding + breakdown)
  - جديد: `src/lib/pricing/guardrails.ts` (فحص هامش/حدود دنيا/عليا)
  - جديد: `src/lib/pricing/fx.ts` (Snapshot FX عند Approve)
  - جديد: `src/app/api/pricing/quote/preview/route.ts` (POST)

- Quotes/SOW:
  - جديد: `src/app/api/pricing/quote/route.ts` (POST/GET/PUT — draft/send/approve/reject)
  - جديد: `src/app/api/contracts/sow/generate/route.ts` (POST: توليد SOW PDF → R2)

- UI Admin:
  - جديد: `src/app/admin/pricing/page.tsx` (عرض/نشر Rate Card + زر Seed)
  - جديد: `src/app/admin/quotes/page.tsx` (بناء Quote من Subcategories، Preview، إرسال)
  - جديد: `src/app/admin/governance/page.tsx` (Versions/Diff/Audit/Snapshots)

- UI Client:
  - جديد: `src/app/portal/quotes/page.tsx` (قائمة العروض + Approve/Reject)
  - جديد: `src/app/portal/documents/page.tsx` (MSA/SOW عرض وتنزيل)

- (لاحقاً) Overrides:
  - جديد: `src/app/api/pricing/overrides/route.ts`
  - جديد: `src/app/admin/overrides/page.tsx`

---

### 6) تعديلات على ملفات موجودة — قبل/بعد (مختصر)

- `src/app/admin/page.tsx`
  - قبل: إدارة Clients/Projects + رفع ملفات.
  - بعد: إضافة روابط/تبويبات إلى: Pricing, Quotes, Governance, Overrides.

- `src/components/features/portal/PortalClientReal.tsx`
  - قبل: Tabs = summary/files/approvals/reports.
  - بعد: إضافة tabs: `quotes`, `documents` + ربط GET `/api/pricing/quote` وملفات SOW.

- `src/types/entities.ts`
  - قبل: Project/File/Approval/Notification.
  - بعد: (اختياري) إضافة `estimatedCostIQD?` لبعض الأنواع أو يترك لطبقة Quote فقط.

- `src/middleware.ts`
  - يبقى نفسه حالياً؛ لاحقاً نضيف مسارات Creator/Employee.

- `src/lib/env.ts`
  - ممكن نضيف مفاتيح بسيطة (puppeteer/renderer) إذا اخترنا HTML→PDF.

---

### 7) أمثلة تدفّق استخدام (Screens)

سيناريو Admin يجهّز التسعير:
1) `admin/pricing`: يضغط “Seed Catalog” → ينزرع `taxonomy/rate-card` في Firestore.
2) يراجع `Rate Card` ويضغط “Publish Version v2025.09”.
3) `admin/quotes`: يبني Quote (اختار `photo_flat_lay`, qty=20, vertical=fashion, processing=raw_basic, conditions=Studio/Standard) → Preview يطلع breakdown + Guardrails.
4) Send → إنشاء Quote بالـ DB وإرسال إشعار للعميل.

سيناريو Client يوافق:
1) `portal/quotes`: يشوف العرض (IQD + خيار USD عند Snapshot فقط).
2) Approve → النظام يحفظ Snapshot { rateCardVersion, fx{rate,date,source} } ويولّد SOW.
3) `portal/documents`: يشوف SOW ويتنزل PDF من R2.

---

### 8) أمثلة قبل/بعد (ملفات محددة)

- قبل:
  - ماكو `src/types/catalog.ts`.
  - ماكو `/api/catalog/*` ولا `/api/pricing/quote/preview`.
  - Admin ما بيه Pricing/Quotes pages.

- بعد:
  - جديد: `src/types/catalog.ts` (كل أنواع الكتالوغ والـ Rate Card/Quote/SOW).
  - جديد: `/api/catalog/seed`, `/api/catalog/subcategories`, `/api/pricing/rate-card/active`.
  - جديد: `/api/pricing/quote/preview` يرجّع:
    {
      "lines": [{ "subcategoryId":"photo_flat_lay", "qty":20, "vertical":"fashion", "processing":"raw_basic", "conditions":{"rush":false,"locationZone":"baghdad_center"}, "breakdown":{...}, "finalRounded": 20000 }],
      "totals": { "iqd": 400000 },
      "guardrails": { "margin": 0.51, "warnings": [] }
    }
  - Admin Pages تظهر “Pricing/Quotes/Governance”.

---

### 9) توافقية الوثائق (حواجز/FX/Location)
- Guardrails: هامش ≥ 50% افتراضياً، حد قاسي 45% يمنع الإرسال.
- FX: IQD أولاً؛ USD عرضي فقط وعند Approve نثبّت Snapshot.
- Location: per‑session من `locationZonesIQD`; per‑asset فقط استثناء موثّق.
- Retouch %: من Rate Card حصراً (30–40%).
- Rounding: آخر خطوة (افتراضي 250 IQD).

---

### 10) متطلبات بيئة/مكتبات
- موجود: Next.js App Router، NextAuth، Firestore Admin SDK، SWR، Resend، Cloudflare Images/Stream، R2، Zod.
- مضافة (اختيار):
  - PDF: `@react-pdf/renderer` أو HTML+`puppeteer` (runtime nodejs).
  - `date-fns` لتنسيق تواريخ بسيطة (اختياري).

ENV (عند الحاجة):
- `PDF_RENDER_MODE=html|react-pdf` (اختياري)
- مفاتيح Cloudflare/R2 موجودة أصلاً.

---

### 11) معايير القبول (DoD)
- Seed يعمل ويولّد `catalog_*` و`pricing_rate_card` نسخة Active.
- Engine يرجّع نفس النتائج المتوقعة من أمثلة التوثيق (Smoke tests).
- Guardrails تمنع إرسال Quote إذا margin < 0.45.
- Approve Quote يولّد Snapshot (rateCardVersion+FX) وسجّل SOW.
- صفحات Admin (Pricing/Quotes/Governance) وPortal (Quotes/Documents) تعمل من أول مرة.

---

### 12) اختبارات/تحقق
- Unit: `engine.ts` (حالات RAW/Retouch/Rush/Location/Tier/Override/Rounding).
- Integration: `/api/pricing/quote/preview` + إنشاء Quote + Approve + SOW.
- Manual QA: شاشات Admin/Portal، عرب/RTL، حمّل ملفات، تدقيق Unauthorized.

---

### 13) مخاطر وحلول
- حدود Firestore `in` (≤10): نجزّئ القوائم (مطبق أصلاً في approvals) ونستمر على نفس النمط.
- FX اختلافات: Snapshot يضمن الثبات.
- PDF توليد: نختار أبسط مسار أولاً (HTML→PDF)؛ لو صارت مشاكل نبدّل لـ `@react-pdf/renderer`.
- تقاطع Rounding: نطبّقه آخر مرحلة فقط حسب التوثيق.

---

### 14) توزيع العمل (ملف/مسار → مسؤولية)
- Types/Engine/API: (Dev)
- Admin UI: Pricing/Quotes/Governance (Dev + Design).
- Portal UI: Quotes/Documents (Dev).
- PDF/SOW: (Dev) + QA نصوص وقوالب عربية.

---

### 15) قائمة مهام (Checklist)
- [ ] إنشاء `src/types/catalog.ts`.
- [ ] بناء `src/lib/catalog/seed.ts` + `/api/catalog/seed`.
- [ ] Endpoints قراءة الكتالوغ/Rate Card.
- [ ] Engine + `/api/pricing/quote/preview`.
- [ ] Admin Pricing Page (Seed/Publish/عرض القيم).
- [ ] Quotes CRUD + Approve + Snapshot FX/Version.
- [ ] SOW Generate (PDF) + R2 + Portal Documents.
- [ ] Governance Page (Versions/Diff/Audit).
- [ ] Overrides (API + Admin) — لاحقاً.
- [ ] Compliance/SLA تنبيهات + Polish.
- [ ] Tests (Unit/Integration) + Indexes.

---

### 16) أمثلة JSON سريعة (Engine Input/Output)
Input (preview):
{
  "lines": [
    {
      "subcategoryId": "photo_flat_lay",
      "qty": 20,
      "vertical": "fashion",
      "processing": "raw_basic",
      "conditions": { "rush": false, "locationZone": "baghdad_center" },
      "tier": "T2",
      "overrideIQD": null
    }
  ]
}

Output (preview):
{
  "lines": [
    {
      "subcategoryId": "photo_flat_lay",
      "qty": 20,
      "breakdown": {
        "base": 19500,
        "afterVertical": 19500,
        "afterProcessing": 19500,
        "afterRush": 19500,
        "+location": 5000,
        "afterTier": 21450,
        "final": 21450,
        "finalRounded": 21500
      },
      "unitPriceIQD": 21500,
      "lineTotalIQD": 430000
    }
  ],
  "totals": { "iqd": 430000 },
  "guardrails": { "margin": 0.50, "warnings": [] }
}

---

### 17) ترتيب التنفيذ الفعلي البدايات
أول خطوة راح نبدي بيها: 
1) `src/types/catalog.ts`
2) `src/lib/catalog/seed.ts` + `/api/catalog/seed`
3) `/api/pricing/rate-card/active` + `/api/catalog/subcategories`
وبعدها مباشرة نكتب `src/lib/pricing/engine.ts` و`/api/pricing/quote/preview`.

—
أي تحديثات لاحقة نضيفها على نفس الملف `todo.md` حتى تبقى الخطة حيّة ومتزامنة ويا الواقع.


---

### 18) نظرة معمارية (Architecture) — طبقات ومسؤوليات
- Presentation (Next.js App Router): صفحات Admin/Portal + Components.
- API Routes (Server): طبقة أعمال (Catalog/Pricing/Quotes/SOW/Overrides) + Auth.
- Domain Libraries: `lib/catalog`, `lib/pricing`, `lib/governance`، `lib/email`، `lib/cloudflare`.
- Storage:
  - Firestore (SSOT): الكتالوغ/الأسعار/العروض/SOW/إصدارات.
  - Cloudflare Images/Stream/R2: وسائط + وثائق (SOW PDFs).
- Auth/Session: NextAuth (JWT) + Middleware لحماية المسارات بالأدوار.
- Email: Resend + قوالب React Email.

رسم ذهني بسيط: UI → API (/api/..) → Lib (pricing/catalog/governance) → Firestore/R2/Cloudflare.

---

### 19) مواصفات API تفصيلية (Contracts)

1) POST `/api/catalog/seed` (Admin)
- Auth: admin JWT.
- Body: `{ mode?: 'full'|'rate-card'|'taxonomy' }` (افتراضي `full`).
- Actions: يقرأ `docs/catalog/09-Seed/*.json` ويزرع:
  - `catalog_categories`, `catalog_subcategories`, `catalog_verticals`، و`pricing_rate_card` نسخة Active.
- Response: `{ success: true, inserted: { categories, subcategories, verticals, rateCardVersionId } }`
- Errors: 401, 403, 500.

2) GET `/api/catalog/subcategories`
- Query: `categoryId?`
- Response: `{ items: Subcategory[] }`

3) GET `/api/catalog/verticals`
- Response: `{ items: Vertical[] }`

4) GET `/api/pricing/rate-card/active`
- Response: `{ rateCard: RateCard }`

5) POST `/api/pricing/quote/preview`
- Auth: admin أو client.
- Body:
```
{
  "lines": [
    {
      "subcategoryId": string,
      "qty": number,
      "vertical": string,
      "processing": "raw_only"|"raw_basic"|"full_retouch",
      "conditions": { "rush": boolean, "locationZone"?: string },
      "tier"?: "T1"|"T2"|"T3",
      "overrideIQD"?: number,
      "estimatedCostIQD"?: number
    }
  ]
}
```
- Response:
```
{
  "lines": [{
    "subcategoryId": string,
    "qty": number,
    "breakdown": {
      "base": number,
      "afterVertical": number,
      "afterProcessing": number,
      "afterRush": number,
      "+location": number,
      "afterTier": number,
      "overrideApplied"?: number,
      "final": number,
      "finalRounded": number
    },
    "unitPriceIQD": number,
    "lineTotalIQD": number,
    "warnings": string[]
  }],
  "totals": { "iqd": number, "usd"?: number },
  "guardrails": { "margin"?: number, "status": "ok"|"warn"|"hard_stop", "warnings": string[] }
}
```
- Errors: 400 (بيانات ناقصة/غير صالحة), 401/403, 500.

6) `/api/pricing/quote` (CRUD)
- POST (create draft): Body = preview input + `clientEmail`, `projectId?`, `notes?` → يحفظ draft quote.
- GET (list): Query: `status?`, `clientEmail?` (admin يرى الكل، client يشوف تخصّه) → `{ items: Quote[] }`.
- PUT (state): Body: `{ id, action: 'send'|'approve'|'reject' }`:
  - `send`: يغير status→sent ويرسل إشعار.
  - `approve`: يحفظ Snapshot { rateCardVersion, fx }، ويبذر `sow` (generated)، وربط مشروع إذا لزم.
  - `reject`: يغيّر status→rejected مع سبب اختياري.

7) POST `/api/contracts/sow/generate`
- Body: `{ quoteId }`
- Effect: يولّد PDF اعتماداً على `docs/catalog/08-SOW-Templates.md` + تفاصيل السطور.
- Response: `{ success:true, sowId, pdfUrl }`

8) `/api/pricing/overrides` (لاحقاً)
- POST (create request by creator), GET (list admin), PUT (approve/counter/reject) مع فحص cap% وhard stop.

Errors القياسية (موحّدة):
- 400: `VALIDATION_ERROR`, 401: `UNAUTHORIZED`, 403: `FORBIDDEN`, 404: `NOT_FOUND`, 409: `CONFLICT`, 422: `UNPROCESSABLE`, 500: `SERVER_ERROR`.

---

### 20) نماذج مستندات Firestore (Examples)

`catalog_subcategories` (doc: `photo_flat_lay`):
```
{
  id: "photo_flat_lay",
  categoryId: "photo",
  nameAr: "Flat Lay",
  nameEn: "Flat Lay",
  desc: "ترتيب أفقي متناسق",
  defaults: {
    ratios: ["1:1","4:5","9:16"],
    formats: ["jpg","png"],
    processingLevels: ["raw_only","raw_basic","full_retouch"],
    verticalsAllowed: ["fashion","fnb","sports","ecom"],
    complianceTags: []
  },
  priceRangeKey: "photo_flat_lay"
}
```

`pricing_rate_card` (active version):
```
{
  versionId: "v2025.09.15",
  status: "active",
  effectiveFrom: "2025-09-15",
  basePricesIQD: { "photo_flat_lay": 19500, ... },
  baseRangesIQD: { "photo_flat_lay": [15000,25000], ... },
  processingLevels: { "raw_only": -0.10, "raw_basic": 0.0, "full_retouch": [0.30,0.40] },
  modifiers: { rushPct: 0.35, creatorTierPct: { T1:0, T2:0.10, T3:0.20 } },
  verticalModifiers: { beauty:0.10, furniture:0.05, fashion:0.00, default:0.00 },
  locationZonesIQD: { baghdad_center:5000, baghdad_outer:10000, provinces_near:25000, provinces_far:50000 },
  overrideCapPercent: 0.20,
  guardrails: { minMarginDefault: 0.50, minMarginHardStop: 0.45 },
  roundingIQD: 250,
  fxPolicy: { mode:"manual", lastRate:null, lastDate:null, source:"admin" }
}
```

`quotes` (draft):
```
{
  clientEmail: "client@ex.com",
  projectId: null,
  lines: [{
    subcategoryId: "photo_flat_lay",
    qty: 20,
    vertical: "fashion",
    processing: "raw_basic",
    conditions: { rush:false, locationZone:"baghdad_center" },
    unitPriceIQD: 21500,
    calcBreakdown: { ... },
    estimatedCostIQD: 10000
  }],
  totals: { iqd: 430000 },
  status: "draft",
  snapshot: null,
  createdAt: TS,
  updatedAt: TS
}
```

`sow`:
```
{
  quoteId: "...",
  projectId: "...",
  status: "generated",
  pdfUrl: "r2://...",
  fields: { reviews:2, sla:"48–72h", compliance:"" },
  createdAt: TS
}
```

---

### 21) Zod Schemas (تحقق المدخلات)
- `CatalogSeedRequestSchema`: `{ mode?: z.enum(['full','rate-card','taxonomy']).default('full') }`
- `QuoteLineInputSchema`:
```
z.object({
  subcategoryId: z.string().min(1),
  qty: z.number().int().positive(),
  vertical: z.string().min(1),
  processing: z.enum(['raw_only','raw_basic','full_retouch']),
  conditions: z.object({ rush: z.boolean(), locationZone: z.string().optional() }),
  tier: z.enum(['T1','T2','T3']).optional(),
  overrideIQD: z.number().nonnegative().optional(),
  estimatedCostIQD: z.number().nonnegative().optional()
})
```
- `QuotePreviewRequestSchema`: `{ lines: z.array(QuoteLineInputSchema).min(1) }`

---

### 22) قواعد العمل/الحواف (Business Rules)
- Retouch% يؤخذ حصراً من Rate Card (min/max)؛ إذا دخل نطاق → نختار نقطة default (المتوسط) أو نسمح للـ Admin يحدد.
- Overrides:
  - cap% ≤ `overrideCapPercent` من السعر الناتج قبل الـ override.
  - margin بعد override ≥ `minMarginHardStop` وإلا رفض/Counter.
- Location per‑session يضاف كمبلغ ثابت للسطر (لا يضربه معامل زيادة).
- Rounding دائم آخر خطوة.
- FX Snapshot فقط عند Approve؛ لا نعدّل Quote لاحقاً.

---

### 23) أمن/صلاحيات (RBAC)
- Roles: `admin`, `client` (لاحقاً `creator`, `employee`).
- Middleware (`src/middleware.ts`):
  - `/admin` و`/api/portal/admin/*` → admin فقط.
  - `/portal/(?!auth|about)` → يتطلب Auth (client/admin).
- Scopes مستقبلية (اختيار): `pricing.write`, `catalog.publish`, `approvals.manage`, `contracts.send`.

---

### 24) خطة الترحيل/المزامنة (Migration)
- Seed أولي: تشغيل `/api/catalog/seed`.
- توحيد مشاريع قديمة:
  - إن وُجدت حقول `title` بدل `name` في `projects` → حافظنا على تطبيع بالـ API؛ نضيف مهمة backfill لاحقاً.
- backfill `clients.createdAt` موجود Route إداري (`action=backfill-createdAt`) — نستخدمه مرّة واحدة.
- لا نغيّر بيانات `files/approvals` الحالية؛ فقط نضيف Collections جديدة.

---

### 25) واجهات المستخدم (تفصيلي)
- Admin Pricing (`src/app/admin/pricing/page.tsx`):
  - أقسام: Seed (زر) / Active Rate Card (عرض قيم) / Publish Version (اختيار تاريخ السريان + سبب).
- Admin Quotes (`src/app/admin/quotes/page.tsx`):
  - فورم: Subcategory (Autocomplete) + Qty + Vertical + Processing + Conditions + Tier + Cost Estimate + Preview + Send.
- Admin Governance (`src/app/admin/governance/page.tsx`):
  - Versions list، Diff قبل/بعد لأهم المفاتيح، Snapshot log.
- Portal Quotes (`src/app/portal/quotes/page.tsx`):
  - قائمة عروض (draft/sent/approved/rejected)، عرض تفاصيل + Approve/Reject.
- Portal Documents (`src/app/portal/documents/page.tsx`):
  - SOW/MSA تنزيل/عرض.

States/Empty/Errors متوافقة مع المكوّنات الحالية (States.tsx) وسكلاتون.

---

### 26) البريد/الإشعارات
- Resend: 
  - قوالب: Invitation, Quote Sent, Quote Approved, SOW Ready.
  - مسارات: ضمن `src/lib/email/templates.ts` + استخدام في Routes المعنية.
- Notifications (Firestore): 
  - إضافة أنواع: `quote_sent`, `quote_approved`, `sow_generated`.

---

### 27) العلامة والهوية (Brand)
- اعتماد ألوان `docs/brand-identity/Depth‑Brand‑Identity/02-Color-Palettes-Spec.html` كتوكـنز CSS.
- مراجعة `src/lib/constants/brand.ts` وربطه بأصول:
  - `/public/brand/icon.svg`, `/public/brand/logo-wordmark.svg`, Apple/QR.
- تأكد من ظهور الشعار في الإيميلات (PNG fallback) كما مستخدم حالياً.

---

### 28) SEO/Analytics/Accessibility
- Next SEO، Sitemap/Robots موجودة — راجع الميتا عند إضافة صفحات Admin/Portal الجديدة (noindex للإداري).
- GA4: أحداث هامّة (quote_preview, quote_send, quote_approve, sow_generate).
- RTL: جميع الصفحات تدعم العربية (مفعل حالياً)، حافظ على تناقض ألوان ≥ 4.5.

---

### 29) الأداء/الفهارس/القيود
- تجزئة Queries ذات `in`>10 (مطبّق بالـ approvals، نكرر بالـ quotes إذا احتاج).
- إضافة Indexes حسب الاستخدام (مذكورة في §4).
- Cache خفيف على `rate-card/active` (revalidate=0 للوحة، بس ممكن memory cache).

---

### 30) الأخطاء والسجلات (Errors/Logs)
- هيكل JSON خطأ موحّد `{ ok:false, code, message, requestId }`.
- Logging: `console.error` بالـ API مع `requestId` (مطبّق جزئياً في Files API) — نعممه.
- User‑facing رسائل بالعربي مختصرة وواضحة.

---

### 31) Feature Flags (اختياري)
- `NEXT_PUBLIC_FEATURE_QUOTES=1`
- `NEXT_PUBLIC_FEATURE_GOVERNANCE=1`
- تسمح بإطلاق تدريجي.

---

### 32) خطة الاختبار (تفصيل)
- Unit (pricing): حالات: RAW/Retouch min/max, Rush on/off, Location zones, T1/T2/T3, override داخل/خارج cap, rounding.
- Integration: Seed → Preview → Create Quote → Send → Approve → Snapshot+SOW → عرض بالبوابة.
- E2E (اختيار): Playwright سيناريو عميل يوافق.

---

### 33) المتطلبات البيئية (ENV) — قائمة مُحدّثة
- موجودة الآن (Firebase/Resend/CF/R2). للمزايا الجديدة:
- PDF (إن استخدمنا Puppeteer):
  - `PUPPETEER_EXECUTABLE_PATH` (على منصات سيرفر)
  - أو استخدام `@react-pdf/renderer` بدون احتياج خارجي.
- Flags: `NEXT_PUBLIC_FEATURE_QUOTES`, `NEXT_PUBLIC_FEATURE_GOVERNANCE`.

---

### 34) تعريفات Done لكل سبعة
- سبعة 1: Seed ناجح + GET catalog/rate-card تعمل + Admin Pricing تعرض البيانات.
- سبعة 2: Engine يعمل ويطابق أمثلة docs + Quote Preview API مستقر.
- سبعة 3: Quotes CRUD كاملة + Approve يولّد Snapshot + SOW PDF محفوظ.
- سبعة 4: Governance: Versions/Diff + Overrides API (MVP).
- سبعة 5: Compliance/SLA تنبيهات + Notifications محسّنة.
- سبعة 6: Creator/Employee صفحات أولية (عرض/رفع/Overrides draft).

---

### 35) Tasks إضافية (Backlog)
- توقيع إلكتروني SOW (تكامل خارجي لاحق).
- Real‑time (onSnapshot) إشعارات.
- تقارير KPI (Admin) حسب `docs/roles/admin/08-KPIs-and-Reporting.md`.
- Multi‑currency View فقط (لا حساب) وفق FX Snapshot.




---

### 36) لوحة مهام تنفيذية — Checkbox Tracker (قبل/بعد + مسارات)
- ملاحظة: هاي القائمة تفصيلية ومجمّعة حسب الدومين حتى نتابع الإنجاز خطوة بخطوة. كل بند يذكر المسار قبل/بعد وأسماء الملفات المقصودة.

- **Types & Schemas**
  - [x] إنشاء `src/types/catalog.ts` (جديد) — تعريف: `Category`, `Subcategory`, `Vertical`, `RateCard`, `Quote`, `QuoteLine`, `SOW`.
  - [x] تدقيق تداخل مع `src/types/entities.ts` (قبل: بدون أنواع تسعير/عروض) → (بعد: الإبقاء منفصل، ربط خفيف فقط إن لزم).
  - [ ] Zod Schemas داخل `src/lib/pricing/schemas.ts` (جديد) أو ضمن route نفسه كبداية.

- **Catalog / Seed / Read**
  - [x] `src/lib/catalog/seed.ts` (جديد) — قراءة `docs/catalog/09-Seed/taxonomy.json` و`rate-card.json`، زرع Firestore.
  - [x] `src/app/api/catalog/seed/route.ts` (جديد) — POST، Admin فقط، idempotent، logs + metrics (+ دعم x-seed-key للتجهيز المحلي).
  - [x] `src/lib/catalog/read.ts` (جديد) — دوال: `getSubcategories(categoryId?)`, `getVerticals()`, `getActiveRateCard()`.
  - [x] `src/app/api/catalog/subcategories/route.ts` (جديد) — GET مع `categoryId?`، paging لاحقاً.
  - [x] `src/app/api/catalog/verticals/route.ts` (جديد) — GET.
  - [x] `src/app/api/pricing/rate-card/active/route.ts` (جديد) — GET.
  - [ ] Indexes مقترحة لـ `catalog_subcategories` by `categoryId` (Firestore Index) — توثيق فقط حالياً.

- **Pricing Engine**
  - [ ] `src/lib/pricing/engine.ts` (جديد) — ترتيب التطبيق والـ breakdown + rounding.
  - [ ] `src/lib/pricing/guardrails.ts` (جديد) — هامش/حدود دنيا/عليا ورسائل تحذير.
  - [ ] `src/lib/pricing/fx.ts` (جديد) — Snapshot FX عند `approve`.
  - [ ] `src/app/api/pricing/quote/preview/route.ts` (جديد) — POST، زود تحقق بالـ Zod.
  - [ ] حالات الاختبار (يدوي/ملاحظات): RAW/Retouch min/max, Rush, Location Zones, Tier T1/T2/T3, override ضمن/خارج cap, rounding.

- **Quotes CRUD**
  - [ ] `src/app/api/pricing/quote/route.ts` (جديد) — POST(create draft)/GET(list)/PUT(state: send|approve|reject).
  - [ ] ربط مع `usePortalData` (أو hook جديد `useQuotes`) للبوابة — read-only للـ client.
  - [ ] حماية صلاحيات: admin يرى الكل، client يشوف الخاصة بإيميله.
  - [ ] قوائم GET: دعم `status?`, `clientEmail?` + sort by `createdAt desc`.

- **SOW Generate / Store**
  - [ ] `src/app/api/contracts/sow/generate/route.ts` (جديد) — POST { quoteId }.
  - [ ] خيار توليد PDF: HTML+`puppeteer` أو `@react-pdf/renderer` (نختار الأبسط أولاً).
  - [x] رفع إلى R2 عبر `src/lib/cloudflare.ts` — إضافة دالة `uploadDocumentToR2(...)` (أُنجزت).
  - [ ] حفظ doc في `sow` collection وربط `pdfUrl`.

- **Governance / Versions / Audit**
  - [ ] تمثيل `pricing_rate_card` بإصدارات: `status`, `effectiveFrom`, `versionId` (seed ينشئ active).
  - [ ] صفحة Admin: `src/app/admin/governance/page.tsx` (جديد) — قائمة إصدارات + Diff أساسي.
  - [ ] Log مبسّط في `quotes.snapshot` عند `approve` (موجود ضمن السكيما المقترحة).

- **Admin UI**
  - [ ] `src/app/admin/pricing/page.tsx` (جديد) — أقسام: Seed, Active Rate Card, Publish.
  - [ ] `src/app/admin/quotes/page.tsx` (جديد) — بناء Quote/Preview/Send.
  - [ ] تعديل `src/app/admin/page.tsx` — إضافة روابط tabs: Pricing/Quotes/Governance/Overrides.
  - [ ] Components صغار (اختياري): `RateCardTable`, `QuoteBuilderForm`, `VersionList`.

- **Portal UI**
  - [ ] `src/app/portal/quotes/page.tsx` (جديد) — قائمة العروض + تفاصيل + Approve/Reject.
  - [ ] `src/app/portal/documents/page.tsx` (جديد) — SOW/MSA عرض/تنزيل.
  - [ ] تحديث `src/components/features/portal/PortalClientReal.tsx` — إضافة tabs: `quotes`, `documents`.

- **Auth / Middleware / RBAC**
  - [ ] التحقق من الدور في `/api/catalog/seed` (admin فقط) + باقي المسارات حسب الحاجة.
  - [ ] الإبقاء على `src/middleware.ts` كما هو (حالياً) — مراجعة لاحقة لمسارات creator/employee.

- **Emails / Notifications**
  - [ ] قوالب Resend: `QuoteSent`, `QuoteApproved`, `SowReady` ضمن `src/lib/email/templates.ts`.
  - [ ] إضافة أنواع إشعار: `quote_sent`, `quote_approved`, `sow_generated` في `portal/notifications` API الحالي.

- **ENV / Flags**
  - [ ] إضافة `NEXT_PUBLIC_FEATURE_QUOTES`, `NEXT_PUBLIC_FEATURE_GOVERNANCE` (اختياري للتدرّج).
  - [ ] إن اخترنا Puppeteer: `PUPPETEER_EXECUTABLE_PATH` (سيرفر فقط).

- **Testing / QA**
  - [ ] Smoke: نتيجة `quote/preview` تطابق أمثلة `docs/catalog/11-Pricing-Engine.md`.
  - [ ] Integration Flow: Seed → Preview → Create Quote → Send → Approve → Snapshot+SOW → عرض بالبوابة.
  - [ ] RTL/عربي: مراجعة النصوص في صفحات Admin/Portal.


---

### 37) بلايبُوكس حسب الدور — شنو أشوف بكل شاشة؟
- **Admin**
  - `/admin` (`src/app/admin/page.tsx`):
    - قبل: Clients/Projects/Upload فقط.
    - بعد: Tabs: Pricing, Quotes, Governance, Overrides.
  - `/admin/pricing` (`src/app/admin/pricing/page.tsx`):
    - Seed Catalog (زر) + Active Rate Card Table + Publish Version.
  - `/admin/quotes` (`src/app/admin/quotes/page.tsx`):
    - Quote Builder (اختيار Subcategory/Vertical/Processing/Qty/Conditions/Tier/Cost Estimate) + Preview + Send.
  - `/admin/governance` (`src/app/admin/governance/page.tsx`):
    - Versions List + Diff مفاتيح رئيسية + Snapshots Log.

- **Client**
  - `/portal` (Hub) + تبويب جديد `quotes` و`documents` في `PortalClientReal.tsx`:
    - `quotes`: يعرض (draft/sent/approved/rejected)، تفاصيل Quote، أزرار Approve/Reject.
    - `documents`: SOW/MSA للتحميل/العرض.

- **Creator** (لاحقاً — تخطيط أولي)
  - `/portal/creator` (مستقبلاً): Intake/Profile/Tasks/Overrides Request.
  - يطلعله Overrides History خاصة بي.

- **Employee** (لاحقاً)
  - `/portal/employee` (مستقبلاً): مهام داخلية، تقارير مختصرة.


---

### 38) أهداف قابلة للقياس — مقابل التوثيق
- **01/09 Taxonomy + Seed** → عند زيارة `/admin/pricing` وأضغط Seed: 
  - [ ] توليد `catalog_*` + `pricing_rate_card(active)`، GET endpoints ترجع بيانات.
- **11 Pricing Engine** → POST preview:
  - [ ] يُظهر breakdown/rounding/guardrails مطابق للأمثلة.
- **05 Project Pricing Form** → Admin Quotes Page:
  - [ ] بناء Quote من Subcategories/Options وإرساله للعميل.
- **07 Governance** → Governance Page:
  - [ ] عرض نسخ الـ Rate Card + Diff + Snapshot عند Approve.
- **08 SOW Templates** → Generate SOW:
  - [ ] إنشاء PDF وتخزينه بـ R2 مع رابط في Portal Documents.
- **14 Location Zones** → Engine/Preview:
  - [ ] إضافة per‑session fixed IQD حسب المنطقة.
- **13 SLA Matrix** (اختياري أولاً):
  - [ ] إظهار ETA رمزي في العرض/الوثيقة.


---

### 39) خريطة قبل/بعد — الشاشات والمسارات
- `/admin` (`src/app/admin/page.tsx`)
  - قبل: لوحة مختصرة.
  - بعد: روابط Tabs: `pricing`, `quotes`, `governance`, `overrides`.
- `/admin/pricing` (`src/app/admin/pricing/page.tsx`) — جديد
  - بعد: Seed/عرض Active/Publish.
- `/admin/quotes` (`src/app/admin/quotes/page.tsx`) — جديد
  - بعد: Quote Builder/Preview/Send.
- `/admin/governance` (`src/app/admin/governance/page.tsx`) — جديد
  - بعد: Versions/Diff/Audit.
- `/portal/quotes` (`src/app/portal/quotes/page.tsx`) — جديد
  - بعد: قائمة عروض + تفاصيل + Approve/Reject.
- `/portal/documents` (`src/app/portal/documents/page.tsx`) — جديد
  - بعد: SOW/MSA.


---

### 40) Milestones — تتبع إنجاز (Checkbox)
- سبعة 1 — Catalog/Seed/Read
  - [ ] أنواع `catalog.ts`
  - [ ] Seed API
  - [ ] GET subcategories/verticals
  - [ ] GET rate‑card/active
  - [ ] Admin Pricing: يعرض Active ويشتغل زر Seed
- سبعة 2 — Engine/Preview
  - [ ] engine.ts + guardrails.ts + fx.ts
  - [ ] POST quote/preview
  - [ ] نتائج smoke تطابق docs
- سبعة 3 — Quotes/SOW
  - [ ] CRUD `/api/pricing/quote`
  - [ ] Approve → Snapshot FX/Version
  - [ ] Generate SOW + R2 + Portal Documents
- سبعة 4 — Governance/Overrides
  - [ ] صفحة Governance تعرض نسخ + Diff
  - [ ] Overrides API (MVP)
- سبعة 5 — Compliance/SLA/Notifications
  - [ ] تنبيهات SLA/Compliance (اختياري)
  - [ ] Emails Quote/SOW
- سبعة 6 — Creator/Employee (MVP)
  - [ ] صفحات أولية + صلاحيات


---

### 41) تفاصيل إضافية — قبل/بعد للملفات (Path-by-Path)
- `src/types/entities.ts`
  - قبل: أنواع Projects/Files/Approvals.
  - بعد: بدون تغيير جذري؛ أنواع التسعير تبقى في `src/types/catalog.ts` لتجنّب التضارب.
- `src/hooks/usePortalData.ts`
  - قبل: يجمع بيانات Client (projects/files/approvals).
  - بعد: إمّا توسيع hook لقراءة quotes/documents، أو إنشاء `useQuotes`, `useDocuments` منفصلة.
- `src/components/features/portal/PortalClientReal.tsx`
  - قبل: Tabs = summary/files/approvals/reports.
  - بعد: إضافة `quotes`, `documents` وربط Endpoints الجديدة.
- `src/lib/constants/brand.ts`
  - يبقى كما هو، مراجعة فقط إن احتجنا ألوان/توكنز إضافية.
- `src/lib/cloudflare.ts`
  - إضافة وظيفة `uploadDocument` لاستخدام R2 لـ SOW.
- `src/app/api/portal/*`
  - بدون تغيير حالي، فقط إضافة مسارات Pricing/Catalog/Contracts تحت `/api/pricing` و`/api/catalog` و`/api/contracts`.


---

### 42) ماذا أراقب أثناء التطبيق؟ (Observability/QA)
- لكل Route جديد: رجّع `requestId` في الخطأ/النجاح لتسهيل التتبع.
- قياس زمن `quote/preview` (ms) لوضع Budget أداء.
- سجّل أحداث GA4: `quote_preview`, `quote_send`, `quote_approve`, `sow_generate` (client-side فقط للـ Admin/Portal).

---

### 43) Preflight للبيئة + فحص Seed/قراءات (محلي)
- ملاحظة: فشل فحص seed محلياً بسبب نقص مفاتيح ENV (Firebase Admin/NextAuth). لازم تجهيز البيئة قبل الاختبار.

- **ENV لازم تتوفر محلياً (.env.local):**
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
  - `NEXTAUTH_URL=http://localhost:3000`
  - `NEXTAUTH_SECRET=ضع_قيمة_عشوائية_قوية`
  - `ADMIN_EMAILS=admin@depth-agency.com,بريدك@دومينك`
  - `FIREBASE_PROJECT_ID=...`
  - `FIREBASE_CLIENT_EMAIL=...` (سيرفس اكاونت)
  - `FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
  - (اختياري) Cloudflare/R2/Resend للمزايا اللاحقة

- **تشغيل السيرفر:**
  - `npm run dev`

- **Seed (DEV internal) — يسمح بالـ header**
  - شغّل مع `SEED_INTERNAL_KEY=dev-seed`، واستدعِ:
  - `curl -X POST -H 'Content-Type: application/json' -H 'x-seed-key: dev-seed' -d '{"mode":"full"}' http://localhost:3000/api/catalog/seed`

- **GET فحوصات بعد Seed:**
  - `curl http://localhost:3000/api/catalog/subcategories`
  - `curl http://localhost:3000/api/catalog/verticals`
  - `curl http://localhost:3000/api/pricing/rate-card/active`

- **Checkbox بعد الفحص:**
  - [ ] ENV كاملة ومضبوطة محلياً
  - [ ] Seed نجح — أرقام الإدراج و`versionId` ظهرت
  - [ ] قراءات `subcategories/verticals/rate-card` تعمل


## ✅ تحديث الإنجازات - 15 يناير 2025

### 🎉 Sprint 2: Pricing Engine + Quote Preview API - مكتمل بنجاح

#### الملفات المنجزة:
- ✅ `src/lib/pricing/engine.ts` - محرك التسعير الأساسي مع جميع المعادلات
- ✅ `src/lib/pricing/guardrails.ts` - نظام فحص الهوامش والتحذيرات  
- ✅ `src/lib/pricing/fx.ts` - نظام إدارة أسعار الصرف والـ snapshots
- ✅ `src/app/api/pricing/quote/preview/route.ts` - API معاينة العروض
- ✅ `src/app/admin/pricing/page.tsx` - صفحة التسعير للأدمن

#### الإنجازات التقنية:
- ✅ تطبيق معادلة التسعير الكاملة: Base + Vertical + Processing + Rush + Location + Tier + Override + Rounding
- ✅ نظام Guardrails مع Hard Stop و Warning thresholds
- ✅ دعم كامل للعملات مع FX snapshots
- ✅ API شامل مع Validation و Error Handling
- ✅ واجهة Admin تفاعلية للاختبار

#### الاختبارات والنشر:
- ✅ البناء المحلي: نجح بدون أخطاء
- ✅ اختبار APIs: جميع endpoints تعمل بشكل صحيح  
- ✅ Git Push: تم دفع جميع التغييرات
- ✅ الكود المكتوب: 1,618+ سطر جديد

#### الخطوة التالية:
🚀 Sprint 3: Quotes CRUD + Client Approve + SOW Generation

---
