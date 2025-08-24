(function(){
  const NS = window.UIComponents; if (!NS) return;
  // عناوين + صور وروابط + RTL/LTR + أيقونة عنوان الصفحة + LazyLoad
  NS.addHeadingAnchors = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const heads = root.querySelectorAll('h2, h3, h4'); let idx = 0;
    heads.forEach(h => { if (!h.id) { h.id = `sec-${idx++}`; } if (h.querySelector('.heading-anchor')) return; const a=document.createElement('a'); a.className='heading-anchor'; a.href=`#${h.id}`; a.setAttribute('aria-label','نسخ رابط العنوان'); const i=document.createElement('i'); i.setAttribute('data-lucide','link-2'); a.appendChild(i); h.appendChild(a); });
  };
  NS.sanitizeHeadings = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const reLeadingEmoji = /^\s*(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*)+/u;
    const cleanNode = (el) => { for (let n of el.childNodes) { if (n.nodeType === Node.TEXT_NODE) { const orig = n.nodeValue || ''; const cleaned = orig.replace(reLeadingEmoji, '').replace(/^\s+/, ''); if (cleaned !== orig) n.nodeValue = cleaned; break; } } };
    root.querySelectorAll('h1, h2, h3, h4').forEach(cleanNode);
  };
  NS.enhanceImagesAndLinks = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const imgs = Array.from(root.querySelectorAll('img'));
    imgs.forEach(img => { img.loading = img.loading || 'lazy'; if (img.closest('figure')) return; const fig=document.createElement('figure'); fig.className='md-figure'; const clone=img.cloneNode(true); clone.classList.add('md-image'); img.replaceWith(fig); fig.appendChild(clone); if (clone.alt && clone.alt.trim()) { const cap=document.createElement('figcaption'); cap.textContent = clone.alt; fig.appendChild(cap); } });
    const links = Array.from(root.querySelectorAll('a[href]'));
    links.forEach(a => { const href = a.getAttribute('href') || ''; const isAnchor = href.startsWith('#'); const isMail = href.startsWith('mailto:') || href.startsWith('tel:'); try { const url = new URL(href, window.location.href); const isExternal = url.origin !== window.location.origin; if (!isAnchor && !isMail && isExternal) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } } catch(_){} });
    try { NS.lazyLoadImages(root); } catch(_) {}
  };
  NS.applyAutoDirection = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/; const LATIN_RE = /[A-Za-z]/;
    const selectors = ['p','li','blockquote','figcaption','dd','dt','h1','h2','h3','h4','td','th','.callout-content','.doc-related a'];
    const nodes = Array.from(root.querySelectorAll(selectors.join(','))).
      filter(el => !el.closest('pre, code, .json-viewer, .diagram, .mermaid-diagram'));
    const isPureEnglish = (text) => { const t = (text || '').replace(/\s+/g,' ').trim(); if (!t) return false; if (ARABIC_RE.test(t)) return false; return LATIN_RE.test(t); };
    nodes.forEach(el => { if (el.hasAttribute('dir')) return; const text = el.innerText || el.textContent || ''; if (isPureEnglish(text)) { el.setAttribute('dir','ltr'); el.classList.add('dir-ltr'); } });
  };
  NS.lazyLoadImages = function(root){
    const images = root.querySelectorAll('img');
    const obs = new IntersectionObserver((entries)=>{ entries.forEach(entry=>{ if (!entry.isIntersecting) return; const img=entry.target; if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); } obs.unobserve(img); }); }, { rootMargin: '50px' });
    images.forEach(img => { if (!img.complete) { img.dataset.src = img.src; img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E'; } obs.observe(img); });
  };
  NS.injectPageTitleIcon = function(currentPath){
    try {
      const container = document.getElementById('doc-content'); if (!container) return;
      const h1 = container.querySelector('h1'); if (!h1) return;
      let sectionId = ''; let item = null;
      for (const section of (window.sidebarData || [])) { const it = (section.items || []).find(x => x.path === currentPath); if (it) { sectionId = section.id || ''; item = it; break; } }
      if (!item) item = { path: currentPath, name: h1.textContent || '' };
      const iconKey = NS.getItemIconKey ? NS.getItemIconKey(item, sectionId) : 'dot';
      const lucideName = NS.getLucideFromKey ? NS.getLucideFromKey(iconKey) : 'dot';
      if (h1.querySelector('.page-title-icon')) return;
      const wrap = document.createElement('span'); wrap.className='page-title-icon'; const i=document.createElement('i'); i.setAttribute('data-lucide', lucideName); wrap.appendChild(i); h1.insertBefore(wrap, h1.firstChild);
    } catch(_){}
  };
})();
