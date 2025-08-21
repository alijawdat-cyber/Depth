
# 💰 نظام التسعير والفوترة - Depth API v2.0

✅ **تم تحديث هذا الملف ليحقق توافق 100% مع [`requirements-v2.0.md`](../requirements-v2.0.md)**

### التحسينات المطبقة:
- ✅ **هامش الوكالة**: موحد في النطاق 10%-50%
- ✅ **معاملات الموقع**: تم استبدالها بإضافات ثابتة
- ✅ **معادلات التسعير**: متطابقة مع requirements
- 🔗 **التكامل**: مع [`02-creators-api.md`](02-creators-api.md) و [`02b-salaried-employees-api.md`](02b-salaried-employees-api.md)

---

## المحتويات
- [آلية هامش الوكالة المتغير](#آلية-هامش-الوكالة-المتغير)
- [معادلات التسعير المُوحدة](#معادلات-التسعير-المُوحدة)
- [هيكل التسعير](#هيكل-التسعير)
- [حساب التكاليف](#حساب-التكاليف)
- [إدارة العروض](#إدارة-العروض)
- [الفوترة والدفع](#الفوترة-والدفع)
- [التقارير المالية](#التقارير-المالية)

---

## آلية هامش الوكالة المتغير

### نظرة عامة
تطبق منصة Depth نظام هامش وكالة متغير يتراوح من **10% إلى 50%** حسب عوامل متعددة، مما يضمن مرونة في التسعير وتحفيز الأداء.

### معايير تحديد نسبة الهامش

#### 1. حسب مستوى خبرة المبدع
```json
{
  "creatorExperienceLevels": {
    "beginner": {
  "agencyFeeRange": "10-50%",
      "description": "مبدعون جدد (أقل من 10 مشاريع)",
      "incentive": "هامش منخفض لتشجيع البدء"
    },
    "intermediate": {
  "agencyFeeRange": "10-50%",
      "description": "مبدعون متوسطون (10-50 مشروع)",
      "factors": ["جودة العمل", "تقييم العملاء", "الالتزام بالمواعيد"]
    },
    "expert": {
  "agencyFeeRange": "10-50%",
      "description": "خبراء معتمدون (50+ مشروع)",
      "benefits": ["أولوية في المشاريع", "دعم تسويقي"]
    },
    "premium": {
  "agencyFeeRange": "10-50%",
      "description": "مبدعون مميزون وشركاء استراتيجيون",
      "criteria": ["تقييم 4.8+", "معدل إكمال 95%+", "عملاء VIP"]
    }
  }
}
```

#### 2. حسب نوع ومعقدة المشروع
```json
{
  "projectComplexityModifiers": {
    "simple": {
      "modifier": "+0%",
      "examples": ["منشور واحد", "صورة بسيطة"],
      "description": "مشاريع روتينية قياسية"
    },
    "standard": {
      "modifier": "+5%",
      "examples": ["حملة صغيرة", "جلسة تصوير عادية"],
      "description": "مشاريع تتطلب تنسيق متوسط"
    },
    "complex": {
      "modifier": "+10%",
      "examples": ["إنتاج فيديو كامل", "حملة متكاملة"],
      "description": "مشاريع تتطلب إدارة مكثفة"
    },
    "enterprise": {
      "modifier": "+15%",
      "examples": ["مشاريع طويلة المدى", "عقود سنوية"],
      "description": "مشاريع تتطلب دعم مخصص"
    }
  }
}
```

#### 3. حسب قيمة المشروع
```json
{
  "projectValueTiers": {
    "micro": {
      "range": "0-500,000 IQD",
  "agencyFeeRange": "10-50%",
      "rationale": "مشاريع صغيرة، هامش منخفض لتعزيز الحجم"
    },
    "small": {
      "range": "500,000-1,500,000 IQD", 
  "agencyFeeRange": "10-50%",
      "rationale": "المجال الأساسي للعمل"
    },
    "medium": {
      "range": "1,500,000-5,000,000 IQD",
  "agencyFeeRange": "10-50%",
      "rationale": "مشاريع متوسطة تتطلب إدارة أكثر"
    },
    "large": {
      "range": "5,000,000+ IQD",
  "agencyFeeRange": "10-50%",
      "rationale": "مشاريع كبيرة بدعم شامل ومخاطر أعلى"
    }
  }
}
```

#### 4. العوامل الإضافية
```json
{
  "additionalFactors": {
    "urgency": {
      "rush24h": "+5%",
      "rush48h": "+3%",
      "weekend": "+4%"
    },
    "clientType": {
      "newClient": "+2%",
      "vipClient": "+5%",
      "enterprise": "+8%"
    },
    "seasonality": {
      "peakSeason": "+3%",
      "lowSeason": "-2%"
    },
    "marketDemand": {
      "highDemand": "+5%",
      "lowDemand": "-3%"
    }
  }
}
```

### مثال حساب الهامش المتغير
```json
{
  "calculationExample": {
    "baseProjectValue": 1000000,
    "creator": {
      "level": "expert",
      "baseAgencyFee": "25%"
    },
    "projectModifiers": {
      "complexity": "complex (+10%)",
      "urgency": "rush24h (+5%)",
      "clientType": "vipClient (+5%)"
    },
    "calculation": {
      "basePercentage": 25,
      "modifiers": 20,
      "finalAgencyFee": 45,
      "cappedAt": 50,
      "appliedFee": "45%"
    },
    "breakdown": {
      "creatorEarnings": 550000,
      "agencyFee": 450000,
      "totalProjectValue": 1000000
    }
  }
}
```

---

## معادلات التسعير المُوحدة

### المعادلات المعتمدة (متوافقة مع requirements v2.0):

#### 1. للمبدع مع معدات خاصة:
```javascript
CreatorPrice = BasePrice × OwnershipFactor × ProcessingMod × ExperienceMod × EquipmentMod × RushMod + LocationAddition
```

#### 2. للمبدع بدون معدات (يستخدم معدات الوكالة):
```javascript  
CreatorPrice = (BasePrice × 0.9) × ProcessingMod × ExperienceMod × RushMod + LocationAddition
```

#### 3. للموظف براتب ثابت:
```javascript
CreatorPrice = 0 // محسوب ضمن الراتب
```

#### 4. سعر العميل النهائي:
```javascript
ClientPrice = CreatorPrice + AgencyMargin
// أو
ClientPrice = CreatorPrice × (1 + AgencyMarginPercent)

// حيث AgencyMarginPercent يتراوح من 10% إلى 50%
```

### ملاحظات مهمة:
- **تم حذف معاملات الموقع النسبية (LocationMod)** واستبدالها بـ **إضافات ثابتة (LocationAddition)**
- **هامش الوكالة متغير** يتراوح من **10% إلى 50%** حسب المعايير المحددة
- جميع المعادلات **متوافقة 100%** مع متطلبات النسخة 2.0

---

## هيكل التسعير

### `GET /pricing/categories`
جلب جميع فئات الخدمات والتسعير.

**معاملات الاستعلام:**
- `location`: الموقع الجغرافي
- `includeAddons`: تضمين الخدمات الإضافية
- `currency`: العملة المطلوبة

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "pricingStructure": {
      "baseCurrency": "IQD",
      "exchangeRates": {
        "USD": 1485,
        "EUR": 1623,
        "updatedAt": "2025-08-26T12:00:00.000Z"
      },
      "categories": [
        {
          "id": "photo",
          "name": "التصوير الفوتوغرافي",
          "description": "خدمات التصوير الاحترافي لجميع الأغراض",
          "subcategories": [
            {
              "id": "flatlay",
              "name": "فلات لاي",
              "basePrice": 10000,
              "currency": "IQD",
              "unit": "per_session",
              "duration": "2-3 ساعات",
              "includes": ["5-10 صور معالجة", "ملفات JPG + RAW"]
            },
            {
              "id": "before_after",
              "name": "قبل/بعد",
              "basePrice": 15000,
              "currency": "IQD",
              "unit": "per_session", 
              "duration": "2-4 ساعات",
              "includes": ["صور قبل وبعد", "تحرير احترافي"]
            },
            {
              "id": "portrait",
              "name": "بورتريه",
              "basePrice": 12000,
              "currency": "IQD",
              "unit": "per_session",
              "duration": "1-2 ساعة",
              "includes": ["5-15 صور معالجة", "تحرير احترافي"]
            },
            {
              "id": "on_model",
              "name": "على موديل",
              "basePrice": 20000,
              "currency": "IQD", 
              "unit": "per_session",
              "duration": "3-5 ساعات",
              "includes": ["10-20 صور معالجة", "تنسيق مع الموديل"]
            },
            {
              "id": "on_mannequin", 
              "name": "على مانيكان",
              "basePrice": 15000,
              "currency": "IQD",
              "unit": "per_session",
              "duration": "2-3 ساعات",
              "includes": ["8-15 صور معالجة", "إعداد المانيكان"]
            },
            {
              "id": "food_photography",
              "name": "تصوير طعام", 
              "basePrice": 10000,
              "currency": "IQD",
              "unit": "per_session",
              "duration": "2-4 ساعات",
              "includes": ["صور أطباق متعددة", "تنسيق إبداعي"]
            },
            {
              "id": "product_photography",
              "name": "تصوير منتجات",
              "basePrice": 8000,
              "currency": "IQD",
              "unit": "per_session", 
              "duration": "1-2 ساعة",
              "includes": ["صور بخلفية بيضاء", "زوايا متعددة"]
            },
            {
              "id": "360_photography",
              "name": "تصوير 360 درجة",
              "basePrice": 25000,
              "currency": "IQD",
              "unit": "per_product",
              "duration": "2-3 ساعات",
              "includes": ["360° تفاعلي", "تحرير متخصص"]
            },
            {
              "id": "interior_photography",
              "name": "تصوير داخلي",
              "basePrice": 30000,
              "currency": "IQD",
              "unit": "per_space",
              "duration": "3-5 ساعات",
              "includes": ["صور معمارية", "إضاءة احترافية"]
            },
            {
              "id": "event_photography",
              "name": "تصوير فعاليات",
              "basePrice": 50000,
              "currency": "IQD",
              "unit": "per_hour",
              "duration": "حسب الحدث",
              "includes": ["تغطية شاملة", "تسليم سريع"]
            }
          ]
        },
        {
          "id": "video",
          "name": "التصوير المرئي",
          "description": "إنتاج وتصوير المحتوى المرئي",
          "subcategories": [
            {
              "id": "reels_30s",
              "name": "ريلز 30 ثانية",
              "basePrice": 35000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "2-4 ساعات إنتاج",
              "includes": ["مونتاج احترافي", "موسيقى", "تأثيرات"]
            },
            {
              "id": "video_1min",
              "name": "فيديو دقيقة",
              "basePrice": 75000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "4-6 ساعات إنتاج",
              "includes": ["سيناريو", "تصوير", "مونتاج كامل"]
            },
            {
              "id": "video_3min", 
              "name": "فيديو 3 دقائق",
              "basePrice": 150000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "1-2 يوم إنتاج",
              "includes": ["إنتاج متكامل", "عدة مواقع", "فريق عمل"]
            },
            {
              "id": "corporate_video",
              "name": "فيديو تعريفي", 
              "basePrice": 250000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "3-5 أيام إنتاج",
              "includes": ["سيناريو احترافي", "ممثلين", "إنتاج كامل"]
            },
            {
              "id": "event_coverage",
              "name": "تغطية فعالية",
              "basePrice": 100000,
              "currency": "IQD", 
              "unit": "per_hour",
              "duration": "حسب الحدث",
              "includes": ["كاميرات متعددة", "مونتاج سريع", "هايلايت"]
            }
          ]
        },
        {
          "id": "design",
          "name": "التصميم الجرافيكي",
          "description": "تصميم الهويات البصرية والمطبوعات",
          "subcategories": [
            {
              "id": "logo_design",
              "name": "تصميم شعار",
              "basePrice": 50000,
              "currency": "IQD",
              "unit": "per_logo",
              "duration": "3-5 أيام",
              "includes": ["مفاهيم متعددة", "مراجعات", "ملفات متنوعة"]
            },
            {
              "id": "brand_identity",
              "name": "هوية بصرية",
              "basePrice": 200000,
              "currency": "IQD",
              "unit": "per_package",
              "duration": "1-2 أسبوع",
              "includes": ["شعار", "ألوان", "خطوط", "تطبيقات"]
            },
            {
              "id": "social_media_post",
              "name": "منشور سوشيال ميديا",
              "basePrice": 5000,
              "currency": "IQD",
              "unit": "per_post",
              "duration": "1-2 ساعة",
              "includes": ["تصميم مخصص", "نص إبداعي (اختياري)"]
            },
            {
              "id": "brochure_design",
              "name": "تصميم بروشور",
              "basePrice": 30000,
              "currency": "IQD",
              "unit": "per_brochure",
              "duration": "2-3 أيام",
              "includes": ["تصميم ثنائي الطية", "ملفات طباعة"]
            },
            {
              "id": "menu_design",
              "name": "تصميم منيو",
              "basePrice": 40000,
              "currency": "IQD",
              "unit": "per_menu",
              "duration": "3-5 أيام", 
              "includes": ["تصميم كامل", "صور الأطباق", "أسعار"]
            },
            {
              "id": "poster_design",
              "name": "تصميم بوستر",
              "basePrice": 20000,
              "currency": "IQD",
              "unit": "per_poster",
              "duration": "1-2 يوم",
              "includes": ["تصميم إبداعي", "ملفات عالية الدقة"]
            },
            {
              "id": "business_card",
              "name": "بطاقة عمل",
              "basePrice": 15000,
              "currency": "IQD",
              "unit": "per_design",
              "duration": "1-2 يوم",
              "includes": ["وجهين", "ملفات طباعة"]
            },
            {
              "id": "packaging_design",
              "name": "تصميم تغليف",
              "basePrice": 60000,
              "currency": "IQD",
              "unit": "per_package",
              "duration": "5-7 أيام",
              "includes": ["تصميم 3D", "قوالب طباعة"]
            }
          ]
        },
        {
          "id": "editing", 
          "name": "المونتاج والمعالجة",
          "description": "مونتاج وتحرير المحتوى المرئي",
          "subcategories": [
            {
              "id": "basic_edit",
              "name": "مونتاج أساسي",
              "basePrice": 20000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "1-2 يوم",
              "includes": ["قص وربط", "تصحيح ألوان بسيط"]
            },
            {
              "id": "advanced_edit", 
              "name": "مونتاج متقدم",
              "basePrice": 40000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "2-3 أيام",
              "includes": ["مؤثرات", "انتقالات", "تصحيح صوت"]
            },
            {
              "id": "color_grading",
              "name": "تصحيح ألوان",
              "basePrice": 15000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "1 يوم",
              "includes": ["تدرج لوني احترافي", "مطابقة ألوان"]
            },
            {
              "id": "effects_addition",
              "name": "إضافة مؤثرات",
              "basePrice": 25000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "1-2 يوم",
              "includes": ["مؤثرات بصرية", "تحسينات صوتية"]
            },
            {
              "id": "motion_graphics",
              "name": "موشن جرافيك",
              "basePrice": 50000,
              "currency": "IQD",
              "unit": "per_video",
              "duration": "3-5 أيام",
              "includes": ["رسوم متحركة", "نصوص ديناميكية", "انفوجرافيك"]
            }
          ]
        }
      ],
                "تصوير احترافي",
                "معالجة أساسية",
                "10-15 صورة نهائية",
                "نسختان للمراجعة"
              ],
              "addons": [
                {
                  "id": "extra_editing",
                  "name": "معالجة متقدمة",
                  "price": 75000,
                  "description": "تعديلات متقدمة وتحسينات خاصة"
                },
                {
                  "id": "rush_delivery",
                  "name": "تسليم سريع",
                  "price": 150000,
                  "description": "تسليم خلال 24 ساعة"
                }
              ],
              "locationAdditions": {
                "studio": 0, // استوديو الوكالة - بدون إضافة
                "client_location_baghdad": 0, // موقع العميل داخل بغداد
                "client_location_outskirts": 25000, // أطراف بغداد
                "nearby_provinces": 50000, // محافظات مجاورة
                "far_provinces": 100000 // محافظات بعيدة
              },
              "note": "تم استبدال معاملات الموقع النسبية بإضافات ثابتة - متوافق مع requirements v2.0"
            },
            {
              "id": "food",
              "name": "تصوير الطعام",
              "basePrice": 380000,
              "currency": "IQD",
              "unit": "per_session",
              "includes": [
                "تصوير احترافي مع إضاءة خاصة",
                "تنسيق وتزيين الأطباق",
                "معالجة متخصصة للطعام",
                "15-20 صورة نهائية"
              ]
            },
            {
              "id": "events",
              "name": "تصوير الفعاليات",
              "basePrice": 320000,
              "currency": "IQD",
              "unit": "per_hour",
              "minimumHours": 3,
              "includes": [
                "تغطية شاملة للفعالية",
                "صور طبيعية ومُوجهة",
                "معالجة سريعة",
                "تسليم خلال 48 ساعة"
              ]
            }
          ]
        },
        {
          "id": "video",
          "name": "إنتاج الفيديو",
          "description": "خدمات إنتاج الفيديو الاحترافي",
          "subcategories": [
            {
              "id": "reels_30s",
              "name": "ريلز قصيرة (30 ثانية)",
              "basePrice": 280000,
              "currency": "IQD",
              "includes": [
                "كتابة السيناريو",
                "تصوير احترافي",
                "مونتاج وتأثيرات",
                "موسيقى وأصوات"
              ]
            },
            {
              "id": "commercial_60s",
              "name": "إعلان تجاري (60 ثانية)",
              "basePrice": 850000,
              "currency": "IQD",
              "includes": [
                "تطوير المفهوم الإبداعي",
                "يوم تصوير كامل",
                "مونتاج احترافي",
                "موسيقى أصلية"
              ]
            }
          ]
        },
        {
          "id": "design",
          "name": "التصميم الجرافيكي",
          "subcategories": [
            {
              "id": "logo",
              "name": "تصميم الشعار",
              "basePrice": 200000,
              "currency": "IQD",
              "includes": [
                "3 مفاهيم أولية",
                "مراجعتان مجانيتان",
                "ملفات بصيغ متعددة"
              ]
            },
            {
              "id": "social_media_posts",
              "name": "منشورات وسائل التواصل",
              "basePrice": 85000,
              "currency": "IQD",
              "unit": "per_design",
              "minimumOrder": 5
            }
          ]
        }
      ],
      "globalModifiers": {
        "urgentDelivery": {
          "24hours": 0.30, // زيادة 30%
          "48hours": 0.15,
          "weekend": 0.20
        },
        "revisions": {
          "included": 2,
          "additional": 35000
        },
        "agencyFee": {
          "type": "variable",
          "range": "10-50%",
          "minimum": 0.10, // 10% أقل قيمة
          "maximum": 0.50, // 50% أعلى قيمة  
          "defaultRate": 0.20, // 20% القيمة الافتراضية
          "factors": [
            "creator experience level",
            "project complexity", 
            "project value",
            "urgency",
            "client type",
            "market demand"
          ],
          "description": "هامش متغير يتراوح من 10% إلى 50% حسب معايير متعددة - متوافق مع requirements v2.0"
        }
      }
    }
  }
}
```

### `PUT /admin/pricing/base-prices`
تحديث الأسعار الأساسية (أدمن فقط).

**المصادقة:** Admin only

**الطلب:**
```json
{
  "updates": [
    {
      "subcategoryId": "flatlay",
      "newBasePrice": 12000,
      "reason": "تحديث أسعار السوق"
    },
    {
      "subcategoryId": "food_photography",
      "newBasePrice": 11000,
      "reason": "زيادة تكاليف المعدات"
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
    "priceUpdate": {
      "totalUpdated": 2,
      "successful": 2,
      "failed": 0,
      "effectiveDate": "2025-09-01T00:00:00.000Z",
      "updates": [
        {
          "subcategoryId": "flatlay",
          "previousPrice": 10000,
          "newPrice": 12000,
          "percentageChange": 20.0,
          "status": "success"
        },
        {
          "subcategoryId": "food_photography", 
          "previousPrice": 10000,
          "newPrice": 11000,
          "percentageChange": 10.0,
          "status": "success"
        }
      ],
      "affectedCreators": 28,
      "notificationsSent": true
    }
  },
  "message": "تم تحديث الأسعار الأساسية بنجاح"
}
```

---

## حساب التكاليف

### `POST /pricing/calculate`
حساب تكلفة مشروع محدد.

**الطلب:**
```json
{
  "project": {
    "category": "photo",
    "subcategory": "food",
    "duration": 1, // عدد الجلسات أو الساعات
    "location": "client_location",
    "urgency": "48hours",
    "addons": [
      {
        "id": "extra_editing",
        "quantity": 1
      },
      {
        "id": "social_formats",
        "quantity": 1
      }
    ],
    "extraRevisions": 1,
    "customRequirements": [
      {
        "description": "تصوير إضافي للأطباق الجانبية",
        "estimatedCost": 80000
      }
    ]
  },
  "client": {
    "location": {
      "governorate": "بغداد",
      "area": "الكرادة"
    },
    "type": "new", // new | returning | premium
    "discountEligible": true
  },
  "creator": {
    "id": "c_789ghi",
    "experienceLevel": "expert",
    "locationDistance": 5.2 // km
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "calculation": {
      "breakdown": {
        "baseService": {
          "category": "تصوير الطعام",
          "sessions": 1,
          "pricePerSession": 380000,
          "subtotal": 380000
        },
        "locationAdjustment": {
          "type": "client_location",
          "fee": 50000,
          "description": "رسوم الانتقال لموقع العميل"
        },
        "urgencyPremium": {
          "type": "48hours",
          "percentage": 15,
          "amount": 64500,
          "description": "رسوم التسليم السريع"
        },
        "addons": [
          {
            "id": "extra_editing",
            "name": "معالجة متقدمة",
            "quantity": 1,
            "unitPrice": 75000,
            "total": 75000
          },
          {
            "id": "social_formats",
            "name": "تنسيقات وسائل التواصل",
            "quantity": 1,
            "unitPrice": 45000,
            "total": 45000
          }
        ],
        "revisions": {
          "included": 2,
          "additional": 1,
          "pricePerRevision": 35000,
          "total": 35000
        },
        "customWork": {
          "description": "تصوير إضافي للأطباق الجانبية",
          "cost": 80000
        },
        "creatorPremium": {
          "level": "expert",
          "percentage": 10,
          "amount": 52950,
          "description": "علاوة المبدع الخبير"
        }
      },
      "subtotal": 682450,
      "agencyFee": {
        "basePercentage": 20,
        "modifiers": {
          "creatorLevel": "expert (+5%)",
          "projectComplexity": "standard (+5%)",
          "clientType": "new (+2%)"
        },
        "finalPercentage": 32,
        "amount": 218319,
        "calculation": "682450 × 32% = 218319"
      },
      "grossTotal": 900769,
      "discounts": [
        {
          "type": "new_client",
          "percentage": 5,
          "amount": 45038,
          "description": "خصم العميل الجديد"
        }
      ],
      "netTotal": 855731,
      "currency": "IQD",
      "netTotalUSD": 576.35,
      "exchangeRate": 1485,
      "validUntil": "2025-09-02T00:00:00.000Z"
    },
    "alternatives": [
      {
        "title": "باقة مبسطة",
        "changes": ["إزالة المعالجة المتقدمة", "تقليل عدد الصور"],
        "savings": 120000,
        "newTotal": 606127
      },
      {
        "title": "باقة ممتازة",
        "changes": ["إضافة تصوير فيديو قصير", "معالجة احترافية"],
        "additionalCost": 200000,
        "newTotal": 926127
      }
    ],
    "paymentOptions": {
      "fullPayment": {
        "amount": 726127,
        "discount": 2,
        "finalAmount": 711564
      },
      "splitPayment": {
        "deposit": 363064, // 50%
        "completion": 363063,
        "terms": "50% مقدم، 50% عند التسليم"
      }
    }
  }
}
```

### `GET /pricing/creator-rates/{creatorId}`
جلب معدلات تسعير مبدع محدد.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "creator": {
      "id": "c_789ghi",
      "name": "فاطمة الزهراء",
      "experienceLevel": "expert",
      "rating": 4.9,
      "completedProjects": 87
    },
    "rates": {
      "photo": {
        "product": {
          "baseRate": 450000,
          "premium": 1.10, // زيادة 10% للخبرة
          "finalRate": 495000
        },
        "food": {
          "baseRate": 380000,
          "premium": 1.15, // زيادة 15% للتخصص
          "finalRate": 437000
        },
        "events": {
          "baseRate": 320000,
          "premium": 1.05,
          "finalRate": 336000
        }
      },
      "video": {
        "reels_30s": {
          "baseRate": 280000,
          "premium": 1.20,
          "finalRate": 336000
        }
      }
    },
    "availability": {
      "status": "available",
      "nextAvailableDate": "2025-08-28",
      "bookingAdvance": "2-3 أيام"
    },
    "specializations": [
      "Food Photography",
      "Product Photography",
      "Social Media Content"
    ],
    "equipment": {
      "owned": ["Professional Camera", "Lighting Kit", "Editing Software"],
      "needsRental": []
    },
    "performance": {
      "onTimeDelivery": "96%",
      "clientSatisfaction": 4.8,
      "revisionRate": 1.2
    }
  }
}
```

---

## إدارة العروض

### `POST /quotes`
إنشاء عرض سعر جديد.

**الطلب:**
```json
{
  "clientId": "cl_123abc",
  "projectRequestId": "req_123abc",
  "title": "عرض سعر تصوير منتجات المطعم",
  "description": "تصوير احترافي لـ 20 طبق من القائمة الجديدة",
  "assignedCreator": "c_789ghi",
  "pricing": {
    "breakdown": {
      "baseService": 380000,
      "locationFee": 50000,
      "addons": 120000,
      "subtotal": 550000,
      "agencyFee": {
        "calculation": {
          "basePercentage": 20,
          "modifiers": {
            "creatorLevel": "expert (+5%)",
            "clientType": "repeat (-2%)"
          },
          "finalPercentage": 23,
          "amount": 126500
        }
      }
    },
    "total": 676500,
    "currency": "IQD"
  },
  "timeline": {
    "startDate": "2025-08-28",
    "deliveryDate": "2025-09-01",
    "milestones": [
      {
        "name": "جلسة التصوير",
        "date": "2025-08-28",
        "deliverables": ["صور خام للمراجعة"]
      },
      {
        "name": "المعالجة والتعديل",
        "date": "2025-08-30",
        "deliverables": ["نسخ أولية للموافقة"]
      },
      {
        "name": "التسليم النهائي",
        "date": "2025-09-01",
        "deliverables": ["20 صورة عالية الجودة نهائية"]
      }
    ]
  },
  "terms": {
    "validUntil": "2025-09-05",
    "paymentTerms": "50% مقدم، 50% عند التسليم",
    "revisions": 2,
    "usageRights": "تجاري غير محدود",
    "cancellationPolicy": "قابل للإلغاء حتى 24 ساعة قبل البدء"
  },
  "alternatives": [
    {
      "title": "باقة مبسطة",
      "description": "15 صورة بدلاً من 20",
      "savings": 80000,
      "adjustedTotal": 536000
    }
  ],
  "notes": "يشمل العرض زيارة مجانية لمعاينة الموقع وتنسيق التفاصيل"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "quote_123abc",
      "quoteNumber": "QUO-2025-001234",
      "status": "sent",
      "clientId": "cl_123abc",
      "projectRequestId": "req_123abc",
      "total": 616000,
      "currency": "IQD",
      "validUntil": "2025-09-05T23:59:59.000Z",
      "sentAt": "2025-08-26T18:00:00.000Z",
      "downloadUrl": "https://api.depth-agency.com/quotes/quote_123abc/download",
      "clientActions": {
        "viewUrl": "https://client.depth-agency.com/quotes/quote_123abc",
        "acceptUrl": "https://client.depth-agency.com/quotes/quote_123abc/accept",
        "requestChanges": "https://client.depth-agency.com/quotes/quote_123abc/feedback"
      }
    }
  },
  "message": "تم إرسال عرض السعر بنجاح! سيتم إشعار العميل عبر البريد الإلكتروني."
}
```

### `GET /quotes/{quoteId}/status`
متابعة حالة عرض السعر.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "quote_123abc",
      "quoteNumber": "QUO-2025-001234",
      "status": "client_reviewing",
      "sentAt": "2025-08-26T18:00:00.000Z",
      "clientActivity": {
        "viewed": true,
        "viewedAt": "2025-08-26T19:30:00.000Z",
        "viewCount": 3,
        "downloadedPDF": true,
        "timeSpent": "8 دقائق"
      },
      "validityStatus": {
        "isValid": true,
        "expiresIn": "8 أيام",
        "autoExtendable": true
      },
      "alternatives": {
        "requested": false,
        "previousVersions": []
      },
      "followUp": {
        "lastContact": "2025-08-26T18:00:00.000Z",
        "nextFollowUp": "2025-08-29T10:00:00.000Z",
        "remindersSent": 0
      }
    }
  }
}
```

### `POST /quotes/{quoteId}/accept`
قبول عرض السعر من قبل العميل.

**الطلب:**
```json
{
  "clientSignature": "محمد أحمد السوري",
  "acceptanceDate": "2025-08-27T14:00:00.000Z",
  "paymentMethod": "bank_transfer", // bank_transfer | cash | installments
  "depositAmount": 308000, // 50% مقدم
  "specialRequests": "يرجى التنسيق مع مدير المطعم قبل الوصول",
  "contactPreference": "whatsapp",
  "agreesToTerms": true
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "quote_123abc",
      "status": "accepted",
      "acceptedAt": "2025-08-27T14:00:00.000Z"
    },
    "project": {
      "id": "p_123abc",
      "status": "confirmed",
      "projectNumber": "DP-2025-0345"
    },
    "contract": {
      "id": "contract_123abc",
      "status": "generated",
      "downloadUrl": "https://api.depth-agency.com/contracts/contract_123abc.pdf"
    },
    "invoice": {
      "id": "inv_deposit_123",
      "type": "deposit",
      "amount": 308000,
      "dueDate": "2025-09-01T00:00:00.000Z",
      "status": "pending"
    },
    "nextSteps": [
      "توقيع العقد النهائي",
      "دفع المقدم",
      "تحديد موعد البدء"
    ]
  },
  "message": "تم قبول عرض السعر! سيتم إنشاء المشروع والتواصل معك لتحديد التفاصيل."
}
```

---

## الفوترة والدفع

### `POST /invoices`
إنشاء فاتورة جديدة.

**الطلب:**
```json
{
  "projectId": "p_123abc",
  "type": "final", // deposit | milestone | final | additional
  "amount": 308000,
  "currency": "IQD",
  "description": "الدفعة المتبقية لمشروع تصوير منتجات المطعم",
  "breakdown": [
    {
      "item": "تصوير احترافي",
      "quantity": 1,
      "rate": 437000,
      "total": 437000
    },
    {
      "item": "رسوم الموقع",
      "quantity": 1,
      "rate": 50000,
      "total": 50000
    },
    {
      "item": "معالجة متقدمة",
      "quantity": 1,
      "rate": 75000,
      "total": 75000
    },
    {
      "item": "هامش الوكالة المتغير (23%)",
      "quantity": 1,
      "rate": 126500,
      "total": 126500,
      "details": {
        "baseRange": "10-50%",
        "defaultRate": "20%",
        "modifiers": "Expert creator (+5%), Repeat client (-2%)",
        "finalRate": "23%",
        "note": "ضمن النطاق المعتمد 10%-50%"
      }
    }
  ],
  "subtotal": 688500,
  "discounts": [
    {
      "description": "خصم العميل الجديد (5%)",
      "amount": 34425
    }
  ],
  "tax": 0,
  "total": 654075,
  "paidDeposit": 327038,
  "amountDue": 327037,
  "dueDate": "2025-09-15",
  "paymentTerms": "صافي 15 يوم",
  "notes": "شكراً لثقتكم بخدماتنا"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv_123abc",
      "invoiceNumber": "INV-2025-001234",
      "status": "sent",
      "amount": 327037,
      "currency": "IQD",
      "amountUSD": 220.22,
      "exchangeRate": 1485,
      "issuedAt": "2025-09-03T15:00:00.000Z",
      "dueDate": "2025-09-15T23:59:59.000Z",
      "paymentMethods": [
        {
          "type": "bank_transfer",
          "details": {
            "bankName": "بنك بغداد",
            "accountNumber": "****1234",
            "accountName": "Depth Creative Agency",
            "iban": "IQ98BBAG****"
          }
        },
        {
          "type": "mobile_wallet",
          "details": {
            "provider": "FastPay",
            "number": "07901234567"
          }
        }
      ],
      "downloadUrl": "https://api.depth-agency.com/invoices/inv_123abc/download",
      "clientPortalUrl": "https://client.depth-agency.com/invoices/inv_123abc"
    }
  },
  "message": "تم إنشاء الفاتورة وإرسالها للعميل"
}
```

### `GET /invoices/{invoiceId}/payment-status`
متابعة حالة دفع الفاتورة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv_123abc",
      "invoiceNumber": "INV-2025-001234",
      "status": "paid",
      "amount": 308000,
      "currency": "IQD",
      "issuedAt": "2025-09-03T15:00:00.000Z",
      "dueDate": "2025-09-15T23:59:59.000Z",
      "paidAt": "2025-09-05T11:30:00.000Z",
      "paymentHistory": [
        {
          "id": "payment_123",
          "amount": 308000,
          "method": "bank_transfer",
          "reference": "TXN20250905001",
          "processedAt": "2025-09-05T11:30:00.000Z",
          "status": "confirmed",
          "fees": 0
        }
      ],
      "totalPaid": 308000,
      "remainingBalance": 0,
      "paymentStatus": "fully_paid",
      "overdueStatus": {
        "isOverdue": false,
        "daysPastDue": 0
      }
    },
    "project": {
      "id": "p_123abc",
      "paymentStatus": "fully_paid",
      "readyForClosure": true
    }
  }
}
```

