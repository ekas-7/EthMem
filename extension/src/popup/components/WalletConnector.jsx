import React, { useState } from 'react';
import { Wallet, ExternalLink } from 'lucide-react';

const WalletConnector = ({ onConnect, loading }) => {
  const [selectedWallet, setSelectedWallet] = useState(null);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: '🦊'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect using Coinbase Wallet extension',
      icon: '🔵'
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      description: 'Connect using Rainbow wallet extension',
      icon: '🌈'
    }
  ];

  const handleWalletSelect = async (walletId) => {
    setSelectedWallet(walletId);
    
    try {
      let walletData = null;
      
      if (walletId === 'metamask') {
        walletData = await connectMetaMask();
      } else if (walletId === 'coinbase') {
        walletData = await connectCoinbase();
      } else if (walletId === 'rainbow') {
        walletData = await connectRainbow();
      }
      
      if (walletData) {
        onConnect(walletData);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setSelectedWallet(null);
    }
  };

  const connectMetaMask = async () => {
    try {
      // Try to detect MetaMask in the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        // Inject script to check for MetaMask in the active tab
        const results = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (typeof window.ethereum === 'undefined') {
              return { error: 'No Ethereum provider found' };
            }
            
            if (!window.ethereum.isMetaMask) {
              return { error: 'MetaMask not detected' };
            }
            
            return {
              hasEthereum: true,
              isMetaMask: true,
              selectedAddress: window.ethereum.selectedAddress,
              chainId: window.ethereum.chainId
            };
          }
        });
        
        const result = results[0]?.result;
        
        if (result?.error) {
          throw new Error(`MetaMask not detected: ${result.error}. Please install MetaMask extension.`);
        }
        
        if (result?.hasEthereum && result?.isMetaMask) {
          if (result.selectedAddress) {
            // MetaMask is connected, get balance
            const balanceResult = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                return window.ethereum.request({
                  method: 'eth_getBalance',
                  params: [window.ethereum.selectedAddress, 'latest']
                });
              }
            });
            
            return {
              address: result.selectedAddress,
              chainId: parseInt(result.chainId || '0x1', 16),
              networkVersion: 1,
              balance: balanceResult[0]?.result || '0x0',
              provider: 'metamask',
              name: 'MetaMask'
            };
          } else {
            throw new Error('MetaMask detected but not connected. Please connect your wallet in the main window first.');
          }
        } else {
          throw new Error('MetaMask not detected. Please install MetaMask extension.');
        }
      } else {
        throw new Error('No active tab found. Please open a web page first.');
      }
    } catch (error) {
      throw new Error(`MetaMask connection failed: ${error.message}`);
    }
  };

  const connectCoinbase = async () => {
    try {
      // Try to detect Coinbase Wallet in the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        // Inject script to check for Coinbase Wallet in the active tab
        const results = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (typeof window.ethereum === 'undefined') {
              return { error: 'No Ethereum provider found' };
            }
            
            if (!window.ethereum.isCoinbaseWallet) {
              return { error: 'Coinbase Wallet not detected' };
            }
            
            return {
              hasEthereum: true,
              isCoinbaseWallet: true,
              selectedAddress: window.ethereum.selectedAddress,
              chainId: window.ethereum.chainId
            };
          }
        });
        
        const result = results[0]?.result;
        
        if (result?.error) {
          throw new Error(`Coinbase Wallet not detected: ${result.error}. Please install Coinbase Wallet extension.`);
        }
        
        if (result?.hasEthereum && result?.isCoinbaseWallet) {
          if (result.selectedAddress) {
            // Coinbase Wallet is connected, get balance
            const balanceResult = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                return window.ethereum.request({
                  method: 'eth_getBalance',
                  params: [window.ethereum.selectedAddress, 'latest']
                });
              }
            });
            
            return {
              address: result.selectedAddress,
              chainId: parseInt(result.chainId || '0x1', 16),
              networkVersion: 1,
              balance: balanceResult[0]?.result || '0x0',
              provider: 'coinbase',
              name: 'Coinbase Wallet'
            };
          } else {
            throw new Error('Coinbase Wallet detected but not connected. Please connect your wallet in the main window first.');
          }
        } else {
          throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet extension.');
        }
      } else {
        throw new Error('No active tab found. Please open a web page first.');
      }
    } catch (error) {
      throw new Error(`Coinbase Wallet connection failed: ${error.message}`);
    }
  };

  const connectRainbow = async () => {
    try {
      // Try to detect Rainbow Wallet in the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        // Inject script to check for Rainbow Wallet in the active tab
        const results = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (typeof window.ethereum === 'undefined') {
              return { error: 'No Ethereum provider found' };
            }
            
            if (!window.ethereum.isRainbow) {
              return { error: 'Rainbow Wallet not detected' };
            }
            
            return {
              hasEthereum: true,
              isRainbow: true,
              selectedAddress: window.ethereum.selectedAddress,
              chainId: window.ethereum.chainId
            };
          }
        });
        
        const result = results[0]?.result;
        
        if (result?.error) {
          throw new Error(`Rainbow Wallet not detected: ${result.error}. Please install Rainbow Wallet extension.`);
        }
        
        if (result?.hasEthereum && result?.isRainbow) {
          if (result.selectedAddress) {
            // Rainbow Wallet is connected, get balance
            const balanceResult = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                return window.ethereum.request({
                  method: 'eth_getBalance',
                  params: [window.ethereum.selectedAddress, 'latest']
                });
              }
            });
            
            return {
              address: result.selectedAddress,
              chainId: parseInt(result.chainId || '0x1', 16),
              networkVersion: 1,
              balance: balanceResult[0]?.result || '0x0',
              provider: 'rainbow',
              name: 'Rainbow Wallet'
            };
          } else {
            throw new Error('Rainbow Wallet detected but not connected. Please connect your wallet in the main window first.');
          }
        } else {
          throw new Error('Rainbow Wallet not detected. Please install Rainbow Wallet extension.');
        }
      } else {
        throw new Error('No active tab found. Please open a web page first.');
      }
    } catch (error) {
      throw new Error(`Rainbow Wallet connection failed: ${error.message}`);
    }
  };

  return (
    <div className="wallet-section">
      <div className="wallet-status">
        <div className="status-indicator disconnected"></div>
        <span>No wallet connected</span>
      </div>
      
      <p style={{ fontSize: '12px', color: 'rgba(255, 215, 0, 0.7)', marginBottom: '16px' }}>
        Connect your wallet to start using zKMem
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            className="connect-button"
            onClick={() => handleWalletSelect(wallet.id)}
            disabled={loading || selectedWallet === wallet.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'flex-start',
              fontSize: '13px',
              padding: '10px 12px'
            }}
          >
            <span style={{ fontSize: '16px' }}>{wallet.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600' }}>{wallet.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>{wallet.description}</div>
            </div>
            <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
          </button>
        ))}
      </div>
      
      {selectedWallet && (
        <div style={{ 
          marginTop: '12px', 
          fontSize: '11px', 
          color: 'rgba(255, 215, 0, 0.7)',
          textAlign: 'center'
        }}>
          Connecting to {wallets.find(w => w.id === selectedWallet)?.name}...
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
