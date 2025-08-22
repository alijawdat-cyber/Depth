# 🔧 إعداد بيئة التطوير المحلية

## المتطلبات الأساسية
- **Node.js**: الإصدار 20.0.0 أو أحدث
- **npm**: الإصدار 10.0.0 أو أحدث
- **Git**: أحدث إصدار
- **Firebase CLI**: أحدث إصدار

## خطوات التثبيت

### 1. استنساخ المستودع
```bash
git clone https://github.com/alijawdat-cyber/Depth.git
cd Depth
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. تثبيت Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 4. إعداد البيئة
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

### 6. بدء خادم التطوير
```bash
npm run dev
```

## سير عمل التطوير

### سير العمل اليومي
1. سحب أحدث التغييرات: `git pull`
2. تثبيت التبعيات الجديدة: `npm install`
3. بدء خادم التطوير: `npm run dev`
4. إجراء التغييرات
5. الاختبار: `npm test`
6. الحفظ: `git commit -m "feat: description"`
7. الدفع: `git push`

### الاختبار المحلي
```bash
# تشغيل جميع الاختبارات
npm test

# Run specific test
npm test -- --testNamePattern="Creator"

# Run with coverage
npm run test:coverage
```

### Database Development
```bash
# Start Firebase emulators
npm run firebase:emulators

# Seed initial data
npm run db:seed

# Reset database
npm run db:reset
```

## IDE Setup (VS Code)

### Required Extensions
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
