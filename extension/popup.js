// Helper: try to send a message to the content script, and if there's no receiver
// inject the content script into the tab and retry once (Manifest V3 via scripting.executeScript).
async function sendMessageWithInject(tabId, message) {
  if (!tabId && typeof tabId !== 'number') {
    const err = new Error('sendMessageWithInject: invalid tabId');
    console.error(err);
    throw err;
  }

  // Use callback form and check chrome.runtime.lastError for robustness
  const trySend = () => new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(tabId, message, (resp) => {
        if (chrome.runtime && chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(resp);
      });
    } catch (sendErr) {
      // chrome.tabs.sendMessage may throw synchronously in some environments
      reject(sendErr);
    }
  });

  // First attempt: try to send directly
  try {
    return await trySend();
  } catch (err) {
    // If chrome.scripting isn't available (older MV2 or runtime mismatch), surface a clear error
    console.warn('popup: sendMessage failed, will attempt to inject content script then retry', err);

    if (!chrome.scripting || !chrome.scripting.executeScript) {
      console.error('popup: chrome.scripting.executeScript is not available; cannot inject content script');
      throw err;
    }

    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['contentScript.js'] });
      // allow the injected script to initialize and register its message listener
      await new Promise(res => setTimeout(res, 250));
      return await trySend();
    } catch (err2) {
      // Combine both errors for easier debugging
      console.error('popup: failed to inject or send message after inject', { firstError: err, injectError: err2 });
      // Prefer to throw the injection error
      throw err2;
    }
  }
}

// Guard DOM lookups in case popup.html doesn't include these elements


const injectHeaderBtn = document.getElementById('injectHeaderButton');
if (injectHeaderBtn) {
  injectHeaderBtn.addEventListener('click', async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = Array.isArray(tabs) ? tabs[0] : tabs;
      if (!tab || !tab.id) return;
      await sendMessageWithInject(tab.id, { action: 'injectHeaderButton' });
    } catch (e) {
      console.error('popup: injectHeaderButton failed', e);
    }
  });
} else {
  console.warn('popup: #injectHeaderButton element not found in popup.html');
}

