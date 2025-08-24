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
  const presets = { iphone16pm: { w: 430, h: 932, shellW: 470, shellH: 980, screenX: null, screenY: 24 } };
    // محوّل للمسارات المطلقة مثل /logo.svg إلى مسارات مناسبة ضمن GitHub Pages
    const fixAbsoluteSrcs = (html, assetFn) => {
      try {
        return String(html).replace(/\s(src|href)=("|')\/(?!\/)([^"']+)(\2)/g, (m,attr,q,p1)=>` ${attr}=${q}${assetFn(p1)}${q}`);
      } catch(_) { return html; }
    };
    htmlBlocks.forEach(code => {
      const pre = code.parentElement; if (!pre) return; if (pre.closest('.html-preview-wrapper')) return;
  const raw = code.textContent || '';
  let safe = raw;
  try { if (window.DOMPurify) { safe = window.DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','img','button','a','p','h1','h2','h3','h4','h5','h6','ul','ol','li','form','input','label','section','article','nav','main','aside','header','footer','strong','em','small','hr','br','details','summary'], ALLOWED_ATTR: ['class','id','href','src','alt','title','type','role','aria-label','aria-expanded','aria-controls','placeholder','value','maxlength','inputmode','dir','target','rel','data-otp-submit','data-otp-resend','data-otp-timer','data-seconds','data-theme-toggle'], KEEP_CONTENT: true }); } } catch(_){ }
  // إذا التعقيم حذف هواي (أو ماكو تاغات)، رجّع للأصلي للمعاينة فقط
  let htmlForPreview = safe;
  if (!(/[<][a-z]/i.test(safe)) || safe.length < 20) htmlForPreview = raw;
  // أصلح المسارات المطلقة
  htmlForPreview = fixAbsoluteSrcs(htmlForPreview, asset);
      const wrapper = document.createElement('div'); wrapper.className = 'html-preview-wrapper';
  const bar = document.createElement('div');
  bar.className = 'html-preview-toolbar';
  bar.innerHTML = '<button type="button" data-view="preview" class="active">معاينة</button><button type="button" data-view="code">الكود</button><button type="button" data-copy title="نسخ الكود">نسخ</button>';
      const device = document.createElement('div'); device.className = 'device-preview';
  const dt = document.createElement('div'); dt.className = 'device-toolbar'; dt.innerHTML = '<div class="dt-group"><button type="button" data-device="iphone16pm" class="active">iPhone 16 Pro Max</button><button type="button" data-rotate>↻ تدوير</button></div><div class="dt-group"><button type="button" data-zoom="0.25">25%</button><button type="button" data-zoom="0.33">33%</button><button type="button" data-zoom="0.5">50%</button><button type="button" data-zoom="0.67">67%</button><button type="button" data-zoom="0.75" class="active">75%</button><button type="button" data-zoom="1">100%</button><button type="button" data-zoom="1.25">125%</button><button type="button" data-theme>ثيم</button><button type="button" data-refresh>إعادة</button></div><div class="dt-info" aria-hidden="true">430×932</div>';
  const stageWrap = document.createElement('div'); stageWrap.className = 'device-stage-wrap';
  const stage = document.createElement('div'); stage.className = 'device-stage';
  // إطار آيفون SVG
  const shell = document.createElement('img'); shell.className = 'iphone-shell'; shell.alt = 'iPhone frame'; shell.src = asset('assets/img/iPhone 16 Pro Max White Titanium.svg');
  shell.onerror = ()=>{ shell.style.display = 'none'; };
  const iframe = document.createElement('iframe'); iframe.className = 'device-viewport'; iframe.setAttribute('sandbox','allow-scripts allow-forms allow-same-origin');
  // fallback يظهر مباشرة إلى أن نتأكد أن الـiframe اشتغل
  const fb = document.createElement('div'); fb.className = 'html-fallback'; fb.setAttribute('data-theme','light'); fb.setAttribute('dir','rtl');
  fb.innerHTML = `<div class="screen-mockup">${htmlForPreview}</div>`;
  // اخفِ الـiframe بالبداية
  iframe.style.display = 'none';
  stage.appendChild(shell); stage.appendChild(iframe); stage.appendChild(fb); device.appendChild(dt); stageWrap.appendChild(stage); device.appendChild(stageWrap);
      const codeView = pre.cloneNode(true); codeView.style.display = 'none';
      pre.replaceWith(wrapper); wrapper.appendChild(bar); wrapper.appendChild(device); wrapper.appendChild(codeView);
  let cur = { ...presets.iphone16pm }; let rot = false; let scale = 0.75;
  // لا حاجة لطبقة نوتش/شريط حالة: نعتمد على إطار الـSVG الأصلي بعد رفع z-index
  const applyDims = ()=>{
        const screenW = (rot?cur.h:cur.w);
        const screenH = (rot?cur.w:cur.h);
        const shellW = (rot?cur.shellH:cur.shellW);
        const shellH = (rot?cur.shellW:cur.shellH);
        // ثبّت المتغيّرات للشاشة والإطار
        device.style.setProperty('--dp-width', screenW+'px');
        device.style.setProperty('--dp-height', screenH+'px');
        device.style.setProperty('--dp-shell-w', shellW+'px');
        device.style.setProperty('--dp-shell-h', shellH+'px');
        // إزاحة موضع الشاشة داخل الإطار (نقلب الإحداثيات بالعرض/الارتفاع عند الدوران)
  // إذا screenX غير محدد، احسب تمحور الشاشة: (عرض الإطار - عرض الشاشة)/2
  const baseX = (cur.screenX==null ? (shellW - screenW)/2 : cur.screenX);
  const baseY = (cur.screenY==null ? 0 : cur.screenY);
  const offX = rot ? baseY : baseX;
  const offY = rot ? baseX : baseY;
        device.style.setProperty('--dp-screen-x', offX+'px');
        device.style.setProperty('--dp-screen-y', offY+'px');
        device.style.setProperty('--dp-scale', String(scale));
        device.classList.toggle('rotated', !!rot);
        const info = dt.querySelector('.dt-info'); if (info) info.textContent = `${screenW}×${screenH}`;
      };
      applyDims();
  const buildSrcDoc = (theme='light') => `<!doctype html><html lang="ar" dir="rtl" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${asset('assets/css/custom-screens.css')}"><style>
  html,body{height:100%;margin:0;padding:0;overflow:hidden;-webkit-overflow-scrolling:touch;}
  body{background:var(--bg-primary);} 
  .screen-mockup{margin:0!important;width:100%!important;max-width:none!important;height:100%!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:auto!important;}
  .toast-container{position:fixed;inset:auto auto 12px 12px;}
  /* شريط الحالة داخل الشاشة: ثابت أعلى، يسار/يمين بعيد عن النوتش */
  .statusbar{position:fixed;inset-inline:12px;top:14px;height:20px;display:flex;align-items:center;justify-content:space-between;gap:8px;color:#fff;z-index:9999;pointer-events:none;font:600 14px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-shadow:0 0 2px rgba(0,0,0,.6)}
  .statusbar .sb-left,.statusbar .sb-right{display:flex;align-items:center;gap:10px}
  .statusbar svg{display:block;height:14px;width:auto;filter:drop-shadow(0 0 1px rgba(0,0,0,.4))}
  @keyframes sb-blink{0%{opacity:1}50%{opacity:.2}100%{opacity:1}}
  .statusbar .colon{animation:sb-blink 1s steps(1,end) infinite}
  </style></head><body>
  <div class="statusbar" aria-hidden="true">
    <div class="sb-left"><span class="sb-time">--<span class="colon">:</span>--</span></div>
    <div class="sb-right">
      <span class="sb-signal"><svg viewBox="0 0 24 14" width="24" height="14"><g fill="#fff"><rect x="0" y="8" width="3" height="6" rx="1" opacity=".7"/><rect x="5" y="6" width="3" height="8" rx="1" opacity=".85"/><rect x="10" y="4" width="3" height="10" rx="1" opacity=".95"/><rect x="15" y="2" width="3" height="12" rx="1"/><rect x="20" y="0" width="3" height="14" rx="1"/></g></svg></span>
      <span class="sb-battery"><svg viewBox="0 0 28 14" width="28" height="14"><rect x="0.5" y="1.5" width="24" height="11" rx="2.5" stroke="#fff" fill="none"/><rect x="2.5" y="3.5" width="18" height="7" rx="1.5" fill="#fff"/><rect x="25.5" y="5" width="2" height="4" rx="1" fill="#fff"/></svg></span>
    </div>
  </div>
  <div class="screen-mockup">${htmlForPreview}</div>
  <script src="${asset('assets/js/interactive-mockups.js')}"><\/script>
  <script>
    (function(){
      function fmt(n){ return n<10 ? ('0'+n) : String(n); }
      function tick(){ try{
        var el = document.querySelector('.sb-time');
        if(!el) return;
        var d = new Date();
        el.innerHTML = fmt(d.getHours()) + '<span class="colon">:<\/span>' + fmt(d.getMinutes());
      }catch(e){}
      }
      tick(); setInterval(tick, 1000);
    })();
    window.addEventListener('DOMContentLoaded',()=>{ try{ window.Mockups && window.Mockups.init && window.Mockups.init(); }catch(e){} });
  <\/script>
  </body></html>`;
      const loadFrame = (theme='light')=>{ iframe.srcdoc = buildSrcDoc(theme); };
      loadFrame('light');
      // عند نجاح تحميل الـiframe وإثبات وجود محتوى، اخفِ fallback وأظهر الـiframe
      try {
        iframe.addEventListener('load', () => {
          try {
            const doc = iframe.contentDocument;
            const body = doc && doc.body;
            const ok = !!(body && (body.querySelector('.screen-mockup') || (body.innerHTML||'').trim().length > 10));
            if (ok) { fb.style.display = 'none'; iframe.style.display = 'block'; }
          } catch(_) {}
        });
      } catch(_) {}
      dt.addEventListener('click', (e)=>{
        const b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-rotate')){ rot = !rot; applyDims(); return; }
      if (b.hasAttribute('data-device')){ dt.querySelectorAll('[data-device]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); cur = presets[b.dataset.device] || cur; applyDims(); return; }
        if (b.hasAttribute('data-zoom')){ dt.querySelectorAll('[data-zoom]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); scale = parseFloat(b.getAttribute('data-zoom'))||scale; applyDims(); return; }
        if (b.hasAttribute('data-theme')){
          try{
            const doc=iframe.contentDocument; const html=doc && doc.documentElement; const curT=html?.getAttribute('data-theme')||'light'; const next= curT==='light'?'dark':'light';
            // طبّق على الـiframe إذا ظاهر
            html && html.setAttribute('data-theme', next);
            // وطبّق على الـfallback إذا ظاهر
            fb && fb.setAttribute('data-theme', next);
          }catch(_){}
          return;
        }
        if (b.hasAttribute('data-refresh')){ const doc = iframe.contentDocument; const theme = doc && doc.documentElement && doc.documentElement.getAttribute('data-theme') || fb.getAttribute('data-theme') || 'light'; loadFrame(theme); return; }
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
