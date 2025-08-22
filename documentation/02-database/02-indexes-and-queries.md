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
| creators | experience ASC, equipmentTier ASC | تصفية المواهب |
| notifications | userId ASC, createdAt DESC | صندوق إشعارات المستخدم |
| messages | threadId ASC, createdAt ASC | تدفق محادثة مرتب |
| sessions | userId ASC, createdAt DESC | إدارة الجلسات / الأمن |

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
  where('userId', '==', userId),
  where('isRead', '==', false),
  orderBy('createdAt', 'desc'),
  limit(50)
);
```

### 3.4 تصفية مبدعين
```js
const q = query(
  collection(db, 'creators'),
  where('experience', 'in', ['experienced','expert']),
  where('categories', 'array-contains', 'photo'),
  orderBy('experience'),
  limit(30)
);
```

### 3.5 جلسات مستخدم حديثة
```js
const q = query(
  collection(db, 'sessions'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(10)
);
```

## 4. اعتبارات الأداء
| الحالة | الخطر | التخفيف |
|--------|-------|---------|
| استعلامات broad بدون where | استهلاك قراءة عالي | إضافة where ضيق أولاً |
| array-contains-any مبالغ به | فهرسة إضافية مكلفة | توحيد الوسوم الأساسية |
| الحجم المتزايد لـ projects | تباطؤ استعلامات | أرشفة سنوية إلى مجموعة منفصلة |
| محادثات ضخمة | تحميل متدرج بطيء | تقسيم threads حسب سنة |

## 5. أرشفة (Archival Strategy)
| الكيان | معايير النقل | الوجهة |
|--------|--------------|---------|
| projects | > 12 شهر ومكتمل | projects_archive |
| notifications | > 90 يوم ومقروء | حذف أو تخزين بارد |
| sessions | منتهية > 30 يوم | حذف |
| logs (خارجي) | > 30/90 يوم | نظام خارجي (BigQuery) |

## 6. حدود تشغيلية (Guardrails)
| البند | القيمة المستهدفة |
|-------|------------------|
| أقصى حجم مستند Project | < 32 KB |
| أقصى عدد Subcollections للمشروع | 3 (deliverables, comments, audits) |
| أقصى عناصر في Array (tags) | 30 |
| طول السجل في messages | < 5 KB |

## 7. مراقبة (Monitoring Hooks)
- قياس زمن الاستعلام P95 شهري.
- تنبيه إذا معدل القراءة > عتبة متفق عليها.
- لوحة للـ Hot Collections (الاستخدام الأعلى).

## 8. خارطة مستقبلية
- نقل التحليلات الثقيلة إلى BigQuery Export.
- دعم مؤشرات بحث نصي (Integrations لاحقاً) عند الحاجة.

> آخر تحديث: 2025-08-21
