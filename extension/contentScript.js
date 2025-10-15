// contentScript.js
// Inject pageScript into the page context so it can hook fetch/XHR and access JS variables
(function() {
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
  
    // Inject logo image to the left of the mic button when it appears
    function ensureLogoInserted(micBtn) {
      if (!micBtn) return;
      // check if already inserted
      if (micBtn.previousElementSibling && micBtn.previousElementSibling.classList && micBtn.previousElementSibling.classList.contains('ext-logo-inserted')) return;
  
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
  
      micBtn.parentElement.insertBefore(img, micBtn);
    }
  
    // Observe for mic/composer button
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (!m.addedNodes) continue;
        for (const node of m.addedNodes) {
          try {
            if (!(node instanceof HTMLElement)) continue;
            // find mic button (data-testid=composer-speech-button or aria-label="Dictate button")
            const mic = node.querySelector && (node.querySelector('[data-testid="composer-speech-button"]') || node.querySelector('button[aria-label="Dictate button"]') || node.querySelector('[data-testid="composer-speech-button-container"] button'));
            if (mic) ensureLogoInserted(mic);
          } catch (e) {}
        }
      }
    });
  
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  
    // Also attempt to insert immediately if the mic is already in DOM
    setTimeout(() => {
      const existingMic = document.querySelector('[data-testid="composer-speech-button"]') || document.querySelector('button[aria-label="Dictate button"]') || document.querySelector('[data-testid="composer-speech-button-container"] button');
      if (existingMic) ensureLogoInserted(existingMic);
    }, 500);
  
})();
