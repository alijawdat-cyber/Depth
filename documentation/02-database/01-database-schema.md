# 📊 مخطط قاعدة البيانات والنماذج

> SSOT — مصدر الحقيقة الوحيد (التعدادات والمعادلات المرجعية):
> - documentation/99-reference/02-enums-standard.md
> - documentation/01-requirements/00-requirements-v2.0.md
> ملاحظة: يحتوي هذا الملف على أمثلة توضيحية؛ قد تتضمن عينات قديمة. عند التعارض تُعتمد قيم SSOT. سيتم مواءمة الأمثلة بالكامل في تمرير لاحق.

## نظرة عامة
تصف هذه الوثيقة مخطط قاعدة البيانات الكامل لمنصة Depth باستخدام Firestore.

## هيكل المجموعات

### مجموعة المستخدمين
```javascript
// Collection: users
{
  uid: string,                    // Firebase Auth UID
  email: string,
  displayName: string,
  phoneNumber: string,
  photoURL: string,
  role: 'creator' | 'client' | 'admin' | 'salariedEmployee',
  status: 'active' | 'inactive' | 'suspended',
  
  // معلومات الملف الشخصي
  profile: {
    firstName: string,
    lastName: string,
    dateOfBirth: timestamp,
    gender: 'male' | 'female' | 'other',
    nationality: string,
    languages: string[],
    bio: string,
    
    // الموقع الجغرافي
    location: {
      country: string,
      city: string,
      zone: string,              // المنطقة الجغرافية للتسعير
      coordinates: geopoint
    }
  },
  
  // التواريخ
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp
}
```

### مجموعة المبدعين
```javascript
// Collection: creators
{
  userId: string,                 // مرجع لمجموعة المستخدمين
  creatorId: string,             // معرف المبدع المولد تلقائياً
  
  // حالة التأهيل
  onboardingStatus: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected',
  onboardingStep: number,        // الخطوة الحالية (1-5)
  approvalStatus: 'pending' | 'approved' | 'rejected',
  
  // المعلومات المهنية
  professionalInfo: {
    experienceLevel: 'beginner' | 'intermediate' | 'professional' | 'expert',
    yearsOfExperience: number,
    portfolio: {
      website: string,
      instagram: string,
      behance: string,
      youtube: string,
      other: string[]
    },
    
    // الشهادات والمؤهلات
    certifications: [{
      name: string,
      issuedBy: string,
      issuedDate: timestamp,
      expiryDate: timestamp,
      certificateUrl: string
    }]
  },
  
  // الفئات والفئات الفرعية
  categories: [{
    categoryId: string,
    categoryName: string,
    subcategories: [{
      subcategoryId: string,
      subcategoryName: string,
      processingLevels: ['basic' | 'standard' | 'premium'][]
    }]
  }],
  
  // Equipment
  equipment: {
    cameras: string[],
    lenses: string[],
    lighting: string[],
    audio: string[],
    other: string[]
  },
  
  // Availability
  availability: {
    timezone: string,
    workingHours: {
      start: string,             // "09:00"
      end: string               // "18:00"
    },
    workingDays: string[],       // ["monday", "tuesday", ...]
    blockedDates: timestamp[],   // Unavailable dates
    maxProjectsPerMonth: number
  },
  
  // Financial
  financial: {
    bankDetails: {
      accountNumber: string,     // Encrypted
      iban: string,             // Encrypted
      bankName: string,
      swiftCode: string
    },
    taxInfo: {
      taxId: string,            // Encrypted
      vatNumber: string,        // Encrypted
      taxResidency: string
    }
  },
  
  // Statistics
  stats: {
    totalProjects: number,
    completedProjects: number,
    averageRating: number,
    totalEarnings: number,
    responseTime: number,       // Average in minutes
    onTimeDelivery: number      // Percentage
  },
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  approvedAt: timestamp
}
```

