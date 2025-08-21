
# 🏢 نظام العملاء - Depth API v2.0

---

## المحتويات
- [تسجيل عميل جديد](#تسجيل-عميل-جديد)
- [إدارة ملف العميل](#إدارة-ملف-العميل)
- [طلبات المشاريع](#طلبات-المشاريع)
- [الفواتير والمدفوعات](#الفواتير-والمدفوعات)
- [إحصائيات العميل](#إحصائيات-العميل)

---

## تسجيل عميل جديد

### `POST /clients/register`
تسجيل عميل جديد مع البيانات الأساسية.

**الطلب:**
```json
{
  "companyName": "مطعم الشام الأصيل",
  "contactName": "محمد أحمد السوري",
  "email": "contact@alsham-restaurant.com",
  "phone": "07801234567",
  "industry": "restaurants",
  "location": {
    "governorate": "بغداد",
    "area": "الكرادة"
  },
  "website": "https://alsham-restaurant.com",
  "socialMedia": {
    "instagram": "@alsham_restaurant",
    "tiktok": "@alsham_official",
    "facebook": "AlshamRestaurant"
  },
  "logo": "file_upload_id_123",
  "budgetRange": "1-3M IQD",
  "description": "مطعم متخصص في الأكلات الشامية الأصيلة",
  "agreeToTerms": true
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "client": {
      "id": "cl_123abc",
      "companyName": "مطعم الشام الأصيل",
      "contactName": "محمد أحمد السوري",
      "email": "contact@alsham-restaurant.com",
      "phone": "07801234567",
      "status": "pending_approval",
      "submittedAt": "2025-08-21T15:30:00.000Z",
      "estimatedApprovalTime": "24 ساعة"
    },
    "nextSteps": [
      "انتظار مراجعة بيانات الشركة",
      "التحقق من المعلومات",
      "الموافقة على الحساب"
    ]
  },
  "message": "تم إرسال طلب التسجيل بنجاح! سيتم مراجعته خلال 24 ساعة."
}
```

---

## إدارة ملف العميل

### `GET /clients/{clientId}`
جلب معلومات عميل محدد.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "client": {
      "id": "cl_123abc",
      "companyName": "مطعم الشام الأصيل",
      "contactName": "محمد أحمد السوري",
      "email": "contact@alsham-restaurant.com",
      "phone": "07801234567",
      "industry": "restaurants",
      "location": {
        "governorate": "بغداد",
        "area": "الكرادة"
      },
      "website": "https://alsham-restaurant.com",
      "socialMedia": {
        "instagram": "@alsham_restaurant",
        "tiktok": "@alsham_official",
        "facebook": "AlshamRestaurant"
      },
      "logo": "https://cdn.cloudflare.com/logos/client_123.jpg",
      "status": "active",
      "stats": {
        "totalProjects": 13,
        "completedProjects": 10,
        "activeProjects": 2,
        "totalSpent": 485000,
        "averageProjectValue": 48500
      },
      "approvedBy": "admin@depth-agency.com",
      "approvedAt": "2025-08-21T16:00:00.000Z",
      "createdAt": "2025-08-21T15:30:00.000Z",
      "updatedAt": "2025-08-26T12:00:00.000Z"
    }
  }
}
```

### `PUT /clients/{clientId}/profile`
تحديث معلومات ملف العميل.

**الطلب:**
```json
{
  "contactName": "محمد أحمد السوري",
  "phone": "07801234568",
  "website": "https://new-alsham-restaurant.com",
  "socialMedia": {
    "instagram": "@new_alsham_restaurant",
    "tiktok": "@alsham_official_new"
  },
  "description": "مطعم متخصص في الأكلات الشامية الأصيلة مع فروع جديدة"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "client": {
      "id": "cl_123abc",
      "updatedFields": ["contactName", "phone", "website", "socialMedia", "description"],
      "updatedAt": "2025-08-26T14:30:00.000Z"
    }
  },
  "message": "تم تحديث ملف العميل بنجاح"
}
```

---

## طلبات المشاريع

### `POST /clients/{clientId}/project-requests`
إنشاء طلب مشروع جديد.

**الطلب:**
```json
{
  "title": "تصوير منتجات جديدة للمطعم",
  "description": "نحتاج تصوير احترافي لـ 20 طبق جديد في القائمة",
  "category": "photo",
  "subcategory": "food",
  "requirements": {
    "deliverables": [
      "20 صورة عالية الجودة",
      "معالجة احترافية للصور",
      "تسليم خلال 5 أيام"
    ],
    "style": "طبيعي ومشرق",
    "usage": "للقائمة الرقمية والمطبوعة"
  },
  "budget": "500,000 - 750,000 IQD",
  "preferredDeliveryDate": "2025-09-01",
  "location": "client", // client | studio
  "isUrgent": false,
  "notes": "نفضل التصوير في ساعات الصباح للإضاءة الطبيعية"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "projectRequest": {
      "id": "req_123abc",
      "clientId": "cl_123abc",
      "title": "تصوير منتجات جديدة للمطعم",
      "category": "photo",
      "subcategory": "food",
      "status": "pending_review",
      "estimatedValue": {
        "min": 500000,
        "max": 750000,
        "currency": "IQD"
      },
      "submittedAt": "2025-08-26T15:00:00.000Z",
      "estimatedResponseTime": "24-48 ساعة"
    }
  },
  "message": "تم إرسال طلب المشروع بنجاح! سيتم مراجعته وإعداد عرض سعر خلال 48 ساعة."
}
```

### `GET /clients/{clientId}/project-requests`
جلب طلبات مشاريع العميل.

**معاملات الاستعلام:**
- `status`: pending|reviewing|approved|rejected|converted
- `page`: رقم الصفحة
- `limit`: عدد العناصر

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "projectRequests": [
      {
        "id": "req_123abc",
        "title": "تصوير منتجات جديدة للمطعم",
        "category": "photo",
        "subcategory": "food",
        "status": "reviewing",
        "budget": "500,000 - 750,000 IQD",
        "submittedAt": "2025-08-26T15:00:00.000Z",
        "reviewedAt": null,
        "estimatedQuote": {
          "available": false,
          "estimatedBy": null
        }
      }
    ],
    "summary": {
      "total": 5,
      "pending": 1,
      "reviewing": 2,
      "approved": 1,
      "converted": 1
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### `GET /clients/{clientId}/project-requests/{requestId}`
جلب تفاصيل طلب مشروع محدد.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "projectRequest": {
      "id": "req_123abc",
      "title": "تصوير منتجات جديدة للمطعم",
      "description": "نحتاج تصوير احترافي لـ 20 طبق جديد في القائمة",
      "category": "photo",
      "subcategory": "food",
      "status": "approved",
      "requirements": {
        "deliverables": ["20 صورة عالية الجودة"],
        "style": "طبيعي ومشرق",
        "usage": "للقائمة الرقمية والمطبوعة"
      },
      "budget": "500,000 - 750,000 IQD",
      "preferredDeliveryDate": "2025-09-01",
      "location": "client",
      "isUrgent": false,
      "quote": {
        "id": "quote_456def",
        "totalAmount": 620000,
        "currency": "IQD",
        "breakdown": {
          "photography": 450000,
          "editing": 120000,
          "rush_fee": 0,
          "agency_fee": 50000
        },
        "assignedCreator": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "specialization": "Food Photography",
          "rating": 4.9
        },
        "timeline": {
          "startDate": "2025-08-28",
          "deliveryDate": "2025-09-01"
        },
        "validUntil": "2025-09-05T00:00:00.000Z"
      },
      "submittedAt": "2025-08-26T15:00:00.000Z",
      "reviewedAt": "2025-08-26T18:00:00.000Z",
      "reviewedBy": "admin@depth-agency.com"
    }
  }
}
```

---

## الفواتير والمدفوعات

### `GET /clients/{clientId}/invoices`
جلب فواتير العميل.

**معاملات الاستعلام:**
- `status`: pending|paid|overdue|cancelled
- `startDate`: تاريخ البداية (YYYY-MM-DD)
- `endDate`: تاريخ النهاية (YYYY-MM-DD)

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_123abc",
        "invoiceNumber": "INV-2025-001234",
        "projectId": "p_123abc",
        "projectTitle": "تصوير منتجات المطعم",
        "amount": 620000,
        "currency": "IQD",
        "amountUSD": 417.51,
        "exchangeRate": 1485,
        "status": "pending",
        "issueDate": "2025-08-22T10:00:00.000Z",
        "dueDate": "2025-09-06T10:00:00.000Z",
        "breakdown": {
          "subtotal": 620000,
          "tax": 0,
          "total": 620000
        },
        "paymentTerms": "صافي 15 يوم",
        "paymentMethods": ["bank_transfer", "cash"],
        "downloadUrl": "https://api.depth-agency.com/invoices/inv_123abc/download"
      }
    ],
    "summary": {
      "pending": 1,
      "paid": 8,
      "overdue": 0,
      "totalPending": 620000,
      "totalPaid": 4650000,
      "totalOverdue": 0
    }
  }
}
```

### `GET /clients/{clientId}/invoices/{invoiceId}/download`
تحميل فاتورة بصيغة PDF.

**الاستجابة الناجحة (200):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="invoice-INV-2025-001234.pdf"

[PDF Binary Data]
```

