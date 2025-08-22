
# 📋 إدارة المشاريع - Depth API v2.0

---

## المحتويات
- [إنشاء مشروع جديد](#إنشاء-مشروع-جديد)
- [تعيين المبدعين والموظفين](#تعيين-المبدعين-والموظفين)
- [متابعة التقدم](#متابعة-التقدم)
- [تسليم المشاريع](#تسليم-المشاريع)
- [النتائج والتقييم](#النتائج-والتقييم)

---

## إنشاء مشروع جديد

### `POST /projects`
إنشاء مشروع جديد من طلب معتمد.

**الطلب:**
```json
{
  "projectRequestId": "req_123abc",
  "clientId": "cl_123abc",
  "title": "تصوير منتجات المطعم - الدفعة الأولى",
  "description": "تصوير احترافي لـ 20 طبق من القائمة الجديدة",
  "category": "photo",
  "subcategory": "food",
  "assignedCreator": "c_789ghi",
  "pricing": {
    "totalAmount": 620000,
    "currency": "IQD",
    "breakdown": {
      "photography": 450000,
      "editing": 120000,
      "rush_fee": 0,
      "agency_fee": 50000
    },
    "paymentTerms": "صافي 15 يوم"
  },
  "timeline": {
    "startDate": "2025-08-28",
    "deliveryDate": "2025-09-01",
    "milestones": [
      {
        "name": "جلسة التصوير",
        "date": "2025-08-28",
        "deliverables": ["صور خام"]
      },
      {
        "name": "المعالجة والتعديل",
        "date": "2025-08-30",
        "deliverables": ["صور معدلة"]
      },
      {
        "name": "التسليم النهائي",
        "date": "2025-09-01",
        "deliverables": ["20 صورة عالية الجودة"]
      }
    ]
  },
  "requirements": {
    "deliverables": [
      "20 صورة عالية الجودة (4K)",
      "نسخ بأحجام مختلفة للوسائط الاجتماعية",
      "ملفات خام للتعديل المستقبلي"
    ],
    "style": "طبيعي ومشرق مع خلفية نظيفة",
    "location": "client",
    "equipment": ["camera", "lighting", "props"],
    "revisions": 2
  },
  "notes": "يُفضل التصوير في ساعات الصباح للاستفادة من الإضاءة الطبيعية"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "p_123abc",
      "title": "تصوير منتجات المطعم - الدفعة الأولى",
      "projectNumber": "DP-2025-0345",
      "status": "initiated",
      "phase": "planning",
      "client": {
        "id": "cl_123abc",
        "companyName": "مطعم الشام الأصيل",
        "contactName": "محمد أحمد السوري"
      },
      "creator": {
        "id": "c_789ghi",
        "name": "فاطمة الزهراء",
        "specialization": "Food Photography",
        "rating": 4.9
      },
      "timeline": {
        "startDate": "2025-08-28T09:00:00.000Z",
        "deliveryDate": "2025-09-01T18:00:00.000Z",
        "daysRemaining": 5
      },
      "budget": {
        "totalAmount": 620000,
        "currency": "IQD"
      },
      "createdAt": "2025-08-26T17:00:00.000Z",
      "createdBy": "admin@depth-agency.com"
    },
    "nextSteps": [
      "تأكيد التوقيتات مع المبدع",
      "ترتيب موعد الزيارة الأولية",
      "إعداد العقد النهائي"
    ]
  },
  "message": "تم إنشاء المشروع بنجاح! سيتم التواصل مع جميع الأطراف لتأكيد التفاصيل."
}
```

---

## تعيين المبدعين والموظفين

### `GET /projects/{projectId}/available-team`
البحث عن أعضاء الفريق المتاحين للمشروع (مبدعين + موظفين براتب ثابت).

**معاملات الاستعلام:**
- `category`: نوع الخدمة المطلوبة  
- `location`: الموقع الجغرافي
- `startDate`: تاريخ بداية المشروع
- `budget`: الميزانية المتاحة
- `teamType`: freelance|salaried|both (افتراضي: both)

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "availableFreelanceCreators": [
      {
        "id": "c_789ghi",
        "type": "freelance_creator",
        "name": "فاطمة الزهراء",
        "specialization": "Food Photography",
        "rating": 4.9,
        "completedProjects": 87,
        "location": {
          "governorate": "بغداد",
          "area": "الكرادة"
        },
        "availability": {
          "status": "available",
          "startDate": "2025-08-28",
          "endDate": "2025-09-05"
        },
        "equipment": {
          "camera": "Sony A7R IV",
          "lighting": "Professional Studio Setup",
          "additional": ["Props", "Backdrop", "Tripods"]
        },
        "pricing": {
          "baseRate": 450000,
          "currency": "IQD",
          "includes": ["تصوير احترافي", "معالجة أساسية", "نسختان للمراجعة"]
        },
        "portfolio": [
          {
            "projectId": "p_previous1",
            "images": ["https://cdn.cloudflare.com/portfolio/food1.jpg"],
            "clientType": "restaurant"
          }
        ],
        "matchScore": 95,
        "responseTime": "عادة خلال 2-4 ساعات",
        "reliability": "excellent"
      }
    ],
    "availableSalariedEmployees": [
      {
        "id": "se_123abc",
        "type": "salaried_employee", 
        "name": "سارة علي الحسن",
        "department": "photography",
        "jobTitle": "مصورة أولى",
        "specialization": "Product & Food Photography",
        "availability": {
          "status": "available",
          "workingHours": "09:00-17:00",
          "currentLoad": "30%" // نسبة الأعمال الحالية
        },
        "equipment": "agency_equipment", // يستخدم معدات الوكالة
        "experience": "5 سنوات خبرة",
        "matchScore": 88,
        "cost": "no_additional_cost", // لا توجد تكلفة إضافية (ضمن الراتب)
        "strengths": ["سرعة التنفيذ", "خبرة بالمنتجات الغذائية", "متاحة فوراً"]
      }
    ],
    "recommendation": {
      "suggested": "se_123abc",
      "reason": "متاحة فوراً وبدون تكلفة إضافية، مع خبرة ممتازة في تصوير الطعام"
    },
      {
        "id": "c_456def",
        "name": "أحمد محمد الربيعي",
        "specialization": "Commercial Photography",
        "rating": 4.7,
        "completedProjects": 124,
        "availability": {
          "status": "partially_available",
          "startDate": "2025-08-30",
          "notes": "متاح مع تعديل جدولة المشروع"
        },
        "matchScore": 82,
        "pricing": {
          "baseRate": 420000,
          "currency": "IQD"
        }
      }
    ],
    "searchCriteria": {
      "category": "photo",
      "location": "بغداد",
      "totalFound": 2,
      "filters": ["available", "high_rating", "relevant_experience"]
    }
  }
}
```

### `POST /projects/{projectId}/assign-creator`
تعيين مبدع فريلانسر للمشروع.

**الطلب:**
```json
{
  "creatorId": "c_789ghi",
  "contractTerms": {
    "startDate": "2025-08-28T09:00:00.000Z",
    "deliveryDate": "2025-09-01T18:00:00.000Z",
    "rate": 620000,
    "currency": "IQD",
    "paymentSchedule": "upon_completion", // deposit | milestone | upon_completion
    "revisions": 2,
    "cancellationPolicy": "standard"
  },
  "projectBrief": {
    "objectives": ["تصوير احترافي عالي الجودة", "إبراز جاذبية الأطباق"],
    "styleGuide": "طبيعي ومشرق مع ألوان زاهية",
    "referenceImages": ["ref1.jpg", "ref2.jpg"],
    "specialRequests": ["استخدام خلفية بيضاء نظيفة"]
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "asgn_123abc",
      "projectId": "p_123abc",
      "creatorId": "c_789ghi",
      "status": "pending_acceptance",
      "contractGenerated": true,
      "contractUrl": "https://contracts.depth-agency.com/c_789ghi_p_123abc.pdf"
    }
  },
  "message": "تم تعيين المبدع بنجاح! سيتم إرسال العقد للتوقيع."
}
```

### `POST /projects/{projectId}/assign-employee`
تعيين موظف براتب ثابت للمشروع.

**المصادقة:** Admin only

**الطلب:**
```json
{
  "employeeId": "se_123abc",
  "taskAssignment": {
    "startDate": "2025-08-28T09:00:00.000Z", 
    "targetCompletionDate": "2025-09-01T17:00:00.000Z",
    "priority": "normal", // low | normal | high | urgent
    "estimatedHours": 8,
    "workLocation": "studio" // studio | client_location | remote
  },
  "projectBrief": {
    "objectives": ["تصوير احترافي عالي الجودة", "إبراز جاذبية الأطباق"],
    "styleGuide": "طبيعي ومشرق مع ألوان زاهية", 
    "referenceImages": ["ref1.jpg", "ref2.jpg"],
    "specialInstructions": ["استخدام معدات الاستوديو", "التنسيق مع فريق التصميم"]
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "taskAssignment": {
      "id": "task_123abc",
      "projectId": "p_123abc", 
      "employeeId": "se_123abc",
      "status": "assigned",
      "priority": "normal",
      "cost": 0, // لا توجد تكلفة إضافية - ضمن الراتب
      "timeline": {
        "assignedAt": "2025-08-26T14:30:00.000Z",
        "targetCompletion": "2025-09-01T17:00:00.000Z"
      }
    }
  },
  "message": "تم تعيين الموظف للمهمة بنجاح! سيتم إشعاره فوراً."
}
    "restrictions": ["لا يُسمح بالتصوير في أوقات الذروة"]
  },
  "notes": "يرجى التنسيق مع مدير المطعم قبل الوصول"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "projectId": "p_123abc",
      "creatorId": "c_789ghi",
      "assignedAt": "2025-08-26T17:30:00.000Z",
      "contract": {
        "id": "contract_789xyz",
        "status": "sent_for_signature",
        "signDeadline": "2025-08-27T12:00:00.000Z"
      },
      "kickoffMeeting": {
        "scheduled": true,
        "datetime": "2025-08-27T14:00:00.000Z",
        "type": "video_call",
        "participants": ["client", "creator", "project_manager"]
      }
    },
    "project": {
      "id": "p_123abc",
      "status": "assigned",
      "phase": "pre_production"
    }
  },
  "message": "تم تعيين المبدع بنجاح! سيتم إرسال العقد للتوقيع."
}
```

---

## متابعة التقدم

### `GET /projects/{projectId}/status`
جلب حالة المشروع والتقدم الحالي.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "p_123abc",
      "title": "تصوير منتجات المطعم - الدفعة الأولى",
      "status": "in_progress",
      "phase": "production",
      "progress": {
        "percentage": 65,
        "currentMilestone": "المعالجة والتعديل",
        "nextMilestone": "التسليم النهائي",
        "overallHealth": "on_track" // on_track | at_risk | delayed
      },
      "timeline": {
        "startDate": "2025-08-28T09:00:00.000Z",
        "deliveryDate": "2025-09-01T18:00:00.000Z",
        "actualStartDate": "2025-08-28T09:30:00.000Z",
        "daysRemaining": 2,
        "bufferTime": "6 ساعات"
      },
      "milestones": [
        {
          "id": "ms_1",
          "name": "جلسة التصوير",
          "status": "completed",
          "scheduledDate": "2025-08-28T09:00:00.000Z",
          "completedDate": "2025-08-28T16:30:00.000Z",
          "deliverables": [
            {
              "name": "صور خام",
              "status": "delivered",
              "count": "142 صورة"
            }
          ]
        },
        {
          "id": "ms_2",
          "name": "المعالجة والتعديل",
          "status": "in_progress",
          "scheduledDate": "2025-08-30T12:00:00.000Z",
          "progress": 70,
          "deliverables": [
            {
              "name": "صور معدلة",
              "status": "in_progress",
              "completed": 14,
              "total": 20
            }
          ]
        },
        {
          "id": "ms_3",
          "name": "التسليم النهائي",
          "status": "pending",
          "scheduledDate": "2025-09-01T18:00:00.000Z",
          "deliverables": [
            {
              "name": "20 صورة عالية الجودة",
              "status": "pending"
            }
          ]
        }
      ],
      "team": {
        "creator": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "lastActive": "2025-08-30T14:00:00.000Z",
          "status": "active"
        },
        "projectManager": {
          "id": "pm_123",
          "name": "علي الدوسري",
          "lastUpdate": "2025-08-30T12:00:00.000Z"
        }
      },
      "recentActivity": [
        {
          "timestamp": "2025-08-30T14:00:00.000Z",
          "action": "milestone_progress",
          "description": "تم الانتهاء من معالجة 14 صورة من أصل 20",
          "by": "c_789ghi"
        },
        {
          "timestamp": "2025-08-29T16:30:00.000Z",
          "action": "client_feedback",
          "description": "طلب تعديلات طفيفة على 3 صور",
          "by": "cl_123abc"
        }
      ]
    }
  }
}
```

