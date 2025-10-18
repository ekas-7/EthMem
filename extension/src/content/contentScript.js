// contentScript.js
// Main content script - Handles UI injection and message forwarding
(function() {
  console.log('[EthMem] contentScript running');

  // Detect which platform we're on
  const isChatGPT = window.location.hostname.includes('openai.com') || window.location.hostname.includes('chatgpt.com');
  const isClaude = window.location.hostname.includes('claude.ai');
  const isGemini = window.location.hostname.includes('gemini.google.com');
  
  console.log('[EthMem] platform detection -', { isChatGPT, isClaude, isGemini });

  // Track processed messages to avoid duplicates
  const processedMessages = new Set();

  // Inject pageScript.js into the page context so it can intercept fetch calls
  function injectPageScript() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('src/page/pageScript.js');
      script.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(script);
      console.log('[EthMem] pageScript.js injected into page context');
    } catch (e) {
      console.error('[EthMem] failed to inject pageScript.js', e);
    }
  }

  // Inject ethAdapter.js into the page context for wallet connection
  function injectEthAdapter() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('src/page/ethAdapter.js');
      script.onload = function() {
        console.log('[EthMem] ethAdapter.js loaded successfully');
        this.remove();
      };
      (document.head || document.documentElement).appendChild(script);
      console.log('[EthMem] ethAdapter.js injected into page context');
    } catch (e) {
      console.error('[EthMem] failed to inject ethAdapter.js', e);
    }
  }

  // Inject memory viewer UI script
  function injectMemoryViewer() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('src/ui/memoryViewer.js');
      (document.head || document.documentElement).appendChild(script);
      console.log('[EthMem] memoryViewer.js injected');
    } catch (e) {
      console.error('[EthMem] failed to inject memoryViewer.js', e);
    }
  }

  // Listen for messages from pageScript (via window.postMessage)
  window.addEventListener('message', (event) => {
    // Only accept messages from same origin
    if (event.source !== window) return;
    
    if (event.data && event.data.type === 'CHATGPT_LOG') {
      const payload = event.data.payload;
      
      // If it's a user message, send for memory extraction
      if (payload.type === 'USER_MESSAGE' && payload.userMessage) {
        const messageKey = payload.userMessage + payload.timestamp;
        
        // Avoid duplicate processing
        if (processedMessages.has(messageKey)) {
          return;
        }
        processedMessages.add(messageKey);
        
        // Clean up old entries (keep last 100)
        if (processedMessages.size > 100) {
          const entries = Array.from(processedMessages);
          processedMessages.clear();
          entries.slice(-50).forEach(e => processedMessages.add(e));
        }
        
        console.log('[EthMem] User message detected, sending for extraction:', payload.userMessage.substring(0, 100));
        
        // Send to background for memory extraction
        chrome.runtime.sendMessage({
          type: 'EXTRACT_MEMORY',
          payload: {
            text: payload.userMessage,
            messageId: payload.timestamp.toString(),
            platform: isChatGPT ? 'chatgpt' : isClaude ? 'claude' : 'gemini',
            url: window.location.href,
            timestamp: payload.timestamp
          }
        }).then(response => {
          if (response && response.success) {
            console.log('[EthMem] Memory extracted:', response.memory);
          }
        }).catch(error => {
          console.error('[EthMem] Error extracting memory:', error);
        });
      }
    }

    if (event.data && event.data.type === 'EXT_LOGO_CLICK') {
      console.log('[EthMem] logo button clicked');
      // Open memory viewer
      if (window.EthMemViewer) {
        window.EthMemViewer.open();
      }
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
    btn.title = 'ETHMem - View Your Memories';

    // Platform-specific styling
    if (isGemini) {
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
    img.src = chrome.runtime.getURL('assets/logo.png');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.flexShrink = '0';
    
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
    
    if (isGemini) {
      label.style.fontSize = '13px';
      label.style.color = 'rgba(255, 255, 255, 0.95)';
    } else {
      label.style.fontSize = '14px';
      label.style.color = '#fff';
    }

    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      try { 
        window.postMessage({ type: 'EXT_LOGO_CLICK' }, '*'); 
      } catch (err) {
        console.error('[EthMem] Error posting logo click:', err);
      } 
    });
    return btn;
  }

  function insertLogoInHeader() {
    try {
      let pageHeader = null;
      let insertPosition = null;

      if (isChatGPT) {
        const header = document.getElementById('page-header');
        if (header) {
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
        pageHeader = document.querySelector('header[data-testid="page-header"]');
        if (pageHeader) {
          const actionsContainer = pageHeader.querySelector('[data-testid="chat-actions"]');
          if (actionsContainer && actionsContainer.parentElement) {
            insertPosition = 'beforeActions';
          } else {
            insertPosition = 'lastChild';
          }
        }
      } else if (isGemini) {
        const logoContainer = document.querySelector('.pill-ui-logo-container');
        if (logoContainer && logoContainer.parentElement) {
          pageHeader = logoContainer.parentElement;
          insertPosition = 'afterLogo';
        }
        
        if (!pageHeader) {
          const googleBar = document.querySelector('div[role="banner"]');
          if (googleBar) {
            const rightSection = googleBar.querySelector('div:last-child');
            if (rightSection) {
              pageHeader = rightSection;
              insertPosition = 'beforeProfile';
            }
          }
        }
        
        if (!pageHeader) {
          pageHeader = document.querySelector('.gb_z.gb_td') || document.querySelector('.gb_z');
          if (pageHeader) {
            insertPosition = 'firstChild';
          }
        }
        
        if (!pageHeader) {
          const anyHeader = document.querySelector('header');
          if (anyHeader) {
            pageHeader = anyHeader;
            insertPosition = 'lastChild';
          }
        }
      }

      if (!pageHeader) {
        console.log('[EthMem] page header not found');
        return false;
      }

      if (pageHeader.querySelector('.ext-logo-button')) {
        console.log('[EthMem] logo button already present in header');
        return true;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'ext-logo-wrapper';
      wrapper.setAttribute('data-ext-wrapper', 'true');
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
      
      if (isGemini) {
        wrapper.style.marginRight = '16px';
        wrapper.style.marginLeft = '8px';
      } else if (isClaude || isChatGPT) {
        wrapper.style.marginRight = '8px';
      }
      
      wrapper.appendChild(createLogoButton());

      try {
        if (insertPosition === 'firstChild') {
          if (pageHeader.firstChild) {
            pageHeader.insertBefore(wrapper, pageHeader.firstChild);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else if (insertPosition === 'beforeActions') {
          const actionsContainer = isChatGPT 
            ? pageHeader.querySelector('#conversation-header-actions')
            : pageHeader.querySelector('[data-testid="chat-actions"]');
          if (actionsContainer) {
            pageHeader.insertBefore(wrapper, actionsContainer);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else if (insertPosition === 'afterLogo') {
          const logoContainer = pageHeader.querySelector('.pill-ui-logo-container');
          if (logoContainer && logoContainer.nextSibling) {
            pageHeader.insertBefore(wrapper, logoContainer.nextSibling);
          } else if (logoContainer) {
            pageHeader.appendChild(wrapper);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else if (insertPosition === 'beforeProfile') {
          const profileIcon = pageHeader.querySelector('a[aria-label*="Google Account"], a[aria-label*="Google apps"], .gb_B, .gb_0a');
          if (profileIcon) {
            pageHeader.insertBefore(wrapper, profileIcon);
          } else if (pageHeader.lastChild) {
            pageHeader.insertBefore(wrapper, pageHeader.lastChild);
          } else {
            pageHeader.appendChild(wrapper);
          }
        } else {
          pageHeader.appendChild(wrapper);
        }
      } catch (insertError) {
        console.warn('[EthMem] error inserting button, using appendChild as fallback', insertError);
        pageHeader.appendChild(wrapper);
      }

      console.log(`[EthMem] logo button inserted into ${isChatGPT ? 'ChatGPT' : isClaude ? 'Claude' : 'Gemini'} header`);
      return true;
    } catch (e) {
      console.warn('[EthMem] insertLogoInHeader error', e);
      return false;
    }
  }

  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || !msg.action) return;
    
    if (msg.action === 'connectWallet') {
      window.postMessage({ type: 'EXT_CONNECT_WALLET' }, '*');
      sendResponse({ ok: true });
    }
    
    return true;
  });

  // Listen for wallet connection responses from page context
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data && event.data.type === 'WALLET_CONNECTED') {
      console.log('[EthMem] wallet connected:', event.data.payload);
      chrome.storage.local.set({
        walletConnected: true,
        walletAddress: event.data.payload.address,
        chainId: event.data.payload.chainId
      });
    }
    
    if (event.data && event.data.type === 'WALLET_ERROR') {
      console.error('[EthMem] wallet connection error:', event.data.payload);
    }
  });

  // Inject scripts
  injectPageScript();
  injectEthAdapter();
  injectMemoryViewer();

  // Auto-inject header button with retry logic
  let retryCount = 0;
  const maxRetries = 20;
  
  function tryInjectHeader() {
    const success = insertLogoInHeader();
    if (!success && retryCount < maxRetries) {
      retryCount++;
      setTimeout(tryInjectHeader, 300);
    } else if (success) {
      console.log('[EthMem] header button successfully injected');
      setupHeaderObserver();
    }
  }

  // Set up MutationObserver to re-inject if header is removed/changed
  function setupHeaderObserver() {
    const observer = new MutationObserver((mutations) => {
      if (!document.querySelector('.ext-logo-button')) {
        console.log('[EthMem] header button removed, re-injecting...');
        insertLogoInHeader();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const platformName = isChatGPT ? 'ChatGPT' : isClaude ? 'Claude' : 'Gemini';
    console.log(`[EthMem] MutationObserver set up for ${platformName} auto-injection`);
  }

  // Start auto-injection
  setTimeout(tryInjectHeader, 300);

})();
