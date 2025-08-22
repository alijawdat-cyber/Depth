# تقرير تدقيق الوثائق V2.0 — المرحلة 1 (Duplicates • Conflicts • Gaps)

آخر تحديث: 2025-08-22
الحالة: جاهز للتنفيذ (Phase 1)

## الهدف
توحيد الوثائق إلى مصدر حقيقة واحد (SSOT) يمنع الازدواجية والتعارض، ويغطي النواقص بمخرجات تنفيذية جاهزة للتطبيق.

## مصادر الحقيقة المقترحة (SSOT) لكل محور
- المتطلبات: `documentation/01-requirements/00-requirements-v2.0.md`
- التسعير والمعادلات والتعدادات:
  - المعادلات والتعدادات الرسمية: `documentation/99-reference/02-enums-standard.md`
  - الملخص التنفيذي: `documentation/MASTER-DOCUMENT-V2.0.md`
  - تنفيذ الـ API: `documentation/03-api/features/04-pricing.md`
  - البذور/الأسعار: `depth-site/docs/catalog/09-Seed/{rate-card.json, taxonomy.json, equipment.json}`
  - نماذج التكلفة: مرجعية تشغيلية: `depth-site/docs/catalog/12-Cost-Model.md`
  - المناطق/الزونات: مرجعية تشغيلية: `depth-site/docs/catalog/14-Location-Zones.md`
- قواعد التسمية: `documentation/99-reference/04-naming-conventions.md`
- المصطلحات والقاموس: `documentation/99-reference/01-glossary.md` (مع إهمال نسخة الكاتالوج)
- مصفوفة الصلاحيات (دور/وصول): `documentation/99-reference/05-roles-matrix.md`
- سير عمل التطوير: `documentation/04-development/03-development-workflow.md`
- الأمن والمعايير: `documentation/07-security/*` + `documentation/03-api/core/{01-authentication,02-rate-limiting,04-error-handling}.md`
- قاعدة البيانات: `documentation/02-database/{00-data-dictionary,01-database-schema,02-indexes-and-queries}.md`
- واجهة أمامية (نظرة عامة): `documentation/06-frontend/00-frontend-overview.md` مع فصل “Design Tokens” جديد (gap)
- الحوكمة وإقفال النسخ: `documentation/VERSION-LOCK-V2.0.md` (مرجع وحيد)

## الازدواجيات المرصودة وإجراءات المعالجة
1) القاموس
- مكرر: `documentation/99-reference/01-glossary.md` و`depth-site/docs/catalog/10-Glossary.md`
- الإجراء: اعتماد ملف الـ reference كمصدر وحيد. إضافة Front‑Matter في نسخة الكاتالوج تشير للمصدر ثم وسمها Deprecated.

2) مصفوفة الصلاحيات
- مكرر: `documentation/99-reference/05-roles-matrix.md` و`depth-site/docs/roles/*/01-Permissions-Matrix.md` و`depth-site/docs/roles/Permissions-Matrix-All.md`
- الإجراء: SSOT في reference. تُبقي وثائق الأدوار على جداول العرض المبسط فقط مع رابط للمصدر الرسمي.

3) التسعير ومعادلاته
- مكرر عبر: `MASTER-DOCUMENT-V2.0.md`، `99-reference/02-enums-standard.md`، `03-api/features/04-pricing.md`، وملفات الكاتالوج (Rate Card/Cost Model/Location Zones)
- الإجراء: حصر المنطق والمعادلات والتعدادات في reference، والإبقاء على “MASTER” كملخص غير معياري، واعتبار الكاتالوج بيانات تشغيلية Seeds. توحيد الروابط الداخلية.

4) قواعد التسمية
- مكرر: `documentation/99-reference/04-naming-conventions.md` مقابل إرشادات جزئية في `depth-site/docs/roles/Files-and-Delivery-Spec.md`
- الإجراء: الإبقاء على التفاصيل التشغيلية للملفات في وثائق الأدوار مع ربط واضح لقواعد التسمية الرسمية في reference.

5) سير العمل/Workflow
- مكرر: `documentation/04-development/03-development-workflow.md` مقابل أجزاء متفرقة ضمن دلائل المنتج (مثل `depth-site/docs/product/USER-AUTHENTICATION-COMPLETE-GUIDE.md`)
- الإجراء: اعتماد وثيقة التطوير كمرجع وحيد لسير العمل الهندسي، والإبقاء على دلائل المنتج للاستخدام الخاص بالميزة فقط.

