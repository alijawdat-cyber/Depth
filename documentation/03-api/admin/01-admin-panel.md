# ⚙️ لوحة الأدمِن - Depth API v2.0

> مصطلحات هذا المستند:
> - واجهة برمجة التطبيقات: Application Programming Interface — API
> - التحكم بالوصول المعتمد على الأدوار: Role-Based Access Control — RBAC
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)
# ⚙️ لوحة الأدمن - Depth API v2.0

---

## المحتويات
- [لوحة التحكم الرئيسية](#لوحة-التحكم-الرئيسية)
- [إدارة الأدمنز](#إدارة-الأدمنز)
- [إدارة المستخدمين](#إدارة-المستخدمين)
- [مراقبة النظام](#مراقبة-النظام)
- [التقارير والتحليلات](#التقارير-والتحليلات)
- [إعدادات النظام](#إعدادات-النظام)

---

## لوحة التحكم الرئيسية

### `GET /admin/dashboard`
جلب ملخص شامل للنظام.

**المصادقة:** Admin role required

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "timestamp": "2025-09-02T16:00:00.000Z",
      "systemStatus": "healthy",
      "uptime": "99.8%",
      "lastUpdate": "2025-09-02T15:45:00.000Z"
    },
    "metrics": {
      "users": {
        "total": 234,
        "active": 187,
        "new": {
          "today": 3,
          "thisWeek": 12,
          "thisMonth": 45
        },
        "breakdown": {
          "clients": 156,
          "creators": 67,
          "super_admins": 1,
          "admins": 2,
          "pending": 3
        }
      },
      "projects": {
        "total": 1847,
        "active": 67,
        "completed": 1743,
        "cancelled": 37,
        "revenue": {
          "thisMonth": 28450000,
          "lastMonth": 22100000,
          "growth": "+28.7%"
        },
        "avgProjectValue": 425000,
        "completionRate": "94.4%"
      },
      "financial": {
        "totalRevenue": 485670000,
        "pendingPayments": 8920000,
        "overdueAmount": 125000,
        "monthlyRecurring": 12340000,
        "profitMargin": "18.5%"
      },
      "performance": {
        "avgProjectDuration": "6.2 أيام",
        "clientSatisfaction": 4.7,
        "onTimeDelivery": "96.3%",
        "creatorUtilization": "78%"
      }
    },
    "recentActivity": [
      {
        "id": "activity_123",
        "timestamp": "2025-09-02T15:30:00.000Z",
        "type": "project_completed",
        "description": "مشروع تصوير منتجات المطعم تم إنجازه بنجاح",
        "user": "فاطمة الزهراء",
        "value": 620000,
        "status": "success"
      },
      {
        "id": "activity_124",
        "timestamp": "2025-09-02T14:45:00.000Z",
        "type": "new_client_registered",
        "description": "عميل جديد: مطعم البرج الذهبي",
        "user": "أحمد محمد الكردي",
        "status": "pending_approval"
      },
      {
        "id": "activity_125",
        "timestamp": "2025-09-02T13:20:00.000Z",
        "type": "payment_received",
        "description": "دفعة من مطعم الشام الأصيل",
        "value": 308000,
        "status": "confirmed"
      }
    ],
    "alerts": [
      {
        "id": "alert_001",
        "type": "warning",
        "priority": "medium",
        "title": "فاتورة متأخرة",
        "message": "فاتورة INV-2025-001198 متأخرة 5 أيام",
        "actionRequired": true,
        "createdAt": "2025-09-02T09:00:00.000Z"
      },
      {
        "id": "alert_002",
        "type": "info",
        "priority": "low",
        "title": "مبدع جديد في الانتظار",
        "message": "طلب انضمام من مصور متخصص في المنتجات",
        "actionRequired": true,
        "createdAt": "2025-09-02T11:30:00.000Z"
      }
    ],
    "quickStats": {
      "activeProjects": 67,
      "pendingApprovals": 8,
      "supportTickets": 3,
      "systemAlerts": 2,
      "newRegistrations": 12,
      "overduePayments": 1
    }
  }
}
```

### `GET /admin/analytics/summary`
تحليلات سريعة للأداء.

**معاملات الاستعلام:**
- `period`: today|week|month|quarter|year
- `compareWith`: previous_period|last_year

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "current": {
        "start": "2025-08-01T00:00:00.000Z",
        "end": "2025-08-31T23:59:59.000Z",
        "description": "أغسطس 2025"
      },
      "comparison": {
        "start": "2025-07-01T00:00:00.000Z", 
        "end": "2025-07-31T23:59:59.000Z",
        "description": "يوليو 2025"
      }
    },
    "kpis": {
      "revenue": {
        "current": 28450000,
        "previous": 22100000,
        "change": "+28.7%",
        "trend": "increasing"
      },
      "projects": {
        "current": 89,
        "previous": 67,
        "change": "+32.8%",
        "trend": "increasing"
      },
      "clients": {
        "current": 73,
        "previous": 58,
        "change": "+25.9%",
        "trend": "increasing"
      },
      "avgProjectValue": {
        "current": 425000,
        "previous": 396000,
        "change": "+7.3%",
        "trend": "stable"
      },
      "clientSatisfaction": {
        "current": 4.7,
        "previous": 4.6,
        "change": "+2.2%",
        "trend": "stable"
      },
      "creatorUtilization": {
        "current": "78%",
        "previous": "73%",
        "change": "+6.8%",
        "trend": "increasing"
      }
    },
    "trends": {
      "topCategories": [
        {"category": "photo", "revenue": 17870000, "growth": "+22%"},
        {"category": "video", "revenue": 7125000, "growth": "+45%"},
        {"category": "design", "revenue": 3455000, "growth": "+18%"}
      ],
      "topLocations": [
        {"location": "بغداد", "revenue": 20515000, "projects": 64},
        {"location": "البصرة", "revenue": 5122000, "projects": 16},
        {"location": "أربيل", "revenue": 2813000, "projects": 9}
      ],
      "monthlyProjection": 32500000,
      "confidence": "87%"
    }
  }
}
```

---

## إدارة الأدمنز

### `GET /admin/admins`
جلب قائمة جميع الأدمنز في النظام.

**المصادقة:** Super Admin role required

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "id": "sa_001",
        "userId": "u_sa001",
        "adminLevel": "super_admin",
        "profile": {
          "fullName": "علي الربيعي",
          "email": "admin@depth-agency.com",
          "phone": "07719956000"
        },
        "isSeeded": true,
        "isActive": true,
        "permissions": {
          "canManageUsers": true,
          "canManageProjects": true,
          "canManagePayments": true,
          "canViewReports": true,
          "canManageSettings": true,
          "canManageAdmins": true
        },
        "lastLoginAt": "2025-09-02T15:30:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z"
      },
      {
        "id": "ad_002",
        "userId": "u_ad002",
        "adminLevel": "admin",
        "profile": {
          "fullName": "سارة أحمد",
          "email": "sara@depth-agency.com",
          "phone": "07801234567"
        },
        "isSeeded": false,
        "isActive": true,
        "addedBy": "sa_001",
        "permissions": {
          "canManageUsers": true,
          "canManageProjects": true,
          "canManagePayments": false,
          "canViewReports": true,
          "canManageSettings": false,
          "canManageAdmins": false
        },
        "lastLoginAt": "2025-09-02T14:20:00.000Z",
        "addedAt": "2025-08-15T10:00:00.000Z"
      }
    ],
    "summary": {
      "total": 2,
      "superAdmins": 1,
      "admins": 1,
      "active": 2,
      "inactive": 0
    }
  }
}
```

### `POST /admin/admins`
إضافة أدمن جديد.

**المصادقة:** Super Admin role required

**البيانات المطلوبة:**
```json
{
  "fullName": "أحمد محمد",
  "email": "ahmed@depth-agency.com",
  "phone": "07801234568",
  "adminLevel": "admin",
  "permissions": {
    "canManageUsers": true,
    "canManageProjects": true,
    "canManagePayments": false,
    "canViewReports": true,
    "canManageSettings": false,
    "canManageAdmins": false
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "message": "تم إضافة الأدمن بنجاح. سيتم إرسال دعوة Google OAuth.",
  "data": {
    "adminId": "ad_003",
    "email": "ahmed@depth-agency.com",
    "adminLevel": "admin",
    "invitationSent": true
  }
}
```

### `PUT /admin/admins/{adminId}/status`
تفعيل/إيقاف أدمن.

**المصادقة:** Super Admin role required

**البيانات المطلوبة:**
```json
{
  "isActive": false,
  "reason": "إجازة طويلة"
}
```

---

## إدارة المستخدمين

### `GET /admin/users`
جلب قائمة جميع المستخدمين.

**معاملات الاستعلام:**
- `role`: client|creator|admin|all
- `status`: active|inactive|pending|suspended
- `search`: البحث بالاسم أو البريد
- `page`: رقم الصفحة
- `limit`: عدد العناصر

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "cl_123abc",
        "type": "client",
        "profile": {
          "companyName": "مطعم الشام الأصيل",
          "contactName": "محمد أحمد السوري",
          "email": "contact@alsham-restaurant.com",
          "phone": "07801234567"
        },
        "status": "active",
        "registeredAt": "2025-06-15T10:00:00.000Z",
        "lastActive": "2025-09-02T14:30:00.000Z",
        "stats": {
          "totalProjects": 13,
          "totalSpent": 5485000,
          "avgRating": 4.8,
          "paymentReliability": "excellent"
        },
        "flags": {
          "verified": true,
          "vip": false,
          "risk": "low"
        }
      },
      {
        "id": "c_789ghi",
        "type": "creator",
        "profile": {
          "name": "فاطمة الزهراء",
          "email": "fatima@photographer.com",
          "phone": "07809876543",
          "specialization": "Food Photography"
        },
        "status": "active",
        "registeredAt": "2025-03-20T14:00:00.000Z",
        "lastActive": "2025-09-02T15:45:00.000Z",
        "stats": {
          "completedProjects": 87,
          "totalEarned": 12840000,
          "rating": 4.9,
          "onTimeDelivery": "96%"
        },
        "flags": {
          "verified": true,
          "topPerformer": true,
          "available": true
        }
      }
    ],
    "summary": {
      "total": 234,
      "byRole": {
        "clients": 156,
        "creators": 67,
        "super_admins": 1,
        "admins": 2,
        "pending": 3
      },
      "byStatus": {
        "active": 210,
        "inactive": 15,
        "suspended": 6,
        "pending": 3
      }
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 234,
    "pages": 12
  }
}
```

### `GET /admin/users/{userId}/details`
جلب تفاصيل مستخدم محدد.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cl_123abc",
      "type": "client",
      "profile": {
        "companyName": "مطعم الشام الأصيل",
        "contactName": "محمد أحمد السوري",
        "email": "contact@alsham-restaurant.com",
        "phone": "07801234567",
        "location": {
          "governorate": "بغداد",
          "area": "الكرادة",
          "address": "شارع الكرادة الداخل، بناية 45"
        },
        "industry": "restaurants",
        "website": "https://alsham-restaurant.com",
        "socialMedia": {
          "instagram": "@alsham_restaurant",
          "facebook": "AlshamRestaurant"
        }
      },
      "account": {
        "status": "active",
        "registeredAt": "2025-06-15T10:00:00.000Z",
        "approvedAt": "2025-06-16T09:30:00.000Z",
        "approvedBy": "admin@depth-agency.com",
        "lastLogin": "2025-09-02T14:30:00.000Z",
        "loginCount": 145,
        "passwordLastChanged": "2025-08-10T11:00:00.000Z"
      },
      "business": {
        "totalProjects": 13,
        "completedProjects": 11,
        "activeProjects": 2,
        "totalSpent": 5485000,
        "pendingPayments": 308000,
        "avgProjectValue": 421538,
        "lifetime_value": 5485000
      },
      "satisfaction": {
        "avgRating": 4.8,
        "totalReviews": 11,
        "recommendationRate": "91%",
        "lastFeedback": "ممتاز جداً، خدمة احترافية",
        "complaints": 0
      },
      "preferences": {
        "communicationChannel": "whatsapp",
        "language": "ar",
        "timezone": "Asia/Baghdad",
        "notifications": {
          "email": true,
          "sms": false,
          "whatsapp": true
        }
      },
      "riskAssessment": {
        "level": "low",
        "factors": {
          "paymentHistory": "excellent",
          "projectCompletion": "high",
          "feedback": "positive"
        },
        "creditLimit": 2000000,
        "paymentTerms": "net_15"
      }
    },
    "activity": {
      "recentProjects": [
        {
          "id": "p_123abc",
          "title": "تصوير منتجات المطعم",
          "status": "completed",
          "value": 620000,
          "completedAt": "2025-09-01T16:00:00.000Z"
        }
      ],
      "recentPayments": [
        {
          "id": "pay_456def",
          "amount": 312000,
          "method": "bank_transfer",
          "date": "2025-08-25T10:30:00.000Z"
        }
      ],
      "loginHistory": [
        {
          "timestamp": "2025-09-02T14:30:00.000Z",
          "ip": "192.168.1.100",
          "location": "بغداد، العراق",
          "device": "Chrome 116 on Windows"
        }
      ]
    }
  }
}
```

### `PUT /admin/users/{userId}/status`
تحديث حالة المستخدم.

**الطلب:**
```json
{
  "status": "suspended", // active | inactive | suspended | pending
  "reason": "عدم الالتزام بشروط الخدمة",
  "suspendedUntil": "2025-09-30T23:59:59.000Z",
  "notifyUser": true,
  "adminNotes": "تعليق مؤقت بسبب تأخر الدفعات المتكررة"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cl_123abc",
      "previousStatus": "active",
      "newStatus": "suspended",
      "statusChangedAt": "2025-09-02T16:30:00.000Z",
      "changedBy": "admin@depth-agency.com"
    },
    "actions": {
      "projectsAffected": 2,
      "notificationSent": true,
      "accessRevoked": true
    }
  },
  "message": "تم تحديث حالة المستخدم بنجاح"
}
```

### `POST /admin/users/{userId}/impersonate`
تسجيل الدخول نيابة عن المستخدم.

**الطلب:**
```json
{
  "reason": "دعم فني لحل مشكلة في النظام",
  "duration": 30, // بالدقائق
  "notifyUser": false
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "impersonation": {
      "id": "imp_123abc",
      "sessionToken": "imp_token_xyz789",
      "userId": "cl_123abc",
      "adminId": "admin@depth-agency.com",
      "startedAt": "2025-09-02T16:45:00.000Z",
      "expiresAt": "2025-09-02T17:15:00.000Z",
      "reason": "دعم فني لحل مشكلة في النظام"
    },
    "loginUrl": "https://client.depth-agency.com?impersonate_token=imp_token_xyz789",
    "restrictions": [
      "لا يمكن تغيير كلمة المرور",
      "لا يمكن تحديث معلومات الدفع",
      "جميع الأنشطة مسجلة في سجل التدقيق"
    ]
  },
  "message": "تم تفعيل وضع التمثيل بنجاح"
}
```

---

## مراقبة النظام

### `GET /admin/system/health`
فحص صحة النظام.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "overall": {
      "status": "healthy",
      "score": 95,
      "lastCheck": "2025-09-02T16:50:00.000Z",
      "uptime": "99.8%"
    },
    "services": {
      "api": {
        "status": "healthy",
        "responseTime": "120ms",
        "errorRate": "0.1%",
        "lastFailure": null
      },
      "database": {
        "status": "healthy",
        "connections": 45,
        "maxConnections": 100,
        "queryTime": "50ms",
        "diskUsage": "68%"
      },
      "firebase": {
        "status": "healthy",
        "authenticatedUsers": 187,
        "firestoreOperations": 2847,
        "storageUsage": "45.6GB"
      },
      "cloudflare": {
        "status": "healthy",
        "cacheHitRate": "96.4%",
        "bandwidthUsage": "1.2TB",
        "requestsPerMinute": 450
      },
      "email": {
        "status": "healthy",
        "deliveryRate": "98.7%",
        "queueSize": 23,
        "bounceRate": "2.1%"
      },
      "storage": {
        "status": "warning",
        "usedSpace": "87.5GB",
        "totalSpace": "100GB",
        "usagePercentage": "87.5%"
      }
    },
    "performance": {
      "avgResponseTime": "185ms",
      "requestsPerSecond": 125,
      "activeUsers": 187,
      "peakConcurrentUsers": 289,
      "errorRate": "0.15%"
    },
    "resources": {
      "cpu": {
        "usage": "45%",
        "load": 1.2,
        "cores": 4
      },
      "memory": {
        "usage": "67%",
        "total": "16GB",
        "available": "5.3GB"
      },
      "disk": {
        "usage": "78%",
        "total": "500GB",
        "available": "110GB"
      }
    },
    "alerts": [
      {
        "service": "storage",
        "level": "warning",
        "message": "استخدام التخزين يقترب من الحد الأقصى",
        "threshold": "85%",
        "current": "87.5%",
        "recommendation": "إضافة مساحة تخزين أو تنظيف الملفات القديمة"
      }
    ]
  }
}
```

