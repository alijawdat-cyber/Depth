# 🎨 نظام المبدعين الفريلانسرز - Depth API v2.0

> مصطلحات هذا المستند:
> - واجهة برمجة التطبيقات: Application Programming Interface — API
> - التحكم بالوصول المعتمد على الأدوار: Role-Based Access Control — RBAC
> - رمز ويب بصيغة JSON: JSON Web Token — JWT
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

# 🎨 نظام المبدعين الفريلانسرز - Depth API v2.0

**المبدع الفريلانسر** هو مُنشئ محتوى مستقل يعمل ضمن سياسة تسعير فيها هامش وكالة موحّد، يملك معداته الخاصة أو يستخدم معدات الوكالة.

### التكامل مع الأنظمة الأخرى:
- 🔗 **إدارة المشاريع**: راجع ملف [`03-projects.md`](./03-projects.md) لاستلام وتنفيذ المشاريع
- 🔗 **نظام التسعير**: راجع ملف [`04-pricing.md`](./04-pricing.md) لفهم حساب الأسعار وهامش الوكالة
- 🔗 **الموظفون براتب ثابت**: راجع ملف [`08-salaried-employees.md`](./08-salaried-employees.md) للمقارنة
- 🔗 **زرع البيانات الأساسية**: راجع ملف [`../admin/03-seeds-management.md`](../admin/03-seeds-management.md) للفئات والأسعار الأساسية

---

