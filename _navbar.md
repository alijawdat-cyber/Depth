<!-- _navbar.md -->

<div class="navbar-brand">
  <a href="#/" style="color: var(--primary-color); text-decoration: none; font-weight: bold; font-size: 1.1em;">
    <i class="fas fa-layer-group" style="margin-left: 8px;"></i>
    منصة العمق
  </a>
</div>

* [🏠 الرئيسية](/)
  * [📖 المقدمة](documentation/00-overview/00-introduction.md)
  * [🎯 المتطلبات](documentation/01-requirements/00-requirements-v2.0.md)
  * [📝 قائمة المهام](documentation/TODO.md)

* [🔧 التطوير](documentation/04-development/)
  * [⚡ البدء السريع](documentation/04-development/00-getting-started.md)
  * [🔧 الإعداد المحلي](documentation/04-development/01-local-setup.md)
  * [🌍 متغيرات البيئة](documentation/04-development/02-environment-variables.md)
  * [🔄 سير العمل](documentation/04-development/03-development-workflow.md)
  * [🧪 الاختبار](documentation/04-development/04-testing-strategy.md)

* [🔌 API](documentation/03-api/)
  * [🔐 المصادقة](documentation/03-api/core/01-authentication.md)
  * [👥 المبدعين](documentation/03-api/features/01-creators.md)
  * [🏢 العملاء](documentation/03-api/features/02-clients.md)
  * [📋 المشاريع](documentation/03-api/features/03-projects.md)
  * [💰 التسعير](documentation/03-api/features/04-pricing.md)

* [🔒 الأمان](documentation/07-security/)
  * [🛡️ نظرة عامة](documentation/07-security/00-security-overview.md)
  * [⚠️ التهديدات](documentation/07-security/01-threat-model.md)
  * [🔑 المفاتيح](documentation/07-security/02-key-management.md)

* [📚 المراجع](documentation/99-reference/)
  * [📖 الموارد](documentation/99-reference/00-resources.md)
  * [📝 المسرد](documentation/99-reference/01-glossary.md)
  * [👥 الأدوار](documentation/99-reference/05-roles-matrix.md)

* [📊 التقارير]()
  * [📈 التغييرات](documentation/CHANGELOG.md)
  * [📄 المستند الرئيسي](documentation/MASTER-DOCUMENT-V2.0.md)
  * [🔒 الإصدار](documentation/VERSION-LOCK-V2.0.md)

* [🔗 روابط مفيدة]()
  * [<i class="fab fa-github"></i> GitHub](https://github.com/alijawdat-cyber/Depth)
  * [<i class="fas fa-bug"></i> الإبلاغ عن مشكلة](https://github.com/alijawdat-cyber/Depth/issues)
  * [<i class="fas fa-code-branch"></i> المساهمة](https://github.com/alijawdat-cyber/Depth/blob/main/CONTRIBUTING.md)
  * [<i class="fas fa-download"></i> التنزيلات](https://github.com/alijawdat-cyber/Depth/releases)

<style>
/* Navbar Custom Styling */
.app-nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 300px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: all 0.3s ease;
}

[data-theme="dark"] .app-nav {
  background: rgba(26, 26, 26, 0.95);
  border-bottom: 1px solid var(--border-color);
}

.app-nav > ul {
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0 20px;
  max-width: none;
}

.app-nav > ul > li {
  position: relative;
  margin: 0 5px;
}

.app-nav > ul > li > a {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 15px;
  border-radius: 20px;
  color: var(--text-color) !important;
  font-weight: 500;
  font-size: 0.9em;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.app-nav > ul > li > a:hover {
  background: var(--primary-color);
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Dropdown Menu */
.app-nav > ul > li > ul {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
  margin-top: 5px;
}

.app-nav > ul > li:hover > ul {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.app-nav > ul > li > ul > li > a {
  display: block;
  padding: 12px 16px;
  color: var(--text-color) !important;
  font-size: 0.85em;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
  height: auto;
}

.app-nav > ul > li > ul > li:first-child > a {
  border-radius: 8px 8px 0 0;
}

.app-nav > ul > li > ul > li:last-child > a {
  border-radius: 0 0 8px 8px;
}

.app-nav > ul > li > ul > li:only-child > a {
  border-radius: 8px;
}

.app-nav > ul > li > ul > li > a:hover {
  background: var(--primary-color);
  color: white !important;
  transform: none;
  box-shadow: none;
}

/* Brand styling */
.navbar-brand {
  margin-left: auto;
  padding-right: 20px;
}

.navbar-brand a {
  font-size: 1.2em !important;
  font-weight: bold !important;
  color: var(--primary-color) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .app-nav {
    left: 0;
    height: auto;
    position: relative;
  }
  
  .app-nav > ul {
    flex-wrap: wrap;
    padding: 10px;
  }
  
  .app-nav > ul > li {
    margin: 5px;
  }
  
  .app-nav > ul > li > a {
    font-size: 0.8em;
    padding: 0 12px;
    height: 35px;
  }
  
  .navbar-brand {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
  }
}

/* Animation for dropdown arrow */
.app-nav > ul > li > a::after {
  content: '';
  display: inline-block;
  margin-right: 5px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  transition: transform 0.3s ease;
}

.app-nav > ul > li:hover > a::after {
  transform: rotate(180deg);
}

/* Hide arrow for items without dropdowns */
.app-nav > ul > li:not(:has(ul)) > a::after {
  display: none;
}

/* Icon spacing */
.app-nav a i {
  margin-left: 8px;
  width: 16px;
  text-align: center;
}

/* Highlight active section */
.app-nav > ul > li.active > a {
  background: var(--primary-color);
  color: white !important;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
}
</style>
