'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatEther } from 'viem'

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, error: connectError, isLoading: connectLoading } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  })

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (bal) => {
    if (!bal) return '0'
    return parseFloat(formatEther(bal.value)).toFixed(4)
  }

  const connectWallet = (connector) => {
    connect({ connector })
  }

  const disconnectWallet = () => {
    disconnect()
  }

  return {
    // Account info
    address,
    isConnected,
    isConnecting,
    formattedAddress: formatAddress(address),
    
    // Balance info
    balance: balance ? formatBalance(balance) : '0',
    balanceLoading,
    
    // Connection methods
    connectWallet,
    disconnectWallet,
    connectors,
    
    // Loading states
    connectLoading,
    connectError,
  }
}
