# 🔒 الأمان والحوكمة - Depth API v2.0

> SSOT — مصدر الحقيقة الوحيد (RBAC): documentation/99-reference/05-roles-matrix.md
> ✅ **تم إضافة شارة SSOT (2025-08-23):** توضيح مرجع مصفوفة الأدوار والصلاحيات

---

## المحتويات
- [نظام الأدوار والصلاحيات](#نظام-الأدوار-والصلاحيات)
- [إدارة الجلسات](#إدارة-الجلسات)
- [سجلات التدقيق](#سجلات-التدقيق)
- [الحماية من الاختراق](#الحماية-من-الاختراق)
- [النسخ الاحتياطي والاستعادة](#النسخ-الاحتياطي-والاستعادة)

---

## نظام الأدوار والصلاحيات

### `GET /governance/roles`
جلب جميع الأدوار المتاحة في النظام.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "super_admin",
        "name": "مدير النظام العام",
        "nameEn": "Super Administrator",
        "level": 10,
        "type": "system",
        "description": "صلاحيات كاملة على جميع أجزاء النظام",
        "permissions": ["*"],
        "userCount": 2,
        "protected": true,
        "createdAt": "2025-01-01T00:00:00.000Z"
      },
      {
        "id": "admin",
        "name": "مدير",
        "nameEn": "Administrator",
        "level": 8,
        "type": "admin",
        "description": "إدارة المستخدمين والمشاريع والنظام",
        "permissions": [
          "users.manage",
          "projects.manage",
          "creators.manage",
          "clients.manage",
          "finances.view",
          "reports.view",
          "system.configure"
        ],
        "userCount": 5,
        "protected": false,
        "createdAt": "2025-01-01T00:00:00.000Z"
      },
      {
        "id": "project_manager",
        "name": "مدير مشاريع",
        "nameEn": "Project Manager",
        "level": 6,
        "type": "staff",
        "description": "إدارة المشاريع وتنسيق المبدعين",
        "permissions": [
          "projects.create",
          "projects.edit",
          "projects.assign",
          "creators.view",
          "clients.view",
          "messages.send",
          "notifications.send"
        ],
        "userCount": 8,
        "protected": false,
        "createdAt": "2025-01-15T00:00:00.000Z"
      },
      {
        "id": "creator",
        "name": "مبدع",
        "nameEn": "Creator",
        "level": 4,
        "type": "user",
        "description": "تنفيذ المشاريع وإدارة الملف الشخصي",
        "permissions": [
          "profile.edit",
          "projects.view_assigned",
          "projects.update_progress",
          "gallery.manage",
          "messages.send",
          "availability.manage",
          "earnings.view"
        ],
        "userCount": 123,
        "protected": false,
        "createdAt": "2025-01-01T00:00:00.000Z"
      },
      {
        "id": "client",
        "name": "عميل",
        "nameEn": "Client",
        "level": 2,
        "type": "user",
        "description": "طلب مشاريع وإدارة الحساب",
        "permissions": [
          "profile.edit",
          "projects.create",
          "projects.view_own",
          "invoices.view",
          "messages.send",
          "reviews.create"
        ],
        "userCount": 456,
        "protected": false,
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "permissionCategories": [
      {
        "category": "users",
        "name": "إدارة المستخدمين",
        "permissions": [
          {"key": "users.view", "name": "عرض المستخدمين"},
          {"key": "users.create", "name": "إنشاء مستخدمين"},
          {"key": "users.edit", "name": "تحرير المستخدمين"},
          {"key": "users.delete", "name": "حذف المستخدمين"},
          {"key": "users.manage", "name": "إدارة شاملة للمستخدمين"}
        ]
      },
      {
        "category": "projects",
        "name": "إدارة المشاريع",
        "permissions": [
          {"key": "projects.view", "name": "عرض جميع المشاريع"},
          {"key": "projects.view_own", "name": "عرض المشاريع الخاصة"},
          {"key": "projects.create", "name": "إنشاء مشاريع"},
          {"key": "projects.edit", "name": "تحرير المشاريع"},
          {"key": "projects.assign", "name": "تعيين المبدعين"},
          {"key": "projects.manage", "name": "إدارة شاملة للمشاريع"}
        ]
      },
      {
        "category": "finances",
        "name": "الشؤون المالية",
        "permissions": [
          {"key": "finances.view", "name": "عرض البيانات المالية"},
          {"key": "invoices.create", "name": "إنشاء فواتير"},
          {"key": "invoices.view", "name": "عرض الفواتير"},
          {"key": "payments.process", "name": "معالجة المدفوعات"},
          {"key": "earnings.view", "name": "عرض الأرباح"}
        ]
      }
    ]
  }
}
```

### `POST /governance/roles`
إنشاء دور جديد.

**الطلب:**
```json
{
  "id": "content_reviewer",
  "name": "مراجع المحتوى",
  "nameEn": "Content Reviewer",
  "level": 5,
  "type": "staff",
  "description": "مراجعة وتدقيق المحتوى المُنتج",
  "permissions": [
    "projects.view",
    "gallery.review",
    "content.approve",
    "content.reject",
    "messages.send",
    "reports.create"
  ],
  "inheritsFrom": "staff_base" // دور أساسي للوراثة
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "role": {
      "id": "content_reviewer",
      "name": "مراجع المحتوى",
      "nameEn": "Content Reviewer",
      "level": 5,
      "type": "staff",
      "description": "مراجعة وتدقيق المحتوى المُنتج",
      "permissions": [
        "projects.view",
        "gallery.review", 
        "content.approve",
        "content.reject",
        "messages.send",
        "reports.create",
        "profile.edit" // موروثة من staff_base
      ],
      "userCount": 0,
      "protected": false,
      "createdAt": "2025-09-02T18:30:00.000Z",
      "createdBy": "admin_123"
    }
  },
  "message": "تم إنشاء الدور بنجاح"
}
```

### `POST /governance/roles/{roleId}/assign`
تعيين دور لمستخدم.

**الطلب:**
```json
{
  "userId": "user_123abc",
  "expiresAt": "2026-09-02T18:30:00.000Z", // اختياري
  "reason": "ترقية لمنصب مراجع المحتوى",
  "restrictedPermissions": ["content.delete"], // صلاحيات محظورة
  "additionalPermissions": ["reports.export"] // صلاحيات إضافية
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "assign_123abc",
      "userId": "user_123abc",
      "roleId": "content_reviewer",
      "assignedAt": "2025-09-02T18:35:00.000Z",
      "assignedBy": "admin_123",
      "expiresAt": "2026-09-02T18:30:00.000Z",
      "status": "active",
      "effectivePermissions": [
        "projects.view",
        "gallery.review",
        "content.approve",
        "content.reject",
        "messages.send",
        "reports.create",
        "reports.export",
        "profile.edit"
        // لا يتضمن content.delete
      ],
      "restrictions": ["content.delete"],
      "additions": ["reports.export"]
    }
  },
  "message": "تم تعيين الدور بنجاح"
}
```

### `GET /governance/permissions/check`
فحص صلاحية معينة للمستخدم الحالي.

**معاملات الاستعلام:**
- `permission`: الصلاحية المطلوب فحصها
- `resource`: المورد المحدد (اختياري)
- `context`: السياق الإضافي (اختياري)

**مثال:** `GET /governance/permissions/check?permission=projects.edit&resource=project_123`

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "permission": "projects.edit",
    "resource": "project_123",
    "allowed": true,
    "reason": "user_has_role",
    "details": {
      "userRole": "project_manager",
      "roleLevel": 6,
      "requiredLevel": 4,
      "directPermission": true,
      "inheritedPermission": false,
      "resourceOwner": false,
      "temporaryAccess": false
    },
    "limitations": [],
    "expiresAt": null
  }
}
```

