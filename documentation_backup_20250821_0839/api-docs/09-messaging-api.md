# 💬 الرسائل والتواصل - Depth API v2.0

---

## المحتويات
- [المحادثات الفردية](#المحادثات-الفردية)
- [رسائل المشاريع](#رسائل-المشاريع)
- [الرسائل الجماعية](#الرسائل-الجماعية)
- [المرفقات والوسائط](#المرفقات-والوسائط)
- [الإعدادات والتفضيلات](#الإعدادات-والتفضيلات)

---

## المحادثات الفردية

### `GET /messages/conversations`
جلب قائمة المحادثات.

**معاملات الاستعلام:**
- `status`: active|archived|muted
- `type`: direct|project|support
- `unreadOnly`: true|false
- `page`: رقم الصفحة
- `limit`: عدد العناصر

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_123abc",
        "type": "project",
        "title": "مشروع تصوير منتجات المطعم",
        "participants": [
          {
            "id": "cl_123abc",
            "name": "محمد أحمد السوري",
            "role": "client",
            "avatar": "https://cdn.depth-agency.com/avatars/client_123.jpg"
          },
          {
            "id": "c_789ghi",
            "name": "فاطمة الزهراء",
            "role": "creator",
            "avatar": "https://cdn.depth-agency.com/avatars/creator_789.jpg"
          },
          {
            "id": "pm_456def",
            "name": "علي الدوسري",
            "role": "project_manager",
            "avatar": "https://cdn.depth-agency.com/avatars/pm_456.jpg"
          }
        ],
        "lastMessage": {
          "id": "msg_789xyz",
          "senderId": "c_789ghi",
          "senderName": "فاطمة الزهراء",
          "content": "تم الانتهاء من المعالجة، الصور جاهزة للمراجعة",
          "timestamp": "2025-09-01T15:30:00.000Z",
          "type": "text",
          "attachments": 2
        },
        "unreadCount": 1,
        "isArchived": false,
        "isMuted": false,
        "projectId": "p_123abc",
        "createdAt": "2025-08-26T10:00:00.000Z",
        "updatedAt": "2025-09-01T15:30:00.000Z"
      },
      {
        "id": "conv_456def",
        "type": "direct",
        "title": "محادثة مع أحمد الربيعي",
        "participants": [
          {
            "id": "cl_123abc",
            "name": "محمد أحمد السوري",
            "role": "client"
          },
          {
            "id": "c_456def",
            "name": "أحمد محمد الربيعي",
            "role": "creator"
          }
        ],
        "lastMessage": {
          "id": "msg_456xyz",
          "senderId": "c_456def",
          "senderName": "أحمد محمد الربيعي",
          "content": "مرحباً، شكراً لاختياري للمشروع القادم",
          "timestamp": "2025-08-30T14:20:00.000Z",
          "type": "text"
        },
        "unreadCount": 0,
        "isArchived": false,
        "isMuted": false,
        "createdAt": "2025-08-30T14:00:00.000Z",
        "updatedAt": "2025-08-30T14:20:00.000Z"
      }
    ],
    "summary": {
      "total": 8,
      "unread": 3,
      "archived": 1,
      "muted": 0
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "pages": 1
  }
}
```

### `GET /messages/conversations/{conversationId}`
جلب تفاصيل محادثة محددة.

**معاملات الاستعلام:**
- `page`: رقم الصفحة للرسائل
- `limit`: عدد الرسائل
- `before`: جلب الرسائل قبل معرف معين

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv_123abc",
      "type": "project",
      "title": "مشروع تصوير منتجات المطعم",
      "projectId": "p_123abc",
      "participants": [
        {
          "id": "cl_123abc",
          "name": "محمد أحمد السوري",
          "role": "client",
          "lastSeen": "2025-09-01T16:00:00.000Z",
          "isOnline": false
        },
        {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "role": "creator",
          "lastSeen": "2025-09-01T15:45:00.000Z",
          "isOnline": true
        },
        {
          "id": "pm_456def",
          "name": "علي الدوسري",
          "role": "project_manager",
          "lastSeen": "2025-09-01T15:30:00.000Z",
          "isOnline": false
        }
      ],
      "settings": {
        "notifications": true,
        "readReceipts": true,
        "typing": true
      },
      "createdAt": "2025-08-26T10:00:00.000Z"
    },
    "messages": [
      {
        "id": "msg_789xyz",
        "senderId": "c_789ghi",
        "senderName": "فاطمة الزهراء",
        "senderRole": "creator",
        "type": "text",
        "content": "تم الانتهاء من المعالجة، الصور جاهزة للمراجعة",
        "timestamp": "2025-09-01T15:30:00.000Z",
        "editedAt": null,
        "attachments": [
          {
            "id": "att_123abc",
            "type": "image",
            "name": "preview_batch_1.jpg",
            "size": 245678,
            "url": "https://cdn.depth-agency.com/attachments/att_123abc.jpg",
            "thumbnail": "https://cdn.depth-agency.com/attachments/att_123abc_thumb.jpg"
          },
          {
            "id": "att_456def",
            "type": "image",
            "name": "preview_batch_2.jpg",
            "size": 298765,
            "url": "https://cdn.depth-agency.com/attachments/att_456def.jpg",
            "thumbnail": "https://cdn.depth-agency.com/attachments/att_456def_thumb.jpg"
          }
        ],
        "readBy": [
          {
            "userId": "pm_456def",
            "readAt": "2025-09-01T15:32:00.000Z"
          }
        ],
        "reactions": [
          {
            "emoji": "👍",
            "userId": "pm_456def",
            "timestamp": "2025-09-01T15:33:00.000Z"
          }
        ]
      },
      {
        "id": "msg_456xyz",
        "senderId": "pm_456def",
        "senderName": "علي الدوسري",
        "senderRole": "project_manager",
        "type": "text",
        "content": "ممتاز! سأقوم بإشعار العميل للمراجعة",
        "timestamp": "2025-09-01T15:28:00.000Z",
        "readBy": [
          {
            "userId": "c_789ghi",
            "readAt": "2025-09-01T15:29:00.000Z"
          }
        ]
      },
      {
        "id": "msg_123xyz",
        "senderId": "c_789ghi",
        "senderName": "فاطمة الزهراء",
        "senderRole": "creator",
        "type": "milestone_update",
        "content": "تم إنجاز مرحلة المعالجة والتعديل",
        "timestamp": "2025-09-01T15:25:00.000Z",
        "metadata": {
          "milestoneId": "ms_2",
          "milestoneName": "المعالجة والتعديل",
          "progress": 100,
          "nextMilestone": "التسليم النهائي"
        },
        "systemGenerated": true
      }
    ],
    "typingIndicators": [
      {
        "userId": "cl_123abc",
        "userName": "محمد أحمد السوري",
        "startedAt": "2025-09-01T16:05:00.000Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 127,
    "pages": 3,
    "hasMore": true
  }
}
```

### `POST /messages/conversations/{conversationId}/messages`
إرسال رسالة جديدة.

**الطلب:**
```json
{
  "type": "text", // text | image | file | system
  "content": "شكراً فاطمة، الصور رائعة! لدي ملاحظة بسيطة على الصورة الثالثة",
  "attachments": [
    {
      "type": "image",
      "fileId": "file_123abc",
      "caption": "الصورة مع التعديل المطلوب"
    }
  ],
  "replyTo": "msg_789xyz", // اختياري - للرد على رسالة محددة
  "metadata": {
    "priority": "normal", // low | normal | high | urgent
    "actionRequired": false,
    "tags": ["feedback", "revision"]
  }
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_new_123",
      "senderId": "cl_123abc",
      "senderName": "محمد أحمد السوري",
      "type": "text",
      "content": "شكراً فاطمة، الصور رائعة! لدي ملاحظة بسيطة على الصورة الثالثة",
      "timestamp": "2025-09-01T16:10:00.000Z",
      "attachments": [
        {
          "id": "att_new_123",
          "type": "image",
          "name": "feedback_image.jpg",
          "url": "https://cdn.depth-agency.com/attachments/att_new_123.jpg"
        }
      ],
      "replyTo": {
        "messageId": "msg_789xyz",
        "content": "تم الانتهاء من المعالجة...",
        "senderName": "فاطمة الزهراء"
      },
      "deliveryStatus": "sent"
    },
    "conversation": {
      "id": "conv_123abc",
      "lastMessage": "msg_new_123",
      "updatedAt": "2025-09-01T16:10:00.000Z"
    }
  },
  "message": "تم إرسال الرسالة بنجاح"
}
```

---

## رسائل المشاريع

### `GET /messages/projects/{projectId}/timeline`
جلب الخط الزمني للتواصل في المشروع.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "p_123abc",
      "title": "تصوير منتجات المطعم - الدفعة الأولى",
      "status": "in_progress"
    },
    "timeline": [
      {
        "id": "timeline_001",
        "timestamp": "2025-08-26T18:00:00.000Z",
        "type": "project_created",
        "title": "تم إنشاء المشروع",
        "description": "بدء مشروع تصوير منتجات المطعم",
        "participant": {
          "id": "admin",
          "name": "النظام",
          "role": "system"
        },
        "automatic": true
      },
      {
        "id": "timeline_002",
        "timestamp": "2025-08-27T09:30:00.000Z",
        "type": "message",
        "title": "رسالة من المبدع",
        "description": "\"مرحباً، متحمس للعمل معكم في هذا المشروع\"",
        "participant": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "role": "creator"
        },
        "messageId": "msg_intro_123",
        "attachments": 0
      },
      {
        "id": "timeline_003",
        "timestamp": "2025-08-28T10:00:00.000Z",
        "type": "milestone_started",
        "title": "بدء جلسة التصوير",
        "description": "بدء العمل على المرحلة الأولى من المشروع",
        "participant": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "role": "creator"
        },
        "milestoneId": "ms_1",
        "automatic": false
      },
      {
        "id": "timeline_004",
        "timestamp": "2025-08-28T16:30:00.000Z",
        "type": "milestone_completed",
        "title": "انتهاء جلسة التصوير",
        "description": "تم تصوير جميع المنتجات بنجاح - 142 صورة",
        "participant": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "role": "creator"
        },
        "milestoneId": "ms_1",
        "deliverables": ["142 صورة خام"],
        "automatic": false
      },
      {
        "id": "timeline_005",
        "timestamp": "2025-08-29T10:15:00.000Z",
        "type": "feedback",
        "title": "تعليقات العميل",
        "description": "\"ممتاز! نتطلع لرؤية النتائج النهائية\"",
        "participant": {
          "id": "cl_123abc",
          "name": "محمد أحمد السوري",
          "role": "client"
        },
        "messageId": "msg_feedback_456",
        "rating": 5
      }
    ],
    "summary": {
      "totalEvents": 12,
      "messages": 8,
      "milestones": 3,
      "feedback": 2,
      "attachments": 15
    }
  }
}
```

### `POST /messages/projects/{projectId}/broadcast`
إرسال رسالة لجميع المشاركين في المشروع.

**الطلب:**
```json
{
  "title": "تحديث مهم على المشروع",
  "content": "تم تأجيل موعد التسليم النهائي يوماً واحداً بسبب طلب تعديلات إضافية من العميل",
  "type": "announcement", // announcement | update | reminder | alert
  "priority": "high",
  "recipients": {
    "include": ["client", "creator", "project_manager"],
    "exclude": []
  },
  "attachments": [
    {
      "type": "document",
      "fileId": "file_schedule_update",
      "name": "جدول_محدث.pdf"
    }
  ],
  "actionRequired": false,
  "expiresAt": "2025-09-10T00:00:00.000Z"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "broadcast": {
      "id": "broadcast_123abc",
      "projectId": "p_123abc",
      "title": "تحديث مهم على المشروع",
      "sentAt": "2025-09-02T11:00:00.000Z",
      "sentBy": "pm_456def",
      "recipients": [
        {
          "userId": "cl_123abc",
          "role": "client",
          "deliveryStatus": "delivered",
          "readAt": null
        },
        {
          "userId": "c_789ghi",
          "role": "creator",
          "deliveryStatus": "delivered",
          "readAt": "2025-09-02T11:05:00.000Z"
        }
      ],
      "totalRecipients": 2,
      "deliveredTo": 2,
      "readBy": 1
    }
  },
  "message": "تم إرسال الرسالة لجميع المشاركين"
}
```

---

## الرسائل الجماعية

### `POST /messages/groups/create`
إنشاء مجموعة رسائل جديدة.

**الطلب:**
```json
{
  "name": "فريق التصوير - شهر سبتمبر",
  "description": "مجموعة لتنسيق مشاريع التصوير الشهر الحالي",
  "type": "project_team", // project_team | department | announcement | support
  "participants": [
    {
      "userId": "c_789ghi",
      "role": "member"
    },
    {
      "userId": "c_456def",
      "role": "member"
    },
    {
      "userId": "pm_456def",
      "role": "admin"
    }
  ],
  "settings": {
    "allowAllToAdd": false,
    "allowAllToEdit": false,
    "requireApproval": true,
    "archiveAfter": "30_days"
  },
  "avatar": "group_avatar_photo.jpg"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "group": {
      "id": "group_123abc",
      "name": "فريق التصوير - شهر سبتمبر",
      "description": "مجموعة لتنسيق مشاريع التصوير الشهر الحالي",
      "type": "project_team",
      "createdBy": "pm_456def",
      "createdAt": "2025-09-02T12:00:00.000Z",
      "participantCount": 3,
      "avatar": "https://cdn.depth-agency.com/groups/group_123abc_avatar.jpg",
      "inviteCode": "JOIN-ABC123"
    }
  },
  "message": "تم إنشاء المجموعة بنجاح"
}
```

### `GET /messages/groups/{groupId}/messages`
جلب رسائل المجموعة.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "group": {
      "id": "group_123abc",
      "name": "فريق التصوير - شهر سبتمبر",
      "participantCount": 3,
      "unreadCount": 2
    },
    "messages": [
      {
        "id": "gmsg_123abc",
        "senderId": "pm_456def",
        "senderName": "علي الدوسري",
        "type": "text",
        "content": "مرحباً بالجميع، هذه مجموعة لتنسيق مشاريع هذا الشهر",
        "timestamp": "2025-09-02T12:01:00.000Z",
        "readBy": [
          {
            "userId": "c_789ghi",
            "readAt": "2025-09-02T12:05:00.000Z"
          }
        ],
        "reactions": [
          {
            "emoji": "👋",
            "users": ["c_789ghi", "c_456def"],
            "count": 2
          }
        ]
      },
      {
        "id": "gmsg_456def",
        "senderId": "c_789ghi",
        "senderName": "فاطمة الزهراء",
        "type": "text",
        "content": "ممتاز! متحمسة للتعاون مع الفريق",
        "timestamp": "2025-09-02T12:06:00.000Z",
        "readBy": [
          {
            "userId": "pm_456def",
            "readAt": "2025-09-02T12:07:00.000Z"
          }
        ]
      }
    ]
  }
}
```

