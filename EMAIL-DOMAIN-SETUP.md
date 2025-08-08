## توثيق إعداد الدومين والإيميل (Google Workspace)

- SSOT (Single Source of Truth — مصدر واحد للحقيقة) لهذا الملف: حالة الدومين والبريد.

### 1) معلومات الدومين
- النطاق: `depth-agency.com`
- المسجِّل (Registrar — المسجل): Squarespace Domains
- حالة التحقق (ICANN — هيئة الإنترنت للأسماء والأرقام المخصصة): Verified عبر رابط البريد (Action Required)
  - مرجع: دليل Squarespace للتحقق: https://support.squarespace.com/hc/en-us/articles/205812218-Verifying-your-Squarespace-managed-domain

### 2) سجلات DNS (Domain Name System — نظام أسماء النطاقات)
- MX (Mail Exchange — تبادل البريد) — Google:
  - `ASPMX.L.GOOGLE.COM.` (prio 1)
  - `ALT1.ASPMX.L.GOOGLE.COM.` (prio 5)
  - `ALT2.ASPMX.L.GOOGLE.COM.` (prio 5)
  - `ALT3.ASPMX.L.GOOGLE.COM.` (prio 10)
  - `ALT4.ASPMX.L.GOOGLE.COM.` (prio 10)
  - TTL: 3600s (مُستحسن)

- SPF (Sender Policy Framework — إطار سياسة المرسل) — TXT على الجذر `@`:
  - `v=spf1 include:_spf.google.com ~all`

- DKIM (DomainKeys Identified Mail — مفاتيح نطاق البريد المعرّف):
  - الحجم: 2048‑bit
  - اسم السجل (Host — الاستضافة): `google._domainkey`
  - القيمة: تُولد من Admin Console → Gmail → Authenticate email → Generate new record
  - الحالة: Pending حتى نشر الـ TXT ثم Start authentication

- DMARC (Domain-based Message Authentication, Reporting and Conformance — مصادقة وتقارير):
  - اسم: `_dmarc`
  - نوع: TXT
  - قيمة مبدئية (سياسة تحفظية):
    - `v=DMARC1; p=quarantine; rua=mailto:dmarc@depth-agency.com; fo=1; pct=100`

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
- Admin Console → Domains → Check MX: يجب أن تكون Passed
- إرسال/استلام اختبار من `admin@depth-agency.com` إلى Gmail خارجي والعكس: Passed
- DKIM: Status = Authenticating/On بعد النشر
- DMARC: تُقرأ تقارير `rua` إلى بريد `dmarc@depth-agency.com` (اختياري إنشاء Alias)

### 6) سجل الحالة (Changelog)
- v2025-08-08:
  - Domain verified (Squarespace)
  - Created `EMAIL-DOMAIN-SETUP.md`
  - جهّزنا MX/SPF نصياً، وDKIM/DMARC Pending للنشر والتفعيل