---

## إدارة الجلسات

### `GET /governance/sessions`
جلب جلسات المستخدم النشطة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_123abc",
        "status": "active",
        "current": true,
        "device": {
          "type": "desktop",
          "os": "macOS",
          "browser": "Chrome 118",
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
        },
        "location": {
          "ip": "185.123.45.67",
          "country": "Iraq",
          "city": "Baghdad",
          "region": "Baghdad Governorate",
          "approximate": true
        },
        "authentication": {
          "method": "email_password",
          "mfaEnabled": true,
          "lastMfaAt": "2025-09-02T08:00:00.000Z"
        },
        "activity": {
          "createdAt": "2025-09-02T08:00:00.000Z",
          "lastActiveAt": "2025-09-02T18:45:00.000Z",
          "requestCount": 234,
          "lastEndpoint": "/api/projects/123/progress",
          "duration": "10 ساعات و 45 دقيقة"
        },
        "security": {
          "riskScore": "low",
          "flags": [],
          "encryptionLevel": "AES-256"
        }
      },
      {
        "id": "session_456def",
        "status": "active",
        "current": false,
        "device": {
          "type": "mobile",
          "os": "iOS 17.1",
          "browser": "Safari",
          "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X)..."
        },
        "location": {
          "ip": "185.123.45.89",
          "country": "Iraq",
          "city": "Baghdad",
          "region": "Baghdad Governorate",
          "approximate": true
        },
        "authentication": {
          "method": "email_password",
          "mfaEnabled": true,
          "lastMfaAt": "2025-09-01T19:30:00.000Z"
        },
        "activity": {
          "createdAt": "2025-09-01T19:30:00.000Z",
          "lastActiveAt": "2025-09-02T07:15:00.000Z",
          "requestCount": 89,
          "lastEndpoint": "/api/messages",
          "duration": "11 ساعة و 45 دقيقة"
        },
        "security": {
          "riskScore": "low",
          "flags": [],
          "encryptionLevel": "AES-256"
        }
      },
      {
        "id": "session_789xyz",
        "status": "suspicious",
        "current": false,
        "device": {
          "type": "desktop",
          "os": "Windows 11",
          "browser": "Edge 118",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
        },
        "location": {
          "ip": "194.87.123.45",
          "country": "Russia",
          "city": "Moscow",
          "region": "Moscow",
          "approximate": true
        },
        "authentication": {
          "method": "email_password",
          "mfaEnabled": false,
          "mfaAttempts": 3,
          "lastMfaFailAt": "2025-09-02T14:20:00.000Z"
        },
        "activity": {
          "createdAt": "2025-09-02T14:00:00.000Z",
          "lastActiveAt": "2025-09-02T14:25:00.000Z",
          "requestCount": 15,
          "lastEndpoint": "/api/admin/users",
          "duration": "25 دقيقة"
        },
        "security": {
          "riskScore": "high",
          "flags": [
            "unusual_location",
            "failed_mfa",
            "admin_access_attempt",
            "automated_behavior"
          ],
          "encryptionLevel": "AES-256",
          "blocked": true,
          "blockedAt": "2025-09-02T14:25:00.000Z"
        }
      }
    ],
    "summary": {
      "totalSessions": 3,
      "activeSessions": 2,
      "suspiciousSessions": 1,
      "blockedSessions": 1,
      "uniqueLocations": 2,
      "uniqueDevices": 3
    }
  }
}
```

### `DELETE /governance/sessions/{sessionId}`
إنهاء جلسة محددة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session_789xyz",
      "status": "terminated",
      "terminatedAt": "2025-09-02T19:00:00.000Z",
      "terminatedBy": "user",
      "reason": "security_concern"
    }
  },
  "message": "تم إنهاء الجلسة بنجاح"
}
```

