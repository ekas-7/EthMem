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

  function createLogoButton(isTextbar = false) {
    const btn = document.createElement('button');
    btn.className = isTextbar ? 'ext-logo-button-textbar' : 'ext-logo-button';
    btn.setAttribute('aria-label', 'EthMem Memories');
    btn.title = 'EthMem - View Your Memories';

    if (isTextbar && isChatGPT) {
      // ChatGPT textbar button styling (matches Attach, Search, Study buttons)
      btn.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        min-width: 32px;
        padding: 8px;
        border-radius: 18px;
        border: 1px solid rgb(86, 88, 105);
        background: transparent;
        color: rgb(172, 172, 190);
        font-size: 13px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        cursor: pointer;
        transition: background 0.2s ease, opacity 0.2s ease;
        white-space: nowrap;
        gap: 6px;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgb(52, 53, 65)';
        btn.style.opacity = '0.8';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
        btn.style.opacity = '1';
      });
    } else {
      // Header button styling
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.gap = '8px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.2s ease';

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
    }

    // Create logo icon (SVG embedded or img)
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('../../assets/logo.png');
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.style.objectFit = 'contain';
    img.style.flexShrink = '0';
    
    if (isTextbar && isChatGPT) {
      img.style.width = '20px';
      img.style.height = '20px';
    } else if (isGemini) {
      img.style.width = '20px';
      img.style.height = '20px';
      img.style.borderRadius = '50%';
    } else {
      img.style.width = '24px';
      img.style.height = '24px';
      img.style.borderRadius = '50%';
    }

    btn.appendChild(img);

    // Add label for textbar buttons or non-textbar
    if (!isTextbar || !isChatGPT) {
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
      btn.appendChild(label);
    } else {
      // Add "Memory" text label for textbar button (shown inline, can be hidden with CSS class if needed)
      const label = document.createElement('span');
      label.textContent = 'Memory';
      label.style.paddingLeft = '4px';
      label.style.paddingRight = '4px';
      label.style.fontWeight = '600';
      label.style.whiteSpace = 'nowrap';
      label.className = 'ethmem-textbar-label';
      btn.appendChild(label);
    }

    btn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      e.preventDefault();
      try { 
        window.postMessage({ type: 'EXT_LOGO_CLICK' }, '*'); 
      } catch (err) {
        console.error('[EthMem] Error posting logo click:', err);
      } 
    });
    return btn;
  }

  // Function to inject button into ChatGPT composer textbar
  function insertLogoInTextbar() {
    if (!isChatGPT) return false; // Only for ChatGPT
    
    try {
      // Find the composer footer actions container
      const composerFooter = document.querySelector('[data-testid="composer-footer-actions"]');
      if (!composerFooter) {
        console.log('[EthMem] composer footer not found, retrying...');
        return false;
      }

      // Find the buttons container (has Attach, Search, Study buttons)
      const buttonsContainer = composerFooter.querySelector('.flex.min-w-fit.items-center');
      if (!buttonsContainer) {
        console.log('[EthMem] buttons container not found, trying alternative selector...');
        
        // Try alternative: find any flex container with buttons
        const allFlexContainers = composerFooter.querySelectorAll('.flex');
        console.log('[EthMem] Found flex containers:', allFlexContainers.length);
        
        // Look for container with Attach/Search buttons
        for (let container of allFlexContainers) {
          if (container.querySelector('[data-testid*="attach"], [data-testid*="search"], [aria-label*="Attach"], [aria-label*="Search"]')) {
            console.log('[EthMem] Found buttons container via alternative method');
            
            // Check if already injected
            if (container.querySelector('.ext-logo-button-textbar')) {
              console.log('[EthMem] textbar button already present');
              return true;
            }
            
            const ethmemButton = createLogoButton(true);
            container.appendChild(ethmemButton);
            console.log('[EthMem] textbar button injected successfully (alternative method)');
            return true;
          }
        }
        
        console.log('[EthMem] Could not find buttons container');
        return false;
      }

      // Check if already injected
      if (buttonsContainer.querySelector('.ext-logo-button-textbar')) {
        console.log('[EthMem] textbar button already present');
        return true;
      }

      // Create and insert the button
      const ethmemButton = createLogoButton(true);
      
      // Insert after the last button (Study button)
      buttonsContainer.appendChild(ethmemButton);
      
      console.log('[EthMem] textbar button injected successfully');
      return true;
    } catch (e) {
      console.warn('[EthMem] insertLogoInTextbar error', e);
      return false;
    }
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
      setupObserver();
    }
  }

  // Auto-inject textbar button with retry logic (ChatGPT only)
  let textbarRetryCount = 0;
  const textbarMaxRetries = 30; // Increased retries for slower loading
  
  function tryInjectTextbar() {
    if (!isChatGPT) return;
    
    const success = insertLogoInTextbar();
    if (!success && textbarRetryCount < textbarMaxRetries) {
      textbarRetryCount++;
      console.log(`[EthMem] Textbar injection attempt ${textbarRetryCount}/${textbarMaxRetries}`);
      setTimeout(tryInjectTextbar, 500); // Longer delay
    } else if (success) {
      console.log('[EthMem] textbar button successfully injected');
    } else {
      console.warn('[EthMem] Failed to inject textbar button after', textbarMaxRetries, 'attempts');
    }
  }

  // Set up MutationObserver to re-inject if buttons are removed/changed
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      // Re-inject header button if missing
      if (!document.querySelector('.ext-logo-button')) {
        console.log('[EthMem] header button removed, re-injecting...');
        insertLogoInHeader();
      }
      
      // Re-inject textbar button if missing (ChatGPT only)
      if (isChatGPT && !document.querySelector('.ext-logo-button-textbar')) {
        console.log('[EthMem] textbar button removed, re-injecting...');
        insertLogoInTextbar();
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
  setTimeout(tryInjectTextbar, 500); // Slight delay for textbar

})();
