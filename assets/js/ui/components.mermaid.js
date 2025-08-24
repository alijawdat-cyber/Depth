(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.upgradeMermaidViewers = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const diagrams = Array.from(root.querySelectorAll('.diagram.mermaid-diagram'));
    diagrams.forEach(diagram => {
      try {
        if (diagram.closest('.diagram-viewer')) return;
        const title = (diagram.getAttribute('data-title') || '').trim();
        const viewer = document.createElement('div'); viewer.className = 'diagram-viewer';
        const toolbar = document.createElement('div'); toolbar.className = 'diagram-toolbar'; toolbar.innerHTML = `
          <div class="dt-left"><div class="dt-title">${title || 'Diagram'}</div></div>
          <div class="dt-right">
            <button class="diagram-btn" data-zoom="out" aria-label="تصغير"><i data-lucide="zoom-out"></i></button>
            <button class="diagram-btn" data-zoom="in" aria-label="تكبير"><i data-lucide="zoom-in"></i></button>
            <button class="diagram-btn" data-fit aria-label="ملاءمة"><i data-lucide="maximize"></i></button>
            <button class="diagram-btn" data-reset aria-label="إعادة"><i data-lucide="rotate-ccw"></i></button>
          </div>`;

        const stage = document.createElement('div'); stage.className = 'diagram-stage';
        const content = document.createElement('div'); content.className = 'diagram-content';

        // Safest wrapping: insert viewer just before the diagram, then move diagram inside content
        const hostParent = diagram.parentNode;
        if (!hostParent) return;
        hostParent.insertBefore(viewer, diagram);
        content.appendChild(diagram);
        stage.appendChild(content);
        viewer.appendChild(toolbar);
        viewer.appendChild(stage);

        const captionText = diagram.getAttribute('alt') || '';
        if (captionText) {
          const cap = document.createElement('div');
          cap.className = 'diagram-caption';
          cap.textContent = captionText;
          viewer.appendChild(cap);
        }

        let scale = 1, tx = 0, ty = 0;
        const apply = () => { content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
        const fit = () => {
          try {
            const svg = content.querySelector('svg'); if (!svg) return;
            const vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
            const stageRect = stage.getBoundingClientRect();
            const svgW = isFinite(vb[2]) ? vb[2] : svg.clientWidth || 800;
            const svgH = isFinite(vb[3]) ? vb[3] : svg.clientHeight || 600;
            const sx = (stageRect.width - 24) / svgW;
            const sy = (stageRect.height - 24) / svgH;
            scale = Math.max(0.2, Math.min(1.2, Math.min(sx, sy)));
            tx = 12; ty = 12; apply();
          } catch (_) {}
        };
        const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };

        toolbar.addEventListener('click', (e) => {
          const btn = e.target.closest('button'); if (!btn) return;
          if (btn.hasAttribute('data-zoom')) {
            const dir = btn.getAttribute('data-zoom');
            scale = Math.max(0.2, Math.min(2.5, scale * (dir === 'in' ? 1.2 : 1/1.2)));
            apply();
          } else if (btn.hasAttribute('data-fit')) {
            fit();
          } else if (btn.hasAttribute('data-reset')) {
            reset();
          }
        });

        let dragging = false; let sx = 0, sy = 0, ox = 0, oy = 0;
        const start = (clientX, clientY) => { dragging = true; viewer.classList.add('dragging'); sx = clientX; sy = clientY; ox = tx; oy = ty; };
        const move = (clientX, clientY) => { if (!dragging) return; tx = ox + (clientX - sx); ty = oy + (clientY - sy); apply(); };
        const end = () => { dragging = false; viewer.classList.remove('dragging'); };
        stage.addEventListener('mousedown', (e) => { if (e.button !== 0) return; start(e.clientX, e.clientY); e.preventDefault(); });
        window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
        window.addEventListener('mouseup', end);
        stage.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (!t) return; start(t.clientX, t.clientY); }, { passive: true });
        window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (!t) return; move(t.clientX, t.clientY); }, { passive: true });
        window.addEventListener('touchend', end, { passive: true });

        setTimeout(fit, 30);
      } catch (err) {
        // Surface errors to console for debugging but don't break the page
        try { console.warn('[mermaid-viewer] failed to upgrade diagram:', err); } catch (_) {}
      }
    });
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  };
})();
