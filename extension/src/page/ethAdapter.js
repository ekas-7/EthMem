

class EthAdapter {
  constructor() {
    this.provider = null;
    this.selectedAddress = null;
    this.chainId = null;
    this.isConnected = false;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  /**
   * Connect to MetaMask wallet
   * @returns {Promise<Object>} Connection result with address and chainId
   */
  async connect() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      this.provider = window.ethereum;

      // Request account access
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      this.selectedAddress = accounts[0];
      
      // Get current chain ID
      this.chainId = await this.provider.request({
        method: 'eth_chainId'
      });

      this.isConnected = true;

      // Set up event listeners
      this.setupEventListeners();

      console.log('Connected to MetaMask:', {
        address: this.selectedAddress,
        chainId: this.chainId
      });

      return {
        success: true,
        address: this.selectedAddress,
        chainId: this.chainId
      };

    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      this.isConnected = false;
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.selectedAddress = null;
    this.chainId = null;
    this.isConnected = false;
    this.removeEventListeners();
    console.log('Disconnected from MetaMask');
  }

  /**
   * Get current connected account
   * @returns {string|null} Ethereum address
   */
  getAccount() {
    return this.selectedAddress;
  }

  /**
   * Get current chain ID
   * @returns {string|null} Chain ID in hex format
   */
  getChainId() {
    return this.chainId;
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Get account balance
   * @param {string} address - Ethereum address (optional, uses connected account if not provided)
   * @returns {Promise<string>} Balance in Wei
   */
  async getBalance(address = null) {
    try {
      const targetAddress = address || this.selectedAddress;
      
      if (!targetAddress) {
        throw new Error('No address provided and no account connected');
      }

      const balance = await this.provider.request({
        method: 'eth_getBalance',
        params: [targetAddress, 'latest']
      });

      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Convert Wei to Ether
   * @param {string} wei - Amount in Wei
   * @returns {string} Amount in Ether
   */
  weiToEther(wei) {
    return (parseInt(wei, 16) / 1e18).toFixed(4);
  }

  /**
   * Convert Ether to Wei
   * @param {string} ether - Amount in Ether
   * @returns {string} Amount in Wei (hex)
   */
  etherToWei(ether) {
    const wei = Math.floor(parseFloat(ether) * 1e18);
    return '0x' + wei.toString(16);
  }

  /**
   * Switch to a different network
   * @param {string} chainId - Chain ID in hex format (e.g., '0x1' for mainnet)
   */
  async switchNetwork(chainId) {
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
      this.chainId = chainId;
      console.log('Switched to network:', chainId);
      return { success: true, chainId };
    } catch (error) {
      console.error('Error switching network:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign a message
   * @param {string} message - Message to sign
   * @returns {Promise<string>} Signature
   */
  async signMessage(message) {
    try {
      if (!this.selectedAddress) {
        throw new Error('No account connected');
      }

      const signature = await this.provider.request({
        method: 'personal_sign',
        params: [message, this.selectedAddress]
      });

      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  /**
   * Send transaction
   * @param {Object} txParams - Transaction parameters
   * @returns {Promise<string>} Transaction hash
   */
  async sendTransaction(txParams) {
    try {
      if (!this.selectedAddress) {
        throw new Error('No account connected');
      }

      const txHash = await this.provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: this.selectedAddress,
          ...txParams
        }]
      });

      console.log('Transaction sent:', txHash);
      return txHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners for account and network changes
   */
  setupEventListeners() {
    if (!this.provider) return;

    // Handle account changes
    this.provider.on('accountsChanged', (accounts) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.selectedAddress = accounts[0];
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('eth:accountsChanged', { 
        detail: { accounts, address: this.selectedAddress } 
      }));
    });

    // Handle chain changes
    this.provider.on('chainChanged', (chainId) => {
      console.log('Chain changed:', chainId);
      this.chainId = chainId;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('eth:chainChanged', { 
        detail: { chainId } 
      }));
      
      // Reload the page as recommended by MetaMask
      // window.location.reload();
    });

    // Handle disconnect
    this.provider.on('disconnect', (error) => {
      console.log('MetaMask disconnected:', error);
      this.disconnect();
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('eth:disconnect', { 
        detail: { error } 
      }));
    });
  }

  /**
   * Remove event listeners
   */
  removeEventListeners() {
    if (!this.provider) return;
    
    this.provider.removeAllListeners('accountsChanged');
    this.provider.removeAllListeners('chainChanged');
    this.provider.removeAllListeners('disconnect');
  }

  /**
   * Get network name from chain ID
   * @param {string} chainId - Chain ID in hex format
   * @returns {string} Network name
   */
  getNetworkName(chainId = null) {
    const id = chainId || this.chainId;
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x2a': 'Kovan Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0xa4b1': 'Arbitrum One',
      '0xa4ba': 'Arbitrum Nova',
      '0xa': 'Optimism',
      '0x38': 'BSC Mainnet',
      '0x61': 'BSC Testnet'
    };
    
    return networks[id] || `Unknown Network (${id})`;
  }

  /**
   * Format address for display (0x1234...5678)
   * @param {string} address - Ethereum address
   * @returns {string} Formatted address
   */
  formatAddress(address = null) {
    const addr = address || this.selectedAddress;
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }
}

// Create singleton instance
const ethAdapter = new EthAdapter();

// Make it available globally for content scripts
if (typeof window !== 'undefined') {
  window.ethAdapter = ethAdapter;
}
