# 🔔 نظام الإشعارات - Depth API v2.0

---

## المحتويات
- [إدارة الإشعارات](#إدارة-الإشعارات)
- [التفضيلات الشخصية](#التفضيلات-الشخصية)
- [الإشعارات الفورية](#الإشعارات-الفورية)
- [البريد الإلكتروني](#البريد-الإلكتروني)
- [التحليلات والإحصائيات](#التحليلات-والإحصائيات)

---

## إدارة الإشعارات

### `GET /notifications`
جلب جميع إشعارات المستخدم.

**معاملات الاستعلام:**
- `status`: unread|read|all
- `type`: project|payment|message|system|marketing
- `priority`: low|medium|high|urgent
- `page`: رقم الصفحة
- `limit`: عدد العناصر

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123abc",
        "type": "project_update",
        "priority": "high",
        "status": "unread",
        "title": "تحديث مشروع تصوير منتجات المطعم",
        "message": "تم رفع الصور النهائية للمراجعة",
        "details": {
          "projectId": "p_123abc",
          "projectTitle": "تصوير منتجات المطعم - الدفعة الأولى",
          "creatorName": "فاطمة الزهراء",
          "deliverables": 20,
          "actionRequired": true
        },
        "actions": [
          {
            "type": "view_gallery",
            "label": "عرض الصور",
            "url": "https://gallery.depth-agency.com/project/p_123abc"
          },
          {
            "type": "approve_delivery",
            "label": "الموافقة على التسليم",
            "url": "https://client.depth-agency.com/projects/p_123abc/approve"
          }
        ],
        "createdAt": "2025-09-01T16:00:00.000Z",
        "expiresAt": "2025-09-08T16:00:00.000Z",
        "readAt": null,
        "clickedAt": null
      },
      {
        "id": "notif_456def",
        "type": "payment_reminder",
        "priority": "medium",
        "status": "read",
        "title": "تذكير بموعد دفع الفاتورة",
        "message": "فاتورة INV-2025-001234 مستحقة خلال 3 أيام",
        "details": {
          "invoiceId": "inv_123abc",
          "invoiceNumber": "INV-2025-001234",
          "amount": 308000,
          "currency": "IQD",
          "dueDate": "2025-09-15T23:59:59.000Z",
          "overdueDays": 0
        },
        "actions": [
          {
            "type": "pay_now",
            "label": "دفع الآن",
            "url": "https://pay.depth-agency.com/invoice/inv_123abc"
          },
          {
            "type": "view_invoice",
            "label": "عرض الفاتورة",
            "url": "https://client.depth-agency.com/invoices/inv_123abc"
          }
        ],
        "createdAt": "2025-09-12T09:00:00.000Z",
        "readAt": "2025-09-12T10:30:00.000Z"
      },
      {
        "id": "notif_789ghi",
        "type": "message",
        "priority": "low",
        "status": "read",
        "title": "رسالة جديدة من المبدع",
        "message": "فاطمة الزهراء أرسلت رسالة حول موعد التصوير",
        "details": {
          "senderId": "c_789ghi",
          "senderName": "فاطمة الزهراء",
          "senderRole": "creator",
          "messagePreview": "أود تأكيد موعد جلسة التصوير غداً في الساعة 10 صباحاً...",
          "conversationId": "conv_123abc"
        },
        "actions": [
          {
            "type": "reply",
            "label": "الرد",
            "url": "https://client.depth-agency.com/messages/conv_123abc"
          }
        ],
        "createdAt": "2025-08-27T14:30:00.000Z",
        "readAt": "2025-08-27T15:00:00.000Z",
        "clickedAt": "2025-08-27T15:01:00.000Z"
      }
    ],
    "summary": {
      "total": 47,
      "unread": 12,
      "urgent": 2,
      "actionRequired": 5
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "pages": 3
  }
}
```

### `PUT /notifications/{notificationId}/mark-read`
تحديد إشعار كمقروء.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_123abc",
      "status": "read",
      "readAt": "2025-09-02T10:30:00.000Z"
    }
  },
  "message": "تم تحديد الإشعار كمقروء"
}
```

### `POST /notifications/mark-all-read`
تحديد جميع الإشعارات كمقروءة.

**الطلب:**
```json
{
  "filter": {
    "type": "project", // اختياري - لتحديد نوع معين
    "olderThan": "2025-09-01T00:00:00.000Z" // اختياري
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "updated": {
      "count": 12,
      "previousUnread": 12,
      "newUnread": 0
    }
  },
  "message": "تم تحديد جميع الإشعارات كمقروءة"
}
```

---

## التفضيلات الشخصية

### `GET /notifications/preferences`
جلب تفضيلات الإشعارات للمستخدم.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "userId": "cl_123abc",
      "channels": {
        "inApp": {
          "enabled": true,
          "priority": "all" // all | high_only | urgent_only
        },
        "email": {
          "enabled": true,
          "frequency": "immediate", // immediate | daily | weekly
          "quietHours": {
            "enabled": true,
            "start": "22:00",
            "end": "08:00",
            "timezone": "Asia/Baghdad"
          }
        },
        "sms": {
          "enabled": false,
          "phone": "07801234567",
          "priority": "urgent_only"
        },
        "whatsapp": {
          "enabled": true,
          "phone": "07801234567",
          "priority": "high_only"
        }
      },
      "categories": {
        "project_updates": {
          "enabled": true,
          "channels": ["inApp", "email", "whatsapp"],
          "priority": "medium"
        },
        "payment_reminders": {
          "enabled": true,
          "channels": ["inApp", "email"],
          "advanceNotice": ["7_days", "3_days", "1_day"]
        },
        "messages": {
          "enabled": true,
          "channels": ["inApp", "whatsapp"],
          "autoReply": false
        },
        "marketing": {
          "enabled": false,
          "channels": [],
          "frequency": "monthly"
        },
        "system_updates": {
          "enabled": true,
          "channels": ["inApp"],
          "criticalOnly": true
        }
      },
      "language": "ar",
      "timezone": "Asia/Baghdad",
      "digestSettings": {
        "enabled": true,
        "frequency": "weekly",
        "day": "sunday",
        "time": "09:00"
      }
    },
    "lastUpdated": "2025-08-20T12:00:00.000Z"
  }
}
```

### `PUT /notifications/preferences`
تحديث تفضيلات الإشعارات.

**الطلب:**
```json
{
  "channels": {
    "email": {
      "enabled": true,
      "frequency": "daily",
      "quietHours": {
        "enabled": true,
        "start": "23:00",
        "end": "07:00"
      }
    },
    "whatsapp": {
      "enabled": true,
      "priority": "medium_and_above"
    }
  },
  "categories": {
    "project_updates": {
      "enabled": true,
      "channels": ["inApp", "email", "whatsapp"]
    },
    "marketing": {
      "enabled": true,
      "channels": ["email"],
      "frequency": "monthly"
    }
  },
  "digestSettings": {
    "enabled": true,
    "frequency": "daily",
    "time": "08:00"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "updated": true,
      "changes": [
        "تم تمكين إشعارات الواتساب",
        "تم تغيير تكرار البريد الإلكتروني إلى يومي",
        "تم تمكين الإشعارات التسويقية"
      ],
      "effectiveFrom": "2025-09-02T15:00:00.000Z"
    }
  },
  "message": "تم تحديث تفضيلات الإشعارات بنجاح"
}
```

---

## الإشعارات الفورية

### `POST /notifications/send`
إرسال إشعار جديد.

**الطلب:**
```json
{
  "recipient": {
    "type": "user", // user | role | all | custom
    "userId": "cl_123abc",
    "role": null,
    "customList": []
  },
  "notification": {
    "type": "project_milestone",
    "priority": "high",
    "title": "تم إنجاز مرحلة التصوير",
    "message": "تم الانتهاء من جلسة التصوير بنجاح وسيتم البدء في المعالجة",
    "details": {
      "projectId": "p_123abc",
      "milestoneId": "ms_1",
      "nextMilestone": "المعالجة والتعديل",
      "estimatedDelivery": "2025-09-01T18:00:00.000Z"
    },
    "actions": [
      {
        "type": "view_preview",
        "label": "عرض المعاينة",
        "url": "https://gallery.depth-agency.com/preview/p_123abc"
      }
    ],
    "expiresAt": "2025-09-15T00:00:00.000Z"
  },
  "channels": {
    "inApp": true,
    "email": true,
    "whatsapp": false,
    "sms": false
  },
  "scheduling": {
    "sendAt": "immediate", // immediate | scheduled
    "scheduledFor": null,
    "respectQuietHours": true
  },
  "tracking": {
    "enabled": true,
    "trackClicks": true,
    "trackReads": true
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_new_123",
      "status": "sent",
      "sentAt": "2025-09-02T15:30:00.000Z",
      "channels": {
        "inApp": {
          "status": "delivered",
          "deliveredAt": "2025-09-02T15:30:01.000Z"
        },
        "email": {
          "status": "delivered",
          "deliveredAt": "2025-09-02T15:30:05.000Z",
          "subject": "تم إنجاز مرحلة التصوير - مشروع تصوير منتجات المطعم"
        }
      },
      "tracking": {
        "enabled": true,
        "trackingId": "track_123abc"
      }
    }
  },
  "message": "تم إرسال الإشعار بنجاح"
}
```

### `GET /notifications/{notificationId}/delivery-status`
متابعة حالة توصيل الإشعار.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_new_123",
      "createdAt": "2025-09-02T15:30:00.000Z",
      "status": "delivered"
    },
    "delivery": {
      "inApp": {
        "status": "delivered",
        "deliveredAt": "2025-09-02T15:30:01.000Z",
        "readAt": "2025-09-02T16:15:00.000Z",
        "clickedAt": "2025-09-02T16:16:00.000Z",
        "actions": [
          {
            "action": "view_preview",
            "clickedAt": "2025-09-02T16:16:00.000Z"
          }
        ]
      },
      "email": {
        "status": "delivered",
        "deliveredAt": "2025-09-02T15:30:05.000Z",
        "openedAt": "2025-09-02T15:45:00.000Z",
        "clickedAt": null,
        "bounced": false,
        "spamScore": 0.2
      }
    },
    "engagement": {
      "read": true,
      "clicked": true,
      "responseTime": "45 دقيقة",
      "actionTaken": true
    }
  }
}
```