### `GET /admin/system/logs`
جلب سجلات النظام.

**معاملات الاستعلام:**
- `level`: error|warning|info|debug
- `service`: api|database|firebase|cloudflare
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123abc",
        "timestamp": "2025-09-02T16:45:30.000Z",
        "level": "error",
        "service": "api",
        "message": "فشل في رفع الملف - حجم الملف يتجاوز الحد المسموح",
        "details": {
          "endpoint": "/storage/upload",
          "userId": "c_456def",
          "fileSize": "52MB",
          "maxAllowed": "50MB",
          "ip": "192.168.1.150"
        },
        "stackTrace": "Error at FileUpload.validate()...",
        "resolved": false
      },
      {
        "id": "log_456def",
        "timestamp": "2025-09-02T16:40:15.000Z",
        "level": "warning", 
        "service": "database",
        "message": "استعلام قاعدة البيانات يستغرق وقتاً أطول من المعتاد",
        "details": {
          "query": "SELECT * FROM projects WHERE...",
          "executionTime": "2.5s",
          "threshold": "1s",
          "affectedRows": 1247
        },
        "resolved": true
      },
      {
        "id": "log_789ghi",
        "timestamp": "2025-09-02T16:35:00.000Z",
        "level": "info",
        "service": "firebase",
        "message": "مستخدم جديد سجل دخول بنجاح",
        "details": {
          "userId": "cl_new_789",
          "method": "email_password",
          "location": "بغداد، العراق",
          "device": "mobile"
        }
      }
    ],
    "summary": {
      "total": 2847,
      "byLevel": {
        "error": 12,
        "warning": 45,
        "info": 2634,
        "debug": 156
      },
      "unresolved": 8,
      "criticalIssues": 2
    }
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2847,
    "pages": 57
  }
}
```

### `GET /admin/system/performance`
مراقبة الأداء المفصل.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "realtime": {
      "timestamp": "2025-09-02T16:55:00.000Z",
      "activeUsers": 187,
      "requestsPerMinute": 450,
      "responseTime": "125ms",
      "errorRate": "0.1%"
    },
    "trends": {
      "last24hours": {
        "avgResponseTime": "185ms",
        "peakResponseTime": "890ms",
        "peakTime": "14:30",
        "totalRequests": 128450,
        "errorCount": 23
      },
      "lastWeek": {
        "avgResponseTime": "195ms",
        "uptimePercentage": "99.8%",
        "totalRequests": 856340,
        "errorRate": "0.15%"
      }
    },
    "endpoints": [
      {
        "endpoint": "/projects",
        "method": "GET",
        "avgResponseTime": "95ms",
        "requestCount": 12450,
        "errorRate": "0.05%",
        "status": "optimal"
      },
      {
        "endpoint": "/storage/upload",
        "method": "POST",
        "avgResponseTime": "2.1s",
        "requestCount": 567,
        "errorRate": "0.8%",
        "status": "needs_attention"
      }
    ],
    "database": {
      "connectionPool": {
        "active": 45,
        "idle": 15,
        "max": 100
      },
      "slowQueries": [
        {
          "query": "Complex project search with filters",
          "avgTime": "2.3s",
          "count": 45,
          "optimization": "add_index_recommendation"
        }
      ],
      "cacheHitRate": "92.5%"
    },
    "recommendations": [
      "تحسين استعلامات البحث في المشاريع",
      "زيادة حجم ذاكرة التخزين المؤقت",
      "تحسين ضغط الصور في الرفع",
      "إضافة CDN للملفات الثابتة"
    ]
  }
}
```

