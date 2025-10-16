// contentScript.js
// Minimal content script: only inject a button into #page-header when requested.
(function() {
  console.log('ext: minimal contentScript running');

  function createLogoButton() {
    const btn = document.createElement('button');
    btn.className = 'ext-logo-button';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.padding = '4px';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.background = 'transparent';
    btn.style.cursor = 'pointer';
    btn.title = 'ETHMem';
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('logo.png');
    img.alt = 'logo';
    img.style.width = '28px';
    img.style.height = '28px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    btn.appendChild(img);
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

  // Also attempt a one-time insert shortly after load in case header is already present
  setTimeout(() => insertLogoInHeader(), 300);

})();