### `POST /governance/sessions/terminate-all`
إنهاء جميع الجلسات عدا الجلسة الحالية.

**الطلب:**
```json
{
  "reason": "security_review",
  "excludeCurrent": true,
  "excludeSessions": ["session_456def"] // جلسات استثناء
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "terminatedSessions": [
      {
        "id": "session_789xyz",
        "device": "Windows Desktop",
        "location": "Moscow, Russia",
        "terminatedAt": "2025-09-02T19:05:00.000Z"
      }
    ],
    "totalTerminated": 1,
    "activeSessions": 2
  },
  "message": "تم إنهاء الجلسات المحددة بنجاح"
}
```

---

## سجلات التدقيق

### `GET /governance/audit-logs`
جلب سجلات التدقيق.

**معاملات الاستعلام:**
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية
- `userId`: مستخدم محدد
- `action`: نوع العملية
- `resource`: نوع المورد
- `level`: مستوى الأهمية
- `page`: رقم الصفحة

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123abc",
        "timestamp": "2025-09-02T18:30:00.000Z",
        "level": "warning",
        "category": "security",
        "action": "failed_login_attempt",
        "resource": {
          "type": "user_account",
          "id": "user_456def",
          "name": "أحمد محمد علي"
        },
        "actor": {
          "type": "anonymous",
          "ip": "194.87.123.45",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
          "location": {
            "country": "Russia",
            "city": "Moscow"
          }
        },
        "details": {
          "attempts": 5,
          "reason": "invalid_password",
          "accountLocked": true,
          "lockDuration": "30 دقيقة"
        },
        "metadata": {
          "sessionId": null,
          "requestId": "req_789xyz",
          "correlationId": "corr_abc123"
        }
      },
      {
        "id": "log_456def",
        "timestamp": "2025-09-02T17:45:00.000Z",
        "level": "info",
        "category": "business",
        "action": "project_completed",
        "resource": {
          "type": "project",
          "id": "project_123abc",
          "name": "تصوير منتجات المطعم الشامي"
        },
        "actor": {
          "type": "user",
          "id": "creator_789xyz",
          "name": "فاطمة أحمد الصالح",
          "role": "creator"
        },
        "details": {
          "previousStatus": "active",
          "newStatus": "completed",
          "deliverables": 45,
          "clientNotified": true,
          "invoiceGenerated": true
        },
        "metadata": {
          "sessionId": "session_123abc",
          "requestId": "req_def456",
          "clientId": "client_456def"
        }
      },
      {
        "id": "log_789xyz",
        "timestamp": "2025-09-02T16:20:00.000Z",
        "level": "critical",
        "category": "system",
        "action": "admin_privilege_escalation",
        "resource": {
          "type": "user_role",
          "id": "role_admin",
          "name": "مدير النظام"
        },
        "actor": {
          "type": "user",
          "id": "admin_123abc",
          "name": "علي جواد محمد",
          "role": "super_admin"
        },
        "details": {
          "targetUser": "user_new_admin",
          "targetUserName": "سارة أحمد الكريم",
          "previousRole": "project_manager",
          "newRole": "admin",
          "justification": "ترقية لمنصب إداري جديد",
          "approvedBy": "ceo_approval_001"
        },
        "metadata": {
          "sessionId": "session_456def",
          "requestId": "req_xyz789",
          "approvalWorkflow": "admin_promotion_001"
        }
      }
    ],
    "summary": {
      "totalLogs": 15678,
      "filteredLogs": 234,
      "byLevel": {
        "critical": 5,
        "warning": 45,
        "info": 167,
        "debug": 17
      },
      "byCategory": {
        "security": 67,
        "business": 123,
        "system": 34,
        "performance": 10
      },
      "timeRange": {
        "start": "2025-09-01T00:00:00.000Z",
        "end": "2025-09-02T23:59:59.000Z"
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

### `POST /governance/audit-logs`
إنشاء سجل تدقيق مخصص.

**الطلب:**
```json
{
  "level": "info",
  "category": "business",
  "action": "custom_workflow_completed",
  "resource": {
    "type": "workflow",
    "id": "workflow_123",
    "name": "مراجعة المحتوى المخصص"
  },
  "details": {
    "steps": 5,
    "duration": "2 ساعة و 30 دقيقة",
    "participants": ["reviewer_001", "creator_002"],
    "outcome": "approved"
  },
  "metadata": {
    "clientId": "client_123",
    "projectId": "project_456"
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "log": {
      "id": "log_custom_001",
      "timestamp": "2025-09-02T19:30:00.000Z",
      "level": "info",
      "category": "business",
      "action": "custom_workflow_completed",
      "processed": true
    }
  },
  "message": "تم تسجيل السجل بنجاح"
}
```

### `GET /governance/audit-logs/export`
تصدير سجلات التدقيق.

**معاملات الاستعلام:**
- `format`: csv|json|excel
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية
- `filters`: مرشحات إضافية

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "export": {
      "id": "export_123abc",
      "format": "excel",
      "status": "processing",
      "recordCount": 1567,
      "estimatedSize": "2.3 MB",
      "createdAt": "2025-09-02T19:45:00.000Z",
      "estimatedCompletion": "2025-09-02T19:48:00.000Z",
      "downloadUrl": null // سيتم توفيره عند الانتهاء
    }
  },
  "message": "جاري تحضير ملف التصدير"
}
```

---

## الحماية من الاختراق

### `GET /governance/security/threats`
جلب التهديدات الأمنية المكتشفة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "threats": [
      {
        "id": "threat_123abc",
        "type": "brute_force_attack",
        "severity": "high",
        "status": "mitigated",
        "source": {
          "ip": "194.87.123.45",
          "country": "Russia",
          "asn": "AS12345 Evil Corp",
          "reputation": "malicious"
        },
        "target": {
          "type": "login_endpoint",
          "endpoint": "/api/auth/login",
          "targetedUsers": ["admin_123", "user_456"]
        },
        "detection": {
          "detectedAt": "2025-09-02T14:00:00.000Z",
          "method": "rate_limit_exceeded",
          "confidence": 95,
          "rules": ["failed_login_pattern", "geographic_anomaly"]
        },
        "activity": {
          "attempts": 150,
          "duration": "25 دقيقة",
          "successfulAttempts": 0,
          "affectedAccounts": 2
        },
        "response": {
          "action": "ip_blocked",
          "appliedAt": "2025-09-02T14:25:00.000Z",
          "duration": "24 ساعة",
          "notificationsSent": true,
          "escalated": true
        }
      },
      {
        "id": "threat_456def",
        "type": "sql_injection_attempt",
        "severity": "critical",
        "status": "blocked",
        "source": {
          "ip": "203.45.67.89",
          "country": "Unknown",
          "asn": "AS67890 Suspicious Network",
          "reputation": "unknown"
        },
        "target": {
          "type": "api_endpoint",
          "endpoint": "/api/projects/search",
          "parameter": "query",
          "payload": "'; DROP TABLE users; --"
        },
        "detection": {
          "detectedAt": "2025-09-02T15:30:00.000Z",
          "method": "waf_rule",
          "confidence": 99,
          "rules": ["sql_injection_signature", "malicious_payload"]
        },
        "response": {
          "action": "request_blocked",
          "appliedAt": "2025-09-02T15:30:00.000Z",
          "duration": "immediate",
          "ipBlocked": true,
          "alertLevel": "critical"
        }
      }
    ],
    "summary": {
      "last24Hours": {
        "totalThreats": 45,
        "blocked": 43,
        "mitigated": 2,
        "investigating": 0
      },
      "bySeverity": {
        "critical": 5,
        "high": 12,
        "medium": 23,
        "low": 5
      },
      "byType": {
        "brute_force": 15,
        "sql_injection": 8,
        "xss_attempt": 12,
        "ddos": 3,
        "bot_attack": 7
      },
      "topSources": [
        {"country": "Russia", "count": 18},
        {"country": "China", "count": 12},
        {"country": "Unknown", "count": 8}
      ]
    }
  }
}
```