---

## التقارير والتحليلات

### `GET /admin/reports/business`
تقرير الأعمال الشامل.

**معاملات الاستعلام:**
- `period`: month|quarter|year|custom
- `startDate`: تاريخ البداية (للفترة المخصصة)
- `endDate`: تاريخ النهاية (للفترة المخصصة)
- `format`: json|excel|pdf

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-08-01T00:00:00.000Z",
      "end": "2025-08-31T23:59:59.000Z",
      "description": "تقرير شهر أغسطس 2025"
    },
    "financial": {
      "revenue": {
        "gross": 28450000,
        "net": 5265000,
        "profitMargin": "18.5%",
        "growth": "+28.7%"
      },
      "expenses": {
        "creatorPayments": 20790000,
        "operational": 1845000,
        "marketing": 550000,
        "total": 23185000
      },
      "projections": {
        "nextMonth": 32500000,
        "confidence": "87%",
        "factors": ["seasonal_trend", "pipeline_analysis", "historical_data"]
      }
    },
    "operations": {
      "projects": {
        "total": 89,
        "completed": 81,
        "active": 8,
        "cancelled": 0,
        "successRate": "100%",
        "avgDuration": "6.2 أيام"
      },
      "clients": {
        "active": 73,
        "new": 15,
        "returning": 58,
        "retention": "79.5%",
        "satisfaction": 4.7
      },
      "creators": {
        "active": 23,
        "utilization": "78%",
        "avgRating": 4.6,
        "earnings": 20790000
      }
    },
    "growth": {
      "userAcquisition": {
        "clients": 15,
        "creators": 4,
        "cost": 450000,
        "cac": 23684 // Customer Acquisition Cost
      },
      "revenue": {
        "monthOverMonth": "+28.7%",
        "yearOverYear": "+145%",
        "categories": {
          "photo": "+22%",
          "video": "+45%",
          "design": "+18%"
        }
      }
    },
    "marketAnalysis": {
      "topCategories": [
        {"category": "photo", "revenue": 17870000, "share": "62.8%"},
        {"category": "video", "revenue": 7125000, "share": "25.0%"},
        {"category": "design", "revenue": 3455000, "share": "12.2%"}
      ],
      "geograficDistribution": [
        {"location": "بغداد", "revenue": 20515000, "share": "72.1%"},
        {"location": "البصرة", "revenue": 5122000, "share": "18.0%"},
        {"location": "أربيل", "revenue": 2813000, "share": "9.9%"}
      ],
      "competitivePosition": "market_leader",
      "marketShare": "15.2%"
    },
    "downloadUrls": {
      "excel": "https://api.depth-agency.com/reports/business/august-2025.xlsx",
      "pdf": "https://api.depth-agency.com/reports/business/august-2025.pdf"
    }
  }
}
```

### `GET /admin/reports/creators`
تقرير أداء المبدعين.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCreators": 67,
      "activeCreators": 23,
      "topPerformers": 8,
      "utilizationRate": "78%",
      "avgRating": 4.6
    },
    "rankings": [
      {
        "rank": 1,
        "creator": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "specialization": "Food Photography"
        },
        "metrics": {
          "projects": 12,
          "revenue": 5240000,
          "rating": 4.9,
          "onTimeDelivery": "100%",
          "clientRetention": "83%"
        },
        "growth": "+34%",
        "badge": "top_performer"
      },
      {
        "rank": 2,
        "creator": {
          "id": "c_456def",
          "name": "أحمد محمد الربيعي",
          "specialization": "Commercial Photography"
        },
        "metrics": {
          "projects": 9,
          "revenue": 4185000,
          "rating": 4.7,
          "onTimeDelivery": "96%",
          "clientRetention": "78%"
        },
        "growth": "+28%"
      }
    ],
    "categoryPerformance": {
      "photo": {
        "creators": 15,
        "avgRevenue": 285000,
        "topRating": 4.9,
        "demand": "high"
      },
      "video": {
        "creators": 6,
        "avgRevenue": 420000,
        "topRating": 4.8,
        "demand": "very_high"
      },
      "design": {
        "creators": 2,
        "avgRevenue": 195000,
        "topRating": 4.5,
        "demand": "medium"
      }
    },
    "insights": {
      "topSkills": ["food_photography", "product_photography", "video_editing"],
      "gapAnalysis": ["motion_graphics", "3d_rendering", "drone_photography"],
      "retentionRate": "94%",
      "recruitmentNeeds": ["video_specialists", "designers"]
    }
  }
}
```

