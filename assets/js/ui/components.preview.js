(function(){
  const NS = window.UIComponents; if (!NS) return;
  // نقل منطق DevicePreview (iframe sandbox) مع شريط الأدوات والزوم والتدوير
  NS.enhanceHtmlPreviews = function(rootEl){
    const root = rootEl || document.getElementById('doc-content');
    if (!root) return;
    const htmlBlocks = Array.from(root.querySelectorAll('pre > code')).filter(code => {
      const cls = (code.className || '').toLowerCase();
      return cls.includes('language-html') || cls.includes('lang-html');
    });
    if (!htmlBlocks.length) return;
    const STYLE_ID = 'html-preview-styles';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = '.html-preview-wrapper{margin:1rem 0}.html-preview-toolbar{display:flex;gap:.5rem;margin:0 0 .5rem 0}.html-preview-toolbar button{padding:.35rem .6rem;border:1px solid var(--border-primary);background:var(--bg-primary);color:var(--text-primary);border-radius:8px;cursor:pointer;font-size:.9rem}.html-preview-toolbar button.active{background:var(--primary);color:var(--text-inverse);border-color:var(--primary)}.html-preview-frame{padding:1rem;border:1px solid var(--border-primary);border-radius:12px;background:var(--bg-secondary)}';
      document.head.appendChild(style);
    }
    // مولّد رابط أصول آمن للمسارات الفرعية (GitHub Pages وغيرها)
  const asset = (p) => {
      try {
    const loc = window.location;
    const path = (loc.pathname || '/').replace(/index\.html?$/,'');
    const base = path.endsWith('/') ? path : path + '/';
    const full = base + String(p).replace(/^\//,'');
    return new URL(full, loc.origin).href;
      } catch (_) { return p; }
    };
    // تأكد من تحميل CSS إطار الجهاز
    (function(){
      const id = 'preview-frame-css';
      if (!document.getElementById(id)){
        const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet'; l.href = asset('assets/css/preview-frame.css');
        document.head.appendChild(l);
      }
    })();
    const presets = { iphone14: { w: 390, h: 844 } };
    htmlBlocks.forEach(code => {
      const pre = code.parentElement; if (!pre) return; if (pre.closest('.html-preview-wrapper')) return;
      const raw = code.textContent || '';
      let safe = raw;
      try { if (window.DOMPurify) { safe = window.DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','img','button','a','p','h1','h2','h3','h4','h5','h6','ul','ol','li','form','input','label','section','article','nav','main','aside','header','footer','strong','em','small','hr','br','details','summary'], ALLOWED_ATTR: ['class','id','href','src','alt','title','type','role','aria-label','aria-expanded','aria-controls','placeholder','value','maxlength','inputmode','dir','target','rel','data-otp-submit','data-otp-resend','data-otp-timer','data-seconds','data-theme-toggle'], KEEP_CONTENT: true }); } } catch(_){ }
      const wrapper = document.createElement('div'); wrapper.className = 'html-preview-wrapper';
  const bar = document.createElement('div');
  bar.className = 'html-preview-toolbar';
  bar.innerHTML = '<button type="button" data-view="preview" class="active">معاينة</button><button type="button" data-view="code">الكود</button><button type="button" data-copy title="نسخ الكود">نسخ</button>';
      const device = document.createElement('div'); device.className = 'device-preview';
      const dt = document.createElement('div'); dt.className = 'device-toolbar'; dt.innerHTML = '<div class="dt-group"><button type="button" data-device="iphone14" class="active">iPhone 14</button><button type="button" data-rotate>↻ تدوير</button></div><div class="dt-group"><button type="button" data-zoom="0.33" class="active">×3</button><button type="button" data-zoom="0.5">50%</button><button type="button" data-theme>ثيم</button><button type="button" data-refresh>إعادة</button></div><div class="dt-info" aria-hidden="true">390×844</div>';
      const stage = document.createElement('div'); stage.className = 'device-stage';
  const iframe = document.createElement('iframe'); iframe.className = 'device-viewport'; iframe.setAttribute('sandbox','allow-scripts allow-forms allow-same-origin');
      stage.appendChild(iframe); device.appendChild(dt); device.appendChild(stage);
      const codeView = pre.cloneNode(true); codeView.style.display = 'none';
      pre.replaceWith(wrapper); wrapper.appendChild(bar); wrapper.appendChild(device); wrapper.appendChild(codeView);
      let cur = { ...presets.iphone14 }; let rot = false; let scale = 0.33;
      const applyDims = ()=>{ device.style.setProperty('--dp-width', (rot?cur.h:cur.w)+'px'); device.style.setProperty('--dp-height', (rot?cur.w:cur.h)+'px'); device.style.setProperty('--dp-scale', String(scale)); const info = dt.querySelector('.dt-info'); if (info) info.textContent = `${rot?cur.h:cur.w}×${rot?cur.w:cur.h}`; };
      applyDims();
  const buildSrcDoc = (theme='light') => `<!doctype html><html lang="ar" dir="rtl" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${asset('assets/css/custom-screens.css')}"><style>html,body{height:100%;margin:0;overflow:auto;-webkit-overflow-scrolling:touch;} body{background:var(--bg-primary);} .toast-container{position:fixed;inset:auto auto 12px 12px;}</style></head><body><div class="screen-mockup">${safe}</div><script src="${asset('assets/js/interactive-mockups.js')}"><\/script><script>window.addEventListener('DOMContentLoaded',()=>{ try{ window.Mockups && window.Mockups.init && window.Mockups.init(); }catch(e){} });<\/script></body></html>`;
      const loadFrame = (theme='light')=>{ iframe.srcdoc = buildSrcDoc(theme); };
      loadFrame('light');
      // Fallback: إذا ما ظهر محتوى داخل الـiframe، نعرض HTML مباشر بنفس القياسات
      const installFallbackCheck = () => {
        try {
          iframe.addEventListener('load', () => {
            try {
              const doc = iframe.contentDocument;
              const hasSM = !!(doc && doc.body && doc.body.querySelector('.screen-mockup'));
              const hasAny = !!(doc && doc.body && doc.body.children && doc.body.children.length > 0);
              if (!hasSM && !hasAny) {
                // أنشئ حاوية fallback داخل الـstage
                const fb = document.createElement('div');
                fb.className = 'html-fallback';
                fb.innerHTML = `<div class="screen-mockup">${safe}</div>`;
                // أخفي الـiframe وخلي البديل ظاهر
                iframe.style.display = 'none';
                stage.appendChild(fb);
              }
            } catch(_) {}
          }, { once: false });
        } catch(_) {}
      };
      installFallbackCheck();
      dt.addEventListener('click', (e)=>{
        const b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-rotate')){ rot = !rot; applyDims(); return; }
        if (b.hasAttribute('data-device')){ dt.querySelectorAll('[data-device]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); cur = presets[b.dataset.device] || cur; applyDims(); return; }
        if (b.hasAttribute('data-zoom')){ dt.querySelectorAll('[data-zoom]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); scale = parseFloat(b.getAttribute('data-zoom'))||scale; applyDims(); return; }
        if (b.hasAttribute('data-theme')){ try{ const doc=iframe.contentDocument; const html=doc && doc.documentElement; const curT=html?.getAttribute('data-theme')||'light'; const next= curT==='light'?'dark':'light'; html && html.setAttribute('data-theme', next); }catch(_){} return; }
        if (b.hasAttribute('data-refresh')){ const doc = iframe.contentDocument; const theme = doc && doc.documentElement && doc.documentElement.getAttribute('data-theme') || 'light'; loadFrame(theme); return; }
      });
      bar.addEventListener('click', (e)=>{
        const btn = e.target.closest('button'); if (!btn) return;
        if (btn.hasAttribute('data-copy')){
          try {
            const codeEl = codeView.querySelector('code');
            const text = codeEl ? codeEl.innerText : '';
            if (text) navigator.clipboard.writeText(text);
            btn.textContent = 'تم!';
            setTimeout(()=>{ btn.textContent = 'نسخ'; }, 1000);
          } catch(_) {}
          return;
        }
        bar.querySelectorAll('button[data-view]').forEach(x=>x.classList.remove('active'));
        btn.classList.add('active');
        const v = btn.dataset.view;
        if (v==='code'){ device.style.display='none'; codeView.style.display='block'; }
        else { codeView.style.display='none'; device.style.display='block'; }
      });
      try { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); } catch(_) {}
    });
  };
})();