---

## المرفقات والوسائط

### `POST /messages/attachments/upload`
رفع مرفق للاستخدام في الرسائل.

**الطلب (multipart/form-data):**
```
file: [binary data]
conversationId: conv_123abc
caption: لقطة من جلسة التصوير اليوم
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "attachment": {
      "id": "att_123abc",
      "name": "behind_scenes_001.jpg",
      "type": "image",
      "size": 1245678,
      "mimeType": "image/jpeg",
      "dimensions": {
        "width": 1920,
        "height": 1080
      },
      "url": "https://cdn.depth-agency.com/attachments/att_123abc.jpg",
      "thumbnail": "https://cdn.depth-agency.com/attachments/att_123abc_thumb.jpg",
      "caption": "لقطة من جلسة التصوير اليوم",
      "uploadedAt": "2025-09-02T13:00:00.000Z",
      "expiresAt": "2025-12-02T13:00:00.000Z", // 3 أشهر
      "downloadCount": 0
    }
  },
  "message": "تم رفع المرفق بنجاح"
}
```

### `GET /messages/attachments/{attachmentId}/download`
تحميل مرفق محدد.

**معاملات الاستعلام:**
- `quality`: original|high|medium|low (للصور)
- `format`: original|jpg|png|webp (للصور)

**الاستجابة الناجحة (200):**
```
Content-Type: image/jpeg
Content-Disposition: attachment; filename="behind_scenes_001.jpg"
Content-Length: 1245678

[Binary Image Data]
```

