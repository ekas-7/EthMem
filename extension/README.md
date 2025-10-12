# zKMem Wallet Extension

A React-based Chrome extension for connecting Web3 wallets and managing zKMem memories.

## Features

- 🔗 Connect to MetaMask, Coinbase Wallet, and Rainbow wallets
- 💰 View wallet balance and network information
- 🌐 Cross-page wallet state management
- 🎨 Beautiful black and gold UI design
- 📱 Responsive popup interface
- ⚡ Lightweight and fast (no deprecated dependencies)

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser

### Installation

1. Clone the repository and navigate to the extension directory:
```bash
cd extension
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

### Development Mode

For development with hot reloading:
```bash
npm run dev
```

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist/` directory
4. The extension should now appear in your extensions list

## Usage

### For Users

1. Click the extension icon in your browser toolbar
2. Select your preferred wallet (MetaMask, Coinbase Wallet, or Rainbow)
3. Click "Connect" to connect your wallet
4. View your wallet address, balance, and network information
5. The wallet state will be available across all web pages

### For Developers

The extension exposes a global `window.zkmemWallet` object on web pages:

```javascript
// Check if wallet is connected
if (window.zkmemWallet && window.zkmemWallet.isConnected) {
  console.log('Wallet address:', window.zkmemWallet.address);
  console.log('Network:', window.zkmemWallet.networkName);
  console.log('Balance:', window.zkmemWallet.balance);
}

// Listen for wallet connection events
window.addEventListener('zkmem-wallet-connected', (event) => {
  console.log('Wallet connected:', event.detail.walletData);
});

window.addEventListener('zkmem-wallet-disconnected', () => {
  console.log('Wallet disconnected');
});
```

## Project Structure

```
extension/
├── src/
│   ├── popup/           # React popup application
│   │   ├── components/   # React components
│   │   ├── App.jsx      # Main app component
│   │   ├── index.js     # Entry point
│   │   └── styles.css   # Styles
│   ├── background/      # Background script
│   └── content/         # Content script
├── manifest.json        # Extension manifest
├── webpack.config.js    # Webpack configuration
├── package.json         # Dependencies
└── build.js            # Build script
```

## Supported Networks

- Ethereum Mainnet
- Goerli Testnet
- Sepolia Testnet
- Polygon Mainnet
- Mumbai Testnet
- BSC Mainnet
- BSC Testnet

## Security

- Wallet data is stored locally in Chrome storage
- No private keys are ever exposed or transmitted
- Content scripts only run on pages you visit
- External communication is restricted to trusted domains

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension
5. Submit a pull request

## License

MIT License - see LICENSE file for details
