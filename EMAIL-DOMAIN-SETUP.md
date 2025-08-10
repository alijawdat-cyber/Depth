## توثيق إعداد الدومين والإيميل (Google Workspace)

- SSOT (Single Source of Truth — مصدر واحد للحقيقة) لهذا الملف: حالة الدومين والبريد.

### 1) معلومات الدومين
- النطاق: `depth-agency.com`
- المسجِّل (Registrar — المسجل): Squarespace Domains
- حالة التحقق (ICANN — هيئة الإنترنت للأسماء والأرقام المخصصة): Verified عبر رابط البريد (Action Required)
  - مرجع: دليل Squarespace للتحقق: https://support.squarespace.com/hc/en-us/articles/205812218-Verifying-your-Squarespace-managed-domain
 - Nameservers (خوادم الأسماء):
   - `ns-cloud-a1.googledomains.com`
   - `ns-cloud-a2.googledomains.com`
   - `ns-cloud-a3.googledomains.com`
   - `ns-cloud-a4.googledomains.com`

### 2) سجلات DNS (Domain Name System — نظام أسماء النطاقات)
- MX (Mail Exchange — تبادل البريد) — Google (الإعداد الحديث):
  - `SMTP.GOOGLE.COM.` (أولوية 1)
  - TTL: 3600s (مُستحسن)
  - الحالة: Active/Pass (مفحوصة على أكثر من ريزولفر)
  - ملاحظة: الإعداد القديم كان خمسة سجلات (`ASPMX/ALT1..ALT4`). لا حاجة لها مع الإعداد الحديث.

- SPF (Sender Policy Framework — إطار سياسة المرسل) — TXT على الجذر `@`:
  - `v=spf1 include:_spf.google.com ~all`
  - الحالة: Done (موجودة على الجذر)

- DKIM (DomainKeys Identified Mail — مفاتيح نطاق البريد المعرّف):
  - الحجم: 2048‑bit
  - اسم السجل (Host — الاستضافة): `google._domainkey`
  - القيمة: مولدة من Admin Console (قيمة طويلة موجودة)
  - الحالة: On/Authenticating (السجل منشور والـ DKIM مفعّل)

- DMARC (Domain-based Message Authentication, Reporting and Conformance — مصادقة وتقارير):
  - اسم: `_dmarc`
  - نوع: TXT
  - قيمة مبدئية (سياسة تحفظية):
    - `v=DMARC1; p=quarantine; rua=mailto:dmarc@depth-agency.com; fo=1; pct=100`
  - الحالة: Done (منشور ويستلم تقارير إلى `dmarc@depth-agency.com`)

- A/CNAME (استضافة الموقع عبر Vercel):
  - `@` → A = `76.76.21.21` (TTL: 1h)
  - `www` → CNAME = `cname.vercel-dns.com` (TTL: 1h)
  - ملاحظة: تم حذف سجلات Squarespace السابقة (A الأربعة وCNAME `ext-sq.squarespace.com`) وسجل HTTPS (ALPN/IP hint).

- Resend (Transactional Sending — إرسال الموقع):
  - الهدف: تفعيل إرسال رسائل `/contact` من الدومين بشكل موثوق.
  - السجلات (على ساب‑دومين فقط؛ لا تغيّر إعدادات Google على الجذر):
    - Host: `send` (MX) → `feedback-smtp.us-east-1.amazonses.com` (Priority 10, TTL: Auto/1h)
    - Host: `send` (TXT — SPF) → `v=spf1 include:amazonses.com ~all`
    - Host: `resend._domainkey` (TXT — DKIM) → قيمة طويلة تبدأ بـ `p=...` (مولّدة من Resend)
  - الحالة: Verified على Resend.

### 3) حسابات ومجموعات البريد
- المستخدم المدفوع (User — مستخدم): `admin@depth-agency.com` (خطة مرنة)
- المجموعات (Groups — مجموعات) المجانية المقترحة: 
  - `hello@depth-agency.com` → توصيل إلى `admin@depth-agency.com`
  - `sales@`, `billing@`, `support@` → توصيل إلى `hello@`