### `POST /governance/security/block-ip`
حظر عنوان IP محدد.

**الطلب:**
```json
{
  "ip": "194.87.123.45",
  "reason": "repeated_failed_login_attempts",
  "duration": "24h", // 1h, 24h, 7d, permanent
  "note": "محاولات متكررة لاختراق حسابات المديرين",
  "notifyAdmins": true,
  "cascadeToFirewall": true
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "block": {
      "id": "block_123abc",
      "ip": "194.87.123.45",
      "status": "active",
      "appliedAt": "2025-09-02T20:00:00.000Z",
      "expiresAt": "2025-09-03T20:00:00.000Z",
      "reason": "repeated_failed_login_attempts",
      "appliedBy": "security_system",
      "cascaded": {
        "cloudflare": true,
        "firewall": true
      },
      "notifications": {
        "adminsSent": 3,
        "escalated": false
      }
    }
  },
  "message": "تم حظر العنوان بنجاح"
}
```

### `GET /governance/security/firewall-rules`
جلب قواعد الحماية النشطة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "rule_rate_limit",
        "name": "حد معدل الطلبات",
        "type": "rate_limiting",
        "status": "active",
        "priority": 10,
        "conditions": {
          "requests": 100,
          "window": "1 minute",
          "scope": "per_ip"
        },
        "action": "temporary_block",
        "actionDuration": "5 minutes",
        "triggered": 234,
        "lastTriggered": "2025-09-02T19:45:00.000Z"
      },
      {
        "id": "rule_geo_block",
        "name": "حظر جغرافي",
        "type": "geolocation",
        "status": "active",
        "priority": 5,
        "conditions": {
          "blockedCountries": ["CN", "RU", "KP"],
          "allowedPaths": ["/api/public/*"]
        },
        "action": "block",
        "exceptions": ["185.123.45.0/24"], // نطاقات مستثناة
        "triggered": 1567,
        "lastTriggered": "2025-09-02T19:50:00.000Z"
      },
      {
        "id": "rule_sql_injection",
        "name": "حماية من SQL Injection",
        "type": "signature_based",
        "status": "active",
        "priority": 15,
        "conditions": {
          "patterns": [
            "UNION.*SELECT",
            "DROP.*TABLE",
            "'; --",
            "OR 1=1"
          ],
          "checkFields": ["query", "search", "filter"]
        },
        "action": "block_and_log",
        "sensitivity": "high",
        "triggered": 78,
        "lastTriggered": "2025-09-02T15:30:00.000Z"
      }
    ],
    "statistics": {
      "totalRules": 15,
      "activeRules": 13,
      "disabledRules": 2,
      "triggersLast24h": 2890,
      "blockedRequests": 1567,
      "falsePositives": 23
    }
  }
}
```

---

## النسخ الاحتياطي والاستعادة

### `GET /governance/backups`
جلب معلومات النسخ الاحتياطية.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "id": "backup_20250902_daily",
        "type": "automated_daily",
        "status": "completed",
        "createdAt": "2025-09-02T03:00:00.000Z",
        "completedAt": "2025-09-02T03:45:00.000Z",
        "duration": "45 دقيقة",
        "size": "2.34 GB",
        "compressed": true,
        "encrypted": true,
        "location": "cloudflare_r2",
        "retention": "30 days",
        "scope": {
          "database": true,
          "files": true,
          "configuration": true,
          "logs": false
        },
        "integrity": {
          "verified": true,
          "checksum": "sha256:abc123def456...",
          "verifiedAt": "2025-09-02T04:00:00.000Z"
        },
        "statistics": {
          "totalRecords": 15678,
          "totalFiles": 12456,
          "compressionRatio": "67%",
          "transferTime": "12 دقيقة"
        }
      },
      {
        "id": "backup_20250901_weekly",
        "type": "automated_weekly",
        "status": "completed",
        "createdAt": "2025-09-01T02:00:00.000Z",
        "completedAt": "2025-09-01T03:30:00.000Z",
        "duration": "1 ساعة و 30 دقيقة",
        "size": "5.67 GB",
        "compressed": true,
        "encrypted": true,
        "location": "cloudflare_r2",
        "retention": "12 weeks",
        "scope": {
          "database": true,
          "files": true,
          "configuration": true,
          "logs": true,
          "analytics": true
        },
        "integrity": {
          "verified": true,
          "checksum": "sha256:def456ghi789...",
          "verifiedAt": "2025-09-01T04:00:00.000Z"
        }
      },
      {
        "id": "backup_20250902_manual",
        "type": "manual",
  "status": "active",
        "createdAt": "2025-09-02T20:00:00.000Z",
        "estimatedCompletion": "2025-09-02T20:30:00.000Z",
        "progress": 67,
        "currentPhase": "compressing_files",
        "location": "cloudflare_r2",
        "scope": {
          "database": true,
          "files": true,
          "configuration": false,
          "logs": false
        },
        "triggeredBy": "admin_123",
        "reason": "pre_maintenance_backup"
      }
    ],
    "schedule": {
      "daily": {
        "enabled": true,
        "time": "03:00",
        "timezone": "Asia/Baghdad",
        "retention": "30 days",
        "nextRun": "2025-09-03T03:00:00.000Z"
      },
      "weekly": {
        "enabled": true,
        "day": "sunday",
        "time": "02:00",
        "timezone": "Asia/Baghdad",
        "retention": "12 weeks",
        "nextRun": "2025-09-08T02:00:00.000Z"
      },
      "monthly": {
        "enabled": true,
        "date": 1,
        "time": "01:00",
        "timezone": "Asia/Baghdad",
        "retention": "12 months",
        "nextRun": "2025-10-01T01:00:00.000Z"
      }
    },
    "storage": {
      "provider": "cloudflare_r2",
      "usedSpace": "45.67 GB",
      "availableSpace": "954.33 GB",
      "monthlyGrowth": "+2.34 GB",
      "estimatedFull": "2027-08-15"
    }
  }
}
```

