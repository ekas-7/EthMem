// smartInjector.js - Smart Memory Injection
console.log('[SmartInjector] Loaded');

let enabled = true;
let processing = false;

function init() {
  console.log('[SmartInjector] Init');
  document.addEventListener('keydown', onKey, true);
  document.addEventListener('click', onClick, true);
}

async function onKey(e) {
  if (!enabled || processing || e.key !== 'Enter' || e.shiftKey) return;
  
  const el = e.target;
  if (el.getAttribute('contenteditable') !== 'true' && el.tagName !== 'TEXTAREA') return;
  
  const msg = el.tagName === 'TEXTAREA' ? el.value : el.innerText;
  if (!msg || !msg.trim()) return;
  
  console.log('[SmartInjector] Intercept');
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  await process(el, msg, () => {
    const evt = new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter', bubbles: true});
    el.dispatchEvent(evt);
  });
}

async function onClick(e) {
  if (!enabled || processing) return;
  
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const isSend = btn.getAttribute('data-testid')?.includes('send') || btn.type === 'submit';
  if (!isSend) return;
  
  const el = document.querySelector('[contenteditable="true"], textarea');
  if (!el) return;
  
  const msg = el.tagName === 'TEXTAREA' ? el.value : el.innerText;
  if (!msg || !msg.trim()) return;
  
  console.log('[SmartInjector] Intercept btn');
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  await process(el, msg, () => btn.click());
}

async function process(el, msg, send) {
  processing = true;
  
  try {
    const res = await ask(msg);
    
    if (res.success && res.injectionText) {
      console.log('[SmartInjector] Preparing invisible injection for', res.relevant.length, 'memories');
      
      // Store injection context globally so pageScript can access it
      window.__ETHMEM_INJECTION__ = {
        originalMessage: msg,
        injectionText: res.injectionText,
        timestamp: Date.now()
      };
      
      console.log('[SmartInjector] Injection stored, original message preserved');
      notify(res.relevant.length);
    } else {
      console.log('[SmartInjector] No memories to inject');
    }
    
    // IMPORTANT: Make sure the text field has ONLY the original message
    if (el.tagName === 'TEXTAREA') {
      el.value = msg;
    } else {
      el.innerText = msg;
    }
    
    // Wait a tiny bit to ensure UI is updated
    await sleep(50);
    
    // Now send - the original message will be visible but API will get context
    send();
  } catch (err) {
    console.error('[SmartInjector] Error:', err);
    send();
  } finally {
    processing = false;
  }
}

function ask(msg) {
  return new Promise((ok) => {
    window.postMessage({type: 'ETHMEM_SMART', payload: {userMessage: msg}}, '*');
    
    const h = (e) => {
      if (e.data.type === 'ETHMEM_SMART_RES') {
        window.removeEventListener('message', h);
        ok(e.data.payload);
      }
    };
    window.addEventListener('message', h);
    
    setTimeout(() => {
      window.removeEventListener('message', h);
      ok({success: false});
    }, 5000);
  });
}

function notify(n) {
  const d = document.createElement('div');
  d.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:16px;">🧠</span>
      <span>${n} ${n === 1 ? 'memory' : 'memories'} injected</span>
    </div>
  `;
  d.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;background:#111714;border:1px solid #38e078;color:#38e078;padding:12px 20px;border-radius:8px;font:600 14px system-ui,-apple-system,sans-serif;box-shadow:0 4px 12px rgba(56,224,120,0.3);animation:slideIn 0.3s ease-out';
  
  // Add keyframes if not exists
  if (!document.getElementById('ethmem-notify-style')) {
    const style = document.createElement('style');
    style.id = 'ethmem-notify-style';
    style.textContent = '@keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}';
    document.head.appendChild(style);
  }
  
  document.body.appendChild(d);
  
  setTimeout(() => {
    d.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => d.remove(), 300);
  }, 2500);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