### 4) الأمان والسياسات
- 2FA (Two-Factor Authentication — تحقق بخطوتين): Enforce على جميع المستخدمين
- كلمات المرور: ≥ 12 حرف
- تعطيل Less secure apps

### 5) فحوص التشغيل (Post-Setup Checks)
- Admin Console → Domains → Check MX: Passed. ملاحظة: إن ظهرت "Request timed out" في أداة Google Toolbox فهذا خلل أداة مؤقت.
- إرسال/استلام اختبار من `admin@depth-agency.com` إلى Gmail خارجي والعكس: Passed
- DKIM: Status = Authenticating/On بعد النشر
- DMARC: تُقرأ تقارير `rua` إلى بريد `dmarc@depth-agency.com` (اختياري إنشاء Alias)
- Web/Vercel: 
  - `A depth-agency.com` = `76.76.21.21`
  - `CNAME www.depth-agency.com` = `cname.vercel-dns.com`
  - Vercel Project → Domains: Valid Configuration + Primary = `depth-agency.com` + Redirect `www`→الجذر
- Resend:
  - Domains → `depth-agency.com` = Status: Verified (MX/TXT/DKIM ✅)
  - Logs: ظهور رسائل الاختبار المرسلة من `/api/contact`

#### نتائج فحص مباشرة (مرجعية)
```
MX: 1 smtp.google.com.
SPF: v=spf1 include:_spf.google.com ~all
DKIM: google._domainkey (2048‑bit) موجود
DMARC: v=DMARC1; p=quarantine; rua=mailto:dmarc@depth-agency.com; fo=1; pct=100
NS: ns-cloud-a1..a4.googledomains.com
```

### 6) سجل الحالة (Changelog)
- v2025-08-10:
  - ربط Resend وإكمال التحقق (Verified): إضافة سجلات `send` (MX + TXT SPF) و`resend._domainkey` (TXT DKIM).
  - ضبط متغيرات البيئة على Vercel: `RESEND_API_KEY`، `EMAIL_FROM`، `EMAIL_TO`، وتثبيت `NEXT_PUBLIC_SITE_URL` للإنتاج.
  - تفعيل إرسال الموقع عبر `/api/contact` (مع تحقق Zod وhoneypot للسبام).
  - اختبار إرسال ناجح ومتابعة عبر Resend → Logs.
  - المتبقي: إنشاء/تأكيد مجموعة `hello@depth-agency.com` (توجيهها إلى `admin@`)، مراقبة تقارير DMARC أسبوعين ثم رفع السياسة إلى `p=reject` عند النظافة.
- v2025-08-09:
  - نقل استضافة الويب إلى Vercel: `@` A = 76.76.21.21، و`www` CNAME = `cname.vercel-dns.com`
  - حذف سجلات Squarespace (A الأربعة + CNAME `ext-sq.squarespace.com` + HTTPS)
  - تثبيت Primary Domain على Vercel = `depth-agency.com` وتفعيل تحويل `www` للجذر
  - إبقاء MX/SPF/DKIM/DMARC كما هي (Google Workspace)
- v2025-08-08:
  - Domain verified (Squarespace)
  - MX محدث إلى `smtp.google.com` (حديث) — فعال
  - SPF/DKIM/DMARC منشورة ومفعّلة
  - توثيق محدث للحالة الفعلية

### 7) إجراء ربط الدومين على Vercel (مختصر عملي)
1. Vercel → Project → Settings → Domains → Add: `depth-agency.com` + `www.depth-agency.com`.
2. في إدارة DNS (Squarespace Domains):
   - احذف: A القديمة (عناوين Squarespace) + CNAME `www` (ext‑sq) + سجل HTTPS.
   - أضف: `A @ = 76.76.21.21`، و`CNAME www = cname.vercel-dns.com` (TTL 1h).
3. انتظر 5–30 دقيقة (قد تمتد لساعتين) → اضغط Refresh على Vercel حتى تصير Valid.
4. عيّن Primary = `depth-agency.com` وفعل تحويل `www` للجذر.

