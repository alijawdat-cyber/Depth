// Prev/Next + Related + ملاحق الموبايل
(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.injectPrevNextAndRelated = function(currentPath){
    try {
      const host = document.getElementById('doc-content');
      if (!host || currentPath === '/') return;
      const sections = (window.sidebarData || (typeof sidebarData !== 'undefined' ? sidebarData : []));
      if (!sections || !sections.length) return;
      let secIndex = -1, itemIndex = -1;
      for (let s = 0; s < sections.length; s++) {
        const items = (sections[s].items || []);
        const idx = items.findIndex(it => it.path === currentPath);
        if (idx !== -1) { secIndex = s; itemIndex = idx; break; }
      }
      if (secIndex === -1) return;
      const curSection = sections[secIndex]; const curItems = curSection.items || [];
      const prev = (() => { if (itemIndex > 0) return { sec: secIndex, idx: itemIndex - 1 }; for (let s = secIndex - 1; s >= 0; s--) { const itms = sections[s].items || []; if (itms.length) return { sec: s, idx: itms.length - 1 }; } return null; })();
      const next = (() => { if (itemIndex < curItems.length - 1) return { sec: secIndex, idx: itemIndex + 1 }; for (let s = secIndex + 1; s < sections.length; s++) { const itms = sections[s].items || []; if (itms.length) return { sec: s, idx: 0 }; } return null; })();
      const related = (curItems.filter((_, i) => i !== itemIndex).slice(0, 3));
      const wrap = document.createElement('div'); wrap.className = 'doc-footer';
      const nav = document.createElement('div'); nav.className = 'doc-footer-nav';
      if (prev) {
        const p = sections[prev.sec].items[prev.idx]; const a = document.createElement('a'); a.className = 'doc-nav-link prev'; a.href = `#${p.path}`; a.innerHTML = `<span class="dir">السابق</span><span class="title">${p.name}</span>`; a.onclick = (e)=>{ e.preventDefault(); window.app.navigate(p.path); }; nav.appendChild(a);
      } else { const span = document.createElement('span'); span.className = 'doc-nav-spacer'; nav.appendChild(span); }
      if (next) {
        const n = sections[next.sec].items[next.idx]; const a = document.createElement('a'); a.className = 'doc-nav-link next'; a.href = `#${n.path}`; a.innerHTML = `<span class="dir">التالي</span><span class="title">${n.name}</span>`; a.onclick = (e)=>{ e.preventDefault(); window.app.navigate(n.path); }; nav.appendChild(a);
      }
      wrap.appendChild(nav);
      if (related && related.length) {
        const rel = document.createElement('div'); rel.className = 'doc-related';
        const label = document.createElement('div'); label.className = 'doc-related-label'; label.textContent = 'روابط ذات صلة'; rel.appendChild(label);
        const list = document.createElement('div'); list.className = 'doc-related-links';
        related.forEach(r=>{ const a=document.createElement('a'); a.href=`#${r.path}`; a.textContent=r.name; a.onclick=(e)=>{ e.preventDefault(); window.app.navigate(r.path); }; list.appendChild(a); });
        rel.appendChild(list); wrap.appendChild(rel);
      }
      host.appendChild(wrap);
      try { const isPhone = window.innerWidth < 768; document.getElementById('mobile-doc-nav')?.remove(); if (isPhone) { const mnav = document.createElement('div'); mnav.id='mobile-doc-nav'; const makeBtn = (label, path, dirIcon)=>{ const a=document.createElement('a'); a.href=`#${path}`; a.className='mobile-doc-btn'; a.innerHTML = `<span class=\"icon\" data-lucide=\"${dirIcon}\"></span><span>${label}</span>`; a.onclick=(e)=>{ e.preventDefault(); window.app.navigate(path); }; return a; }; if (prev){ const p = sections[prev.sec].items[prev.idx]; mnav.appendChild(makeBtn('السابق', p.path, 'arrow-right')); } if (next){ const n = sections[next.sec].items[next.idx]; mnav.appendChild(makeBtn('التالي', n.path, 'arrow-left')); } document.body.appendChild(mnav); if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); } } catch(_) {}
    } catch(_) {}
  };
})();
