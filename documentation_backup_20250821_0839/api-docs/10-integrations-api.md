# 🔗 التكاملات الخارجية - Depth API v2.0

---

## المحتويات
- [تكامل Firebase](#تكامل-firebase)
- [تكامل Cloudflare](#تكامل-cloudflare)
- [وسائل التواصل الاجتماعي](#وسائل-التواصل-الاجتماعي)
- [أنظمة الدفع](#أنظمة-الدفع)
- [أدوات التحليل](#أدوات-التحليل)

---

## تكامل Firebase

### `GET /integrations/firebase/status`
فحص حالة تكامل Firebase.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "firebase": {
      "status": "connected",
      "projectId": "depth-agency-prod",
      "region": "us-central1",
      "lastSync": "2025-09-02T16:00:00.000Z",
      "services": {
        "authentication": {
          "enabled": true,
          "status": "healthy",
          "activeUsers": 187,
          "signInMethods": ["email", "phone", "google"],
          "lastActivity": "2025-09-02T15:58:00.000Z"
        },
        "firestore": {
          "enabled": true,
          "status": "healthy",
          "collections": 12,
          "documents": 15847,
          "readsToday": 12450,
          "writesToday": 567,
          "storage": "45.2 MB"
        },
        "storage": {
          "enabled": true,
          "status": "healthy",
          "buckets": 2,
          "totalFiles": 2847,
          "usedSpace": "23.4 GB",
          "bandwidth": "156 MB"
        },
        "functions": {
          "enabled": true,
          "status": "healthy",
          "deployed": 8,
          "invocationsToday": 2340,
          "errors": 3
        }
      },
      "quota": {
        "reads": {
          "used": 12450,
          "limit": 50000,
          "percentage": 24.9
        },
        "writes": {
          "used": 567,
          "limit": 20000,
          "percentage": 2.8
        },
        "storage": {
          "used": "23.4 GB",
          "limit": "100 GB",
          "percentage": 23.4
        }
      }
    }
  }
}
```

### `POST /integrations/firebase/sync-users`
مزامنة المستخدمين مع Firebase.

**الطلب:**
```json
{
  "action": "full_sync", // full_sync | incremental | specific_users
  "userIds": [], // للمزامنة المحددة
  "options": {
    "updateProfiles": true,
    "syncCustomClaims": true,
    "createMissingUsers": false
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "sync": {
      "id": "sync_123abc",
      "type": "full_sync",
      "startedAt": "2025-09-02T16:30:00.000Z",
      "completedAt": "2025-09-02T16:33:45.000Z",
      "duration": "3 دقائق و 45 ثانية",
      "results": {
        "usersProcessed": 234,
        "usersUpdated": 12,
        "usersCreated": 0,
        "errors": 1,
        "skipped": 0
      },
      "errors": [
        {
          "userId": "user_problem_001",
          "error": "invalid_email_format",
          "details": "البريد الإلكتروني غير صحيح"
        }
      ]
    }
  },
  "message": "تمت المزامنة بنجاح"
}
```

### `GET /integrations/firebase/analytics`
إحصائيات استخدام Firebase.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-08-01T00:00:00.000Z",
      "end": "2025-08-31T23:59:59.000Z"
    },
    "authentication": {
      "totalSignIns": 2847,
      "newUsers": 45,
      "activeUsers": 187,
      "byMethod": {
        "email": 2234,
        "phone": 456,
        "google": 157
      },
      "securityEvents": {
        "suspiciousAttempts": 12,
        "blockedIPs": 3,
        "passwordResets": 23
      }
    },
    "firestore": {
      "operations": {
        "reads": 456789,
        "writes": 23456,
        "deletes": 234
      },
      "topCollections": [
        {"collection": "projects", "reads": 123456, "writes": 5678},
        {"collection": "users", "reads": 89012, "writes": 2345},
        {"collection": "messages", "reads": 67890, "writes": 8901}
      ],
      "performance": {
        "avgReadTime": "45ms",
        "avgWriteTime": "120ms",
        "slowQueries": 5
      }
    },
    "storage": {
      "uploads": 567,
      "downloads": 2340,
      "totalBandwidth": "45.6 GB",
      "topFileTypes": [
        {"type": "JPEG", "count": 345, "size": "12.3 GB"},
        {"type": "PNG", "count": 123, "size": "4.5 GB"},
        {"type": "MP4", "count": 45, "size": "8.9 GB"}
      ]
    },
    "costs": {
      "authentication": "$12.45",
      "firestore": "$34.67",
      "storage": "$23.89",
      "functions": "$8.12",
      "total": "$79.13"
    }
  }
}
```

---

## تكامل Cloudflare

### `GET /integrations/cloudflare/status`
فحص حالة تكامل Cloudflare.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "cloudflare": {
      "status": "active",
      "zoneId": "abc123xyz789",
      "zoneName": "depth-agency.com",
      "plan": "Pro",
      "lastUpdate": "2025-09-02T16:00:00.000Z",
      "services": {
        "cdn": {
          "enabled": true,
          "status": "active",
          "cacheHitRatio": 96.4,
          "bandwidthSaved": "89.2 GB",
          "requests": 2847563,
          "cachedRequests": 2745612
        },
        "security": {
          "enabled": true,
          "status": "active",
          "threatsBlocked": 1247,
          "securityLevel": "medium",
          "wafRules": 45,
          "rateLimit": "1000/hour"
        },
        "r2Storage": {
          "enabled": true,
          "status": "active",
          "usedSpace": "42.3 GB",
          "objects": 15678,
          "operations": 23456,
          "egress": "12.5 GB"
        },
        "images": {
          "enabled": true,
          "status": "active",
          "imagesStored": 2012,
          "transformations": 45678,
          "bandwidthSaved": "23.4 GB",
          "variants": ["thumbnail", "medium", "large", "webp"]
        },
        "workers": {
          "enabled": true,
          "status": "active",
          "deployedWorkers": 3,
          "requests": 156789,
          "cpuTime": "45.6 minutes",
          "memory": "234 MB"
        }
      },
      "performance": {
        "globalCDN": {
          "pops": 275,
          "coverage": "99.9%",
          "avgResponseTime": "45ms"
        },
        "uptime": "99.98%",
        "ssl": {
          "certificate": "Universal SSL",
          "grade": "A+",
          "expiresAt": "2026-03-15T00:00:00.000Z"
        }
      }
    }
  }
}
```

### `POST /integrations/cloudflare/purge-cache`
تنظيف ذاكرة التخزين المؤقت.

**الطلب:**
```json
{
  "type": "selective", // all | selective | by_tag
  "urls": [
    "https://depth-agency.com/api/projects",
    "https://cdn.depth-agency.com/images/*"
  ],
  "tags": ["project_images", "user_avatars"],
  "reason": "تحديث بيانات المشاريع"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "purge": {
      "id": "purge_123abc",
      "type": "selective",
      "initiatedAt": "2025-09-02T16:45:00.000Z",
      "estimatedCompletion": "2025-09-02T16:48:00.000Z",
      "affectedUrls": 45,
      "affectedRegions": 275,
      "progress": "in_progress"
    }
  },
  "message": "تم بدء عملية تنظيف الذاكرة المؤقتة"
}
```

### `GET /integrations/cloudflare/analytics`
تحليلات Cloudflare المفصلة.

**معاملات الاستعلام:**
- `period`: hour|day|week|month
- `metric`: requests|bandwidth|threats|cache

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-09-01T00:00:00.000Z",
      "end": "2025-09-01T23:59:59.000Z",
      "description": "1 سبتمبر 2025"
    },
    "traffic": {
      "requests": {
        "total": 2847563,
        "cached": 2745612,
        "uncached": 101951,
        "cacheRatio": 96.4
      },
      "bandwidth": {
        "total": "156.7 GB",
        "cached": "145.2 GB",
        "uncached": "11.5 GB",
        "saved": "92.7%"
      },
      "performance": {
        "avgResponseTime": "45ms",
        "medianResponseTime": "32ms",
        "95thPercentile": "89ms"
      }
    },
    "security": {
      "threats": {
        "total": 1247,
        "malware": 234,
        "spam": 567,
        "botAttacks": 345,
        "ddos": 101
      },
      "countries": [
        {"country": "CN", "threats": 456, "percentage": 36.6},
        {"country": "RU", "threats": 234, "percentage": 18.8},
        {"country": "US", "threats": 123, "percentage": 9.9}
      ],
      "topAttackTypes": [
        {"type": "SQL Injection", "count": 345},
        {"type": "XSS", "count": 234},
        {"type": "Bot Attack", "count": 189}
      ]
    },
    "geography": {
      "topCountries": [
        {"country": "IQ", "requests": 1856234, "percentage": 65.2},
        {"country": "AE", "requests": 345678, "percentage": 12.1},
        {"country": "KW", "requests": 234567, "percentage": 8.2}
      ],
      "responseTimeByPop": [
        {"pop": "DXB", "avgTime": "23ms", "requests": 456789},
        {"pop": "AMS", "avgTime": "67ms", "requests": 234567},
        {"pop": "SIN", "avgTime": "89ms", "requests": 123456}
      ]
    },
    "costs": {
      "bandwidth": "$23.45",
      "requests": "$12.67",
      "r2Storage": "$8.91",
      "images": "$15.23",
      "workers": "$4.56",
      "total": "$64.82"
    }
  }
}
```

