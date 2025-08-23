# 🔐 المصادقة والأمان (Authentication & Security) - Depth API v2.0

---

## المحتويات (Contents)
- [رموز المصادقة](#رموز-المصادقة)
- [أنواع الأدوار والصلاحيات](#أنواع-الأدوار-والصلاحيات)
- [تسجيل حساب جديد](#تسجيل-حساب-جديد)
- [تسجيل الدخول](#تسجيل-الدخول)
- [تسجيل دخول عبر Google](#تسجيل-دخول-عبر-google)
- [تجديد رمز المصادقة](#تجديد-رمز-المصادقة)
- [تسجيل الخروج](#تسجيل-الخروج)
- [نظام التحقق من الهاتف (OTP)](#نظام-التحقق-من-الهاتف-otp)
- [إدارة كلمة المرور](#إدارة-كلمة-المرور)
- [التحقق من الهوية](#التحقق-من-الهوية)
- [أمان الملفات](#أمان-الملفات)

---

## رموز المصادقة (Authentication Tokens)

جميع الطلبات المحمية تتطلب رمز مصادقة Firebase في Header:

```http
Authorization: Bearer {firebase_id_token}
Content-Type: application/json
X-Platform: android|ios|web
X-App-Version: {semver}
X-Device-ID: unique_device_identifier
```

### أنواع الرموز (Token Types):
- **Access Token**: صالح لمدة 1 ساعة
- **Refresh Token**: صالح لمدة 30 يوماً
- **OTP Token**: صالح لمدة 5 دقائق

---

## أنواع الأدوار والصلاحيات (Roles & Permissions)

```javascript
const roles = {
  admin: {
    permissions: ["*"], // جميع الصلاحيات
    access: ["admin/*", "creator/*", "client/*", "employee/*"]
  },
  creator: {
    permissions: ["profile:write", "projects:read", "deliverables:upload"],
    access: ["creator/*", "projects/assigned/*"]
  },
  client: {
    permissions: ["profile:write", "projects:create", "projects:read"],
    access: ["client/*", "projects/owned/*"]
  },
  salariedEmployee: {
    permissions: ["profile:read", "projects:read", "tasks:write"],
    access: ["salariedEmployee/*", "projects/assigned/*"],
    description: "موظف براتب ثابت - لا يرى الأسعار"
  }
};
```

### التحقق من الهوية عبر OTP

```javascript
const otpVerification = {
  carriers: {
    asiacell: ["0770", "0771", "0772", "0773", "0774"],
    korek: ["0750", "0751", "0752", "0753", "0754", "0755"],
    zain: ["0780", "0781", "0782", "0783", "0784"]
  },
  codeLength: 6,
  expiry: 300, // 5 دقائق
  maxAttempts: 3,
  cooldown: 60 // 60 ثانية (V2.0)
};
```

---

## تسجيل حساب جديد

### `POST /auth/register`
إنشاء حساب مستخدم جديد مع تحديد الدور.

**الطلب:**
```json
{
  "email": "creator@example.com",
  "password": "SecurePassword123",
  "role": "creator", // creator | client
  "name": "أحمد محمد الربيعي",
  "phone": "07719956000",
  "agreeToTerms": true,
  "fcmToken": "firebase_fcm_token_for_notifications"
}
```

**الاستجابة الناجحة (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "firebase_generated_uid",
      "email": "creator@example.com",
      "role": "creator",
      "name": "أحمد محمد الربيعي",
      "phone": "07719956000",
      "isActive": false,
      "emailVerified": false,
      "phoneVerified": false,
      "status": "pending_verification"
    },
    "nextStep": "email_verification",
    "message": "يرجى التحقق من بريدك الإلكتروني"
  }
}
```

---

## تسجيل الدخول

### `POST /auth/signin`
تسجيل دخول مع دعم تعدد المنصات والـ FCM.

**الطلب:**
```json
{
  "email": "creator@example.com",
  "password": "SecurePassword123",
  "fcmToken": "updated_fcm_token",
  "platform": "android", // android | ios | web
  "deviceInfo": {
    "deviceId": "unique_device_id",
    "model": "Samsung Galaxy S23",
    "os": "Android 14",
  "appVersion": "{semver}"
  }
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "firebase_user_uid",
      "email": "creator@example.com",
      "role": "creator",
      "name": "أحمد محمد الربيعي",
      "phone": "07719956000",
      "isActive": true,
      "emailVerified": true,
      "phoneVerified": true,
      "profileComplete": true,
      "avatar": "https://cdn.cloudflare.com/avatars/user_123.jpg",
      "lastLogin": "2025-08-21T14:30:00.000Z"
    },
    "tokens": {
      "idToken": "firebase_id_token_jwt",
      "refreshToken": "firebase_refresh_token",
      "expiresIn": 3600
    },
    "profile": {
      "creator": {
        "specializations": ["photography", "videography"],
        "experience": "experienced",
        "equipmentTier": "gold",
        "rating": 4.8,
        "completedProjects": 47,
        "isApproved": true
      }
    },
    "preferences": {
      "language": "ar",
      "notifications": {
        "push": true,
        "email": true,
        "sms": false
      }
    }
  }
}
```

---

## تسجيل دخول عبر Google

### `POST /auth/google`
تسجيل دخول أو إنشاء حساب عبر Google OAuth.

**الطلب:**
```json
{
  "googleIdToken": "google_oauth_id_token",
  "role": "creator", // مطلوب للمستخدمين الجدد فقط
  "fcmToken": "firebase_fcm_token",
  "platform": "ios"
}
```

**الاستجابة للمستخدم الجديد (201):**
```json
{
  "success": true,
  "data": {
    "isNewUser": true,
    "user": {
      "uid": "firebase_user_uid",
      "email": "user@gmail.com",
      "name": "أحمد علي",
      "role": "creator",
      "profileComplete": false
    },
    "nextStep": "complete_profile",
    "redirectTo": "/onboarding/creator/step-1"
  }
}
```

---

## تجديد رمز المصادقة

### `POST /auth/refresh`
تجديد رمز المصادقة باستخدام الرمز المحدث.

**الطلب:**
```json
{
  "refreshToken": "firebase_refresh_token"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "idToken": "new_firebase_id_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 3600
  }
}
```

---

## تسجيل الخروج

### `POST /auth/signout`
تسجيل خروج وإلغاء تفعيل FCM Token.

**الطلب:**
```json
{
  "fcmToken": "current_fcm_token",
  "platform": "android"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## نظام التحقق من الهاتف (OTP)

### `POST /auth/otp/send`
إرسال رمز التحقق لرقم الهاتف.

**الطلب:**
```json
{
  "phoneNumber": "07719956000",
  "purpose": "registration", // registration | password_reset | phone_change
  "carrier": "asiacell" // asiacell | korek | zain (اختياري)
}
```

**سياسة OTP (V2.0):**
- الطول: 6 أرقام
- الصلاحية: 5 دقائق (300 ثانية)
- الحد الأقصى للمحاولات: 3 محاولات لكل جلسة
- مبرّد (Cooldown): 60 ثانية بين المحاولات
- الشبكات العراقية: asiacell | korek | zain (كشف تلقائي حسب البادئة)

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "otpSession": "otp_session_unique_id",
    "phoneNumber": "07719956000",
  "expiresIn": 300,
  "attemptsRemaining": 3,
    "carrier": "asiacell",
    "provider": "firebase"
  },
  "message": "تم إرسال رمز التحقق إلى هاتفك"
}
```

### `POST /auth/otp/verify`
التحقق من رمز OTP المرسل.

**الطلب:**
```json
{
  "otpSession": "otp_session_unique_id",
  "code": "123456",
  "phoneNumber": "07719956000"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "phoneNumber": "07719956000",
    "verifiedAt": "2025-08-21T14:35:00.000Z"
  },
  "message": "تم التحقق من رقم الهاتف بنجاح"
}
```

**في حالة رمز خاطئ (400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "رمز التحقق غير صحيح",
    "details": {
      "attemptsRemaining": 2,
      "cooldownUntil": null
    }
  }
}
```

### `POST /auth/otp/resend`
إعادة إرسال رمز التحقق.

**الطلب:**
```json
{
  "otpSession": "otp_session_unique_id",
  "phoneNumber": "07719956000"
}
```

---

## إدارة كلمة المرور

### `POST /auth/password/reset/request`
طلب إعادة تعيين كلمة المرور.

**الطلب:**
```json
{
  "email": "user@example.com"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
}
```

### `POST /auth/password/change`
تغيير كلمة المرور (مستخدم مسجل دخول).

**الطلب:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePassword456"
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

---

## التحقق من الهوية

### `POST /auth/verify-token`
التحقق من صحة الرمز المميز.

**الطلب:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "access" // access | refresh
}
```

**الاستجابة الناجحة (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "u_123abc",
      "role": "creator",
      "permissions": ["projects:read", "projects:update"]
    },
    "expiresAt": "2025-08-27T01:00:00.000Z",
    "remainingTime": 3540
  }
}
```

---

## أمان الملفات

### رموز التحقق لرفع الملفات:
```json
{
  "fileUploadPolicy": {
    "allowedTypes": ["image/jpeg", "image/png", "video/mp4"],
    "maxSize": 104857600,
    "virusScanning": true,
    "watermarkRequired": false,
    "encryptionRequired": true
  }
}
```

### إعدادات Firebase Phone Auth المتقدمة

#### تكوين Firebase:
```javascript
const phoneAuthConfig = {
  projectId: 'depth-platform',
  recaptchaConfig: {
    enabledForAndroid: true,
    enabledForIOS: true,
    enabledForWeb: true
  },
  multiFactorConfig: {
    enabled: true,
    providers: ['phone']
  },
  codeSettings: {
    codeLength: 6,
    autoRetrievalTimeoutSeconds: 300,
    maxAttempts: 3,
  cooldownSeconds: 60
  }
};
```

#### دعم شركات الاتصالات العراقية:
```javascript
const iraqCarriers = {
  asiacell: {
    name: "آسياسيل",
    prefixes: ["0770", "0771", "0772", "0773", "0774"],
    countryCode: "+964",
    supportedFeatures: ["sms", "voice_call"]
  },
  korek: {
    name: "كورك تيليكوم", 
    prefixes: ["0750", "0751", "0752", "0753", "0754", "0755"],
    countryCode: "+964",
    supportedFeatures: ["sms", "voice_call"]
  },
  zain: {
    name: "زين العراق",
    prefixes: ["0780", "0781", "0782", "0783", "0784"],
    countryCode: "+964", 
    supportedFeatures: ["sms", "voice_call"]
  }
};
```

---

## 🔗 الملفات ذات الصلة

- [نظرة عامة](../../00-overview/00-introduction.md)
- [نظام المبدعين](../features/01-creators.md)
- [نظام العملاء](../features/02-clients.md)
- [نظام الإشعارات](../features/06-notifications.md)
- [رموز الأخطاء](./04-error-handling.md)
