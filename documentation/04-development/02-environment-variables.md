# 🔐 متغيرات البيئة (Environment Variables)

## نظرة عامة (Overview)
تحدد هذه الوثيقة جميع متغيرات البيئة المطلوبة لمنصة Depth.

## ملفات البيئة (Environment Files)
- `.env.local` - التطوير المحلي (Local Development)
- `.env.staging` - بيئة الاختبار (Staging Environment)
- `.env.production` - بيئة الإنتاج (Production Environment)

## المتغيرات المطلوبة (Required Variables)

### إعدادات Firebase (Firebase Configuration)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

### تخزين Cloudflare R2 (Cloudflare R2 Storage)
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=depth-storage
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://your_custom_domain.com
```

### واجهات برمجة التطبيقات الخارجية (External APIs)
```env
# خدمات Google (Google Services)
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_PLACES_API_KEY=your_places_key

# خدمة البريد الإلكتروني (Email Service - Resend)
RESEND_API_KEY=re_your_resend_key

# خدمة SMS (SMS Service - Twilio مثال - للشبكات العراقية TBD)
TWILIO_ACCOUNT_SID=ACyour_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# الدفع داخل النظام يدوي حالياً (Manual). لا توجد مفاتيح لبوابات دفع في V2.0.
```

### Database & Cache
```env
# PostgreSQL (if used for analytics)
DATABASE_URL=postgresql://user:password@localhost:5432/depth_analytics

# Redis (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
```

### Security & JWT
```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key
HASH_SALT_ROUNDS=12

# Session
SESSION_SECRET=your_session_secret_key
```

### Application Settings
```env
# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CHAT=true

# Limits
NEXT_PUBLIC_MAX_FILE_SIZE=50MB
NEXT_PUBLIC_MAX_FILES_PER_PROJECT=100
```

### Development Tools
```env
# Development
PORT=3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Monitoring & Logging
SENTRY_DSN=https://your_sentry_dsn
LOG_LEVEL=debug
```

### Social Authentication
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple ID (for iOS)
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret
```

## Setup Instructions

### 1. Create Environment File
```bash
cp .env.example .env.local
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication, Firestore, Storage
4. Copy configuration values

### 3. Cloudflare R2 Setup
1. Sign up for [Cloudflare](https://cloudflare.com)
2. Go to R2 Object Storage
3. Create bucket
4. Generate API tokens

### 4. External Services
- **Google Maps**: Enable Maps & Places APIs
- **Resend**: Sign up for email service
- **Twilio**: Setup SMS service

## Validation

### Environment Checker
Run this script to validate your environment:
```bash
npm run env:check
```

### Manual Validation
```javascript
// Check required variables
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'RESEND_API_KEY',
  'JWT_SECRET'
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing: ${varName}`);
  } else {
    console.log(`✅ Found: ${varName}`);
  }
});
```

## Security Notes
- Never commit `.env` files to version control
- Use different keys for each environment
- Regularly rotate API keys
- Monitor for exposed keys in logs
- Use environment-specific Firebase projects

## Troubleshooting
- **Invalid API Key**: Check key format and permissions
- **CORS Issues**: Verify domain configuration
- **Firebase Errors**: Check project ID and rules
- **Storage Issues**: Verify bucket permissions
