# 💾 النسخ الاحتياطي والاستعادة (Backup & Restore) - Depth V2.0

> مصطلحات هذا المستند:
> - النسخ الاحتياطي: Backup — حفظ نسخ احتياطية
> - الاستعادة: Restore — استرداد البيانات
> - هدف نقطة الاستعادة: Recovery Point Objective — RPO
> - هدف زمن الاستعادة: Recovery Time Objective — RTO
> - اختبار الاستعادة: Recovery Testing — اختبار فعالية الاستعادة
> (انظر أيضًا: `99-reference/06-terminology-glossary-ar.md`)

## 🎯 نظرة عامة

تحدد هذه الوثيقة استراتيجية النسخ الاحتياطي والاستعادة الشاملة لمنصة Depth، مع التركيز على ضمان استمرارية العمل وحماية البيانات.

## 📊 نطاق النسخ الاحتياطي (Backup Scope)

### البيانات المحمية
```json
{
  "critical_data": {
    "firestore_collections": [
      "users", "creators", "clients", "projects", 
      "project_requests", "categories", "subcategories"
    ],
    "user_media": "cloudflare_r2_bucket",
    "system_configs": "environment_variables",
    "security_logs": "audit_trail_90_days"
  },
  "non_critical_data": {
    "analytics_data": "firebase_analytics",
    "performance_logs": "sentry_data", 
    "temporary_files": "upload_staging"
  }
}
```

### مستويات أولوية البيانات
| المستوى | البيانات | RPO | RTO | تكرار النسخ |
|---------|----------|-----|-----|-------------|
| Critical | معلومات المستخدمين، المشاريع النشطة | 1 ساعة | 2 ساعة | كل 4 ساعات |
| Important | الملفات المرفوعة، التقييمات | 6 ساعات | 6 ساعات | يومي |
| Standard | السجلات، التحليلات | 24 ساعة | 24 ساعة | أسبوعي |
| Low | البيانات المؤقتة | 7 أيام | 48 ساعة | شهري |

## 🕒 الجداول الزمنية (Backup Schedules)

### النسخ التلقائي
```yaml
backup_schedules:
  firestore_critical:
    frequency: "every 4 hours"
    retention: "30 days"
    encryption: "AES-256"
    compression: true
    
  firestore_full:
    frequency: "daily at 2:00 AM UTC"
    retention: "90 days"
    location: "multi-region"
    
  r2_media_files:
    frequency: "daily at 3:00 AM UTC" 
    retention: "180 days"
    versioning: "enabled"
    
  weekly_complete:
    frequency: "Sunday 1:00 AM UTC"
    retention: "1 year"
    type: "full_system_snapshot"
```

### النسخ اليدوي (On-Demand)
- **قبل النشر الكبير**: نسخة كاملة قبل كل إصدار رئيسي
- **قبل التحديثات**: نسخة للبيانات الحساسة
- **عند الطوارئ**: نسخة فورية عند اكتشاف مشاكل

## 🏗️ بنية النسخ الاحتياطي (Backup Architecture)

### Firestore Backup Strategy
```javascript
// استراتيجية نسخ Firestore
const firestoreBackup = {
  "method": "native_firestore_export",
  "destination": "google_cloud_storage",
  "format": "structured_export",
  "encryption": "customer_managed_key",
  "cross_region_replication": true,
  
  "collections": [
    {
      "name": "users",
      "priority": "critical",
      "pii_handling": "encrypt_sensitive_fields"
    },
    {
      "name": "projects", 
      "priority": "critical",
      "relationships": "preserve_references"
    }
  ]
}
```

### Media Files Backup (Cloudflare R2)
```javascript
// استراتيجية نسخ الملفات
const mediaBackup = {
  "source": "cloudflare_r2_primary",
  "destinations": [
    {
      "type": "cloudflare_r2_secondary",
      "region": "different_datacenter",
      "sync_frequency": "hourly"
    },
    {
      "type": "aws_s3_glacier",
      "purpose": "long_term_archive",
      "sync_frequency": "weekly"
    }
  ],
  "versioning": {
    "enabled": true,
    "max_versions": 10,
    "lifecycle": "delete_old_versions_after_1_year"
  }
}
```

## 🔄 إجراءات الاستعادة (Restore Procedures)

### سيناريوهات الاستعادة
```yaml
restore_scenarios:
  
  partial_data_loss:
    description: "فقدان مجموعة أو مستندات محددة"
    steps:
      - "تحديد نطاق البيانات المفقودة"
      - "اختيار أحدث نسخة صالحة"  
      - "استعادة انتقائية"
      - "التحقق من سلامة البيانات"
      - "إعادة بناء الفهارس"
    estimated_time: "30 دقيقة - 2 ساعة"
    
  complete_database_loss:
    description: "فقدان كامل لقاعدة البيانات"
    steps:
      - "إنشاء مشروع Firestore جديد"
      - "استعادة جميع المجموعات"
      - "إعادة تكوين قواعد الأمان"
      - "إعادة بناء الفهارس"
      - "اختبار التطبيق end-to-end"
    estimated_time: "4-8 ساعات"
    
  media_files_corruption:
    description: "تلف أو فقدان ملفات الوسائط"
    steps:
      - "تحديد الملفات المتأثرة"
      - "استعادة من النسخة الاحتياطية"
      - "التحقق من سلامة الملفات"
      - "تحديث مراجع قاعدة البيانات"
    estimated_time: "1-4 ساعات"
```

