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
  // Load initial state from localStorage
  const [extensionMemories, setExtensionMemories] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ethmem_extension_memories')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse saved memories:', e)
        }
      }
    }
    return []
  })
  const [loading, setLoading] = useState(true)
  const [extensionStatus, setExtensionStatus] = useState(null)
  const [error, setError] = useState(null)
  const [isSepoliaConnected, setIsSepoliaConnected] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(new Set())
  
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

  // Persist extension memories to localStorage whenever they change
  useEffect(() => {
    if (extensionMemories.length > 0) {
      try {
        localStorage.setItem('ethmem_extension_memories', JSON.stringify(extensionMemories))
      } catch (e) {
        console.error('Failed to save memories to localStorage:', e)
      }
    }
  }, [extensionMemories])

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
        const freshExtensionMemories = await extensionBridge.getMemories()
        
        // Get existing memories from state (which were loaded from localStorage)
        const existingMemories = extensionMemories || []
        
        // If extension has data, use it
        if (freshExtensionMemories && freshExtensionMemories.length > 0) {
          console.log('[UnifiedDataViewer] Loaded', freshExtensionMemories.length, 'memories from extension')
          setExtensionMemories(freshExtensionMemories)
        } else if (existingMemories.length > 0) {
          // If extension is empty but we have cached data, keep the cached data
          console.log('[UnifiedDataViewer] Extension empty, keeping', existingMemories.length, 'cached memories')
        } else {
          // Both are empty
          console.log('[UnifiedDataViewer] No memories available')
          setExtensionMemories([])
        }
        
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
      // Sync callback: push memories into extension IndexedDB
      const extensionSyncCallback = async (memories) => {
        const list = Array.isArray(memories) ? memories : [memories]
        // Flatten to plain extension memory structure
        const toSave = list.map(m => ({
          id: m.id || `mem-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
          timestamp: m.timestamp || Date.now(),
          category: m.category || 'general',
          entity: m.entity || 'Contract Memory',
          description: m.description || '',
          source: m.source || 'Smart Contract',
          status: 'synced',
          metadata: {
            ...(m.metadata || {}),
            contractStored: true,
            contractId: m.metadata?.contractId,
            ipfsHash: m.metadata?.ipfsHash
          }
        }))
        const ok = await extensionBridge.addMemories(toSave)
        return { id: ok ? toSave[0].id : undefined }
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

  // Build unified memory list (de-duplicated by content)
  const canonicalKey = (entity, description) => `${(entity || '').trim().toLowerCase()}__${(description || '').trim().toLowerCase()}`

  const flattenedContractItems = (contractData.contractMemories || []).flatMap(cm =>
    (cm.individualMemories || []).map(im => ({
      key: canonicalKey(im.entity, im.description),
      entity: im.entity,
      description: im.description,
      category: im.category,
      timestamp: cm.timestamp || im.timestamp,
      onChain: true,
      contractId: cm.contractId,
      ipfsHash: cm.ipfsHash,
      source: 'Smart Contract',
      original: im
    }))
  )

  const unifiedMap = new Map()

  // Seed with extension memories
  extensionMemories.forEach(em => {
    const key = canonicalKey(em.entity, em.description)
    const existing = unifiedMap.get(key)
    if (!existing) {
      unifiedMap.set(key, {
        key,
        entity: em.entity,
        description: em.description,
        category: em.category,
        timestamps: [em.timestamp],
        extension: { memory: em },
        contract: null,
      })
    } else {
      existing.extension = { memory: em }
      existing.timestamps.push(em.timestamp)
    }
  })

  // Merge contract items
  flattenedContractItems.forEach(ci => {
    const existing = unifiedMap.get(ci.key)
    if (!existing) {
      unifiedMap.set(ci.key, {
        key: ci.key,
        entity: ci.entity,
        description: ci.description,
        category: ci.category,
        timestamps: [ci.timestamp],
        extension: null,
        contract: { item: ci },
      })
    } else {
      existing.contract = { item: ci }
      existing.timestamps.push(ci.timestamp)
    }
  })

  const unifiedMemories = Array.from(unifiedMap.values())
    .map(u => ({
      ...u,
      latestTimestamp: Math.max(...u.timestamps.filter(Boolean))
    }))
    .sort((a, b) => (b.latestTimestamp || 0) - (a.latestTimestamp || 0))

  const isSelectableForUpload = (u) => !!(u.extension && !u.contract && (u.extension.memory.status !== 'on-chain' && !u.extension.memory.metadata?.contractId))

  const toggleSelect = (key) => {
    setSelectedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectAllUnsynced = () => {
    const next = new Set()
    unifiedMemories.forEach(u => { if (isSelectableForUpload(u)) next.add(u.key) })
    setSelectedKeys(next)
  }

  const clearSelection = () => setSelectedKeys(new Set())

  const handleUploadSelected = async () => {
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet first')
      return
    }
    if (!isSepoliaConnected) {
      setError('Please switch to Sepolia network to upload memories')
      return
    }
    const toUpload = unifiedMemories
      .filter(u => selectedKeys.has(u.key) && isSelectableForUpload(u))
      .map(u => u.extension.memory)
    if (toUpload.length === 0) return
    try {
      setUploading(true)
      setUploadProgress(null)
      setUploadResult(null)
      setError(null)
      const result = await uploadMemoriesToContract(toUpload, walletClient, (progress) => setUploadProgress(progress))
      setUploadResult(result)
      // Mark uploaded items as on-chain locally
      setExtensionMemories(prev => prev.map(m => {
        const key = canonicalKey(m.entity, m.description)
        if (selectedKeys.has(key)) {
          return { ...m, status: 'on-chain', metadata: { ...(m.metadata || {}), contractStored: true } }
        }
        return m
      }))
      clearSelection()
      if (onMemoriesUpdate) onMemoriesUpdate()
    } catch (err) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  return (
    <div className="bg-card-dark rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-2xl blur-xl"></div>
            <Database className="relative w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Memory Data</h3>
            <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
              {hasBothData ? (
                <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Extension + Smart Contract</>
              ) : hasExtensionData ? (
                <><Database className="w-3.5 h-3.5 text-blue-400" /> Extension Data</>
              ) : hasContractData ? (
                <><Cloud className="w-3.5 h-3.5 text-purple-400" /> Smart Contract Data</>
              ) : (
                <><AlertCircle className="w-3.5 h-3.5 text-gray-500" /> No data available</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadExtensionData}
            disabled={loading}
            className="group relative p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 border border-white/5 hover:border-white/20"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} group-hover:scale-110 transition-transform`} />
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Extension Status */}
        <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl transition-all ${hasExtensionData ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30' : 'bg-gray-500/20'}`}>
                <Database className={`w-5 h-5 ${hasExtensionData ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Extension</p>
                <p className="text-base font-bold text-white">
                  {hasExtensionData ? `${extensionMemories.length}` : '0'}
                </p>
              </div>
            </div>
            {hasExtensionData && (
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Contract Status */}
        <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl transition-all ${hasContractData ? 'bg-blue-500/20 ring-1 ring-blue-500/30' : 'bg-gray-500/20'}`}>
                <Cloud className={`w-5 h-5 ${hasContractData ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">On-Chain</p>
                <p className="text-base font-bold text-white">
                  {hasContractData ? `${contractData.totalContractMemories}` : '0'}
                </p>
              </div>
            </div>
            {hasContractData && (
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Sync Status */}
        <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl transition-all ${needsSync ? 'bg-yellow-500/20 ring-1 ring-yellow-500/30' : 'bg-green-500/20 ring-1 ring-green-500/30'}`}>
                {needsSync ? (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Status</p>
                <p className="text-base font-bold text-white">
                  {needsSync ? 'Pending' : 'Synced'}
                </p>
              </div>
            </div>
            {needsSync && (
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-red-300 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Unified Memories Section */}
      {unifiedMemories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <span>All Memories</span>
              <span className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white text-xs px-3 py-1.5 rounded-full font-semibold border border-white/10">
                {unifiedMemories.length}
              </span>
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={selectAllUnsynced}
                className="px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-xl text-white border border-white/10 hover:border-white/20 transition-all"
              >
                Select all unsynced
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-xl text-white border border-white/10 hover:border-white/20 transition-all"
              >
                Clear
              </button>
              <button
                onClick={handleUploadSelected}
                disabled={uploading || selectedKeys.size === 0}
                className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white flex items-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-400/20 transition-all"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload selected</span>
              </button>
              <button
                onClick={checkContractData}
                disabled={contractChecking}
                className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 border border-blue-400/20 transition-all"
              >
                {contractChecking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Refresh chain</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {unifiedMemories.map(u => (
              <div key={u.key} className="group bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 rounded-2xl p-4 flex items-start justify-between border border-white/5 hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedKeys.has(u.key)}
                    onChange={() => toggleSelect(u.key)}
                    disabled={!isSelectableForUpload(u)}
                    className="mt-1.5 w-4 h-4 accent-emerald-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h5 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{u.entity || 'Untitled Memory'}</h5>
                      {u.category && (
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 font-medium border border-purple-500/20">{u.category}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">{u.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-[10px]">
                      {u.extension && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30 flex items-center gap-1">
                          <Database className="w-3 h-3" /> extension
                        </span>
                      )}
                      {u.contract && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30 flex items-center gap-1">
                          <Cloud className="w-3 h-3" /> on-chain
                        </span>
                      )}
                      {!u.contract && u.extension && (
                        <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 font-medium border border-yellow-500/30 flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3" /> not on-chain
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px] text-gray-400 ml-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{u.latestTimestamp ? formatDate(u.latestTimestamp) : ''}</span>
                  </div>
                  {u.contract?.item?.ipfsHash && (
                    <div className="mt-2 flex items-center gap-1 justify-end bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                      <Hash className="w-3 h-3 text-purple-400" />
                      <code className="text-purple-300">{formatIPFSHash(u.contract.item.ipfsHash)}</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-Sync Notification */}
      {contractData.autoSyncedCount > 0 && (
        <div className="mb-6 p-5 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-green-500/20 rounded-xl ring-1 ring-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-green-400 mb-1">Auto-Synchronized</h4>
              <p className="text-xs text-green-300">
                {contractData.autoSyncedCount} local memories automatically matched with blockchain data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl text-xs border border-white/10 backdrop-blur-sm">
          <h5 className="text-gray-300 mb-3 font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" /> Debug Info
          </h5>
          <div className="grid grid-cols-2 gap-2 text-gray-300">
            <div className="bg-white/5 p-2 rounded-lg"><span className="text-gray-400">needsSync:</span> <span className="font-mono text-emerald-400">{needsSync ? 'true' : 'false'}</span></div>
            <div className="bg-white/5 p-2 rounded-lg"><span className="text-gray-400">hasNewMemories:</span> <span className="font-mono text-emerald-400">{hasNewMemories ? 'true' : 'false'}</span></div>
            <div className="bg-white/5 p-2 rounded-lg"><span className="text-gray-400">newMemories:</span> <span className="font-mono text-blue-400">{contractData.newMemories?.length || 0}</span></div>
            <div className="bg-white/5 p-2 rounded-lg"><span className="text-gray-400">updatedMemories:</span> <span className="font-mono text-blue-400">{contractData.updatedMemories?.length || 0}</span></div>
            <div className="bg-white/5 p-2 rounded-lg"><span className="text-gray-400">autoSyncedCount:</span> <span className="font-mono text-purple-400">{contractData.autoSyncedCount || 0}</span></div>
            <div className="bg-white/5 p-2 rounded-lg col-span-2"><span className="text-gray-400">hasUnsyncedExtensionData:</span> <span className="font-mono text-yellow-400">{hasUnsyncedExtensionData ? 'true' : 'false'}</span></div>
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className="space-y-4">
        {/* Sync from Contract */}
        {needsSync && (
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-blue-500/30 rounded-2xl p-5 backdrop-blur-sm hover:border-blue-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-start gap-4">
                <div className="p-2.5 bg-blue-500/20 rounded-xl ring-1 ring-blue-500/30">
                  <Download className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-400 mb-1">Sync from Contract</h4>
                  <p className="text-xs text-blue-300 mb-2 font-medium">
                    {hasNewMemories && `${contractData.newMemories?.length || 0} new memories available from contract`}
                    {hasUpdatedMemories && ` • ${contractData.updatedMemories?.length || 0} updated memories`}
                  </p>
                  <p className="text-xs text-gray-400">
                    Download these memories to your extension
                  </p>
                </div>
              </div>
              <button
                onClick={handleSync}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/20 border border-blue-400/20"
              >
                <Download className="w-4 h-4" />
                <span>Sync from Contract</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload to Contract */}
        {hasUnsyncedExtensionData && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-sm hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-start gap-4">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl ring-1 ring-emerald-500/30">
                  <Upload className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 mb-1">Upload to Contract</h4>
                  <p className="text-xs text-emerald-300 mb-2 font-medium">
                    {extensionMemories.filter(m => m.status !== 'on-chain' && m.status !== 'synced' && !m.metadata?.contractId).length} local memories not yet on blockchain
                  </p>
                  <p className="text-xs text-gray-400">
                    Store your memories on the blockchain for permanent storage
                  </p>
                </div>
              </div>
              {isConnected && isSepoliaConnected ? (
                <button
                  onClick={handleUploadToContract}
                  disabled={uploading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Uploading...' : 'Upload to Contract'}</span>
                </button>
              ) : (
                <div className="text-xs text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  {!isConnected ? 'Connect wallet to upload' : 'Switch to Sepolia network'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Synchronized Status */}
        {!needsSync && !hasUnsyncedExtensionData && hasBothData && (
          <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-green-500/20 rounded-xl ring-1 ring-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-400 mb-1">Data Synchronized</h4>
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
        <div className="text-center py-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
            <div className="relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-full border border-white/10">
              <Database className="w-14 h-14 text-gray-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Memory Data</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
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