## المحتويات
- [الحصول على ملف المبدع](#الحصول-على-ملف-المبدع)
- [تسجيل مبدع جديد (Onboarding)](#تسجيل-مبدع-جديد-onboarding)
- [تحديث ملف المبدع](#تحديث-ملف-المبدع)
- [إدارة معدات المبدع](#إدارة-معدات-المبدع)
- [إدارة التوفر](#إدارة-التوفر)
- [مشاريع المبدع](#مشاريع-المبدع)
- [إحصائيات المبدع](#إحصائيات-المبدع)

---

## الحصول على ملف المبدع

### `GET /creators/{creatorId}`
جلب معلومات مبدع محدد.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creator": {
      "id": "c_123abc",
      "userId": "u_123abc",
      "name": "أحمد محمد الربيعي",
      "email": "ahmed@example.com",
      "phone": "07719956000",
      "avatar": "https://cdn.cloudflare.com/avatars/creator_123abc.jpg",
      "specializations": ["photography", "videography"],
      "categories": ["photo", "video"],
      "subcategories": ["flatlay", "food", "reels_30s"],
      "experience": "experienced",
      "equipmentTier": "gold",
      "availability": {
        "saturday": [
          {"from": "09:00", "to": "13:00"},
          {"from": "16:00", "to": "20:00"}
        ],
        "sunday": [{"from": "10:00", "to": "18:00"}],
        "monday": [],
        "tuesday": [{"from": "14:00", "to": "18:00"}],
        "wednesday": [{"from": "09:00", "to": "17:00"}],
        "thursday": [{"from": "10:00", "to": "16:00"}],
        "friday": [],
        "flags": {
          "rushAvailable": true,
          "travelAvailable": true,
          "studioAvailable": true
        }
      },
      "equipment": [
        {
          "id": "eq_456def",
          "type": "camera",
          "brand": "Canon",
          "model": "R6",
          "status": "excellent",
          "isApproved": true,
          "addedAt": "2025-06-15T10:30:00.000Z"
        },
        {
          "id": "eq_789ghi", 
          "type": "lens",
          "brand": "Canon",
          "model": "24-70mm f/2.8",
          "status": "good",
          "isApproved": true,
          "addedAt": "2025-06-15T10:35:00.000Z"
        }
      ],
      "rating": {
        "average": 4.8,
        "totalReviews": 47,
        "breakdown": {
          "5": 35,
          "4": 8,
          "3": 3,
          "2": 1,
          "1": 0
        }
      },
      "stats": {
        "completedProjects": 47,
        "activeProjects": 3,
        "totalEarnings": 2850000,
        "monthlyEarnings": 680000,
        "averageDeliveryTime": "2.3 أيام"
      },
      "isApproved": true,
      "approvedBy": "admin@depth-agency.com",
      "approvedAt": "2025-08-20T10:15:00.000Z",
      "createdAt": "2025-08-15T09:30:00.000Z",
      "updatedAt": "2025-08-21T14:20:00.000Z"
    }
  }
}
```

---

## تسجيل مبدع جديد (Onboarding)

### `POST /creators/onboarding/step-1`
المرحلة الأولى: المعلومات الأساسية.

**الطلب:**
```json
{
  "name": "أحمد محمد الربيعي",
  "email": "ahmed.creator@gmail.com",
  "phone": "07719956000",
  "location": {
    "governorate": "بغداد",
    "area": "الكرادة"
  },
  "primarySpecialization": "photographer",
  "experienceYears": 4,
  "experienceLevel": "experienced" // fresh | experienced | expert
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creatorId": "c_new123",
    "currentStep": 1,
    "nextStep": "categories_selection",
    "profile": {
      "completionPercentage": 20,
      "stepsCompleted": ["basic_info"],
      "stepsRemaining": ["categories", "equipment", "availability", "review"]
    }
  },
  "message": "تم حفظ المعلومات الأساسية"
}
```

### `POST /creators/onboarding/step-2`
المرحلة الثانية: اختيار الفئات والمهارات.

**الطلب:**
```json
{
  "creatorId": "c_new123",
  "categories": ["photo", "video"],
  "subcategories": [
    {
      "subcategoryId": "sub_flatlay",
      "processingLevel": "full_retouch",
      "skillLevel": 85
    },
    {
      "subcategoryId": "sub_food",
      "processingLevel": "color_correction",
      "skillLevel": 90
    },
    {
      "subcategoryId": "sub_reels_30s",
      "processingLevel": "basic",
      "skillLevel": 75
    }
  ],
  "preferredIndustries": ["restaurants", "fashion", "hotels"]
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creatorId": "c_new123",
    "currentStep": 2,
    "nextStep": "equipment_setup",
    "profile": {
      "completionPercentage": 40,
      "estimatedPricing": {
        "note": "الأسعار التقديرية - ستُحدد نهائياً بعد الموافقة",
        "priceRange": "10,000 - 45,000 IQD per project"
      }
    }
  }
}
```

### `POST /creators/onboarding/step-3`
المرحلة الثالثة: إدارة المعدات.

**الطلب:**
```json
{
  "creatorId": "c_new123",
  "hasEquipment": true,
  "equipment": [
    {
      "type": "camera",
      "brand": "Canon",
      "model": "R6",
      "status": "excellent",
      "purchaseDate": "2023-01-15",
      "serialNumber": "optional_serial"
    },
    {
      "type": "lens",
      "brand": "Canon",
      "model": "24-70mm f/2.8",
      "status": "good"
    }
  ],
  "newEquipment": [
    {
      "type": "lighting",
      "brand": "Godox",
      "model": "V1",
      "description": "فلاش احترافي للاستوديو",
      "needsApproval": true
    }
  ]
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creatorId": "c_new123",
    "currentStep": 3,
    "nextStep": "availability_setup",
    "equipment": {
      "approved": [
        {
          "id": "eq_001",
          "type": "camera",
          "brand": "Canon",
          "model": "R6",
          "isApproved": true
        }
      ],
      "pendingApproval": [
        {
          "id": "eq_pending_001",
          "type": "lighting",
          "brand": "Godox",
          "model": "V1",
          "isApproved": false,
          "note": "تحت المراجعة"
        }
      ],
      "calculatedTier": "gold",
      "tierModifier": 1.1
    },
    "profile": {
      "completionPercentage": 60
    }
  }
}
```

### `POST /creators/onboarding/step-4`
المرحلة الرابعة: جدولة التوفر.

**الطلب:**
```json
{
  "creatorId": "c_new123",
  "availability": {
    "saturday": [
      {"from": "09:00", "to": "13:00"},
      {"from": "16:00", "to": "20:00"}
    ],
    "sunday": [{"from": "10:00", "to": "18:00"}],
    "monday": [],
    "tuesday": [{"from": "14:00", "to": "18:00"}],
    "wednesday": [{"from": "09:00", "to": "17:00"}],
    "thursday": [{"from": "10:00", "to": "16:00"}],
    "friday": []
  },
  "flags": {
    "rushAvailable": true,
    "travelAvailable": true,
    "studioAvailable": true
  },
  "notes": "متاح للمشاريع المستعجلة مع إشعار مسبق 24 ساعة"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creatorId": "c_new123",
    "currentStep": 4,
    "nextStep": "final_review",
    "availability": {
      "totalHoursPerWeek": 32,
      "peakDays": ["saturday", "wednesday"],
      "rushCapability": "متاح",
      "travelCapability": "متاح"
    },
    "profile": {
      "completionPercentage": 80
    }
  }
}
```

### `POST /creators/onboarding/step-5`
المرحلة الخامسة: المراجعة النهائية والإرسال.

**الطلب:**
```json
{
  "creatorId": "c_new123",
  "portfolioSamples": [
    {
      "fileId": "file_sample_001",
      "title": "تصوير منتجات مطعم",
      "description": "عينة من أعمالي في تصوير الطعام",
      "category": "food_photography"
    }
  ],
  "agreeToTerms": true,
  "agreeToPricingPolicy": true,
  "finalNotes": "أتطلع للعمل مع فريق Depth"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "creatorId": "c_new123",
    "status": "pending_approval",
    "submittedAt": "2025-08-21T15:00:00.000Z",
    "estimatedReviewTime": "24-48 ساعة",
    "profile": {
      "completionPercentage": 100,
      "allStepsCompleted": true
    },
    "nextSteps": [
      "انتظار مراجعة الأدمن",
      "التحقق من المعدات",
      "الموافقة النهائية"
    ]
  },
  "message": "تم إرسال طلب الانضمام بنجاح! سيتم مراجعته خلال 48 ساعة."
}
```

---

## تحديث ملف المبدع

### `PUT /creators/{creatorId}/profile`
تحديث معلومات ملف المبدع.

**الطلب:**
```json
{
  "name": "أحمد محمد الربيعي المحدث",
  "phone": "07719956001",
  "location": {
    "governorate": "بغداد",
    "area": "المنصور"
  },
  "specializations": ["photography", "videography", "editing"],
  "bio": "مصور محترف متخصص في التصوير التجاري والمنتجات"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creator": {
      "id": "c_123abc",
      "updatedFields": ["name", "phone", "location", "specializations", "bio"],
      "updatedAt": "2025-08-21T15:10:00.000Z"
    }
  },
  "message": "تم تحديث ملف المبدع بنجاح"
}
```

---

## إدارة معدات المبدع

### `GET /creators/{creatorId}/equipment`
جلب قائمة معدات المبدع.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "equipment": [
      {
        "id": "eq_001",
        "type": "camera",
        "brand": "Canon",
        "model": "R6",
        "status": "excellent",
        "purchaseDate": "2023-01-15",
        "isApproved": true,
        "approvedBy": "admin@depth-agency.com",
        "approvedAt": "2025-08-20T10:00:00.000Z"
      },
      {
        "id": "eq_002",
        "type": "lens",
        "brand": "Canon",
        "model": "24-70mm f/2.8",
        "status": "good",
        "isApproved": true
      }
    ],
    "pendingEquipment": [
      {
        "id": "eq_pending_001",
        "type": "lighting",
        "brand": "Godox",
        "model": "V1",
        "status": "needs_approval",
        "submittedAt": "2025-08-21T14:00:00.000Z"
      }
    ],
    "equipmentTier": {
      "current": "gold",
      "modifier": 1.1,
      "description": "معدات متوسطة الجودة"
    }
  }
}
```