### `POST /governance/backups/create`
إنشاء نسخة احتياطية يدوية.

**الطلب:**
```json
{
  "type": "manual",
  "name": "backup_before_major_update",
  "scope": {
    "database": true,
    "files": true,
    "configuration": true,
    "logs": false,
    "analytics": false
  },
  "options": {
    "compression": true,
    "encryption": true,
    "verification": true
  },
  "metadata": {
    "reason": "نسخة احتياطية قبل التحديث الرئيسي v2.1",
    "requestedBy": "system_admin",
    "urgency": "high"
  }
}
```

**الاستجابة الناجحة (202):**
```json
{
  "success": true,
  "data": {
    "backup": {
      "id": "backup_manual_20250902_001",
  "status": "pending",
      "estimatedDuration": "30-45 دقيقة",
      "estimatedSize": "2.1 GB",
      "estimatedCompletion": "2025-09-02T21:00:00.000Z",
      "trackingUrl": "/api/governance/backups/backup_manual_20250902_001/status"
    }
  },
  "message": "تم بدء عملية النسخ الاحتياطي"
}
```

### `POST /governance/restore`
استعادة النظام من نسخة احتياطية.

**الطلب:**
```json
{
  "backupId": "backup_20250901_weekly",
  "restoreScope": {
    "database": true,
    "files": false,
    "configuration": true
  },
  "options": {
    "verifyIntegrity": true,
    "createPreRestoreBackup": true,
    "stopServices": true,
    "testMode": false
  },
  "confirmation": {
    "acknowledged": true,
    "confirmationCode": "RESTORE_20250902_CONFIRM",
    "authorizedBy": "super_admin_001"
  }
}
```

