# ⚙️ الجوانب التقنية والتكامل - Depth API v2.0

> مصطلحات هذا المستند:
> - واجهة برمجة التطبيقات: Application Programming Interface — API
> - شبكة توصيل المحتوى: Content Delivery Network — CDN
> - التكامل/التسليم المستمران: Continuous Integration / Continuous Delivery — CI/CD
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

> ملاحظة إصدار: النسخة الحالية في التطبيق (`depth-site/package.json`) تستخدم Next.js 15 و React 19، وتوجد SWR لإدارة الجلب؛ لا توجد Zustand/React Query حالياً.

---

## المحتويات
- [البنية التقنية](#البنية-التقنية)
- [واجهات برمجة التطبيقات المتقدمة](#واجهات-برمجة-التطبيقات-المتقدمة)
- [التحسينات والأداء](#التحسينات-والأداء)
- [مراقبة النظام](#مراقبة-النظام)
- [التحديثات والنشر](#التحديثات-والنشر)

---

## البنية التقنية

### `GET /api/system/architecture`
معلومات البنية التقنية للنظام.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "system": {
      "version": "{semver}",
      "build": "20250902.1845",
      "environment": "production",
      "region": "multi-region",
      "deployedAt": "2025-09-02T18:45:00.000Z"
    },
    "architecture": {
      "frontend": {
  "framework": "Next.js 15",
        "runtime": "Node.js 20",
        "hosting": "Vercel Edge Runtime",
        "cdn": "Cloudflare Global CDN",
        "languages": ["TypeScript", "React"],
  "stateManagement": "SWR"
      },
      "backend": {
        "runtime": "Node.js 20",
        "framework": "Next.js API Routes",
        "hosting": "Vercel Serverless Functions",
        "database": "Firebase Firestore",
        "storage": "Cloudflare R2",
        "authentication": "Firebase Auth",
        "search": "Algolia Search"
      },
      "infrastructure": {
        "cdn": "Cloudflare Pro",
        "dns": "Cloudflare DNS",
        "ssl": "Cloudflare Universal SSL",
        "firewall": "Cloudflare WAF",
        "ddos": "Cloudflare DDoS Protection",
        "monitoring": "Datadog + Firebase Monitoring"
      }
    },
    "services": {
      "core": [
        {
          "name": "Authentication Service",
          "provider": "Firebase Auth",
          "status": "healthy",
          "uptime": "99.98%",
          "region": "global"
        },
        {
          "name": "Database Service",
          "provider": "Firebase Firestore",
          "status": "healthy",
          "uptime": "99.95%",
          "region": "us-central1"
        },
        {
          "name": "Storage Service",
          "provider": "Cloudflare R2",
          "status": "healthy",
          "uptime": "99.99%",
          "region": "global"
        },
        {
          "name": "CDN Service",
          "provider": "Cloudflare",
          "status": "healthy",
          "uptime": "99.99%",
          "region": "global"
        }
      ],
      "additional": [
        {
          "name": "Email Service",
          "provider": "Resend",
          "status": "healthy",
          "monthlyQuota": "100,000 emails"
        },
        {
          "name": "SMS Service",
          "provider": "Twilio",
          "status": "healthy",
          "monthlyQuota": "10,000 messages"
        },
        {
          "name": "Analytics Service",
          "provider": "Google Analytics 4",
          "status": "healthy",
          "dataRetention": "26 months"
        },
        {
          "name": "Error Tracking",
          "provider": "Sentry",
          "status": "healthy",
          "monthlyQuota": "50,000 errors"
        }
      ]
    },
    "security": {
      "encryption": {
        "dataInTransit": "TLS 1.3",
        "dataAtRest": "AES-256",
        "keyManagement": "Firebase Security"
      },
      "compliance": [
        "GDPR Compliant",
        "SOC 2 Type II",
        "ISO 27001"
      ],
      "backup": {
        "frequency": "Daily",
        "retention": "90 days",
        "crossRegion": true,
        "encrypted": true
      }
    }
  }
}
```

### `GET /api/system/health`
فحص صحة النظام الشامل.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "overall": {
      "status": "healthy",
      "score": 98.5,
      "lastCheck": "2025-09-02T21:00:00.000Z",
      "uptime": "99.98%"
    },
    "components": {
      "api": {
        "status": "healthy",
        "responseTime": "45ms",
        "errorRate": "0.02%",
        "throughput": "1,250 req/min"
      },
      "database": {
        "status": "healthy",
        "connectionPool": "85% utilized",
        "queryPerformance": "avg 23ms",
        "replication": "synchronized"
      },
      "storage": {
        "status": "healthy",
        "usage": "67.3%",
        "bandwidth": "1.2 GB/hour",
        "availability": "99.99%"
      },
      "cache": {
        "status": "healthy",
        "hitRate": "94.2%",
        "memoryUsage": "78%",
        "evictionRate": "0.1%"
      },
      "external": {
        "cloudflare": {
          "status": "healthy",
          "cacheRatio": "96.4%",
          "globalLatency": "32ms"
        },
        "firebase": {
          "status": "healthy",
          "authLatency": "89ms",
          "firestoreLatency": "67ms"
        },
        "resend": {
          "status": "healthy",
          "deliveryRate": "99.7%",
          "bounceRate": "0.8%"
        }
      }
    },
    "metrics": {
      "performance": {
        "averageResponseTime": "45ms",
        "p95ResponseTime": "120ms",
        "p99ResponseTime": "450ms",
        "throughput": "1,250 requests/minute"
      },
      "reliability": {
        "uptime": "99.98%",
        "errorRate": "0.02%",
        "successRate": "99.98%",
        "mttr": "4.2 minutes"
      },
      "capacity": {
        "cpuUsage": "23%",
        "memoryUsage": "67%",
        "diskUsage": "45%",
        "networkUtilization": "34%"
      }
    },
    "alerts": [],
    "warnings": [
      {
        "component": "database",
        "message": "Connection pool utilization above 80%",
        "severity": "low",
        "timestamp": "2025-09-02T20:45:00.000Z"
      }
    ]
  }
}
```

---

## واجهات برمجة التطبيقات المتقدمة

### `POST /api/advanced/batch-operations`
تنفيذ عمليات متعددة في طلب واحد.

**الطلب:**
```json
{
  "operations": [
    {
      "id": "op_1",
      "method": "POST",
      "endpoint": "/api/projects",
      "data": {
        "title": "تصوير منتجات جديد",
        "type": "product_photography",
        "clientId": "client_123"
      }
    },
    {
      "id": "op_2",
      "method": "PUT",
      "endpoint": "/api/creators/creator_456/availability",
      "data": {
        "date": "2025-09-05",
        "available": false,
        "reason": "مشروع محجوز"
      }
    },
    {
      "id": "op_3",
      "method": "GET",
      "endpoint": "/api/analytics/dashboard",
      "params": {
        "period": "last_30_days"
      }
    }
  ],
  "options": {
    "parallel": true,
    "stopOnError": false,
    "timeout": 30000
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "executionId": "batch_123abc",
    "completedAt": "2025-09-02T21:15:00.000Z",
    "duration": "1.2 seconds",
    "results": [
      {
        "id": "op_1",
        "status": "success",
        "statusCode": 201,
        "data": {
          "projectId": "project_new_001",
          "title": "تصوير منتجات جديد"
        }
      },
      {
        "id": "op_2",
        "status": "success",
        "statusCode": 200,
        "data": {
          "updated": true,
          "availabilityId": "avail_456_20250905"
        }
      },
      {
        "id": "op_3",
        "status": "error",
        "statusCode": 403,
        "error": {
          "code": "INSUFFICIENT_PERMISSIONS",
          "message": "صلاحيات غير كافية"
        }
      }
    ],
    "summary": {
      "total": 3,
      "successful": 2,
      "failed": 1,
      "successRate": "66.7%"
    }
  }
}
```

### `GET /api/advanced/graphql`
واجهة GraphQL للاستعلامات المعقدة.

**مثال على الاستعلام:**
```graphql
query GetProjectDetails($projectId: ID!, $includeCreator: Boolean = true) {
  project(id: $projectId) {
    id
    title
    status
    budget {
      amount
      currency
    }
    client {
      id
      name
      email
    }
    creator @include(if: $includeCreator) {
      id
      name
      specialties
      rating
      availability {
        nextAvailable
        calendar(days: 7) {
          date
          available
          bookings
        }
      }
    }
    timeline {
      milestones {
        id
        title
        dueDate
        status
        completedAt
      }
    }
    gallery {
      images(status: APPROVED) {
        id
        url
        thumbnailUrl
        metadata {
          width
          height
          fileSize
        }
      }
    }
    communications {
      messages(last: 10) {
        id
        content
        sender {
          id
          name
          role
        }
        sentAt
      }
    }
  }
}
```

**الاستجابة:**
```json
{
  "data": {
    "project": {
      "id": "project_123",
      "title": "تصوير منتجات المطعم الشامي",
      "status": "IN_PROGRESS",
      "budget": {
        "amount": 620000,
        "currency": "IQD"
      },
      "client": {
        "id": "client_456",
        "name": "محمد أحمد السوري",
        "email": "contact@alsham-restaurant.com"
      },
      "creator": {
        "id": "creator_789",
        "name": "فاطمة أحمد الصالح",
        "specialties": ["FOOD_PHOTOGRAPHY", "PRODUCT_PHOTOGRAPHY"],
        "rating": 4.9,
        "availability": {
          "nextAvailable": "2025-09-06T09:00:00.000Z",
          "calendar": [
            {
              "date": "2025-09-03",
              "available": false,
              "bookings": 1
            },
            {
              "date": "2025-09-04",
              "available": false,
              "bookings": 1
            }
          ]
        }
      },
      "timeline": {
        "milestones": [
          {
            "id": "milestone_1",
            "title": "جلسة التصوير الأولى",
            "dueDate": "2025-09-03T14:00:00.000Z",
            "status": "COMPLETED",
            "completedAt": "2025-09-03T16:30:00.000Z"
          }
        ]
      },
      "gallery": {
        "images": [
          {
            "id": "img_001",
            "url": "https://cdn.depth-agency.com/projects/123/img_001_full.jpg",
            "thumbnailUrl": "https://cdn.depth-agency.com/projects/123/img_001_thumb.jpg",
            "metadata": {
              "width": 4032,
              "height": 3024,
              "fileSize": 2456789
            }
          }
        ]
      },
      "communications": {
        "messages": [
          {
            "id": "msg_001",
            "content": "تم الانتهاء من الجلسة الأولى بنجاح",
            "sender": {
              "id": "creator_789",
              "name": "فاطمة أحمد الصالح",
              "role": "CREATOR"
            },
            "sentAt": "2025-09-03T16:45:00.000Z"
          }
        ]
      }
    }
  }
}
```

### `POST /api/advanced/webhooks/register`
تسجيل Webhook للإشعارات التلقائية.

**الطلب:**
```json
{
  "url": "https://client-app.com/webhooks/depth-notifications",
  "events": [
    "project.created",
    "project.status_changed",
    "project.completed",
    "message.received",
    "invoice.paid"
  ],
  "secret": "webhook_secret_xyz789",
  "filters": {
    "clientId": "client_123", // استقبال أحداث عميل محدد فقط
    "projectTypes": ["food_photography", "product_photography"]
  },
  "options": {
    "retryCount": 3,
    "timeout": 10000,
    "includeMetadata": true
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "webhook": {
      "id": "webhook_123abc",
      "url": "https://client-app.com/webhooks/depth-notifications",
      "status": "active",
      "events": [
        "project.created",
        "project.status_changed",
        "project.completed",
        "message.received",
        "invoice.paid"
      ],
      "createdAt": "2025-09-02T21:30:00.000Z",
      "lastVerified": "2025-09-02T21:30:00.000Z",
      "deliveryStats": {
        "totalAttempts": 0,
        "successfulDeliveries": 0,
        "failedDeliveries": 0,
        "averageResponseTime": "0ms"
      }
    }
  },
  "message": "تم تسجيل Webhook بنجاح"
}
```

---

## التحسينات والأداء

### `GET /api/optimization/cache-stats`
إحصائيات ذاكرة التخزين المؤقت.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "global": {
      "hitRate": "94.2%",
      "missRate": "5.8%",
      "totalRequests": 2847563,
      "cachedResponses": 2682456,
      "avgResponseTime": "23ms",
      "bandwidthSaved": "45.6 GB"
    },
    "byEndpoint": [
      {
        "endpoint": "/api/projects",
        "hitRate": "97.8%",
        "avgResponseTime": "12ms",
        "requests": 456789,
        "cacheStrategy": "stale-while-revalidate"
      },
      {
        "endpoint": "/api/creators/search",
        "hitRate": "89.3%",
        "avgResponseTime": "34ms",
        "requests": 234567,
        "cacheStrategy": "cache-first"
      },
      {
        "endpoint": "/api/gallery/images",
        "hitRate": "98.9%",
        "avgResponseTime": "8ms",
        "requests": 1567890,
        "cacheStrategy": "immutable"
      }
    ],
    "byRegion": [
      {
        "region": "Middle East",
        "hitRate": "95.6%",
        "avgResponseTime": "18ms",
        "requests": 1567890
      },
      {
        "region": "Europe",
        "hitRate": "92.1%",
        "avgResponseTime": "45ms",
        "requests": 678901
      },
      {
        "region": "Asia",
        "hitRate": "91.8%",
        "avgResponseTime": "67ms",
        "requests": 345678
      }
    ],
    "optimization": {
      "recommendations": [
        {
          "endpoint": "/api/analytics/dashboard",
          "issue": "low_cache_hit_rate",
          "currentHitRate": "67.3%",
          "recommendation": "زيادة مدة التخزين المؤقت إلى 5 دقائق",
          "estimatedImprovement": "+15% hit rate"
        },
        {
          "endpoint": "/api/creators/search",
          "issue": "cache_invalidation_frequency",
          "recommendation": "استخدام cache tags للتحكم الدقيق",
          "estimatedImprovement": "تقليل invalidation بنسبة 40%"
        }
      ],
      "suggestedActions": [
        "تفعيل HTTP/3 للمناطق التي تدعمه",
        "استخدام Service Workers للتخزين المؤقت المحلي",
        "تحسين ضغط الصور باستخدام WebP و AVIF"
      ]
    }
  }
}
```

### `POST /api/optimization/preload`
تحميل مسبق للموارد المتوقعة.

**الطلب:**
```json
{
  "resources": [
    {
      "type": "project_data",
      "projectId": "project_123",
      "includes": ["gallery", "timeline", "communications"]
    },
    {
      "type": "creator_availability",
      "creatorIds": ["creator_456", "creator_789"],
      "dateRange": {
        "start": "2025-09-03",
        "end": "2025-09-10"
      }
    },
    {
      "type": "client_dashboard",
      "clientId": "client_123",
      "metrics": ["active_projects", "invoices", "analytics"]
    }
  ],
  "priority": "high",
  "cacheStrategy": "preload_and_cache"
}
```

**الاستجابة الناجحة (202):**
```json
{
  "success": true,
  "data": {
    "preload": {
      "id": "preload_123abc",
      "status": "processing",
      "estimatedCompletion": "2025-09-02T21:45:00.000Z",
      "resources": {
        "total": 3,
        "processed": 0,
        "cached": 0,
        "failed": 0
      }
    }
  },
  "message": "تم بدء عملية التحميل المسبق"
}
```

---

## مراقبة النظام

### `GET /api/monitoring/performance`
مراقبة الأداء في الوقت الفعلي.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "realtime": {
      "timestamp": "2025-09-02T21:50:00.000Z",
      "metrics": {
        "requestsPerSecond": 18.4,
        "activeConnections": 234,
        "averageResponseTime": "45ms",
        "errorRate": "0.02%",
        "cpuUsage": "23%",
        "memoryUsage": "67%"
      }
    },
    "trends": {
      "last24Hours": {
        "peakRPS": 67.8,
        "peakTime": "2025-09-02T14:30:00.000Z",
        "averageResponseTime": "42ms",
        "totalRequests": 1567890,
        "totalErrors": 234,
        "uptime": "99.98%"
      },
      "hourlyBreakdown": [
        {
          "hour": "14:00",
          "requestsPerSecond": 45.6,
          "responseTime": "38ms",
          "errorRate": "0.01%"
        },
        {
          "hour": "15:00",
          "requestsPerSecond": 67.8,
          "responseTime": "52ms",
          "errorRate": "0.03%"
        }
      ]
    },
    "endpoints": {
      "topByTraffic": [
        {
          "endpoint": "/api/projects",
          "requestsPerMinute": 89.4,
          "averageResponseTime": "34ms",
          "errorRate": "0.01%"
        },
        {
          "endpoint": "/api/gallery/images",
          "requestsPerMinute": 156.7,
          "averageResponseTime": "12ms",
          "errorRate": "0.00%"
        }
      ],
      "slowest": [
        {
          "endpoint": "/api/analytics/reports",
          "averageResponseTime": "2.3s",
          "p95ResponseTime": "4.8s",
          "requestsPerMinute": 2.3
        },
        {
          "endpoint": "/api/search/advanced",
          "averageResponseTime": "1.8s",
          "p95ResponseTime": "3.2s",
          "requestsPerMinute": 5.7
        }
      ]
    },
    "alerts": {
      "active": [],
      "recent": [
        {
          "id": "alert_123",
          "type": "high_response_time",
          "endpoint": "/api/analytics/reports",
          "threshold": "2s",
          "actual": "2.8s",
          "triggeredAt": "2025-09-02T20:15:00.000Z",
          "resolvedAt": "2025-09-02T20:22:00.000Z",
          "duration": "7 دقائق"
        }
      ]
    }
  }
}
```

### `GET /api/monitoring/logs`
سجلات النظام المفصلة.

**معاملات الاستعلام:**
- `level`: debug|info|warn|error
- `service`: api|database|cache|external
- `startTime`: وقت البداية
- `endTime`: وقت النهاية
- `limit`: حد النتائج

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "timestamp": "2025-09-02T21:55:00.000Z",
        "level": "info",
        "service": "api",
        "endpoint": "/api/projects",
        "method": "GET",
        "userId": "user_123",
        "requestId": "req_abc123",
        "responseTime": "45ms",
        "statusCode": 200,
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X)"
      },
      {
        "timestamp": "2025-09-02T21:54:45.000Z",
        "level": "warn",
        "service": "database",
        "message": "Slow query detected",
        "details": {
          "query": "projects.where('status', '==', 'active')",
          "duration": "890ms",
          "threshold": "500ms",
          "collection": "projects"
        },
        "requestId": "req_def456"
      },
      {
        "timestamp": "2025-09-02T21:54:30.000Z",
        "level": "error",
        "service": "external",
        "message": "Email delivery failed",
        "details": {
          "provider": "resend",
          "recipient": "client@example.com",
          "templateId": "project_completed",
          "code": "RECIPIENT_BOUNCED",
          "retryCount": 2
        },
        "requestId": "req_ghi789"
      }
    ],
    "summary": {
      "totalLogs": 15678,
      "filteredLogs": 100,
      "timeRange": {
        "start": "2025-09-02T20:00:00.000Z",
        "end": "2025-09-02T22:00:00.000Z"
      },
      "byLevel": {
        "debug": 12,
        "info": 67,
        "warn": 18,
        "error": 3
      }
    }
  },
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 15678,
    "hasMore": true
  }
}
```

---

## التحديثات والنشر

### `GET /api/deployment/status`
حالة آخر عملية نشر.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "current": {
      "version": "{semver}",
      "build": "20250902.1845",
      "deployedAt": "2025-09-02T18:45:00.000Z",
      "deploymentId": "deploy_123abc",
      "environment": "production",
      "health": "healthy"
    },
    "latest": {
      "version": "2.0.2",
      "build": "20250903.0930",
      "status": "ready_to_deploy",
      "changes": [
        "تحسين أداء واجهة البحث",
        "إصلاح مشكلة في تحميل الصور",
        "إضافة ميزة التصدير المتقدم",
        "تحديثات أمنية"
      ],
      "estimatedDeploymentTime": "15 دقيقة",
      "rollbackAvailable": true
    },
    "history": [
      {
        "version": "{semver}",
        "deployedAt": "2025-09-02T18:45:00.000Z",
        "duration": "12 دقيقة",
        "status": "successful",
        "rollbacks": 0
      },
      {
        "version": "2.0.0",
        "deployedAt": "2025-08-28T16:30:00.000Z",
        "duration": "18 دقيقة",
        "status": "successful",
        "rollbacks": 1
      }
    ],
    "maintenance": {
      "nextScheduled": "2025-09-10T02:00:00.000Z",
      "estimatedDuration": "30 دقيقة",
      "type": "database_optimization",
      "impact": "minimal"
    }
  }
}
```

