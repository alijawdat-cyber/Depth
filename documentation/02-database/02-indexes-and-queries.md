# 🗃️ الفهارس والاستعلامات (Indexes & Queries) - Firestore V2.1

هذا الملف يعرّف الفهارس المطلوبة والأمثلة المعتمدة للاستعلام في Firestore لدعم أداء مستقر ومتوقع، مع دعم نظام المشاريع متعددة المهام.

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
| projects | industryId ASC, status ASC | مشاريع حسب المجال الصناعي |
| projectRequests | status ASC, createdAt DESC | مراجعة الطلبات الواردة |
| tasks | projectId ASC, status ASC | مهام مشروع محدد |
| tasks | assignedCreatorId ASC, status ASC | مهام مبدع محدد |
| tasks | subcategoryId ASC, status ASC | مهام فئة فرعية |
| tasks | status ASC, dueDate ASC | مهام حسب المواعيد النهائية |
| tasks | projectId ASC, priority DESC, createdAt DESC | ترتيب مهام المشروع بالأولوية |
| creatorRecommendations | projectId ASC, score DESC | توصيات مشروع مرتبة بالنقاط |
| creatorRecommendations | creatorId ASC, status ASC | توصيات مبدع النشطة |
| creatorRecommendations | status ASC, expiresAt ASC | توصيات منتهية الصلاحية |
| creatorRecommendations | projectId ASC, adminReview ASC, score DESC | توصيات تحتاج مراجعة |
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
| invoices | status ASC, dueDate DESC | متابعة الاستحقاقات والمتأخر |
| invoices | clientId ASC, createdAt DESC | فواتير عميل حسب الأحدث |
| payments | invoiceId ASC, receivedAt DESC | كشف مدفوعات الفاتورة |

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

### 3.8 مهام مشروع محدد مرتبة بالأولوية
```js
const q = query(
  collection(db, 'tasks'),
  where('projectId', '==', projectId),
  orderBy('priority', 'desc'),
  orderBy('createdAt', 'desc'),
  limit(50)
);
```

### 3.9 مهام مبدع نشطة
```js
const q = query(
  collection(db, 'tasks'),
  where('assignedCreatorId', '==', creatorId),
  where('status', 'in', ['pending', 'in_progress']),
  orderBy('dueDate', 'asc'),
  limit(20)
);
```

### 3.10 توصيات ذكية لمشروع مرتبة بالنقاط
```js
const q = query(
  collection(db, 'creatorRecommendations'),
  where('projectId', '==', projectId),
  where('status', '==', 'active'),
  orderBy('score', 'desc'),
  limit(10)
);
```

### 3.11 توصيات مبدع النشطة
```js
const q = query(
  collection(db, 'creatorRecommendations'),
  where('creatorId', '==', creatorId),
  where('status', '==', 'active'),
  where('expiresAt', '>', new Date()),
  orderBy('score', 'desc'),
  limit(15)
);
```

### 3.12 مشاريع متعددة المهام النشطة
```js
const q = query(
  collection(db, 'projects'),
  where('status', 'in', ['active', 'pending']),
  orderBy('createdAt', 'desc'),
  limit(25)
);
```

### 3.13 مهام متأخرة عن المواعيد النهائية
```js
const q = query(
  collection(db, 'tasks'),
  where('status', 'in', ['pending', 'in_progress']),
  where('dueDate', '<', new Date()),
  orderBy('dueDate', 'asc'),
  limit(30)
);
```

## 4. اعتبارات الأداء
| الحالة | الخطر | التخفيف |
|--------|-------|---------|
| استعلامات broad بدون where | استهلاك قراءة عالي | إضافة where ضيق أولاً |
| array-contains-any مبالغ به | فهرسة إضافية مكلفة | توحيد الوسوم الأساسية |
| الحجم المتزايد لـ projects | تباطؤ استعلامات | أرشفة سنوية إلى مجموعة منفصلة |
| tasks كبيرة | بطء في البحث | فهرسة مركبة على projectId + status |
| creatorRecommendations متراكمة | استهلاك ذاكرة | تنظيف دوري للمنتهية الصلاحية |
| creatorSubcategories كبيرة | بطء في البحث | فهرسة مركبة على creatorId + subcategoryId |
| notifications متراكمة | ذاكرة عالية | تنظيف دوري للمقروءة القديمة |

## 5. أرشفة (Archival Strategy)
| الكيان | معايير النقل | الوجهة |
|--------|--------------|---------|
| projects | > 12 شهر ومكتمل | projects_archive |
| tasks | مشروع مكتمل > 6 شهور | tasks_archive |
| creatorRecommendations | منتهية الصلاحية > 30 يوم | حذف |
| notifications | > 90 يوم ومقروء | حذف أو تخزين بارد |
| sessions | منتهية > 30 يوم | حذف |
| creatorAvailability | > 6 شهور | حذف (البيانات التاريخية) |
| otpCodes | منتهية الصلاحية > 24 ساعة | حذف |
| reviews | لا حاجة لأرشفة | الاحتفاظ الدائم |

## 6. حدود تشغيلية (Guardrails)
| المهمة | القيمة المستهدفة |
|-------|------------------|
| أقصى حجم مستند Project | < 40 KB (زيادة لدعم Tasks) |
| أقصى عدد Tasks للمشروع | 50 مهمة |
| أقصى عدد Subcollections للمشروع | 4 (tasks, deliverables, comments, audits) |
| أقصى عدد توصيات لكل مشروع | 20 توصية |
| أقصى عناصر في Array (specialties) | 10 |
| أقصى عناصر في Array (portfolioImages) | 10 |
| أقصى طول النص في التعليقات | 1000 حرف |
| أقصى فئات فرعية للمبدع | 20 |
| أقصى عدد جلسات نشطة للمستخدم | 5 |

## 7. مراقبة (Monitoring Hooks)
- قياس زمن الاستعلام P95 شهري.
- تنبيه إذا معدل القراءة > عتبة متفق عليها.
- لوحة للـ Hot Collections (الاستخدام الأعلى).
- مراقبة استهلاك tasks للمشاريع الكبيرة.
- تتبع دقة نظام التوصيات الذكية.

## 8. خارطة مستقبلية
- نقل التحليلات الثقيلة إلى BigQuery Export.
- دعم مؤشرات بحث نصي (Algolia/Elasticsearch) للبحث المتقدم.
- تحسين استعلامات CreatorSubcategories بـ Collection Group Queries.
- إضافة Real-time Listeners للتوفر الشبكي.
- تطوير نظام التوصيات الذكية باستخدام Machine Learning.
- دعم تحليلات المشاريع متعددة المهام.

> آخر تحديث: 2025-09-04 (V2.1)