---

## وسائل التواصل الاجتماعي

### `GET /integrations/social-media/platforms`
جلب المنصات المتصلة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "platform": "instagram",
        "status": "connected",
        "accountName": "@depth_agency",
        "accountId": "17841405309213570",
        "followers": 12450,
        "connectedAt": "2025-06-15T10:00:00.000Z",
        "lastSync": "2025-09-02T15:00:00.000Z",
        "permissions": ["basic_info", "user_posts", "user_media"],
        "expiresAt": "2025-12-15T10:00:00.000Z"
      },
      {
        "platform": "facebook",
        "status": "connected",
        "accountName": "Depth Creative Agency",
        "accountId": "123456789012345",
        "followers": 8734,
        "connectedAt": "2025-06-15T10:30:00.000Z",
        "lastSync": "2025-09-02T15:00:00.000Z",
        "permissions": ["pages_read_engagement", "pages_manage_posts"],
        "expiresAt": "2025-12-15T10:30:00.000Z"
      },
      {
        "platform": "tiktok",
        "status": "disconnected",
        "lastConnected": "2025-07-20T14:00:00.000Z",
        "disconnectReason": "token_expired"
      }
    ]
  }
}
```

### `POST /integrations/social-media/connect`
ربط منصة وسائل تواصل جديدة.

**الطلب:**
```json
{
  "platform": "tiktok",
  "accessToken": "encrypted_access_token_xyz789",
  "permissions": ["video.list", "user.info.basic"],
  "accountInfo": {
    "username": "@depth_agency_official",
    "displayName": "Depth Creative Agency"
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "connection": {
      "platform": "tiktok",
      "status": "connected",
      "accountName": "@depth_agency_official",
      "connectedAt": "2025-09-02T17:00:00.000Z",
      "permissions": ["video.list", "user.info.basic"],
      "initialSync": {
        "scheduled": true,
        "estimatedCompletion": "2025-09-02T17:05:00.000Z"
      }
    }
  },
  "message": "تم ربط حساب TikTok بنجاح"
}
```

### `POST /integrations/social-media/publish`
نشر محتوى على وسائل التواصل.

**الطلب:**
```json
{
  "platforms": ["instagram", "facebook"],
  "content": {
    "text": "شاهدوا أحدث أعمالنا في تصوير المنتجات! 📸✨\n#تصوير_احترافي #منتجات #عراق",
    "media": [
      {
        "type": "image",
        "url": "https://cdn.depth-agency.com/showcase/food_photo_001.jpg",
        "caption": "تصوير منتجات احترافي للمطاعم"
      }
    ],
    "hashtags": ["تصوير_احترافي", "منتجات", "عراق", "ابداع"],
    "location": {
      "name": "بغداد، العراق",
      "latitude": 33.3152,
      "longitude": 44.3661
    }
  },
  "scheduling": {
    "publishAt": "2025-09-02T19:00:00.000Z",
    "timezone": "Asia/Baghdad"
  },
  "settings": {
    "allowComments": true,
    "allowSharing": true,
    "audience": "public"
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "publication": {
      "id": "pub_123abc",
      "status": "scheduled",
      "scheduledFor": "2025-09-02T19:00:00.000Z",
      "platforms": {
        "instagram": {
          "status": "scheduled",
          "postId": null,
          "scheduledId": "sch_inst_123"
        },
        "facebook": {
          "status": "scheduled",
          "postId": null,
          "scheduledId": "sch_fb_456"
        }
      },
      "content": {
        "text": "شاهدوا أحدث أعمالنا في تصوير المنتجات! 📸✨",
        "mediaCount": 1,
        "hashtagCount": 4
      }
    }
  },
  "message": "تم جدولة المنشور للنشر في الوقت المحدد"
}
```

### `GET /integrations/social-media/analytics`
تحليلات وسائل التواصل الاجتماعي.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-08-01T00:00:00.000Z",
      "end": "2025-08-31T23:59:59.000Z"
    },
    "summary": {
      "totalPosts": 28,
      "totalReach": 156789,
      "totalEngagement": 12456,
      "engagementRate": "7.9%",
      "newFollowers": 234
    },
    "byPlatform": {
      "instagram": {
        "posts": 15,
        "reach": 89234,
        "likes": 3456,
        "comments": 234,
        "shares": 123,
        "saves": 567,
        "engagement": 4380,
        "engagementRate": "4.9%",
        "newFollowers": 145,
        "topPost": {
          "id": "post_inst_001",
          "caption": "تصوير منتجات احترافي...",
          "likes": 567,
          "comments": 45,
          "reach": 12345
        }
      },
      "facebook": {
        "posts": 13,
        "reach": 67555,
        "reactions": 2234,
        "comments": 156,
        "shares": 234,
        "engagement": 2624,
        "engagementRate": "3.9%",
        "newFollowers": 89,
        "topPost": {
          "id": "post_fb_001",
          "text": "شاهدوا أحدث أعمالنا...",
          "reactions": 234,
          "comments": 23,
          "reach": 8901
        }
      }
    },
    "demographics": {
      "ageGroups": [
        {"range": "25-34", "percentage": 35.6},
        {"range": "35-44", "percentage": 28.3},
        {"range": "18-24", "percentage": 22.1}
      ],
      "locations": [
        {"city": "بغداد", "percentage": 45.2},
        {"city": "البصرة", "percentage": 18.7},
        {"city": "أربيل", "percentage": 12.4}
      ],
      "interests": [
        {"interest": "تصوير", "percentage": 67.8},
        {"interest": "تصميم", "percentage": 45.3},
        {"interest": "أعمال", "percentage": 38.9}
      ]
    },
    "trends": {
      "bestPostingTimes": ["19:00", "21:00", "14:00"],
      "topHashtags": ["#تصوير_احترافي", "#ابداع", "#عراق"],
      "engagementTrend": "+12.5%",
      "reachGrowth": "+18.7%"
    }
  }
}
```

