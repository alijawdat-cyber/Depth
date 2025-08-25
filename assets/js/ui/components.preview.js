(function(){
  const NS = window.UIComponents; if (!NS) return;
  // DevicePreview: ترقية P0 (بدون تدوير + Fit + أجهزة + ثيم/تفضيلات + مزامنة)
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
    style.textContent = '.html-preview-wrapper{margin:1rem 0}.html-preview-toolbar{display:flex;gap:.5rem;margin:0 0 .5rem 0;flex-wrap:wrap}.html-preview-toolbar button,.html-preview-toolbar select,.html-preview-toolbar input[type="text"]{padding:.35rem .6rem;border:1px solid var(--border-primary);background:var(--bg-primary);color:var(--text-primary);border-radius:8px;cursor:pointer;font-size:.9rem}.html-preview-toolbar button.active{background:var(--primary);color:var(--text-inverse);border-color:var(--primary)}.html-preview-frame{padding:1rem;border:1px solid var(--border-primary);border-radius:12px;background:var(--bg-secondary)}';
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
  // EventBus بسيط لمزامنة الحالة بين معاينات الصفحة
  if (!window.UIComponentsPreviewBus){
    window.UIComponentsPreviewBus = (function(){
      const listeners = {};
      return {
        subscribe(type, fn){ (listeners[type]||(listeners[type]=new Set())).add(fn); return ()=>{ try{listeners[type].delete(fn);}catch(_){}}; },
        publish(type, payload){ const ls=listeners[type]; if (!ls) return; ls.forEach(fn=>{ try{ fn(payload); }catch(_){ } }); }
      };
    })();
  }
  const BUS = window.UIComponentsPreviewBus;

  // تحميل أجهزة من JSON
  let DEVICE_PRESETS = null;
  const loadPresets = async (assetFn) => {
    if (DEVICE_PRESETS) return DEVICE_PRESETS;
    try {
      const url = assetFn('assets/js/ui/device-presets.json');
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) { DEVICE_PRESETS = await res.json(); return DEVICE_PRESETS; }
    } catch(_) {}
    DEVICE_PRESETS = { devices: [ { id:'iphone16pm', label:'iPhone 16 Pro Max', category:'mobile', screenWidth:430, screenHeight:932, shellWidth:470, shellHeight:980, screenX:null, screenY:24 } ] };
    return DEVICE_PRESETS;
  };
    // محوّل للمسارات المطلقة مثل /logo.svg إلى مسارات مناسبة ضمن GitHub Pages
    const fixAbsoluteSrcs = (html, assetFn) => {
      try {
        return String(html).replace(/\s(src|href)=("|')\/(?!\/)([^"']+)(\2)/g, (m,attr,q,p1)=>` ${attr}=${q}${assetFn(p1)}${q}`);
      } catch(_) { return html; }
    };
    const getMetaOptions = (codeEl) => {
      const cls = String(codeEl.className||'');
      const out = {};
      try {
        const tokens = cls.split(/\s+/).filter(Boolean);
        tokens.forEach(t=>{ const m = t.match(/^(device|zoom):([^\s]+)$/i); if (m) out[m[1].toLowerCase()] = m[2]; });
      } catch(_){}
      try {
        const vi = codeEl.getAttribute('data-info')||codeEl.getAttribute('data-opts')||'';
        vi.split(/\s+/).forEach(p=>{ const m=p.match(/^(device|zoom)=(.+)$/i); if (m) out[m[1].toLowerCase()]=m[2]; });
      } catch(_){}
      return out;
    };

  htmlBlocks.forEach(async code => {
      const pre = code.parentElement; if (!pre) return; if (pre.closest('.html-preview-wrapper')) return;
  const raw = code.textContent || '';
  let safe = raw;
  try { if (window.DOMPurify) { safe = window.DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['div','span','img','button','a','p','h1','h2','h3','h4','h5','h6','ul','ol','li','form','input','label','section','article','nav','main','aside','header','footer','strong','em','small','hr','br','details','summary'], ALLOWED_ATTR: ['class','id','href','src','alt','title','type','role','aria-label','aria-expanded','aria-controls','placeholder','value','maxlength','inputmode','dir','target','rel','data-otp-submit','data-otp-resend','data-otp-timer','data-seconds','data-theme-toggle'], KEEP_CONTENT: true }); } } catch(_){ }
  // إذا التعقيم حذف هواي (أو ماكو تاغات)، رجّع للأصلي للمعاينة فقط
  let htmlForPreview = safe;
  if (!(/[<][a-z]/i.test(safe)) || safe.length < 20) htmlForPreview = raw;
  // include: إذا الكود يحتوي توجيه <!-- include: path --> نحمّل الملف ونستبدل المحتوى
  let includePath = '';
  try {
    const inc = (raw.match(/<!--\s*include:\s*([^\s]+)\s*-->/i) || [])[1] || '';
    if (inc) includePath = inc.trim();
  } catch(_){ }
  if (includePath){
    try {
      const url = asset(includePath.replace(/^\//,''));
      const res = await fetch(url, { cache:'no-store' });
      if (res.ok) {
        const txt = await res.text();
        htmlForPreview = txt;
      }
    } catch(_){ }
  }
  // أصلح المسارات المطلقة
  htmlForPreview = fixAbsoluteSrcs(htmlForPreview, asset);
    const wrapper = document.createElement('div'); wrapper.className = 'html-preview-wrapper';
  const bar = document.createElement('div');
  bar.className = 'html-preview-toolbar';
  bar.innerHTML = '<button type="button" data-view="preview" class="active">معاينة</button><button type="button" data-view="code">الكود</button><button type="button" data-copy title="نسخ الكود">نسخ</button>';
    const device = document.createElement('div'); device.className = 'device-preview';
  const dt = document.createElement('div'); dt.className = 'device-toolbar';
  dt.innerHTML = '<div class="dt-group"><input type="text" class="dt-search" placeholder="بحث جهاز" style="min-width:120px"><select class="dt-device" aria-label="الجهاز"></select><button type="button" data-fit class="active">Fit</button></div><div class="dt-group"><button type="button" data-zoom-dec>-</button><button type="button" data-zoom-100>100%</button><button type="button" data-zoom-inc>+</button><button type="button" data-theme-mode title="ثيم">ثيم</button><button type="button" data-refresh>إعادة</button></div><div class="dt-info" aria-hidden="true">--×--</div>';
  const stageWrap = document.createElement('div'); stageWrap.className = 'device-stage-wrap';
  const stage = document.createElement('div'); stage.className = 'device-stage';
  // إطار الجهاز SVG
  const shell = document.createElement('img'); shell.className = 'device-shell'; shell.alt = 'Device frame';
  // اختيار مصدر الإطار: أولاً من preset.frameSrc إن توفر، وإلا اختر إطاراً عاماً حسب الفئة
  const pickShellSrc = (device) => {
    const d = device || {};
    if (d.frameSrc) return asset(String(d.frameSrc).replace(/^\//,''));
    const category = String(d.category || 'mobile').toLowerCase();
    const id = String(d.id || '').toLowerCase();
    const label = String(d.label || '').toLowerCase();
    if (category === 'desktop') return asset('assets/img/frames/desktop.svg');
    if (category === 'laptop') return asset('assets/img/frames/laptop.svg');
    if (category === 'tablet') return asset('assets/img/frames/ipad.svg');
    // mobile: Android إذا الاسم/id فيه Pixel أو Galaxy أو Android، وإلا iPhone
    const isAndroid = /pixel|galaxy|android/.test(id) || /pixel|galaxy|android/.test(label);
    if (isAndroid) return asset('assets/img/frames/android.svg');
    return asset('assets/img/frames/iphone.svg');
  };
  // لا تحمل إطاراً مبدئياً غير موجود؛ سنحدده بعد اختيار الجهاز
  shell.style.display = 'none';
  shell.onerror = ()=>{ /* إبقِه مخفياً إذا فشل التحميل */ };
  // عند تحميل صورة الإطار، أعد حساب الأبعاد وأظهر الصورة
  try { shell.addEventListener('load', ()=>{ try{ shell.style.display = 'block'; applyDims(); }catch(_){} }); } catch(_){ }
  const iframe = document.createElement('iframe'); iframe.className = 'device-viewport'; iframe.setAttribute('sandbox','allow-scripts allow-forms allow-same-origin');
  // fallback يظهر مباشرة إلى أن نتأكد أن الـiframe اشتغل
  const fb = document.createElement('div'); fb.className = 'html-fallback'; fb.setAttribute('data-theme','light'); fb.setAttribute('dir','rtl');
  fb.innerHTML = `<div class="screen-mockup">${htmlForPreview}</div>`;
  // اخفِ الـiframe بالبداية
  iframe.style.display = 'none';
  stage.appendChild(shell); stage.appendChild(iframe); stage.appendChild(fb); device.appendChild(dt); stageWrap.appendChild(stage); device.appendChild(stageWrap);
      const codeView = pre.cloneNode(true); codeView.style.display = 'none';
    pre.replaceWith(wrapper); wrapper.appendChild(bar); wrapper.appendChild(device); wrapper.appendChild(codeView);
  const userDevicePref = localStorage.getItem('depth.preview.device') || '';
  const userZoomPref = localStorage.getItem('depth.preview.zoom') || 'fit';
  const userThemePref = localStorage.getItem('depth.preview.theme') || 'sync';
  const meta = getMetaOptions(code) || {};
  let curDeviceId = (meta.device || userDevicePref || 'iphone16pm');
  let cur = null;
  let scaleMode = (meta.zoom || userZoomPref || 'fit');
  let scale = 1;
  let themeMode = userThemePref; // sync|light|dark
  // لا حاجة لطبقة نوتش/شريط حالة: نعتمد على إطار الـSVG الأصلي بعد رفع z-index
  const applyDims = ()=>{
        const screenW = cur.screenWidth;
        const screenH = cur.screenHeight;
        // استخدم أبعاد الإطار من الـpreset إن وجدت، وإلا من أبعاد صورة الـSVG الفعلية، وإلا افتراضياً نسبة إلى الشاشة
        let shellW = cur.shellWidth || 0;
        let shellH = cur.shellHeight || 0;
        try {
          if (!shellW || !shellH) {
            const nw = shell.naturalWidth || 0;
            const nh = shell.naturalHeight || 0;
            if (nw && nh) { shellW = nw; shellH = nh; }
          }
        } catch(_){}
        if (!shellW || !shellH) { shellW = (screenW + 40); shellH = (screenH + 80); }
        // ثبّت المتغيّرات للشاشة والإطار
        device.style.setProperty('--dp-width', screenW+'px');
        device.style.setProperty('--dp-height', screenH+'px');
        device.style.setProperty('--dp-shell-w', shellW+'px');
        device.style.setProperty('--dp-shell-h', shellH+'px');
        // إزاحة موضع الشاشة داخل الإطار
  const baseX = (cur.screenX==null ? (shellW - screenW)/2 : cur.screenX);
  const baseY = (cur.screenY==null ? ((shellH - screenH)/2) : cur.screenY);
  const offX = baseX;
  const offY = baseY;
        device.style.setProperty('--dp-screen-x', offX+'px');
        device.style.setProperty('--dp-screen-y', offY+'px');
        // Fit أو رقم
        const wrap = stageWrap.getBoundingClientRect();
        let nextScale = scale;
        if (String(scaleMode).toLowerCase() === 'fit') {
          const margin = 24;
          const maxW = Math.max(0, (wrap.width - margin));
          nextScale = Math.max(0.25, Math.min(1.5, maxW / shellW));
        }
  device.style.setProperty('--dp-scale', String(nextScale));
  // ثبّت ارتفاع الحاوية ليطابق الارتفاع المصغّر للإطار حتى لا يحدث قفز في التخطيط
  try {
    const scaledH = Math.round(shellH * nextScale);
    stageWrap.style.height = scaledH + 'px';
    stageWrap.style.minHeight = scaledH + 'px';
  } catch(_) {}
  // غيّر الإطار حسب الجهاز الحالي (فئة + id/label)
  try { shell.src = pickShellSrc(cur || { category:'mobile' }); } catch(_){ }
        const info = dt.querySelector('.dt-info'); if (info) { const z = Math.round(nextScale*100); info.textContent = `${screenW}×${screenH} @ ${z}%`; }
      };
      let resizeTimer; const onResize = ()=>{ clearTimeout(resizeTimer); resizeTimer = setTimeout(applyDims, 150); }; window.addEventListener('resize', onResize);
  const buildSrcDoc = (theme='light') => `<!doctype html><html lang="ar" dir="rtl" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="${asset('assets/css/custom-screens.css')}"><style>
  :root{ --ios-safe-top: 0px; }
  html,body{height:100%;margin:0;padding:0;overflow:hidden;-webkit-overflow-scrolling:touch;}
  body{background:var(--bg-primary);} 
  /* محتوى الشاشة: نضيف بادينغ علوي يساوي ارتفاع شريط الحالة ليبقى التطبيق أسفله دائمًا */
  .screen-mockup{margin:0!important;width:100%!important;max-width:none!important;height:100%!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:auto!important;padding-top:max(var(--ios-safe-top), env(safe-area-inset-top, 0px))!important;background-clip:padding-box;}
  .toast-container{position:fixed;inset:auto auto 12px 12px;}
  /* لا نستخدم صورة لشريط الحالة؛ الإطار يتكفّل بالحواف */
  </style></head><body>
  <div class="screen-mockup">${htmlForPreview}</div>
  <script src="${asset('assets/js/interactive-mockups.js')}"><\/script>
  <script>
  window.addEventListener('DOMContentLoaded',()=>{
    try{ window.Mockups && window.Mockups.init && window.Mockups.init(); }catch(e){}
  });
  <\/script>
  </body></html>`;
  const getDocTheme = ()=>{ if (themeMode==='sync') return (document.body && document.body.getAttribute('data-theme')) || 'light'; return themeMode || 'light'; };
  const loadFrame = (theme)=>{ iframe.srcdoc = buildSrcDoc(theme); };
  loadFrame(getDocTheme());
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
      // راقب تغيّر ثيم الصفحة وطبّقه إذا sync
      const bodyObserver = new MutationObserver(()=>{ if (themeMode!=='sync') return; try{ const doc = iframe.contentDocument; const html = doc && doc.documentElement; if (html) html.setAttribute('data-theme', getDocTheme()); }catch(_){} });
      try { bodyObserver.observe(document.body, { attributes:true, attributeFilter:['data-theme'] }); } catch(_){}

      // حضّر قائمة الأجهزة وبحثها
      const deviceSelect = dt.querySelector('.dt-device');
      const deviceSearch = dt.querySelector('.dt-search');
      const populateDevices = (list)=>{ if (!deviceSelect) return; deviceSelect.innerHTML=''; list.forEach(d=>{ const o=document.createElement('option'); o.value=d.id; o.textContent=d.label; deviceSelect.appendChild(o); }); if (curDeviceId) deviceSelect.value = curDeviceId; };
      try {
        const presets = await loadPresets(asset);
        const devices = (presets && Array.isArray(presets.devices)) ? presets.devices : [];
        const applyFilter = ()=>{ const q=String(deviceSearch.value||'').toLowerCase(); const l=!q?devices:devices.filter(d=> d.label.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || String(d.category||'').toLowerCase().includes(q)); populateDevices(l); };
        if (deviceSearch) deviceSearch.addEventListener('input', applyFilter);
        applyFilter();
        const found = devices.find(d=> d.id===curDeviceId) || devices[0];
        curDeviceId = found ? found.id : 'iphone16pm';
        cur = found || { id:'iphone16pm', label:'iPhone 16 Pro Max', category:'mobile', screenWidth:430, screenHeight:932, shellWidth:470, shellHeight:980, screenX:null, screenY:24 };
      } catch(_) { cur = { id:'iphone16pm', label:'iPhone 16 Pro Max', category:'mobile', screenWidth:430, screenHeight:932, shellWidth:470, shellHeight:980, screenX:null, screenY:24 }; }

      // تهيئة Fit/Zoom أولية
      if (String(scaleMode).toLowerCase()!=='fit') { const num=parseFloat(String(scaleMode)); if (!isNaN(num)&&isFinite(num)) scale=num; else scaleMode='fit'; }
      applyDims();

      // ثيم fallback
      try { fb && fb.setAttribute('data-theme', getDocTheme()); } catch(_){}

      // أدوات التفاعل + مزامنة عبر Bus
      const setDeviceById = (id, broadcast=true)=>{ if (!id) return; curDeviceId=id; localStorage.setItem('depth.preview.device', curDeviceId); try{ const all=DEVICE_PRESETS && DEVICE_PRESETS.devices?DEVICE_PRESETS.devices:[]; const d=all.find(x=>x.id===id); if (d) cur=d; }catch(_){} applyDims(); if (broadcast) BUS.publish('device',{id:curDeviceId}); };
      const setZoomMode = (modeOrNumber, broadcast=true)=>{ const s=String(modeOrNumber).toLowerCase(); if (s==='fit'){ scaleMode='fit'; localStorage.setItem('depth.preview.zoom','fit'); } else { let num=parseFloat(s); if (!isNaN(num)&&isFinite(num)){ scaleMode='number'; scale=num; localStorage.setItem('depth.preview.zoom', String(num)); } else { scaleMode='fit'; localStorage.setItem('depth.preview.zoom','fit'); } } applyDims(); if (broadcast) BUS.publish('zoom', { mode: scaleMode, scale }); };
      const setThemeMode = (mode, broadcast=true)=>{ themeMode=mode; localStorage.setItem('depth.preview.theme', themeMode); try{ const doc=iframe.contentDocument; const html=doc&&doc.documentElement; if (html) html.setAttribute('data-theme', getDocTheme()); }catch(_){} try{ fb && fb.setAttribute('data-theme', getDocTheme()); }catch(_){} if (broadcast) BUS.publish('theme', { mode: themeMode, value: getDocTheme() }); };

      const unsubDevice = BUS.subscribe('device', (p)=>{ if (!p||p.id===curDeviceId) return; setDeviceById(p.id, false); if (deviceSelect) deviceSelect.value=p.id; });
      const unsubZoom = BUS.subscribe('zoom', (p)=>{ if (!p) return; if (p.mode==='fit') setZoomMode('fit', false); else if (typeof p.scale==='number'){ scale=p.scale; scaleMode='number'; applyDims(); } });
      const unsubTheme = BUS.subscribe('theme', (p)=>{ if (!p) return; if (themeMode==='sync'){ try{ const doc=iframe.contentDocument; const html=doc&&doc.documentElement; if (html) html.setAttribute('data-theme', getDocTheme()); fb && fb.setAttribute('data-theme', getDocTheme()); }catch(_){} } });

      dt.addEventListener('click', (e)=>{
        const b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-fit')){ setZoomMode('fit'); return; }
        if (b.hasAttribute('data-zoom-100')){ setZoomMode(1); return; }
        if (b.hasAttribute('data-zoom-inc')){ if (String(scaleMode).toLowerCase()==='fit'){ scale=1; scaleMode='number'; } scale = Math.min(1.5, (Math.round((scale+0.1)*100)/100)); applyDims(); localStorage.setItem('depth.preview.zoom', String(scale)); BUS.publish('zoom', { mode:'number', scale }); return; }
        if (b.hasAttribute('data-zoom-dec')){ if (String(scaleMode).toLowerCase()==='fit'){ scale=1; scaleMode='number'; } scale = Math.max(0.25, (Math.round((scale-0.1)*100)/100)); applyDims(); localStorage.setItem('depth.preview.zoom', String(scale)); BUS.publish('zoom', { mode:'number', scale }); return; }
        if (b.hasAttribute('data-theme-mode')){ themeMode = (themeMode==='sync') ? 'light' : (themeMode==='light' ? 'dark' : 'sync'); setThemeMode(themeMode); return; }
        if (b.hasAttribute('data-refresh')){ const theme = getDocTheme(); loadFrame(theme); return; }
      });
      if (deviceSelect) deviceSelect.addEventListener('change', (e)=>{ const id = e.target && e.target.value; setDeviceById(id); });
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
  // بث الحالة المبدئية
  try { BUS.publish('device', { id: curDeviceId }); if (String(scaleMode).toLowerCase()==='fit') BUS.publish('zoom', { mode:'fit' }); else BUS.publish('zoom', { mode:'number', scale }); BUS.publish('theme', { mode: themeMode, value: getDocTheme() }); } catch(_){}
  // تنظيف عند إزالة المعاينة
  try { const ro = new MutationObserver(()=>{ if (!document.body.contains(wrapper)) { window.removeEventListener('resize', onResize); } }); ro.observe(document.body, { childList:true, subtree:true }); } catch(_){}
      try { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); } catch(_) {}
    });
  };
})();