## التعارضات المرصودة وقرارات التوحيد المقترحة
1) الألوان والخطوط (Brand vs Frontend vs CSS)
- التعارض:
  - `depth-site/docs/brand-identity/.../02-Color-Palettes-Spec.md` يعرّف الحزمة البصرية الرسمية.
  - `documentation/06-frontend/00-frontend-overview.md` يذكر قيماً مختلفة (أزرق داكن + Tajawal).
  - `styles.css` يستخدم متغيرات حالية (Primary: #6C2BFF) وخط `Inter`، بينما المشروع يحتوي خطوط Dubai (`/fonts/Dubai-*.woff2`).
- القرار المقترح:
  - SSOT للألوان والخطوط: وثائق الهوية المرئية تحت `depth-site/docs/brand-identity/...`.
  - إنشاء “Design Tokens” في `documentation/06-frontend/01-design-tokens.md` تُمثل الألوان/الخطوط/الظلال/المسافات/الحالات (Light/Dark) كمتغيرات CSS.
  - اعتماد `Dubai` للعربية و`Inter` للإنجليزية عبر Font Stack موحد ضمن التوكنز.
  - مواءمة `styles.css` لاحقاً مع التوكنز بعد اعتمادها (Phase 3).

2) العملة وسعر الصرف
- التشتت: ذكر أن IQD هي العملة الأساسية وUSD للعرض التقديري (FX snapshot يدوي) يظهر في ملف المنتجات.
- القرار: توثيق السياسة رسمياً ضمن `03-api/features/04-pricing.md` و`02-database/00-data-dictionary.md` مع جدول “FXSnapshot” وحقول مصدر/تاريخ.

3) صلاحيات موظف براتب
- التأكيد موجود في أكثر من موضع أن الموظف لا يرى الأسعار.
- القرار: توحيده صراحة في `99-reference/05-roles-matrix.md` ووضع “Do/Don’t” واضحة داخل وثائق الدور.

## الفجوات (Gaps) المقترحة للإضافة
- Frontend Design Tokens: `documentation/06-frontend/01-design-tokens.md` (ألوان، خطوط، مسافات، ظلال، حالات التفاعل، Breakpoints، Light/Dark).
- Performance & Accessibility Budgets: `documentation/06-frontend/02-performance-and-a11y.md` (Core Web Vitals، أحجام الحزم، حد طلبات الشبكة، WCAG 2.1 AA Checklists، RTL/LTR).
- API Conventions: `documentation/03-api/core/00-api-conventions.md` (التسميات، نسخ الإصدارات، Headers الإلزامية، أخطاء موحدة تربط بـ `04-error-handling.md`).
- Data Retention & Backups: ضمن `documentation/08-operations/` (سياسات الاحتفاظ والاستعادة وRPO/RTO).

## جدول توحيد الفهارس (Unified ToC) — مختصر
- 00-overview/
- 01-requirements/
- 02-database/
- 03-api/
  - core/ (auth, rate-limiting, websockets, api-conventions, error-handling)
  - features/ (creators, clients, projects, pricing, storage, notifications, messaging, salaried-employees)
  - integrations/
  - admin/
- 04-development/
- 05-mobile/
- 06-frontend/
  - 00-frontend-overview.md
  - 01-design-tokens.md (جديد)
  - 02-performance-and-a11y.md (جديد)
- 07-security/
- 08-operations/
- 99-reference/ (glossary, enums-standard, naming-conventions, roles-matrix, resources, link-alias-mapping)

ملفات الكاتالوج والهوية البصرية تبقى تشغيلية خارج SSOT، مع روابط عكسية واضحة إلى الـ SSOT.

## خطة التنفيذ — على مراحل
- Phase 1 (هذا التقرير): حسم SSOT، حصر الازدواجيات، قرارات التوحيد.
- Phase 2:
  - إضافة Front‑Matter “Deprecated → Use: <link>” للملفات المكررة.
  - إضافة المستندات الناقصة (design-tokens, performance-and-a11y, api-conventions) كقوالب أولية.
  - توحيد الروابط الداخلية (Relative links) إلى المصادر الرسمية.
- Phase 3:
  - مواءمة `styles.css` مع Design Tokens الجديدة (ألوان/خطوط/ظلال/Spacing/States) دون كسر سلوك الواجهة.
  - مراجعة مصفوفة الصلاحيات مع ملفات الأدوار وتحديث العبارات المتعارضة.
- Phase 4:
  - إعداد “Docs Lint” بسيط (Node script) يتحقق من الروابط المعتمدة ومنع تكرار المواضيع الرئيسية.
  - نشر دليل مساهمة (CONTRIBUTING for docs) يوضح سياسة SSOT.

## قرارات تتطلب تأكيد المنتج (Product Sign‑off)
- لوحة الألوان النهائية والخط الافتراضي العربي/الإنجليزي (Brand → Tokens → CSS).
- سياسة FX Snapshot الرسمية (الحقول ومكان التخزين والمصدر اليدوي).
- تحديد SSOT النهائي لمصفوفات الصلاحيات (reference مقابل نسخ العرض المختصرة).

## أثر التغيير (Quick Wins)
- إزالة التضارب بين الألوان والخطوط سيمنع إنتاج UI بواجهات متباينة بين الصفحات.
- توحيد التسعير يمنع اختلاف المعادلات/النتائج بين الواجهة والتوثيق/API.
- تقليل التكرار يرفع دقة البحث ويُسهل الإحالة الداخلية.

---

هذا المستند هو مخرَج المرحلة الأولى. بعد الموافقة، نبدأ بإضافة وثائق التوكنز/الأداء وإشعار “Deprecated” في الملفات المكررة ثم مواءمة الواجهة.
