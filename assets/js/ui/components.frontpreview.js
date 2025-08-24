(function(){
  const NS = window.UIComponents; if (!NS) return;
  // User Flows & Frontend Preview Enhancer
  NS.enhanceUserFlowsAndFrontPreview = function(rootEl, path=''){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const isFrontend = /06-frontend\//.test(path) || /frontend|واجهات|واجهة/i.test(root.textContent||'');

    // Viewport toolbar
    const ensureToolbar = () => {
      if (root.querySelector('.viewport-toolbar')) return;
      const tb = document.createElement('div');
      tb.className = 'viewport-toolbar';
      tb.innerHTML = '<span class="vp-label">Viewport:</span>'+
                     '<button data-vp="mobile">Mobile</button>'+
                     '<button data-vp="tablet">Tablet</button>'+
                     '<button data-vp="desktop">Desktop</button>'+
                     '<button data-vp="full" class="active">Full</button>';
      const host = root.querySelector('h1') || root.firstChild;
      if (host) host.after(tb); else root.prepend(tb);
      tb.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-vp]'); if (!b) return;
        tb.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        const mode = b.getAttribute('data-vp');
        if (mode === 'full') root.removeAttribute('data-vp'); else root.setAttribute('data-vp', mode);
      });
    };
    ensureToolbar();

    // Device frames via alt markers
    const figures = Array.from(root.querySelectorAll('figure.md-figure, img.md-image, img'));
    figures.forEach(el => {
      const img = el.tagName.toLowerCase() === 'img' ? el : el.querySelector('img'); if (!img) return;
      const alt = (img.getAttribute('alt')||'').toLowerCase(); let type=null;
      if (alt.includes('[mobile]')) type='mobile'; else if (alt.includes('[tablet]')) type='tablet'; else if (alt.includes('[desktop]')) type='desktop';
      if (!type) return;
      const currentFrame = el.closest('.device-frame'); if (currentFrame) { currentFrame.classList.add('viewport-target'); return; }
      const frame = document.createElement('div'); frame.className = `device-frame device-${type} viewport-target`;
      if (el.tagName.toLowerCase() === 'figure') { el.parentNode.insertBefore(frame, el); frame.appendChild(el); }
      else { img.parentNode.insertBefore(frame, img); frame.appendChild(img); }
    });

    // Flow steps: lists of images become steps
    const lists = Array.from(root.querySelectorAll('ol, ul'));
    lists.forEach(list => {
      const items = Array.from(list.children); if (!items.length) return;
      const ok = items.every(li => li.querySelector('img, figure, .md-figure')); if (!ok) return;
      list.classList.add('flow-steps');
      items.forEach((li, idx) => {
        li.classList.add('flow-step');
        const n = document.createElement('div'); n.className = 'flow-step-num'; n.textContent = String(idx+1); li.prepend(n);
        const img = li.querySelector('img'); if (img && !img.closest('.flow-thumb')) { const wrap = document.createElement('div'); wrap.className='flow-thumb'; img.parentNode.insertBefore(wrap, img); wrap.appendChild(img); }
      });
    });

    if (isFrontend && !root.hasAttribute('data-vp')) root.setAttribute('data-vp','desktop');
  };
})();
