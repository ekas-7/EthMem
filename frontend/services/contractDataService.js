'use client'

import { 
  getMemoriesByAddress, 
  getMemory, 
  getTotalMemoryCount,
  isMemoryOwner,
  isConnectedToSepolia 
} from './contractService'
import { retrieveFromIPFS } from '../lib/ipfsService'

/**
 * Service for managing smart contract data synchronization
 */
class ContractDataService {
  constructor() {
    this.isChecking = false
    this.lastCheckTime = null
    this.checkInterval = null
    this.listeners = new Set()
  }

  /**
   * Add listener for data updates
   * @param {Function} callback - Callback function to call on updates
   */
  addListener(callback) {
    this.listeners.add(callback)
  }

  /**
   * Remove listener
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners.delete(callback)
  }

  /**
   * Notify all listeners of data updates
   * @param {Object} data - Update data to send to listeners
   */
  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('[ContractDataService] Error in listener callback:', error)
      }
    })
  }

  /**
   * Check if contract data is available and different from extension data
   * @param {Object} walletClient - Wagmi wallet client
   * @param {string} userAddress - User's wallet address
   * @param {Array} extensionMemories - Current extension memories
   * @returns {Promise<Object>} - Contract data status and differences
   */
  async checkContractDataAvailability(walletClient, userAddress, extensionMemories = []) {
    try {
      console.log('[ContractDataService] Checking contract data availability...')
      
      // Check if connected to Sepolia
      const isSepolia = await isConnectedToSepolia(walletClient)
      if (!isSepolia) {
        return {
          available: false,
          reason: 'Not connected to Sepolia network',
          contractMemories: [],
          newMemories: [],
          updatedMemories: [],
          totalContractMemories: 0
        }
      }

      // Get all memory IDs for the user from contract
      const contractMemoryIds = await getMemoriesByAddress(userAddress, walletClient)
      console.log('[ContractDataService] Found', contractMemoryIds.length, 'memories in contract')

      if (contractMemoryIds.length === 0) {
        return {
          available: true,
          reason: 'No memories found in contract',
          contractMemories: [],
          newMemories: [],
          updatedMemories: [],
          totalContractMemories: 0
        }
      }

      // Fetch all contract memories with IPFS data
      const contractMemories = await this.fetchContractMemories(contractMemoryIds, walletClient)
      
      // Compare with extension memories
      const comparison = this.compareMemories(contractMemories, extensionMemories)

      return {
        available: true,
        reason: 'Contract data available',
        contractMemories,
        newMemories: comparison.newMemories,
        updatedMemories: comparison.updatedMemories,
        totalContractMemories: contractMemories.length,
        lastCheckTime: new Date().toISOString()
      }

    } catch (error) {
      console.error('[ContractDataService] Error checking contract data:', error)
      return {
        available: false,
        reason: `Error: ${error.message}`,
        contractMemories: [],
        newMemories: [],
        updatedMemories: [],
        totalContractMemories: 0,
        error: error.message
      }
    }
  }

  /**
   * Fetch memories from contract with IPFS data
   * @param {Array} memoryIds - Array of memory IDs from contract
   * @param {Object} walletClient - Wagmi wallet client
   * @returns {Promise<Array>} - Array of memory objects with IPFS data
   */
  async fetchContractMemories(memoryIds, walletClient) {
    const memories = []
    
    for (const memoryId of memoryIds) {
      try {
        // Get memory data from contract
        const contractData = await getMemory(memoryId, walletClient)
        
        // Fetch IPFS data
        const ipfsData = await retrieveFromIPFS(contractData.ipfsHash)
        
        // Transform to standard memory format
        const memory = {
          id: `contract-${memoryId}`,
          contractId: memoryId,
          timestamp: parseInt(contractData.timestamp) * 1000, // Convert to milliseconds
          owner: contractData.owner,
          ipfsHash: contractData.ipfsHash,
          source: 'Smart Contract',
          status: 'stored',
          // Extract memories from IPFS data
          memories: ipfsData.memories || [],
          // Store the full IPFS data for display
          ipfsData: ipfsData,
          // Create individual memory entries for display
          individualMemories: this.extractIndividualMemories(ipfsData, memoryId),
          metadata: {
            ...ipfsData.metadata,
            contractStored: true,
            contractId: memoryId,
            ipfsHash: contractData.ipfsHash,
            ipfsUrl: `https://gateway.pinata.cloud/ipfs/${contractData.ipfsHash}`
          }
        }
        
        memories.push(memory)
        
      } catch (error) {
        console.error(`[ContractDataService] Error fetching memory ${memoryId}:`, error)
        // Add error memory entry
        memories.push({
          id: `contract-${memoryId}`,
          contractId: memoryId,
          timestamp: Date.now(),
          source: 'Smart Contract',
          status: 'error',
          error: error.message,
          memories: [],
          metadata: {
            contractStored: true,
            contractId: memoryId,
            error: error.message
          }
        })
      }
    }
    
    return memories
  }

  /**
   * Compare contract memories with extension memories
   * @param {Array} contractMemories - Memories from contract
   * @param {Array} extensionMemories - Memories from extension
   * @returns {Object} - Comparison results
   */
  compareMemories(contractMemories, extensionMemories) {
    const newMemories = []
    const updatedMemories = []
    
    console.log('[ContractDataService] Comparing memories:', {
      contractCount: contractMemories.length,
      extensionCount: extensionMemories.length
    })
    
    // Create lookup maps for extension memories
    const extensionByContractId = new Map()
    const extensionByContent = new Map()
    
    extensionMemories.forEach(mem => {
      // Map by contract ID if available
      if (mem.metadata?.contractId) {
        extensionByContractId.set(mem.metadata.contractId, mem)
      }
      
      // Map by content for fuzzy matching
      const contentKey = `${mem.entity || ''}-${mem.description || ''}`.toLowerCase().trim()
      if (contentKey) {
        extensionByContent.set(contentKey, mem)
      }
    })
    
    console.log('[ContractDataService] Extension maps:', {
      byContractId: extensionByContractId.size,
      byContent: extensionByContent.size
    })
    
    // Check each contract memory
    contractMemories.forEach(contractMem => {
      let isAlreadySynced = false
      let matchingExtensionMem = null
      
      // First, try to match by contract ID
      if (contractMem.contractId) {
        matchingExtensionMem = extensionByContractId.get(contractMem.contractId)
        if (matchingExtensionMem) {
          isAlreadySynced = true
          console.log('[ContractDataService] Found match by contract ID:', contractMem.contractId)
        }
      }
      
      // If no match by contract ID, try to match by content
      if (!isAlreadySynced && contractMem.individualMemories) {
        for (const individualMem of contractMem.individualMemories) {
          const contentKey = `${individualMem.entity || ''}-${individualMem.description || ''}`.toLowerCase().trim()
          if (contentKey) {
            matchingExtensionMem = extensionByContent.get(contentKey)
            if (matchingExtensionMem) {
              isAlreadySynced = true
              console.log('[ContractDataService] Found match by content:', contentKey)
              
              // Update the extension memory to mark it as synced
              matchingExtensionMem.status = 'synced'
              matchingExtensionMem.metadata = {
                ...matchingExtensionMem.metadata,
                contractId: contractMem.contractId,
                ipfsHash: contractMem.ipfsHash,
                contractStored: true
              }
              
              break
            }
          }
        }
      }
      
      if (!isAlreadySynced) {
        // New memory from contract
        console.log('[ContractDataService] New memory from contract:', contractMem.contractId)
        newMemories.push(contractMem)
      } else {
        // Check if memory was updated (different timestamp or IPFS hash)
        const contractTimestamp = contractMem.timestamp
        const extensionTimestamp = matchingExtensionMem.timestamp
        
        if (contractTimestamp > extensionTimestamp || 
            contractMem.ipfsHash !== matchingExtensionMem.metadata?.ipfsHash) {
          console.log('[ContractDataService] Updated memory:', contractMem.contractId)
          updatedMemories.push({
            contract: contractMem,
            extension: matchingExtensionMem
          })
        } else {
          console.log('[ContractDataService] Memory already synced:', contractMem.contractId)
        }
      }
    })
    
    console.log('[ContractDataService] Comparison results:', {
      newMemories: newMemories.length,
      updatedMemories: updatedMemories.length
    })
    
    // Notify about auto-synced memories
    const autoSyncedCount = extensionMemories.filter(mem => 
      mem.metadata?.contractStored && mem.status === 'synced'
    ).length
    
    if (autoSyncedCount > 0) {
      console.log('[ContractDataService] Auto-synced', autoSyncedCount, 'memories by content matching')
    }
    
    return {
      newMemories,
      updatedMemories,
      totalNew: newMemories.length,
      totalUpdated: updatedMemories.length,
      autoSyncedCount
    }
  }

  /**
   * Start automatic checking for contract data
   * @param {Object} walletClient - Wagmi wallet client
   * @param {string} userAddress - User's wallet address
   * @param {Array} extensionMemories - Current extension memories
   * @param {number} intervalMs - Check interval in milliseconds (default: 30000 = 30 seconds)
   */
  startAutoCheck(walletClient, userAddress, extensionMemories, intervalMs = 30000) {
    if (this.checkInterval) {
      this.stopAutoCheck()
    }

    console.log('[ContractDataService] Starting auto-check with interval:', intervalMs, 'ms')
    
    // Initial check
    this.performCheck(walletClient, userAddress, extensionMemories)
    
    // Set up interval
    this.checkInterval = setInterval(() => {
      this.performCheck(walletClient, userAddress, extensionMemories)
    }, intervalMs)
  }

  /**
   * Stop automatic checking
   */
  stopAutoCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('[ContractDataService] Stopped auto-check')
    }
  }

  /**
   * Perform a single check for contract data
   * @param {Object} walletClient - Wagmi wallet client
   * @param {string} userAddress - User's wallet address
   * @param {Array} extensionMemories - Current extension memories
   */
  async performCheck(walletClient, userAddress, extensionMemories) {
    if (this.isChecking) {
      console.log('[ContractDataService] Check already in progress, skipping...')
      return
    }

    this.isChecking = true
    this.lastCheckTime = new Date()

    try {
      const result = await this.checkContractDataAvailability(
        walletClient, 
        userAddress, 
        extensionMemories
      )
      
      // Notify listeners
      this.notifyListeners({
        type: 'contract_data_check',
        data: result,
        timestamp: this.lastCheckTime.toISOString()
      })

    } catch (error) {
      console.error('[ContractDataService] Error in auto-check:', error)
      this.notifyListeners({
        type: 'contract_data_error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      this.isChecking = false
    }
  }

  /**
   * Get current status of the service
   * @returns {Object} - Service status
   */
  getStatus() {
    return {
      isChecking: this.isChecking,
      lastCheckTime: this.lastCheckTime?.toISOString(),
      hasInterval: !!this.checkInterval,
      listenerCount: this.listeners.size
    }
  }

  /**
   * Sync new memories from contract to extension
   * @param {Array} newMemories - New memories from contract
   * @param {Function} extensionSyncCallback - Callback to sync with extension
   * @returns {Promise<Object>} - Sync result
   */
  async syncNewMemories(newMemories, extensionSyncCallback) {
    try {
      console.log('[ContractDataService] Syncing', newMemories.length, 'new memories')
      
      const syncResults = []
      const allSyncedMemories = []
      
      for (const contractMemory of newMemories) {
        try {
          // Transform contract memory to extension format (returns array of individual memories)
          const individualMemories = this.transformContractToExtension(contractMemory)
          
          // Sync each individual memory
          for (const memory of individualMemories) {
            if (extensionSyncCallback) {
              const result = await extensionSyncCallback(memory)
              allSyncedMemories.push(memory)
              syncResults.push({
                success: true,
                contractId: contractMemory.contractId,
                extensionId: result.id || memory.id
              })
            }
          }
          
        } catch (error) {
          console.error('[ContractDataService] Error syncing memory:', error)
          syncResults.push({
            success: false,
            contractId: contractMemory.contractId,
            error: error.message
          })
        }
      }
      
      return {
        success: true,
        syncedCount: syncResults.filter(r => r.success).length,
        totalCount: allSyncedMemories.length,
        results: syncResults,
        syncedMemories: allSyncedMemories
      }
      
    } catch (error) {
      console.error('[ContractDataService] Error in sync process:', error)
      throw error
    }
  }

  /**
   * Extract individual memories from IPFS data
   * @param {Object} ipfsData - IPFS data object
   * @param {string} contractId - Contract memory ID
   * @returns {Array} - Array of individual memory objects
   */
  extractIndividualMemories(ipfsData, contractId) {
    console.log('[ContractDataService] Extracting individual memories from IPFS data:', ipfsData)
    
    const memories = ipfsData.memories || []
    console.log('[ContractDataService] Found', memories.length, 'memories in IPFS data')
    
    return memories.map((mem, index) => ({
      id: `contract-${contractId}-${index}`,
      timestamp: ipfsData.metadata?.uploadTimestamp ? new Date(ipfsData.metadata.uploadTimestamp).getTime() : Date.now(),
      category: mem.category || 'general',
      entity: mem.entity || mem.title || 'Contract Memory',
      description: mem.description || mem.content || '',
      source: 'Smart Contract',
      status: 'stored',
      contractId: contractId,
      ipfsHash: ipfsData.metadata?.ipfsHash,
      metadata: {
        ...mem.metadata,
        contractId: contractId,
        contractStored: true,
        extractedFromIPFS: true,
        originalMemory: mem
      }
    }))
  }

  /**
   * Transform contract memory to extension format
   * @param {Object} contractMemory - Memory from contract
   * @returns {Array} - Array of memories in extension format
   */
  transformContractToExtension(contractMemory) {
    console.log('[ContractDataService] Transforming contract memory:', contractMemory)
    
    // Use the individual memories that were already extracted
    const individualMemories = contractMemory.individualMemories || []
    console.log('[ContractDataService] Found', individualMemories.length, 'individual memories')
    
    const transformedMemories = individualMemories.map((mem, index) => {
      const transformed = {
        id: `synced-${Date.now()}-${index}`,
        timestamp: mem.timestamp,
        category: mem.category || 'general',
        entity: mem.entity || 'Contract Memory',
        description: mem.description || '',
        source: 'Smart Contract',
        status: 'synced',
        metadata: {
          ...mem.metadata,
          contractId: contractMemory.contractId,
          ipfsHash: contractMemory.ipfsHash,
          contractStored: true,
          syncedAt: new Date().toISOString()
        }
      }
      console.log('[ContractDataService] Transformed memory:', transformed)
      return transformed
    })
    
    console.log('[ContractDataService] Returning', transformedMemories.length, 'transformed memories')
    return transformedMemories
  }
}

// Create singleton instance
const contractDataService = new ContractDataService()

export default contractDataService
