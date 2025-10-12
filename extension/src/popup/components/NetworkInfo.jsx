import React from 'react';
import { Network } from 'lucide-react';

const NetworkInfo = ({ wallet }) => {
  const getNetworkName = (chainId) => {
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
  };

  const getNetworkColor = (chainId) => {
    switch (chainId) {
      case 1:
        return '#627EEA'; // Ethereum blue
      case 5:
        return '#FF6B6B'; // Goerli red
      case 11155111:
        return '#4ECDC4'; // Sepolia teal
      case 137:
        return '#8247E5'; // Polygon purple
      case 80001:
        return '#FF6B6B'; // Mumbai red
      case 56:
        return '#F3BA2F'; // BSC yellow
      case 97:
        return '#FF6B6B'; // BSC testnet red
      default:
        return '#FFD700'; // Default gold
    }
  };

  const networkName = getNetworkName(wallet.chainId);
  const networkColor = getNetworkColor(wallet.chainId);

  return (
    <div className="network-info">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '8px'
      }}>
        <Network size={14} style={{ color: networkColor }} />
        <span className="network-name">Network</span>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#FFD700',
        marginBottom: '4px'
      }}>
        {networkName}
      </div>
      
      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 215, 0, 0.6)',
        fontFamily: 'Courier New, monospace'
      }}>
        Chain ID: {wallet.chainId}
      </div>
      
      {wallet.chainId !== 1 && (
        <div style={{ 
          fontSize: '10px', 
          color: '#ffaa00',
          marginTop: '8px',
          padding: '6px',
          background: 'rgba(255, 170, 0, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(255, 170, 0, 0.3)'
        }}>
          ⚠️ You're on a testnet. Switch to Ethereum Mainnet for production use.
        </div>
      )}
    </div>
  );
};

export default NetworkInfo;
