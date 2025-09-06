# 📊 مخطط قاعدة البيانات V2.1 - Firestore Collections (نظام المشاريع المتطور)

> 🔒 **SSOT — مصدر الحقيقة الوحيد:**
> - المتطلبات: `documentation/01-requirements/00-requirements-v2.0.md`
> - التعدادات والمعادلات: `documentation/99-reference/02-enums-standard.md`
> - قاموس البيانات: `documentation/02-database/00-data-dictionary.md`

**تاريخ التطوير:** 2025-09-04  
**النسخة:** V2.1 - نظام المشاريع المتطور مع Tasks والترشيح الذكي

**الميزات الجديدة في V2.1:**
- ✅ **نظام المهام المتعددة (tasks)** - كل مشروع يحتوي على مهام متعددة
- ✅ **الترشيح الذكي للمبدعين (recommendations)** - نظام ترشيح متطور
- ✅ **ربط الصنعة بالمشروع** - كل مشروع مرتبط بمجال العميل التجاري
- ✅ **التسعير على مستوى المهمة** - حساب دقيق لكل خدمة منفصلة

---

## 🏗️ هيكل المجموعات (Firestore Collections)

### 1. مجموعة المستخدمين (users)
```javascript
{
  uid: string,                    // Firebase Auth UID (PK)
  phone: string,                  // رقم الهاتف العراقي (unique)
  email: string,                  // البريد الإلكتروني (optional, unique if exists)
  role: 'creator' | 'client' | 'salariedEmployee' | 'admin' | 'super_admin',
  isActive: boolean,
  isVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. مجموعة الأدمنز (admins)
```javascript
{
  id: string,                     // معرف الأدمن (PK)
  userId: string,                 // FK → users (unique)
  adminLevel: 'super_admin' | 'admin',
  fullName: string,
  phone: string,
  addedBy: string,                // userId of super_admin who added them
  addedAt: timestamp,
  permissions: {
    canManageUsers: boolean,      // إدارة المستخدمين
    canManageProjects: boolean,   // إدارة المشاريع
    canManagePayments: boolean,   // إدارة المدفوعات
    canViewReports: boolean,      // عرض التقارير
    canManageSettings: boolean,   // إدارة الإعدادات
    canManageAdmins: boolean      // إدارة الأدمنز (super_admin only)
  },
  googleAuth: {
    googleId: string,             // Google OAuth ID
    email: string,                // Google email (must match user email)
    verified: boolean,
    verifiedAt: timestamp
  },
  // isSeeded: boolean,           // مُلغى في V2.0 — لا نستخدم seeded admins
  isActive: boolean,
  lastLoginAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. مجموعة جلسات المستخدمين (sessions)
```javascript
{
  id: string,                     // معرف الجلسة (PK)
  userId: string,                 // FK → users
  token: string,                  // توكن مشفر (unique)
  platform: 'android' | 'ios' | 'web',
  deviceId: string,
  deviceInfo: {
    model: string,
    os: string,
    version: string
  },
  ipAddress: string,
  userAgent: string,
  isActive: boolean,
  lastActivity: timestamp,
  expiresAt: timestamp,           // +30 يوم
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. مجموعة المبدعين (creators)
```javascript
{
  id: string,                     // معرف المبدع (PK)
  userId: string,                 // FK → users (unique)
  fullName: string,
  displayName: string,            // unique
  bio: string,                    // ≤500 حرف
  profileImage: string,           // URL
  portfolioImages: string[],      // ≤10 صور
  // ℹ️ V2.0: عرض بسيط فقط بدون تنظيم متقدم؛ ≤10 روابط صور ثابتة
  
  // الموقع
  location: {
    city: string,
    area: string
  },
  
  // الخبرة
  specialties: string[],          // ['photo', 'video', 'design', 'editing']
  experienceLevel: 'fresh' | 'experienced' | 'expert',
  yearsOfExperience: number,      // ≥0
  
  // المعدات
  equipmentTier: 'silver' | 'gold' | 'platinum',
  hasOwnEquipment: boolean,       // true = يملك معدات، false = يستخدم معدات الوكالة
  
  // حالة الانضمام
  onboardingStatus: 'pending' | 'active' | 'completed' | 'approved' | 'rejected',
  onboardingStep: number,         // 1-5
  
  // الإحصائيات
  isAvailable: boolean,
  isVerified: boolean,
  verifiedAt: timestamp,
  verifiedBy: string,             // admin email
  rating: number,                 // 0.0-5.0
  totalReviews: number,
  completedProjects: number,
  responseTimeHours: number,
  
  // المالية (أساسية فقط - التفاصيل في جدول منفصل)
  
  // التواريخ
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. مجموعة العملاء (clients)
```javascript
{
  id: string,                     // معرف العميل (PK)
  userId: string,                 // FK → users (unique)
  fullName: string,
  companyName: string,
  businessType: 'individual' | 'company' | 'agency',
```javascript
{
  id: string,                     // معرف العميل (PK)
  userId: string,                 // FK → users (unique)
  fullName: string,
  companyName: string,
  businessType: 'individual' | 'company' | 'agency',
  
  // ربط الصنعة (محدث في V2.1)
  industry: string,               // اسم الصنعة مباشرة - restaurants, fashion, etc
  industryExperience: string,     // وصف الخبرة في المجال
  
  // الموقع
  location: {
    city: string,
    area: string
  },
  
  // الفوترة
  billingAddress: {
    street: string,
    city: string,
    postalCode: string
  },
  preferredLanguage: 'ar' | 'en',
  paymentTerms: 'advance_50' | 'advance_100' | 'net_15' | 'net_30',
  
  // الإحصائيات المحسنة (V2.1)
  totalSpent: number,             // بالدينار العراقي
  totalProjects: number,
  activeProjects: number,         // عدد المشاريع النشطة
  completedProjects: number,      // عدد المشاريع المكتملة
  averageProjectValue: number,    // متوسط قيمة المشروع
  
  // تفضيلات الخدمات (جديد في V2.1)
  preferredServices: string[],    // الفئات الفرعية المفضلة
  serviceHistory: [{              // تاريخ الخدمات المطلوبة
    subcategoryId: string,
    frequency: number,            // عدد مرات الطلب
    lastOrderDate: date
  }],
  
  // تقييم ومعلومات الجودة
  rating: number,                 // 0.0-5.0
  relationshipScore: number,      // نقاط العلاقة مع الوكالة
  
  // التواريخ
  createdAt: timestamp,
  updatedAt: timestamp
}
```
```

### 6. مجموعة الموظفين براتب ثابت (salariedEmployees)
```javascript
{
  id: string,                     // معرف الموظف (PK)
  userId: string,                 // FK → users (unique)
  employeeCode: string,           // رقم الموظف (unique)
  fullName: string,
  department: 'admin' | 'hr' | 'finance' | 'marketing',
  position: string,
  monthlySalary: number,          // بالدينار العراقي
  hireDate: date,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7. مجموعة الفئات الرئيسية (categories)
```javascript
{
  id: string,                     // معرف الفئة (PK)
  nameAr: string,                 // unique
  nameEn: string,                 // unique  
  code: string,                   // unique ('photo', 'video', 'design', 'editing')
  displayOrder: number,
  isActive: boolean,
  createdBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 8. مجموعة الفئات الفرعية (subcategories)
```javascript
{
  id: string,                     // معرف الفئة الفرعية (PK)
  categoryId: string,             // FK → categories
  nameAr: string,                 // unique
  nameEn: string,                 // unique
  code: string,                   // unique
  basePrice: number,              // السعر الأساسي بالدينار العراقي
  description: string,
  displayOrder: number,
  isActive: boolean,
  createdBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 9. مجموعة ربط المبدع بالفئات الفرعية (creatorSubcategories)
```javascript
{
  id: string,                     // معرف الربط (PK)
  creatorId: string,              // FK → creators
  subcategoryId: string,          // FK → subcategories
  processingLevel: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite',
  isPreferred: boolean,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 10. مجموعة بنود المشاريع (tasks) - محدث في V2.1
```javascript
{
  id: string,                     // معرف المهمة (PK)
  projectId: string,              // FK → projects
  subcategoryId: string,          // FK → subcategories
  
  // تفاصيل المهمة
  quantity: number,               // الكمية المطلوبة
  processingLevel: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite',
  
  // التعيين والترشيح
  assignedCreatorId: string,      // FK → creators - المبدع المعين
  recommendedCreators: [{         // قائمة المبدعين المرشحين
    creatorId: string,
    matchScore: number,           // درجة التطابق (0-100)
    reasons: string[],            // أسباب الترشيح
    estimatedPrice: number,       // السعر المقدر
    availability: string          // حالة التوفر
  }],
  assignmentReason: string,       // سبب اختيار المبدع المعين
  
  // التسعير على مستوى المهمة
  basePrice: number,              // السعر الأساسي للوحدة
  unitCreatorPrice: number,       // سعر المبدع للوحدة (بعد المعاملات)
  unitClientPrice: number,        // السعر النهائي للوحدة (+ هامش)
  totalCreatorPrice: number,      // unitCreatorPrice × quantity
  totalClientPrice: number,       // unitClientPrice × quantity
  
  // معاملات التسعير المطبقة (للشفافية)
  pricingFactors: {
    experienceMultiplier: number,
    equipmentMultiplier: number,
    processingMultiplier: number,
    rushMultiplier: number,
    ownershipFactor: number,
    locationAddition: number,
    agencyMarginPercent: number
  },
  
  // حالة وتتبع المهمة
  status: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'cancelled',
  progress: number,               // نسبة الإنجاز (0-100)
  
  // جدولة وتوقيتات
  estimatedHours: number,
  actualHours: number,
  plannedStartDate: date,
  actualStartDate: date,
  plannedEndDate: date,
  actualEndDate: date,
  
  // متطلبات وملاحظات
  requirements: string,           // متطلبات خاصة بالمهمة
  clientNotes: string,           // ملاحظات العميل
  creatorNotes: string,          // ملاحظات المبدع
  adminNotes: string,            // ملاحظات الأدمن
  
  // ملفات ومرفقات
  referenceFiles: string[],      // ملفات مرجعية
  deliverableFiles: string[],    // الملفات المسلمة
  
  // تاريخ إعادة التعيين (إن وجد)
  reassignmentHistory: [{
    fromCreatorId: string,
    toCreatorId: string,
    reason: string,
    date: timestamp,
    initiatedBy: string          // admin ID
  }],
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 11. مجموعة ترشيحات المبدعين (recommendations) - محدث في V2.1
```javascript
{
  id: string,                     // معرف الترشيح (PK)
  taskId: string,                 // FK → tasks
  creatorId: string,              // FK → creators
  
  // درجة التطابق والترشيح
  matchScore: number,             // درجة التطابق الإجمالية (0-100)
  scoreBreakdown: {               // تفصيل النقاط
    skillMatch: number,           // تطابق المهارات (0-25)
    experienceLevel: number,      // مستوى الخبرة (0-20)
    equipmentQuality: number,     // جودة المعدات (0-15)
    availabilityFactor: number,   // عامل التوفر (0-20)
    locationCompatibility: number, // تطابق الموقع (0-10)
    rating: number                // التقييم العام (0-10)
  },
  
  // أسباب الترشيح
  recommendationReasons: string[], // قائمة أسباب الترشيح
  warningFlags: string[],         // تحذيرات أو نقاط ضعف
  
  // معلومات التسعير والتوفر
  estimatedPrice: number,         // السعر المقدر للمهمة
  availability: {
    status: 'available' | 'busy' | 'partially_available',
    availableFrom: date,
    notes: string
  },
  
  // معلومات إضافية
  responseTimeHours: number,      // متوسط وقت الاستجابة
  completionRate: number,         // معدل إنجاز المشاريع
  industryExperience: boolean,    // خبرة في نفس الصنعة
  
  // حالة الترشيح
  status: 'pending' | 'accepted' | 'rejected' | 'expired',
  expiresAt: timestamp,          // تاريخ انتهاء صلاحية الترشيح
  
  // معلومات النظام
  algorithmVersion: string,       // إصدار خوارزمية الترشيح المستخدمة
  generatedAt: timestamp,
  lastUpdated: timestamp
}
```

### 12. مجموعة ربط المبدع بالفئات الفرعية (creatorSubcategories) - محدث
```javascript
{
  id: string,                     // معرف الربط (PK)
  creatorId: string,              // FK → creators
  subcategoryId: string,          // FK → subcategories
  processingLevel: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite',
  
  // مستوى المهارة والخبرة (جديد في V2.1)
  skillLevel: number,             // مستوى المهارة (1-100)
  experienceProjects: number,     // عدد المشاريع السابقة في هذه الفئة
  lastProjectDate: date,          // تاريخ آخر مشروع في هذه الفئة
  averageRating: number,          // متوسط التقييم في هذه الفئة
  
  // تفضيلات وأولويات
  isPreferred: boolean,           // فئة مفضلة للمبدع
  priority: number,               // أولوية الفئة (1-10)
  
  // إعدادات التوفر والتسعير
  customPricing: {                // تسعير مخصص (اختياري)
    hasCustomRate: boolean,
    customMultiplier: number
  },
  availabilityNotes: string,      // ملاحظات خاصة بالتوفر
  
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 13. مجموعة المشاريع (projects) - محدث للنظام الجديد
```javascript
{
  id: string,                     // معرف المشروع (PK)
  clientId: string,               // FK → clients
  categoryId: string,             // FK → categories
  subcategoryId: string,          // FK → subcategories (لا يتغير بعد التحويل من الطلب)

  // المهام والتعيينات (يدعم تعدد المبدعين/الأدوار)
```javascript
{
  id: string,                     // معرف المشروع (PK)
  clientId: string,               // FK → clients
  
  // معلومات المشروع الأساسية
  title: string,                  // عنوان المشروع
  description: string,            // وصف تفصيلي
  industryId: string,             // FK → industries - ربط الصنعة
  
  // التصنيف الرئيسي للمشروع
  categoryId: string,             // FK → categories - الفئة الرئيسية
  subcategoryId: string,          // FK → subcategories - الفئة الفرعية الأساسية
  
  // النظام الجديد - دعم المهام المتعددة
  // ❌ تم إزالة: creatorId - منقول لـ tasks
  
  // معلومات التسعير الإجمالية (محسوبة من المهام)
  totalBasePrice: number,         // مجموع الأسعار الأساسية لكل المهام
  totalCreatorPrice: number,      // مجموع أسعار المبدعين لكل المهام
  totalClientPrice: number,       // السعر النهائي الإجمالي للعميل
  agencyMarginPercent: number,    // متوسط نسبة هامش الوكالة المطبقة
  agencyMarginAmount: number,     // إجمالي مبلغ هامش الوكالة
  
  // إحصائيات المهام (مشتقة)
  tasksCount: number,             // عدد المهام في المشروع
  totalQuantity: number,          // إجمالي الكميات
  assignedCreatorsCount: number,  // عدد المبدعين المعينين
  
  // حالة ومعلومات المشروع
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled',
  priority: 'low' | 'normal' | 'high' | 'urgent',
  isArchived: boolean,            // الأرشفة كفلاغ مستقل دون تغيير SSOT
  
  // التوقيتات والجدولة
  isRush: boolean,
  location: 'studio' | 'client' | 'outskirts' | 'nearby' | 'far',
  requestedDeliveryDate: date,    // التاريخ المطلوب من العميل
  plannedDeliveryDate: date,      // التاريخ المخطط داخلياً
  actualDeliveryDate: date,       // التاريخ الفعلي للتسليم
  
  // معلومات الطلب الأصلي
  originalRequestId: string,      // FK → projectRequests
  requestSubcategoryId: string,   // الفئة الفرعية الأصلية في الطلب
  
  // ملاحظات ومتطلبات
  clientRequirements: string,     // متطلبات العميل الأساسية
  internalNotes: string,          // ملاحظات داخلية للفريق
  publicNotes: string,            // ملاحظات عامة مرئية للعميل
  
  // معلومات الموافقة والإدارة
  approvedBy: string,             // admin email الذي وافق
  approvedAt: timestamp,          // تاريخ الموافقة
  
  // تتبع التقدم الإجمالي
  overallProgress: number,        // نسبة الإنجاز الإجمالية (0-100)
  progressLastUpdated: timestamp, // آخر تحديث للتقدم
  
  // معلومات التقييم والجودة
  clientRating: number,           // تقييم العميل للمشروع (1-5)
  clientFeedback: string,         // تعليق العميل
  internalQualityScore: number,   // نقاط الجودة الداخلية
  
  // التواريخ الأساسية
  createdBy: string,              // admin email منشئ المشروع
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 14. مجموعة العملاء (clients) - محدث لربط الصنعة
```

### 11. مجموعة طلبات المشاريع (projectRequests)
```javascript
{
  id: string,                     // معرف الطلب (PK)
  requestNumber: string,          // رقم الطلب (unique)
  clientId: string,               // FK → clients
  categoryId: string,             // FK → categories
  subcategoryId: string,          // FK → subcategories
  description: string,            // ≤1000 حرف
  preferredLocation: 'studio' | 'client' | 'outskirts' | 'nearby' | 'far',
  budget: {
    min: number,
    max: number
  },
  deadline: date,
  attachments: string[],          // URLs
  priority: 'low' | 'normal' | 'high' | 'urgent',
  status: 'pending' | 'reviewing' | 'approved' | 'rejected',
  estimatedPrice: number,         // بالدينار العراقي
  assignedTo: string,             // admin email
  reviewNotes: string,
  reviewedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 12. مجموعة المعدات (equipment)
```javascript
{
  id: string,                     // معرف المعدة (PK)
  ownerId: string,                // FK → creators
  type: 'camera' | 'lens' | 'lighting' | 'microphone' | 'tripod' | 'other',
  brand: string,
  model: string,
  status: 'excellent' | 'good' | 'needs_approval',
  purchaseDate: date,
  isApproved: boolean,
  approvedBy: string,             // admin email
  approvedAt: timestamp,
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 13. مجموعة معاملات المعالجة (processingModifiers)
```javascript
{
  id: string,                     // معرف المعامل (PK)
  level: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite',
  nameAr: string,
  nameEn: string,
  modifier: number,               // المعامل
  description: string,
  isActive: boolean,
  createdBy: string,              // admin email
  updatedBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 14. مجموعة معاملات الخبرة (experienceModifiers)
```javascript
{
  id: string,                     // معرف المعامل (PK)
  level: 'fresh' | 'experienced' | 'expert',
  nameAr: string,
  nameEn: string,
  modifier: number,               // المعامل
  minYears: number,               // ≥0
  maxYears: number,               // null للمفتوح
  isActive: boolean,
  createdBy: string,              // admin email
  updatedBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 15. مجموعة معاملات المعدات (equipmentModifiers)
```javascript
{
  id: string,                     // معرف المعامل (PK)
  tier: 'silver' | 'gold' | 'platinum',
  nameAr: string,
  nameEn: string,
  modifier: number,               // المعامل
  description: string,
  isActive: boolean,
  createdBy: string,              // admin email
  updatedBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 16. مجموعة معاملات الاستعجال (rushModifiers)
```javascript
{
  id: string,                     // معرف المعامل (PK)
  type: 'normal' | 'rush',
  nameAr: string,
  nameEn: string,
  modifier: number,               // المعامل
  isActive: boolean,
  createdBy: string,              // admin email
  updatedBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 17. مجموعة إضافات الموقع (locationAdditions)
```javascript
{
  id: string,                     // معرف المعامل (PK)
  location: 'studio' | 'client' | 'outskirts' | 'nearby' | 'far',
  nameAr: string,
  nameEn: string,
  addition: number,               // الإضافة الثابتة بالدينار
  isActive: boolean,
  createdBy: string,              // admin email
  updatedBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 18. مجموعة الإشعارات (notifications)
```javascript
{
  id: string,                     // معرف الإشعار (PK)
  recipientId: string,            // FK → users
  type: 'creator_approved' | 'new_project' | 'project_completed' | 'payment_received',
  priority: 'critical' | 'high' | 'normal' | 'low',
  channels: string[],             // ['push', 'email', 'sms', 'inApp']
  title: string,
  message: string,
  titleEn: string,
  messageEn: string,
  actionType: 'navigate' | 'external' | 'none',
  actionPath: string,
  isRead: boolean,
  isSent: boolean,
  sentChannels: string[],
  failedChannels: string[],
  relatedEntityId: string,
  relatedEntityType: 'project' | 'client' | 'creator',
  sentAt: timestamp,
  readAt: timestamp,
  expiresAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 19. مجموعة التوفر الشبكي (creatorAvailability)
```javascript
{
  id: string,                     // معرف الفترة (PK)
  creatorId: string,              // FK → creators
  date: date,
  timeSlot: string,               // "09:00" (كل 30 دقيقة)
  status: 'available' | 'busy' | 'blocked' | 'break',
  projectId: string,              // FK → projects (if busy)
  blockReason: string,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 20. مجموعة التقييمات (reviews)
```javascript
{
  id: string,                     // معرف التقييم (PK)
  projectId: string,              // FK → projects
  reviewerId: string,             // معرف المُقيم
  revieweeId: string,             // معرف المُقيَم
  rating: number,                 // 1-5
  comment: string,
  isPublic: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 21. مجموعة أكواد التحقق (otpCodes)
### 22. مجموعة الفواتير (invoices)
```javascript
{
  id: string,                   // معرف الفاتورة (PK) INV-2025-0001
  projectId: string,            // FK → projects
  clientId: string,             // FK → clients
  number: string,               // رقم تسلسلي قابل للبحث
  status: 'draft'|'issued'|'partially_paid'|'paid'|'overdue'|'cancelled',
  currency: 'IQD',
  amount: {
    subtotal: number,
    tax: 0,                     // V2.0: ضرائب خارج النطاق → صفر دائماً
    discount: number,           // خصم اختياري بالقيمة
    total: number
  },
  dueDate: date,
  issuedAt: timestamp,
  notes: string,
  invoiceItems: [{
    description: string,
    quantity: number,
    unitPrice: number,
    total: number
  }],
  paymentTerms: 'advance_50'|'advance_100'|'net_15'|'net_30',
  relatedPaymentsCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 23. مجموعة المدفوعات (payments)
```javascript
{
  id: string,                   // معرف الدفعة (PK) pay_abc123
  invoiceId: string,            // FK → invoices
  clientId: string,             // FK → clients
  amount: number,
  method: 'manual',             // V2.0 يدوي فقط
  reference: string,            // رقم إيصال/ملاحظة
  receivedAt: timestamp,        // تاريخ الاستلام الفعلي
  verifiedBy: string,           // admin email
  verifiedAt: timestamp,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```
```javascript
{
  id: string,                     // معرف الكود (PK)
  phoneNumber: string,            // رقم الهاتف العراقي
  code: string,                   // مشفر
  purpose: 'registration' | 'password_reset' | 'phone_change',
  isUsed: boolean,
  attemptCount: number,           // ≤5
  expiresAt: timestamp,           // +10 دقائق
  usedAt: timestamp,
  lastAttemptAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔍 الفهارس المطلوبة (Composite Indexes) - محدث V2.1

### الفهارس الأساسية المحدثة:
```javascript
// Projects - محدث للنظام الجديد
projects: [
  ['clientId', 'status'],
  ['industryId', 'status'],        // جديد - فلترة حسب الصنعة
  ['categoryId', 'status'],        // فلترة حسب الفئة الرئيسية
  ['status', 'createdAt'],
  ['isArchived', 'status', 'createdAt'],
  ['priority', 'status'],          // جديد - فلترة حسب الأولوية
  ['overallProgress', 'status']    // جديد - فلترة حسب التقدم
]

// Tasks - جديد في V2.1
tasks: [
  ['projectId', 'status'],
  ['assignedCreatorId', 'status'],
  ['subcategoryId', 'status'],
  ['status', 'plannedEndDate'],
  ['assignedCreatorId', 'status', 'plannedEndDate'],
  ['projectId', 'progress'],
  ['status', 'createdAt']
]

// Recommendations - جديد في V2.1  
recommendations: [
  ['taskId', 'matchScore'],
  ['creatorId', 'status'],
  ['taskId', 'status', 'matchScore'],
  ['expiresAt', 'status'],
  ['generatedAt', 'algorithmVersion']
]

// Creators - محدث
creators: [
  ['onboardingStatus', 'createdAt'],
  ['experienceLevel', 'equipmentTier'],
  ['isAvailable', 'rating'],
  ['location.city', 'isAvailable'], // جديد - فلترة جغرافية
  ['specialties', 'rating']         // جديد - فلترة حسب التخصص
]

// CreatorSubcategories - محدث
creatorSubcategories: [
  ['creatorId', 'isActive'],
  ['subcategoryId', 'isActive'],
  ['creatorId', 'skillLevel'],      // جديد - ترتيب حسب المهارة
  ['subcategoryId', 'skillLevel'],  // جديد
  ['isPreferred', 'skillLevel']     // جديد - المفضلة أولاً
]

// Clients - محدث
clients: [
  ['industryId', 'totalSpent'],     // جديد - فلترة حسب الصنعة
  ['businessType', 'createdAt'],
  ['totalProjects', 'rating'],
  ['preferredServices', 'totalSpent'] // جديد
]

// Notifications
notifications: [
  ['recipientId', 'isRead', 'createdAt'],
  ['recipientId', 'type', 'createdAt']
]

// CreatorAvailability
creatorAvailability: [
  ['creatorId', 'date'],
  ['creatorId', 'status', 'date']
]

// ProjectRequests - محدث
projectRequests: [
  ['status', 'createdAt'],
  ['clientId', 'status'],
  ['convertedProjectId', 'status']  // جديد - ربط مع المشروع
]

// Sessions
sessions: [
  ['userId', 'isActive', 'createdAt'],
  ['userId', 'createdAt']
]

// Industries - جديد
industries: [
  ['isActive', 'displayOrder'],
  ['code', 'isActive']
]
```

### فهارس البحث المتقدم (V2.1):
```javascript
// للبحث المعقد في المشاريع
projects_advanced_search: [
  ['industryId', 'status', 'createdAt'],
  ['clientId', 'industryId', 'status'],
  ['assignedCreatorsCount', 'totalClientPrice'],
  ['overallProgress', 'plannedDeliveryDate']
]

// للترشيح الذكي
creator_matching: [
  ['subcategoryId', 'skillLevel', 'isActive'],
  ['creatorId', 'experienceProjects', 'averageRating'],
  ['processingLevel', 'skillLevel']
]

// لتحليل الأداء
performance_analytics: [
  ['projectId', 'status', 'actualEndDate'],
  ['assignedCreatorId', 'status', 'actualHours'],
  ['industryId', 'totalClientPrice', 'createdAt']
]
```

### فهارس التقارير والإحصائيات:
```javascript
// تقارير العملاء
client_analytics: [
  ['industryId', 'totalSpent', 'createdAt'],
  ['clientId', 'serviceHistory.subcategoryId', 'serviceHistory.frequency']
]

// تقارير المبدعين
creator_analytics: [
  ['assignedCreatorId', 'totalCreatorPrice', 'actualEndDate'],
  ['skillLevel', 'experienceProjects', 'averageRating']
]
```

---

## 🔐 قواعد الأمان (Security Rules)

### قواعد Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - يمكن للمستخدم الوصول لبياناته فقط
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
  // Creators - قراءة عامة، كتابة للمبدع والأدمن/السوبر أدمن
    match /creators/{creatorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
            (request.auth.uid == resource.data.userId || 
             isAdminOrSuperAdmin(request.auth.uid));
    }
    
  // Clients - الوصول للعميل والأدمن/السوبر أدمن فقط
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
              (request.auth.uid == resource.data.userId || 
               isAdminOrSuperAdmin(request.auth.uid));
    }
    
    // Projects - الوصول للأطراف المعنية فقط (عميل/مبدع/أدمن/سوبر أدمن/موظف مُسند)
    match /projects/{projectId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.clientId ||
                      request.auth.uid == resource.data.creatorId ||
                      isAdminOrSuperAdmin(request.auth.uid) ||
                      isAssignedSalariedEmployee(request.auth.uid, resource.data.assignments));
      
      allow create: if request.auth != null;
      
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.clientId ||
                        request.auth.uid == resource.data.creatorId ||
                        isAdminOrSuperAdmin(request.auth.uid) ||
                        // الموظف المُسند: تحديثات محدودة (تعليقات/مرفقات/حالة مهمة)
                        (isSalariedEmployee(request.auth.uid) && isAssignedSalariedEmployee(request.auth.uid, resource.data.assignments)));
    }
    
    // Admin-only collections
    match /{adminCollection}/{docId} {
      allow read, write: if request.auth != null && isAdminOrSuperAdmin(request.auth.uid);
      
      // Collections: categories, subcategories, processingModifiers, 
      // experienceModifiers, equipmentModifiers, rushModifiers, locationAdditions
    }
    
    // Helper functions
    function isAdminOrSuperAdmin(userId) {
      let role = get(/databases/$(database)/documents/users/$(userId)).data.role;
      return role == 'admin' || role == 'super_admin';
    }
    
    function isCreator(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'creator';
    }
    
    function isClient(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'client';
    }

    function isSalariedEmployee(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'salariedEmployee';
    }

    // يفترض أن المشروع يحتوي على حقل assignments: [{ userId: string, role: 'salariedEmployee'|'creator'|'admin' }]
    function isAssignedSalariedEmployee(userId, assignments) {
      return assignments != null && assignments.hasAny(a => a.userId == userId && a.role == 'salariedEmployee');
    }
  }
}
```

---

## 🧮 معادلات التسعير المُحدّثة

### معادلات التسعير:

> 🔗 **مرجع معادلات التسعير النهائية:**  
> راجع الملف الرسمي: [`documentation/01-requirements/00-requirements-v2.0.md`](../01-requirements/00-requirements-v2.0.md#معادلات-التسعير-النهائية-المحسومة)  
> 
> جميع المعادلات والقيم المعتمدة موثقة بالتفصيل في ملف المتطلبات.

---

## 📋 مثال كامل لحساب السعر

```javascript
// مشروع: فلات لاي (BasePrice = 10,000 IQD)
// معالجة كاملة (1.3) + خبرة متوسطة (1.1) + معدات ذهبية (1.1) + عادي (1.0) + استوديو (+0)
// معدات خاصة (1.0)

BaseCreatorPrice = 10000 × 1.0 × 1.3 × 1.1 × 1.1 = 15,730 IQD
CreatorPrice = 15730 × 1.0 + 0 = 15,730 IQD
ClientPrice = 15730 + (15730 × 30%) = 20,449 IQD
```

---

**آخر تحديث:** 2025-08-23  
**الحالة:** مطابق 100% للمتطلبات V2.0 ✅
