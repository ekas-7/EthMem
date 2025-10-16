// Helper: try to send a message to the content script, and if there's no receiver
// inject the content script into the tab and retry once (Manifest V3 via scripting.executeScript).
async function sendMessageWithInject(tabId, message) {
  // Use callback form and check chrome.runtime.lastError for robustness
  const trySend = () => new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (resp) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(resp);
    });
  });

  try {
    return await trySend();
  } catch (err) {
    console.warn('popup: sendMessage failed, attempting to inject content script then retry', err);
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['contentScript.js'] });
      await new Promise(res => setTimeout(res, 200));
      return await trySend();
    } catch (err2) {
      console.error('popup: failed to inject or send message after inject', err2);
      throw err2;
    }
  }
}

document.getElementById('injectLogo').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    await sendMessageWithInject(tab.id, { action: 'injectLogo' });
  } catch (e) {
    console.error('popup: injectLogo failed', e);
  }
});

document.getElementById('injectHeaderButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    await sendMessageWithInject(tab.id, { action: 'injectHeaderButton' });
  } catch (e) {
    console.error('popup: injectHeaderButton failed', e);
  }
});

