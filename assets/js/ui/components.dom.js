// DOM helpers and navigation/breadcrumbs for UIComponents
(function(){
  const NS = window.UIComponents;
  if (!NS) return;

  NS.getHeaderOffset = function() {
    try {
      const cs = getComputedStyle(document.documentElement);
      const v = cs.getPropertyValue('--header-total-height') || cs.getPropertyValue('--header-height') || '64px';
      const n = parseFloat(String(v).trim());
      return isNaN(n) ? 64 : n;
    } catch (_) { return 64; }
  };

  NS.scrollToHeading = function(h){
    if (!h) return;
    const offset = NS.getHeaderOffset() + 8;
    const top = window.scrollY + h.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  NS.createNavItem = function(item, isActive=false, sectionId=''){
    const a = document.createElement('a');
    a.href = `#${item.path}`;
    const iconKey = NS.getItemIconKey(item, sectionId);
    const lucideName = NS.getLucideFromKey(iconKey);
    a.className = `nav-item ${isActive ? 'active' : ''}`;
    const icon = document.createElement('i');
    icon.className = 'nav-icon';
    icon.setAttribute('data-lucide', lucideName);
    a.appendChild(icon);
    const text = document.createElement('span');
    text.className = 'nav-text';
    text.textContent = item.name;
    a.appendChild(text);
    a.onclick = (e) => { e.preventDefault(); window.app && window.app.navigate(item.path); };
    return a;
  };

  NS.createNavSection = function(section){
    const div = document.createElement('div');
    div.className = 'nav-section';
    if (section.id) div.setAttribute('data-id', section.id);
    const title = document.createElement('div');
    title.className = 'nav-section-title';
    const sectionIcon = document.createElement('i');
    sectionIcon.className = 'nav-icon';
    sectionIcon.setAttribute('data-lucide', NS.getSectionLucide(section.id));
    title.appendChild(sectionIcon);
    const sectionText = document.createElement('span');
    sectionText.textContent = section.title;
    title.appendChild(sectionText);
    const items = document.createElement('div');
    items.className = 'nav-section-items';
    title.onclick = () => { title.classList.toggle('collapsed'); items.classList.toggle('collapsed'); };
    section.items.forEach(item => items.appendChild(NS.createNavItem(item, false, section.id)));
    div.appendChild(title); div.appendChild(items);
    return div;
  };

  NS.updateBreadcrumbs = function(path){
    const breadcrumbs = document.getElementById('breadcrumbs');
    if (!breadcrumbs) return;
    breadcrumbs.innerHTML = '';
    const addLink = (text, href, disabled=false)=>{ const a=document.createElement('a'); a.textContent=text; a.href=href||'#'; if(disabled){ a.classList.add('disabled'); a.removeAttribute('href'); } breadcrumbs.appendChild(a); };
    const addSpan = (text)=>{ const s=document.createElement('span'); s.textContent=text; breadcrumbs.appendChild(s); };
    addLink('الرئيسية', '#/');
    let foundSection=null, foundItem=null;
    try { for (const section of (window.sidebarData||[])) { for (const it of (section.items||[])) { if (`/${it.path}`===path || it.path===path) { foundSection=section; foundItem=it; break; } } if (foundItem) break; } } catch(_){}
    if (foundSection && foundItem){
      const firstItem = (foundSection.items && foundSection.items[0]) ? foundSection.items[0] : null;
      if (firstItem) addLink(foundSection.title, `#${firstItem.path}`); else addSpan(foundSection.title);
      addSpan(foundItem.name); return;
    }
    const parts = path.split('/').filter(Boolean);
    if (parts.length) addSpan(NS.formatPathName(parts[parts.length-1]));
  };

  // تنسيق أسماء المسارات للعرض (منقول من المونوليث)
  NS.formatPathName = function(path){
    const nameMap = {
      'documentation':'التوثيق', '00-overview':'نظرة عامة','00-introduction':'مقدمة',
      '01-requirements':'المتطلبات','00-requirements-v2.0':'المتطلبات v2.0',
      '02-database':'قاعدة البيانات','00-data-dictionary':'قاموس البيانات','01-database-schema':'مخطط قاعدة البيانات','02-indexes-and-queries':'الفهارس والاستعلامات',
      '03-api':'واجهات البرمجة','core':'الأساسيات','00-api-conventions':'اتفاقيات API','01-authentication':'المصادقة','02-rate-limiting':'تحديد المعدل','03-websockets':'WebSockets','04-error-handling':'معالجة الأخطاء',
      'features':'المميزات','01-creators':'المبدعون','02-clients':'العملاء','03-projects':'المشاريع','04-pricing':'التسعير','05-storage':'التخزين','06-notifications':'الإشعارات','07-messaging':'المراسلة','08-salaried-employees':'الموظفون',
      'admin':'الإدارة','01-admin-panel':'لوحة المدير','02-governance':'الحوكمة','03-seeds-management':'إدارة البيانات',
      'integrations':'التكاملات','01-external-services':'الخدمات الخارجية','02-webhooks':'Webhooks','03-advanced-technical':'التقنيات المتقدمة',
      '04-development':'التطوير','00-getting-started':'دليل المطورين','01-local-setup':'الإعداد المحلي','02-environment-variables':'متغيرات البيئة','03-development-workflow':'سير العمل','04-testing-strategy':'استراتيجية الاختبار',
      '05-mobile':'الجوال','00-mobile-overview':'نظرة عامة - الجوال','06-frontend':'الواجهات','00-frontend-overview':'نظرة عامة - الويب','01-design-tokens':'Design Tokens','02-design-system':'Design System','02-performance-and-a11y':'الأداء وقابلية الوصول','03-component-library':'مكتبة المكونات','04-ux-flows':'UX Flows','05-ui-screens-client':'شاشات العميل','06-ui-screens-admin':'شاشات المدير','07-ui-screens-creator':'شاشات المبدع','08-ui-screens-salaried':'شاشات الموظف',
      '07-security':'الأمان','00-security-overview':'نظرة عامة - الأمان','01-threat-model':'نموذج التهديدات','02-key-management':'إدارة المفاتيح',
      '08-operations':'العمليات','00-operations-overview':'نظرة عامة - العمليات','01-deployment':'النشر','02-incident-response':'الاستجابة للحوادث','03-monitoring':'المراقبة','04-backup-and-restore':'النسخ الاحتياطي والاستعادة','05-disaster-recovery':'التعافي من الكوارث',
      '99-reference':'المراجع','00-resources':'الموارد','01-glossary':'المصطلحات','02-enums-standard':'المعايير','03-link-alias-mapping':'ربط الروابط','04-naming-conventions':'قواعد التسمية','05-roles-matrix':'مصفوفة الأدوار'
    };
    return nameMap[path] || path;
  };

  // حالات التحميل والخطأ للصفحة
  NS.showLoading = function(){ const content=document.getElementById('doc-content'); if (content) content.innerHTML = '<div class="loading">جاري التحميل...</div>'; };
  NS.showError = function(message){ const content=document.getElementById('doc-content'); if (!content) return; const msg=message||'حدث خطأ في تحميل المحتوى'; content.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);"><h2>⚠️ خطأ</h2><p>'+msg+'</p><a href="#/" style="color: var(--primary);">العودة للرئيسية</a></div>'; };
  
  // Navigation section helpers
  NS.createNavSection = function(section){
    const div = document.createElement('div');
    div.className = 'nav-section';
    if (section.id) div.setAttribute('data-id', section.id);
    const title = document.createElement('div');
    title.className = 'nav-section-title';
    const sectionIcon = document.createElement('i');
    sectionIcon.className = 'nav-icon';
    sectionIcon.setAttribute('data-lucide', NS.getSectionLucide(section.id));
    title.appendChild(sectionIcon);
    const sectionText = document.createElement('span');
    sectionText.textContent = section.title;
    title.appendChild(sectionText);
    const items = document.createElement('div');
    items.className = 'nav-section-items';
    title.onclick = () => { title.classList.toggle('collapsed'); items.classList.toggle('collapsed'); };
    section.items.forEach(item => items.appendChild(NS.createNavItem(item, false, section.id)));
    div.appendChild(title); div.appendChild(items);
    return div;
  };
})();
