'use client'

import { useWallet } from '../../../hooks/useWallet'
import { SEPOLIA_INFO, SEPOLIA_FAUCETS } from '../../../lib/sepoliaConfig'
import { AlertTriangle, ExternalLink, Coins, Info, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function SepoliaStatus() {
  const { isConnected, isSepolia, chainId, switchToSepolia, switchLoading, switchError } = useWallet()
  const [showFaucets, setShowFaucets] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSwitchToSepolia = async () => {
    setIsSwitching(true)
    try {
      await switchToSepolia()
    } catch (error) {
      console.error('Failed to switch to Sepolia:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  if (!isConnected) return null

  return (
    <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-yellow-400 mb-1">
              {isSepolia ? 'Sepolia Testnet Active' : 'Wrong Network'}
            </h4>
            <button
              onClick={() => setShowFaucets(!showFaucets)}
              className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-1"
            >
              <Coins className="w-4 h-4" />
              <span>Get Test ETH</span>
            </button>
          </div>
          
          {isSepolia ? (
            <div className="space-y-2">
              <p className="text-sm text-yellow-300">
                You're connected to Sepolia testnet. This is a testing environment - no real ETH is used.
              </p>
              
              {showFaucets && (
                <div className="mt-3 p-3 bg-yellow-900/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Get Test ETH</span>
                  </div>
                  <p className="text-xs text-yellow-300 mb-3">
                    Use these faucets to get free Sepolia ETH for testing:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SEPOLIA_FAUCETS.map((faucet, index) => (
                      <a
                        key={index}
                        href={faucet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-xs text-yellow-300 hover:text-yellow-200 bg-yellow-900/20 hover:bg-yellow-900/30 px-2 py-1 rounded transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">
                          {faucet.replace('https://', '').replace('www.', '')}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-300">
                Please switch to Sepolia testnet (Chain ID: {SEPOLIA_INFO.chainId}) to use this application.
              </p>
              <div className="text-xs text-gray-400">
                <p>Current network: Chain ID {chainId}</p>
                <p>Required network: Sepolia (Chain ID {SEPOLIA_INFO.chainId})</p>
              </div>
              
              <button
                onClick={handleSwitchToSepolia}
                disabled={isSwitching || switchLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${(isSwitching || switchLoading) ? 'animate-spin' : ''}`} />
                <span>
                  {isSwitching || switchLoading ? 'Switching...' : 'Switch to Sepolia'}
                </span>
              </button>
              
              {switchError && (
                <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                  <p>Failed to switch network: {switchError.message}</p>
                  <p className="mt-1">Please manually switch to Sepolia in your wallet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