**الاستجابة الناجحة (202):**
```json
{
  "success": true,
  "data": {
    "restore": {
      "id": "restore_20250902_001",
  "status": "pending",
      "backupId": "backup_20250901_weekly",
      "estimatedDuration": "1-2 ساعة",
      "phases": [
        "pre_restore_backup",
        "service_shutdown",
        "data_restoration",
        "configuration_restoration",
        "integrity_verification",
        "service_startup",
        "functionality_test"
      ],
      "currentPhase": "pre_restore_backup",
      "estimatedCompletion": "2025-09-02T23:00:00.000Z",
      "trackingUrl": "/api/governance/restore/restore_20250902_001/status"
    }
  },
  "message": "تم بدء عملية الاستعادة - سيتم إيقاف الخدمات مؤقتاً"
}
```

### `GET /governance/disaster-recovery/plan`
جلب خطة التعافي من الكوارث.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "plan": {
      "version": "2.1",
      "lastUpdated": "2025-08-15T10:00:00.000Z",
      "rto": "4 ساعات", // Recovery Time Objective
      "rpo": "1 ساعة", // Recovery Point Objective
      "scenarios": [
        {
          "id": "database_failure",
          "name": "فشل قاعدة البيانات الرئيسية",
          "likelihood": "medium",
          "impact": "critical",
          "response": {
            "immediate": [
              "تفعيل قاعدة البيانات الاحتياطية",
              "إعادة توجيه حركة المرور",
              "إشعار فريق الطوارئ"
            ],
            "shortTerm": [
              "تشخيص المشكلة الأساسية",
              "إصلاح قاعدة البيانات الرئيسية",
              "مزامنة البيانات"
            ],
            "longTerm": [
              "مراجعة أسباب الفشل",
              "تحديث آليات المراقبة",
              "تدريب الفريق"
            ]
          },
          "estimatedRecovery": "2 ساعة"
        },
        {
          "id": "ddos_attack",
          "name": "هجوم حجب الخدمة",
          "likelihood": "high",
          "impact": "high",
          "response": {
            "immediate": [
              "تفعيل حماية Cloudflare المتقدمة",
              "تحليل مصدر الهجوم",
              "تطبيق قواعد الحظر"
            ],
            "shortTerm": [
              "تقييم فعالية الحماية",
              "توسيع نطاق الخوادم",
              "تحديث قواعد الأمان"
            ]
          },
          "estimatedRecovery": "30 دقيقة"
        }
      ],
      "contacts": {
        "primary": {
          "name": "علي جواد محمد",
          "role": "مدير النظام",
          "phone": "+964-7xx-xxx-xxxx",
          "email": "ali@depth-agency.com"
        },
        "secondary": {
          "name": "سارة أحمد الكريم",
          "role": "مديرة التقنية",
          "phone": "+964-7xx-xxx-xxxx",
          "email": "sara@depth-agency.com"
        }
      },
      "infrastructure": {
        "primary": {
          "provider": "Cloudflare + Firebase",
          "location": "Global CDN",
          "capacity": "auto-scaling"
        },
        "backup": {
          "provider": "Firebase Secondary",
          "location": "EU-West",
          "capacity": "80% of primary"
        }
      }
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [المصادقة والأمان](../core/01-authentication.md)
- [لوحة الأدمن](./01-admin-panel.md)
- [التكاملات الخارجية](../integrations/01-external-services.md)
- [رموز الأخطاء](../core/04-error-handling.md)
- [قاموس البيانات](../../02-database/00-data-dictionary.md)

