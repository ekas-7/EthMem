/**
 * Encryption utilities for securing IPFS data
 * Uses hybrid encryption: AES-GCM for data + ECIES for key encryption
 */

import { hexToBytes, bytesToHex, toHex } from 'viem'

/**
 * Generate a random AES-GCM key
 * @returns {Promise<CryptoKey>} AES-GCM key
 */
async function generateSymmetricKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data with AES-GCM
 * @param {Object} data - Data to encrypt
 * @param {CryptoKey} key - AES-GCM key
 * @returns {Promise<{ciphertext: string, iv: string}>}
 */
async function encryptWithSymmetricKey(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
  const encodedData = new TextEncoder().encode(JSON.stringify(data))
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  )

  return {
    ciphertext: bytesToHex(new Uint8Array(ciphertext)),
    iv: bytesToHex(iv),
  }
}

/**
 * Decrypt data with AES-GCM
 * @param {string} ciphertextHex - Encrypted data in hex
 * @param {string} ivHex - IV in hex
 * @param {CryptoKey} key - AES-GCM key
 * @returns {Promise<Object>} Decrypted data
 */
async function decryptWithSymmetricKey(ciphertextHex, ivHex, key) {
  const ciphertext = hexToBytes(ciphertextHex)
  const iv = hexToBytes(ivHex)

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertext
  )

  const decodedData = new TextDecoder().decode(decrypted)
  return JSON.parse(decodedData)
}

/**
 * Derive public key from Ethereum address using wallet
 * @param {Object} walletClient - Viem wallet client
 * @param {string} address - Ethereum address
 * @returns {Promise<string>} Public key (uncompressed, hex)
 */
async function getPublicKey(walletClient, address) {
  try {
    // Try to get public key from wallet
    // Note: This requires the wallet to expose the public key
    const publicKey = await walletClient.request({
      method: 'eth_getEncryptionPublicKey',
      params: [address],
    })
    return publicKey
  } catch (error) {
    console.error('Failed to get public key from wallet:', error)
    throw new Error('Wallet does not support eth_getEncryptionPublicKey. Please use MetaMask or a compatible wallet.')
  }
}

/**
 * Encrypt symmetric key with recipient's public key using ECIES
 * Uses MetaMask's encryption method (eth_encrypt)
 * @param {string} symmetricKeyHex - Symmetric key as hex
 * @param {string} publicKey - Recipient's public key
 * @returns {Promise<string>} Encrypted key (base64)
 */
async function encryptSymmetricKey(symmetricKeyHex, publicKey) {
  // For MetaMask compatibility, we use the eth-sig-util library approach
  // Convert to base64 for MetaMask encryption
  const { encrypt } = await import('@metamask/eth-sig-util')
  
  const encrypted = encrypt({
    publicKey: publicKey,
    data: symmetricKeyHex,
    version: 'x25519-xsalsa20-poly1305',
  })
  
  return JSON.stringify(encrypted)
}

/**
 * Decrypt symmetric key with wallet private key
 * @param {string} encryptedKeyStr - Encrypted key (stringified JSON)
 * @param {Object} walletClient - Viem wallet client
 * @param {string} address - User's address
 * @returns {Promise<string>} Decrypted symmetric key (hex)
 */
async function decryptSymmetricKey(encryptedKeyStr, walletClient, address) {
  try {
    const decrypted = await walletClient.request({
      method: 'eth_decrypt',
      params: [encryptedKeyStr, address],
    })
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt key:', error)
    throw new Error('Failed to decrypt symmetric key. Make sure you are the owner of this data.')
  }
}

/**
 * Export symmetric key to raw format
 * @param {CryptoKey} key - CryptoKey to export
 * @returns {Promise<string>} Key as hex string
 */
async function exportSymmetricKey(key) {
  const exported = await crypto.subtle.exportKey('raw', key)
  return bytesToHex(new Uint8Array(exported))
}

/**
 * Import symmetric key from raw format
 * @param {string} keyHex - Key as hex string
 * @returns {Promise<CryptoKey>} Imported CryptoKey
 */