### `POST /creators/{creatorId}/equipment`
إضافة معدة جديدة.

**الطلب:**
```json
{
  "type": "microphone",
  "brand": "Rode",
  "model": "VideoMic Pro Plus",
  "status": "excellent",
  "purchaseDate": "2025-01-10",
  "description": "ميكروفون احترافي للفيديو",
  "serialNumber": "RVP2025001"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "equipment": {
      "id": "eq_new_001",
      "type": "microphone",
      "brand": "Rode",
      "model": "VideoMic Pro Plus",
      "status": "needs_approval",
      "submittedAt": "2025-08-21T15:15:00.000Z",
      "estimatedApprovalTime": "24-48 ساعة"
    }
  },
  "message": "تم إرسال المعدة للمراجعة"
}
```

### `PUT /creators/{creatorId}/equipment/{equipmentId}`
تحديث معلومات معدة.

**الطلب:**
```json
{
  "status": "good",
  "notes": "تحتاج صيانة بسيطة"
}
```

### `DELETE /creators/{creatorId}/equipment/{equipmentId}`
حذف معدة (أرشفة).

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "message": "تم حذف المعدة بنجاح"
}
```

---

## إدارة التوفر

### `GET /creators/{creatorId}/availability`
جلب جدول توفر المبدع.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "availability": {
      "weekly": {
        "saturday": [
          {"from": "09:00", "to": "13:00", "isBooked": false},
          {"from": "16:00", "to": "20:00", "isBooked": true}
        ],
        "sunday": [{"from": "10:00", "to": "18:00", "isBooked": false}],
        "monday": [],
        "tuesday": [{"from": "14:00", "to": "18:00", "isBooked": false}],
        "wednesday": [{"from": "09:00", "to": "17:00", "isBooked": false}],
        "thursday": [{"from": "10:00", "to": "16:00", "isBooked": false}],
        "friday": []
      },
      "flags": {
        "rushAvailable": true,
        "travelAvailable": true,
        "studioAvailable": true
      },
      "upcomingBookings": [
        {
          "projectId": "p_123",
          "clientName": "مطعم الشام",
          "date": "2025-08-22",
          "time": "16:00-20:00",
          "type": "photo_shoot"
        }
      ],
      "stats": {
        "totalHoursPerWeek": 32,
        "bookedHoursThisWeek": 8,
        "availableHoursThisWeek": 24,
        "utilizationRate": "25%"
      }
    }
  }
}
```

