(function(){
  const NS = window.UIComponents; if (!NS) return;
  // نفس منطق UIComponents.enhanceCodeBlocks لكن كموديول مستقل يغطي على التعريف الأصلي
  NS.enhanceCodeBlocks = function(rootEl){
    const root = rootEl || document.getElementById('doc-content');
    if (!root) return;
    const blocks = root.querySelectorAll('pre > code');
    blocks.forEach(code => {
      const pre = code.parentElement;
      if (!pre || pre.querySelector('.code-copy-btn')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'نسخ');
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'copy');
      btn.appendChild(icon);
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(code.innerText);
          btn.classList.add('copied');
          btn.innerHTML = '<i data-lucide="check"></i>';
          if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i data-lucide="copy"></i>';
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
          }, 1200);
        } catch (_) { /* ignore */ }
      });
      pre.appendChild(btn);
    });
  };
})();
