'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  Cloud, 
  RefreshCw, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ExternalLink,
  Hash,
  Clock,
  Info
} from 'lucide-react'
import extensionBridge from '../../../lib/extensionBridge'
import { uploadMemoriesToContract, isConnectedToSepolia } from '../../../services/contractService'
import { useWallet } from '../../../hooks/useWallet'
import { useContractData } from '../../../hooks/useContractData'

export default function UnifiedDataViewer({ onMemoriesUpdate }) {
  const [extensionMemories, setExtensionMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [extensionStatus, setExtensionStatus] = useState(null)
  const [error, setError] = useState(null)
  const [isSepoliaConnected, setIsSepoliaConnected] = useState(false)
  
  // Upload-related state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)
  
  // Wallet hook
  const { walletClient, address, isConnected } = useWallet()
  
  // Contract data hook
  const {
    contractData,
    isChecking: contractChecking,
    hasNewMemories,
    hasUpdatedMemories,
    needsSync,
    checkContractData,
    syncNewMemories,
    getSummary
  } = useContractData(extensionMemories)

  // Load data from extension
  useEffect(() => {
    loadExtensionData()
  }, [])

  // Check Sepolia connection when wallet changes
  useEffect(() => {
    const checkSepoliaConnection = async () => {
      if (walletClient && isConnected) {
        try {
          const isSepolia = await isConnectedToSepolia(walletClient)
          setIsSepoliaConnected(isSepolia)
        } catch (error) {
          console.error('Error checking Sepolia connection:', error)
          setIsSepoliaConnected(false)
        }
      } else {
        setIsSepoliaConnected(false)
      }
    }

    checkSepoliaConnection()
  }, [walletClient, isConnected])

  const loadExtensionData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check extension status
      const status = await extensionBridge.getExtensionStatus()
      setExtensionStatus(status)
      
      if (status.isAvailable) {
        // Load memories from extension
        const extensionMemories = await extensionBridge.getMemories()
        setExtensionMemories(extensionMemories)
        
        // Notify parent component about the update
        if (onMemoriesUpdate) {
          onMemoriesUpdate()
        }
      } else {
        // Check if it's a context invalidated error
        if (extensionBridge.isContextInvalidated()) {
          setError('Extension disconnected. Please refresh the page to reconnect.')
        } else {
          setError('Extension not available. Please install and enable the EthMem extension.')
        }
      }
    } catch (err) {
      console.error('Error loading extension data:', err)
      setError('Failed to load data from extension')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadToContract = async () => {
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet first')
      return
    }

    if (!isSepoliaConnected) {
      setError('Please switch to Sepolia network to upload memories')
      return
    }

    if (extensionMemories.length === 0) {
      setError('No memories to upload')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(null)
      setUploadResult(null)
      setError(null)

      const result = await uploadMemoriesToContract(
        extensionMemories,
        walletClient,
        (progress) => {
          setUploadProgress(progress)
        }
      )

      setUploadResult(result)
      console.log('Upload successful:', result)
      
      // Update memory statuses to 'on-chain'
      setExtensionMemories(prevMemories => 
        prevMemories.map(memory => ({
          ...memory,
          status: 'on-chain'
        }))
      )
      
      // Notify parent component about the update
      if (onMemoriesUpdate) {
        onMemoriesUpdate()
      }

    } catch (err) {
      console.error('Upload failed:', err)
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const handleSync = async () => {
    if (!hasNewMemories && !hasUpdatedMemories) return

    try {
      // Simple sync callback that just returns the memory ID
      const extensionSyncCallback = async (memory) => {
        console.log('[UnifiedDataViewer] Syncing memory:', memory)
        return { id: memory.id }
      }

      const result = await syncNewMemories(extensionSyncCallback)
      
      // Add synced memories to extension memories
      if (result.syncedMemories && result.syncedMemories.length > 0) {
        setExtensionMemories(prev => [...result.syncedMemories, ...prev])
        if (onMemoriesUpdate) {
          onMemoriesUpdate()
        }
      }
      
    } catch (error) {
      console.error('[UnifiedDataViewer] Sync error:', error)
      setError(`Sync failed: ${error.message}`)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatIPFSHash = (hash) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`
  }

  // Determine what data sources are available
  const hasExtensionData = extensionStatus?.isAvailable && extensionMemories.length > 0
  const hasContractData = contractData.available && contractData.contractMemories.length > 0
  const hasBothData = hasExtensionData && hasContractData
  const hasAnyData = hasExtensionData || hasContractData
  
  // Check if there are extension memories not on contract
  const hasUnsyncedExtensionData = hasExtensionData && extensionMemories.some(mem => 
    mem.status !== 'on-chain' && mem.status !== 'synced' && !mem.metadata?.contractId
  )

  return (
    <div className="bg-gradient-to-br from-card-dark to-card-darker rounded-2xl p-6 shadow-xl border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl">
            <Database className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Memory Data</h3>
            <p className="text-sm text-gray-400">
              {hasBothData ? 'Extension + Smart Contract' : 
               hasExtensionData ? 'Extension Data' : 
               hasContractData ? 'Smart Contract Data' : 
               'No data available'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadExtensionData}
            disabled={loading}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Extension Status */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${hasExtensionData ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Extension</p>
              <p className="text-sm font-semibold text-white">
                {hasExtensionData ? `${extensionMemories.length} memories` : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Status */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${hasContractData ? 'bg-blue-500/20' : 'bg-gray-500/20'}`}>
              <Cloud className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Smart Contract</p>
              <p className="text-sm font-semibold text-white">
                {hasContractData ? `${contractData.totalContractMemories} memories` : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${needsSync ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
              {needsSync ? (
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400">Sync Status</p>
              <p className="text-sm font-semibold text-white">
                {needsSync ? 'Sync available' : 'Up to date'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Extension Data Section */}
      {hasExtensionData && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Extension Memories</span>
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                {extensionMemories.length}
              </span>
            </h4>
          </div>
          
          <div className="space-y-3">
            {extensionMemories.slice(0, 3).map((memory, index) => (
              <div key={memory.id} className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg p-3 border border-emerald-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-white">{memory.entity || 'Untitled Memory'}</h5>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {memory.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded">
                        {memory.category || 'general'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(memory.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      memory.status === 'on-chain' ? 'bg-blue-600/20 text-blue-300' :
                      memory.status === 'synced' ? 'bg-green-600/20 text-green-300' :
                      'bg-gray-600/20 text-gray-300'
                    }`}>
                      {memory.status || 'local'}
                    </span>
                    {memory.metadata?.contractStored && (
                      <span className="text-xs text-green-400 flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>On Blockchain</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {extensionMemories.length > 3 && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-400">
                  + {extensionMemories.length - 3} more extension memories
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contract Data Section */}
      {hasContractData && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              <span>Smart Contract Memories</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {contractData.totalContractMemories}
              </span>
            </h4>
            <button
              onClick={checkContractData}
              disabled={contractChecking}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {contractChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {contractData.contractMemories.slice(0, 3).map((mem, idx) => (
              <div key={idx} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">Contract #{mem.contractId}</span>
                      <span className="text-xs text-blue-300">
                        {mem.individualMemories?.length || 0} memories
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <code className="text-xs bg-gray-800 px-2 py-1 rounded text-blue-300">
                        {formatIPFSHash(mem.ipfsHash)}
                      </code>
                    </div>
                    {mem.individualMemories && mem.individualMemories.length > 0 && (
                      <div className="space-y-1">
                        {mem.individualMemories.slice(0, 2).map((individual, i) => (
                          <div key={i} className="bg-white/5 rounded p-2">
                            <p className="text-xs font-medium text-white">{individual.entity || 'Untitled'}</p>
                            <p className="text-xs text-gray-300 line-clamp-1">
                              {individual.description || 'No description'}
                            </p>
                          </div>
                        ))}
                        {mem.individualMemories.length > 2 && (
                          <p className="text-xs text-gray-400">
                            + {mem.individualMemories.length - 2} more memories
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {contractData.contractMemories.length > 3 && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-400">
                  + {contractData.contractMemories.length - 3} more contract memories
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auto-Sync Notification */}
      {contractData.autoSyncedCount > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-400">Auto-Synchronized</h4>
              <p className="text-xs text-green-300">
                {contractData.autoSyncedCount} local memories automatically matched with blockchain data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-xs">
          <h5 className="text-gray-400 mb-2">Debug Info:</h5>
          <div className="space-y-1 text-gray-300">
            <div>needsSync: {needsSync ? 'true' : 'false'}</div>
            <div>hasNewMemories: {hasNewMemories ? 'true' : 'false'}</div>
            <div>hasUpdatedMemories: {hasUpdatedMemories ? 'true' : 'false'}</div>
            <div>newMemories count: {contractData.newMemories?.length || 0}</div>
            <div>updatedMemories count: {contractData.updatedMemories?.length || 0}</div>
            <div>autoSyncedCount: {contractData.autoSyncedCount || 0}</div>
            <div>hasUnsyncedExtensionData: {hasUnsyncedExtensionData ? 'true' : 'false'}</div>
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className="space-y-4">
        {/* Sync from Contract */}
        {needsSync && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-400 mb-1">Sync from Contract</h4>
                <p className="text-xs text-blue-300 mb-2">
                  {hasNewMemories && `${contractData.newMemories?.length || 0} new memories available from contract`}
                  {hasUpdatedMemories && ` • ${contractData.updatedMemories?.length || 0} updated memories`}
                </p>
                <p className="text-xs text-gray-400">
                  Download these memories to your extension
                </p>
              </div>
              <button
                onClick={handleSync}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Sync from Contract</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload to Contract */}
        {hasUnsyncedExtensionData && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-emerald-400 mb-1">Upload to Contract</h4>
                <p className="text-xs text-emerald-300 mb-2">
                  {extensionMemories.filter(m => m.status !== 'on-chain' && m.status !== 'synced' && !m.metadata?.contractId).length} local memories not yet on blockchain
                </p>
                <p className="text-xs text-gray-400">
                  Store your memories on the blockchain for permanent storage
                </p>
              </div>
              {isConnected && isSepoliaConnected ? (
                <button
                  onClick={handleUploadToContract}
                  disabled={uploading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 transition-all"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Uploading...' : 'Upload to Contract'}</span>
                </button>
              ) : (
                <div className="text-xs text-gray-400">
                  {!isConnected ? 'Connect wallet to upload' : 'Switch to Sepolia network'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Synchronized Status */}
        {!needsSync && !hasUnsyncedExtensionData && hasBothData && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-400">Data Synchronized</h4>
                <p className="text-xs text-green-300">
                  Your memories are stored in both extension and blockchain
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {!hasAnyData && !loading && (
        <div className="text-center py-8">
          <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No Memory Data</h3>
          <p className="text-gray-500 text-sm">
            {!extensionStatus?.isAvailable 
              ? 'Install the EthMem extension to start collecting memories'
              : 'Start chatting to create memories or upload existing ones to the contract'
            }
          </p>
        </div>
      )}
    </div>
  )
}
