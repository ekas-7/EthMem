// contentScript.js
// Inject pageScript into the page context so it can hook fetch/XHR and access JS variables
(function() {
  console.log('ext: contentScript running');
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('pageScript.js');
  s.onload = function() { this.remove(); };
  (document.head || document.documentElement).appendChild(s);

  // Listen for messages posted from the page script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const msg = event.data;
    if (msg && msg.type === 'CHATGPT_LOG') {
      // This is the "dummy route" - log to console
      console.log('CHATGPT_LOG:', msg.payload);
    }
  }, false);
  
  // Improved insertion strategy: locate composer via placeholder/contenteditable, find nearby button group, insert logo
  function createLogoElement() {
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('logo.png');
    img.alt = 'logo';
    img.className = 'ext-logo-inserted';
    img.style.width = '28px';
    img.style.height = '28px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.marginRight = '6px';
    img.style.display = 'inline-block';
    return img;
  }

  function findComposerElement() {
    const selectors = [
      '[placeholder="Ask anything"]',
      '[data-placeholder="Ask anything"]',
      '#prompt-textarea',
      'textarea[name="prompt-textarea"]',
      'div[contenteditable="true"][id*="prompt"]',
      'div.ProseMirror',
      '[class*="bg-token-bg-primary"]'
    ];
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        console.log('ext: selector', sel, 'found', !!el, el);
        if (el) return el.closest('[class*="bg-token-bg-primary"]') || el.closest('div') || el;
      } catch (e) { console.log('ext: selector error', sel, e); }
    }
    return null;
  }

  function findButtonGroupNearComposer(composerEl) {
    if (!composerEl) return null;
    // prefer explicit trailing group
    const btnCandidates = Array.from(composerEl.querySelectorAll('button'));
    if (btnCandidates.length === 0) return null;

    // Group buttons by their parent element and pick the parent that has the most buttons (likely the group)
    const parentCount = new Map();
    for (const b of btnCandidates) {
      const p = b.parentElement || b;
      parentCount.set(p, (parentCount.get(p) || 0) + 1);
    }
    let best = null;
    let bestCount = 0;
    for (const [p, cnt] of parentCount.entries()) {
      if (cnt > bestCount) { best = p; bestCount = cnt; }
    }

    // If best looks like the trailing group (has aria labels or svgs), return it
    if (best) return best;

    // fallback: return last button's parent
    return btnCandidates[btnCandidates.length - 1].parentElement || btnCandidates[btnCandidates.length - 1];
  }

  function insertLogoNearComposer() {
    try {
      const composer = findComposerElement();
      if (!composer) { console.log('ext: composer not found (after trying selectors)'); return false; }
  const group = findButtonGroupNearComposer(composer);
      if (!group) { console.log('ext: button group not found inside composer', { composer }); return false; }

      // avoid duplicates
      if (group.previousElementSibling && group.previousElementSibling.classList && group.previousElementSibling.classList.contains('ext-logo-inserted')) return true;

      const img = createLogoElement();
  group.parentElement.insertBefore(img, group);
      console.log('ext: logo inserted', { insertedBefore: group, imgSrc: img.src, composer });
      return true;
    } catch (e) {
      console.error('ext: insert error', e);
      return false;
    }
  }

  const composerObserver = new MutationObserver((mutations) => {
    // try insertion on any DOM change
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        if (insertLogoNearComposer()) return;
      }
    }
  });

  composerObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // initial attempt
  setTimeout(() => insertLogoNearComposer(), 300);

  // Inject <span class="ext-ekas">ekas</span> into elements matching class substrings 'text-base' and 'mx-auto'
  function insertEkasSpan(target) {
    try {
      if (!target) return false;
      // avoid duplicates
      if (target.querySelector('.ext-ekas')) { console.log('ext: ekas already present in', target); return true; }
      const span = document.createElement('span');
      span.className = 'ext-ekas';
      span.textContent = 'ekas';
      span.style.marginLeft = '6px';
      span.style.fontWeight = '600';
      span.style.color = '#0ea5a4';
      // append at end
      target.appendChild(span);
      console.log('ext: ekas inserted into', target);
      return true;
    } catch (e) { return false; }
  }

  function scanAndInsertEkas() {
    const nodes = document.querySelectorAll('[class*="text-base"][class*="mx-auto"]');
    console.log('ext: scanAndInsertEkas found', nodes.length, 'nodes');
    for (const n of nodes) insertEkasSpan(n);
  }

  // run initially and on mutations
  setTimeout(scanAndInsertEkas, 400);
  const ekasObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) scanAndInsertEkas();
    }
  });
  ekasObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
  
})();