### `PUT /creators/{creatorId}/availability`
تحديث جدول التوفر.

**الطلب:**
```json
{
  "availability": {
    "saturday": [
      {"from": "08:00", "to": "12:00"},
      {"from": "15:00", "to": "19:00"}
    ],
    "sunday": [{"from": "09:00", "to": "17:00"}],
    "monday": [],
    "tuesday": [{"from": "13:00", "to": "18:00"}],
    "wednesday": [{"from": "09:00", "to": "17:00"}],
    "thursday": [{"from": "10:00", "to": "16:00"}],
    "friday": []
  },
  "flags": {
    "rushAvailable": true,
    "travelAvailable": false,
    "studioAvailable": true
  },
  "notes": "غير متاح للسفر خلال الشهر الحالي"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "availability": {
      "updated": true,
      "totalHoursPerWeek": 30,
      "changesApplied": [
        "تم تحديث ساعات السبت",
        "تم إيقاف إمكانية السفر"
      ]
    }
  },
  "message": "تم تحديث جدول التوفر بنجاح"
}
```

---

## مشاريع المبدع

### `GET /creators/{creatorId}/projects`
جلب مشاريع المبدع مع التصفية.

**معاملات الاستعلام:**
- `status`: active|completed|pending|cancelled
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد العناصر (افتراضي: 20)
- `sortBy`: createdAt|deadline|clientName
- `sortOrder`: asc|desc

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "p_123abc",
        "clientName": "مطعم الشام",
        "clientLogo": "https://cdn.cloudflare.com/logos/client_123.jpg",
        "title": "تصوير منتجات المطعم",
        "category": "photo",
        "subcategory": "food",
        "status": "active",
        "creatorPrice": 15730,
        "clientPrice": 20449,
        "deliveryDate": "2025-08-25",
        "location": "client",
        "isRush": false,
        "progress": {
          "percentage": 65,
          "currentPhase": "shooting",
          "nextDeadline": "2025-08-23T14:00:00.000Z"
        },
        "files": {
          "delivered": 12,
          "remaining": 8,
          "approved": 10
        },
        "createdAt": "2025-08-20T09:00:00.000Z"
      }
    ],
    "summary": {
      "active": 3,
      "completed": 47,
      "pending": 1,
      "totalEarnings": 2850000,
      "monthlyEarnings": 680000
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 51,
    "pages": 3
  }
}
```

### التعيين والفلترة (After)

- لا يتم تغيير subcategory الأصلية عند تحويل الطلب إلى مشروع.
- فلترة المرشحين تعتمد على creatorSubcategories(subcategoryId) + capabilities(processingLevel).
- عند رفض المبدع: النظام يعيد الترشيح تلقائياً ويبلغ الأدمن بإشعار.

---

## إحصائيات المبدع

### `GET /creators/{creatorId}/stats`
جلب إحصائيات مفصلة للمبدع.

**معاملات الاستعلام:**
- `period`: week|month|quarter|year
- `startDate`: تاريخ البداية (YYYY-MM-DD)
- `endDate`: تاريخ النهاية (YYYY-MM-DD)

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "startDate": "2025-08-01",
    "endDate": "2025-08-31",
    "financial": {
      "totalEarnings": 680000,
      "projectsCompleted": 8,
      "averageProjectValue": 85000,
      "pendingPayments": 145000,
      "nextPaymentDate": "2025-09-01"
    },
    "performance": {
      "averageDeliveryTime": "2.3 أيام",
      "onTimeDeliveryRate": "95%",
      "clientSatisfactionRate": "4.8/5",
      "reworkRequestRate": "5%",
      "responseTime": "2 ساعات"
    },
    "productivity": {
      "hoursWorked": 124,
      "projectsStarted": 9,
      "projectsCompleted": 8,
      "utilizationRate": "78%",
      "peakWorkingDays": ["wednesday", "saturday"]
    },
    "growth": {
      "earningsGrowth": "+12%",
      "projectsGrowth": "+8%",
      "ratingImprovement": "+0.2",
      "skillsImproved": ["videography", "advanced_editing"]
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [المصادقة والأمان](../core/01-authentication.md)
- [إدارة المشاريع](./03-projects.md)
- [نظام التسعير](./04-pricing.md)
- [رفع الملفات](./05-storage.md)
- [نظام الإشعارات](./06-notifications.md)
- [رموز الأخطاء](../core/04-error-handling.md)
