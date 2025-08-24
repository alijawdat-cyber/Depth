(function(){
  const NS = window.UIComponents; if (!NS) return;

  NS.getItemIconKey = function(item, sectionId = '') {
    const p = (item.path || '').toLowerCase();
    const n = (item.name || '').toLowerCase();
    const has = (s) => p.includes(s) || n.includes(s);
    if (has('00-overview') || has('introduction') || has('نظرة')) return 'overview';
    if (has('requirements') || has('المتطلبات')) return 'requirements';
    if (has('data-dictionary') || has('قاموس')) return 'dictionary';
    if (has('database-schema') || has('schema') || has('مخطط')) return 'schema';
    if (has('indexes') || has('استعلام') || has('فهارس')) return 'indexes';
    if (has('authentication') || has('auth') || has('مصاد')) return 'auth';
    if (has('api-conventions') || has('conventions') || has('اتفاقيات')) return 'conventions';
    if (has('rate-limiting') || has('المعدل')) return 'rate-limit';
    if (has('websockets')) return 'websocket';
    if (has('error-handling') || has('أخطاء') || has('خطأ')) return 'error';
    if (has('creators') || has('المبدعين')) return 'creator';
    if (has('clients') || has('العملاء')) return 'clients';
    if (has('projects') || has('المشاريع')) return 'projects';
    if (has('pricing') || has('التسعير')) return 'pricing';
    if (has('storage') || has('التخزين')) return 'storage';
    if (has('notifications') || has('الإشعارات')) return 'notifications';
    if (has('messaging') || has('المراسلة')) return 'messaging';
    if (has('salaried') || has('الموظ')) return 'employees';
    if (has('admin-panel') || has('لوحة')) return 'dashboard';
    if (has('governance') || has('الحوكمة')) return 'governance';
    if (has('seeds') || has('إدارة البيانات')) return 'seeds';
    if (has('external-services')) return 'plug';
    if (has('webhooks')) return 'webhook';
    if (has('advanced')) return 'flask';
    if (has('getting-started') || has('دليل')) return 'rocket';
    if (has('local-setup') || has('الإعداد')) return 'laptop';
    if (has('environment-variables') || has('متغيرات')) return 'key';
    if (has('workflow') || has('العمل')) return 'flow';
    if (has('testing') || has('الاختبار')) return 'test';
    if (has('mobile') || has('الجوال')) return 'phone';
    if (has('frontend') || has('الويب')) return 'monitor';
    if (has('design-tokens')) return 'tokens';
    if (has('design-system')) return 'design-system';
    if (has('performance-and-a11y') || has('performance') || has('a11y')) return 'performance';
    if (has('component-library')) return 'components';
    if (has('security-overview') || has('الأمان') || has('security')) return 'shield';
    if (has('threat-model')) return 'target';
    if (has('key-management')) return 'key';
    if (has('operations-overview') || has('العمليات') || has('operations')) return 'cogs';
    if (has('deployment')) return 'cloud-upload';
    if (has('incident-response')) return 'alert';
    if (has('resources')) return 'book';
    if (has('glossary')) return 'book-open';
    if (has('enums-standard') || has('المعايير')) return 'braces';
    if (has('link-alias-mapping')) return 'link';
    if (has('naming-conventions')) return 'text';
    if (has('roles-matrix')) return 'grid';
    switch (sectionId) {
      case 'database': return 'database';
      case 'core': return 'cog';
      case 'features': return 'sparkles';
      case 'admin': return 'shield-check';
      case 'integrations': return 'plug';
      case 'development': return 'code';
      case 'interfaces': return 'devices';
      case 'security': return 'shield';
      case 'operations': return 'cogs';
      case 'reference': return 'book';
      default: return 'dot';
    }
  };

  NS.getLucideFromKey = function(key){
    const map = {
      overview:'list',requirements:'file-check-2',dictionary:'book',schema:'git-branch',indexes:'list-filter',database:'database',auth:'shield',conventions:'file-cog','rate-limit':'gauge',websocket:'network',error:'triangle-alert',creator:'pen-tool',clients:'users',projects:'folder-kanban',pricing:'receipt',storage:'hard-drive',notifications:'bell',messaging:'message-square',employees:'user-cog',dashboard:'layout-dashboard',governance:'landmark',seeds:'sprout',plug:'plug',webhook:'webhook',flask:'flask-conical',rocket:'rocket',laptop:'laptop',key:'key',flow:'workflow',test:'beaker',phone:'smartphone',monitor:'monitor',tokens:'layers','design-system':'shapes',performance:'gauge',components:'boxes',shield:'shield',target:'target',cogs:'cog','cloud-upload':'cloud-upload',alert:'triangle-alert',book:'book','book-open':'book-open',braces:'braces',link:'link',text:'type',grid:'grid-2x2',cog:'cog',sparkles:'sparkles','shield-check':'shield-check',code:'code-2',devices:'monitor-smartphone',dot:'dot'
    }; return map[key] || 'dot';
  };

  NS.getSectionLucide = function(id=''){
    const map = {home:'home','getting-started':'rocket',database:'database',core:'layers-3',features:'sparkles',admin:'shield-check',integrations:'plug',development:'code-2',interfaces:'monitor-smartphone',frontend:'monitor',security:'shield',operations:'settings-2',reference:'book'};
    return map[id] || 'dot';
  };
})();