### `POST /messages/voice/record`
تسجيل رسالة صوتية.

**الطلب:**
```json
{
  "conversationId": "conv_123abc",
  "duration": 45, // بالثواني
  "audioData": "base64_encoded_audio_data",
  "format": "mp3",
  "caption": "توضيح سريع لمتطلبات التصوير"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "voiceMessage": {
      "id": "voice_123abc",
      "duration": 45,
      "size": 567890,
      "url": "https://cdn.depth-agency.com/voice/voice_123abc.mp3",
      "waveform": [0.2, 0.5, 0.8, 0.3, 0.6, 0.4], // للعرض البصري
      "caption": "توضيح سريع لمتطلبات التصوير",
      "uploadedAt": "2025-09-02T13:30:00.000Z"
    }
  },
  "message": "تم حفظ الرسالة الصوتية"
}
```

---

## الإعدادات والتفضيلات

### `GET /messages/settings`
جلب إعدادات الرسائل للمستخدم.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "notifications": {
        "newMessage": {
          "enabled": true,
          "sound": true,
          "vibration": true,
          "badge": true
        },
        "mentions": {
          "enabled": true,
          "sound": true,
          "priority": "high"
        },
        "groupMessages": {
          "enabled": true,
          "sound": false,
          "mutedGroups": []
        }
      },
      "privacy": {
        "readReceipts": true,
        "lastSeen": true,
        "typing": true,
        "onlineStatus": true
      },
      "interface": {
        "theme": "light", // light | dark | auto
        "fontSize": "medium", // small | medium | large
        "language": "ar",
        "rtl": true
      },
      "media": {
        "autoDownload": {
          "wifi": ["images", "documents"],
          "cellular": ["images"],
          "roaming": []
        },
        "compression": {
          "images": "medium", // low | medium | high
          "videos": "high"
        }
      },
      "security": {
        "endToEndEncryption": true,
        "screenshotNotification": true,
        "messageForwarding": true,
        "linkPreviews": true
      }
    }
  }
}
```

### `PUT /messages/settings`
تحديث إعدادات الرسائل.

**الطلب:**
```json
{
  "notifications": {
    "newMessage": {
      "enabled": true,
      "sound": false
    },
    "groupMessages": {
      "sound": false
    }
  },
  "privacy": {
    "readReceipts": false,
    "lastSeen": false
  },
  "interface": {
    "theme": "dark",
    "fontSize": "large"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "updated": {
      "notifications": ["newMessage.sound", "groupMessages.sound"],
      "privacy": ["readReceipts", "lastSeen"],
      "interface": ["theme", "fontSize"]
    },
    "effectiveFrom": "2025-09-02T14:00:00.000Z"
  },
  "message": "تم تحديث الإعدادات بنجاح"
}
```

### `POST /messages/conversations/{conversationId}/mute`
كتم محادثة محددة.

**الطلب:**
```json
{
  "duration": "24_hours", // 1_hour | 8_hours | 24_hours | 1_week | forever
  "reason": "تقليل الإزعاج أثناء العمل"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv_123abc",
      "muted": true,
      "mutedUntil": "2025-09-03T14:00:00.000Z",
      "mutedBy": "cl_123abc",
      "mutedAt": "2025-09-02T14:00:00.000Z"
    }
  },
  "message": "تم كتم المحادثة لمدة 24 ساعة"
}
```

### `GET /messages/search`
البحث في الرسائل.

**معاملات الاستعلام:**
- `query`: نص البحث
- `conversationId`: البحث في محادثة محددة
- `type`: text|image|file|voice
- `dateFrom`: تاريخ البداية
- `dateTo`: تاريخ النهاية
- `sender`: المرسل

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "query": "جلسة التصوير",
    "results": [
      {
        "messageId": "msg_123abc",
        "conversationId": "conv_123abc",
        "conversationTitle": "مشروع تصوير منتجات المطعم",
        "senderId": "c_789ghi",
        "senderName": "فاطمة الزهراء",
        "content": "تم الانتهاء من جلسة التصوير بنجاح",
        "timestamp": "2025-08-28T16:30:00.000Z",
        "type": "text",
        "highlights": [
          "جلسة التصوير"
        ],
        "context": {
          "before": "لقد انتهيت من",
          "after": "وحصلت على 142 صورة"
        }
      },
      {
        "messageId": "msg_456def",
        "conversationId": "conv_456def",
        "conversationTitle": "محادثة مع أحمد الربيعي",
        "senderId": "cl_123abc",
        "senderName": "محمد أحمد السوري",
        "content": "متى يمكن ترتيب جلسة التصوير القادمة؟",
        "timestamp": "2025-08-25T11:20:00.000Z",
        "type": "text",
        "highlights": [
          "جلسة التصوير"
        ]
      }
    ],
    "summary": {
      "totalResults": 7,
      "conversations": 3,
      "timeRange": {
        "oldest": "2025-08-15T10:00:00.000Z",
        "newest": "2025-09-01T15:30:00.000Z"
      }
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 7,
    "pages": 1
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](./00-overview.md)
- [نظام المبدعين](./02-creators-api.md)
- [نظام العملاء](./03-clients-api.md)
- [إدارة المشاريع](./04-projects-api.md)
- [نظام الإشعارات](./07-notifications-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [التكاملات الخارجية](./10-integrations-api.md)
- [رموز الأخطاء](./12-error-codes.md)