### `GET /projects/{projectId}/updates`
جلب تحديثات المشروع والتطورات.

**معاملات الاستعلام:**
- `since`: تاريخ آخر تحديث
- `type`: photo|milestone|comment|file
- `limit`: عدد التحديثات

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "updates": [
      {
        "id": "update_123",
        "type": "milestone_completed",
        "timestamp": "2025-08-28T16:30:00.000Z",
        "title": "تم إنجاز جلسة التصوير",
        "description": "تم تصوير جميع الأطباق بنجاح - 142 صورة",
        "author": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "role": "creator"
        },
        "attachments": [
          {
            "type": "preview_images",
            "count": 10,
            "thumbnails": ["thumb1.jpg", "thumb2.jpg"],
            "viewUrl": "https://gallery.depth-agency.com/preview/p_123abc"
          }
        ],
        "milestone": {
          "id": "ms_1",
          "name": "جلسة التصوير",
          "completionTime": "7.5 ساعات"
        }
      },
      {
        "id": "update_124",
        "type": "client_feedback",
        "timestamp": "2025-08-29T10:15:00.000Z",
        "title": "تعليقات العميل على الصور الأولية",
        "description": "العميل راضٍ عن الجودة ويطلب تعديلات طفيفة",
        "author": {
          "id": "cl_123abc",
          "name": "محمد أحمد السوري",
          "role": "client"
        },
        "feedback": {
          "overallRating": 4.8,
          "requestedChanges": [
            "زيادة الإضاءة على الطبق رقم 7",
            "تحسين زاوية التصوير للطبق رقم 12",
            "إضافة المزيد من العمق للطبق رقم 18"
          ],
          "approvedImages": 17,
          "changesRequested": 3
        }
      }
    ],
    "summary": {
      "totalUpdates": 8,
      "lastUpdate": "2025-08-30T14:00:00.000Z",
      "unreadCount": 2
    }
  }
}
```

### `POST /projects/{projectId}/updates`
إضافة تحديث جديد للمشروع.

**الطلب:**
```json
{
  "type": "progress_update", // progress_update | issue | milestone | delivery
  "title": "تحديث على عملية المعالجة",
  "description": "تم الانتهاء من معالجة 18 من أصل 20 صورة. النتائج ممتازة والعميل سيكون راضياً.",
  "attachments": [
    {
      "type": "preview",
      "files": ["preview_batch2.jpg", "preview_batch3.jpg"]
    }
  ],
  "milestoneProgress": {
    "milestoneId": "ms_2",
    "percentage": 90,
    "notes": "متقدمون أكثر من الجدول المحدد"
  },
  "estimatedCompletion": "2025-08-31T16:00:00.000Z",
  "nextSteps": [
    "إنهاء معالجة الصورتين الأخيرتين",
    "مراجعة نهائية للجودة",
    "تحضير الحزمة للتسليم"
  ]
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "update": {
      "id": "update_125",
      "timestamp": "2025-08-30T15:00:00.000Z",
      "notified": ["client", "project_manager", "admin"],
      "visibility": "all_stakeholders"
    }
  },
  "message": "تم إضافة التحديث بنجاح وإشعار جميع الأطراف المعنية"
}
```

---

## تسليم المشاريع

### `POST /projects/{projectId}/deliveries`
رفع وتسليم نتائج المشروع.

**الطلب:**
```json
{
  "milestoneId": "ms_3",
  "deliverables": [
    {
      "name": "الصور النهائية عالية الجودة",
      "description": "20 صورة معدلة احترافياً بدقة 4K",
      "files": [
        {
          "name": "dish_001_final.jpg",
          "size": "12.5 MB",
          "format": "JPEG",
          "resolution": "4000x3000",
          "uploadId": "file_123abc"
        },
        {
          "name": "dish_002_final.jpg",
          "size": "11.8 MB",
          "format": "JPEG",
          "resolution": "4000x3000",
          "uploadId": "file_456def"
        }
      ],
      "downloadPackage": "final_images_package.zip"
    },
    {
      "name": "نسخ للوسائط الاجتماعية",
      "description": "نفس الصور بأحجام مختلفة للفيسبوك وانستقرام",
      "files": [
        {
          "name": "social_media_formats.zip",
          "size": "45.2 MB",
          "uploadId": "file_789ghi"
        }
      ]
    },
    {
      "name": "الملفات الخام",
      "description": "صور RAW للتعديل المستقبلي",
      "files": [
        {
          "name": "raw_files_backup.zip",
          "size": "1.2 GB",
          "uploadId": "file_101112"
        }
      ]
    }
  ],
  "completionNotes": "تم إنجاز المشروع وفقاً للمواصفات المطلوبة مع تحسينات إضافية على الإضاءة والألوان",
  "clientInstructions": "جميع الصور جاهزة للاستخدام. الملفات مرتبة حسب نوع الطبق ومرقمة للسهولة",
  "usageRights": {
    "commercialUse": true,
    "duration": "غير محدود",
    "modifications": "مسموح بتعديلات طفيفة",
    "attribution": "غير مطلوب"
  },
  "requestClientReview": true
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "delivery": {
      "id": "delivery_123abc",
      "projectId": "p_123abc",
      "milestoneId": "ms_3",
      "status": "submitted",
      "submittedAt": "2025-09-01T16:00:00.000Z",
      "totalFiles": 22,
      "totalSize": "1.3 GB",
      "downloadLinks": {
        "finalImages": "https://cdn.depth-agency.com/downloads/p_123abc/final_images.zip",
        "socialMedia": "https://cdn.depth-agency.com/downloads/p_123abc/social_formats.zip",
        "rawFiles": "https://cdn.depth-agency.com/downloads/p_123abc/raw_backup.zip"
      },
      "expiryDate": "2025-12-01T00:00:00.000Z", // روابط التحميل صالحة لـ 3 أشهر
      "clientReview": {
        "requested": true,
        "deadline": "2025-09-08T00:00:00.000Z",
        "status": "pending"
      }
    },
    "project": {
      "id": "p_123abc",
      "status": "delivered",
      "phase": "client_review"
    },
    "nextSteps": [
      "انتظار مراجعة العميل",
      "معالجة أي تعديلات مطلوبة",
      "الموافقة النهائية والدفع"
    ]
  },
  "message": "تم تسليم المشروع بنجاح! سيتم إشعار العميل للمراجعة."
}
```

### `GET /projects/{projectId}/deliveries/{deliveryId}`
جلب تفاصيل تسليم محدد.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "delivery": {
      "id": "delivery_123abc",
      "projectId": "p_123abc",
      "milestone": {
        "id": "ms_3",
        "name": "التسليم النهائي"
      },
      "status": "approved",
      "submittedAt": "2025-09-01T16:00:00.000Z",
      "reviewedAt": "2025-09-03T14:30:00.000Z",
      "deliverables": [
        {
          "name": "الصور النهائية عالية الجودة",
          "fileCount": 20,
          "totalSize": "230 MB",
          "downloadUrl": "https://cdn.depth-agency.com/downloads/p_123abc/final_images.zip",
          "downloadStats": {
            "downloads": 3,
            "lastDownload": "2025-09-03T15:00:00.000Z"
          }
        }
      ],
      "clientFeedback": {
        "rating": 5,
        "comments": "نتائج ممتازة وتفوق التوقعات! الجودة عالية جداً والألوان رائعة.",
        "approved": true,
        "submittedAt": "2025-09-03T14:30:00.000Z"
      },
      "creatorNotes": "شكراً للثقة. كان من الممتع العمل مع فريق المطعم المتعاون.",
      "usageRights": {
        "commercialUse": true,
        "duration": "غير محدود",
        "modifications": "مسموح بتعديلات طفيفة"
      }
    }
  }
}
```

