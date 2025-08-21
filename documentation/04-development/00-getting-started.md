# 🚀 البدء السريع - منصة Depth الإصدار 2.0

## المتطلبات الأساسية
- Node.js v20+
- Firebase CLI
- Git

## البدء السريع
1. استنساخ المستودع
2. تثبيت التبعيات: `npm install`
3. إعداد البيئة: `cp .env.example .env`
4. تشغيل محلي: `npm run dev`

## الخطوات التالية
- [الإعداد المحلي](./01-local-setup.md)
- [متغيرات البيئة](./02-environment-variables.md)
- [سير عمل التطوير](./03-development-workflow.md)

## هيكل المشروع
```
depth-platform-v2/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # مكونات React
│   ├── lib/                 # الأدوات والخدمات
│   ├── hooks/               # Hooks مخصصة
│   └── types/               # أنواع TypeScript
├── public/                  # الملفات الثابتة
├── docs/                    # التوثيق
└── tests/                   # ملفات الاختبار
```

## أوامر التطوير
```bash
npm run dev          # بدء خادم التطوير
npm run build        # البناء للإنتاج
npm run test         # تشغيل الاختبارات
npm run lint         # فحص الكود
npm run type-check   # فحص TypeScript
```

## الحصول على المساعدة
- [توثيق API](../03-api/)
- [مخطط قاعدة البيانات](../02-database/00-data-dictionary.md)
- [متطلبات المشروع](../01-requirements/00-requirements-v2.0.md)
