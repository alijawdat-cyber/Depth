# 🖼️ شاشات الموظف براتب (Salaried Employee UI)

## الفهرس
- [تسجيل/OTP + Dashboard](#salaried-auth)
- [مهامي اليوم](#salaried-today)
- [رفع ملفات/تحديث حالة (بدون أسعار)](#salaried-uploads)

<a id="salaried-auth"></a>
## شاشة: تسجيل/OTP + Dashboard (Salaried)
- الخطوات: تسجيل → OTP → دخول.
- حالات: pending/active.
- مراجع: OTP — `documentation/00-overview/00-introduction.md:110,635`; تعريف الدور — `documentation/02-database/01-database-schema.md:171–182`.

```text
[ phone/email ] [ Send OTP ]  OTP:[   ] [ Verify ]
Dashboard: مهامي المفتوحة اليوم (عدد)
```

<a id="salaried-today"></a>
## شاشة: مهامي اليوم (Salaried)
- العرض: قائمة مهام بتواريخ واستحقاقات.
- حالات: فارغ/تحميل.
- مراجع: assignments type='salaried' — `documentation/02-database/01-database-schema.md:250–259`.

```text
My Tasks Today
#1  Project p_12  due 14:00   [ Open ]
#2  Project p_13  due 16:00   [ Open ]
```

<a id="salaried-uploads"></a>
## شاشة: رفع ملفات/تحديث حالة (بدون أسعار)
- سياسة: لا يرى الأسعار مطلقاً.
- رفع: 2GB + chunked + denylist + MIME sniffing + virus scan + quota.
- مراجع: التخزين — `documentation/03-api/features/05-storage.md:88`; لا أسعار — `documentation/02-database/00-data-dictionary.md:162` تنبيه الرؤية.

```text
[ + Add Files ] (max 2GB, chunked)
Scanning: virus/MIME/denylist
[ Upload ]  Progress: 42%
Status: [ pending | active | completed | cancelled ]
[ Save ]
```
