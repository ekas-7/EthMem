'use client'

/**
 * Extension Bridge Service
 * Communicates with the EthMem browser extension to get memory data
 */

class ExtensionBridge {
  constructor() {
    this.isExtensionAvailable = false
    this.extensionId = null
    this.retryCount = 0
    this.maxRetries = 10
    this.retryDelay = 1000
    this.isReconnecting = false
    this.lastError = null
  }

  /**
   * Check if the extension is available
   */
  async checkExtension() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        this.isExtensionAvailable = false
        return false
      }

      // First check if extension is available via window message
      const extensionAvailable = await this.checkExtensionViaMessage()
      if (extensionAvailable) {
        this.isExtensionAvailable = true
        this.retryCount = 0
        this.lastError = null
        return true
      }

      // Fallback to chrome.runtime method
      if (window.chrome?.runtime) {
        const response = await this.sendMessage({ type: 'GET_MEMORY_STATS' })
        this.isExtensionAvailable = true
        this.retryCount = 0
        this.lastError = null
        return true
      }

      this.isExtensionAvailable = false
      return false
    } catch (error) {
      console.log('[ExtensionBridge] Extension not available:', error.message)
      this.isExtensionAvailable = false
      this.lastError = error
      return false
    }
  }

  /**
   * Check extension availability via window message
   */
  async checkExtensionViaMessage() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false)
      }, 1000) // 1 second timeout

      const handleMessage = (event) => {
        if (event.data?.type === 'ETHMEM_EXTENSION_READY') {
          clearTimeout(timeout)
          window.removeEventListener('message', handleMessage)
          resolve(true)
        }
      }

      window.addEventListener('message', handleMessage)
      
      // Request extension status
      window.postMessage({
        type: 'ETHMEM_REQUEST',
        action: 'GET_STATS',
        requestId: Date.now()
      }, window.location.origin)
    })
  }

  /**
   * Send message to extension with retry logic
   */
  async sendMessage(message) {
    return new Promise((resolve, reject) => {
      if (!window.chrome?.runtime) {
        reject(new Error('Chrome runtime not available'))
        return
      }

      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          const error = chrome.runtime.lastError
          
          // Check if it's a context invalidated error
          if (error.message.includes('Extension context invalidated') || 
              error.message.includes('Receiving end does not exist')) {
            console.warn('[ExtensionBridge] Extension context invalidated, marking as unavailable')
            this.isExtensionAvailable = false
            this.lastError = error
          }
          
          reject(new Error(error.message))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Send message with automatic retry and reconnection
   */
  async sendMessageWithRetry(message, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Check if extension is available first
        if (!this.isExtensionAvailable && attempt > 1) {
          console.log('[ExtensionBridge] Attempting to reconnect to extension...')
          await this.checkExtension()
        }

        const response = await this.sendMessage(message)
        return response
      } catch (error) {
        console.warn(`[ExtensionBridge] Attempt ${attempt}/${maxRetries} failed:`, error.message)
        
        // If it's a context invalidated error, don't retry immediately
        if (error.message.includes('Extension context invalidated') || 
            error.message.includes('Receiving end does not exist')) {
          this.isExtensionAvailable = false
          throw error
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1)
          console.log(`[ExtensionBridge] Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw new Error(`Failed to send message after ${maxRetries} attempts`)
  }

  /**
   * Get all memories from extension
   */
  async getMemories() {
    try {
      const response = await this.sendMessageWithRetry({ type: 'GET_MEMORIES' })
      if (response?.success) {
        return response.memories || []
      }
      return []
    } catch (error) {
      console.error('[ExtensionBridge] Error getting memories:', error)
      // Return empty array instead of throwing to prevent UI crashes
      return []
    }
  }

  /**
   * Get memory statistics from extension
   */
  async getMemoryStats() {
    try {
      const response = await this.sendMessageWithRetry({ type: 'GET_MEMORY_STATS' })
      if (response?.success) {
        return response.stats || {
          total: 0,
          byCategory: {},
          byStatus: { local: 0, synced: 0, 'on-chain': 0 },
          recent: []
        }
      }
      return {
        total: 0,
        byCategory: {},
        byStatus: { local: 0, synced: 0, 'on-chain': 0 },
        recent: []
      }
    } catch (error) {
      console.error('[ExtensionBridge] Error getting stats:', error)
      return {
        total: 0,
        byCategory: {},
        byStatus: { local: 0, synced: 0, 'on-chain': 0 },
        recent: []
      }
    }
  }

  /**
   * Delete a memory from extension
   */
  async deleteMemory(memoryId) {
    try {
      const response = await this.sendMessageWithRetry({ 
        type: 'DELETE_MEMORY', 
        payload: { id: memoryId } 
      })
      return response?.success || false
    } catch (error) {
      console.error('[ExtensionBridge] Error deleting memory:', error)
      return false
    }
  }

  /**
   * Clear all memories from extension
   */
  async clearAllMemories() {
    try {
      const response = await this.sendMessageWithRetry({ type: 'CLEAR_ALL_MEMORIES' })
      return response?.success || false
    } catch (error) {
      console.error('[ExtensionBridge] Error clearing memories:', error)
      return false
    }
  }

  /**
   * Get memories by category
   */
  async getMemoriesByCategory(category) {
    try {
      const allMemories = await this.getMemories()
      return allMemories.filter(memory => memory.category === category)
    } catch (error) {
      console.error('[ExtensionBridge] Error getting memories by category:', error)
      return []
    }
  }

  /**
   * Get recent memories (last 10)
   */
  async getRecentMemories(limit = 10) {
    try {
      const allMemories = await this.getMemories()
      return allMemories
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit)
    } catch (error) {
      console.error('[ExtensionBridge] Error getting recent memories:', error)
      return []
    }
  }

  /**
   * Search memories by text
   */
  async searchMemories(query) {
    try {
      const allMemories = await this.getMemories()
      const searchTerm = query.toLowerCase()
      
      return allMemories.filter(memory => 
        memory.entity?.toLowerCase().includes(searchTerm) ||
        memory.description?.toLowerCase().includes(searchTerm) ||
        memory.source?.toLowerCase().includes(searchTerm) ||
        memory.category?.toLowerCase().includes(searchTerm)
      )
    } catch (error) {
      console.error('[ExtensionBridge] Error searching memories:', error)
      return []
    }
  }

  /**
   * Get extension status
   */
  async getExtensionStatus() {
    try {
      const isAvailable = await this.checkExtension()
      const stats = await this.getMemoryStats()
      
      return {
        isAvailable,
        stats,
        lastChecked: new Date().toISOString(),
        lastError: this.lastError?.message || null
      }
    } catch (error) {
      console.error('[ExtensionBridge] Error getting extension status:', error)
      return {
        isAvailable: false,
        stats: { total: 0, byCategory: {}, byStatus: { local: 0, synced: 0, 'on-chain': 0 }, recent: [] },
        lastChecked: new Date().toISOString(),
        lastError: error.message
      }
    }
  }

  /**
   * Force reconnection to extension
   */
  async reconnect() {
    console.log('[ExtensionBridge] Forcing reconnection to extension...')
    this.isExtensionAvailable = false
    this.retryCount = 0
    this.lastError = null
    
    try {
      const isAvailable = await this.checkExtension()
      if (isAvailable) {
        console.log('[ExtensionBridge] Successfully reconnected to extension')
        return true
      } else {
        console.log('[ExtensionBridge] Failed to reconnect to extension')
        return false
      }
    } catch (error) {
      console.error('[ExtensionBridge] Error during reconnection:', error)
      return false
    }
  }

  /**
   * Check if extension context is invalid
   */
  isContextInvalidated() {
    return this.lastError && (
      this.lastError.message.includes('Extension context invalidated') ||
      this.lastError.message.includes('Receiving end does not exist')
    )
  }
}

// Create singleton instance
const extensionBridge = new ExtensionBridge()

export default extensionBridge
