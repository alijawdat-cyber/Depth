(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.enhanceCallouts = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const bqs = Array.from(root.querySelectorAll('blockquote'));
    const map = { '[!NOTE]': { cls: 'note', label: 'ملاحظة', icon: 'info' }, '[!TIP]': { cls: 'tip', label: 'نصيحة', icon: 'lightbulb' }, '[!WARNING]': { cls: 'warning', label: 'تحذير', icon: 'triangle-alert' }, '[!IMPORTANT]': { cls: 'important', label: 'مهم', icon: 'alert-octagon' }, '[!INFO]': { cls: 'info', label: 'معلومة', icon: 'info' } };
    bqs.forEach(bq => { const text=(bq.textContent||'').trim(); const key = Object.keys(map).find(k=>text.startsWith(k)); if (!key) return; const cfg=map[key]; const html=bq.innerHTML.replace(key,'').trim(); const wrap=document.createElement('div'); wrap.className=`callout ${cfg.cls}`; wrap.innerHTML = `<div class="callout-icon"><i data-lucide="${cfg.icon}"></i></div><div class="callout-body"><div class="callout-title">${cfg.label}</div><div class="callout-content">${html}</div></div>`; bq.replaceWith(wrap); });
  };
  NS.enhanceInlineTOC = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const isTOCTitle = (t) => { const s=(t||'').trim().toLowerCase(); return s==='فهرس المحتويات' || s==='المحتويات' || s==='table of contents' || s==='contents'; };
    const normalize = (txt) => (txt||'').replace(/\[[^\]]*\]/g,'').replace(/[0-9٠-٩]+[\.\-|ـ)]?\s*/g,'').replace(/[:\.،,…]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
    const allHeads = Array.from(root.querySelectorAll('h2, h3, h4')); if (!allHeads.length) return;
    const titles = Array.from(root.querySelectorAll('h1, h2, h3')).filter(h=>isTOCTitle(h.textContent));
    titles.forEach(title => { title.classList.add('inline-toc-title'); let el = title.nextElementSibling; let list=null; while (el && !(el.tagName==='UL' || el.tagName==='OL')) { if (/^H[1-6]$/.test(el.tagName) || el.tagName==='TABLE') break; el = el.nextElementSibling; } if (el && (el.tagName==='UL' || el.tagName==='OL')) list = el; if (!list) return; list.classList.add('inline-toc'); const links = Array.from(list.querySelectorAll('a')); links.forEach(a=>{ const label = normalize(a.textContent||''); const target = allHeads.find(h=>normalize(h.textContent||'')===label); if (!target) return; a.setAttribute('data-target', target.id); a.setAttribute('href','#'); a.addEventListener('click',(e)=>{ e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); target.classList.add('heading-flash'); setTimeout(()=>target.classList.remove('heading-flash'), 900); }); }); });
  };
})();
