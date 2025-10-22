'use client'

import { useState, useEffect } from 'react'
import { Database, Trash2, Search, Download, Upload, RefreshCw, AlertCircle, CheckCircle, RotateCcw, ExternalLink, Loader2 } from 'lucide-react'
import extensionBridge from '../../../lib/extensionBridge'
import { uploadMemoriesToContract, isConnectedToSepolia } from '../../../lib/contractService'
import { useWallet } from '../../../hooks/useWallet'

export default function ExtensionDataViewer({ onMemoriesUpdate }) {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')
  const [extensionStatus, setExtensionStatus] = useState(null)
  const [error, setError] = useState(null)
  
  // Upload-related state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)
  const [isSepoliaConnected, setIsSepoliaConnected] = useState(false)
  
  // Wallet hook
  const { walletClient, address, isConnected } = useWallet()

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
        setMemories(extensionMemories)
        
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

  const categories = ['all', 'location', 'food', 'hobby', 'skill', 'language', 'preference', 'name', 'age', 'occupation']
  
  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.source?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'timestamp') {
      return sortOrder === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    }
    if (sortBy === 'confidence') {
      const aConf = a.metadata?.confidence || 0
      const bConf = b.metadata?.confidence || 0
      return sortOrder === 'desc' ? bConf - aConf : aConf - bConf
    }
    return 0
  })

  const getCategoryColor = (category) => {
    const colors = {
      location: 'bg-blue-500',
      food: 'bg-red-500',
      hobby: 'bg-green-500',
      skill: 'bg-purple-500',
      language: 'bg-yellow-500',
      preference: 'bg-pink-500',
      name: 'bg-indigo-500',
      age: 'bg-orange-500',
      occupation: 'bg-teal-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getStatusColor = (status) => {
    const colors = {
      local: 'text-yellow-400',
      synced: 'text-blue-400',
      'on-chain': 'text-green-400'
    }
    return colors[status] || 'text-gray-400'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  const handleDeleteMemory = async (memoryId) => {
    try {
      const success = await extensionBridge.deleteMemory(memoryId)
      if (success) {
        setMemories(memories.filter(m => m.id !== memoryId))
        
        // Notify parent component about the update
        if (onMemoriesUpdate) {
          onMemoriesUpdate()
        }
      } else {
        setError('Failed to delete memory')
      }
    } catch (err) {
      console.error('Error deleting memory:', err)
      setError('Failed to delete memory')
    }
  }

  const handleExportMemories = () => {
    const dataStr = JSON.stringify(memories, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'memories.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleRefresh = () => {
    loadExtensionData()
  }

  const handleReconnect = async () => {
    try {
      setLoading(true)
      const success = await extensionBridge.reconnect()
      if (success) {
        await loadExtensionData()
      } else {
        setError('Failed to reconnect. Please refresh the page.')
      }
    } catch (err) {
      console.error('Reconnection failed:', err)
      setError('Failed to reconnect. Please refresh the page.')
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

    if (memories.length === 0) {
      setError('No memories to upload')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(null)
      setUploadResult(null)
      setError(null)

      const result = await uploadMemoriesToContract(
        memories,
        walletClient,
        (progress) => {
          setUploadProgress(progress)
        }
      )

      setUploadResult(result)
      console.log('Upload successful:', result)
      
      // Update memory statuses to 'on-chain'
      setMemories(prevMemories => 
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

  return (
    <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-card-darker rounded-lg">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-dark-primary">Extension Data</h3>
          {extensionStatus && (
            <div className="flex items-center space-x-2">
              {extensionStatus.isAvailable ? (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-900/30 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-900/30 rounded-full border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-semibold text-red-400">Disconnected</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-card-darker hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportMemories}
            disabled={memories.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-card-darker hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-all border border-white/5"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleUploadToContract}
            disabled={uploading || memories.length === 0 || !isConnected || !isSepoliaConnected}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-emerald-500/30"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload to Contract'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm mb-3">{error}</p>
              {extensionBridge.isContextInvalidated() && (
                <div className="flex gap-2">
                  <button
                    onClick={handleReconnect}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Reconnect</span>
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && uploadProgress && (
        <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <div className="flex-1">
              <p className="text-blue-400 text-sm font-medium">{uploadProgress.message}</p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: uploadProgress.step === 'preparing' ? '25%' : 
                           uploadProgress.step === 'ipfs' ? '50%' : 
                           uploadProgress.step === 'contract' ? '75%' : 
                           uploadProgress.step === 'complete' ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-green-400 font-medium mb-2">Upload Successful!</h4>
              <div className="space-y-2 text-sm">
                <p className="text-green-300">
                  <strong>{uploadResult.totalMemories}</strong> memories uploaded to IPFS and stored on Sepolia
                </p>
                <div className="flex items-center space-x-4 text-xs text-green-400">
                  <span>Memory ID: {uploadResult.memoryId}</span>
                  <span>Gas Used: {uploadResult.gasUsed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${uploadResult.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Transaction</span>
                  </a>
                  <a
                    href={uploadResult.ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View on IPFS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Status */}
      {isConnected && (
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Network:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isSepoliaConnected ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
              }`}>
                {isSepoliaConnected ? 'Sepolia' : 'Wrong Network'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Wallet:</span>
              <span className="text-emerald-400 font-mono text-xs">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
              </span>
            </div>
          </div>
          {!isSepoliaConnected && (
            <p className="text-yellow-400 text-xs mt-2">
              Please switch to Sepolia network to upload memories to the contract
            </p>
          )}
        </div>
      )}

      {/* Extension Status Info */}
      {extensionStatus && !extensionStatus.isAvailable && (
        <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-400 mb-1">Extension Not Available</h4>
              <p className="text-sm text-yellow-300">
                Please install and enable the EthMem browser extension to view your memories.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {extensionStatus?.isAvailable && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card-darker border border-white/10 rounded-lg text-white placeholder-muted focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-card-darker border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              className="px-4 py-3 bg-card-darker border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="confidence-desc">Highest Confidence</option>
              <option value="confidence-asc">Lowest Confidence</option>
            </select>
          </div>
        </div>
      )}

      {/* Memories List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
          <span className="text-muted">Loading memories...</span>
        </div>
      ) : !extensionStatus?.isAvailable ? (
        <div className="text-center py-20">
          <div className="p-4 bg-card-darker rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-muted" />
          </div>
          <h3 className="text-lg font-medium text-sidebar-text mb-2">Extension Required</h3>
          <p className="text-muted">
            Install the EthMem browser extension to view your memories
          </p>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-20">
          <div className="p-4 bg-card-darker rounded-full w-fit mx-auto mb-4">
            <Database className="w-12 h-12 text-muted" />
          </div>
          <h3 className="text-lg font-medium text-sidebar-text mb-2">No memories found</h3>
          <p className="text-muted">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start chatting to create memories'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Entity</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Source</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Confidence</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Time</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMemories.map((memory) => (
                <tr 
                  key={memory.id} 
                  className="hover:bg-card-darker transition-colors group"
                >
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white ${getCategoryColor(memory.category)}`}>
                      {memory.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-white">{memory.entity}</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">
                      {memory.id.slice(0, 12)}...
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="text-sm text-gray-300 truncate">
                      {memory.description || '-'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-400 italic">
                      {memory.source || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${Math.round((memory.metadata?.confidence || 0) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {Math.round((memory.metadata?.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-medium ${getStatusColor(memory.status)}`}>
                      {memory.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(memory.timestamp)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDeleteMemory(memory.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats */}
      {extensionStatus?.isAvailable && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Showing {filteredMemories.length} of {memories.length} memories</span>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-muted">Local:</span>
                <span className="font-semibold text-sidebar-text">{memories.filter(m => m.status === 'local').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted">Synced:</span>
                <span className="font-semibold text-sidebar-text">{memories.filter(m => m.status === 'synced').length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted">On-chain:</span>
                <span className="font-semibold text-sidebar-text">{memories.filter(m => m.status === 'on-chain').length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}