---

## أنظمة الدفع

### `GET /integrations/payments/providers`
جلب مقدمي خدمات الدفع المتاحين.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "stripe",
        "name": "Stripe",
        "status": "active",
        "type": "international",
        "supportedCurrencies": ["USD", "EUR", "IQD"],
        "methods": ["card", "bank_transfer", "wallet"],
        "fees": {
          "percentage": 2.9,
          "fixed": 30, // cents
          "currency": "USD"
        },
        "settlementTime": "2-3 days",
        "connectedAt": "2025-06-01T10:00:00.000Z",
        "lastTransaction": "2025-09-02T14:30:00.000Z"
      },
      {
        "id": "local_banks",
        "name": "البنوك العراقية",
        "status": "active",
        "type": "local",
        "supportedCurrencies": ["IQD"],
        "methods": ["bank_transfer", "cash"],
        "fees": {
          "percentage": 0,
          "fixed": 5000, // IQD
          "currency": "IQD"
        },
        "settlementTime": "1-2 days",
        "banks": [
          {"name": "بنك بغداد", "swift": "BBAGIQBA"},
          {"name": "البنك التجاري العراقي", "swift": "CBIRIQBA"}
        ]
      },
      {
        "id": "fastpay",
        "name": "FastPay",
        "status": "active",
        "type": "mobile_wallet",
        "supportedCurrencies": ["IQD"],
        "methods": ["mobile_wallet"],
        "fees": {
          "percentage": 1.5,
          "fixed": 0,
          "currency": "IQD"
        },
        "settlementTime": "instant"
      }
    ]
  }
}
```

### `POST /integrations/payments/process`
معالجة دفعة جديدة.

**الطلب:**
```json
{
  "invoiceId": "inv_123abc",
  "provider": "stripe",
  "method": "card",
  "amount": 207.41,
  "currency": "USD",
  "customerInfo": {
    "email": "contact@alsham-restaurant.com",
    "name": "محمد أحمد السوري",
    "phone": "07801234567"
  },
  "paymentDetails": {
    "cardToken": "tok_visa_1234",
    "saveCard": false,
    "description": "دفع فاتورة تصوير منتجات المطعم"
  },
  "metadata": {
    "projectId": "p_123abc",
    "clientId": "cl_123abc",
    "invoiceNumber": "INV-2025-001234"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pay_123abc",
      "paymentIntentId": "pi_stripe_xyz789",
      "status": "succeeded",
      "amount": 207.41,
      "currency": "USD",
      "amountReceived": 201.19, // بعد خصم الرسوم
      "fees": 6.22,
      "method": "card",
      "last4": "4242",
      "brand": "visa",
      "processedAt": "2025-09-02T17:30:00.000Z",
      "settlementDate": "2025-09-04T17:30:00.000Z",
      "receiptUrl": "https://pay.stripe.com/receipts/xyz789"
    },
    "invoice": {
      "id": "inv_123abc",
      "status": "paid",
      "paidAt": "2025-09-02T17:30:00.000Z"
    },
    "conversion": {
      "originalAmount": 308000,
      "originalCurrency": "IQD",
      "exchangeRate": 1485,
      "convertedAmount": 207.41,
      "convertedCurrency": "USD"
    }
  },
  "message": "تم معالجة الدفعة بنجاح"
}
```

### `GET /integrations/payments/transactions`
جلب سجل المعاملات المالية.

**معاملات الاستعلام:**
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية
- `status`: pending|succeeded|failed|refunded
- `provider`: stripe|local_banks|fastpay
- `page`: رقم الصفحة

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_123abc",
        "paymentId": "pay_123abc",
        "type": "payment",
        "status": "succeeded",
        "amount": 207.41,
        "currency": "USD",
        "fees": 6.22,
        "netAmount": 201.19,
        "provider": "stripe",
        "method": "card",
        "customer": {
          "name": "محمد أحمد السوري",
          "email": "contact@alsham-restaurant.com"
        },
        "invoice": {
          "id": "inv_123abc",
          "number": "INV-2025-001234"
        },
        "processedAt": "2025-09-02T17:30:00.000Z",
        "settlementDate": "2025-09-04T17:30:00.000Z"
      },
      {
        "id": "txn_456def",
        "paymentId": "pay_456def",
        "type": "refund",
        "status": "succeeded",
        "amount": -156.78,
        "currency": "USD",
        "fees": -4.56,
        "netAmount": -152.22,
        "provider": "stripe",
        "reason": "client_request",
        "originalPayment": "pay_original_789",
        "processedAt": "2025-09-01T15:20:00.000Z"
      }
    ],
    "summary": {
      "totalTransactions": 89,
      "totalVolume": 18456.78,
      "totalFees": 534.89,
      "netRevenue": 17921.89,
      "byStatus": {
        "succeeded": 85,
        "pending": 2,
        "failed": 2,
        "refunded": 0
      },
      "byProvider": {
        "stripe": 67,
        "local_banks": 18,
        "fastpay": 4
      }
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 89,
    "pages": 5
  }
}
```

