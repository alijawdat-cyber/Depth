# 🌱 إدارة البذور (Seeds Management) - Depth API v2.0

> مصطلحات هذا المستند:
> - واجهة برمجة التطبيقات: Application Programming Interface — API
> - التحكم بالوصول المعتمد على الأدوار: Role-Based Access Control — RBAC
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

---

## المحتويات
- [نظرة عامة](#نظرة-عامة)
- [إدارة الفئات الرئيسية](#إدارة-الفئات-الرئيسية)
- [إدارة الفئات الفرعية](#إدارة-الفئات-الفرعية)
- [إدارة الأسعار الأساسية](#إدارة-الأسعار-الأساسية)
- [ربط الفئات بالمجالات](#ربط-الفئات-بالمجالات)
- [إدارة المعدلات والمعاملات](#إدارة-المعدلات-والمعاملات)
- [النظام الأرشيفي](#النظام-الأرشيفي)

---

## نظرة عامة

نظام إدارة البذور (Seeds) يسمح للأدمن بإدارة جميع البيانات الأساسية للنظام بما في ذلك:
- الفئات الرئيسية والفرعية
- الأسعار الأساسية لكل فئة فرعية
- ربط الفئات بمجالات العمل
- المعدلات والمعاملات
- الأرشفة والاستعادة

**🔒 تنبيه أمني:** جميع APIs في هذا القسم تتطلب صلاحيات Admin فقط.

---

## إدارة الفئات الرئيسية

### `GET /admin/seeds/categories`
جلب جميع الفئات الرئيسية.

**المصادقة:** Admin only

**معاملات الاستعلام:**
- `include_archived`: true|false - تضمين المؤرشفة
- `include_subcategories`: true|false - تضمين الفئات الفرعية

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "photo",
        "name": "التصوير الفوتوغرافي",
        "nameEn": "Photography",
        "description": "جميع أنواع خدمات التصوير الاحترافي",
        "icon": "📸",
        "color": "#4CAF50",
        "sortOrder": 1,
        "isActive": true,
        "subcategoriesCount": 10,
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-20T14:30:00.000Z"
      },
      {
        "id": "video", 
        "name": "التصوير المرئي",
        "nameEn": "Videography", 
        "description": "إنتاج وتصوير المحتوى المرئي",
        "icon": "🎥",
        "color": "#2196F3", 
        "sortOrder": 2,
        "isActive": true,
        "subcategoriesCount": 5,
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-20T14:30:00.000Z"
      },
      {
        "id": "design",
        "name": "التصميم الجرافيكي", 
        "nameEn": "Graphic Design",
        "description": "تصميم الهويات البصرية والمطبوعات",
        "icon": "🎨",
        "color": "#FF9800",
        "sortOrder": 3,
        "isActive": true,
        "subcategoriesCount": 8,
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-20T14:30:00.000Z"
      },
      {
        "id": "editing",
        "name": "المونتاج والمعالجة",
        "nameEn": "Post-Production",
        "description": "مونتاج وتحرير المحتوى المرئي",
        "icon": "🎬",
        "color": "#9C27B0",
        "sortOrder": 4,
        "isActive": true,
        "subcategoriesCount": 5,
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-20T14:30:00.000Z"
      }
    ],
    "summary": {
      "totalActive": 4,
      "totalArchived": 0,
      "totalSubcategories": 28
    }
  },
  "message": "تم جلب الفئات الرئيسية بنجاح"
}
```

### `POST /admin/seeds/categories`
إضافة فئة رئيسية جديدة.

**الطلب:**
```json
{
  "id": "content_writing",
  "name": "كتابة المحتوى",
  "nameEn": "Content Writing",
  "description": "كتابة المحتوى التسويقي والإبداعي",
  "icon": "📝",
  "color": "#607D8B",
  "sortOrder": 5
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "content_writing",
      "name": "كتابة المحتوى",
      "nameEn": "Content Writing",
      "description": "كتابة المحتوى التسويقي والإبداعي",
      "icon": "📝",
      "color": "#607D8B",
      "sortOrder": 5,
      "isActive": true,
      "subcategoriesCount": 0,
      "createdAt": "2025-08-21T15:30:00.000Z",
      "updatedAt": "2025-08-21T15:30:00.000Z"
    }
  },
  "message": "تم إضافة الفئة الرئيسية بنجاح"
}
```

---

## إدارة الفئات الفرعية

### `GET /admin/seeds/subcategories`
جلب جميع الفئات الفرعية.

**معاملات الاستعلام:**
- `categoryId`: فلترة حسب الفئة الرئيسية
- `include_archived`: تضمين المؤرشفة
- `include_pricing`: تضمين الأسعار
- `include_industries`: تضمين المجالات المرتبطة

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "subcategories": [
      {
        "id": "flatlay",
        "categoryId": "photo",
        "name": "فلات لاي",
        "nameEn": "Flat Lay",
        "description": "تصوير المنتجات بطريقة مسطحة من الأعلى",
        "basePrice": 10000,
        "currency": "IQD",
        "estimatedDuration": "2-3 ساعات",
        "skillLevel": "beginner", // beginner|intermediate|advanced
        "isActive": true,
        "sortOrder": 1,
        "linkedIndustries": [
          "restaurants",
          "fashion", 
          "beauty",
          "ecommerce"
        ],
        "requirements": [
          "كاميرا DSLR أو Mirrorless",
          "عدسة ماكرو أو 50mm",
          "إضاءة طبيعية أو صناعية",
          "خلفيات متنوعة"
        ],
        "deliverables": [
          "5-10 صور عالية الجودة",
          "تحرير أساسي",
          "ملفات JPG + RAW"
        ],
        "popularityScore": 8.5,
        "averageRating": 4.6,
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-20T14:30:00.000Z"
      },
      {
        "id": "product_photography",
        "categoryId": "photo",
        "name": "تصوير منتجات",
        "nameEn": "Product Photography",
        "description": "تصوير احترافي للمنتجات التجارية",
        "basePrice": 8000,
        "currency": "IQD",
        "estimatedDuration": "1-2 ساعة",
        "skillLevel": "intermediate",
        "isActive": true,
        "sortOrder": 2,
        "linkedIndustries": [
          "ecommerce",
          "fashion",
          "electronics",
          "beauty"
        ],
        "requirements": [
          "كاميرا احترافية",
          "عدسة ماكرو",
          "لايت بوكس أو إضاءة استوديو",
          "ترايبود"
        ],
        "deliverables": [
          "صور بخلفية بيضاء",
          "صور بخلفية شفافة",
          "تحرير متقدم",
          "أحجام متعددة"
        ],
        "popularityScore": 9.2,
        "averageRating": 4.8,
        "createdAt": "2025-08-01T10:00:00.000Z",
        "updatedAt": "2025-08-20T14:30:00.000Z"
      }
    ],
    "summary": {
      "totalActive": 28,
      "totalArchived": 3,
      "averageBasePrice": 42857,
      "mostPopular": "product_photography",
      "highestRated": "event_photography"
    }
  },
  "message": "تم جلب الفئات الفرعية بنجاح"
}
```

### `POST /admin/seeds/subcategories`
إضافة فئة فرعية جديدة.

**الطلب:**
```json
{
  "categoryId": "photo",
  "id": "drone_photography",
  "name": "التصوير الجوي",
  "nameEn": "Drone Photography",
  "description": "تصوير جوي بالطائرات المسيرة",
  "basePrice": 150000,
  "estimatedDuration": "4-6 ساعات",
  "skillLevel": "advanced",
  "requirements": [
    "طائرة مسيرة احترافية",
    "رخصة طيران",
    "كاميرا 4K",
    "بطاريات إضافية"
  ],
  "deliverables": [
    "صور جوية عالية الدقة",
    "فيديو 4K (اختياري)",
    "تحرير احترافي",
    "ملفات RAW"
  ],
  "linkedIndustries": [
    "real_estate",
    "construction",
    "events", 
    "tourism"
  ],
  "sortOrder": 11
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "subcategory": {
      "id": "drone_photography",
      "categoryId": "photo",
      "name": "التصوير الجوي",
      "nameEn": "Drone Photography",
      "basePrice": 150000,
      "isActive": true,
      "createdAt": "2025-08-21T15:45:00.000Z"
    }
  },
  "message": "تم إضافة الفئة الفرعية بنجاح"
}
```

### `PUT /admin/seeds/subcategories/{subcategoryId}`
تحديث فئة فرعية.

**الطلب:**
```json
{
  "basePrice": 12000,
  "description": "تصوير المنتجات بطريقة مسطحة من الأعلى مع تنسيق إبداعي",
  "estimatedDuration": "2-4 ساعات",
  "deliverables": [
    "5-15 صور عالية الجودة",
    "تحرير احترافي",
    "ملفات JPG + RAW",
    "نسخة للسوشال ميديا"
  ]
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "subcategory": {
      "id": "flatlay",
      "basePrice": 12000,
      "priceChangeLog": [
        {
          "previousPrice": 10000,
          "newPrice": 12000,
          "changeDate": "2025-08-21T15:50:00.000Z",
          "reason": "تحديث أسعار السوق"
        }
      ],
      "updatedAt": "2025-08-21T15:50:00.000Z"
    }
  },
  "message": "تم تحديث الفئة الفرعية بنجاح"
}
```

---

## إدارة الأسعار الأساسية

### `GET /admin/seeds/pricing-overview`
نظرة عامة على جميع الأسعار.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "pricingOverview": {
      "categories": {
        "photo": {
          "categoryName": "التصوير الفوتوغرافي",
          "subcategoriesCount": 10,
          "priceRange": {
            "min": 8000,
            "max": 50000,
            "average": 18500
          },
          "subcategories": [
            {
              "id": "flatlay",
              "name": "فلات لاي", 
              "currentPrice": 12000,
              "previousPrice": 10000,
              "lastUpdated": "2025-08-21T15:50:00.000Z",
              "priceChangePercentage": 20.0
            },
            {
              "id": "product_photography",
              "name": "تصوير منتجات",
              "currentPrice": 8000,
              "previousPrice": 8000,
              "lastUpdated": "2025-08-01T10:00:00.000Z",
              "priceChangePercentage": 0.0
            }
          ]
        },
        "video": {
          "categoryName": "التصوير المرئي",
          "subcategoriesCount": 5,
          "priceRange": {
            "min": 35000,
            "max": 250000,
            "average": 102000
          }
        },
        "design": {
          "categoryName": "التصميم الجرافيكي", 
          "subcategoriesCount": 8,
          "priceRange": {
            "min": 5000,
            "max": 200000,
            "average": 52500
          }
        },
        "editing": {
          "categoryName": "المونتاج والمعالجة",
          "subcategoriesCount": 5,
          "priceRange": {
            "min": 15000,
            "max": 50000,
            "average": 30000
          }
        }
      },
      "marketAnalysis": {
        "totalPricePoints": 28,
        "averageMarketPrice": 50750,
        "mostExpensiveService": {
          "id": "corporate_video",
          "name": "فيديو تعريفي",
          "price": 250000
        },
        "mostAffordableService": {
          "id": "social_media_post",
          "name": "منشور سوشيال ميديا",
          "price": 5000
        },
        "recentChanges": [
          {
            "subcategoryId": "flatlay",
            "changeType": "increase",
            "percentage": 20.0,
            "date": "2025-08-21"
          }
        ]
      }
    }
  },
  "message": "تم جلب نظرة عامة على الأسعار بنجاح"
}
```

### `POST /admin/seeds/bulk-price-update`
تحديث أسعار متعددة دفعة واحدة.

**الطلب:**
```json
{
  "updates": [
    {
      "subcategoryId": "flatlay",
      "newPrice": 15000,
      "reason": "زيادة تكاليف المعدات"
    },
    {
      "subcategoryId": "product_photography", 
      "newPrice": 10000,
      "reason": "تحديث أسعار السوق"
    }
  ],
  "effectiveDate": "2025-09-01",
  "notifyCreators": true
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "bulkUpdate": {
      "totalUpdated": 2,
      "successful": 2,
      "failed": 0,
      "effectiveDate": "2025-09-01T00:00:00.000Z",
      "updates": [
        {
          "subcategoryId": "flatlay",
          "previousPrice": 12000,
          "newPrice": 15000,
          "status": "success"
        },
        {
          "subcategoryId": "product_photography",
          "previousPrice": 8000, 
          "newPrice": 10000,
          "status": "success"
        }
      ],
      "affectedCreators": 23,
      "notificationsSent": true
    }
  },
  "message": "تم تحديث الأسعار بنجاح"
}
```

---

## ربط الفئات بالمجالات

### `GET /admin/seeds/category-industry-mapping`
جلب خريطة ربط الفئات بالمجالات.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "mappings": {
      "restaurants": {
        "industryName": "مطاعم وكافيهات",
        "linkedSubcategories": [
          {
            "id": "food_photography",
            "name": "تصوير طعام",
            "category": "photo",
            "relevanceScore": 10
          },
          {
            "id": "menu_design", 
            "name": "تصميم منيو",
            "category": "design",
            "relevanceScore": 9
          },
          {
            "id": "reels_30s",
            "name": "ريلز 30 ثانية",
            "category": "video", 
            "relevanceScore": 8
          }
        ],
        "totalLinked": 8
      },
      "beauty": {
        "industryName": "عيادات تجميل",
        "linkedSubcategories": [
          {
            "id": "before_after",
            "name": "قبل/بعد",
            "category": "photo",
            "relevanceScore": 10
          },
          {
            "id": "portrait",
            "name": "بورتريه",
            "category": "photo",
            "relevanceScore": 9
          }
        ],
        "totalLinked": 6
      }
    },
    "summary": {
      "totalIndustries": 10,
      "totalMappings": 156,
      "averageLinksPerIndustry": 15.6,
      "mostLinkedIndustry": "ecommerce",
      "leastLinkedIndustry": "hospitals"
    }
  },
  "message": "تم جلب خريطة الربط بنجاح"
}
```

