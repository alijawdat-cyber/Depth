# 👥 نظام الموظفين براتب ثابت - Depth API v2.0

---

## المحتويات
- [نظرة عامة](#نظرة-عامة)
- [الحصول على ملف الموظف](#الحصول-على-ملف-الموظف)
- [تسجيل موظف جديد](#تسجيل-موظف-جديد)
- [إدارة المهام](#إدارة-المهام)
- [مشاريع الموظف](#مشاريع-الموظف)
- [إحصائيات الأداء](#إحصائيات-الأداء)

---

## نظرة عامة

الموظفون براتب ثابت هم جزء من الفريق الداخلي للوكالة، يعملون بدوام كامل أو جزئي براتب شهري ثابت. لا يرون أسعار المشاريع حيث أن عملهم محسوب ضمن الراتب الشهري.

### التكامل مع الأنظمة الأخرى:
- 🔗 **إدارة المشاريع**: راجع [`04-projects-api.md`](04-projects-api.md) لتعيين الموظفين للمهام
- 🔗 **نظام التسعير**: راجع [`05-pricing-api.md`](05-pricing-api.md) لفهم عدم احتساب تكاليف إضافية
- 🔗 **لوحة الأدمن**: راجع [`08-admin-api.md`](08-admin-api.md) لإدارة الموظفين

### الخصائص الرئيسية:
- **دعوة من الأدمن فقط**: لا يمكن التسجيل الذاتي
- **بدون عرض أسعار**: لا يرون تكاليف أو أرباح المشاريع
- **مهام محددة**: يتم تعيين مهام محددة من الأدمن أو مدير المشروع
- **تقييم داخلي**: تقييم أداء شهري من الإدارة

---

## الحصول على ملف الموظف

### `GET /salaried-employees/{employeeId}`
جلب معلومات موظف محدد.

**المصادقة:** Admin أو Employee نفسه

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "se_123abc",
      "userId": "u_123abc", 
      "name": "فاطمة أحمد الكريم",
      "email": "fatima@depth-agency.com",
      "phone": "07801234567",
      "avatar": "https://cdn.cloudflare.com/avatars/employee_123abc.jpg",
      "department": "photography", // photography|videography|design|editing
      "jobTitle": "مصورة رئيسية",
      "employmentType": "full_time", // full_time|part_time|contract
      "startDate": "2025-06-01",
      "salary": "NOT_VISIBLE_TO_EMPLOYEE", // الموظف لا يرى هذا المجال
      "skills": ["portrait", "product", "event"],
      "schedule": {
        "workingDays": ["sunday", "monday", "tuesday", "wednesday", "thursday"],
        "workingHours": {"from": "09:00", "to": "17:00"},
        "breakTime": {"from": "13:00", "to": "14:00"}
      },
      "performance": {
        "monthlyRating": 4.2,
        "completedTasks": 28,
        "onTimeDelivery": 96.4,
        "qualityScore": 4.5
      },
      "isActive": true,
      "hiredBy": "admin@depth-agency.com",
      "hiredAt": "2025-06-01T10:00:00.000Z",
      "createdAt": "2025-05-28T09:30:00.000Z",
      "updatedAt": "2025-08-21T14:20:00.000Z"
    }
  },
  "message": "تم جلب بيانات الموظف بنجاح"
}
```

---

## تسجيل موظف جديد

### `POST /admin/salaried-employees/invite`
دعوة موظف جديد للانضمام (أدمن فقط).

**المصادقة:** Admin only

**الطلب:**
```json
{
  "email": "newemployee@depth-agency.com",
  "name": "محمد حسن العراقي",
  "phone": "07701234567",
  "department": "videography",
  "jobTitle": "منتج فيديو",
  "employmentType": "full_time",
  "startDate": "2025-09-01",
  "monthlySalary": 1500000,
  "skills": ["editing", "motion_graphics", "color_grading"],
  "workingSchedule": {
    "days": ["sunday", "monday", "tuesday", "wednesday", "thursday"],
    "hours": {"from": "10:00", "to": "18:00"}
  },
  "notes": "خبرة 3 سنوات في إنتاج المحتوى"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "employeeId": "se_789xyz",
    "invitationId": "inv_456def",
    "inviteLink": "https://app.depth-agency.com/join/employee/inv_456def",
    "expiresAt": "2025-09-01T23:59:59.000Z"
  },
  "message": "تم إرسال دعوة الموظف بنجاح"
}
```

### `POST /employees/accept-invitation`
قبول دعوة الانضمام كموظف.

**الطلب:**
```json
{
  "invitationId": "inv_456def",
  "password": "SecurePassword123",
  "fcmToken": "firebase_fcm_token"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "se_789xyz",
      "name": "محمد حسن العراقي",
      "department": "videography",
      "jobTitle": "منتج فيديو",
      "startDate": "2025-09-01",
      "isActive": true
    },
    "tokens": {
      "idToken": "firebase_id_token_jwt",
      "refreshToken": "firebase_refresh_token",
      "expiresIn": 3600
    }
  },
  "message": "مرحباً بك في فريق ديب! تم تفعيل حسابك بنجاح"
}
```

---

## إدارة المهام

### `GET /salaried-employees/{employeeId}/tasks`
جلب مهام الموظف.

**معاملات الاستعلام:**
- `status`: pending|in_progress|completed|overdue
- `priority`: low|medium|high|urgent
- `date_from`: تاريخ البداية
- `date_to`: تاريخ النهاية

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_123abc",
        "projectId": "p_456def",
        "title": "تصوير منتجات مطعم البركة",
        "description": "تصوير 15 طبق للمنيو الجديد",
        "category": "photography",
        "subcategory": "food",
        "priority": "high",
        "status": "in_progress",
        "assignedBy": "admin@depth-agency.com",
        "assignedAt": "2025-08-20T10:00:00.000Z",
        "dueDate": "2025-08-23T17:00:00.000Z",
        "estimatedHours": 4,
        "actualHours": 2.5,
        "location": "client", // studio|client|external
        "clientInfo": {
          "name": "مطعم البركة",
          "contact": "0770123456",
          "address": "شارع الرشيد - بغداد"
        },
        "requirements": [
          "كاميرا احترافية",
          "إضاءة استوديو متنقلة", 
          "خلفية بيضاء"
        ],
        "deliverables": [
          "15 صورة معالجة",
          "ملفات RAW احتياطية"
        ]
      }
    ],
    "summary": {
      "total": 12,
      "pending": 3,
      "in_progress": 4,
      "completed": 4,
      "overdue": 1
    }
  },
  "message": "تم جلب قائمة المهام بنجاح"
}
```

