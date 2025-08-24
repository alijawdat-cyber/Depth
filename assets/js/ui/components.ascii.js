(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.enhanceAsciiDiagrams = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const isAsciiDiagram = (text, langClass) => {
      const t=(text||'').trim(); if (!t) return false; const lang=(langClass||'').toLowerCase(); if (/json|js|ts|html|css|sql|bash|sh|yaml|yml|mermaid|flow|graph|bash|shell/.test(lang)) return false;
      const BOX_RE = /[┌┐└┘├┤┬┴┼─│╭╮╯╰╱╲]/; const lines=t.split(/\r?\n/); if (lines.length < 3) return false; const hasBoxChars = BOX_RE.test(t); const longHoriz = lines.some(l => /[─\-]{6,}/.test(l)); return hasBoxChars || longHoriz;
    };
    const candidates = Array.from(root.querySelectorAll('pre > code'));
    candidates.forEach(code => { const pre = code.closest('pre'); if (!pre) return; if (pre.closest('.ascii-center') || pre.parentElement?.classList.contains('ascii-center')) return; const langClass = Array.from(code.classList).join(' '); const text = code.textContent || ''; if (!isAsciiDiagram(text, langClass)) return; const wrapper = document.createElement('div'); wrapper.className='ascii-center'; pre.parentNode.insertBefore(wrapper, pre); wrapper.appendChild(pre); });
  };
})();