---

## أدوات التحليل

### `GET /integrations/analytics/google`
تحليلات Google Analytics.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-08-01",
      "end": "2025-08-31"
    },
    "website": {
      "sessions": 12456,
      "users": 8934,
      "pageviews": 34567,
      "bounceRate": "45.6%",
      "avgSessionDuration": "3:24",
      "conversions": 45,
      "conversionRate": "3.6%"
    },
    "traffic": {
      "sources": [
        {"source": "organic", "sessions": 5678, "percentage": 45.6},
        {"source": "social", "sessions": 3456, "percentage": 27.8},
        {"source": "direct", "sessions": 2345, "percentage": 18.8},
        {"source": "referral", "sessions": 977, "percentage": 7.8}
      ],
      "topPages": [
        {"page": "/", "pageviews": 8901, "uniquePageviews": 6789},
        {"page": "/services", "pageviews": 4567, "uniquePageviews": 3456},
        {"page": "/portfolio", "pageviews": 3456, "uniquePageviews": 2789}
      ],
      "devices": [
        {"device": "mobile", "sessions": 7890, "percentage": 63.4},
        {"device": "desktop", "sessions": 3456, "percentage": 27.8},
        {"device": "tablet", "sessions": 1110, "percentage": 8.8}
      ]
    },
    "geography": [
      {"country": "Iraq", "sessions": 9456, "percentage": 75.9},
      {"country": "UAE", "sessions": 1567, "percentage": 12.6},
      {"country": "Kuwait", "sessions": 867, "percentage": 7.0}
    ],
    "goals": [
      {
        "name": "Contact Form Submission",
        "completions": 67,
        "conversionRate": "5.4%",
        "value": 15680000
      },
      {
        "name": "Portfolio View",
        "completions": 234,
        "conversionRate": "18.8%",
        "value": 0
      }
    ]
  }
}
```

### `POST /integrations/analytics/custom-event`
تسجيل حدث مخصص للتحليل.

**الطلب:**
```json
{
  "event": "project_completed",
  "category": "business",
  "action": "project_lifecycle",
  "label": "food_photography",
  "value": 620000,
  "customDimensions": {
    "client_type": "restaurant",
    "project_duration": "5_days",
    "creator_rating": "4.9",
    "location": "baghdad"
  },
  "userId": "cl_123abc",
  "sessionId": "session_789xyz"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "evt_123abc",
      "timestamp": "2025-09-02T18:00:00.000Z",
      "processed": true,
      "analyticsId": "ga_evt_456def"
    }
  },
  "message": "تم تسجيل الحدث بنجاح"
}
```

### `GET /integrations/analytics/funnel`
تحليل مسار التحويل.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "funnel": {
      "name": "Client Acquisition Funnel",
      "period": "30 days",
      "steps": [
        {
          "step": 1,
          "name": "Website Visit",
          "users": 8934,
          "conversionRate": "100%",
          "dropOffRate": "0%"
        },
        {
          "step": 2,
          "name": "Services Page View",
          "users": 3456,
          "conversionRate": "38.7%",
          "dropOffRate": "61.3%"
        },
        {
          "step": 3,
          "name": "Contact Form View",
          "users": 1234,
          "conversionRate": "35.7%",
          "dropOffRate": "64.3%"
        },
        {
          "step": 4,
          "name": "Contact Form Submit",
          "users": 234,
          "conversionRate": "19.0%",
          "dropOffRate": "81.0%"
        },
        {
          "step": 5,
          "name": "Quote Request",
          "users": 123,
          "conversionRate": "52.6%",
          "dropOffRate": "47.4%"
        },
        {
          "step": 6,
          "name": "Project Started",
          "users": 45,
          "conversionRate": "36.6%",
          "dropOffRate": "63.4%"
        }
      ],
      "overallConversion": {
        "rate": "0.5%",
        "totalConversions": 45,
        "averageValue": 425000,
        "totalValue": 19125000
      },
      "insights": [
        "أكبر نسبة تسرب في الخطوة الثانية (61.3%)",
        "معدل تحويل جيد من طلب عرض السعر إلى بدء المشروع",
        "يمكن تحسين صفحة الخدمات لتقليل التسرب"
      ]
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](./00-overview.md)
- [المصادقة والأمان](./01-authentication.md)
- [الملفات والتخزين](./06-storage-api.md)
- [نظام الإشعارات](./07-notifications-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [الأمان والحوكمة](./11-governance-api.md)
- [رموز الأخطاء](./12-error-codes.md)

