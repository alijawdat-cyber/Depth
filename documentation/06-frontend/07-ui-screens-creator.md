# 🖼️ شاشات المبدع (Creator UI)

## الفهرس
- [Onboarding + تسجيل/OTP](#creator-onboarding)
- [Dashboard / مشاريعي](#creator-dashboard)
- [تفاصيل مشروع + Ready for Review](#creator-project-details)
- [رفع مسودّات → نهائي](#creator-uploads)
- [بروفايل + portfolioImages ≤ 10 (عرض فقط)](#creator-profile)
- [جدول التوفر + إشعارات](#creator-availability)

<a id="creator-onboarding"></a>
## شاشة: Onboarding + تسجيل/OTP (Creator)
- الخطوات: اختيار فئات رئيسية/فرعية/صنعة + معدات + توفر → OTP → تفعيل.
- حالات: onboardingStatus: pending→in_progress→completed→approved/rejected — `documentation/02-database/01-database-schema.md:112–119`.
- مراجع: equipmentTier, experienceLevel — `documentation/02-database/01-database-schema.md:104,108`; OTP — `documentation/02-database/01-database-schema.md:478`.

```text
[ Select Categories/Subcategories ]
[ Experience v ] [ Equipment v ] [ Availability Grid ]
[ Send OTP ]  OTP:[    ]  [ Verify ]
```

<a id="creator-dashboard"></a>
## شاشة: Dashboard / مشاريعي (Creator)
- العرض: بطاقات مشاريع بالحالات.
- حالات: فارغ/تحميل.
- مراجع: projects.status — `documentation/02-database/01-database-schema.md:257–258`.

```text
My Projects
[ Active (2) ]  [ Pending (1) ]  [ Completed (8) ]
```

<a id="creator-project-details"></a>
## شاشة: تفاصيل مشروع + Ready for Review (Creator)
- العرض: lineItems + assignments.
- أزرار: "Mark Ready for Review".
- مراجع: lineItems/assignments — `documentation/02-database/01-database-schema.md:244–259`.

```text
Project p_123
Line Items: [ subcategoryId | processingLevel | qty ]
Assignments: [ type=creator | assigneeId=c_123 ]
[ Mark Ready for Review ]
```

<a id="creator-uploads"></a>
## شاشة: رفع مسودّات → نهائي (Creator)
- سياسة: 2GB + chunked + denylist (exe/js/sh/bat) + MIME sniffing + virus scan + quota.
- مراجع: التخزين — `documentation/03-api/features/05-storage.md:88`.

```text
[ + Add Files ] (max 2GB, chunked)
Scanning: virus/MIME/denylist
[ Upload ]   Progress: 68%
[ Submit Final ]
```

<a id="creator-profile"></a>
## شاشة: بروفايل + portfolioImages ≤ 10 (عرض فقط)
- العرض: شبكة صور ≤10.
- مراجع: الحد الأقصى — `documentation/02-database/01-database-schema.md:93`, `documentation/02-database/02-indexes-and-queries.md:145`.

```text
Portfolio (≤10)
[img][img][img][img]
[img][img][img][img]
[img][img]
```

<a id="creator-availability"></a>
## شاشة: جدول التوفر + إشعارات
- العرض: تقويم توفر + toggles.
- مراجع: creatorAvailability — `documentation/02-database/01-database-schema.md:447–455,528–531`؛ إشعارات — `documentation/02-database/01-database-schema.md:419–447`.

```text
Availability Grid
[✓] Mon am  [ ] Mon pm  ...
Notifications: In-App/Email/SMS
```