---

## النتائج والتقييم

### `POST /projects/{projectId}/review`
تقييم ومراجعة المشروع من قبل العميل.

**الطلب:**
```json
{
  "deliveryId": "delivery_123abc",
  "overallRating": 5,
  "aspectRatings": {
    "quality": 5,
    "timeliness": 5,
    "communication": 4,
    "professionalism": 5,
    "valueForMoney": 4
  },
  "feedback": {
    "positives": [
      "جودة عالية جداً تفوق التوقعات",
      "الالتزام بالمواعيد المحددة",
      "الاهتمام بالتفاصيل الدقيقة",
      "سهولة التعامل والتواصل"
    ],
    "improvements": [
      "يمكن تحسين السرعة في الرد على الرسائل"
    ],
    "testimonial": "فاطمة مصورة محترفة جداً. النتائج فاقت توقعاتي بكثير والصور ساعدت في زيادة مبيعات المطعم بشكل ملحوظ. أنصح بالتعامل معها."
  },
  "wouldRecommend": true,
  "willingToProvideReference": true,
  "futureCollaboration": "very_likely", // very_likely | likely | maybe | unlikely
  "approved": true,
  "requestChanges": false
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "review_123abc",
      "projectId": "p_123abc",
      "rating": 5,
      "submittedAt": "2025-09-03T14:30:00.000Z",
      "status": "published"
    },
    "project": {
      "id": "p_123abc",
      "status": "completed",
      "phase": "closed",
      "completedAt": "2025-09-03T14:30:00.000Z"
    },
    "creator": {
      "id": "c_789ghi",
      "newRating": 4.91, // محدث بعد هذا التقييم
      "totalReviews": 88,
      "badgeEarned": "excellence_5star" // شارة للحصول على 5 نجوم
    },
    "invoice": {
      "id": "inv_123abc",
      "status": "ready_for_payment",
      "dueDate": "2025-09-18T00:00:00.000Z"
    }
  },
  "message": "شكراً لتقييمك! تم إغلاق المشروع بنجاح."
}
```