### أدوات الاستعادة
```bash
# أدوات CLI للاستعادة السريعة
depth-backup-cli:
  commands:
    - "restore --collection users --date 2025-08-23"
    - "restore --project PROJECT_ID --full"
    - "restore --media --file-pattern '*.jpg'"
    - "validate --backup backup_2025_08_23.gz"
```

## 🧪 اختبار الاستعادة الدوري (Recovery Testing)

### جدول اختبار الاستعادة
| التكرار | نوع الاختبار | النطاق | معايير النجاح |
|---------|---------------|---------|----------------|
| أسبوعي | استعادة جزئية | مجموعة واحدة | < 30 دقيقة، لا أخطاء |
| شهري | استعادة كاملة | قاعدة بيانات تطوير | < 4 ساعات، تطابق 100% |
| ربع سنوي | disaster recovery | البيئة الكاملة | < 8 ساعات، عمل كامل |
| سنوي | اختبار شامل | جميع السيناريوهات | توثيق شامل للدروس |

### قائمة اختبار الاستعادة
```yaml
recovery_test_checklist:
  pre_test:
    - [ ] "تحضير بيئة اختبار منفصلة"
    - [ ] "التأكد من صحة النسخة الاحتياطية"
    - [ ] "إعداد أدوات المراقبة"
    - [ ] "تحديد فريق الاختبار"
    
  during_test:
    - [ ] "قياس زمن الاستعادة"
    - [ ] "مراقبة استهلاك الموارد"
    - [ ] "تسجيل أي مشاكل"
    - [ ] "التحقق من سلامة البيانات"
    
  post_test:
    - [ ] "مقارنة النتائج مع الأهداف"
    - [ ] "توثيق النتائج والدروس"
    - [ ] "تحديث إجراءات الاستعادة"
    - [ ] "إعداد تقرير للإدارة"
```

## 🔒 الأمان والامتثال (Security & Compliance)

### تشفير النسخ الاحتياطية
```javascript
const encryptionStrategy = {
  "encryption_at_rest": {
    "algorithm": "AES-256-GCM",
    "key_management": "google_cloud_kms",
    "key_rotation": "quarterly"
  },
  "encryption_in_transit": {
    "protocol": "TLS 1.3",
    "certificate": "google_managed"
  },
  "access_control": {
    "backup_operators": ["admin@depth-agency.com"],
    "restore_approval": "two_person_authorization",
    "audit_logging": "all_operations"
  }
}
```

### الامتثال القانوني
- **GDPR**: حق الحذف، الموافقة على النسخ
- **القوانين المحلية**: امتثال لقوانين حماية البيانات العراقية
- **SOC 2**: ضوابط النسخ الاحتياطي والاستعادة

## 📊 مراقبة النسخ الاحتياطية (Backup Monitoring)

### مؤشرات الأداء الرئيسية
```json
{
  "backup_kpis": {
    "backup_success_rate": "> 99.5%",
    "recovery_time_actual_vs_target": "within SLA",
    "backup_storage_growth": "< 15% monthly",
    "test_recovery_success_rate": "100%",
    "backup_verification_passed": "> 99%"
  }
}
```

### تنبيهات النسخ الاحتياطي
```yaml
backup_alerts:
  - name: "Backup Failed"
    condition: "backup_job_status == failed"
    severity: "Critical"
    notification: "immediate"
    
  - name: "Backup Size Anomaly"  
    condition: "backup_size_deviation > 50%"
    severity: "Warning"
    notification: "daily_summary"
    
  - name: "Recovery Test Failed"
    condition: "recovery_test_result == failed"
    severity: "High" 
    notification: "within_hour"
```

## 📋 إجراءات الصيانة (Maintenance Procedures)

### تنظيف النسخ القديمة
```bash
# سكريبت تنظيف تلقائي
#!/bin/bash
# cleanup-old-backups.sh

# حذف النسخ اليومية الأقدم من 90 يوم
gsutil rm -r gs://depth-backups/daily/$(date -d "90 days ago" +%Y-%m-%d)

# حذف النسخ الأسبوعية الأقدم من 1 سنة  
gsutil rm -r gs://depth-backups/weekly/$(date -d "1 year ago" +%Y-W%U)

# الاحتفاظ بالنسخ الشهرية لمدة 3 سنوات
gsutil rm -r gs://depth-backups/monthly/$(date -d "3 years ago" +%Y-%m)
```

### فحص سلامة النسخ
```python
# backup-integrity-check.py
def verify_backup_integrity(backup_path):
    checks = [
        verify_checksum(backup_path),
        validate_structure(backup_path), 
        test_sample_restore(backup_path),
        check_encryption_status(backup_path)
    ]
    return all(checks)
```

## 📈 تقارير وإحصائيات

### تقرير شهري للنسخ الاحتياطي
- معدل نجاح النسخ
- أحجام البيانات وتطورها
- أوقات الاستعادة المحققة vs المستهدفة
- تكاليف التخزين
- نتائج اختبارات الاستعادة

### تقرير ربع سنوي
- مراجعة شاملة لاستراتيجية النسخ
- تحليل المخاطر والتحديات
- خطة تحسين العملية
- مقارنة مع معايير الصناعة

---

> SSOT — مصدر الحقيقة الوحيد: هذا الملف يحدد سياسات النسخ الاحتياطي والاستعادة المعتمدة للمنصة

*آخر تحديث: 2025-08-23*