### `POST /api/deployment/maintenance`
جدولة صيانة النظام.

**الطلب:**
```json
{
  "type": "security_updates",
  "scheduledAt": "2025-09-10T02:00:00.000Z",
  "estimatedDuration": "45 دقيقة",
  "description": "تطبيق تحديثات أمنية مهمة",
  "impact": "partial_downtime",
  "notifyUsers": true,
  "notificationAdvance": "24 ساعة",
  "rollbackPlan": {
    "available": true,
    "estimatedTime": "10 دقائق",
    "trigger": "automatic_on_errors"
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "maintenance": {
      "id": "maint_123abc",
      "type": "security_updates",
      "status": "scheduled",
      "scheduledAt": "2025-09-10T02:00:00.000Z",
      "estimatedDuration": "45 دقيقة",
      "notificationScheduled": "2025-09-09T02:00:00.000Z",
      "affectedServices": [
        "API endpoints",
        "User authentication",
        "File uploads"
      ],
      "unaffectedServices": [
        "CDN",
        "Static content",
        "Cached data"
      ]
    }
  },
  "message": "تم جدولة الصيانة بنجاح"
}
```

### `GET /api/feature-flags`
إعدادات الميزات القابلة للتبديل.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "flags": [
      {
        "name": "advanced_search",
        "enabled": true,
        "description": "البحث المتقدم مع فلترة متقدمة",
        "rolloutPercentage": 100,
        "targetAudience": "all_users",
        "enabledAt": "2025-08-15T10:00:00.000Z"
      },
      {
        "name": "ai_recommendations",
        "enabled": false,
        "description": "توصيات المبدعين بالذكاء الاصطناعي",
        "rolloutPercentage": 0,
        "targetAudience": "beta_users",
        "plannedRelease": "2025-10-01T00:00:00.000Z"
      },
      {
        "name": "real_time_collaboration",
        "enabled": true,
        "description": "التعاون في الوقت الفعلي على المشاريع",
        "rolloutPercentage": 25,
        "targetAudience": "premium_clients",
        "enabledAt": "2025-09-01T00:00:00.000Z"
      },
      {
        "name": "mobile_app_integration",
        "enabled": false,
        "description": "تكامل مع تطبيق الهاتف المحمول",
        "rolloutPercentage": 0,
        "targetAudience": "internal_testing",
        "inDevelopment": true
      }
    ],
    "userFlags": {
      "userId": "user_123",
      "enabledFeatures": [
        "advanced_search",
        "real_time_collaboration"
      ],
      "betaAccess": false,
      "premiumClient": true
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة على المشروع](../../00-overview/00-introduction.md)
- [لوحة الإدارة](../admin/01-admin-panel.md)
- [التكاملات الخارجية](./01-external-services.md)
- [الأمان والحوكمة](../admin/02-governance.md)
- [معالجة الأخطاء](../core/04-error-handling.md)
- [قاموس البيانات](../02-database/00-data-dictionary.md)