---

## البريد الإلكتروني

### `GET /notifications/email/templates`
جلب قوالب البريد الإلكتروني.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "tpl_project_update",
        "name": "تحديث المشروع",
        "category": "project",
        "language": "ar",
        "subject": "تحديث على مشروعك: {{project_title}}",
        "preview": "تم إحراز تقدم جديد في مشروعك...",
        "variables": [
          "client_name",
          "project_title", 
          "milestone_name",
          "progress_percentage",
          "estimated_delivery"
        ],
        "lastUpdated": "2025-08-15T10:00:00.000Z",
        "usage": {
          "sent": 234,
          "opened": 198,
          "clicked": 156,
          "openRate": "84.6%",
          "clickRate": "66.7%"
        }
      },
      {
        "id": "tpl_payment_reminder",
        "name": "تذكير الدفع",
        "category": "payment",
        "subject": "تذكير: فاتورة {{invoice_number}} مستحقة خلال {{days_remaining}} أيام",
        "variables": [
          "client_name",
          "invoice_number",
          "amount",
          "due_date",
          "days_remaining"
        ],
        "usage": {
          "sent": 89,
          "opened": 82,
          "clicked": 67,
          "openRate": "92.1%",
          "clickRate": "75.3%"
        }
      }
    ]
  }
}
```

### `POST /notifications/email/send-custom`
إرسال بريد إلكتروني مخصص.

**الطلب:**
```json
{
  "template": "tpl_project_update",
  "recipient": {
    "email": "contact@alsham-restaurant.com",
    "name": "محمد أحمد السوري",
    "userId": "cl_123abc"
  },
  "variables": {
    "client_name": "محمد أحمد",
    "project_title": "تصوير منتجات المطعم - الدفعة الأولى",
    "milestone_name": "المعالجة والتعديل",
    "progress_percentage": "85%",
    "estimated_delivery": "1 سبتمبر 2025"
  },
  "customizations": {
    "subject": "تحديث مهم: تم إنجاز 85% من مشروع التصوير",
    "additionalMessage": "نشكركم على صبركم ونتطلع لعرض النتائج النهائية عليكم قريباً.",
    "attachments": [
      {
        "name": "معاينة_سريعة.pdf",
        "url": "https://api.depth-agency.com/files/preview_123.pdf"
      }
    ]
  },
  "scheduling": {
    "sendAt": "2025-09-02T18:00:00.000Z",
    "timezone": "Asia/Baghdad"
  },
  "tracking": {
    "enabled": true,
    "campaign": "project_updates_september"
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "email": {
      "id": "email_123abc",
      "messageId": "msg_789xyz@depth-agency.com",
      "status": "scheduled",
      "scheduledFor": "2025-09-02T18:00:00.000Z",
      "recipient": "contact@alsham-restaurant.com",
      "subject": "تحديث مهم: تم إنجاز 85% من مشروع التصوير",
      "tracking": {
        "enabled": true,
        "trackingPixel": true,
        "clickTracking": true
      }
    }
  },
  "message": "تم جدولة البريد الإلكتروني للإرسال"
}
```

### `GET /notifications/email/analytics`
تحليلات البريد الإلكتروني.

**معاملات الاستعلام:**
- `period`: week|month|quarter|year
- `template`: معرف القالب
- `campaign`: اسم الحملة

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-08-01T00:00:00.000Z",
      "end": "2025-08-31T23:59:59.000Z",
      "description": "أغسطس 2025"
    },
    "overview": {
      "totalSent": 856,
      "delivered": 834,
      "bounced": 22,
      "opened": 692,
      "clicked": 445,
      "unsubscribed": 3,
      "spamReports": 1
    },
    "rates": {
      "deliveryRate": "97.4%",
      "openRate": "83.0%",
      "clickRate": "64.3%",
      "unsubscribeRate": "0.4%",
      "spamRate": "0.1%"
    },
    "byTemplate": [
      {
        "template": "tpl_project_update",
        "name": "تحديث المشروع",
        "sent": 345,
        "openRate": "86.2%",
        "clickRate": "71.8%",
        "performance": "excellent"
      },
      {
        "template": "tpl_payment_reminder",
        "name": "تذكير الدفع",
        "sent": 234,
        "openRate": "92.1%",
        "clickRate": "78.2%",
        "performance": "excellent"
      }
    ],
    "trends": {
      "bestSendTime": "10:00 صباحاً",
      "bestSendDay": "الثلاثاء",
      "engagementGrowth": "+12.5%",
      "deliverabilityTrend": "stable"
    },
    "deviceBreakdown": {
      "mobile": "68%",
      "desktop": "28%",
      "tablet": "4%"
    },
    "geographic": {
      "بغداد": "71%",
      "البصرة": "18%",
      "أربيل": "11%"
    }
  }
}
```

