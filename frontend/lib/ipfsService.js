'use client'

import { create } from 'ipfs-http-client'

// IPFS configuration
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
const IPFS_API_URL = 'https://ipfs.io/api/v0'

// Create IPFS client
const ipfs = create({
  url: IPFS_API_URL
})

/**
 * Upload data to IPFS
 * @param {Object} data - The data object to upload
 * @returns {Promise<string>} - IPFS hash
 */
export async function uploadToIPFS(data) {
  try {
    console.log('[IPFS] Uploading data to IPFS:', data)
    
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2)
    
    // Add to IPFS
    const result = await ipfs.add(jsonString)
    const ipfsHash = result.path
    
    console.log('[IPFS] Data uploaded successfully. Hash:', ipfsHash)
    console.log('[IPFS] View at:', `${IPFS_GATEWAY}${ipfsHash}`)
    
    return ipfsHash
  } catch (error) {
    console.error('[IPFS] Error uploading to IPFS:', error)
    throw new Error(`Failed to upload to IPFS: ${error.message}`)
  }
}

/**
 * Retrieve data from IPFS
 * @param {string} ipfsHash - The IPFS hash
 * @returns {Promise<Object>} - The retrieved data
 */
export async function retrieveFromIPFS(ipfsHash) {
  try {
    console.log('[IPFS] Retrieving data from IPFS:', ipfsHash)
    
    // Fetch data from IPFS
    const chunks = []
    for await (const chunk of ipfs.cat(ipfsHash)) {
      chunks.push(chunk)
    }
    
    const data = Buffer.concat(chunks).toString()
    const parsedData = JSON.parse(data)
    
    console.log('[IPFS] Data retrieved successfully:', parsedData)
    return parsedData
  } catch (error) {
    console.error('[IPFS] Error retrieving from IPFS:', error)
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`)
  }
}

/**
 * Get IPFS gateway URL for a hash
 * @param {string} ipfsHash - The IPFS hash
 * @returns {string} - The gateway URL
 */
export function getIPFSUrl(ipfsHash) {
  return `${IPFS_GATEWAY}${ipfsHash}`
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