### `POST /clients/{clientId}/payments`
تسجيل دفعة مالية جديدة.

**الطلب:**
```json
{
  "invoiceId": "inv_123abc",
  "amount": 620000,
  "currency": "IQD",
  "paymentMethod": "bank_transfer", // bank_transfer | cash | mobile_wallet
  "reference": "TXN20250826001",
  "notes": "دفع كامل للفاتورة INV-2025-001234",
  "attachments": ["receipt_001.jpg"]
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_789xyz",
      "invoiceId": "inv_123abc",
      "amount": 620000,
      "currency": "IQD",
      "paymentMethod": "bank_transfer",
      "reference": "TXN20250826001",
      "status": "confirmed",
      "processedAt": "2025-08-26T16:30:00.000Z"
    },
    "invoice": {
      "id": "inv_123abc",
      "newStatus": "paid",
      "paidAt": "2025-08-26T16:30:00.000Z"
    }
  },
  "message": "تم تسجيل الدفعة بنجاح وتحديث حالة الفاتورة"
}
```

---

## إحصائيات العميل

### `GET /clients/{clientId}/stats`
جلب إحصائيات مفصلة للعميل.

**معاملات الاستعلام:**
- `period`: month|quarter|year|all
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "type": "year",
      "start": "2025-01-01T00:00:00.000Z",
      "end": "2025-12-31T23:59:59.000Z"
    },
    "financial": {
      "totalSpent": 4650000,
      "pendingPayments": 620000,
      "averageProjectValue": 485000,
      "monthlyAverage": 387500,
      "paymentReliability": "95%",
      "creditStatus": "excellent"
    },
    "projects": {
      "total": 13,
      "completed": 10,
      "active": 2,
      "cancelled": 1,
      "successRate": "92%",
      "averageDuration": "5.2 أيام"
    },
    "collaboration": {
      "favoriteCreators": [
        {
          "creatorId": "c_456def",
          "name": "أحمد محمد الربيعي",
          "projectsCount": 5,
          "rating": 4.8,
          "averageDeliveryTime": "4.2 أيام"
        },
        {
          "creatorId": "c_789ghi",
          "name": "فاطمة الزهراء",
          "projectsCount": 3,
          "rating": 4.9,
          "averageDeliveryTime": "3.8 أيام"
        }
      ],
      "preferredCategories": [
        {"category": "photo", "percentage": 70, "count": 9},
        {"category": "video", "percentage": 20, "count": 3},
        {"category": "design", "percentage": 10, "count": 1}
      ],
      "satisfaction": {
        "averageRating": 4.6,
        "totalReviews": 10,
        "recommendationRate": "90%"
      }
    },
    "growth": {
      "projectGrowth": "+25%",
      "spendingGrowth": "+18%",
      "frequencyIncrease": "+15%",
      "loyaltyScore": "high"
    }
  }
}
```

### `GET /clients/{clientId}/recommendations`
جلب توصيات مخصصة للعميل.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": {
      "creators": [
        {
          "creatorId": "c_new456",
          "name": "سارة أحمد الكردي",
          "specialization": "Food Photography",
          "rating": 4.8,
          "completedProjects": 23,
          "reasonForRecommendation": "متخصصة في تصوير الطعام مع أسلوب مشابه لتفضيلاتك",
          "availableForProject": true,
          "estimatedStartDate": "2025-09-01"
        }
      ],
      "services": [
        {
          "category": "video",
          "subcategory": "reels_30s",
          "title": "فيديوهات ريلز قصيرة",
          "description": "فيديوهات احترافية للترويج لأطباق المطعم على وسائل التواصل",
          "estimatedCost": "350,000 - 500,000 IQD",
          "popularityScore": 85
        }
      ],
      "bundles": [
        {
          "title": "باقة التصوير الشهرية",
          "description": "تصوير منتظم شهري للأطباق الجديدة والعروض الخاصة",
          "services": ["photo", "basic_editing", "social_media_format"],
          "discount": 15,
          "estimatedSavings": "200,000 IQD",
          "validUntil": "2025-09-30"
        }
      ]
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [المصادقة والأمان](../core/01-authentication.md)
- [نظام المبدعين](./01-creators.md)
- [إدارة المشاريع](./03-projects.md)
- [نظام التسعير](./04-pricing.md)
- [نظام الإشعارات](./06-notifications.md)
- [لوحة الأدمن](../admin/01-admin-panel.md)
- [رموز الأخطاء](../core/04-error-handling.md)
