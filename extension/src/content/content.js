// Content script for zKMem extension
console.log('zKMem Extension Content Script Loaded');

let walletData = null;
let isConnected = false;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  switch (request.type) {
    case 'WALLET_CONNECTED':
      handleWalletConnected(request.walletData);
      break;
    case 'WALLET_DISCONNECTED':
      handleWalletDisconnected();
      break;
    default:
      console.log('Unknown message type:', request.type);
  }
});

// Handle wallet connection
function handleWalletConnected(data) {
  walletData = data;
  isConnected = true;
  
  console.log('Wallet connected in content script:', data);
  
  // Inject wallet data into page
  injectWalletData();
  
  // Dispatch custom event for web pages to listen to
  window.dispatchEvent(new CustomEvent('zkmem-wallet-connected', {
    detail: { walletData: data }
  }));
}

// Handle wallet disconnection
function handleWalletDisconnected() {
  walletData = null;
  isConnected = false;
  
  console.log('Wallet disconnected in content script');
  
  // Remove wallet data from page
  removeWalletData();
  
  // Dispatch custom event for web pages to listen to
  window.dispatchEvent(new CustomEvent('zkmem-wallet-disconnected'));
}

// Inject wallet data into the page
function injectWalletData() {
  if (!walletData) return;
  
  // Create a global object that web pages can access
  window.zkmemWallet = {
    isConnected: true,
    address: walletData.address,
    chainId: walletData.chainId,
    networkName: getNetworkName(walletData.chainId),
    provider: walletData.provider,
    balance: walletData.balance,
    disconnect: () => {
      chrome.runtime.sendMessage({ type: 'WALLET_DISCONNECTED' });
    }
  };
  
  console.log('Wallet data injected into page:', window.zkmemWallet);
}

// Remove wallet data from the page
function removeWalletData() {
  if (window.zkmemWallet) {
    window.zkmemWallet = {
      isConnected: false,
      disconnect: () => {
        console.log('Wallet already disconnected');
      }
    };
  }
}

// Get network name from chain ID
function getNetworkName(chainId) {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 5:
      return 'Goerli Testnet';
    case 11155111:
      return 'Sepolia Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Mumbai Testnet';
    case 56:
      return 'BSC Mainnet';
    case 97:
      return 'BSC Testnet';
    default:
      return `Chain ID: ${chainId}`;
  }
}

// Initialize wallet state on page load
async function initializeWalletState() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_WALLET_DATA' });
    if (response) {
      handleWalletConnected(response);
    }
  } catch (error) {
    console.log('Failed to get wallet data:', error);
  }
}

// Wait for page to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWalletState);
} else {
  initializeWalletState();
}

// Expose API for web pages to interact with the extension
window.addEventListener('message', (event) => {
  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'zkmem-request-wallet-data') {
    event.source.postMessage({
      type: 'zkmem-wallet-data-response',
      walletData: walletData,
      isConnected: isConnected
    }, event.origin);
  }
});

// Listen for page visibility changes to update wallet state
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page became visible, refresh wallet state
    initializeWalletState();
  }
});
