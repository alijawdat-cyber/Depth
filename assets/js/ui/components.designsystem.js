(function(){
  const NS = window.UIComponents; if (!NS) return;
  // Enhancer لصفحة Design System (شبكات الصور، بطاقات القوائم، Spec badges، ومعاينة الشبكة)
  NS.enhanceDesignSystemBlocks = function(rootEl, path=''){
    const root = rootEl || document.getElementById('doc-content');
    if (!root) return;
    const isDS = /06-frontend\/02-design-system/.test(path) || /design system/i.test((root.querySelector('h1')?.textContent||''));
    if (!isDS) return;

    // 1) تجميع figures المتجاورة كشبكة
    const figs = Array.from(root.querySelectorAll('figure.md-figure'));
    let group = [];
    const flushGroup = () => {
      if (group.length <= 1) { group = []; return; }
      const wrap = document.createElement('div');
      wrap.className = 'ds-image-grid';
      group[0].parentNode.insertBefore(wrap, group[0]);
      group.forEach(f => wrap.appendChild(f));
      group = [];
    };
    figs.forEach((f, idx) => {
      const prev = figs[idx-1];
      if (!prev) { group = [f]; return; }
      const gap = f.offsetTop - prev.offsetTop;
      if (Math.abs(gap) < 600) group.push(f); else { flushGroup(); group = [f]; }
    });
    flushGroup();

    // 2) تحويل القوائم بعد h3/h4 إلى بطاقات
    Array.from(root.querySelectorAll('h3 + ul, h3 + ol, h4 + ul, h4 + ol')).forEach(list => {
      list.classList.add('ds-card-list');
      Array.from(list.children).forEach(li => li.classList.add('ds-card-li'));
    });

    // 3) Spec cards للكود القصير
    Array.from(root.querySelectorAll('pre > code')).forEach(code => {
      const txt = (code.textContent||'').trim();
      const isStub = txt.startsWith('/*') || txt.length < 40;
      if (!isStub) return;
      const pre = code.closest('pre');
      if (!pre || pre.classList.contains('spec-card')) return;
      pre.classList.add('spec-card');
      const badge = document.createElement('div');
      badge.className = 'spec-badge';
      badge.textContent = 'Spec';
      pre.insertBefore(badge, pre.firstChild);
    });

    // 4) Grid preview بسيط
    const gridHead = Array.from(root.querySelectorAll('h2, h3')).find(h => /(grid system|نظام الشبكة|الشبكة والتخطيط)/i.test(h.textContent||''));
    if (gridHead) {
      const existing = gridHead.parentElement.querySelector('.grid-preview');
      if (!existing) {
        const demo = document.createElement('div');
        demo.className = 'grid-preview';
        for (let i=1;i<=12;i++) {
          const col = document.createElement('div');
          col.className = 'grid-col';
          col.textContent = String(i);
          demo.appendChild(col);
        }
        gridHead.after(demo);
      }
    }
  };
})();
