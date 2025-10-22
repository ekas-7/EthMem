'use client'

// Pinata configuration
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

/**
 * Upload data to IPFS via Pinata API
 * @param {Object} data - The data object to upload
 * @returns {Promise<string>} - IPFS hash (CID)
 */
export async function uploadToIPFS(data) {
  try {
    console.log('[Pinata] Uploading data to IPFS:', data)
    
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        type: 'json'
      })
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload to IPFS')
    }
    
    console.log('[Pinata] Data uploaded successfully. Hash:', result.hash)
    console.log('[Pinata] View at:', result.url)
    
    return result.hash
  } catch (error) {
    console.error('[Pinata] Error uploading to IPFS:', error)
    throw new Error(`Failed to upload to IPFS: ${error.message}`)
  }
}

/**
 * Retrieve data from IPFS via Pinata gateway
 * @param {string} ipfsHash - The IPFS hash (CID)
 * @returns {Promise<Object>} - The retrieved data
 */
export async function retrieveFromIPFS(ipfsHash) {
  try {
    console.log('[Pinata] Retrieving data from IPFS:', ipfsHash)
    
    // Fetch data from Pinata gateway
    const response = await fetch(`${PINATA_GATEWAY}${ipfsHash}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('[Pinata] Data retrieved successfully:', data)
    return data
  } catch (error) {
    console.error('[Pinata] Error retrieving from IPFS:', error)
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`)
  }
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
