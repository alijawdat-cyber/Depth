(function(){
  const NS = window.UIComponents; if (!NS) return;
  // TOC و Heading observers والموبايل TOC
    NS.generateTOC = function(content){
      const toc = document.getElementById('toc-list');
      const headings = content.querySelectorAll('h2, h3');
      if (headings.length === 0) {
        document.getElementById('floating-toc').style.display = 'none';
        NS.setupMobileTOC([]);
        return;
      }
      document.getElementById('floating-toc').style.display = 'block';
      toc.innerHTML = '';
      let currentGroup = null;
      headings.forEach((heading, index) => {
        const id = `heading-${index}`; heading.id = id;
        if (heading.tagName.toLowerCase() === 'h2') {
          const group = document.createElement('div'); group.className = 'toc-group';
          const headerItem = document.createElement('div'); headerItem.className = 'toc-item h2';
          const caret = document.createElement('button'); caret.className = 'toc-caret'; caret.type = 'button'; caret.setAttribute('aria-expanded','true'); caret.setAttribute('aria-label','طي/فتح');
          const link = document.createElement('a'); link.href = `#${id}`; link.textContent = heading.textContent; link.onclick = (e)=>{ e.preventDefault(); NS.scrollToHeading(heading); toc.querySelectorAll('a').forEach(a=>a.classList.remove('active')); link.classList.add('active'); };
          headerItem.appendChild(caret); headerItem.appendChild(link); group.appendChild(headerItem);
          const sublist = document.createElement('div'); sublist.className = 'toc-sublist'; group.appendChild(sublist);
          caret.addEventListener('click', (e)=>{ e.stopPropagation(); const isCollapsed = group.classList.toggle('collapsed'); caret.setAttribute('aria-expanded', String(!isCollapsed)); });
          toc.appendChild(group); currentGroup = { group, sublist };
        } else {
          const item = document.createElement('div'); item.className = 'toc-item h3';
          const link = document.createElement('a'); link.href = `#${id}`; link.textContent = heading.textContent; link.onclick = (e)=>{ e.preventDefault(); NS.scrollToHeading(heading); toc.querySelectorAll('a').forEach(a=>a.classList.remove('active')); link.classList.add('active'); };
          item.appendChild(link);
          if (currentGroup && currentGroup.sublist) currentGroup.sublist.appendChild(item); else toc.appendChild(item);
        }
      });
  NS.observeHeadings(headings);
  NS.attachTOCScrollSync(headings);
      const h2s = Array.from(headings).filter(h=>h.tagName.toLowerCase()==='h2');
      NS.setupMobileTOC(h2s);
      try { NS.enhanceFloatingTOC && NS.enhanceFloatingTOC(); } catch(_) {}
    };

    // Inline TOC بسيط داخل المقال (احتياطي لاستدعاءات app.js)
    NS.enhanceInlineTOC = function(rootEl){
      const root = rootEl || document.getElementById('doc-content'); if (!root) return;
      // إذا موجود مسبقًا لا تعيد إنشاءه
      if (root.querySelector('.inline-toc')) return;
      const heads = Array.from(root.querySelectorAll('h2'));
      if (!heads.length) return;
      const box = document.createElement('nav');
      box.className = 'inline-toc';
      const title = document.createElement('div'); title.className = 'inline-toc-title'; title.textContent = 'المحتويات'; box.appendChild(title);
      const list = document.createElement('ul'); list.className = 'inline-toc-list';
      heads.forEach((h, i)=>{ if (!h.id) h.id = `sec-${i}`; const li=document.createElement('li'); const a=document.createElement('a'); a.href = `#${h.id}`; a.textContent = h.textContent || `قسم ${i+1}`; a.addEventListener('click', (e)=>{ e.preventDefault(); NS.scrollToHeading ? NS.scrollToHeading(h) : h.scrollIntoView({behavior:'smooth'}); }); li.appendChild(a); list.appendChild(li); });
      box.appendChild(list);
      const firstPara = root.querySelector('p');
      if (firstPara && firstPara.parentNode === root) { root.insertBefore(box, firstPara.nextSibling); }
      else { root.insertBefore(box, root.firstChild); }
    };

    NS.observeHeadings = function(headings){
      const topOff = NS.getHeaderOffset();
      const options = { rootMargin: `${-Math.round(topOff + 8)}px 0px -60% 0px`, threshold: 0 };
      const toc = document.getElementById('toc-list');
      const scrollIntoViewCentered = (el) => { if (!toc || !el) return; const elTop = el.offsetTop; const target = elTop - (toc.clientHeight / 2) + (el.clientHeight / 2); toc.scrollTo({ top: Math.max(0, target), behavior: 'smooth' }); };
      const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const tocLinks = document.querySelectorAll('.toc-item a');
            tocLinks.forEach(link=>{
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
                scrollIntoViewCentered(link);
                const group = link.closest('.toc-group');
                if (group && group.classList.contains('collapsed')) {
                  group.classList.remove('collapsed');
                  const caret = group.querySelector('.toc-caret'); if (caret) caret.setAttribute('aria-expanded','true');
                }
              }
            });
          }
        });
      }, options);
      headings.forEach(heading => observer.observe(heading));
    };

    // اجعل الفلوتنغ TOC ثابت (يعتمد فقط على sticky في CSS)
    NS.enhanceFloatingTOC = function(){ /* لا حاجة لحركات JS هنا للحفاظ على الثبات */ };

    // مزامنة العناوين مع التمرير بشكل سلس جدًا (ديسكتوب)
    NS.attachTOCScrollSync = function(headings){
      try { window.removeEventListener('scroll', NS._tocScrollSync); } catch(_) {}
      if (!headings || !headings.length || window.innerWidth < 1024) return;
      const tocEl = document.getElementById('toc-list');
      const map = new Map();
      tocEl && tocEl.querySelectorAll('.toc-item a').forEach(a=>{ const href=a.getAttribute('href')||''; if (href.startsWith('#')) map.set(href.slice(1), a); });
      const headerOff = NS.getHeaderOffset();
      let prevId = '';
      const centerActive = (a)=>{ if (!tocEl || !a) return; const target = a.offsetTop - (tocEl.clientHeight/2) + (a.clientHeight/2); tocEl.scrollTo({ top: Math.max(0, target), behavior: 'smooth' }); };
      const setActive = (id)=>{
        if (!id || id===prevId) return; prevId = id;
        const links = tocEl ? tocEl.querySelectorAll('a') : [];
        links && links.forEach(l=>l.classList.remove('active'));
        const a = map.get(id); if (a) { a.classList.add('active'); centerActive(a); const group=a.closest('.toc-group'); if (group && group.classList.contains('collapsed')) { group.classList.remove('collapsed'); const c=group.querySelector('.toc-caret'); c&&c.setAttribute('aria-expanded','true'); } }
      };
      let ticking=false; let lastRun=0;
      const onScroll = ()=>{
        const now = performance.now(); if (now-lastRun<16) return; lastRun=now;
        if (ticking) return; ticking=true;
        requestAnimationFrame(()=>{
          let current = headings[0];
          for (let i=0;i<headings.length;i++){
            const r = headings[i].getBoundingClientRect();
            if ((r.top - headerOff) <= 10) current = headings[i]; else break;
          }
          setActive(current && current.id);
          ticking=false;
        });
      };
      NS._tocScrollSync = onScroll;
      window.addEventListener('scroll', onScroll, { passive: true });
    };

    // Mobile TOC (phones) — منقول من المونوليث مع تحسينات طفيفة
    NS.setupMobileTOC = function(h2Headings){
      const isPhone = window.innerWidth < 768;
      const headerOff = NS.getHeaderOffset();
      const chip = document.getElementById('mobile-heading-chip');
      const mobileToc = document.getElementById('mobile-toc');
      const thumb = document.querySelector('.mobile-v-thumb');
      const track = document.querySelector('.mobile-v-track');
      const markersHost = document.getElementById('mobile-toc-markers');
      let labelsHost = document.getElementById('mobile-toc-labels');
      if (!labelsHost) {
        labelsHost = document.createElement('div');
        labelsHost.id = 'mobile-toc-labels';
        labelsHost.style.position = 'absolute';
        labelsHost.style.left = '0';
        labelsHost.style.top = '0';
        labelsHost.style.bottom = '0';
        labelsHost.style.width = '100%';
        labelsHost.style.pointerEvents = 'none';
        mobileToc?.querySelector('.mobile-v-rail')?.appendChild(labelsHost);
      }
      if (!chip) return;
      if (mobileToc) mobileToc.classList.remove('hidden');
      if (!isPhone || h2Headings.length === 0) { chip.classList.remove('is-visible'); chip.style.display = 'none'; return; }
      chip.style.display = 'block';

      const currentIndex = () => {
        let idx = 0;
        for (let i = 0; i < h2Headings.length; i++) {
          const r = h2Headings[i].getBoundingClientRect();
          if ((r.top - headerOff) <= 8) idx = i; else break;
        }
        return idx;
      };
      const setChip = (idx) => { chip.textContent = (h2Headings[idx].textContent || '').trim(); };
      let hideTimer = null; const showChip = () => { chip.classList.add('is-visible'); clearTimeout(hideTimer); hideTimer = setTimeout(()=>chip.classList.remove('is-visible'), 900); };
      setChip(currentIndex());

      const ensureMarkers = () => {
        if (!markersHost) return;
        markersHost.innerHTML = '';
        labelsHost && (labelsHost.innerHTML = '');
        for (let i = 0; i < h2Headings.length; i++) {
          const m = document.createElement('div'); m.className = 'mobile-v-marker'; m.dataset.index = String(i); markersHost.appendChild(m);
          const label = document.createElement('div'); label.className = 'mobile-v-label'; label.dataset.index = String(i); label.textContent = (h2Headings[i].textContent || '').trim(); labelsHost && labelsHost.appendChild(label);
        }
      };

      const positionMarkers = () => {
        if (!markersHost || !track) return;
        const tr = track.getBoundingClientRect();
        const docH = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const range = tr.height - 18;
        const markers = markersHost.querySelectorAll('.mobile-v-marker');
        h2Headings.forEach((h, i) => {
          const yDoc = Math.max(0, Math.min(docH, h.offsetTop));
          const ratio = docH ? (yDoc / docH) : 0;
          const y = 9 + ratio * range;
          const el = markers[i]; if (el) el.style.top = `${y}px`;
          const label = labelsHost?.querySelector(`.mobile-v-label[data-index="${i}"]`);
          if (label) label.style.top = `${y}px`;
        });
      };

      let ticking = false;
      const syncVisual = () => {
        const docH = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const progress = docH ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
        const tr = track?.getBoundingClientRect();
        if (tr && thumb) {
          const range = tr.height - 18;
          const y = progress * range;
          thumb.style.transform = `translateY(${y}px)`;
          const chipY = tr.top + y + 9; chip.style.top = `${chipY}px`; chip.style.transform = `translateY(-50%)`;
        }
        if (markersHost) {
          const idx = currentIndex();
          markersHost.querySelectorAll('.mobile-v-marker').forEach((m, i) => { m.classList.toggle('is-current', i === idx); });
          labelsHost?.querySelectorAll('.mobile-v-label').forEach((l, i) => { l.classList.toggle('is-current', i === idx); });
        }
      };

      let lastRun = 0;
      const onScroll = () => {
        const now = performance.now(); if (now - lastRun < 16) return; lastRun = now;
        if (!ticking) { window.requestAnimationFrame(() => { setChip(currentIndex()); syncVisual(); showChip(); ticking = false; }); ticking = true; }
      };
      window.removeEventListener('scroll', NS._mobileChipScroll);
      NS._mobileChipScroll = onScroll;
      window.addEventListener('scroll', onScroll, { passive: true });

      let dragging = false;
      const onStart = (e) => { dragging = true; chip.classList.add('is-visible'); mobileToc?.classList.add('dragging'); e.preventDefault(); handle(e); };
      const handle = (e) => {
        if (!dragging) return;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const tr = track?.getBoundingClientRect(); if (!tr) return;
        const y = Math.min(tr.bottom - 9, Math.max(tr.top + 9, clientY));
        const ratio = (y - (tr.top + 9)) / (tr.height - 18);
        const docH = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const target = ratio * docH;
        window.scrollTo({ top: target, behavior: 'auto' });
        syncVisual();
      };
      const onEnd = () => { dragging = false; mobileToc?.classList.remove('dragging'); showChip(); };
      chip.addEventListener('touchstart', onStart, { passive: false });
      chip.addEventListener('mousedown', onStart);
      thumb?.addEventListener('touchstart', onStart, { passive: false });
      thumb?.addEventListener('mousedown', onStart);
      track?.addEventListener('touchstart', onStart, { passive: false });
      track?.addEventListener('mousedown', onStart);
      window.addEventListener('touchmove', handle, { passive: false });
      window.addEventListener('mousemove', handle);
      window.addEventListener('touchend', onEnd, { passive: true });
      window.addEventListener('mouseup', onEnd);

      ensureMarkers();
      positionMarkers();
      syncVisual();

      let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { positionMarkers(); syncVisual(); }, 150); });
      chip.onclick = () => { const idx = currentIndex(); NS.scrollToHeading(h2Headings[idx]); };
    };
  })();