#### 7‑مكرر) ربط الدومين على Resend (للإرسال من الموقع)
1. Resend → Domains → Add: `depth-agency.com` (Region افتراضي).
2. أضف سجلات `send` (MX + TXT SPF) و`resend._domainkey` (TXT DKIM) كما أعلاه في DNS (Squarespace).
3. انتظر، ثم Verify حتى تصير `Verified`.
4. لا تغيّر سجلات الجذر الخاصة بـ Google.

### 8) النشر عبر GitHub (Flow ثابت)
- الكود داخل الريبو تحت المجلد `depth-site/` (Root Directory بالمشروع على Vercel = `depth-site`).
- أي تعديل → `git add` + `git commit` + `git push` إلى فرع `main` → Vercel يبني وينشر تلقائيًا.
- إعدادات البناء (افتراضيًا): Framework = Next.js، Build Command = `next build`، Output = `.next`.
- متغيرات البيئة (Production فقط):
  - `NEXT_PUBLIC_SITE_URL = https://depth-agency.com`
  - `RESEND_API_KEY = re_...` (من Resend)
  - `EMAIL_FROM = Depth <hello@depth-agency.com>` (قبل التحقق يمكن استخدام `onboarding@resend.dev` للاختبار)
  - `EMAIL_TO = admin@depth-agency.com`
- فحوص بعد النشر:
  - `/<robots.txt>` و`/sitemap.xml` و`/opengraph-image` تعمل.
  - مشاركة رابط على واتساب/تويتر تعرض صورة OG.
  - Pages تعمل بدون أخطاء.

#### ملاحظة تقنية — API الموقع
- مسار `src/app/api/contact/route.ts` مرتبط بـ Resend ويرسل إلى `EMAIL_TO`، ويتجاهل الطلبات التي تحتوي حقل honeypot (مكافحة سبام).

### 9) تحسين وتطوير المراسلات (Roadmap عملي)
- إرسال الموقع (Transactional):
  - تفعيل قالب HTML رسمي للرسائل (RTL + خط Dubai + توقيع مختصر) — يُضاف لاحقًا داخل `/api/contact` أو عبر Resend Templates.
  - إضافة `Reply-To` ديناميكي إلى بريد المرسل (مفعّل حاليًا)، وموضوع واضح: `رسالة جديدة من {name}`.
  - التقاط `UTM`/المصدر في الفورم وإظهاره في الرسالة (موجود حقل `source`).
  - حماية إضافية: Turnstile من Cloudflare (Site/Secret Keys كـ ENV) + Rate‑limit خفيف على IP.

- استلام/توزيع داخلي:
  - مجموعة `hello@` نشطة وتوزّع على `admin@`. يمكن إضافة أعضاء آخرين لاحقًا.
  - إن لزم، تفعيل Collaborative Inbox للمجموعة (تعيين/حل المحادثات).

- مراقبة السمعة والتسليم:
  - تفعيل Google Postmaster Tools للدومين ومراقبة Reputation وDelivery Errors.
  - بعد أسبوعين بدون مشاكل: رفع DMARC إلى `p=reject` + يمكن إضافة `adkim=s; aspf=s; sp=reject` لصرامة أعلى.

- سجلات وأتمتة (اختياري):
  - إنشاء Webhook من Resend للأحداث (delivered/bounced/complained) وربطه بمسار جديد مثل `/api/resend/webhook` لتخزين الأحداث (Notion/Airtable/DB).
  - تخزين رسائل الفورم في Google Sheet أو Airtable مع Timestamp وUTM.

- رسائل تأكيد للمرسل (Auto‑reply):
  - نص بسيط بالعربية يؤكّد الاستلام مع زمن استجابة متوقّع ورابط WhatsApp/حجز.

- سياسة التوقيعات (Signature Standard):
  - الاسم | الدور | `depth-agency.com` | `hello@depth-agency.com` | روابط اجتماعية.

- خصوصية/صفحات قانونية:
  - تحديث صفحة `legal` لنقطة جمع البيانات من نموذج الاتصال ومدة الاحتفاظ.


