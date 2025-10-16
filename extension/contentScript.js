// contentScript.js
// Inject button into ChatGPT, Claude, and Gemini headers
(function() {
  console.log('ext: contentScript running');

  // Detect which platform we're on
  const isChatGPT = window.location.hostname.includes('openai.com') || window.location.hostname.includes('chatgpt.com');
  const isClaude = window.location.hostname.includes('claude.ai');
  const isGemini = window.location.hostname.includes('gemini.google.com');
  
  console.log('ext: platform detection -', { isChatGPT, isClaude, isGemini });

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

  // Inject ethAdapter.js into the page context for wallet connection
  function injectEthAdapter() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('ethAdapter.js');
      script.onload = function() {
        console.log('ext: ethAdapter.js loaded successfully');
        this.remove();
      };
      (document.head || document.documentElement).appendChild(script);
      console.log('ext: ethAdapter.js injected into page context');
    } catch (e) {
      console.error('ext: failed to inject ethAdapter.js', e);
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
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'all 0.2s ease';
    btn.title = 'ETHMem';

    // Platform-specific styling
    if (isGemini) {
      // Gemini: More compact, rounded button to match Google's style
      btn.style.height = '32px';
      btn.style.padding = '4px 12px';
      btn.style.borderRadius = '16px';
      btn.style.background = 'rgba(255, 255, 255, 0.1)';
      btn.style.backdropFilter = 'blur(10px)';
      btn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.15)';
        btn.style.transform = 'scale(1.02)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.transform = 'scale(1)';
      });
    } else {
      // ChatGPT & Claude: Original dark style
      btn.style.height = '36px';
      btn.style.padding = '6px 14px';
      btn.style.borderRadius = '18px';
      btn.style.background = '#303030';
      
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#404040';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#303030';
      });
    }

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('logo.png');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.flexShrink = '0';
    
    // Platform-specific image size
    if (isGemini) {
      img.style.width = '20px';
      img.style.height = '20px';
    } else {
      img.style.width = '24px';
      img.style.height = '24px';
    }

    const label = document.createElement('span');
    label.className = 'ext-logo-label';
    label.textContent = 'ethmem';
    label.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    label.style.fontWeight = '600';
    label.style.letterSpacing = '0.01em';
    label.style.userSelect = 'none';
    
    // Platform-specific text styling
    if (isGemini) {
      label.style.fontSize = '13px';
      label.style.color = 'rgba(255, 255, 255, 0.95)';
    } else {
      label.style.fontSize = '14px';
      label.style.color = '#fff';
    }

    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener('click', (e) => { e.stopPropagation(); try { window.postMessage({ type: 'EXT_LOGO_CLICK' }, '*'); } catch (err) {} });
    return btn;
  }

  function insertLogoInHeader() {
    try {
      let pageHeader = null;
      let insertPosition = null;

      if (isChatGPT) {
        // ChatGPT: Look for the page-header and insert in the right section
        const header = document.getElementById('page-header');
        if (header) {
          // Find the right section with Share button
          const rightSection = header.querySelector('#conversation-header-actions');
          if (rightSection && rightSection.parentElement) {
            pageHeader = rightSection.parentElement;
            insertPosition = 'beforeActions';
          } else {
            pageHeader = header;
            insertPosition = 'lastChild';
          }
        }
      } else if (isClaude) {
        // Claude: Look for header with data-testid="page-header"
        pageHeader = document.querySelector('header[data-testid="page-header"]');
        if (pageHeader) {
          // Find the actions container (right side with Share button)
          const actionsContainer = pageHeader.querySelector('[data-testid="chat-actions"]');
          if (actionsContainer && actionsContainer.parentElement) {
            insertPosition = 'beforeActions';
          } else {
            // Fallback: insert at the end of the header
            insertPosition = 'lastChild';
          }
        }
      } else if (isGemini) {
        // Gemini: Better targeting of the header area
        // Look for the main Gemini header with model selector
        const geminiHeader = document.querySelector('header');
        if (geminiHeader) {
          // Try to find the left side of the header (where model name is)
          const leftSection = geminiHeader.querySelector('div:first-child');
          if (leftSection) {
            pageHeader = leftSection;
            insertPosition = 'afterBegin'; // Insert at the start of left section
          }
        }
        
        // Fallback to Google bar if main header not found
        if (!pageHeader) {
          pageHeader = document.querySelector('.gb_z.gb_td');
          if (!pageHeader) {
            const accountBtn = document.querySelector('.gb_B.gb_0a');
            if (accountBtn) {
              pageHeader = accountBtn.closest('.gb_z');
            }
          }
          if (pageHeader) {
            insertPosition = 'firstChild';
          }
        }
      }

      if (!pageHeader) {
        console.log('ext: page header not found');
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
      
      // Platform-specific wrapper styling
      if (isGemini) {
        wrapper.style.marginRight = '16px';
        wrapper.style.marginLeft = '8px';
      } else if (isClaude || isChatGPT) {
        wrapper.style.marginRight = '8px';
      }
      
      wrapper.appendChild(createLogoButton());

      // Insert based on platform
      try {
        if (insertPosition === 'firstChild') {
          if (pageHeader.firstChild) {
            pageHeader.insertBefore(wrapper, pageHeader.firstChild);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else if (insertPosition === 'beforeActions') {
          // For ChatGPT & Claude: insert before the actions container
          const actionsContainer = isChatGPT 
            ? pageHeader.querySelector('#conversation-header-actions')
            : pageHeader.querySelector('[data-testid="chat-actions"]');
          if (actionsContainer) {
            pageHeader.insertBefore(wrapper, actionsContainer);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else if (insertPosition === 'afterBegin') {
          // For Gemini's better positioning
          if (pageHeader.firstChild) {
            pageHeader.insertBefore(wrapper, pageHeader.firstChild);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else {
          pageHeader.appendChild(wrapper);
        }
      } catch (insertError) {
        console.warn('ext: error inserting button, using appendChild as fallback', insertError);
        pageHeader.appendChild(wrapper);
      }

      console.log(`ext: logo button inserted into ${isChatGPT ? 'ChatGPT' : isClaude ? 'Claude' : 'Gemini'} header`);
      return true;
    } catch (e) {
      console.warn('ext: insertLogoInHeader error', e);
      return false;
    }
  }

  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || !msg.action) return;
    
    if (msg.action === 'connectWallet') {
      // Send message to page context to connect wallet
      window.postMessage({ type: 'EXT_CONNECT_WALLET' }, '*');
      sendResponse({ ok: true });
    }
    
    return true;
  });

  // Listen for wallet connection responses from page context
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data && event.data.type === 'WALLET_CONNECTED') {
      console.log('ext: wallet connected:', event.data.payload);
      // Store wallet info in chrome.storage
      chrome.storage.local.set({
        walletConnected: true,
        walletAddress: event.data.payload.address,
        chainId: event.data.payload.chainId
      });
    }
    
    if (event.data && event.data.type === 'WALLET_ERROR') {
      console.error('ext: wallet connection error:', event.data.payload);
    }
  });

  // Inject the page script immediately
  injectPageScript();
  
  // Inject ethAdapter
  injectEthAdapter();

  // Auto-inject header button with retry logic
  let retryCount = 0;
  const maxRetries = 20; // Try for ~6 seconds
  
  function tryInjectHeader() {
    const success = insertLogoInHeader();
    if (!success && retryCount < maxRetries) {
      retryCount++;
      setTimeout(tryInjectHeader, 300);
    } else if (success) {
      console.log('ext: header button successfully injected');
      setupHeaderObserver();
    }
  }

  // Set up MutationObserver to re-inject if header is removed/changed
  function setupHeaderObserver() {
    const observer = new MutationObserver((mutations) => {
      // Simply check if button exists in DOM, re-inject if not
      if (!document.querySelector('.ext-logo-button')) {
        console.log('ext: header button removed, re-injecting...');
        insertLogoInHeader();
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const platformName = isChatGPT ? 'ChatGPT' : isClaude ? 'Claude' : 'Gemini';
    console.log(`ext: MutationObserver set up for ${platformName} auto-injection`);
  }

  // Start auto-injection
  setTimeout(tryInjectHeader, 300);

})();
