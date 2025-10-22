'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '../hooks/useWallet'
import { User, Wallet, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'

export default function ConnectWallet({ className = '', variant = 'default' }) {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    formattedAddress, 
    balance, 
    connectWallet, 
    connectMetaMask,
    disconnectWallet, 
    connectors,
    connectError,
    getMetaMaskConnector
  } = useWallet()
  
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()

  const handleConnect = () => {
    // Try to connect to MetaMask specifically
    const metaMaskConnector = getMetaMaskConnector()
    if (metaMaskConnector) {
      console.log('Connecting to MetaMask...')
      connectMetaMask()
    } else {
      console.log('MetaMask not found, using first available connector')
      const connector = connectors[0]
      if (connector) {
        connectWallet(connector)
      } else {
        console.error('No wallet connectors available')
      }
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setShowDropdown(false)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
    setShowDropdown(false)
  }

  if (isConnected) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
        >
          <Wallet size={16} />
          <span className="hidden sm:inline">{formattedAddress}</span>
          <span className="sm:hidden">Connected</span>
          <ChevronDown size={16} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Connected Wallet</p>
              <p className="text-xs text-gray-500 font-mono">{address}</p>
            </div>
            
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-sm font-medium text-gray-900">{balance} ETH</span>
              </div>
            </div>

            <button
              onClick={handleGoToDashboard}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <LayoutDashboard size={16} />
              Go to Dashboard
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut size={16} />
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {connectError && (
        <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          <strong>Connection Error:</strong> {connectError.message}
        </div>
      )}
      
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-colors ${
          variant === 'primary' 
            ? 'bg-emerald-400 hover:bg-emerald-500 text-black' 
            : 'bg-emerald-400 hover:bg-emerald-500 text-black'
        } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <User size={16} />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    </div>
  )
}
