(function(){
  const NS = window.UIComponents; if (!NS) return;
  NS.enhanceJSONBlocks = function(rootEl){
    const root = rootEl || document.getElementById('doc-content'); if (!root) return;
    const codeBlocks = Array.from(root.querySelectorAll('pre > code'));
    const isLikelyJSON = (text, lang) => {
      const lower = (lang || '').toLowerCase(); if (lower.includes('json')) return true;
      const trimmed = (text || '').trim();
      const looks = (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'));
      if (!looks) return false; try { const hasQuotes = trimmed.includes('"') || trimmed.includes("'"); const hasColon = trimmed.includes(':'); const hasComma = trimmed.includes(',') || trimmed.length < 50; return hasQuotes || hasColon || hasComma; } catch { return false; }
    };
    const tryParse = (text) => { try { return { ok: true, value: JSON.parse(text) }; } catch (_) { return { ok: false }; } };
    const makeBadge = (label) => { const b=document.createElement('span'); b.className='json-badge'; b.textContent=label; return b; };
    const createNode = (key, value, depth = 0) => {
      const isObj = value && typeof value === 'object' && !Array.isArray(value);
      const isArr = Array.isArray(value);
      const hasChildren = (isObj && Object.keys(value).length) || (isArr && value.length);
      const node = document.createElement('div'); node.className = 'json-node';
      const row = document.createElement('div'); row.className = 'json-row';
      let caret = null; if (hasChildren) { caret = document.createElement('button'); caret.type='button'; caret.className='json-caret'; caret.setAttribute('aria-label','توسيع/طي'); row.appendChild(caret); } else { const spacer=document.createElement('span'); spacer.className='json-caret-spacer'; row.appendChild(spacer); }
      if (key !== null && key !== undefined) { const keyEl=document.createElement('span'); keyEl.className='json-key'; keyEl.textContent=String(key); row.appendChild(keyEl); const colon=document.createElement('span'); colon.className='json-colon'; colon.textContent=': '; row.appendChild(colon); }
      if (isObj) { const prev=document.createElement('span'); prev.className='json-preview'; const count=Object.keys(value).length; prev.appendChild(makeBadge('Object')); prev.appendChild(document.createTextNode(` { … ${count} keys }`)); row.appendChild(prev); }
      else if (isArr) { const prev=document.createElement('span'); prev.className='json-preview'; const count=value.length; prev.appendChild(makeBadge('Array')); prev.appendChild(document.createTextNode(` [ … ${count} items ]`)); row.appendChild(prev); }
      else { const val=document.createElement('span'); const t = value === null ? 'null' : typeof value; val.className = `json-value ${t}`; if (t==='string') val.textContent = `"${value}"`; else if (t==='number') val.textContent = String(value); else if (t==='boolean') val.textContent = value ? 'true' : 'false'; else if (t==='null') val.textContent='null'; else val.textContent = String(value); row.appendChild(val); }
      node.appendChild(row);
      if (hasChildren) { const children = document.createElement('div'); children.className = 'json-children'; const entries = isArr ? value.map((v,i)=>[i,v]) : Object.entries(value); entries.forEach(([k,v])=>{ children.appendChild(createNode(k,v,depth+1)); }); node.appendChild(children); const startCollapsed = depth >= 1; if (startCollapsed) node.classList.add('collapsed'); caret && caret.addEventListener('click', ()=>{ node.classList.toggle('collapsed'); }); }
      return node;
    };
    const buildViewer = (json, rawText) => {
      const wrap = document.createElement('div'); wrap.className='json-viewer';
      const bar = document.createElement('div'); bar.className='json-toolbar';
      const title = document.createElement('div'); title.className='json-title'; title.textContent = Array.isArray(json) ? 'JSON Array' : 'JSON Object'; bar.appendChild(title);
      const actions=document.createElement('div'); actions.className='json-actions';
      const mkBtn=(icon,label)=>{ const b=document.createElement('button'); b.type='button'; b.className='json-action'; b.setAttribute('aria-label',label); const i=document.createElement('i'); i.setAttribute('data-lucide',icon); b.appendChild(i); return b; };
      const btnExpand = mkBtn('chevrons-down-up','توسيع الكل'); const btnCollapse = mkBtn('chevrons-up-down','طي الكل'); const btnCopy = mkBtn('copy','نسخ JSON');
      actions.appendChild(btnExpand); actions.appendChild(btnCollapse); actions.appendChild(btnCopy); bar.appendChild(actions); wrap.appendChild(bar);
      const body = document.createElement('div'); body.className='json-body'; body.appendChild(createNode(null,json,0)); wrap.appendChild(body);
      btnExpand.addEventListener('click', ()=>{ body.querySelectorAll('.json-node.collapsed').forEach(n=>n.classList.remove('collapsed')); });
      btnCollapse.addEventListener('click', ()=>{ body.querySelectorAll('.json-node').forEach((n,idx)=>{ if (idx===0) return; n.classList.add('collapsed'); }); });
      btnCopy.addEventListener('click', async ()=>{ try { await navigator.clipboard.writeText(rawText); btnCopy.classList.add('copied'); btnCopy.innerHTML = '<i data-lucide="check"></i>'; if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); setTimeout(()=>{ btnCopy.classList.remove('copied'); btnCopy.innerHTML = '<i data-lucide="copy"></i>'; if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); }, 1200); } catch(_){} });
      return wrap;
    };
    codeBlocks.forEach(code => {
      const lang = (code.className || '').toLowerCase(); const text = code.textContent || '';
      if (!isLikelyJSON(text, lang)) return; const res = tryParse(text); if (!res.ok) return; const pre = code.closest('pre'); if (!pre) return;
      const viewer = buildViewer(res.value, JSON.stringify(res.value, null, 2)); pre.replaceWith(viewer);
    });
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  };
})();
