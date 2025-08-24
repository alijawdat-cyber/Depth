(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.enhanceFlowLinks = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const blocks = Array.from(root.querySelectorAll('pre > code.language-flowmap, pre > code.language-flow, pre > code.language-graph'));
    if (!blocks.length) return;
    let layer = root.querySelector('.flow-connector-layer');
    if (!layer) { layer = document.createElement('svg'); layer.className='flow-connector-layer'; layer.setAttribute('width','100%'); layer.setAttribute('height','0'); layer.setAttribute('viewBox','0 0 100 100'); layer.setAttribute('preserveAspectRatio','none'); root.appendChild(layer); }
    const pairs = [];
    blocks.forEach(code => {
      const text=(code.textContent||'').trim(); const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      lines.forEach(ln => { const m = ln.split(/\s*->\s*/); if (m.length!==2) return; pairs.push({ from: m[0], to: m[1] }); });
      const pre = code.closest('pre'); const box=document.createElement('div'); box.className='flow-links'; const title=document.createElement('div'); title.className='flow-links-title'; title.textContent='تدفق مترابط'; const list=document.createElement('div'); list.className='flow-links-list';
      pairs.forEach(p => { const a=document.createElement('a'); a.className='flow-link-chip'; const isCross=/\//.test(p.to) || /\//.test(p.from); const label=`${p.from} → ${p.to}`; a.textContent=label; if (isCross) { const href = p.to.startsWith('#') ? p.to : `#${p.to.replace(/^#/, '')}`; a.href = href; a.onclick = (e)=>{}; } else { a.href = '#'; a.addEventListener('click', (e)=>{ e.preventDefault(); const tgt = root.querySelector(p.to.startsWith('#')?p.to:`#${p.to}`); if (tgt) NS.scrollToHeading ? NS.scrollToHeading(tgt) : tgt.scrollIntoView({behavior:'smooth'}); }); }
        list.appendChild(a); });
      box.appendChild(title); box.appendChild(list); pre.replaceWith(box);
    });
    const computeAndDraw = () => {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      const hostRect = root.getBoundingClientRect(); const width = hostRect.width; const height = root.scrollHeight; layer.setAttribute('width', `${width}`); layer.style.height = `${height}px`; layer.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const defs = document.createElementNS('http://www.w3.org/2000/svg','defs'); const marker=document.createElementNS('http://www.w3.org/2000/svg','marker'); marker.setAttribute('id','arrowhead'); marker.setAttribute('orient','auto'); marker.setAttribute('markerWidth','8'); marker.setAttribute('markerHeight','6'); marker.setAttribute('refX','8'); marker.setAttribute('refY','3'); const path=document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d','M0,0 L8,3 L0,6 Z'); path.setAttribute('fill','currentColor'); marker.appendChild(path); defs.appendChild(marker); layer.appendChild(defs);
      const curPairs = pairs.filter(p => !(/[\/]/.test(p.from) || /[\/]/.test(p.to)));
      curPairs.forEach(p => { const fromEl = root.querySelector(p.from.startsWith('#')?p.from:`#${p.from}`); const toEl = root.querySelector(p.to.startsWith('#')?p.to:`#${p.to}`); if (!fromEl || !toEl) return; const fr=fromEl.getBoundingClientRect(); const tr=toEl.getBoundingClientRect(); const sx=(fr.right - hostRect.left); const sy=(fr.top - hostRect.top) + fr.height/2; const ex=(tr.right - hostRect.left); const ey=(tr.top - hostRect.top) + tr.height/2; const dx=(sx - ex); const c=Math.max(40, Math.min(160, Math.abs(dx) * 0.6)); const pathEl=document.createElementNS('http://www.w3.org/2000/svg','path'); pathEl.setAttribute('d', `M ${sx} ${sy} C ${sx - c} ${sy}, ${ex + c} ${ey}, ${ex} ${ey}`); pathEl.setAttribute('fill','none'); pathEl.setAttribute('stroke','var(--primary)'); pathEl.setAttribute('stroke-width','2'); pathEl.setAttribute('marker-end','url(#arrowhead)'); pathEl.setAttribute('opacity','0.7'); layer.appendChild(pathEl); });
    };
    const throttled = (()=>{ let raf=null; return ()=>{ if (raf) return; raf=requestAnimationFrame(()=>{ computeAndDraw(); raf=null; }); }; })();
    window.addEventListener('scroll', throttled, { passive: true }); window.addEventListener('resize', throttled); setTimeout(computeAndDraw, 80);
  };
})();
