import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, LogOut } from 'lucide-react';

const WalletInfo = ({ wallet, onDisconnect, loading }) => {
  const [balance, setBalance] = useState('0');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (wallet && wallet.balance) {
      // Convert wei to ETH
      const balanceInEth = (parseInt(wallet.balance, 16) / Math.pow(10, 18)).toFixed(4);
      setBalance(balanceInEth);
    }
  }, [wallet]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const openExplorer = () => {
    const chainId = wallet.chainId;
    let explorerUrl = '';
    
    switch (chainId) {
      case 1: // Ethereum Mainnet
        explorerUrl = `https://etherscan.io/address/${wallet.address}`;
        break;
      case 5: // Goerli Testnet
        explorerUrl = `https://goerli.etherscan.io/address/${wallet.address}`;
        break;
      case 11155111: // Sepolia Testnet
        explorerUrl = `https://sepolia.etherscan.io/address/${wallet.address}`;
        break;
      default:
        explorerUrl = `https://etherscan.io/address/${wallet.address}`;
    }
    
    chrome.tabs.create({ url: explorerUrl });
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-section">
      <div className="wallet-status">
        <div className="status-indicator"></div>
        <span>Connected to {wallet.name}</span>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          fontSize: '11px', 
          color: 'rgba(255, 215, 0, 0.7)', 
          marginBottom: '4px' 
        }}>
          Wallet Address
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: 'rgba(255, 215, 0, 0.05)',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <span className="wallet-address">{formatAddress(wallet.address)}</span>
          <button
            onClick={copyAddress}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFD700',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Copy address"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={openExplorer}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFD700',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="View on explorer"
          >
            <ExternalLink size={12} />
          </button>
        </div>
        {copied && (
          <div style={{ 
            fontSize: '10px', 
            color: '#44ff44', 
            marginTop: '4px' 
          }}>
            Address copied!
          </div>
        )}
      </div>
      
      <div className="balance-section">
        <div className="balance-label">ETH Balance</div>
        <div className="balance-value">{balance} ETH</div>
      </div>
      
      <button
        className="disconnect-button"
        onClick={onDisconnect}
        disabled={loading}
        style={{ width: '100%', marginTop: '8px' }}
      >
        <LogOut size={12} style={{ marginRight: '4px' }} />
        Disconnect
      </button>
    </div>
  );
};

export default WalletInfo;