---

## إعدادات النظام

### `GET /admin/settings`
جلب إعدادات النظام.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "general": {
      "systemName": "Depth Creative Agency Platform",
  "version": "{semver}",
      "environment": "production",
      "maintenanceMode": false,
      "timezone": "Asia/Baghdad",
      "language": "ar",
      "currency": "IQD"
    },
    "business": {
      "agencyCommission": 20, // نسبة مئوية
      "minimumProject": 100000,
      "maximumProject": 50000000,
      "paymentTerms": "net_15",
      "autoApprovalLimit": 2000000
    },
    "features": {
      "multiLanguage": true,
      "realTimeNotifications": true,
      "videoProjects": true,
      "mobileApp": false,
      "apiAccess": true,
      "whiteLabeling": false
    },
    "integrations": {
      "firebase": {
        "enabled": true,
        "projectId": "depth-agency-prod",
        "status": "connected"
      },
      "cloudflare": {
        "enabled": true,
        "zoneId": "abc123xyz",
        "status": "connected"
      },
      "email": {
        "provider": "sendgrid",
        "enabled": true,
        "status": "connected"
      },
      "payment": {
        "providers": ["stripe", "local_banks"],
        "enabled": true,
        "status": "connected"
      }
    },
    "security": {
      "twoFactorAuth": true,
      "sessionTimeout": 3600, // بالثواني
      "passwordPolicy": {
        "minLength": 8,
        "requireSpecialChars": true,
        "requireNumbers": true,
        "requireUppercase": true
      },
      "encryptionEnabled": true,
      "auditLogging": true
    },
    "limits": {
      "fileUpload": {
        "maxSize": "50MB",
        "allowedTypes": ["jpg", "png", "gif", "mp4", "pdf"]
      },
      "storage": {
        "perUser": "5GB",
        "total": "500GB"
      },
      "api": {
        "rateLimit": "1000/hour",
        "burst": "50/minute"
      }
    }
  }
}
```

### `PUT /admin/settings/business`
تحديث إعدادات الأعمال.

**الطلب:**
```json
{
  "agencyCommission": 18,
  "minimumProject": 150000,
  "maximumProject": 75000000,
  "paymentTerms": "net_30",
  "autoApprovalLimit": 3000000,
  "urgentFeeMultiplier": 1.5,
  "weekendFeeMultiplier": 1.2
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "updated": {
      "agencyCommission": {
        "old": 20,
        "new": 18,
        "effectiveFrom": "2025-10-01T00:00:00.000Z"
      },
      "minimumProject": {
        "old": 100000,
        "new": 150000,
        "effectiveFrom": "immediate"
      }
    },
    "impactAnalysis": {
      "affectedProjects": 0,
      "revenueImpact": "-2% commission rate",
      "marketCompetitiveness": "+15%"
    }
  },
  "message": "تم تحديث إعدادات الأعمال بنجاح"
}
```

### `POST /admin/system/maintenance`
تفعيل وضع الصيانة.

**الطلب:**
```json
{
  "enabled": true,
  "message": "النظام تحت الصيانة المجدولة. سيعود خلال ساعتين.",
  "messageEn": "System under scheduled maintenance. Will be back in 2 hours.",
  "duration": 120, // بالدقائق
  "allowedUsers": ["admin@depth-agency.com"],
  "redirectUrl": "https://depth-agency.com/maintenance"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "maintenance": {
      "enabled": true,
      "startedAt": "2025-09-02T18:00:00.000Z",
      "estimatedEnd": "2025-09-02T20:00:00.000Z",
      "affectedUsers": 187,
      "notificationsSent": true
    }
  },
  "message": "تم تفعيل وضع الصيانة"
}
```

### `GET /admin/system/backup`
إدارة النسخ الاحتياطية.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "schedule": {
      "frequency": "daily",
      "time": "02:00",
      "retention": "30 days",
      "enabled": true
    },
    "recentBackups": [
      {
        "id": "backup_20250902",
        "timestamp": "2025-09-02T02:00:00.000Z",
        "size": "2.3 GB",
        "type": "full",
        "status": "completed",
        "duration": "23 minutes",
        "location": "cloudflare_r2"
      },
      {
        "id": "backup_20250901",
        "timestamp": "2025-09-01T02:00:00.000Z",
        "size": "2.1 GB",
        "type": "full",
        "status": "completed",
        "duration": "21 minutes"
      }
    ],
    "storage": {
      "used": "48.5 GB",
      "total": "500 GB",
      "retention": "automatic",
      "encryption": "enabled"
    },
    "recovery": {
      "lastTest": "2025-08-15T10:00:00.000Z",
      "testResult": "successful",
      "rto": "15 minutes", // Recovery Time Objective
      "rpo": "1 hour" // Recovery Point Objective
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [المصادقة والأمان](../core/01-authentication.md)
- [نظام المبدعين](../features/01-creators.md)
- [نظام العملاء](../features/02-clients.md)
- [نظام الإشعارات](../features/06-notifications.md)
- [التكاملات الخارجية](../integrations/01-external-services.md)
- [الأمان والحوكمة](./02-governance.md)
- [رموز الأخطاء](../core/04-error-handling.md)

