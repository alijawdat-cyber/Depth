# 🚀 دليل إدارة Google Workspace & Google Cloud - Depth Agency

**تاريخ التحديث:** 12 أغسطس 2025  
**الإصدار:** 2.0  
**النطاق:** depth-agency.com  
**المدير:** admin@depth-agency.com  
**المشروع:** gam-project-1o6tc  

---

## 📋 فهرس المحتويات

1. [معلومات النظام الأساسية](#معلومات-النظام-الأساسية)
2. [أدوات الإدارة](#أدوات-الإدارة)
3. [الحسابات والمشاريع](#الحسابات-والمشاريع)
4. [التفويضات والصلاحيات](#التفويضات-والصلاحيات)
5. [هيكل المستخدمين والمجموعات](#هيكل-المستخدمين-والمجموعات)
6. [إعدادات البريد الإلكتروني](#إعدادات-البريد-الإلكتروني)
7. [الأوامر الأساسية](#الأوامر-الأساسية)
8. [استكشاف الأخطاء](#استكشاف-الأخطاء)
9. [نسخ احتياطية وأمان](#نسخ-احتياطية-وأمان)

---

## 🏢 معلومات النظام الأساسية

### **Google Workspace:**
```yaml
Organization ID: 298301615311
Customer ID: C021jbcj1
Primary Domain: depth-agency.com
Domain Verified: ✅ True
Creation Date: 2025-08-08T17:26:34Z
Default Language: Arabic (ar)
License: Google Workspace Business Standard
```

### **معلومات المؤسسة:**
```yaml
Organization Name: Depth Studio
Contact Name: ali alrubeay
Address Line 1: alnazimya
Address Line 2: no2
Locality: karrada
Region: بغداد
Postal Code: 10069
Country: IQ
Phone: +9647779761547
Admin Secondary Email: alijawdat4@gmail.com
```

---

## 🛠️ أدوات الإدارة

### **1. GAMADV-XTD3:**
```bash
# معلومات الإصدار
GAM Version: 7.18.03
Python Version: 3.13.5 64-bit
Platform: MacOS Sequoia 15.6 arm64
Installation Path: /Users/alijawdat/bin/gam7
Config Path: /Users/alijawdat/.gam/
```

### **2. Google Cloud SDK:**
```bash
# الحساب النشط
Active Account: admin@depth-agency.com
Default Project: gam-project-1o6tc
Organization: depth-agency.com (298301615311)
```

---

## 🔐 الحسابات والمشاريع

### **Google Cloud Projects:**

#### **المشروع الرئيسي: gam-project-1o6tc**
```yaml
Project ID: gam-project-1o6tc
Project Name: GAM Project
Creation Date: مُنشأ سابقاً
Status: نشط ✅
APIs Enabled: 38 API مفعلة
```

**APIs المفعلة:**
```
- admin.googleapis.com ✅
- gmail.googleapis.com ✅ 
- drive.googleapis.com ✅
- calendar-json.googleapis.com ✅
- contacts.googleapis.com ✅
- vault.googleapis.com ✅
- + 32 API إضافية
```

#### **Service Accounts:**
```yaml
Primary SA: gam-depth-agency@gam-project-1o6tc.iam.gserviceaccount.com
Display Name: GAM Depth Agency
Key File: ~/.gam/oauth2service.json
Status: نشط ✅
Domain-wide Delegation: مفعل ✅
```

---

## 🔑 التفويضات والصلاحيات

### **OAuth2 Client:**
```yaml
Client ID: 911199467050-rkpjhs4mem5j2v6522eu49d52ti8t8tt.apps.googleusercontent.com
File: ~/.gam/oauth2.txt
Admin: admin@depth-agency.com
Scopes: 47 scope مفعل
Expires: 2025-08-12T22:47:21+00:00
```

### **Domain-wide Delegation:**
```yaml
Status: مفعل ✅
Client ID: gam-depth-agency@gam-project-1o6tc.iam.gserviceaccount.com
Location: Admin Console → Security → API Controls → Domain-wide Delegation
```

**Scopes المفوضة (37 scope):**
```
✅ https://mail.google.com/
✅ https://www.googleapis.com/auth/gmail.modify
✅ https://www.googleapis.com/auth/gmail.settings.basic
✅ https://www.googleapis.com/auth/gmail.settings.sharing
✅ https://www.googleapis.com/auth/calendar
✅ https://www.googleapis.com/auth/drive
✅ https://www.googleapis.com/auth/contacts
✅ + 30 scope إضافية
```

### **Organization Policies:**
```yaml
# تم إلغاؤها للسماح بإنشاء Service Account Keys
iam.disableServiceAccountKeyCreation: DELETED ✅
# على مستوى Organization: DELETED ✅  
# على مستوى Project: DELETED ✅
```

---

## 👥 هيكل المستخدمين والمجموعات

### **المستخدمين (1 مستخدم):**
```yaml
admin@depth-agency.com:
  Name: ali alrubeay
  Role: Super Admin ✅
  2FA: مفعل ✅
  Last Login: 2025-08-12T15:30:16Z
  Photo: Google Default (حاجة تحديث)
  Recovery Email: alijawdat4@gmail.com
  Org Unit: / (Root)
```

### **المجموعات (10 مجموعات):**
```yaml
billing@depth-agency.com:
  Name: Billing
  Description: محاسبة ومدفوعات
  
hello@depth-agency.com:
  Name: Hello  
  Description: استقبال استفسارات العملاء والمتابعة
  
invoices@depth-agency.com:
  Name: Invoices
  Description: استلام/إرسال فواتير
  
jobs@depth-agency.com:
  Name: Jobs
  Description: طلبات التوظيف
  
legal@depth-agency.com:
  Name: Legal
  Description: الشؤون القانونية
  
marketing@depth-agency.com:
  Name: Marketing & Advertising
  Description: إدارة الحملات الإعلانية والتسويق الرقمي
  Status: جديد ✨
  
sales@depth-agency.com:
  Name: Sales
  Description: المبيعات والمتابعة
  
social@depth-agency.com:
  Name: Social Media Management
  Description: إدارة منصات التواصل الاجتماعي والمحتوى
  Status: جديد ✨
  
studio@depth-agency.com:
  Name: Studio
  Description: الإنتاج الداخلي
  
support@depth-agency.com:
  Name: Support
  Description: استفسارات عامة ودعم
```

---

## 📧 إعدادات البريد الإلكتروني

### **DNS Records:**
```dns
; MX Records
depth-agency.com. MX 1 smtp.google.com.
depth-agency.com. MX 5 smtp.google.com.
depth-agency.com. MX 5 smtp.google.com.
depth-agency.com. MX 10 smtp.google.com.
depth-agency.com. MX 10 smtp.google.com.

; SPF Record
depth-agency.com. TXT "v=spf1 include:_spf.google.com ~all"

; DKIM Record  
google._domainkey.depth-agency.com. TXT "v=DKIM1; k=rsa; p=..."

; DMARC Record
_dmarc.depth-agency.com. TXT "v=DMARC1; p=quarantine; rua=mailto:admin@depth-agency.com"
```

### **Email Routing (موقع الويب):**
```yaml
# src/app/api/contact/route.ts
pricing: sales@depth-agency.com
support: support@depth-agency.com  
social: social@depth-agency.com
jobs: jobs@depth-agency.com
general: hello@depth-agency.com
```

### **التواقيع:**
```yaml
Status: يحتاج إعداد ⚠️
Primary Signature: غير معد
Group Signatures: غير معدة
Logo: يحتاج إضافة شعار الوكالة
```

---

## ⚡ الأوامر الأساسية

### **فحص الحالة:**
```bash
# فحص OAuth
gam oauth info

# فحص Service Account  
gam user admin@depth-agency.com check serviceaccount

# فحص النطاق
gam info domain

# فحص المستخدمين
gam print users

# فحص المجموعات
gam print groups
```

### **إدارة المستخدمين:**
```bash
# إنشاء مستخدم جديد
gam create user newuser@depth-agency.com firstname "الاسم" lastname "العائلة" password "كلمة_السر"

# تعليق مستخدم
gam update user user@depth-agency.com suspended on

# إلغاء تعليق مستخدم  
gam update user user@depth-agency.com suspended off

# تغيير كلمة المرور
gam update user user@depth-agency.com password "كلمة_السر_الجديدة"

# إضافة صورة البروفايل
gam update user user@depth-agency.com photo ~/path/to/photo.jpg
```

### **إدارة المجموعات:**
```bash
# إنشاء مجموعة جديدة
gam create group newgroup@depth-agency.com name "اسم المجموعة" description "الوصف"

# إضافة عضو للمجموعة
gam update group group@depth-agency.com add member user@depth-agency.com

# إضافة مالك للمجموعة  
gam update group group@depth-agency.com add owner user@depth-agency.com

# تحديث إعدادات المجموعة
gam update group group@depth-agency.com allowExternalMembers true whoCanPostMessage ANYONE_CAN_POST
```

### **إدارة Gmail:**
```bash
# عرض التواقيع
gam user user@depth-agency.com show signature

# تحديث التوقيع
gam user user@depth-agency.com update signature file ~/signature.html

# عرض Send-As
gam user user@depth-agency.com show sendas

# إضافة Send-As
gam user user@depth-agency.com add sendas group@depth-agency.com "اسم العرض"

# عرض التوجيهات
gam user user@depth-agency.com show forward

# عرض المرشحات
gam user user@depth-agency.com show filters
```

### **Google Cloud:**
```bash
# فحص المشاريع
gcloud projects list

# تغيير المشروع النشط
gcloud config set project gam-project-1o6tc

# فحص Service Accounts
gcloud iam service-accounts list

# إنشاء مفتاح Service Account
gcloud iam service-accounts keys create ~/key.json --iam-account=SA_EMAIL

# فحص Organization Policies
gcloud resource-manager org-policies describe POLICY_NAME --organization=298301615311
```

---

## 🚨 استكشاف الأخطاء

### **مشاكل شائعة وحلولها:**

#### **1. Service Account OAuth2 File Not Found:**
```bash
# الخطأ
ERROR: Service Account OAuth2 File: oauth2service.json, Does not exist

# الحل
gam user admin@depth-agency.com update serviceaccount
# أو إنشاء مفتاح جديد
gcloud iam service-accounts keys create ~/.gam/oauth2service.json --iam-account=gam-depth-agency@gam-project-1o6tc.iam.gserviceaccount.com
```

#### **2. Domain-wide Delegation Failed:**
```bash
# الخطأ  
Domain-wide Delegation authentication FAIL

# الحل
# ادخل للرابط المُعطى من GAM وفوض الصلاحيات في Admin Console
# Admin Console → Security → API Controls → Domain-wide Delegation
```

#### **3. Organization Policy Blocks Service Account Key Creation:**
```bash
# الخطأ
Key creation is not allowed on this service account

# الحل
gcloud resource-manager org-policies delete iam.disableServiceAccountKeyCreation --organization=298301615311
gcloud resource-manager org-policies delete iam.disableServiceAccountKeyCreation --project=gam-project-1o6tc
```

#### **4. Insufficient Permissions:**
```bash
# الخطأ
403 Forbidden / Access Denied

# الحل  
# تأكد من أنك مسجل دخول بالحساب الصحيح
gcloud auth login admin@depth-agency.com
# تحقق من الصلاحيات
gam oauth info
```

### **ملفات التشخيص:**
```bash
# مجلد GAM
~/.gam/
├── oauth2.txt (OAuth للمستخدم)
├── oauth2service.json (Service Account)  
├── client_secrets.json (Client OAuth)
├── gam.cfg (إعدادات GAM)
└── gamcache/ (ذاكرة التخزين المؤقت)

# ملفات السجلات
~/gam-logs/
└── YYYYMMDD_HHMMSS_*.log
```

---

## 💾 نسخ احتياطية وأمان

### **النسخ الاحتياطية:**
```bash
# نسخ احتياطية لإعدادات GAM
cp -r ~/.gam ~/gam-backup/$(date +%Y%m%d_%H%M%S)/

# تصدير بيانات المستخدمين
gam print users > ~/backup/users_$(date +%Y%m%d).csv

# تصدير بيانات المجموعات  
gam print groups > ~/backup/groups_$(date +%Y%m%d).csv

# تصدير Org Units
gam print orgs > ~/backup/orgs_$(date +%Y%m%d).csv
```

### **مراقبة الأمان:**
```bash
# فحص عمليات تسجيل الدخول المشبوهة
gam report login

# فحص استخدام التطبيقات
gam report usage user admin@depth-agency.com

# فحص عمليات التدقيق  
gam report audit

# فحص الأجهزة المُسجلة
gam print mobile
```

---

## 🔄 مهام الصيانة الدورية

### **يومياً:**
- [ ] فحص رسائل البريد الواردة على المجموعات
- [ ] مراجعة سجلات تسجيل الدخول

### **أسبوعياً:**  
- [ ] فحص حالة Service Account: `gam user admin@depth-agency.com check serviceaccount`
- [ ] تحديث كلمات المرور إذا لزم الأمر
- [ ] مراجعة عضوية المجموعات

### **شهرياً:**
- [ ] نسخ احتياطية للإعدادات والبيانات
- [ ] مراجعة Organization Policies
- [ ] تدوير مفاتيح Service Account إذا لزم الأمر
- [ ] مراجعة تقارير الاستخدام

---

## 📞 جهات الاتصال والدعم

### **الدعم الفني:**
```yaml
Google Workspace Support: 
  - Admin Console → Support
  - حساب Business Standard يحصل على دعم عبر البريد والهاتف

GAM Community:
  - GitHub: https://github.com/GAM-team/GAM
  - Wiki: https://github.com/GAM-team/GAM/wiki
  - Google Group: google-apps-manager@googlegroups.com
```

### **معلومات الاتصال الطارئ:**
```yaml
Admin Primary: admin@depth-agency.com
Admin Secondary: alijawdat4@gmail.com  
Phone: +9647779761547
Organization Admin: ali alrubeay
```

---

## 📝 سجل التغييرات

### **2025-08-12:**
- ✅ إنشاء Service Account جديد: gam-depth-agency
- ✅ حل مشكلة Organization Policy
- ✅ تفعيل Domain-wide Delegation
- ✅ إضافة مجموعتين جديدتين: social@ و marketing@
- ✅ تحديث routing في موقع الويب

### **2025-08-10:**  
- ✅ إعداد GAM الأولي
- ✅ إنشاء مجموعات البريد الأساسية
- ✅ ضبط DNS records

### **2025-08-08:**
- ✅ إنشاء Google Workspace
- ✅ تأكيد النطاق depth-agency.com
- ✅ إعداد المستخدم الإداري الأول

---

## 🎯 المهام المستقبلية

### **قريباً:**
- [ ] إعداد التواقيع الإلكترونية لكل المجموعات
- [ ] تحديث صورة البروفايل لشعار الوكالة
- [ ] إعداد DKIM و DMARC بشكل كامل
- [ ] إنشاء Org Units للأقسام المختلفة

### **متوسط المدى:**
- [ ] إضافة مستخدمين جدد للفريق
- [ ] إعداد Google Drive مشترك للمشاريع  
- [ ] تفعيل Google Meet للاجتماعات
- [ ] إعداد Calendar مشترك

### **طويل المدى:**
- [ ] ترقية للخطة Enterprise إذا لزم الأمر
- [ ] إعداد SSO للتطبيقات الخارجية
- [ ] تفعيل Google Vault للأرشفة
- [ ] إعداد DLP (Data Loss Prevention)

---

**📅 آخر تحديث:** 12 أغسطس 2025 - 21:45 GMT+3  
**👤 المحدث:** AI Assistant  
**📍 الحالة:** نشط وجاهز للاستخدام ✅

---

## 📞 **معلومات التواصل**

للحصول على المساعدة في إدارة Google Workspace:

📧 **البريد الإلكتروني:** admin@depth-agency.com  
📱 **WhatsApp:** +964 777 976 1547  
🌐 **الموقع:** https://depth-agency.com  
📍 **الموقع:** بغداد، العراق

---

> **ملاحظة مهمة:** هذا الملف يحتوي على معلومات حساسة. احتفظ به في مكان آمن ولا تشاركه مع أشخاص غير مخولين.
