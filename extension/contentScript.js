// contentScript.js
// Minimal content script: only inject a button into #page-header when requested.
(function() {
  console.log('ext: minimal contentScript running');

  // Inject pageScript.js into the page context so it can intercept fetch calls
  function injectPageScript() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('pageScript.js');
      script.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(script);
      console.log('ext: pageScript.js injected into page context');
    } catch (e) {
      console.error('ext: failed to inject pageScript.js', e);
    }
  }

  // Listen for messages from pageScript (via window.postMessage)
  window.addEventListener('message', (event) => {
    // Only accept messages from same origin
    if (event.source !== window) return;
    
    if (event.data && event.data.type === 'CHATGPT_LOG') {
      console.log('ext: intercepted chat data:', event.data.payload);
      // TODO: Send this data to background script or process it
      // chrome.runtime.sendMessage({ type: 'CHAT_DATA', data: event.data.payload });
    }

    if (event.data && event.data.type === 'EXT_LOGO_CLICK') {
      console.log('ext: logo button clicked');
      // TODO: Handle logo click - open popup, navigate, etc.
    }
  });

  function createLogoButton() {
    const btn = document.createElement('button');
    btn.className = 'ext-logo-button';
    btn.setAttribute('aria-label', 'Open ETHMem');
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.gap = '8px';
    btn.style.height = '36px';
    btn.style.padding = '6px 14px';
    btn.style.border = 'none';
    btn.style.borderRadius = '18px'; // Half of height for perfect pill shape
    btn.style.background = '#303030';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background 0.2s ease';
    btn.title = 'ETHMem';

    // Hover effect
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#404040';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#303030';
    });

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('logo.png');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.width = '24px';
    img.style.height = '24px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.flexShrink = '0';

    const label = document.createElement('span');
    label.className = 'ext-logo-label';
    label.textContent = 'ethmem';
    label.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    label.style.fontSize = '14px';
    label.style.fontWeight = '600';
    label.style.color = '#fff';
    label.style.letterSpacing = '0.01em';
    label.style.userSelect = 'none';

    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener('click', (e) => { e.stopPropagation(); try { window.postMessage({ type: 'EXT_LOGO_CLICK' }, '*'); } catch (err) {} });
    return btn;
  }

  function insertLogoInHeader() {
    try {
      const pageHeader = document.getElementById('page-header');
      if (!pageHeader) {
        console.log('ext: #page-header not found');
        return false;
      }
      if (pageHeader.querySelector('.ext-logo-button')) {
        console.log('ext: logo button already present in header');
        return true;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'ext-logo-wrapper';
      wrapper.setAttribute('data-ext-wrapper', 'true');
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
      wrapper.appendChild(createLogoButton());
      pageHeader.insertBefore(wrapper, pageHeader.firstChild);
      console.log('ext: logo button inserted into #page-header');
      return true;
    } catch (e) {
      console.warn('ext: insertLogoInHeader error', e);
      return false;
    }
  }

  // Listen for messages from popup or background to inject header button
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || !msg.action) return;
    if (msg.action === 'injectHeaderButton') {
      const ok = insertLogoInHeader();
      sendResponse({ ok });
    }
    return true;
  });

  // Inject the page script immediately
  injectPageScript();

  // Also attempt a one-time insert shortly after load in case header is already present
  setTimeout(() => insertLogoInHeader(), 300);

})();
