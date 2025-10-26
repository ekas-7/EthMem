'use client'

import { encryptForIPFS, decryptFromIPFS, isEncrypted } from './encryption'

// Pinata configuration
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

// Cache for decrypted data to prevent repeated MetaMask popups
const decryptionCache = new Map()

// Helper to create cache key
function getCacheKey(ipfsHash, userAddress) {
  return `${ipfsHash}-${userAddress?.toLowerCase()}`
}

/**
 * Upload data to IPFS via Pinata API (with optional encryption)
 * @param {Object} data - The data object to upload
 * @param {Object} options - Options for encryption
 * @param {boolean} options.encrypt - Whether to encrypt the data
 * @param {Object} options.walletClient - Viem wallet client (required if encrypt is true)
 * @param {string} options.ownerAddress - Owner's address (required if encrypt is true)
 * @returns {Promise<{hash: string, encryptedKey?: string}>} - IPFS hash and encrypted key (if encrypted)
 */
export async function uploadToIPFS(data, options = {}) {
  try {
    const { encrypt = false, walletClient, ownerAddress } = options
    let dataToUpload = data
    
    // Encrypt data if requested
    if (encrypt) {
      if (!walletClient || !ownerAddress) {
        throw new Error('walletClient and ownerAddress are required for encryption')
      }
      
      console.log('[Pinata] Encrypting data before upload...')
      // encryptForIPFS now returns complete encrypted package with embedded key
      dataToUpload = await encryptForIPFS(data, walletClient, ownerAddress)
      console.log('[Pinata] Data encrypted successfully')
    }
    
    console.log('[Pinata] Uploading data to IPFS:', encrypt ? '[ENCRYPTED]' : data)
    
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: dataToUpload,
        type: 'json'
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload to IPFS')
    }
    
    console.log('[Pinata] Data uploaded successfully. Hash:', result.hash)
    console.log('[Pinata] View at:', result.url)
    console.log('[Pinata] Encryption enabled:', encrypt)
    
    // Return hash (encrypted key is embedded in IPFS data if encrypted)
    return result.hash
  } catch (error) {
    console.error('[Pinata] Error uploading to IPFS:', error)
    throw new Error(`Failed to upload to IPFS: ${error.message}`)
  }
}

/**
 * Retrieve data from IPFS via Pinata gateway (with optional decryption)
 * @param {string} ipfsHash - The IPFS hash (CID)
 * @param {Object} options - Options for decryption
 * @param {Object} options.walletClient - Viem wallet client (required if data is encrypted)
 * @param {string} options.userAddress - User's address (required if data is encrypted)
 * @param {boolean} options.skipCache - Skip cache and force fresh decryption
 * @returns {Promise<Object>} - The retrieved data (decrypted if encrypted)
 */
export async function retrieveFromIPFS(ipfsHash, options = {}) {
  try {
    const { walletClient, userAddress, skipCache = false } = options
    
    // Check cache first to avoid repeated decryption
    if (!skipCache && userAddress) {
      const cacheKey = getCacheKey(ipfsHash, userAddress)
      const cachedData = decryptionCache.get(cacheKey)
      if (cachedData) {
        console.log('[Pinata] Returning cached decrypted data for:', ipfsHash)
        return cachedData
      }
    }
    
    console.log('[Pinata] Retrieving data from IPFS:', ipfsHash)
    
    // Fetch data from Pinata gateway
    const response = await fetch(`${PINATA_GATEWAY}${ipfsHash}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Check if data is encrypted
    if (isEncrypted(data)) {
      if (!walletClient || !userAddress) {
        console.warn('[Pinata] Encrypted data found but no wallet/address provided - returning encrypted data')
        return data
      }
      
      console.log('[Pinata] Data is encrypted. Attempting to decrypt...')
      // The encrypted key is embedded in the data, so we don't need it separately
      const decryptedData = await decryptFromIPFS(data, null, walletClient, userAddress)
      console.log('[Pinata] Data decrypted successfully')
      
      // Cache the decrypted data
      const cacheKey = getCacheKey(ipfsHash, userAddress)
      decryptionCache.set(cacheKey, decryptedData)
      
      return decryptedData
    }
    
    console.log('[Pinata] Data retrieved successfully (unencrypted)')
    return data
  } catch (error) {
    console.error('[Pinata] Error retrieving from IPFS:', error)
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`)
  }
}

/**
 * Clear the decryption cache
 * Useful for logout or when switching accounts
 */
export function clearDecryptionCache() {
  console.log('[Pinata] Clearing decryption cache')
  decryptionCache.clear()
}

/**
 * Clear cache for specific IPFS hash
 * @param {string} ipfsHash - The IPFS hash
 * @param {string} userAddress - User's address
 */
export function clearCacheForHash(ipfsHash, userAddress) {
  const cacheKey = getCacheKey(ipfsHash, userAddress)
  decryptionCache.delete(cacheKey)
  console.log('[Pinata] Cleared cache for:', ipfsHash)
}

/**
 * Get Pinata gateway URL for a hash
 * @param {string} ipfsHash - The IPFS hash (CID)
 * @returns {string} - The gateway URL
 */
export function getIPFSUrl(ipfsHash) {
  return `${PINATA_GATEWAY}${ipfsHash}`
}

/**
 * Upload a file to IPFS via Pinata API
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - IPFS hash (CID)
 */
export async function uploadFileToIPFS(file) {
  try {
    console.log('[Pinata] Uploading file to IPFS:', file.name)
    
    // Convert file to base64 for API transmission
    const arrayBuffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: file.name,
          type: file.type,
          content: base64
        },
        type: 'file'
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload file to IPFS')
    }
    
    console.log('[Pinata] File uploaded successfully. Hash:', result.hash)
    console.log('[Pinata] View at:', result.url)
    
    return result.hash
  } catch (error) {
    console.error('[Pinata] Error uploading file to IPFS:', error)
    throw new Error(`Failed to upload file to IPFS: ${error.message}`)
  }
}

/**
 * Validate IPFS hash format
 * @param {string} hash - The hash to validate
 * @returns {boolean} - Whether the hash is valid
 */
export function isValidIPFSHash(hash) {
  // Basic IPFS hash validation (starts with Qm or bafy)
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{52,})$/.test(hash)
}

/**
 * Get pinned items from Pinata API
 * @returns {Promise<Array>} - List of pinned items
 */
export async function getPinnedItems() {
  try {
    console.log('[Pinata] Getting pinned items')
    
    const response = await fetch('/api/ipfs/pins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get pinned items')
    }
    
    console.log('[Pinata] Pinned items retrieved successfully')
    return result.items
  } catch (error) {
    console.error('[Pinata] Error getting pinned items:', error)
    throw new Error(`Failed to get pinned items: ${error.message}`)
  }
}

/**
 * Unpin an item from Pinata API
 * @param {string} ipfsHash - The IPFS hash to unpin
 * @returns {Promise<boolean>} - Success status
 */
export async function unpinFromIPFS(ipfsHash) {
  try {
    console.log('[Pinata] Unpinning from IPFS:', ipfsHash)
    
    const response = await fetch('/api/ipfs/pins', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash: ipfsHash })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to unpin from IPFS')
    }
    
    console.log('[Pinata] Successfully unpinned:', ipfsHash)
    return true
  } catch (error) {
    console.error('[Pinata] Error unpinning from IPFS:', error)
    throw new Error(`Failed to unpin from IPFS: ${error.message}`)
  }
}
