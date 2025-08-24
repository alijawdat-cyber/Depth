# 📊 مخطط قاعدة البيانات V2.0 - Firestore Collections

> 🔒 **SSOT — مصدر الحقيقة الوحيد:**
> - المتطلبات: `documentation/01-requirements/00-requirements-v2.0.md`
> - التعدادات والمعادلات: `documentation/99-reference/02-enums-standard.md`
> - قاموس البيانات: `documentation/02-database/00-data-dictionary.md`

**تاريخ الإنشاء:** 2025-08-23  
**النسخة:** V2.0 - مُحدث ومطابق للمتطلبات النهائية

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
  addedBy: string,                // userId of super_admin who added them (null for seeded admin)
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
  isSeeded: boolean,              // true للأدمن المزروع
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
  onboardingStatus: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected',
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
  taxId: string,
  
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
  industry: string,
  
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
  taxId: string,
  preferredLanguage: 'ar' | 'en',
  paymentTerms: 'advance_50' | 'advance_100' | 'net_30',
  
  // الإحصائيات
  totalSpent: number,             // بالدينار العراقي
  totalProjects: number,
  rating: number,                 // 0.0-5.0
  
  // التواريخ
  createdAt: timestamp,
  updatedAt: timestamp
}
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

### 10. مجموعة المشاريع (projects)
```javascript
{
  id: string,                     // معرف المشروع (PK)
  clientId: string,               // FK → clients
  categoryId: string,             // FK → categories
  subcategoryId: string,          // FK → subcategories (لا يتغير بعد التحويل من الطلب)

  // البنود والتعيينات (يدعم تعدد المبدعين/الأدوار)
  lineItems: [{
    subcategoryId: string,
    quantity: number,
    processingLevel: 'raw'|'basic'|'color_correction'|'full_retouch'|'advanced_composite',
    assignedCreators: string[]    // IDs لمبدعين متعددين
  }],
  assignments: [{
    role: 'shoot'|'edit'|'design',
    type: 'creator'|'salaried',
    assigneeId: string            // creatorId أو salariedEmployeeId
  }],

  // حالة المشروع
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled',
  isArchived: boolean,            // الأرشفة كفلاغ مستقل دون تغيير SSOT

  // التسعير (محسوب تلقائياً)
  basePrice: number,              // من subcategories
  experienceMod: number,          // معامل الخبرة
  equipmentMod: number,           // معامل المعدات
  ownershipFactor: number,        // 1.0 أو 0.9
  processingMod: number,          // معامل المعالجة
  rushMod: number,                // معامل الاستعجال
  locationAddition: number,       // إضافة الموقع الثابتة
  creatorPrice: number,           // السعر النهائي للمبدع
  agencyMarginPercent: number,    // نسبة هامش الوكالة (10%-50%)
  clientPrice: number,            // السعر النهائي للعميل

  // تفاصيل المشروع
  isRush: boolean,
  location: 'studio' | 'client' | 'outskirts' | 'nearby' | 'far',
  deliveryDate: date,
  notes: string,

  // الموافقة
  approvedBy: string,             // admin email
  approvedAt: timestamp,

  // التواريخ
  createdBy: string,              // admin email
  createdAt: timestamp,
  updatedAt: timestamp
}
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

## 🔍 الفهارس المطلوبة (Composite Indexes)

### الفهارس الأساسية:
```javascript
// Projects
projects: [
  ['clientId', 'status'],
  ['creatorId', 'status'],
  ['categoryId', 'status'],
  ['status', 'createdAt']
]

// Creators
creators: [
  ['onboardingStatus', 'createdAt'],
  ['experienceLevel', 'equipmentTier'],
  ['isAvailable', 'rating']
]

// CreatorSubcategories
creatorSubcategories: [
  ['creatorId', 'isActive'],
  ['subcategoryId', 'isActive']
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

// ProjectRequests
projectRequests: [
  ['status', 'createdAt'],
  ['clientId', 'status']
]

// Sessions
sessions: [
  ['userId', 'isActive', 'createdAt'],
  ['userId', 'createdAt']
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
    
    // Creators - قراءة عامة، كتابة للمبدع والأدمن
    match /creators/{creatorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (request.auth.uid == resource.data.userId || 
                       isAdmin(request.auth.uid));
    }
    
    // Clients - الوصول للعميل والأدمن فقط
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
                            (request.auth.uid == resource.data.userId || 
                             isAdmin(request.auth.uid));
    }
    
    // Projects - الوصول للأطراف المعنية فقط
    match /projects/{projectId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.clientId ||
                      request.auth.uid == resource.data.creatorId ||
                      isAdmin(request.auth.uid));
      
      allow create: if request.auth != null;
      
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.clientId ||
                        request.auth.uid == resource.data.creatorId ||
                        isAdmin(request.auth.uid));
    }
    
    // Admin-only collections
    match /{adminCollection}/{docId} {
      allow read, write: if request.auth != null && isAdmin(request.auth.uid);
      
      // Collections: categories, subcategories, processingModifiers, 
      // experienceModifiers, equipmentModifiers, rushModifiers, locationAdditions
    }
    
    // Helper functions
    function isAdmin(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'admin';
    }
    
    function isCreator(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'creator';
    }
    
    function isClient(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'client';
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
