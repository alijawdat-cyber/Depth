/* OTP & simple mockups interactivity */
(function(){
  function initOtp(root=document){
    const screens = root.querySelectorAll('.otp-screen');
    screens.forEach(screen => {
      const inputs = screen.querySelectorAll('.otp-inputs input');
      const submitBtn = screen.querySelector('.primary-btn');
      const timerEl = screen.querySelector('.timer [data-seconds]');
      let seconds = timerEl ? parseInt(timerEl.dataset.seconds||'0',10) : 0;

      // auto-advance
      inputs.forEach((inp, idx) => {
        inp.setAttribute('inputmode','numeric');
        inp.setAttribute('maxlength','1');
        inp.addEventListener('input', (e) => {
          const v = inp.value.replace(/[^0-9]/g,'');
          inp.value = v.slice(-1);
          if (inp.value && idx < inputs.length - 1) inputs[idx+1].focus();
          toggleSubmit();
        });
        inp.addEventListener('keydown', (e)=>{
          if(e.key==='Backspace' && !inp.value && idx>0){ inputs[idx-1].focus(); }
        });
        inp.addEventListener('paste', (e)=>{
          const txt=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'');
          if(!txt) return;
          e.preventDefault();
          for(let i=0;i<inputs.length;i++){ inputs[i].value = txt[i]||''; }
          inputs[Math.min(txt.length, inputs.length)-1].focus();
          toggleSubmit();
        });
      });

      function toggleSubmit(){
        const complete = Array.from(inputs).every(i=>i.value.length===1);
        if(submitBtn){ submitBtn.disabled = !complete; submitBtn.setAttribute('aria-disabled', String(!complete)); }
      }

      // timer
      const resendBtn = screen.querySelector('.resend-btn');
      if(seconds>0 && timerEl){
        resendBtn && resendBtn.setAttribute('disabled','true');
        const int = setInterval(()=>{
          seconds -= 1;
          if(seconds<=0){
            clearInterval(int);
            timerEl.textContent = '0';
            resendBtn && resendBtn.removeAttribute('disabled');
          } else {
            timerEl.textContent = String(seconds);
          }
        },1000);
      }

      // demo submit
      submitBtn && submitBtn.addEventListener('click', ()=>{
        const code = Array.from(inputs).map(i=>i.value||' ').join('');
        const out = screen.querySelector('.otp-output');
        if(out){ out.textContent = `الكود المدخل: ${code}`; }
      });

      // init state
      toggleSubmit();
    });
  }

  function initGallery(root=document){
    const galleries = root.querySelectorAll('.gallery');
    galleries.forEach(g => {
      const thumbs = g.querySelectorAll('.thumb');
      const main = g.querySelector('.gallery-main .current');
      const prev = g.querySelector('[data-prev]');
      const next = g.querySelector('[data-next]');
      let idx = 0;
      const set = (i) => {
        idx = (i+thumbs.length)%thumbs.length;
        thumbs.forEach((t, k)=> t.classList.toggle('active', k===idx));
        if (main) main.textContent = `صورة ${idx+1}`;
      };
      thumbs.forEach((t, i)=> t.addEventListener('click', ()=> set(i)));
      prev && prev.addEventListener('click', ()=> set(idx-1));
      next && next.addEventListener('click', ()=> set(idx+1));
      set(0);
    });
  }

  // expose
  window.Mockups = { initOtp, initGallery };
})();