### مجموعة المشاريع
```javascript
// Collection: projects
{
  projectId: string,             // مولد تلقائياً
  clientId: string,              // مرجع للمستخدمين
  creatorId: string,             // مرجع للمبدعين (عند التعيين)
  
  // المعلومات الأساسية
  title: string,
  description: string,
  category: {
    categoryId: string,
    categoryName: string,
    subcategoryId: string,
    subcategoryName: string,
    processingLevel: 'basic' | 'standard' | 'premium'
  },
  
  // Location & Timing
  location: {
    type: 'onsite' | 'studio' | 'remote',
    address: string,
    city: string,
    coordinates: geopoint,
    travelRequired: boolean
  },
  
  timeline: {
    shootDate: timestamp,
    deliveryDate: timestamp,
    duration: number,            // in hours
    isRush: boolean             // Rush job (< 48h delivery)
  },
  
  // Requirements
  requirements: {
    equipmentNeeded: string[],
    specialInstructions: string,
    deliverables: string[],
    formats: string[],          // ["RAW", "JPEG", "MP4"]
    resolution: string,         // "4K", "HD", etc.
    copyright: 'client' | 'creator' | 'shared'
  },
  
  // Pricing
  pricing: {
    basePrice: number,
    modifiers: {
      experience: number,
      equipment: number,
      rush: number,
      location: number,
      travel: number
    },
    subtotal: number,
    agencyMargin: number,
    totalPrice: number,
    currency: string,           // "SAR", "USD"
    
    // Payment
    paymentTerms: '50_50' | '100_upfront' | '100_delivery',
    paymentStatus: 'pending' | 'partial' | 'completed'
  },
  
  // Status & Workflow
  status: 'draft' | 'quoted' | 'approved' | 'assigned' | 'in_progress' | 'delivered' | 'completed' | 'cancelled',
  
  // Assignment
  assignment: {
    assignedAt: timestamp,
    acceptedAt: timestamp,
    creatorResponse: 'pending' | 'accepted' | 'declined',
    reassignmentCount: number
  },
  
  // Delivery
  delivery: {
    deliveredAt: timestamp,
    approvalStatus: 'pending' | 'approved' | 'revision_requested',
    revisionCount: number,
    finalApprovalAt: timestamp
  },
  
  // Files & Gallery
  files: {
    brief: string[],            // URLs to brief files
    references: string[],       // Reference images/videos
    deliverables: string[],     // Final delivered files
    gallery: string[]           // Gallery/preview images
  },
  
  // Communication
  lastActivity: timestamp,
  
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp
}
```

### مجموعة الفئات
```javascript
// Collection: categories  
{
  categoryId: string,
  name: string,
  nameAr: string,
  description: string,
  icon: string,
  order: number,
  isActive: boolean,
  
  // البيانات الوصفية
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### مجموعة الفئات الفرعية
```javascript
// Collection: subcategories
{
  subcategoryId: string,
  categoryId: string,           // الفئة الرئيسية
  name: string,
  nameAr: string,
  description: string,
  
  // Processing levels available
  processingLevels: ['basic' | 'standard' | 'premium'][],
  
  // Base pricing per processing level
  basePricing: {
    basic: number,
    standard: number,
    premium: number
  },
  
  // Equipment requirements
  requiredEquipment: string[],
  recommendedEquipment: string[],
  
  // Metadata
  isActive: boolean,
  order: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Equipment Collection
```javascript
// Collection: equipment
{
  equipmentId: string,
  name: string,
  nameAr: string,
  category: 'camera' | 'lens' | 'lighting' | 'audio' | 'other',
  
  // Equipment details
  specifications: {
    brand: string,
    model: string,
    type: string,
    features: string[]
  },
  
  // Pricing impact
  tier: 'basic' | 'professional' | 'premium',
  priceModifier: number,        // Multiplier (0.8, 1.0, 1.2)
  
  // Status
  isActive: boolean,
  isApproved: boolean,
  
  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Notifications Collection
```javascript
// Collection: notifications
{
  notificationId: string,
  userId: string,               // Recipient
  
  // Content
  type: 'project_assigned' | 'project_completed' | 'payment_received' | 'system_update',
  title: string,
  titleAr: string,
  message: string,
  messageAr: string,
  
  // Metadata
  isRead: boolean,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  
  // Action
  actionType: 'none' | 'navigate' | 'external_link',
  actionData: any,              // Navigation or link data
  
  // Timestamps
  createdAt: timestamp,
  readAt: timestamp
}
```

## Indexes Required

### Firestore Composite Indexes
```javascript
// Projects indexes
projects:
  - clientId, status
  - creatorId, status
  - category.categoryId, status
  - status, createdAt (desc)
  - location.city, status

// Creators indexes
creators:
  - onboardingStatus, createdAt
  - approvalStatus, createdAt
  - categories.categoryId, approvalStatus

// Notifications indexes
notifications:
  - userId, isRead, createdAt (desc)
  - userId, type, createdAt (desc)
```

## Security Rules

### Basic Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Creators collection
    match /creators/{creatorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (request.auth.uid == resource.data.userId || 
                       isAdmin(request.auth.uid));
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.clientId ||
                      request.auth.uid == resource.data.creatorId ||
                      isAdmin(request.auth.uid));
      
      allow create: if request.auth != null && 
                       request.auth.uid == resource.data.clientId;
      
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.clientId ||
                        request.auth.uid == resource.data.creatorId ||
                        isAdmin(request.auth.uid));
    }
    
    // Helper functions
    function isAdmin(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role == 'admin';
    }
  }
}
```

## Migration Scripts

### Initial Data Migration
```javascript
// migration-001-initial-categories.js
const categories = [
  { name: "Photography", nameAr: "التصوير الفوتوغرافي" },
  { name: "Videography", nameAr: "التصوير المرئي" },
  { name: "Design", nameAr: "التصميم" },
  { name: "Content Creation", nameAr: "إنتاج المحتوى" }
];

async function migrateCategories() {
  for (const category of categories) {
    await db.collection('categories').add({
      ...category,
      categoryId: generateId(),
      isActive: true,
      order: categories.indexOf(category),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
```

This schema provides a solid foundation for the Depth platform with proper relationships, security, and scalability considerations.
