# 🌟 منصة العمق | Depth Platform

<div align="center">

![Depth Platform Logo](./depth-site/public/icons/logo.svg)

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/alijawdat-cyber/Depth/releases)
[![Documentation](https://img.shields.io/badge/docs-available-green.svg)](https://alijawdat-cyber.github.io/Depth/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Arabic Support](https://img.shields.io/badge/Arabic-RTL%20Support-purple.svg)](https://alijawdat-cyber.github.io/Depth/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-brightgreen.svg)](https://alijawdat-cyber.github.io/Depth/)

**نظام إدارة المشاريع الإبداعية المتطور**  
*Advanced Creative Project Management System*

[📚 التوثيق](https://alijawdat-cyber.github.io/Depth/) | [🚀 البدء السريع](#-البدء-السريع) | [🤝 المساهمة](./CONTRIBUTING.md) | [📋 المهام](./documentation/TODO.md)

</div>

---

## 📊 نظرة عامة

منصة العمق هي نظام شامل ومتطور لإدارة المشاريع الإبداعية، مصمم خصيصاً للفرق والشركات التي تعمل في المجالات الإبداعية والتقنية. توفر المنصة حلولاً متكاملة لإدارة المشاريع، التسعير، التعاون، والتواصل.

### ✨ المميزات الرئيسية

- 🎨 **إدارة المشاريع الإبداعية**: نظام متطور لتتبع وإدارة جميع مراحل المشروع
- 👥 **إدارة الفرق**: تنظيم المبدعين والعملاء مع نظام أدوار متقدم
- 💰 **نظام التسعير الذكي**: حساب التكاليف والأسعار بناءً على معايير متعددة
- 📱 **واجهات متجاوبة**: دعم كامل للأجهزة المحمولة والحاسوب
- 🔒 **أمان متقدم**: حماية شاملة للبيانات مع تشفير عالي المستوى
- 🌍 **دعم متعدد اللغات**: دعم كامل للعربية (RTL) والإنجليزية
- ⚡ **أداء عالي**: مبني على أحدث التقنيات لضمان السرعة والاستقرار

---

## 🚀 البدء السريع

### 📋 المتطلبات الأساسية

- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- قاعدة بيانات MongoDB
- Firebase للمصادقة والتخزين

### ⚙️ التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/alijawdat-cyber/Depth.git
cd Depth

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# قم بتحرير .env.local وإضافة القيم المطلوبة

# تشغيل المشروع في وضع التطوير
npm run dev
```

### 🌐 الوصول للتطبيق

- **التطبيق الرئيسي**: http://localhost:3000
- **التوثيق**: https://alijawdat-cyber.github.io/Depth/
- **API**: http://localhost:3000/api

---

## 📚 التوثيق

يتوفر التوثيق الشامل للمشروع على [GitHub Pages](https://alijawdat-cyber.github.io/Depth/) ويشمل:

### 🏗️ للمطورين
- [⚡ البدء السريع](https://alijawdat-cyber.github.io/Depth/#/documentation/04-development/00-getting-started)
- [🔧 الإعداد المحلي](https://alijawdat-cyber.github.io/Depth/#/documentation/04-development/01-local-setup)
- [🌍 متغيرات البيئة](https://alijawdat-cyber.github.io/Depth/#/documentation/04-development/02-environment-variables)
- [🔄 سير العمل](https://alijawdat-cyber.github.io/Depth/#/documentation/04-development/03-development-workflow)
- [🧪 استراتيجية الاختبار](https://alijawdat-cyber.github.io/Depth/#/documentation/04-development/04-testing-strategy)

### 🔌 API والتكامل
- [🔐 نظام المصادقة](https://alijawdat-cyber.github.io/Depth/#/documentation/03-api/core/01-authentication)
- [👥 إدارة المبدعين](https://alijawdat-cyber.github.io/Depth/#/documentation/03-api/features/01-creators)
- [🏢 إدارة العملاء](https://alijawdat-cyber.github.io/Depth/#/documentation/03-api/features/02-clients)
- [📋 إدارة المشاريع](https://alijawdat-cyber.github.io/Depth/#/documentation/03-api/features/03-projects)
- [💰 نظام التسعير](https://alijawdat-cyber.github.io/Depth/#/documentation/03-api/features/04-pricing)

### 🛡️ الأمان والعمليات
- [🔒 نظرة عامة على الأمان](https://alijawdat-cyber.github.io/Depth/#/documentation/07-security/00-security-overview)
- [⚠️ نموذج التهديدات](https://alijawdat-cyber.github.io/Depth/#/documentation/07-security/01-threat-model)
- [🚀 دليل النشر](https://alijawdat-cyber.github.io/Depth/#/documentation/08-operations/01-deployment)

---

## 🏗️ البنية التقنية

### 🖥️ الواجهة الأمامية (Frontend)
- **Framework**: Next.js 14 مع TypeScript
- **Styling**: Tailwind CSS مع دعم RTL
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom Components
- **Forms**: React Hook Form + Zod للتحقق

### ⚙️ الواجهة الخلفية (Backend)
- **Runtime**: Node.js مع Next.js API Routes
- **Database**: MongoDB مع Mongoose
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Real-time**: WebSockets للتحديثات المباشرة

### 🗄️ قاعدة البيانات
- **Primary**: MongoDB للبيانات الرئيسية
- **Cache**: Redis للكاش
- **Search**: Elasticsearch للبحث المتقدم
- **Analytics**: Firebase Analytics

### ☁️ النشر والاستضافة
- **Platform**: Vercel للنشر
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics
- **Logs**: Vercel Function Logs

---

## 📊 إحصائيات المشروع

<div align="center">

| 📈 المؤشر | 🔢 القيمة |
|-----------|----------|
| **الملفات** | 150+ ملف |
| **أسطر الكود** | 10,000+ سطر |
| **المكونات** | 50+ مكون |
| **صفحات API** | 25+ endpoint |
| **اللغات المدعومة** | العربية + الإنجليزية |
| **الاختبارات** | 95%+ تغطية |

</div>

---

## 🛠️ أوامر التطوير

```bash
# تشغيل المشروع في وضع التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل المشروع في وضع الإنتاج
npm start

# تشغيل الاختبارات
npm test

# تشغيل اختبارات E2E
npm run test:e2e

# فحص جودة الكود
npm run lint

# إصلاح مشاكل الكود تلقائياً
npm run lint:fix

# فحص نوع البيانات
npm run type-check

# تحديث التوثيق
npm run docs:build
```

---

## 🌍 دعم اللغات والمناطق

- 🇸🇦 **العربية**: دعم كامل للـ RTL مع خطوط مُحسنة
- 🇺🇸 **English**: Full LTR support with optimized fonts
- 🌐 **المناطق الزمنية**: دعم جميع المناطق الزمنية
- 💱 **العملات**: دعم العملات المتعددة

---

## 🤝 المساهمة في المشروع

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. **Fork** المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. إضافة التغييرات (`git commit -m 'Add some amazing feature'`)
4. رفع التغييرات (`git push origin feature/amazing-feature`)
5. فتح **Pull Request**

### 📋 إرشادات المساهمة

- اتبع معايير الكود المحددة في `.eslintrc.js`
- أضف اختبارات للمميزات الجديدة
- حدث التوثيق عند الحاجة
- استخدم Conventional Commits للرسائل
- تأكد من اجتياز جميع الاختبارات

---

## 🐛 الإبلاغ عن المشاكل

إذا واجهت أي مشكلة، يرجى:

1. البحث في [Issues الموجودة](https://github.com/alijawdat-cyber/Depth/issues)
2. إنشاء Issue جديد مع تفاصيل المشكلة
3. تضمين خطوات إعادة الإنتاج
4. إضافة لقطات شاشة إن أمكن

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](./LICENSE).

---

## 🏆 الشكر والتقدير

### 👨‍💻 فريق التطوير
- **Ali Jawdat** - مطور رئيسي وصاحب المشروع

### 🔧 التقنيات المستخدمة
- [Next.js](https://nextjs.org/) - إطار عمل React
- [TypeScript](https://www.typescriptlang.org/) - لغة البرمجة
- [Tailwind CSS](https://tailwindcss.com/) - إطار عمل التصميم
- [MongoDB](https://www.mongodb.com/) - قاعدة البيانات
- [Firebase](https://firebase.google.com/) - المصادقة والتخزين
- [Vercel](https://vercel.com/) - منصة النشر

### 🎨 التصميم والـ UI
- [Radix UI](https://www.radix-ui.com/) - مكتبة المكونات
- [Lucide Icons](https://lucide.dev/) - الأيقونات
- [Google Fonts](https://fonts.google.com/) - الخطوط

---

## 📞 التواصل والدعم

- **GitHub**: [@alijawdat-cyber](https://github.com/alijawdat-cyber)
- **المشروع**: [Depth Platform](https://github.com/alijawdat-cyber/Depth)
- **التوثيق**: [GitHub Pages](https://alijawdat-cyber.github.io/Depth/)
- **Issues**: [تقرير المشاكل](https://github.com/alijawdat-cyber/Depth/issues)

---

<div align="center">

**صُنع بـ ❤️ في المملكة العربية السعودية**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/alijawdat-cyber/Depth)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000.svg?logo=next.js)](https://nextjs.org/)
[![Powered by Vercel](https://img.shields.io/badge/Powered%20by-Vercel-000000.svg?logo=vercel)](https://vercel.com/)

</div>
