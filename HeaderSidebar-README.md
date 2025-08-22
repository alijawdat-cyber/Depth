# 🎯 دليل مكوّن HeaderSidebar

## 📋 نظرة عامة

مكوّن **HeaderSidebar** هو حل متكامل يجمع بين الهيدر والسايدبار في مكوّن واحد، مصمم خصيصاً لدعم المشاريع التي تستخدم العربية كلغة واجهة والإنجليزية لفتات الخبز.

## ✨ المميزات الرئيسية

- **🔄 مكوّن مدموج**: هيدر وسايدبار في وحدة واحدة
- **🌐 دعم RTL/LTR**: عربي للسايدبار، إنجليزي لفتات الخبز  
- **📱 تصميم متجاوب**: يعمل على جميع أحجام الشاشات
- **🌓 وضع فاتح/داكن**: دعم كامل للثيمات
- **♿ الوصولية**: مصمم وفق معايير WCAG
- **⚡ أداء عالي**: CSS transforms وanimations محسنة

## 🚀 التثبيت السريع

### 1. إضافة الملفات المطلوبة

```bash
# نسخ الملفات إلى مشروعك
cp HeaderSidebar.css your-project/styles/
cp HeaderSidebar.ts your-project/components/    # للTypeScript
cp HeaderSidebar.tsx your-project/components/   # للReact
```

### 2. تضمين الأنماط

```html
<!-- HTML -->
<link rel="stylesheet" href="styles/HeaderSidebar.css">
```

```css
/* أو في ملف CSS */
@import url('HeaderSidebar.css');
```

### 3. الاستخدام الأساسي

#### أ) JavaScript العادي

```html
<div id="header-container"></div>

<script src="HeaderSidebar.js"></script>
<script>
const navigation = [
  {
    id: 'home',
    label: 'الرئيسية',
    href: '/',
    children: []
  },
  {
    id: 'docs',
    label: 'التوثيق',
    href: '/docs',
    children: [
      {
        id: 'overview',
        label: 'نظرة عامة',
        href: '/docs/overview'
      }
    ]
  }
];

const headerSidebar = new HeaderSidebar('#header-container', {
  navigation,
  githubUrl: 'https://github.com/your-repo'
});
</script>
```

#### ب) React/Next.js

```tsx
import HeaderSidebar from './components/HeaderSidebar';

const navigation = [
  {
    id: 'home',
    label: 'الرئيسية',
    href: '/',
  },
  // ... المزيد
];

function App() {
  return (
    <>
      <HeaderSidebar 
        navigation={navigation}
        githubUrl="https://github.com/your-repo"
      />
      {/* باقي المحتوى */}
    </>
  );
}
```

## 🔧 التكوين المتقدم

### خيارات التكوين

```typescript
interface HeaderSidebarConfig {
  navigation: NavigationItem[];
  githubUrl?: string;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}
```

### مثال متقدم

```javascript
const headerSidebar = new HeaderSidebar('#container', {
  navigation: [
    {
      id: 'main',
      label: 'القسم الرئيسي',
      href: '/main',
      children: [
        {
          id: 'sub1',
          label: 'قسم فرعي 1',
          href: '/main/sub1'
        },
        {
          id: 'sub2', 
          label: 'قسم فرعي 2',
          href: '/main/sub2',
          children: [
            {
              id: 'sub2a',
              label: 'قسم فرعي 2أ',
              href: '/main/sub2/a'
            }
          ]
        }
      ]
    }
  ],
  githubUrl: 'https://github.com/alijawdat-cyber/Depth',
  className: 'my-custom-header'
});
```

## 🎨 التخصيص

### CSS Variables

```css
:root {
  /* الألوان الأساسية */
  --bg-header-light: rgba(255, 255, 255, 0.95);
  --bg-sidebar-light: #ffffff;
  --text-primary-light: #1f2937;
  --text-secondary-light: #6b7280;
  
  /* الوضع الداكن */
  --bg-header-dark: rgba(17, 24, 39, 0.95);
  --bg-sidebar-dark: #111827;
  --text-primary-dark: #f9fafb;
  --text-secondary-dark: #9ca3af;
  
  /* الأبعاد */
  --header-height: 64px;
  --sidebar-width: 280px;
}
```

### تخصيص الألوان

```css
/* تخصيص الثيم */
[data-theme="custom"] {
  --bg-header: #your-color;
  --bg-sidebar: #your-color;
  --text-primary: #your-color;
}
```

### تخصيص الانيميشن

```css
.header-sidebar-nav {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.header-sidebar-header.header-scrolled {
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 📱 التصميم المتجاوب

### نقاط التكسير

```css
/* الموبايل */
@media (max-width: 768px) {
  .header-sidebar-nav {
    width: 320px;
    max-width: 85vw;
  }
}

/* الأجهزة اللوحية */
@media (min-width: 769px) and (max-width: 1024px) {
  .header-sidebar-nav {
    width: 260px;
  }
}