### `PUT /admin/seeds/category-industry-mapping/{industryId}`
تحديث ربط مجال بالفئات الفرعية.

**الطلب:**
```json
{
  "linkedSubcategories": [
    {
      "subcategoryId": "food_photography",
      "relevanceScore": 10
    },
    {
      "subcategoryId": "menu_design", 
      "relevanceScore": 9
    },
    {
      "subcategoryId": "reels_30s",
      "relevanceScore": 8
    },
    {
      "subcategoryId": "interior_photography",
      "relevanceScore": 7
    }
  ]
}
```

---

## النظام الأرشيفي

### `POST /admin/seeds/subcategories/{subcategoryId}/archive`
أرشفة فئة فرعية (إخفاء بدلاً من حذف).

**الطلب:**
```json
{
  "reason": "انخفاض الطلب على هذه الخدمة",
  "archiveDate": "2025-09-01",
  "notifyCreators": true
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "archivedSubcategory": {
      "id": "360_photography",
      "name": "تصوير 360 درجة",
      "archivedAt": "2025-09-01T00:00:00.000Z",
      "archivedBy": "admin@depth-agency.com",
      "reason": "انخفاض الطلب على هذه الخدمة",
      "affectedCreators": 5,
      "activeProjects": 0
    }
  },
  "message": "تم أرشفة الفئة الفرعية بنجاح"
}
```

