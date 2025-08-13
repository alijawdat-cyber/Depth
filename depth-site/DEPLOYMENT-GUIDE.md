# 🚀 دليل نشر بوابة العميل - Depth Agency

## 📋 نظرة عامة
تم تطوير بوابة عميل متكاملة مع:
- ✅ نظام مصادقة كامل (Google OAuth + Magic Links)  
- ✅ إدارة المشاريع والملفات
- ✅ نظام الموافقات
- ✅ الإشعارات الفورية
- ✅ إدارة الملف الشخصي
- ✅ ربط كامل مع Firebase/Firestore

## 🔧 إعداد الإنتاج

### 1️⃣ إعداد Firebase Console

#### إنشاء مشروع Firebase جديد:
```bash
1. اذهب إلى https://console.firebase.google.com
2. أنشئ مشروع جديد: "depth-website-production"
3. فعل Google Analytics (اختياري)
```

#### تفعيل الخدمات المطلوبة:
```bash
# في Firebase Console:
- Firestore Database → إنشاء قاعدة بيانات
- Authentication → تفعيل Google Provider + Email Provider  
- Storage → إنشاء bucket للملفات
```

### 2️⃣ إعداد Google OAuth

#### في Firebase Console → Authentication → Sign-in method:
```bash
1. اختر "Google" → Enable
2. انسخ:
   - Web client ID
   - Web client secret
3. في "Authorized domains" أضف:
   - yourdomain.com
   - localhost (للتطوير)
```

### 3️⃣ إعداد المتغيرات البيئية

#### إنشاء `.env.production`:
```bash
# Firebase Configuration (من Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_real_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Service Account)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_ultra_secure_secret_key_here

# Google OAuth (من Firebase Console)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com  
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxx

# Email Provider (اختياري للـ Magic Links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 4️⃣ إعداد Service Account

#### إنشاء مفاتيح الخدمة:
```bash
# في Google Cloud Console:
1. اذهب إلى IAM & Admin → Service Accounts
2. أنشئ service account جديد: "depth-portal-admin"
3. أعطه الأدوار:
   - Firebase Admin SDK Administrator Service Agent
   - Cloud Datastore User
4. أنشئ JSON key وحمل الملف
5. انسخ المحتويات إلى متغيرات البيئة
```

### 5️⃣ إعداد قواعد Firestore

#### في Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects - clients can only access their own projects  
    match /projects/{projectId} {
      allow read: if request.auth != null && 
        request.auth.token.email == resource.data.clientEmail;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@depth-agency.com'];
    }
    
    // Files - clients can only access files for their projects
    match /files/{fileId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.clientEmail == request.auth.token.email;
    }
    
    // Approvals - clients can read and update their project approvals
    match /approvals/{approvalId} {
      allow read, update: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.clientEmail == request.auth.token.email;
    }

    // Notifications - clients can read their notifications
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && 
        request.auth.token.email == resource.data.clientEmail;
    }

    // Client profiles
    match /clients/{clientId} {
      allow read, update: if request.auth != null && 
        request.auth.token.email == resource.data.email;
      allow create: if request.auth != null;
    }
  }
}
```

## 🚢 النشر

### خيار 1: Vercel (مُوصى به)
```bash
# 1. ربط المشروع بـ Vercel
npm i -g vercel
vercel login
vercel

# 2. إعداد متغيرات البيئة في Vercel Dashboard
# 3. النشر
vercel --prod
```

### خيار 2: Netlify
```bash
# 1. بناء المشروع
npm run build

# 2. رفع dist/ إلى Netlify
# 3. إعداد متغيرات البيئة في Netlify Dashboard
```

### خيار 3: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 الأمان والحماية

### 1. إعدادات Firebase Security:
```bash
- تفعيل App Check للحماية من البوتات
- إعداد CORS domains في Firebase Hosting
- مراجعة قواعد Firestore Security Rules
```

### 2. إعدادات NextAuth:
```bash
- استخدام NEXTAUTH_SECRET قوي ومعقد
- تفعيل HTTPS في الإنتاج
- إعداد Authorized redirect URIs
```

### 3. متغيرات البيئة:
```bash
- عدم كشف API keys في الكود
- استخدام Secret Management في الإنتاج
- تفعيل rate limiting للـ APIs
```

## 📊 المراقبة والتحليل

### إعداد Firebase Analytics:
```javascript
// في Firebase Console → Analytics
- تفعيل Google Analytics
- إعداد Conversion Events
- مراقبة User Engagement
```

### مراقبة الأخطاء:
```bash
# إضافة Sentry أو شبيه
npm install @sentry/nextjs
```

## 🧪 الاختبار

### اختبار البيانات:
```bash
# إنشاء بيانات تجريبية
curl -X POST https://yourdomain.com/api/portal/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"demo-seed-data-2024"}'

# إنشاء إشعارات تجريبية  
curl -X POST https://yourdomain.com/api/portal/notifications \
  -H "Content-Type: application/json" \
  -d '{"secret":"demo-notifications-2024"}'
```

### اختبار المصادقة:
```bash
1. تسجيل دخول بـ Google OAuth
2. تسجيل دخول بـ Magic Link  
3. إدارة الملف الشخصي
4. تسجيل خروج
```

## 🎯 الميزات المكتملة

✅ **المصادقة:**
- Google OAuth
- Magic Links (Email)
- إدارة الجلسات
- تسجيل الخروج

✅ **إدارة المشاريع:**
- عرض المشاريع
- تفاصيل المشروع  
- إحصائيات الميزانية
- تتبع التقدم

✅ **إدارة الملفات:**
- عرض الملفات
- تحميل الملفات
- معاينة الملفات
- تتبع الحالات

✅ **نظام الموافقات:**
- الموافقات المعلقة
- اتخاذ القرارات
- تتبع المواعيد النهائية
- تسجيل التعليقات

✅ **الإشعارات:**
- إشعارات فورية
- تعليم كمقروء
- أنواع مختلفة من الإشعارات
- عداد الإشعارات غير المقروءة

✅ **الملف الشخصي:**
- عرض بيانات العميل
- تحديث المعلومات
- إدارة إعدادات الحساب

## 📞 الدعم

للحصول على الدعم:
- 📧 admin@depth-agency.com
- 📱 WhatsApp: +964 777 976 1547
- 🌐 [depth.agency](https://depth.agency)

---
**تم التطوير بواسطة Depth Agency** 🚀
