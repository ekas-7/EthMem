// Background script for zKMem extension
console.log('zKMem Extension Background Script Loaded');

// Listen for wallet connection events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.type) {
    case 'WALLET_CONNECTED':
      handleWalletConnected(request.walletData);
      break;
    case 'WALLET_DISCONNECTED':
      handleWalletDisconnected();
      break;
    case 'GET_WALLET_DATA':
      getWalletData().then(sendResponse);
      return true; // Keep message channel open for async response
    default:
      console.log('Unknown message type:', request.type);
  }
});

// Handle wallet connection
async function handleWalletConnected(walletData) {
  console.log('Wallet connected:', walletData);
  
  // Store wallet data
  await chrome.storage.local.set({ walletData });
  
  // Update extension badge
  chrome.action.setBadgeText({ text: '✓' });
  chrome.action.setBadgeBackgroundColor({ color: '#FFD700' });
  
  // Notify content scripts
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      type: 'WALLET_CONNECTED',
      walletData
    }).catch(() => {
      // Ignore errors for tabs that don't have content script
    });
  });
}

// Handle wallet disconnection
async function handleWalletDisconnected() {
  console.log('Wallet disconnected');
  
  // Clear wallet data
  await chrome.storage.local.remove(['walletData']);
  
  // Update extension badge
  chrome.action.setBadgeText({ text: '' });
  
  // Notify content scripts
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      type: 'WALLET_DISCONNECTED'
    }).catch(() => {
      // Ignore errors for tabs that don't have content script
    });
  });
}

// Get wallet data
async function getWalletData() {
  const result = await chrome.storage.local.get(['walletData']);
  return result.walletData || null;
}

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if wallet is connected and inject wallet data
    const walletData = await getWalletData();
    if (walletData) {
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: 'WALLET_CONNECTED',
          walletData
        });
      } catch (error) {
        // Content script not available, ignore
      }
    }
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('zKMem Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.local.set({
      settings: {
        autoConnect: false,
        showNotifications: true
      }
    });
  }
});

// Handle external messages (for communication with web pages)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log('External message received:', request);
  
  // Only allow messages from trusted domains
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    // Add your production domains here
  ];
  
  const senderDomain = new URL(sender.url).hostname;
  if (!allowedDomains.includes(senderDomain)) {
    sendResponse({ error: 'Unauthorized domain' });
    return;
  }
  
  switch (request.type) {
    case 'GET_WALLET_DATA':
      getWalletData().then(sendResponse);
      return true;
    case 'REQUEST_WALLET_CONNECTION':
      // This would trigger the popup to open for wallet connection
      chrome.action.openPopup();
      sendResponse({ success: true });
      break;
    default:
      sendResponse({ error: 'Unknown request type' });
  }
});
