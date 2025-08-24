(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.applyAOSAttributes = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const isMobile = window.innerWidth < 768; const isDesktop = window.innerWidth >= 1024;
    const ua = navigator.userAgent || ''; const isiPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1; const isIOS = (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) || isiPadOS; const isSafari = /^((?!chrome|android).)*safari/i.test(ua); const isIOSSafari = isIOS && isSafari;
    if (isIOSSafari) { NS.applyIOSAnimations && NS.applyIOSAnimations(root); return; }
    if (!window.AOS) return;
    root.querySelectorAll('[data-aos]').forEach(el => { el.removeAttribute('data-aos'); el.removeAttribute('data-aos-duration'); el.removeAttribute('data-aos-delay'); el.removeAttribute('data-aos-anchor-placement'); });
    if (isMobile) {
      root.querySelectorAll('h1, h2').forEach((el,i)=>{ el.setAttribute('data-aos','fade-right'); el.setAttribute('data-aos-duration','500'); el.setAttribute('data-aos-delay',`${i*30}`); el.setAttribute('data-aos-offset','30'); });
      root.querySelectorAll('h3, h4').forEach(el=>{ el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-duration','400'); });
      root.querySelectorAll('p').forEach((el,i)=>{ el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-duration','400'); el.setAttribute('data-aos-delay',`${Math.min(i*20,200)}`); el.setAttribute('data-aos-anchor-placement','top-bottom'); });
      root.querySelectorAll('ul, ol').forEach(el=>{ el.setAttribute('data-aos','fade-left'); el.setAttribute('data-aos-duration','450'); });
      root.querySelectorAll('.table-wrap').forEach(el=>{ el.setAttribute('data-aos','zoom-in-up'); el.setAttribute('data-aos-duration','400'); });
      root.querySelectorAll('pre').forEach(el=>{ el.setAttribute('data-aos','flip-left'); el.setAttribute('data-aos-duration','500'); });
      root.querySelectorAll('img, figure').forEach(el=>{ el.setAttribute('data-aos','zoom-in-up'); el.setAttribute('data-aos-duration','450'); });
      root.querySelectorAll('blockquote').forEach(el=>{ el.setAttribute('data-aos','fade-left'); el.setAttribute('data-aos-duration','450'); });
    } else if (isDesktop) {
      root.querySelectorAll('h1').forEach(el=>{ el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-duration','700'); });
      root.querySelectorAll('h2').forEach((el,i)=>{ el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-duration','600'); el.setAttribute('data-aos-delay',`${i*50}`); });
      root.querySelectorAll('p').forEach((el,i)=>{ el.setAttribute('data-aos', i % 2 === 0 ? 'fade-left' : 'fade-right'); el.setAttribute('data-aos-duration','500'); el.setAttribute('data-aos-delay',`${i*30}`); });
      root.querySelectorAll('ul, ol').forEach(el=>{ el.setAttribute('data-aos','fade-left'); el.setAttribute('data-aos-duration','600'); el.setAttribute('data-aos-anchor-placement','center-bottom'); });
      root.querySelectorAll('.table-wrap').forEach(el=>{ el.setAttribute('data-aos','zoom-in'); el.setAttribute('data-aos-duration','500'); });
      root.querySelectorAll('pre').forEach(el=>{ el.setAttribute('data-aos','flip-up'); el.setAttribute('data-aos-duration','600'); });
      root.querySelectorAll('img, figure').forEach(el=>{ el.setAttribute('data-aos','zoom-in-up'); el.setAttribute('data-aos-duration','700'); });
      root.querySelectorAll('blockquote').forEach(el=>{ el.setAttribute('data-aos','fade-left'); el.setAttribute('data-aos-duration','600'); });
    } else {
      root.querySelectorAll('h1, h2, h3, h4, p, ul, ol, blockquote, .table-wrap, pre, img, figure').forEach(el=>{ el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-duration','500'); });
    }
    try { window.AOS.refresh(); } catch(_) {}
  };
  NS.applyIOSAnimations = function(root){
    const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches; if (reduceMotion) { root.querySelectorAll('h1, h2, p, ul, ol, .table-wrap, pre').forEach(el => { el.style.visibility = ''; }); return; }
    const opts = { root: null, rootMargin: '0px 0px -10% 0px', threshold: [0.1, 0.5, 1.0] };
    const animate = (el, cls, delay = 0) => { el.style.visibility = 'hidden'; setTimeout(() => { el.classList.add(cls); el.style.visibility = 'visible'; }, delay); };
    const io = new IntersectionObserver((entries) => { entries.forEach(entry => { if (!entry.isIntersecting || entry.intersectionRatio < 0.1) return; const el = entry.target; const a = el.dataset.iosAnimation; const d = parseInt(el.dataset.iosDelay || '0', 10); if (a && !el.classList.contains(a)) animate(el, a, d); io.unobserve(el); }); }, opts);
    root.querySelectorAll('h1').forEach(el => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-bounce'; el.dataset.iosDelay = '0'; io.observe(el); });
    root.querySelectorAll('h2').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-up'; el.dataset.iosDelay = String(i * 50); io.observe(el); });
    root.querySelectorAll('p').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = (i % 2 === 0 ? 'ios-animate-right' : 'ios-animate-left'); el.dataset.iosDelay = String(Math.min(i * 30, 200)); io.observe(el); });
    root.querySelectorAll('ul, ol').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-zoom'; el.dataset.iosDelay = String(i * 40); io.observe(el); });
    root.querySelectorAll('.table-wrap').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-flip'; el.dataset.iosDelay = String(i * 60); io.observe(el); });
    root.querySelectorAll('pre').forEach((el, i) => { el.style.visibility = 'hidden'; el.dataset.iosAnimation = 'ios-animate-bounce'; el.dataset.iosDelay = String(i * 50); io.observe(el); });
  };
})();
