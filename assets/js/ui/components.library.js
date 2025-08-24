(function(){
  const NS = window.UIComponents; if (!NS) return;
  // Component Library Enhancer
  NS.enhanceComponentLibrary = function(rootEl, path=''){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const isCL = /06-frontend\/03-component-library/.test(path) || /(component library|مكتبة المكونات)/i.test((root.querySelector('h1')?.textContent||''));
    if (!isCL) return;

    const findHeading = (regex) => Array.from(root.querySelectorAll('h2, h3')).find(h => regex.test(h.textContent||''));
    const injectAfter = (el, block) => { if (!el) { root.appendChild(block); } else { el.after(block); } };

    // Buttons
    const buttonsHead = findHeading(/buttons|الأزرار/i);
    if (buttonsHead && !buttonsHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Buttons — الأحجام والأنماط';
      const grid=document.createElement('div'); grid.className='btn-grid';
      const variants=['primary','secondary','outline','ghost','destructive']; const sizes=['xs','sm','md','lg','xl'];
      sizes.forEach(sz=>{ variants.forEach(v=>{ const b=document.createElement('button'); b.className=`ui-btn ui-${v} ui-${sz}`; b.textContent=`${v} ${sz}`; grid.appendChild(b); }); const bw=document.createElement('button'); bw.className=`ui-btn ui-primary ui-${sz} ui-block`; bw.textContent=`Full Width (${sz})`; grid.appendChild(bw); });
      const disabled=document.createElement('button'); disabled.className='ui-btn ui-secondary ui-md'; disabled.disabled=true; disabled.textContent='Disabled';
      const loading=document.createElement('button'); loading.className='ui-btn ui-primary ui-md is-loading'; loading.textContent='Loading...';
      grid.appendChild(disabled); grid.appendChild(loading);
      demo.appendChild(title); demo.appendChild(grid); injectAfter(buttonsHead, demo);
    }

    // Inputs
    const inputsHead = findHeading(/inputs|حقول|textareas|النصية/i);
    if (inputsHead && !inputsHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Inputs & Textareas — الحالات';
      const grid=document.createElement('div'); grid.className='input-grid';
      const makeRow=(label, inner)=>{ const w=document.createElement('div'); w.className='form-field'; const l=document.createElement('label'); l.textContent=label; w.appendChild(l); w.appendChild(inner); return w; };
      const in1=document.createElement('input'); in1.className='ui-input'; in1.placeholder='Default';
      const in2=document.createElement('input'); in2.className='ui-input is-invalid'; in2.placeholder='Invalid';
      const in3=document.createElement('input'); in3.className='ui-input'; in3.placeholder='Disabled'; in3.disabled=true;
      const ta=document.createElement('textarea'); ta.className='ui-textarea'; ta.rows=3; ta.placeholder='Textarea';
      grid.appendChild(makeRow('افتراضي', in1)); grid.appendChild(makeRow('خطأ/Invalid', in2)); grid.appendChild(makeRow('معطل', in3)); grid.appendChild(makeRow('Textarea', ta));
      demo.appendChild(title); demo.appendChild(grid); injectAfter(inputsHead, demo);
    }

    // Selection Controls
    const selHead = findHeading(/checkbox|radio|switch|الاختيار|الراديو|سويتش/i);
    if (selHead && !selHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Selection Controls';
      const row=document.createElement('div'); row.className='selection-row';
      row.innerHTML = '\n                <label class="ui-check"><input type="checkbox" checked><span>Checkbox</span></label>\n                <label class="ui-radio"><input type="radio" name="r1" checked><span>Radio A</span></label>\n                <label class="ui-radio"><input type="radio" name="r1"><span>Radio B</span></label>\n                <label class="ui-switch"><input type="checkbox" checked><span class="track"><span class="thumb"></span></span><span class="sw-label">Switch</span></label>\n            ';
      demo.appendChild(title); demo.appendChild(row); injectAfter(selHead, demo);
    }

    // Alerts
    const alertsHead = findHeading(/alert|toast|تنبيه|تحذير|ملاحظة/i);
    if (alertsHead && !alertsHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Alerts';
      const grid=document.createElement('div'); grid.className='alert-grid';
      ;['info','success','warning','error'].forEach(v=>{ const a=document.createElement('div'); a.className=`ui-alert ${v}`; a.textContent=`${v[0].toUpperCase()+v.slice(1)} message for users.`; grid.appendChild(a); });
      demo.appendChild(title); demo.appendChild(grid); injectAfter(alertsHead, demo);
    }

    // Cards
    const cardsHead = findHeading(/card|بطاقات/i);
    if (cardsHead && !cardsHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Card';
      const card=document.createElement('div'); card.className='ui-card';
      card.innerHTML='\n                <div class="card-header">عنوان البطاقة</div>\n                <div class="card-body">نص تجريبي قصير يوضح محتوى البطاقة وتخطيطها.</div>\n                <div class="card-footer"><button class="ui-btn ui-secondary ui-sm">إجراء</button></div>\n            ';
      demo.appendChild(title); demo.appendChild(card); injectAfter(cardsHead, demo);
    }

    // Tabs
    const tabsHead = findHeading(/tabs|التبويبات/i);
    if (tabsHead && !tabsHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Tabs';
      const tabs=document.createElement('div'); tabs.className='ui-tabs';
      tabs.innerHTML='\n                <div class="tab-list" role="tablist">\n                    <button class="tab active" role="tab" data-tab="one">الأول</button>\n                    <button class="tab" role="tab" data-tab="two">الثاني</button>\n                    <button class="tab" role="tab" data-tab="three">الثالث</button>\n                </div>\n                <div class="tab-panels">\n                    <div class="tab-panel active" data-panel="one">محتوى تبويب 1</div>\n                    <div class="tab-panel" data-panel="two">محتوى تبويب 2</div>\n                    <div class="tab-panel" data-panel="three">محتوى تبويب 3</div>\n                </div>';
      tabs.addEventListener('click', (e)=>{ const btn=e.target.closest('.tab'); if(!btn) return; const name=btn.getAttribute('data-tab'); tabs.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t===btn)); tabs.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active', p.getAttribute('data-panel')===name)); });
      demo.appendChild(title); demo.appendChild(tabs); injectAfter(tabsHead, demo);
    }

    // Modal & Drawer
    const modalHead = findHeading(/modal|drawer|مودال|سحب/i);
    if (modalHead && !modalHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Modal & Drawer';
      const row=document.createElement('div'); row.className='selection-row';
      row.innerHTML='\n                <button class="ui-btn ui-primary ui-sm" data-open="modal">فتح Modal</button>\n                <button class="ui-btn ui-secondary ui-sm" data-open="drawer">فتح Drawer</button>\n                <div class="ui-modal" hidden>\n                  <div class="ui-overlay" data-close></div>\n                  <div class="ui-dialog">\n                    <div class="ui-dialog-h">عنوان</div>\n                    <div class="ui-dialog-b">نص داخل مودال بسيط للتجربة.</div>\n                    <div class="ui-dialog-f"><button class="ui-btn ui-secondary ui-sm" data-close>إغلاق</button></div>\n                  </div>\n                </div>\n                <div class="ui-drawer" hidden>\n                  <div class="ui-overlay" data-close></div>\n                  <div class="ui-drawer-p">\n                    <div class="ui-drawer-h">القائمة الجانبية</div>\n                    <div class="ui-drawer-b">محتوى السحب الجانبي</div>\n                  </div>\n                </div>';
      row.addEventListener('click', (e)=>{
        const btn = e.target.closest('button[data-open]');
        if (btn) { const kind=btn.getAttribute('data-open'); const el=row.querySelector(kind==='modal'?'.ui-modal':'.ui-drawer'); el.hidden=false; return; }
        if (e.target.closest('[data-close]')) { row.querySelectorAll('.ui-modal,.ui-drawer').forEach(x=>x.hidden=true); }
      });
      demo.appendChild(title); demo.appendChild(row); injectAfter(modalHead, demo);
    }

    // Table
    const tableHead = findHeading(/table|جدول/i);
    if (tableHead && !tableHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Table';
      const wrap=document.createElement('div'); wrap.className='table-wrap';
      const tbl=document.createElement('table'); tbl.className='ui-table';
      tbl.innerHTML='\n                <thead><tr><th>الاسم</th><th>الدور</th><th>الحالة</th></tr></thead>\n                <tbody>\n                  <tr><td>أحمد</td><td>مدير</td><td><span class="ui-badge success">نشط</span></td></tr>\n                  <tr><td>نور</td><td>مصمم</td><td><span class="ui-badge warning">معلّق</span></td></tr>\n                  <tr><td>سارة</td><td>مهندسة</td><td><span class="ui-badge error">موقوف</span></td></tr>\n                </tbody>';
      wrap.appendChild(tbl); demo.appendChild(title); demo.appendChild(wrap); injectAfter(tableHead, demo);
    }

    // Breadcrumbs
    const bcHead = findHeading(/breadcrumbs|فتات الخبز|مسار التنقل/i);
    if (bcHead && !bcHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Breadcrumbs';
      const bc=document.createElement('nav'); bc.className='ui-breadcrumbs';
      bc.innerHTML='<a href="#">الرئيسية</a><span>/</span><a href="#">Frontend</a><span>/</span><span class="current">Component Library</span>';
      demo.appendChild(title); demo.appendChild(bc); injectAfter(bcHead, demo);
    }

    // Pagination
    const pagHead = findHeading(/pagination|التقسيم الصفحات/i);
    if (pagHead && !pagHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Pagination';
      const p=document.createElement('div'); p.className='ui-pagination';
      p.innerHTML='<button class="ui-btn ui-outline ui-sm">◄</button>\n                           <button class="ui-btn ui-sm">1</button>\n                           <button class="ui-btn ui-sm ui-primary">2</button>\n                           <button class="ui-btn ui-sm">3</button>\n                           <button class="ui-btn ui-outline ui-sm">►</button>';
      demo.appendChild(title); demo.appendChild(p); injectAfter(pagHead, demo);
    }

    // Badges/Chips/Tooltip
    const badgeHead = findHeading(/badge|chip|وسم|شيب|تولتيب|tooltip/i);
    if (badgeHead && !badgeHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Badges/Chips/Tooltip';
      const row=document.createElement('div'); row.className='selection-row';
      row.innerHTML='\n                <span class="ui-badge info">Info</span>\n                <span class="ui-badge success">Success</span>\n                <span class="ui-badge warning">Warning</span>\n                <span class="ui-badge error">Error</span>\n                <span class="ui-chip">Tag <button class="x">×</button></span>\n                <button class="ui-btn ui-secondary ui-sm ui-tooltip" data-tip="معلومة سريعة">Hover</button>';
      row.addEventListener('click', (e)=>{ if (e.target.matches('.ui-chip .x')) e.target.closest('.ui-chip').remove(); });
      demo.appendChild(title); demo.appendChild(row); injectAfter(badgeHead, demo);
    }

    // Progress & Skeleton
    const progHead = findHeading(/progress|skeleton|تحميل|شريط/i);
    if (progHead && !progHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Progress & Skeleton';
      const box=document.createElement('div'); box.innerHTML='\n                <div class="ui-progress"><div class="bar" style="--p:65%"></div></div>\n                <div class="ui-skeleton" style="height: 12px; width: 60%"></div>\n                <div class="ui-skeleton" style="height: 12px; width: 40%"></div>';
      demo.appendChild(title); demo.appendChild(box); injectAfter(progHead, demo);
    }

    // Avatars & Toast
    const avatarHead = findHeading(/avatar|صورة|هوية/i);
    if (avatarHead && !avatarHead.nextElementSibling?.classList?.contains('comp-demo')){
      const demo=document.createElement('div'); demo.className='comp-demo';
      const title=document.createElement('div'); title.className='demo-title'; title.textContent='Avatars & Toast';
      const row=document.createElement('div'); row.className='selection-row';
      row.innerHTML='\n                <span class="ui-avatar" data-initials="AJ"></span>\n                <span class="ui-avatar" data-initials="DZ"></span>\n                <button class="ui-btn ui-primary ui-sm" id="toast-btn">إظهار Toast</button>\n                <div class="ui-toast-stack" aria-live="polite"></div>';
      row.querySelectorAll('.ui-avatar').forEach(a=>{ const init=a.getAttribute('data-initials')||''; a.textContent=init; });
      row.addEventListener('click', (e)=>{ if (e.target.id==='toast-btn'){ const stack=row.querySelector('.ui-toast-stack'); const t=document.createElement('div'); t.className='ui-toast'; t.textContent='تم تنفيذ العملية بنجاح'; stack.appendChild(t); setTimeout(()=>{ t.classList.add('show'); }, 10); setTimeout(()=>{ t.classList.remove('show'); t.addEventListener('transitionend', ()=> t.remove(), {once:true}); }, 2500); } });
      demo.appendChild(title); demo.appendChild(row); injectAfter(avatarHead, demo);
    }
  };
})();
