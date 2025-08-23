# 📋 قاموس البيانات النهائي والشامل
## منصة Depth V2.0
### Firebase + Cloudflare - النسخة المنظمة والنظيفة

---

> 🏷️ **مصدر الحقيقة الواحد (SSOT)** 
> 
> هذه هي النسخة المرجعية الوحيدة لقاموس البيانات في منصة Depth V2.0. يُمنع التعديل بدون موافقة فريق Architecture.
> 
> **تم إعادة تنظيمه وتنظيفه:** 2025-08-23  
> **آخر مراجعة:** 2025-08-23

---

## 📖 فهرس المحتويات

1. [المقدمة](#1-المقدمة)
2. [الكيانات الأساسية](#2-الكيانات-الأساسية)
3. [كيانات إدارة المشاريع](#3-كيانات-إدارة-المشاريع)
4. [كيانات المعدات والموارد](#4-كيانات-المعدات-والموارد)
5. [كيانات التسعير والمعاملات](#5-كيانات-التسعير-والمعاملات)
6. [كيانات النظام والإدارة](#6-كيانات-النظام-والإدارة)
7. [الكيانات المرجعية والمساعدة](#7-الكيانات-المرجعية-والمساعدة)

---

## 1. المقدمة

توثيق شامل ومنظم لجميع الكيانات (Entities)، الحقول، العلاقات، والجداول الترقيمية (Enumerations) المعتمدة في منصة Depth V2.0.

### 🎯 الهدف من هذه الوثيقة:
- توفير مرجع واحد موحد لجميع جداول قاعدة البيانات
- ضمان التناسق في التصميم والتطوير
- تسهيل عملية المراجعة والصيانة
- دعم فرق التطوير في فهم البنية التحتية

### 📋 اصطلاحات التوثيق:
- **مطلوب**: حقول إجبارية لا يمكن أن تكون فارغة
- **FK →**: مفتاح خارجي يشير إلى جدول آخر
- **فريد**: قيمة يجب أن تكون فريدة في الجدول
- **enum**: قيم محددة مسبقاً

---

## 2. الكيانات الأساسية

### 2.1 المستخدم (User)
> الجدول الأساسي لجميع مستخدمي النظام

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| uid           | string (uid) | نعم   | معرف Firebase فريد         | abc123def456   | فريد، PK     |
| phone         | string       | نعم   | رقم الهاتف العراقي         | 07719956000    | فريد، صيغة عراقية |
| email         | string       | لا    | البريد الإلكتروني          | user@example.com | فريد إذا وُجد |
| role          | enum         | نعم   | دور المستخدم               | creator        | creator/client/salariedEmployee/admin/super_admin |
| isActive      | boolean      | نعم   | حالة تفعيل الحساب          | true           |              |
| isVerified    | boolean      | نعم   | التحقق من الهاتف           | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 2.2 الأدمن (Admin)
> الأدمنز وصلاحياتهم في النظام

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الأدمن                | ad_123abc      | فريد، PK     |
| userId        | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User, فريد |
| adminLevel    | enum         | نعم   | مستوى الأدمن               | super_admin    | super_admin/admin |
| fullName      | string       | نعم   | الاسم الكامل               | علي الربيعي    |              |
| phone         | string       | نعم   | رقم الهاتف                 | 07719956000    |              |
| addedBy       | string       | لا    | معرف من أضافه              | sa_123abc      | FK → Admin (null للمزروع) |
| addedAt       | timestamp    | نعم   | تاريخ الإضافة              | 2025-08-20     |              |
| permissions   | object       | نعم   | الصلاحيات المفصلة          | {...}          | JSON object  |
| googleAuth    | object       | نعم   | معلومات Google OAuth      | {...}          | {googleId, email, verified, verifiedAt} |
| isSeeded      | boolean      | نعم   | أدمن مزروع افتراضياً       | true           | true للأدمن الأول |
| isActive      | boolean      | نعم   | الحساب نشط                | true           |              |
| lastLoginAt   | timestamp    | لا    | آخر دخول                   | 2025-08-21     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 2.3 جلسات المستخدمين (Sessions)
> إدارة جلسات المستخدمين النشطة والأمان

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الجلسة                | session_123abc | فريد         |
| userId        | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User    |
| token         | string       | نعم   | توكن الجلسة (مشفر)         | encrypted_token| فريد         |
| platform      | enum         | نعم   | المنصة                     | android        | android/ios/web |
| deviceId      | string       | لا    | معرف الجهاز                | device_abc     |              |
| deviceInfo    | object       | لا    | معلومات الجهاز             | {...}          | model, os, etc|
| ipAddress     | string       | نعم   | عنوان IP                   | 192.168.1.1    |              |
| userAgent     | string       | لا    | User Agent للجهاز         | Mozilla/...    |              |
| isActive      | boolean      | نعم   | الجلسة نشطة                | true           |              |
| lastActivity  | timestamp    | نعم   | آخر نشاط                   | 2025-08-21     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| expiresAt     | timestamp    | نعم   | تاريخ انتهاء الصلاحية      | 2025-09-21     | +30 يوم      |

### 2.4 المبدع (Creator)
> ملف تعريفي موسع للمبدعين مع إعدادات التسعير والتوفر

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المبدع                | c_123abc       | فريد، PK     |
| userId        | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User, فريد |
| fullName      | string       | نعم   | الاسم الكامل               | أحمد علي محمد  |              |
| displayName   | string       | نعم   | اسم العرض                  | أحمد المصور    | فريد         |
| bio           | string       | لا    | النبذة التعريفية           | مصور محترف    | ≤500 حرف     |
| profileImage  | string       | لا    | رابط صورة الملف الشخصي     | https://...    |              |
| portfolioImages| array       | لا    | مجموعة صور الأعمال         | [url1, url2]   | ≤10 صور      |
| location      | object       | نعم   | الموقع الجغرافي            | {city, area}   |              |
| specialties   | array<string>| نعم   | التخصصات                   | [photo, video] | من قائمة محددة |
| experienceLevel| enum        | نعم   | مستوى الخبرة               | experienced    | fresh/experienced/expert |
| yearsOfExperience| int       | نعم   | سنوات الخبرة              | 5              | ≥0           |
| equipmentTier | enum         | نعم   | مستوى المعدات              | gold           | silver/gold/platinum |
| isAvailable   | boolean      | نعم   | متاح لمشاريع جديدة         | true           |              |
| isVerified    | boolean      | نعم   | تم التحقق من المبدع        | true           |              |
| verifiedAt    | timestamp    | لا    | تاريخ التحقق               | 2025-08-20     |              |
| verifiedBy    | string       | لا    | من قام بالتحقق             | admin@depth-agency.com |              |
| rating        | float        | نعم   | التقييم العام              | 4.8            | 0.0-5.0      |
| totalReviews  | int          | نعم   | عدد التقييمات الكلي        | 127            | ≥0           |
| completedProjects| int       | نعم   | المشاريع المكتملة          | 89             | ≥0           |
| responseTimeHours| int       | نعم   | متوسط زمن الاستجابة        | 2              | بالساعات     |
| bankDetails   | object       | لا    | تفاصيل الحساب البنكي       | {...}          | مشفر         |
| taxId         | string       | لا    | الرقم الضريبي              | TAX123456      |              |
| isActive      | boolean      | نعم   | الحساب نشط                | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 2.5 العميل (Client)
> ملف تعريفي للعملاء مع معلومات الفوترة والمشاريع

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف العميل                | cl_123abc      | فريد، PK     |
| userId        | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User, فريد |
| fullName      | string       | نعم   | الاسم الكامل               | فاطمة أحمد     |              |
| companyName   | string       | لا    | اسم الشركة                 | شركة النور     |              |
| businessType  | enum         | نعم   | نوع النشاط                 | individual     | individual/company/agency |
| industry      | string       | لا    | المجال الصناعي             | تجارة          |              |
| location      | object       | نعم   | الموقع الجغرافي            | {city, area}   |              |
| billingAddress| object       | لا    | عنوان الفوترة              | {...}          |              |
| taxId         | string       | لا    | الرقم الضريبي              | TAX789012      |              |
| preferredLanguage| enum      | نعم   | اللغة المفضلة              | ar             | ar/en        |
| totalSpent    | int          | نعم   | إجمالي المبلغ المدفوع       | 2500000        | بالدينار     |
| totalProjects | int          | نعم   | عدد المشاريع الكلي          | 15             | ≥0           |
| rating        | float        | نعم   | التقييم كعميل              | 4.9            | 0.0-5.0      |
| paymentTerms  | enum         | نعم   | شروط الدفع                 | advance_50     | advance_50/advance_100/net_30 |
| isActive      | boolean      | نعم   | الحساب نشط                | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

---

## 3. كيانات إدارة المشاريع

### 3.1 المشروع (Project)
> الكيان المركزي للمشاريع مع نظام التسعير المتقدم والمعاملات

> ⚠️ **ملاحظة مهمة:** الأسعار (creatorPrice) لا تظهر للمبدع إلا بعد موافقة الأدمن على المشروع.

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id                | string (uid) | نعم   | معرف المشروع               | p_123abc       | فريد         |
| clientId          | string       | نعم   | معرف العميل                | cl_123abc      | FK → Client  |
| creatorId         | string       | نعم   | معرف المبدع                | c_123abc       | FK → Creator |
| categoryId        | string       | نعم   | معرف الفئة الرئيسية        | cat_photo      | FK → Category |
| subcategoryId     | string       | نعم   | معرف الفئة الفرعية         | sub_flatlay    | FK → Subcategory |
| status            | enum         | نعم   | حالة المشروع               | draft          | draft/pending/active/completed/cancelled |
| basePrice         | int          | نعم   | السعر الأساسي للفئة الفرعية| 10000          | من جدول Subcategories |
| experienceMod     | float        | نعم   | معامل الخبرة (من المبدع)   | 1.1            | من ExperienceModifiers |
| equipmentMod      | float        | نعم   | معامل المعدات (من المبدع)  | 1.1            | من EquipmentModifiers |
| ownershipFactor   | float        | نعم   | معامل ملكية المعدات        | 1.0            | 0.9 أو 1.0   |
| processingMod     | float        | نعم   | معامل المعالجة             | 1.3            | من ProcessingModifiers |
| rushMod           | float        | نعم   | معامل الاستعجال            | 1.0            | من RushModifiers |
| locationAddition  | int          | نعم   | إضافة الموقع الثابتة       | 0              | من LocationAdditions |
| creatorPrice      | int          | نعم   | سعر المبدع النهائي         | 15730          | محسوب تلقائياً |
| agencyMargin      | int          | لا    | هامش الوكالة (مبلغ ثابت)   | 4719           | اختياري      |
| agencyMarginPercent| float       | لا    | هامش الوكالة (نسبة مئوية)  | 0.30           | النطاق الرسمي 10% إلى 50% |
| clientPrice       | int          | نعم   | السعر النهائي للعميل       | 20449          | محسوب تلقائياً |
| isRush            | boolean      | نعم   | مشروع مستعجل               | false          |              |
| location          | enum         | نعم   | موقع التنفيذ               | studio         | studio/client/outskirts/nearby/far |
| deliveryDate      | date         | لا    | تاريخ التسليم المتوقع      | 2025-09-01     |              |
| notes             | string       | لا    | ملاحظات إضافية             | مشروع مهم      |              |
| approvedBy        | string       | لا    | معرف الأدمن الذي وافق      | admin@depth-agency.com |            |
| approvedAt        | timestamp    | لا    | تاريخ الموافقة             | 2025-08-20     |              |
| createdBy         | string       | نعم   | معرف من أنشأ السجل         | admin@depth-agency.com |            |
| createdAt         | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt         | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

#### 🧮 معادلات التسعير - مرجع (Reference)

> � **مرجع معادلات التسعير النهائية:**  
> راجع الملف الرسمي: [`documentation/01-requirements/00-requirements-v2.0.md`](../01-requirements/00-requirements-v2.0.md#معادلات-التسعير-النهائية-المحسومة)
> 
> جميع المعادلات والمعاملات والأمثلة موثقة بالتفصيل في ملف المتطلبات الأساسي.

### 3.2 طلبات المشاريع (ProjectRequests)
> طلبات المشاريع الأولية من العملاء قبل تحويلها لمشاريع فعلية

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الطلب                 | req_123abc     | فريد         |
| requestNumber | string       | نعم   | رقم الطلب                  | REQ-2025-001   | فريد         |
| clientId      | string       | نعم   | معرف العميل                | cl_123abc      | FK → Client  |
| categoryId    | string       | نعم   | معرف الفئة الرئيسية        | cat_photo      | FK → Category |
| subcategoryId | string       | نعم   | معرف الفئة الفرعية         | sub_flatlay    | FK → Subcategory |
| description   | string       | نعم   | وصف المشروع               | تصوير منتجات  | ≤1000 حرف    |
| preferredLocation| enum      | نعم   | الموقع المفضل              | studio         | studio/client/outskirts/nearby/far |
| budget        | object       | لا    | الميزانية المتوقعة         | {min, max}     |              |
| deadline      | date         | لا    | الموعد النهائي المطلوب     | 2025-09-15     |              |
| attachments   | array        | لا    | ملفات مرفقة                | [url1, url2]   |              |
| priority      | enum         | نعم   | أولوية الطلب               | normal         | low/normal/high/urgent |
| status        | enum         | نعم   | حالة الطلب                 | pending        | pending/reviewing/approved/rejected |
| estimatedPrice| int          | لا    | السعر المقدر               | 25000          | بالدينار     |
| assignedTo    | string       | لا    | الأدمن المكلف بالمراجعة    | admin@depth-agency.com |            |
| reviewNotes   | string       | لا    | ملاحظات المراجعة           | يحتاج توضيح   |              |
| reviewedAt    | timestamp    | لا    | تاريخ المراجعة             | 2025-08-20     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

---

## 4. كيانات المعدات والموارد

### 4.1 المعدات (Equipment)
> معدات المبدعين المسجلة في النظام (كاميرات، عدسات، إضاءة، إلخ)

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المعدة                | eq_123abc      | فريد         |
| ownerId       | string       | نعم   | معرف المبدع                | c_123abc       | FK → Creator |
| type          | enum         | نعم   | نوع المعدة                 | camera         | camera/lens/lighting/microphone/tripod/other |
| brand         | string       | نعم   | الماركة                    | Canon          |              |
| model         | string       | نعم   | الموديل                    | R6             |              |
| status        | enum         | نعم   | حالة المعدة                | excellent      | excellent/good/needs_approval |
| purchaseDate  | date         | لا    | تاريخ الشراء                | 2023-01-15     |              |
| isApproved    | boolean      | نعم   | حالة الموافقة              | true           |              |
| approvedBy    | string       | لا    | معرف الأدمن الذي وافق      | admin@depth-agency.com |            |
| approvedAt    | timestamp    | لا    | تاريخ الموافقة             | 2025-08-20     |              |
| createdBy     | string       | نعم   | معرف من أنشأ السجل         | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 4.2 طلبات المعدات الجديدة (EquipmentRequests)
> طلبات إضافة معدات جديدة للنظام من المبدعين

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الطلب                 | eqr_123abc     | فريد         |
| creatorId     | string       | نعم   | معرف المبدع الطالب         | c_123abc       | FK → Creator |
| equipmentType | enum         | نعم   | نوع المعدة                 | camera         | camera/lens/lighting/microphone/tripod/other |
| brand         | string       | نعم   | الماركة المقترحة           | Canon          |              |
| model         | string       | نعم   | الموديل المقترح            | R6 Mark II     |              |
| description   | string       | لا    | وصف المعدة                | كاميرا احترافية جديدة |      |
| status        | enum         | نعم   | حالة الطلب                 | pending        | pending/approved/rejected/needs_info |
| adminNotes    | string       | لا    | ملاحظات الأدمن             | معدة ممتازة    |              |
| rejectionReason| string      | لا    | سبب الرفض إن وجد           | معدة غير متوفرة |              |
| reviewedBy    | string       | لا    | معرف الأدمن المراجع        | admin@depth-agency.com |            |
| reviewedAt    | timestamp    | لا    | تاريخ المراجعة             | 2025-08-20     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 4.3 مستويات المعدات (EquipmentTier)
> تصنيف مستويات المعدات وتأثيرها على التسعير

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المستوى               | tier_gold      | فريد         |
| name          | string       | نعم   | اسم المستوى                | Gold           | فريد         |
| nameAr        | string       | نعم   | الاسم بالعربية             | ذهبي          |              |
| modifier      | float        | نعم   | معامل التأثير على السعر     | 1.2            | >0           |
| description   | string       | لا    | وصف المستوى                | معدات متقدمة   |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف الأدمن الذي أنشأ      | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

---

## 5. كيانات التسعير والمعاملات

### 5.1 الفئات الرئيسية (Categories)
> جدول البذور للفئات الرئيسية - يُزرع من الأدمن فقط

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الفئة                 | cat_photo      | فريد         |
| nameAr        | string       | نعم   | الاسم بالعربية             | تصوير          | فريد         |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Photography    | فريد         |
| code          | string       | نعم   | الرمز المختصر              | photo          | فريد         |
| displayOrder  | int          | نعم   | ترتيب العرض                | 1              |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف الأدمن الذي أنشأ      | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

#### 🎯 الفئات الأربع المعتمدة:
1. **صورة (Photo)** - code: `photo`
2. **فيديو (Video)** - code: `video` 
3. **تصميم (Design)** - code: `design`
4. **مونتاج (Editing)** - code: `editing`

### 5.2 الفئات الفرعية (Subcategories)
> جدول الفئات الفرعية مع الأسعار الأساسية لكل فئة

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الفئة الفرعية         | sub_flatlay    | فريد         |
| categoryId    | string       | نعم   | معرف الفئة الرئيسية        | cat_photo      | FK → Categories |
| nameAr        | string       | نعم   | الاسم بالعربية             | فلات لاي       | فريد         |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Flat Lay       | فريد         |
| code          | string       | نعم   | الرمز المختصر              | flatlay        | فريد         |
| basePrice     | int          | نعم   | السعر الأساسي بالدينار     | 10000          | >0           |
| description   | string       | لا    | وصف الفئة الفرعية         | تصوير منتجات مسطح |              |
| displayOrder  | int          | نعم   | ترتيب العرض                | 1              |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف الأدمن الذي أنشأ      | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

#### 📋 الفئات الفرعية المعتمدة:

**صورة (Photo):**
- فلات لاي (Flat Lay) - 10,000 IQD - `sub_flatlay`
- قبل/بعد (Before/After) - 15,000 IQD - `sub_before_after`
- بورتريه (Portrait) - 12,000 IQD - `sub_portrait`
- على موديل (On Model) - 20,000 IQD - `sub_on_model`
- على مانيكان (On Mannequin) - 15,000 IQD - `sub_on_mannequin`
- صورة طعام (Food Photography) - 10,000 IQD - `sub_food_photo`
- تصوير منتجات (Product Photography) - 8,000 IQD - `sub_product_photo`
- 360 درجة (360° Photography) - 25,000 IQD - `sub_360_photo`
- تصوير داخلي (Interior) - 30,000 IQD - `sub_interior`
- تصوير فعاليات (Event Photography) - 50,000 IQD/ساعة - `sub_event_photo`

**فيديو (Video):**
- ريلز 30 ثانية (Reels 30s) - 35,000 IQD - `sub_reels_30s`
- فيديو دقيقة (1 Min Video) - 75,000 IQD - `sub_video_1min`
- فيديو 3 دقائق (3 Min Video) - 150,000 IQD - `sub_video_3min`
- فيديو تعريفي (Corporate Video) - 250,000 IQD - `sub_corporate_video`
- تغطية فعالية (Event Coverage) - 100,000 IQD/ساعة - `sub_event_coverage`

**تصميم (Design):**
- شعار (Logo Design) - 50,000 IQD - `sub_logo_design`
- هوية بصرية (Brand Identity) - 200,000 IQD - `sub_brand_identity`
- منشورات سوشيال (Social Media Posts) - 5,000 IQD/منشور - `sub_social_posts`
- بروشور (Brochure) - 30,000 IQD - `sub_brochure`
- منيو (Menu Design) - 40,000 IQD - `sub_menu_design`
- بوستر (Poster) - 20,000 IQD - `sub_poster`
- بزنس كارد (Business Card) - 15,000 IQD - `sub_business_card`
- تصميم تغليف (Packaging) - 60,000 IQD - `sub_packaging`

**مونتاج (Editing):**
- مونتاج أساسي (Basic Edit) - 20,000 IQD - `sub_basic_edit`
- مونتاج متقدم (Advanced Edit) - 40,000 IQD - `sub_advanced_edit`
- تصحيح ألوان (Color Grading) - 15,000 IQD - `sub_color_grading`
- إضافة مؤثرات (Effects) - 25,000 IQD - `sub_effects`
- موشن جرافيك (Motion Graphics) - 50,000 IQD - `sub_motion_graphics`

### 5.3 ربط المبدع بالفئات الفرعية (CreatorSubcategories)
> جدول علاقة many-to-many بين المبدعين والفئات الفرعية مع مستوى المعالجة

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الربط                 | cs_123abc      | فريد         |
| creatorId     | string       | نعم   | معرف المبدع                | c_123abc       | FK → Creator |
| subcategoryId | string       | نعم   | معرف الفئة الفرعية         | sub_flatlay    | FK → Subcategories |
| processingLevel| enum        | نعم   | مستوى المعالجة المفضل     | full_retouch   | raw/basic/color_correction/full_retouch/advanced_composite |
| isPreferred   | boolean      | نعم   | فئة مفضلة للمبدع           | true           |              |
| isActive      | boolean      | نعم   | الربط نشط                  | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

> **ملاحظة:** كل مبدع يمكنه اختيار حتى فئتين رئيسيتين، وتحت كل فئة رئيسية يختار الفئات الفرعية المناسبة مع تحديد مستوى المعالجة المفضل له.

### 5.4 أسعار المبدع للفئات الفرعية (CreatorSubcategoryPricing)
> جدول محسوب لحفظ أسعار المبدع الأساسية لكل فئة فرعية

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف السجل                 | csp_123abc     | فريد         |
| creatorId     | string       | نعم   | معرف المبدع                | c_123abc       | FK → Creator |
| subcategoryId | string       | نعم   | معرف الفئة الفرعية         | sub_flatlay    | FK → Subcategory |
| basePrice     | int          | نعم   | السعر الأساسي              | 10000          | من Subcategories |
| processingLevel| enum        | نعم   | مستوى المعالجة المختار     | full_retouch   | raw/basic/color_correction/full_retouch/advanced_composite |
| processingMod | float        | نعم   | معامل المعالجة             | 1.3            | من جدول ProcessingModifiers |
| baseCreatorPrice| int        | نعم   | السعر المحسوب الأساسي      | 15730          | محسوب تلقائياً |
| lastCalculated| timestamp    | نعم   | آخر إعادة حساب              | 2025-08-21     |              |
| isActive      | boolean      | نعم   | السجل نشط                  | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 5.5 معاملات المعالجة (ProcessingModifiers)
> جدول المعاملات لمستويات المعالجة

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المعامل               | pm_raw         | فريد         |
| level         | string       | نعم   | مستوى المعالجة             | raw            | raw/basic/color_correction/full_retouch/advanced_composite |
| nameAr        | string       | نعم   | الاسم بالعربية             | خام           |              |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Raw            |              |
| modifier      | float        | نعم   | المعامل                    | 0.9            | >0           |
| description   | string       | لا    | وصف المستوى               | ملفات خام       |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف من أنشأ               | admin@depth-agency.com |            |
| updatedBy     | string       | لا    | معرف من حدث               | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 5.6 معاملات الخبرة (ExperienceModifiers)
> جدول المعاملات لمستويات الخبرة

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المعامل               | em_fresh       | فريد         |
| level         | string       | نعم   | مستوى الخبرة               | fresh          | fresh/experienced/expert |
| nameAr        | string       | نعم   | الاسم بالعربية             | مبتدئ          |              |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Fresh          |              |
| modifier      | float        | نعم   | المعامل                    | 1.0            | >0           |
| minYears      | int          | نعم   | الحد الأدنى للسنوات        | 0              | >=0          |
| maxYears      | int          | لا    | الحد الأقصى للسنوات        | 1              | null للمفتوح |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف من أنشأ               | admin@depth-agency.com |            |
| updatedBy     | string       | لا    | معرف من حدث               | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 5.7 معاملات المعدات (EquipmentModifiers)
> جدول المعاملات لمستويات المعدات

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المعامل               | eqm_gold       | فريد         |
| tier          | string       | نعم   | مستوى المعدات              | gold           | silver/gold/platinum |
| nameAr        | string       | نعم   | الاسم بالعربية             | ذهبي          |              |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Gold           |              |
| modifier      | float        | نعم   | المعامل                    | 1.1            | >0           |
| description   | string       | لا    | وصف المستوى               | معدات متوسطة   |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف من أنشأ               | admin@depth-agency.com |            |
| updatedBy     | string       | لا    | معرف من حدث               | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 5.8 معاملات الاستعجال (RushModifiers)
> جدول المعاملات للمشاريع المستعجلة

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المعامل               | rm_rush        | فريد         |
| type          | string       | نعم   | نوع الاستعجال              | rush           | normal/rush  |
| nameAr        | string       | نعم   | الاسم بالعربية             | مستعجل        |              |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Rush           |              |
| modifier      | float        | نعم   | المعامل                    | 1.2            | >0           |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف من أنشأ               | admin@depth-agency.com |            |
| updatedBy     | string       | لا    | معرف من حدث               | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 5.9 إضافات الموقع (LocationAdditions)
> جدول الإضافات الثابتة للمواقع - يستخدم نظام الإضافة (+) بدلاً من الضرب (×)

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المعامل               | lm_studio      | فريد         |
| location      | string       | نعم   | نوع الموقع                 | studio         | studio/client/outskirts/nearby/far |
| nameAr        | string       | نعم   | الاسم بالعربية             | استوديو الوكالة|              |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Studio         |              |
| modifier      | float        | نعم   | المعامل (دائماً 1.0)       | 1.0            | = 1.0        |
| addition      | int          | نعم   | الإضافة الثابتة بالدينار   | 0              | >=0          |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف من أنشأ               | admin@depth-agency.com |            |
| updatedBy     | string       | لا    | معرف من حدث               | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

#### 💰 القيم المعتمدة للإضافات:
- **استوديو الوكالة**: 0 IQD
- **موقع العميل في بغداد**: 0 IQD  
- **أطراف بغداد**: 25,000 IQD
- **محافظات قريبة**: 50,000 IQD
- **محافظات بعيدة**: 100,000 IQD

---

## 6. كيانات النظام والإدارة

### 6.1 التوفر الشبكي للمبدعين (CreatorAvailability)
> جدول التوفر الشبكي كل 30 دقيقة للمبدعين مع إدارة الحجوزات

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الفترة                | avail_123abc   | فريد         |
| creatorId     | string       | نعم   | معرف المبدع                | c_123abc       | FK → Creator |
| date          | date         | نعم   | التاريخ                    | 2025-08-21     |              |
| timeSlot      | time         | نعم   | بداية الفترة الزمنية        | 09:00          | كل 30 دقيقة   |
| status        | enum         | نعم   | حالة التوفر                | available      | available/busy/blocked/break |
| projectId     | string       | لا    | معرف المشروع المحجوز       | p_123abc       | FK → Project |
| blockReason   | string       | لا    | سبب الحجب                  | إجازة طارئة    |              |
| notes         | string       | لا    | ملاحظات الفترة            | استراحة       |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 6.2 الإشعارات (Notifications)
> نظام إشعارات شامل متعدد القنوات

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الإشعار               | notif_123abc   | فريد         |
| recipientId   | string       | نعم   | معرف المستلم               | u_123abc       | FK → User    |
| type          | enum         | نعم   | نوع الإشعار                | creator_approved | creator_approved/new_project/project_completed/payment_received |
| priority      | enum         | نعم   | أولوية الإشعار             | critical       | critical/high/normal/low |
| channels      | array<string>| نعم   | قنوات الإرسال المطلوبة     | [push,email]   | push/email/sms/inApp |
| title         | string       | نعم   | عنوان الإشعار              | تمت الموافقة   |              |
| message       | string       | نعم   | نص الإشعار                 | تم قبول طلبك   |              |
| titleEn       | string       | لا    | العنوان بالإنجليزية        | Approved       |              |
| messageEn     | string       | لا    | النص بالإنجليزية           | Request approved|              |
| actionType    | enum         | لا    | نوع الإجراء                | navigate       | navigate/external/none |
| actionPath    | string       | لا    | مسار الإجراء               | /dashboard     |              |
| isRead        | boolean      | نعم   | حالة القراءة               | false          |              |
| isSent        | boolean      | نعم   | حالة الإرسال               | true           |              |
| sentChannels  | array<string>| لا    | القنوات المُرسلة فعلياً    | [push,email]   |              |
| failedChannels| array<string>| لا    | القنوات الفاشلة            | [sms]          |              |
| relatedEntityId| string      | لا    | معرف الكيان المرتبط        | p_123abc       |              |
| relatedEntityType| enum      | لا    | نوع الكيان المرتبط         | project        | project/client/creator |
| sentAt        | timestamp    | لا    | تاريخ الإرسال الفعلي       | 2025-08-21     |              |
| readAt        | timestamp    | لا    | تاريخ القراءة              | 2025-08-21     |              |
| expiresAt     | timestamp    | لا    | تاريخ انتهاء الصلاحية      | 2025-09-21     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 6.3 إعدادات الإشعارات (NotificationSettings)
> إعدادات تفضيلات الإشعارات الشخصية لكل مستخدم

| الحقل           | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|-----------------|--------------|-------|----------------------------|----------------|--------------|
| id              | string (uid) | نعم   | معرف الإعدادات             | ns_123abc      | فريد         |
| userId          | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User    |
| pushEnabled     | boolean      | نعم   | تفعيل إشعارات الدفع        | true           |              |
| emailEnabled    | boolean      | نعم   | تفعيل إشعارات الإيميل      | true           |              |
| smsEnabled      | boolean      | نعم   | تفعيل إشعارات الرسائل      | false          |              |
| inAppEnabled    | boolean      | نعم   | تفعيل الإشعارات الداخلية   | true           |              |
| whatsappEnabled | boolean      | نعم   | تفعيل إشعارات واتساب       | false          |              |
| quietHoursStart | time         | لا    | بداية ساعات الهدوء         | 22:00          |              |
| quietHoursEnd   | time         | لا    | نهاية ساعات الهدوء         | 08:00          |              |
| language        | enum         | نعم   | لغة الإشعارات              | ar             | ar/en        |
| criticalOnly    | boolean      | نعم   | الإشعارات الهامة فقط       | false          |              |
| categories      | object       | نعم   | تفضيلات الفئات             | {...}          | تفصيل كل نوع  |
| createdAt       | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt       | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 6.4 التقييمات (Reviews)
> نظام تقييمات متبادل بين العملاء والمبدعين

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف التقييم               | rev_123abc     | فريد         |
| projectId     | string       | نعم   | معرف المشروع               | p_123abc       | FK → Project |
| reviewerId    | string       | نعم   | معرف المُقيم (العميل/المبدع)| cl_123abc      |              |
| revieweeId    | string       | نعم   | معرف المُقيَم (المبدع/العميل)| c_123abc       |              |
| rating        | int          | نعم   | التقييم                    | 5              | 1-5          |
| comment       | string       | لا    | تعليق التقييم              | عمل ممتاز      |              |
| isPublic      | boolean      | نعم   | ظاهر للعامة                | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 6.5 أكواد التحقق (OTPCodes)
> نظام إدارة أكواد التحقق للهواتف

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الكود                 | otp_123abc     | فريد         |
| phoneNumber   | string       | نعم   | رقم الهاتف                 | 07719956000    | صيغة عراقية   |
| code          | string       | نعم   | كود التحقق (مشفر)          | encrypted_code |              |
| purpose       | enum         | نعم   | غرض الكود                  | registration   | registration/password_reset/phone_change |
| isUsed        | boolean      | نعم   | تم استخدام الكود            | false          |              |
| attemptCount  | int          | نعم   | عدد المحاولات              | 0              | ≤3           |
| expiresAt     | timestamp    | نعم   | تاريخ انتهاء الصلاحية      | 2025-08-20     | +5 دقائق     |
| usedAt        | timestamp    | لا    | تاريخ الاستخدام             | 2025-08-20     |              |
| lastAttemptAt | timestamp    | لا    | تاريخ آخر محاولة           | 2025-08-21     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 6.6 سجلات التدقيق (AuditLogs)
> سجل شامل لجميع الإجراءات المهمة في النظام

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف السجل                 | audit_123abc   | فريد         |
| userId        | string       | لا    | معرف المستخدم المنفذ       | u_123abc       | FK → User    |
| action        | enum         | نعم   | نوع الإجراء                | user_created   | user_created/project_approved/price_updated |
| entityType    | string       | نعم   | نوع الكيان المتأثر          | Project        |              |
| entityId      | string       | لا    | معرف الكيان المتأثر        | p_123abc       |              |
| oldValues     | object       | لا    | القيم القديمة              | {...}          | JSON         |
| newValues     | object       | لا    | القيم الجديدة              | {...}          | JSON         |
| ipAddress     | string       | لا    | عنوان IP                   | 192.168.1.1    |              |
| userAgent     | string       | لا    | User Agent                  | Mozilla/...    |              |
| sessionId     | string       | لا    | معرف الجلسة                | session_abc    |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |

---

## 7. الكيانات المرجعية والمساعدة

### 7.1 الموظف براتب ثابت (SalariedEmployee)
> كيان منفصل للموظفين براتب ثابت مع نموذج مبسط

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الموظف                | emp_123abc     | فريد         |
| userId        | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User, فريد |
| employeeCode  | string       | نعم   | رقم الموظف                 | EMP001         | فريد         |
| fullName      | string       | نعم   | الاسم الكامل               | سارة أحمد      |              |
| department    | enum         | نعم   | القسم                      | admin          | admin/hr/finance/marketing |
| position      | string       | نعم   | المنصب                     | مدير إداري     |              |
| monthlySalary | int          | نعم   | الراتب الشهري              | 800000         | بالدينار     |
| hireDate      | date         | نعم   | تاريخ التوظيف              | 2024-01-15     |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 7.2 المجالات الصناعية (Industry)
> المجالات الصناعية المختلفة للعملاء

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف المجال                | ind_fashion    | فريد         |
| nameAr        | string       | نعم   | الاسم بالعربية             | أزياء          | فريد         |
| nameEn        | string       | نعم   | الاسم بالإنجليزية          | Fashion        | فريد         |
| description   | string       | لا    | وصف المجال                 | ملابس وأزياء   |              |
| isActive      | boolean      | نعم   | حالة التفعيل               | true           |              |
| createdBy     | string       | نعم   | معرف الأدمن الذي أنشأ      | admin@depth-agency.com |            |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 7.3 ربط الفئات الفرعية بالمجالات (SubcategoryIndustryLink)
> ربط الفئات الفرعية بالمجالات الصناعية المناسبة

| الحقل           | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|-----------------|--------------|-------|----------------------------|----------------|--------------|
| id              | string (uid) | نعم   | معرف الربط                 | link_123abc    | فريد         |
| subcategoryId   | string       | نعم   | معرف الفئة الفرعية         | sub_abc        | FK → Subcategory |
| industryId      | string       | نعم   | معرف المجال                | ind_abc        | FK → Industry |
| createdBy       | string       | نعم   | معرف الأدمن الذي أنشأ      | admin@depth-agency.com |            |
| createdAt       | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |

### 7.4 الملفات المرفوعة (FileUploads)
> نظام إدارة الملفات والوسائط

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف الملف                 | file_123abc    | فريد         |
| uploaderId    | string       | نعم   | معرف المستخدم الرافع       | u_123abc       | FK → User    |
| fileName      | string       | نعم   | اسم الملف الأصلي           | image.jpg      |              |
| fileSize      | int          | نعم   | حجم الملف بالبايت           | 1048576        | بالبايت      |
| mimeType      | string       | نعم   | نوع الملف                  | image/jpeg     |              |
| fileExtension | string       | نعم   | امتداد الملف               | jpg            |              |
| storageUrl    | string       | نعم   | رابط التخزين               | https://...    | مشفر         |
| purpose       | enum         | نعم   | غرض الملف                  | profile_image  | profile_image/portfolio/project_attachment/document |
| relatedEntityType| enum      | لا    | نوع الكيان المرتبط         | Creator        | Creator/Client/Project |
| relatedEntityId| string      | لا    | معرف الكيان المرتبط        | c_123abc       |              |
| isProcessed   | boolean      | نعم   | حالة المعالجة              | true           |              |
| processedUrls | object       | لا    | روابط النسخ المعالجة       | {...}          | thumbnails, compressed |
| isPublic      | boolean      | نعم   | متاح للعامة                | false          |              |
| processedAt   | timestamp    | لا    | تاريخ المعالجة             | 2025-08-21     |              |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

### 7.5 نظام التخزين المؤقت للموبايل (MobileCache)
> تحسين الأداء للتطبيقات المحمولة

| الحقل         | النوع         | مطلوب | وصف                        | مثال           | قيود         |
|---------------|--------------|-------|----------------------------|----------------|--------------|
| id            | string (uid) | نعم   | معرف التخزين المؤقت        | cache_123abc   | فريد         |
| userId        | string       | نعم   | معرف المستخدم              | u_123abc       | FK → User    |
| cacheKey      | string       | نعم   | مفتاح التخزين المؤقت       | user_profile_c_123abc |        |
| cacheType     | enum         | نعم   | نوع البيانات المخزنة       | profile        | profile/projects/categories |
| data          | object       | نعم   | البيانات المخزنة           | {...}          | JSON         |
| platform      | enum         | نعم   | نوع المنصة                 | android        | android/ios  |
| version       | string       | نعم   | إصدار البيانات             | 1.0.0          |              |
| expiresAt     | timestamp    | نعم   | تاريخ انتهاء الصلاحية      | 2025-08-22     | +24 ساعة     |
| createdAt     | timestamp    | نعم   | تاريخ الإنشاء              | 2025-08-20     |              |
| updatedAt     | timestamp    | نعم   | آخر تحديث                  | 2025-08-21     |              |

---

## 📊 خاتمة التوثيق

### ✅ ملخص الكيانات:
- **الكيانات الأساسية (4):** User, Sessions, Creator, Client
- **كيانات المشاريع (2):** Project, ProjectRequests  
- **كيانات المعدات (3):** Equipment, EquipmentRequests, EquipmentTier
- **كيانات التسعير (10):** Categories, Subcategories, CreatorSubcategories, CreatorSubcategoryPricing, ProcessingModifiers, ExperienceModifiers, EquipmentModifiers, RushModifiers, LocationAdditions, ExchangeRate
- **كيانات النظام (6):** CreatorAvailability, Notifications, NotificationSettings, Reviews, OTPCodes, AuditLogs
- **الكيانات المرجعية (5):** SalariedEmployee, Industry, SubcategoryIndustryLink, FileUploads, MobileCache

### 🎯 **إجمالي:** 30 كيان منظم ونظيف

> 🏆 **تم إعادة تنظيم وتنظيف الملف بالكامل!**  
> ✅ إزالة جميع التكرارات  
> ✅ تجميع منطقي للكيانات  
> ✅ توثيق شامل ودقيق  
> ✅ هيكلة واضحة ومنظمة

---

**آخر تحديث:** 2025-08-23  
**الحالة:** مكتمل ونظيف ✨