---

## التحليلات والإحصائيات

### `GET /notifications/analytics`
تحليلات شاملة للإشعارات.

**معاملات الاستعلام:**
- `period`: week|month|quarter|year
- `channel`: inApp|email|sms|whatsapp
- `type`: project|payment|message|system

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalNotifications": 2847,
      "delivered": 2791,
      "read": 2234,
      "clicked": 1456,
      "failed": 56
    },
    "byChannel": {
      "inApp": {
        "sent": 2847,
        "delivered": 2847,
        "read": 2234,
        "readRate": "78.5%",
        "avgReadTime": "2.3 دقيقة"
      },
      "email": {
        "sent": 1245,
        "delivered": 1198,
        "opened": 987,
        "clicked": 654,
        "openRate": "82.4%",
        "clickRate": "66.4%"
      },
      "whatsapp": {
        "sent": 567,
        "delivered": 562,
        "read": 489,
        "replied": 123,
        "readRate": "87.0%",
        "responseRate": "25.1%"
      }
    },
    "byType": {
      "project": {
        "sent": 1534,
        "engagement": "87.2%",
        "actionTaken": "71.5%"
      },
      "payment": {
        "sent": 456,
        "engagement": "94.1%",
        "actionTaken": "82.3%"
      },
      "message": {
        "sent": 678,
        "engagement": "75.8%",
        "actionTaken": "68.9%"
      }
    },
    "userSegments": {
      "clients": {
        "totalUsers": 89,
        "activeUsers": 76,
        "avgNotificationsPerUser": 18.2,
        "topEngagers": 34
      },
      "creators": {
        "totalUsers": 23,
        "activeUsers": 21,
        "avgNotificationsPerUser": 31.7,
        "topEngagers": 18
      }
    },
    "trends": {
      "monthOverMonth": {
        "sentGrowth": "+15.2%",
        "engagementGrowth": "+8.7%",
        "qualityScore": 92.4
      },
      "peakTimes": [
        {"time": "10:00", "volume": 245},
        {"time": "14:00", "volume": 198},
        {"time": "16:00", "volume": 167}
      ],
      "responsePatterns": {
        "immediateResponse": "23%",
        "within1Hour": "45%",
        "within1Day": "78%",
        "after1Day": "22%"
      }
    },
    "optimization": {
      "suggestions": [
        "زيادة التخصيص في إشعارات المشاريع",
        "تحسين توقيت إرسال التذكيرات",
        "استخدام المزيد من الصور في الإشعارات",
        "تقليل تكرار الإشعارات التسويقية"
      ],
      "potentialImprovements": {
        "engagementIncrease": "+12%",
        "reductionInUnsubscribes": "-30%",
        "fasterResponseTime": "-25%"
      }
    }
  }
}
```

### `GET /notifications/user-journey`
تحليل رحلة المستخدم مع الإشعارات.

**معاملات الاستعلام:**
- `userId`: معرف المستخدم
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cl_123abc",
      "name": "محمد أحمد السوري",
      "role": "client",
      "joinedAt": "2025-06-15T10:00:00.000Z"
    },
    "journey": {
      "totalInteractions": 45,
      "engagementScore": 8.7,
      "responsePattern": "highly_engaged",
      "preferredChannels": ["whatsapp", "email", "inApp"],
      "preferredTime": "10:00-12:00"
    },
    "timeline": [
      {
        "date": "2025-08-26T18:00:00.000Z",
        "event": "notification_received",
        "type": "project_quote",
        "channel": "email",
        "action": "opened_immediately",
        "responseTime": "5 دقائق",
        "outcome": "quote_accepted"
      },
      {
        "date": "2025-08-28T09:30:00.000Z",
        "event": "notification_received",
        "type": "project_started",
        "channel": "whatsapp",
        "action": "acknowledged",
        "responseTime": "15 دقيقة",
        "outcome": "positive_feedback"
      },
      {
        "date": "2025-09-01T16:00:00.000Z",
        "event": "notification_received",
        "type": "project_delivery",
        "channel": "inApp",
        "action": "viewed_gallery",
        "responseTime": "2 ساعة",
        "outcome": "approved_delivery"
      }
    ],
    "patterns": {
      "mostResponsiveTo": "project_updates",
      "leastResponsiveTo": "marketing",
      "avgResponseTime": "1.2 ساعة",
      "bestPerformingChannel": "whatsapp",
      "engagementTrend": "increasing"
    },
    "recommendations": {
      "optimizedTiming": "10:00-11:00 صباحاً",
      "preferredChannels": ["whatsapp", "inApp"],
      "contentPreferences": ["visual_updates", "milestone_progress"],
      "frequency": "moderate"
    }
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](./00-overview.md)
- [المصادقة والأمان](./01-authentication.md)
- [نظام المبدعين](./02-creators-api.md)
- [نظام العملاء](./03-clients-api.md)
- [إدارة المشاريع](./04-projects-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [التكاملات الخارجية](./10-integrations-api.md)
- [رموز الأخطاء](./12-error-codes.md)
