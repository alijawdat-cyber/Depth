# 📁 الملفات والتخزين - Depth API v2.0

---

## المحتويات
- [رفع الملفات](#رفع-الملفات)
- [إدارة المعرض](#إدارة-المعرض)
- [معالجة الصور](#معالجة-الصور)
- [التخزين السحابي](#التخزين-السحابي)
- [الحماية والأمان](#الحماية-والأمان)

---

## رفع الملفات

### `POST /storage/upload`
رفع ملف جديد إلى النظام.

**الطلب (multipart/form-data):**
```
Content-Type: multipart/form-data

file: [binary data]
projectId: p_123abc (optional)
category: portfolio|project_delivery|reference|logo|attachment
description: صورة المنتج النهائية
tags: food,photography,final
visibility: public|private|client_only
autoProcess: true
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_123abc",
      "name": "dish_001_final.jpg",
      "originalName": "منتج_شوربة_العدس.jpg",
      "category": "project_delivery",
      "mimeType": "image/jpeg",
      "size": 2547832,
      "dimensions": {
        "width": 4000,
        "height": 3000,
        "aspectRatio": "4:3"
      },
      "metadata": {
        "camera": "Sony A7R IV",
        "lens": "FE 24-70mm f/2.8 GM",
        "iso": 200,
        "aperture": "f/5.6",
        "shutterSpeed": "1/125s",
        "capturedAt": "2025-08-28T10:30:00.000Z"
      },
      "urls": {
        "original": "https://cdn.depth-agency.com/files/file_123abc/original.jpg",
        "preview": "https://cdn.depth-agency.com/files/file_123abc/preview.jpg",
        "thumbnail": "https://cdn.depth-agency.com/files/file_123abc/thumb.jpg"
      },
      "cloudflare": {
        "imageId": "cf_img_789xyz",
        "variants": {
          "thumbnail": "https://imagedelivery.net/abc123/file_123abc/thumbnail",
          "medium": "https://imagedelivery.net/abc123/file_123abc/medium",
          "large": "https://imagedelivery.net/abc123/file_123abc/large"
        }
      },
      "uploadedAt": "2025-09-01T14:30:00.000Z",
      "uploadedBy": "c_789ghi",
      "processingStatus": "completed",
      "visibility": "client_only",
      "downloadCount": 0
    },
    "processing": {
      "autoOptimization": "enabled",
      "thumbnailGeneration": "completed",
      "formatConversion": "completed",
      "virusScan": "clean"
    }
  },
  "message": "تم رفع الملف بنجاح ومعالجته تلقائياً"
}
```

### `POST /storage/upload/batch`
رفع عدة ملفات دفعة واحدة.

**الطلب:**
```json
{
  "projectId": "p_123abc",
  "category": "project_delivery",
  "description": "الصور النهائية للمشروع",
  "files": [
    {
      "uploadId": "temp_upload_001",
      "name": "dish_001.jpg",
      "description": "شوربة العدس",
      "tags": ["soup", "final", "edited"]
    },
    {
      "uploadId": "temp_upload_002", 
      "name": "dish_002.jpg",
      "description": "كبة حلب",
      "tags": ["main_course", "final", "edited"]
    }
  ],
  "autoProcess": true,
  "generatePreview": true,
  "notifyClient": true
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "batchUpload": {
      "id": "batch_123abc",
      "projectId": "p_123abc",
      "totalFiles": 2,
      "successfulUploads": 2,
      "failedUploads": 0,
      "totalSize": 5124576,
      "uploadedAt": "2025-09-01T14:30:00.000Z"
    },
    "files": [
      {
        "id": "file_123abc",
        "name": "dish_001.jpg",
        "status": "processed",
        "url": "https://cdn.depth-agency.com/files/file_123abc/original.jpg"
      },
      {
        "id": "file_456def",
        "name": "dish_002.jpg", 
        "status": "processed",
        "url": "https://cdn.depth-agency.com/files/file_456def/original.jpg"
      }
    ],
    "gallery": {
      "created": true,
      "id": "gallery_123abc",
      "url": "https://gallery.depth-agency.com/project/p_123abc"
    }
  },
  "message": "تم رفع جميع الملفات بنجاح وإنشاء معرض للمشروع"
}
```

---

## إدارة المعرض

### `GET /galleries/project/{projectId}`
جلب معرض مشروع محدد.

**معاملات الاستعلام:**
- `category`: all|final|draft|reference
- `sortBy`: date|name|size|rating
- `page`: رقم الصفحة
- `limit`: عدد العناصر

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "gallery": {
      "id": "gallery_123abc",
      "projectId": "p_123abc",
      "title": "معرض مشروع تصوير منتجات المطعم",
      "description": "جميع صور المشروع من البداية للنهاية",
      "privacy": "client_and_creator",
      "totalFiles": 47,
      "categories": {
        "final": 20,
        "draft": 15,
        "reference": 8,
        "behind_scenes": 4
      },
      "createdAt": "2025-08-28T09:00:00.000Z",
      "updatedAt": "2025-09-01T16:00:00.000Z"
    },
    "files": [
      {
        "id": "file_123abc",
        "name": "dish_001_final.jpg",
        "category": "final",
        "description": "شوربة العدس - الصورة النهائية",
        "mimeType": "image/jpeg",
        "size": 2547832,
        "dimensions": {
          "width": 4000,
          "height": 3000
        },
        "urls": {
          "thumbnail": "https://imagedelivery.net/abc123/file_123abc/thumbnail",
          "medium": "https://imagedelivery.net/abc123/file_123abc/medium",
          "original": "https://cdn.depth-agency.com/files/file_123abc/original.jpg"
        },
        "metadata": {
          "rating": 5,
          "clientApproved": true,
          "tags": ["soup", "final", "approved"],
          "uploadedAt": "2025-09-01T14:30:00.000Z"
        },
        "downloadInfo": {
          "downloadCount": 3,
          "lastDownload": "2025-09-02T10:15:00.000Z",
          "downloadable": true
        }
      },
      {
        "id": "file_456def",
        "name": "dish_002_final.jpg",
        "category": "final",
        "description": "كبة حلب - الصورة النهائية",
        "urls": {
          "thumbnail": "https://imagedelivery.net/abc123/file_456def/thumbnail",
          "medium": "https://imagedelivery.net/abc123/file_456def/medium"
        },
        "metadata": {
          "rating": 5,
          "clientApproved": true,
          "tags": ["main_course", "final", "approved"]
        }
      }
    ],
    "downloadOptions": {
      "individualFiles": true,
      "bulkDownload": {
        "available": true,
        "zipUrl": "https://api.depth-agency.com/galleries/gallery_123abc/download-all",
        "estimatedSize": "120 MB",
        "expiresAt": "2025-12-01T00:00:00.000Z"
      },
      "categoryDownload": {
        "final": "https://api.depth-agency.com/galleries/gallery_123abc/download?category=final",
        "draft": "https://api.depth-agency.com/galleries/gallery_123abc/download?category=draft"
      }
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

### `POST /galleries/{galleryId}/organize`
تنظيم وترتيب المعرض.

**الطلب:**
```json
{
  "actions": [
    {
      "type": "categorize",
      "fileIds": ["file_123abc", "file_456def"],
      "category": "final",
      "subcategory": "hero_shots"
    },
    {
      "type": "reorder",
      "fileIds": ["file_123abc", "file_789ghi"],
      "newOrder": [2, 1]
    },
    {
      "type": "tag",
      "fileIds": ["file_123abc"],
      "addTags": ["featured", "website_ready"],
      "removeTags": ["draft"]
    },
    {
      "type": "rate",
      "fileId": "file_123abc",
      "rating": 5,
      "notes": "صورة ممتازة للاستخدام الرئيسي"
    }
  ],
  "updateVisibility": {
    "finalFiles": "public",
    "draftFiles": "creator_only"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "updated": {
      "filesAffected": 5,
      "categoriesUpdated": 2,
      "tagsModified": 8,
      "ratingsAdded": 1
    },
    "gallery": {
      "id": "gallery_123abc",
      "lastOrganizedAt": "2025-09-02T11:00:00.000Z",
      "organizationScore": 95 // مدى تنظيم المعرض
    }
  },
  "message": "تم تنظيم المعرض بنجاح"
}
```

---

## معالجة الصور

### `POST /processing/images/{fileId}/enhance`
تحسين وتعديل صورة موجودة.

**الطلب:**
```json
{
  "enhancements": {
    "autoCorrection": {
      "enabled": true,
      "level": "moderate" // light | moderate | aggressive
    },
    "colorGrading": {
      "brightness": 10,
      "contrast": 15,
      "saturation": 8,
      "vibrance": 12,
      "temperature": -200,
      "tint": 50
    },
    "sharpening": {
      "enabled": true,
      "amount": 1.2,
      "radius": 0.8
    },
    "noiseReduction": {
      "enabled": true,
      "level": "light"
    },
    "cropping": {
      "enabled": true,
      "aspectRatio": "16:9",
      "focusPoint": {
        "x": 0.5,
        "y": 0.4
      }
    }
  },
  "formats": [
    {
      "type": "web_optimized",
      "width": 1920,
      "quality": 85,
      "format": "jpeg"
    },
    {
      "type": "social_media",
      "width": 1080,
      "quality": 90,
      "format": "jpeg"
    },
    {
      "type": "thumbnail",
      "width": 300,
      "quality": 80,
      "format": "webp"
    }
  ],
  "watermark": {
    "enabled": true,
    "type": "logo", // logo | text
    "position": "bottom_right",
    "opacity": 0.7,
    "size": "small"
  },
  "metadata": {
    "preserveOriginal": true,
    "removeExif": false,
    "addCopyright": "© 2025 Depth Creative Agency"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "processing": {
      "id": "proc_123abc",
      "originalFileId": "file_123abc",
      "status": "completed",
      "startedAt": "2025-09-02T12:00:00.000Z",
      "completedAt": "2025-09-02T12:03:30.000Z",
      "processingTime": "3.5 ثانية"
    },
    "results": [
      {
        "id": "file_enhanced_123",
        "type": "web_optimized",
        "name": "dish_001_enhanced_web.jpg",
        "size": 1245678,
        "dimensions": {
          "width": 1920,
          "height": 1080
        },
        "url": "https://cdn.depth-agency.com/files/file_enhanced_123/web.jpg",
        "cloudflareUrl": "https://imagedelivery.net/abc123/file_enhanced_123/web"
      },
      {
        "id": "file_social_123",
        "type": "social_media",
        "name": "dish_001_social.jpg",
        "size": 567890,
        "dimensions": {
          "width": 1080,
          "height": 1080
        },
        "url": "https://cdn.depth-agency.com/files/file_social_123/social.jpg"
      },
      {
        "id": "file_thumb_123",
        "type": "thumbnail",
        "name": "dish_001_thumb.webp",
        "size": 23456,
        "dimensions": {
          "width": 300,
          "height": 300
        },
        "url": "https://cdn.depth-agency.com/files/file_thumb_123/thumb.webp"
      }
    ],
    "analytics": {
      "compressionRatio": "68%",
      "qualityScore": 94,
      "sizeReduction": "2.1 MB → 835 KB",
      "loadTimeImprovement": "73%"
    }
  },
  "message": "تم تحسين الصورة بنجاح وإنشاء عدة نسخ محسنة"
}
```

### `POST /processing/bulk/resize`
تغيير حجم عدة صور دفعة واحدة.

**الطلب:**
```json
{
  "fileIds": ["file_123abc", "file_456def", "file_789ghi"],
  "resizeOptions": [
    {
      "name": "website_hero",
      "width": 1920,
      "height": 1080,
      "quality": 85,
      "format": "jpeg",
      "cropMode": "smart" // smart | center | focus_point
    },
    {
      "name": "instagram_post",
      "width": 1080,
      "height": 1080,
      "quality": 90,
      "format": "jpeg",
      "cropMode": "center"
    },
    {
      "name": "facebook_cover",
      "width": 820,
      "height": 312,
      "quality": 85,
      "format": "jpeg"
    }
  ],
  "watermark": {
    "enabled": true,
    "logoUrl": "https://cdn.depth-agency.com/brand/watermark.png",
    "position": "bottom_right",
    "opacity": 0.6
  },
  "outputSettings": {
    "createGallery": true,
    "galleryName": "صور وسائل التواصل - سبتمبر 2025",
    "notifyClient": true
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "batchProcess": {
      "id": "batch_proc_123",
      "status": "completed",
      "totalFiles": 3,
      "totalOutputs": 9, // 3 files × 3 sizes
      "processingTime": "12.8 ثانية",
      "startedAt": "2025-09-02T13:00:00.000Z",
      "completedAt": "2025-09-02T13:00:12.800Z"
    },
    "results": {
      "file_123abc": [
        {
          "size": "website_hero",
          "url": "https://cdn.depth-agency.com/processed/file_123abc_hero.jpg",
          "fileSize": "1.2 MB"
        },
        {
          "size": "instagram_post", 
          "url": "https://cdn.depth-agency.com/processed/file_123abc_insta.jpg",
          "fileSize": "567 KB"
        },
        {
          "size": "facebook_cover",
          "url": "https://cdn.depth-agency.com/processed/file_123abc_fb.jpg",
          "fileSize": "234 KB"
        }
      ]
    },
    "gallery": {
      "id": "gallery_social_123",
      "name": "صور وسائل التواصل - سبتمبر 2025",
      "url": "https://gallery.depth-agency.com/social/gallery_social_123",
      "downloadPackage": "https://api.depth-agency.com/galleries/gallery_social_123/download-all.zip"
    },
    "totalSavings": {
      "originalSize": "15.6 MB",
      "processedSize": "6.2 MB",
      "compressionRatio": "60%"
    }
  },
  "message": "تم معالجة جميع الصور بنجاح وإنشاء معرض منفصل"
}
```

---

## التخزين السحابي

### `GET /storage/analytics`
تحليلات استخدام التخزين.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalFiles": 2847,
      "totalSize": "45.6 GB",
      "monthlyUpload": "8.2 GB",
      "storageLimit": "500 GB",
      "usagePercentage": 9.1
    },
    "breakdown": {
      "byCategory": [
        {
          "category": "project_deliveries",
          "fileCount": 1243,
          "size": "28.4 GB",
          "percentage": 62.3
        },
        {
          "category": "portfolios",
          "fileCount": 856,
          "size": "12.1 GB",
          "percentage": 26.5
        },
        {
          "category": "references",
          "fileCount": 524,
          "size": "3.8 GB",
          "percentage": 8.3
        },
        {
          "category": "logos_assets",
          "fileCount": 224,
          "size": "1.3 GB",
          "percentage": 2.9
        }
      ],
      "byFileType": [
        {
          "type": "JPEG",
          "count": 1567,
          "size": "32.1 GB",
          "averageSize": "20.5 MB"
        },
        {
          "type": "PNG",
          "count": 445,
          "size": "8.9 GB",
          "averageSize": "20.0 MB"
        },
        {
          "type": "MP4",
          "count": 89,
          "size": "3.4 GB",
          "averageSize": "38.2 MB"
        },
        {
          "type": "RAW",
          "count": 234,
          "size": "1.2 GB",
          "averageSize": "5.1 MB"
        }
      ]
    },
    "cloudflareIntegration": {
      "imagesStored": 2012,
      "deliveryRequests": 45678,
      "bandwidthSaved": "89.2 GB",
      "cachingEfficiency": "96.4%",
      "averageLoadTime": "0.8 ثانية"
    },
    "trends": {
      "monthlyGrowth": "+12.5%",
      "popularCategories": ["food_photography", "product_shots", "events"],
      "peakUploadTimes": ["10:00-12:00", "14:00-16:00"],
      "geographicDistribution": {
        "بغداد": "68%",
        "البصرة": "18%",
        "أربيل": "14%"
      }
    },
    "optimization": {
      "compressionSavings": "67%",
      "duplicateFiles": 12,
      "unusedFiles": 34,
      "suggestedCleanup": "2.1 GB"
    }
  }
}
```

### `POST /storage/optimize`
تحسين وتنظيف التخزين.

**الطلب:**
```json
{
  "actions": {
    "removeDuplicates": true,
    "cleanupUnused": true,
    "compressOldFiles": {
      "enabled": true,
      "olderThan": "6 months",
      "quality": 80
    },
    "migrateToCloudflare": {
      "enabled": true,
      "categories": ["project_deliveries", "portfolios"]
    }
  },
  "preserveOriginals": true,
  "createBackup": true,
  "notifyUsers": false
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "optimization": {
      "id": "opt_123abc",
      "status": "completed",
      "startedAt": "2025-09-02T15:00:00.000Z",
      "completedAt": "2025-09-02T15:45:30.000Z",
      "processingTime": "45.5 دقيقة"
    },
    "results": {
      "duplicatesRemoved": 12,
      "unusedFilesDeleted": 34,
      "filesCompressed": 456,
      "migratedToCloudflare": 234,
      "spaceSaved": "8.7 GB",
      "costSavings": "$67/month"
    },
    "newMetrics": {
      "totalSize": "36.9 GB",
      "usageReduction": "19.1%",
      "performanceImprovement": "23%",
      "newStoragePercentage": 7.4
    },
    "backup": {
      "created": true,
      "backupId": "backup_123abc",
      "size": "2.1 GB",
      "location": "cold_storage",
      "retentionPeriod": "1 سنة"
    }
  },
  "message": "تم تحسين التخزين بنجاح وتوفير مساحة كبيرة"
}
```

---

## الحماية والأمان

### `GET /storage/security/scan`
فحص أمني شامل للملفات.

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "securityScan": {
      "id": "scan_123abc",
      "status": "completed",
      "scannedFiles": 2847,
      "scanDuration": "23 دقيقة",
      "lastScan": "2025-09-02T16:00:00.000Z"
    },
    "results": {
      "overall": "safe",
      "threats": {
        "virusesFound": 0,
        "malwareDetected": 0,
        "suspiciousFiles": 1,
        "corruptedFiles": 3
      },
      "suspicious": [
        {
          "fileId": "file_suspicious_001",
          "fileName": "unknown_script.exe",
          "reason": "نوع ملف غير مدعوم",
          "riskLevel": "medium",
          "recommendation": "حذف الملف"
        }
      ],
      "corrupted": [
        {
          "fileId": "file_corrupt_001",
          "fileName": "image_broken.jpg",
          "issue": "ملف تالف غير قابل للقراءة",
          "recoverable": false
        }
      ]
    },
    "compliance": {
      "gdprCompliant": true,
      "dataRetentionPolicy": "applied",
      "encryptionStatus": "all_files_encrypted",
      "accessLogging": "enabled"
    },
    "recommendations": [
      "حذف الملفات المشبوهة",
      "إصلاح الملفات التالفة",
      "تحديث سياسات الأمان",
      "إجراء نسخ احتياطية منتظمة"
    ]
  }
}
```

### `POST /storage/access/permissions`
إدارة صلاحيات الوصول للملفات.

**الطلب:**
```json
{
  "fileIds": ["file_123abc", "file_456def"],
  "permissions": {
    "visibility": "private", // public | private | client_only | team_only
    "downloadable": true,
    "shareable": false,
    "expiration": "2025-12-31T23:59:59.000Z"
  },
  "accessControl": {
    "allowedUsers": ["cl_123abc", "c_789ghi"],
    "allowedRoles": ["client", "creator"],
    "deniedUsers": [],
    "ipRestrictions": []
  },
  "watermarkSettings": {
    "previewOnly": true,
    "removeOnDownload": false,
    "customWatermark": "معاينة فقط - غير مرخص للاستخدام"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "updated": {
      "filesAffected": 2,
      "permissionsChanged": true,
      "accessUpdated": true,
      "watermarksApplied": true
    },
    "newAccessLinks": [
      {
        "fileId": "file_123abc",
        "publicUrl": null, // لأن الملف private
        "authorizedUrl": "https://secure.depth-agency.com/files/file_123abc?token=xyz789",
        "expiresAt": "2025-12-31T23:59:59.000Z"
      }
    ],
    "security": {
      "encryptionApplied": true,
      "accessLogged": true,
      "auditTrail": "enabled"
    }
  },
  "message": "تم تحديث صلاحيات الوصول بنجاح"
}
```

### `GET /storage/audit-log`
سجل تدقيق الملفات والوصول.

**معاملات الاستعلام:**
- `startDate`: تاريخ البداية
- `endDate`: تاريخ النهاية
- `action`: upload|download|delete|view|share
- `userId`: معرف المستخدم
- `fileId`: معرف الملف

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "auditLog": [
      {
        "id": "audit_123abc",
        "timestamp": "2025-09-02T14:30:00.000Z",
        "action": "download",
        "resource": {
          "type": "file",
          "id": "file_123abc",
          "name": "dish_001_final.jpg"
        },
        "user": {
          "id": "cl_123abc",
          "name": "محمد أحمد السوري",
          "role": "client",
          "ip": "192.168.1.100"
        },
        "details": {
          "method": "direct_download",
          "fileSize": "2.5 MB",
          "duration": "3.2 ثانية",
          "success": true
        },
        "context": {
          "projectId": "p_123abc",
          "userAgent": "Mozilla/5.0...",
          "referer": "https://client.depth-agency.com/project/p_123abc"
        }
      },
      {
        "id": "audit_456def",
        "timestamp": "2025-09-02T13:15:00.000Z",
        "action": "upload",
        "resource": {
          "type": "file",
          "id": "file_456def",
          "name": "dish_002_final.jpg"
        },
        "user": {
          "id": "c_789ghi",
          "name": "فاطمة الزهراء",
          "role": "creator"
        },
        "details": {
          "uploadMethod": "batch_upload",
          "processingTime": "2.1 ثانية",
          "virusScanResult": "clean"
        }
      }
    ],
    "summary": {
      "period": "آخر 24 ساعة",
      "totalActions": 45,
      "uploads": 12,
      "downloads": 28,
      "views": 5,
      "deletions": 0,
      "securityIncidents": 0
    },
    "statistics": {
      "mostActiveUsers": [
        {"userId": "cl_123abc", "actions": 15},
        {"userId": "c_789ghi", "actions": 12}
      ],
      "mostAccessedFiles": [
        {"fileId": "file_123abc", "accesses": 8},
        {"fileId": "file_456def", "accesses": 6}
      ],
      "peakActivity": "14:00-16:00"
    }
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 237,
    "pages": 5
  }
}
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](./00-overview.md)
- [نظام المبدعين](./02-creators-api.md)
- [إدارة المشاريع](./04-projects-api.md)
- [نظام التسعير](./05-pricing-api.md)
- [نظام الإشعارات](./07-notifications-api.md)
- [لوحة الأدمن](./08-admin-api.md)
- [التكاملات الخارجية](./10-integrations-api.md)
- [رموز الأخطاء](./12-error-codes.md)
