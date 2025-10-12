import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import WalletConnector from './components/WalletConnector';
import WalletInfo from './components/WalletInfo';
import NetworkInfo from './components/NetworkInfo';

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if wallet is already connected
    chrome.storage.local.get(['walletData'], (result) => {
      if (result.walletData) {
        setWallet(result.walletData);
        setIsConnected(true);
      }
    });
  }, []);

  const handleWalletConnect = async (walletData) => {
    setLoading(true);
    setError(null);
    
    try {
      setWallet(walletData);
      setIsConnected(true);
      
      // Store wallet data in Chrome storage
      await chrome.storage.local.set({ walletData });
      
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'WALLET_CONNECTED',
        walletData
      });
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletDisconnect = async () => {
    setLoading(true);
    
    try {
      setWallet(null);
      setIsConnected(false);
      
      // Clear wallet data from Chrome storage
      await chrome.storage.local.remove(['walletData']);
      
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'WALLET_DISCONNECTED'
      });
    } catch (err) {
      setError('Failed to disconnect wallet');
      console.error('Wallet disconnection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <Wallet size={20} style={{ marginBottom: '8px' }} />
        <h1>zKMem Wallet</h1>
      </div>
      
      <div className="content">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Connecting...</span>
          </div>
        )}
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        {!isConnected ? (
          <WalletConnector 
            onConnect={handleWalletConnect}
            loading={loading}
          />
        ) : (
          <>
            <WalletInfo 
              wallet={wallet}
              onDisconnect={handleWalletDisconnect}
              loading={loading}
            />
            <NetworkInfo wallet={wallet} />
          </>
        )}
      </div>
      
      <div className="footer">
        zKMem Extension v1.0.0
      </div>
    </div>
  );
};

export default App;