/* الشاشات الكبيرة */
@media (min-width: 1200px) {
  .header-content {
    padding: 0 24px;
  }
}
```

## 🔌 التكامل مع Frameworks

### مع Docsify

```javascript
// في docsify-config.js
window.DepthDocs.sidebar.initializeHeaderSidebar = function() {
  const navigation = this.extractNavigationFromSidebar();
  
  const headerSidebar = new HeaderSidebar('#header-container', {
    navigation,
    githubUrl: 'https://github.com/your-repo'
  });
  
  // ربط مع تغيير الصفحات
  window.addEventListener('hashchange', () => {
    headerSidebar.updateBreadcrumbs();
  });
};
```

### مع Vue.js

```vue
<template>
  <div id="header-sidebar-container"></div>
</template>

<script>
import HeaderSidebar from './HeaderSidebar';

export default {
  name: 'App',
  mounted() {
    this.headerSidebar = new HeaderSidebar('#header-sidebar-container', {
      navigation: this.navigation,
      githubUrl: 'https://github.com/your-repo'
    });
  },
  
  beforeDestroy() {
    if (this.headerSidebar) {
      this.headerSidebar.destroy();
    }
  }
}
</script>
```

## 🎯 API Reference

### Methods

```typescript
class HeaderSidebar {
  // إنشاء المكوّن
  constructor(container: HTMLElement | string, config: HeaderSidebarConfig)
  
  // تحديث التنقل
  updateNavigation(navigation: NavigationItem[]): void
  
  // فتح السايدبار
  openSidebar(): void
  
  // إغلاق السايدبار
  closeSidebar(): void
  
  // تدمير المكوّن
  destroy(): void
}
```

### Events

```javascript
// مثال على ربط الأحداث المخصصة
headerSidebar.container.addEventListener('sidebar:opened', () => {
  console.log('تم فتح السايدبار');
});

headerSidebar.container.addEventListener('sidebar:closed', () => {
  console.log('تم إغلاق السايدبار');
});
```

## ♿ الوصولية

### معايير WCAG المطبقة

- **ARIA Labels**: جميع العناصر التفاعلية
- **Keyboard Navigation**: دعم كامل للتنقل بالكيبورد
- **Screen Readers**: متوافق مع قارئات الشاشة
- **High Contrast**: دعم الوضع عالي التباين
- **Reduced Motion**: احترام تفضيلات المستخدم

### اختبار الوصولية

```bash
# استخدام axe-core للاختبار
npm install @axe-core/cli -g
axe your-page.html
```

## 🐛 استكشاف الأخطاء

### المشاكل الشائعة

#### 1. المكوّن لا يظهر

```javascript
// تأكد من وجود الcontainer
const container = document.getElementById('header-container');
if (!container) {
  console.error('Container not found!');
}

// تأكد من تحميل CSS
const cssLoaded = document.querySelector('link[href*="HeaderSidebar.css"]');
if (!cssLoaded) {
  console.error('CSS not loaded!');
}
```

#### 2. السايدبار لا يعمل في الموبايل

```css
/* تأكد من وجود z-index مناسب */
.sidebar-overlay {
  z-index: var(--z-overlay);
  display: block !important; /* في الموبايل */
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
  }
}
```

#### 3. فتات الخبز لا تتحدث

```javascript
// للSPA - تأكد من استدعاء التحديث
window.addEventListener('popstate', () => {
  headerSidebar.updateBreadcrumbs();
});

// للMPA - تأكد من التهيئة في كل صفحة
document.addEventListener('DOMContentLoaded', () => {
  headerSidebar.updateBreadcrumbs();
});
```

## 📊 الأداء

### نصائح التحسين

```css
/* استخدام will-change للانيميشن */
.header-sidebar-nav {
  will-change: transform;
}

/* تحسين backdrop-filter */
.header-sidebar-header {
  backdrop-filter: blur(8px);
  /* fallback للمتصفحات القديمة */
  background: rgba(255, 255, 255, 0.95);
}
```

```javascript
// Lazy loading للمكوّن
const loadHeaderSidebar = async () => {
  const { default: HeaderSidebar } = await import('./HeaderSidebar.js');
  return new HeaderSidebar('#container', config);
};
```

## 📦 أمثلة كاملة

تحقق من الملفات التالية للأمثلة الكاملة:

- **demo-HeaderSidebar.html** - مثال HTML مستقل
- **integrated-demo.html** - تكامل مع Docsify  
- **HeaderSidebar.tsx** - مكوّن React
- **HeaderSidebar.ts** - نسخة TypeScript

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للbranch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك اقتراحات:

- **GitHub Issues**: [أنشئ issue جديد](https://github.com/alijawdat-cyber/Depth/issues)
- **البريد الإلكتروني**: support@depth.com
- **التوثيق**: [الدليل الكامل](https://alijawdat-cyber.github.io/Depth/)

---

<div align="center">

**تم إنشاؤه بـ 💜 للمطورين العرب**

[⬆️ العودة للأعلى](#-دليل-مكوّن-headersidebar)

</div>