### `POST /payments/manual-entry`
تسجيل دفعة يدوياً.

**الطلب:**
```json
{
  "invoiceId": "inv_123abc",
  "amount": 308000,
  "currency": "IQD",
  "paymentMethod": "bank_transfer",
  "transactionReference": "TXN20250905001",
  "paidAt": "2025-09-05T11:30:00.000Z",
  "verificationDocuments": [
    {
      "type": "bank_receipt",
      "url": "https://api.depth-agency.com/uploads/receipt_001.jpg"
    }
  ],
  "notes": "دفع كامل للفاتورة عبر التحويل البنكي",
  "verifiedBy": "finance@depth-agency.com"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "payment_123",
      "status": "confirmed",
      "processedAt": "2025-09-05T11:45:00.000Z"
    },
    "invoice": {
      "id": "inv_123abc",
      "newStatus": "paid",
      "updatedAt": "2025-09-05T11:45:00.000Z"
    },
    "notifications": {
      "clientNotified": true,
      "creatorNotified": true,
      "adminNotified": true
    }
  },
  "message": "تم تسجيل الدفعة بنجاح وتحديث حالة الفاتورة"
}
```

---

## التقارير المالية

### `GET /reports/financial`
تقارير مالية شاملة.

**معاملات الاستعلام:**
- `period`: month|quarter|year|custom
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية
- `groupBy`: day|week|month|creator|category
- `currency`: IQD|USD

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "reportPeriod": {
      "type": "month",
      "start": "2025-08-01T00:00:00.000Z",
      "end": "2025-08-31T23:59:59.000Z",
      "description": "أغسطس 2025"
    },
    "summary": {
      "totalRevenue": 15680000,
      "totalProjects": 34,
      "averageProjectValue": 461176,
      "currency": "IQD",
      "conversionRate": 1485,
      "revenueUSD": 10558.67
    },
    "breakdown": {
      "byCategory": [
        {
          "category": "photo",
          "revenue": 9840000,
          "percentage": 62.8,
          "projects": 22,
          "averageValue": 447273
        },
        {
          "category": "video",
          "revenue": 4200000,
          "percentage": 26.8,
          "projects": 8,
          "averageValue": 525000
        },
        {
          "category": "design",
          "revenue": 1640000,
          "percentage": 10.4,
          "projects": 4,
          "averageValue": 410000
        }
      ],
      "byCreator": [
        {
          "creatorId": "c_789ghi",
          "name": "فاطمة الزهراء",
          "revenue": 3280000,
          "projects": 7,
          "commission": 2542400, // 77.5% للمبدع (متوسط)
          "agencyFee": 737600, // 22.5% متوسط هامش الوكالة المتغير
          "agencyFeeRange": "10-50%",
          "averageAgencyRate": "22.5%"
        },
        {
          "creatorId": "c_456def",
          "name": "أحمد محمد الربيعي", 
          "revenue": 2940000,
          "projects": 6,
          "commission": 2205000, // 75% للمبدع
          "agencyFee": 735000, // 25% متوسط هامش الوكالة
          "agencyFeeRange": "10-50%",
          "averageAgencyRate": "25%"
        }
      ],
      "byLocation": [
        {
          "governorate": "بغداد",
          "revenue": 11280000,
          "percentage": 71.9,
          "projects": 24
        },
        {
          "governorate": "البصرة",
          "revenue": 2850000,
          "percentage": 18.2,
          "projects": 6
        },
        {
          "governorate": "أربيل",
          "revenue": 1550000,
          "percentage": 9.9,
          "projects": 4
        }
      ]
    },
    "trends": {
      "monthOverMonth": {
        "revenueGrowth": "+18.5%",
        "projectGrowth": "+12.3%",
        "averageValueGrowth": "+5.5%"
      },
      "yearOverYear": {
        "revenueGrowth": "+145.8%",
        "projectGrowth": "+89.7%",
        "averageValueGrowth": "+29.6%"
      }
    },
    "payments": {
      "collected": 14230000, // المدفوع فعلياً
      "pending": 1450000, // قيد الانتظار
      "overdue": 0,
      "collectionRate": "90.7%"
    },
    "profitability": {
      "grossRevenue": 15680000,
      "creatorCommissions": 12544000, // 80%
      "operatingExpenses": 850000,
      "netProfit": 2286000,
      "profitMargin": "14.6%"
    },
    "forecasting": {
      "nextMonthProjection": 18500000,
      "confidence": "85%",
      "basedOn": ["current_pipeline", "seasonal_trends", "historical_data"]
    }
  }
}
```

### `GET /reports/creator-performance`
تقرير أداء المبدعين مالياً.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "topPerformers": [
      {
        "rank": 1,
        "creator": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "specialization": "Food Photography"
        },
        "metrics": {
          "totalRevenue": 3280000,
          "projects": 7,
          "averageProjectValue": 468571,
          "commission": 2624000,
          "rating": 4.9,
          "repeatClientRate": "71%",
          "onTimeDelivery": "100%"
        },
        "growth": {
          "monthOverMonth": "+25%",
          "yearOverYear": "+189%"
        }
      },
      {
        "rank": 2,
        "creator": {
          "id": "c_456def",
          "name": "أحمد محمد الربيعي",
          "specialization": "Commercial Photography"
        },
        "metrics": {
          "totalRevenue": 2940000,
          "projects": 6,
          "averageProjectValue": 490000,
          "commission": 2352000,
          "rating": 4.7,
          "repeatClientRate": "67%",
          "onTimeDelivery": "96%"
        }
      }
    ],
    "categoryAnalysis": {
      "photo": {
        "activeCreators": 8,
        "totalRevenue": 9840000,
        "averageCommission": 410000,
        "competitionLevel": "high"
      },
      "video": {
        "activeCreators": 4,
        "totalRevenue": 4200000,
        "averageCommission": 840000,
        "competitionLevel": "medium"
      }
    },
    "payoutSchedule": {
      "pendingPayouts": 3280000,
      "nextPayoutDate": "2025-09-01",
      "creators": [
        {
          "creatorId": "c_789ghi",
          "amount": 820000,
          "projects": 2
        }
      ]
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](./00-overview.md)
- [نظام المبدعين](./02-creators-api.md)
- [نظام العملاء](./03-clients-api.md)
- [إدارة المشاريع](./04-projects-api.md)
- [الملفات والتخزين](./06-storage-api.md)
- [نظام الإشعارات](./07-notifications-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [رموز الأخطاء](./12-error-codes.md)