async function importSymmetricKey(keyHex) {
  const keyBytes = hexToBytes(keyHex)
  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data for IPFS upload (hybrid encryption)
 * Returns a complete encrypted package that includes the encrypted key
 * @param {Object} data - Data to encrypt
 * @param {Object} walletClient - Viem wallet client
 * @param {string} ownerAddress - Owner's Ethereum address
 * @returns {Promise<Object>} - Complete encrypted package with embedded encrypted key
 */
export async function encryptForIPFS(data, walletClient, ownerAddress) {
  try {
    // Step 1: Generate random symmetric key
    const symmetricKey = await generateSymmetricKey()
    
    // Step 2: Encrypt data with symmetric key
    const { ciphertext, iv } = await encryptWithSymmetricKey(data, symmetricKey)
    
    // Step 3: Get owner's public key
    const publicKey = await getPublicKey(walletClient, ownerAddress)
    
    // Step 4: Export and encrypt symmetric key with owner's public key
    const symmetricKeyHex = await exportSymmetricKey(symmetricKey)
    const encryptedKey = await encryptSymmetricKey(symmetricKeyHex, publicKey)
    
    // Return complete encrypted package with key embedded
    // This entire structure will be uploaded to IPFS
    return {
      version: '1.0',
      encrypted: true,
      encryptedPayload: {
        algorithm: 'aes-256-gcm',
        ciphertext,
        iv,
        owner: ownerAddress,
      },
      encryptedKey: encryptedKey, // Embedded in IPFS data
      metadata: {
        encryptedAt: new Date().toISOString(),
        encryptionVersion: '1.0',
      }
    }
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error(`Failed to encrypt data: ${error.message}`)
  }
}

/**
 * Decrypt data from IPFS (hybrid encryption)
 * Handles both new format (with embedded key) and old format (separate key)
 * @param {Object} encryptedPackage - Complete encrypted package from IPFS
 * @param {string} separateEncryptedKey - Optional separate encrypted key (for backwards compatibility)
 * @param {Object} walletClient - Viem wallet client
 * @param {string} userAddress - User's Ethereum address
 * @returns {Promise<Object>} Decrypted data
 */
export async function decryptFromIPFS(encryptedPackage, separateEncryptedKey, walletClient, userAddress) {
  try {
    // Handle new format with embedded key
    let encryptedPayload, encryptedKey
    
    if (encryptedPackage.encrypted && encryptedPackage.encryptedPayload) {
      // New format: key is embedded in the package
      encryptedPayload = encryptedPackage.encryptedPayload
      encryptedKey = encryptedPackage.encryptedKey
    } else if (encryptedPackage.ciphertext && separateEncryptedKey) {
      // Old format: payload and key are separate
      encryptedPayload = encryptedPackage
      encryptedKey = separateEncryptedKey
    } else {
      throw new Error('Invalid encrypted data format')
    }
    
    // Verify ownership
    if (encryptedPayload.owner && encryptedPayload.owner.toLowerCase() !== userAddress.toLowerCase()) {
      throw new Error('You are not the owner of this encrypted data')
    }
    
    // Step 1: Decrypt symmetric key using wallet's private key
    const symmetricKeyHex = await decryptSymmetricKey(encryptedKey, walletClient, userAddress)
    
    // Step 2: Import symmetric key
    const symmetricKey = await importSymmetricKey(symmetricKeyHex)
    
    // Step 3: Decrypt data with symmetric key
    const decryptedData = await decryptWithSymmetricKey(
      encryptedPayload.ciphertext,
      encryptedPayload.iv,
      symmetricKey
    )
    
    return decryptedData
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error(`Failed to decrypt data: ${error.message}`)
  }
}

/**
 * Check if data is encrypted
 * @param {Object} data - Data to check
 * @returns {boolean} True if data appears to be encrypted
 */
export function isEncrypted(data) {
  if (!data || typeof data !== 'object') {
    return false
  }
  
  // New format: check for encrypted flag and encryptedPayload
  if (data.encrypted && data.encryptedPayload && data.encryptedKey) {
    return true
  }
  
  // Old format: check for direct encryption fields
  if ('ciphertext' in data && 'iv' in data && 'algorithm' in data) {
    return true
  }
  
  return false
}

/**
 * Encrypt data for multiple recipients (future enhancement)
 * @param {Object} data - Data to encrypt
 * @param {Array<string>} publicKeys - Array of recipient public keys
 * @returns {Promise<{encryptedData: Object, encryptedKeys: Array<{recipient: string, encryptedKey: string}>}>}
 */
export async function encryptForMultipleRecipients(data, publicKeys) {
  // Generate one symmetric key
  const symmetricKey = await generateSymmetricKey()
  
  // Encrypt data once
  const { ciphertext, iv } = await encryptWithSymmetricKey(data, symmetricKey)
  
  // Export symmetric key
  const symmetricKeyHex = await exportSymmetricKey(symmetricKey)
  
  // Encrypt symmetric key for each recipient
  const encryptedKeys = await Promise.all(
    publicKeys.map(async (publicKey, index) => {
      const encryptedKey = await encryptSymmetricKey(symmetricKeyHex, publicKey)
      return {
        recipient: `recipient_${index}`,
        encryptedKey,
      }
    })
  )
  
  return {
    encryptedData: {
      version: '1.0',
      algorithm: 'aes-256-gcm',
      ciphertext,
      iv,
    },
    encryptedKeys,
  }
}

export default {
  encryptForIPFS,
  decryptFromIPFS,
  isEncrypted,
  encryptForMultipleRecipients,
}