### `POST /admin/seeds/subcategories/{subcategoryId}/restore`
استعادة فئة فرعية من الأرشيف.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "restoredSubcategory": {
      "id": "360_photography",
      "name": "تصوير 360 درجة",
      "restoredAt": "2025-08-21T16:00:00.000Z",
      "restoredBy": "admin@depth-agency.com",
      "isActive": true
    }
  },
  "message": "تم استعادة الفئة الفرعية بنجاح"
}
```

### `GET /admin/seeds/archive-history`
سجل عمليات الأرشفة والاستعادة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "archiveHistory": [
      {
        "id": "arch_123abc",
        "subcategoryId": "360_photography", 
        "subcategoryName": "تصوير 360 درجة",
        "action": "archived",
        "performedBy": "admin@depth-agency.com",
        "performedAt": "2025-09-01T00:00:00.000Z",
        "reason": "انخفاض الطلب على هذه الخدمة",
        "affectedCreators": 5,
        "affectedProjects": 0
      },
      {
        "id": "arch_456def",
        "subcategoryId": "360_photography",
        "subcategoryName": "تصوير 360 درجة", 
        "action": "restored",
        "performedBy": "admin@depth-agency.com",
        "performedAt": "2025-08-21T16:00:00.000Z",
        "reason": "زيادة الطلب مرة أخرى"
      }
    ],
    "summary": {
      "totalArchived": 3,
      "totalRestored": 1,
      "currentlyArchived": 2,
      "mostRecentAction": "2025-08-21T16:00:00.000Z"
    }
  },
  "message": "تم جلب سجل الأرشيف بنجاح"
}
```

