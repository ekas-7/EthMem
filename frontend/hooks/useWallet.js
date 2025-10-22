'use client'

import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'
import { SEPOLIA_CHAIN_ID, isSepoliaNetwork, formatSepoliaETH, SEPOLIA_CONFIG } from '../lib/sepoliaConfig'

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, error: connectError, isLoading: connectLoading } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, error: switchError, isLoading: switchLoading } = useSwitchChain()
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  })

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (bal) => {
    if (!bal) return '0'
    const balance = parseFloat(formatEther(bal.value)).toFixed(4)
    return isSepoliaNetwork(chainId) ? formatSepoliaETH(balance) : `${balance} ETH`
  }

  const connectWallet = (connector) => {
    try {
      connect({ connector })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  // Find MetaMask connector specifically
  const getMetaMaskConnector = () => {
    return connectors.find(connector => 
      connector.name.toLowerCase().includes('metamask') ||
      connector.id.toLowerCase().includes('metamask') ||
      connector.id === 'io.metamask'
    )
  }

  // Connect to MetaMask specifically
  const connectMetaMask = () => {
    const metaMaskConnector = getMetaMaskConnector()
    if (metaMaskConnector) {
      connectWallet(metaMaskConnector)
    } else {
      console.warn('MetaMask not found, using first available connector')
      const connector = connectors[0]
      if (connector) {
        connectWallet(connector)
      }
    }
  }

  const disconnectWallet = () => {
    disconnect()
  }

  const switchToSepolia = async () => {
    try {
      await switchChain({ chainId: SEPOLIA_CHAIN_ID })
    } catch (error) {
      console.error('Failed to switch to Sepolia:', error)
      throw error
    }
  }

  return {
    // Account info
    address,
    isConnected,
    isConnecting,
    formattedAddress: formatAddress(address),
    
    // Network info
    chainId,
    isSepolia: isSepoliaNetwork(chainId),
    
    // Balance info
    balance: balance ? formatBalance(balance) : '0',
    balanceLoading,
    
    // Connection methods
    connectWallet,
    connectMetaMask,
    disconnectWallet,
    switchToSepolia,
    connectors,
    getMetaMaskConnector,
    
    // Loading states
    connectLoading,
    connectError,
    switchLoading,
    switchError,
  }
}
