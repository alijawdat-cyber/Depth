(function(){
  const NS = window.UIComponents; if (!NS) return;
  // نقل: enhanceTables + fixMobileStickyColumns
  NS.enhanceTables = function(rootEl){
    const root = rootEl || document.getElementById('doc-content');
    if (!root) return;
    const tables = Array.from(root.querySelectorAll('table'));
    const isPhone = window.innerWidth < 768;
    // تنظيف أي أنماط inline قديمة
    tables.forEach((t) => {
      const cells = t.querySelectorAll('th, td');
      cells.forEach(cell => { cell.style.removeProperty('width'); cell.style.removeProperty('min-width'); cell.style.removeProperty('max-width'); });
      const inlineWidth = t.getAttribute('width') || (t.style ? t.style.width : '') || '';
      if (inlineWidth) { t.removeAttribute('width'); try { if (t.style) t.style.removeProperty('width'); } catch (_) {} }
    });
    tables.forEach((table) => {
      let wrap = table.closest('.table-wrap');
      if (!wrap) {
        wrap = document.createElement('div'); wrap.className = 'table-wrap';
        if (isPhone) { wrap.classList.add('mobile-scrollable'); wrap.setAttribute('role','region'); wrap.setAttribute('aria-label','جدول قابل للتمرير'); wrap.setAttribute('tabindex','0'); }
        table.parentNode.insertBefore(wrap, table); wrap.appendChild(table);
      }
      const firstRow = table.querySelector('tr');
      const cols = firstRow ? firstRow.children.length : 0;
      if (isPhone && cols >= 4) { table.classList.add('mobile-sticky-first'); wrap.classList.add('has-sticky-col'); }
      else { table.classList.remove('mobile-sticky-first'); wrap.classList.remove('has-sticky-col'); }
      if (isPhone) wrap.classList.add('mobile-scrollable'); else wrap.classList.remove('mobile-scrollable');
      table.classList.add('sticky-head');
      try {
        if (isPhone) {
          if (cols >= 4) { table.classList.add('mobile-sticky-first'); wrap && wrap.classList.add('has-sticky-col'); }
          else { table.classList.remove('mobile-sticky-first'); wrap && wrap.classList.remove('has-sticky-col'); }
          table.classList.remove('sticky-col');
        } else {
          if (cols >= 5) table.classList.add('sticky-col'); else table.classList.remove('sticky-col');
          table.classList.remove('mobile-sticky-first'); wrap && wrap.classList.remove('has-sticky-col');
        }
      } catch(_) {}
    });
  };
  NS.fixMobileStickyColumns = function(){
    if (window.innerWidth > 768) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wrap = entry.target; const table = wrap.querySelector('table'); if (!table) return;
        if (entry.isIntersecting) table.classList.add('mobile-sticky-active'); else table.classList.remove('mobile-sticky-active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.table-wrap').forEach(wrap => observer.observe(wrap));
  };
})();
