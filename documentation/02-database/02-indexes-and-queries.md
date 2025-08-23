# 🗃️ الفهارس والاستعلامات (Indexes & Queries) - Firestore V2.0

هذا الملف يعرّف الفهارس المطلوبة والأمثلة المعتمدة للاستعلام في Firestore لدعم أداء مستقر ومتوقع.

## 1. مبادئ تصميم الفهرسة
1. تجنّب الفهارس العشوائية لكل حقل → زيادة التكلفة.
2. فهرس مركب فقط عند استعلام حقيقي ثابت.
3. لا تستخدم في where + orderBy نفس الحقل باتجاه مختلف دون حاجة.
4. الحد من الاستعلامات واسعة المجال (Collection Group) إلا للبحث العرضي.

## 2. الفهارس المقترحة (Composite Indexes)
| المجموعة | الحقول (الترتيب) | سيناريو الاستخدام |
|----------|------------------|--------------------|
| projects | status ASC, createdAt DESC | لوحة المشاريع حسب الحالة الأحدث |
| projects | clientId ASC, createdAt DESC | متابعة مشاريع عميل |
| projects | creatorId ASC, status ASC | مشاريع مبدع حسب الحالة |
| projectRequests | status ASC, createdAt DESC | مراجعة الطلبات الواردة |
| creators | experienceLevel ASC, equipmentTier ASC | تصفية المواهب |
| creators | onboardingStatus ASC, createdAt DESC | متابعة طلبات الانضمام |
| creators | isAvailable ASC, rating DESC | البحث عن المبدعين المتاحين |
| creatorSubcategories | creatorId ASC, isActive ASC | فئات المبدع النشطة |
| creatorSubcategories | subcategoryId ASC, isActive ASC | المبدعين في فئة معينة |
| notifications | recipientId ASC, createdAt DESC | صندوق إشعارات المستخدم |
| notifications | recipientId ASC, isRead ASC, createdAt DESC | الإشعارات غير المقروءة |
| creatorAvailability | creatorId ASC, date ASC | جدول توفر المبدع |
| creatorAvailability | creatorId ASC, status ASC, date ASC | البحث عن أوقات متاحة |
| sessions | userId ASC, isActive ASC, createdAt DESC | إدارة الجلسات النشطة |
| sessions | userId ASC, createdAt DESC | تاريخ جلسات المستخدم |
| reviews | projectId ASC, createdAt DESC | تقييمات المشروع |
| reviews | revieweeId ASC, rating DESC | تقييمات المبدع/العميل |

> تُضبط عبر Firebase Console أو firestore.indexes.json لاحقاً.

## 3. أمثلة استعلامات نموذجية
### 3.1 مشاريع مبدع نشطة
```js
const q = query(
  collection(db, 'projects'),
  where('creatorId', '==', creatorId),
  where('status', 'in', ['active','pending']),
  orderBy('status'),
  orderBy('createdAt', 'desc'),
  limit(20)
);
```

### 3.2 مشاريع عميل مكتملة (صفحة ثانية)
```js
const q = query(
  collection(db, 'projects'),
  where('clientId', '==', clientId),
  where('status', '==', 'completed'),
  orderBy('createdAt', 'desc'),
  startAfter(lastSnapshot),
  limit(20)
);
```

### 3.3 إشعارات جديدة غير مقروءة
```js
const q = query(
  collection(db, 'notifications'),
  where('recipientId', '==', userId),
  where('isRead', '==', false),
  orderBy('createdAt', 'desc'),
  limit(50)
);
```

### 3.4 البحث عن مبدعين متاحين في فئة معينة
```js
const q = query(
  collection(db, 'creatorSubcategories'),
  where('subcategoryId', '==', subcategoryId),
  where('isActive', '==', true)
);

// ثم جلب تفاصيل المبدعين
const creatorIds = results.map(doc => doc.data().creatorId);
const creatorsQuery = query(
  collection(db, 'creators'),
  where('id', 'in', creatorIds),
  where('isAvailable', '==', true),
  orderBy('rating', 'desc'),
  limit(10)
);
```

### 3.5 جلسات مستخدم نشطة
```js
const q = query(
  collection(db, 'sessions'),
  where('userId', '==', userId),
  where('isActive', '==', true),
  orderBy('lastActivity', 'desc'),
  limit(5)
);
```

### 3.6 توفر المبدع في يوم معين
```js
const q = query(
  collection(db, 'creatorAvailability'),
  where('creatorId', '==', creatorId),
  where('date', '==', targetDate),
  orderBy('timeSlot', 'asc')
);
```

### 3.7 طلبات المشاريع المعلقة للمراجعة
```js
const q = query(
  collection(db, 'projectRequests'),
  where('status', '==', 'pending'),
  orderBy('createdAt', 'asc'),
  limit(20)
);
```

## 4. اعتبارات الأداء
| الحالة | الخطر | التخفيف |
|--------|-------|---------|
| استعلامات broad بدون where | استهلاك قراءة عالي | إضافة where ضيق أولاً |
| array-contains-any مبالغ به | فهرسة إضافية مكلفة | توحيد الوسوم الأساسية |
| الحجم المتزايد لـ projects | تباطؤ استعلامات | أرشفة سنوية إلى مجموعة منفصلة |
| creatorSubcategories كبيرة | بطء في البحث | فهرسة مركبة على creatorId + subcategoryId |
| notifications متراكمة | ذاكرة عالية | تنظيف دوري للمقروءة القديمة |

## 5. أرشفة (Archival Strategy)
| الكيان | معايير النقل | الوجهة |
|--------|--------------|---------|
| projects | > 12 شهر ومكتمل | projects_archive |
| notifications | > 90 يوم ومقروء | حذف أو تخزين بارد |
| sessions | منتهية > 30 يوم | حذف |
| creatorAvailability | > 6 شهور | حذف (البيانات التاريخية) |
| otpCodes | منتهية الصلاحية > 24 ساعة | حذف |
| reviews | لا حاجة لأرشفة | الاحتفاظ الدائم |

## 6. حدود تشغيلية (Guardrails)
| البند | القيمة المستهدفة |
|-------|------------------|
| أقصى حجم مستند Project | < 32 KB |
| أقصى عدد Subcollections للمشروع | 3 (deliverables, comments, audits) |
| أقصى عناصر في Array (specialties) | 10 |
| أقصى عناصر في Array (portfolioImages) | 10 |
| أقصى طول النص في التعليقات | 1000 حرف |
| أقصى فئات فرعية للمبدع | 20 |
| أقصى عدد جلسات نشطة للمستخدم | 5 |

## 7. مراقبة (Monitoring Hooks)
- قياس زمن الاستعلام P95 شهري.
- تنبيه إذا معدل القراءة > عتبة متفق عليها.
- لوحة للـ Hot Collections (الاستخدام الأعلى).

## 8. خارطة مستقبلية
- نقل التحليلات الثقيلة إلى BigQuery Export.
- دعم مؤشرات بحث نصي (Algolia/Elasticsearch) للبحث المتقدم.
- تحسين استعلامات CreatorSubcategories بـ Collection Group Queries.
- إضافة Real-time Listeners للتوفر الشبكي.

> آخر تحديث: 2025-08-23
