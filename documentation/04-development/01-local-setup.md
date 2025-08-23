# 🔧 إعداد بيئة التطوير المحلية (Local Development Setup)

## المتطلبات الأساسية (Prerequisites)
- **Node.js**: الإصدار 20.0.0 أو أحدث
- **npm**: الإصدار 10.0.0 أو أحدث
- **Git**: أحدث إصدار
- **Firebase CLI**: أحدث إصدار

## خطوات التثبيت (Installation Steps)

### 1. استنساخ المستودع (Clone Repository)
```bash
git clone https://github.com/alijawdat-cyber/Depth.git
cd Depth
```

### 2. تثبيت التبعيات (Install Dependencies)
```bash
npm install
```

### 3. تثبيت Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 4. إعداد البيئة (Environment Setup)
```bash
# نسخ قالب البيئة
cp .env.example .env.local

# تحرير متغيرات البيئة
nano .env.local
```

### 5. إعداد مشروع Firebase
```bash
# تهيئة Firebase
firebase init

# اختر:
# - Firestore
# - Functions  
# - Hosting
# - Storage
# - Emulators
```

### 6. بدء خادم التطوير (Start Development Server)
```bash
npm run dev
```

## سير عمل التطوير (Development Workflow)

### سير العمل اليومي (Daily Workflow)
1. سحب أحدث التغييرات: `git pull`
2. تثبيت التبعيات الجديدة: `npm install`
3. بدء خادم التطوير: `npm run dev`
4. إجراء التغييرات
5. الاختبار: `npm test`
6. الحفظ: `git commit -m "feat: description"`
7. الدفع: `git push`

### الاختبار المحلي (Local Testing)
```bash
# تشغيل جميع الاختبارات
npm test

# Run specific test
npm test -- --testNamePattern="Creator"

# Run with coverage
npm run test:coverage
```

### تطوير قاعدة البيانات (Database Development)
```bash
# Start Firebase emulators
npm run firebase:emulators

# Seed initial data
npm run db:seed

# Reset database
npm run db:reset
```

## إعداد بيئة التطوير المتكاملة (IDE Setup) - VS Code

### الإضافات المطلوبة (Required Extensions)
- Firebase
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Hero
- Thunder Client (API testing)

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change port in `package.json`
2. **Firebase permission denied**: Run `firebase login --reauth`
3. **Module not found**: Delete `node_modules` and run `npm install`
4. **TypeScript errors**: Run `npm run type-check`

### Environment Issues
```bash
# Clear npm cache
npm cache clean --force

# Reset node_modules
rm -rf node_modules package-lock.json
npm install

# Reset Firebase
firebase logout
firebase login
```