### `PUT /salaried-employees/tasks/{taskId}/status`
تحديث حالة المهمة.

**الطلب:**
```json
{
  "status": "completed",
  "actualHours": 3.5,
  "notes": "تم الإنجاز بنجاح. العميل راضٍ عن النتائج",
  "deliverables": [
    {
      "type": "photos",
      "count": 15,
      "format": "JPG + RAW",
      "urls": ["https://cdn.cloudflare.com/project_photos/..."]
    }
  ]
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_123abc",
      "status": "completed", 
      "completedAt": "2025-08-22T16:30:00.000Z",
      "actualHours": 3.5,
      "efficiency": 114.3 // (4/3.5)*100
    }
  },
  "message": "تم تحديث حالة المهمة بنجاح"
}
```

---

## مشاريع الموظف

### `GET /salaried-employees/{employeeId}/projects`
جلب المشاريع المعينة للموظف (بدون عرض الأسعار).

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "p_456def",
        "title": "حملة تسويقية لمطعم البركة",
        "client": {
          "name": "مطعم البركة",
          "industry": "restaurants"
        },
        "category": "photography",
        "subcategory": "food",
        "status": "active",
        "myRole": "lead_photographer",
        "tasks": [
          {
            "id": "task_123abc",
            "title": "تصوير المنيو",
            "status": "completed"
          },
          {
            "id": "task_789xyz",
            "title": "تصوير المطبخ",
            "status": "pending"
          }
        ],
        "timeline": {
          "startDate": "2025-08-20",
          "dueDate": "2025-08-30",
          "progress": 60
        },
        "team": [
          {
            "name": "أحمد المصور",
            "role": "assistant_photographer"
          },
          {
            "name": "سارة المصممة",
            "role": "graphic_designer"
          }
        ]
      }
    ],
    "summary": {
      "activeProjects": 3,
      "completedThisMonth": 8,
      "pendingTasks": 5,
      "averageProjectDuration": "5.2 أيام"
    }
  },
  "message": "تم جلب قائمة المشاريع بنجاح"
}
```

---

## إحصائيات الأداء

### `GET /salaried-employees/{employeeId}/performance`
جلب إحصائيات أداء الموظف.

**معاملات الاستعلام:**
- `period`: week|month|quarter|year
- `include`: tasks|projects|ratings|attendance

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "performance": {
      "period": "month",
      "month": "2025-08",
      "overview": {
        "totalTasks": 28,
        "completedTasks": 26,
        "completionRate": 92.9,
        "averageRating": 4.2,
        "onTimeDelivery": 96.4,
        "totalHours": 156,
        "productiveHours": 142,
        "efficiency": 91.0
      },
      "categories": {
        "photography": {
          "tasks": 18,
          "hours": 89,
          "rating": 4.4
        },
        "videography": {
          "tasks": 8,
          "hours": 45,
          "rating": 4.0
        },
        "editing": {
          "tasks": 2,
          "hours": 12,
          "rating": 4.1
        }
      },
      "attendance": {
        "workingDays": 22,
        "presentDays": 22,
        "attendanceRate": 100,
        "punctualityScore": 95.5,
        "averageArrivalTime": "08:58",
        "averageDepartureTime": "17:15"
      },
      "achievements": [
        "أفضل موظف للشهر",
        "إنجاز 100% من المهام في الموعد",
        "تقييم عملاء 4.5+ في جميع المشاريع"
      ],
      "improvements": [
        "تحسين سرعة التسليم في مشاريع الفيديو",
        "تطوير مهارات التصميم الجرافيكي"
      ]
    }
  },
  "message": "تم جلب إحصائيات الأداء بنجاح"
}
```