### `GET /projects/{projectId}/final-report`
تقرير نهائي شامل للمشروع.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "report": {
      "project": {
        "id": "p_123abc",
        "title": "تصوير منتجات المطعم - الدفعة الأولى",
        "duration": "5 أيام",
        "status": "completed",
        "completedAt": "2025-09-03T14:30:00.000Z"
      },
      "timeline": {
        "planned": {
          "startDate": "2025-08-28T09:00:00.000Z",
          "endDate": "2025-09-01T18:00:00.000Z",
          "duration": "5 أيام"
        },
        "actual": {
          "startDate": "2025-08-28T09:30:00.000Z",
          "endDate": "2025-09-01T16:00:00.000Z",
          "duration": "4.5 أيام"
        },
        "performance": {
          "onTime": true,
          "earlyDelivery": "2 ساعات",
          "efficiency": "110%"
        }
      },
      "deliverables": {
        "planned": 20,
        "delivered": 22, // صورتان إضافيتان كمكافأة
        "quality": "exceeded_expectations",
        "formats": ["High-res JPEG", "Social Media", "RAW"]
      },
      "financials": {
        "budgetPlanned": 620000,
        "actualCost": 620000,
        "currency": "IQD",
        "profitMargin": "18%",
        "clientPaymentStatus": "pending"
      },
      "satisfaction": {
        "clientRating": 5.0,
        "creatorRating": 4.8, // تقييم العميل للمبدع
        "agencyRating": 4.9, // تقييم إدارة المشروع
        "overallSuccess": "excellent"
      },
      "collaboration": {
        "teamSize": 3,
        "communicationScore": 4.6,
        "issuesResolved": 2,
        "clientMeetings": 3,
        "revisionRounds": 1
      },
      "impact": {
        "clientBusinessValue": "increased_sales",
        "portfolioAddition": true,
        "testimonialReceived": true,
        "futureOpportunities": "high"
      },
      "lessonsLearned": [
        "التصوير في الصباح الباكر يعطي نتائج أفضل",
        "العميل يفضل الألوان الزاهية والطبيعية",
        "توفير نسخ إضافية للوسائط الاجتماعية يزيد رضا العميل"
      ],
      "recommendations": [
        "مشاريع تصوير شهرية للعروض الموسمية",
        "إضافة تصوير فيديو للترويج",
        "جلسة تصوير خارجية لأجواء مختلفة"
      ]
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [نظام المبدعين](./01-creators.md)  
- [نظام العملاء](./02-clients.md)
- [نظام التسعير](./04-pricing.md)
- [الملفات والتخزين](./05-storage.md)
- [نظام الإشعارات](./06-notifications.md)
- [لوحة الأدمن](../admin/01-admin-panel.md)
- [رموز الأخطاء](../core/04-error-handling.md)