---

## معايير الخطأ

### أخطاء البذور

```json
{
  "CATEGORY_NOT_FOUND": {
    "code": 404,
    "message": "الفئة غير موجودة"
  },
  "SUBCATEGORY_NOT_FOUND": {
    "code": 404,
    "message": "الفئة الفرعية غير موجودة"
  },
  "SUBCATEGORY_HAS_ACTIVE_PROJECTS": {
    "code": 400,
    "message": "لا يمكن أرشفة فئة فرعية لها مشاريع نشطة"
  },
  "DUPLICATE_SUBCATEGORY_ID": {
    "code": 400,
    "message": "معرف الفئة الفرعية موجود بالفعل"
  },
  "INVALID_PRICE_VALUE": {
    "code": 400,
    "message": "قيمة السعر يجب أن تكون أكبر من صفر"
  },
  "CATEGORY_ARCHIVED": {
    "code": 400,
    "message": "لا يمكن إضافة فئة فرعية لفئة مؤرشفة"
  }
}
```

---

*هذا الملف يكمل النواقص في إدارة البذور والبيانات الأساسية للنظام.*

---

## 🔗 الملفات ذات الصلة

- [لوحة الأدمن](./01-admin-panel.md)
- [نظام التسعير](../features/04-pricing.md)
- [نظام المبدعين](../features/01-creators.md)
- [نظام العملاء](../features/02-clients.md)
- [قاموس البيانات](../../02-database/00-data-dictionary.md)

*آخر تحديث: 2025-08-23 | النسخة: V2.0 | الحالة: Active*