### `GET /admin/salaried-employees/performance-report`
تقرير أداء شامل لجميع الموظفين (أدمن فقط).

**المصادقة:** Admin only

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "report": {
      "period": "2025-08",
      "totalEmployees": 8,
      "activeEmployees": 7,
      "summary": {
        "totalTasks": 198,
        "completedTasks": 185,
        "overallCompletionRate": 93.4,
        "averageRating": 4.1,
        "totalProductiveHours": 1056,
        "averageEfficiency": 88.7
      },
      "topPerformers": [
        {
          "employeeId": "se_123abc",
          "name": "فاطمة أحمد",
          "department": "photography",
          "score": 96.5,
          "achievements": ["أفضل موظف", "100% التزام بالمواعيد"]
        },
        {
          "employeeId": "se_456def", 
          "name": "محمد حسن",
          "department": "videography",
          "score": 94.2,
          "achievements": ["أعلى تقييم عملاء", "أسرع إنجاز"]
        }
      ],
      "improvements": [
        {
          "employeeId": "se_789xyz",
          "name": "سارة المصممة",
          "issues": ["تأخير في التسليم", "تحتاج تدريب إضافي"],
          "plan": "دورة تدريبية في إدارة الوقت"
        }
      ]
    }
  },
  "message": "تم جلب تقرير الأداء الشامل بنجاح"
}
```

---

## معايير الخطأ

### أخطاء الموظفين

```json
{
  "EMPLOYEE_NOT_FOUND": {
    "code": 404,
    "message": "الموظف غير موجود"
  },
  "INVITATION_EXPIRED": {
    "code": 400,
    "message": "انتهت صلاحية الدعوة"
  },
  "ALREADY_EMPLOYEE": {
    "code": 400,
    "message": "هذا البريد مسجل كموظف بالفعل"
  },
  "TASK_NOT_ASSIGNED": {
    "code": 403,
    "message": "هذه المهمة غير معينة لك"
  },
  "INVALID_STATUS_TRANSITION": {
    "code": 400,
    "message": "لا يمكن تغيير حالة المهمة إلى هذا الوضع"
  }
}
```

---

*تم إنشاء هذا الملف لاستكمال النواقص في التوثيق وضمان تغطية شاملة لنظام الموظفين براتب ثابت.*

---

## 🔗 الملفات ذات الصلة

- [المصادقة والأمان](./01-authentication.md)
- [نظام المبدعين](./02-creators-api.md)  
- [إدارة المشاريع](./04-projects-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [قاموس البيانات](../02-database/00-data-dictionary.md)

*آخر تحديث: 2025-08-21 | النسخة: 2.0.1 | الحالة: Active*
