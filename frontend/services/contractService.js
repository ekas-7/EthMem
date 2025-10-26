'use client'

import { ethers } from 'ethers'
import { uploadToIPFS } from '../lib/ipfsService'

// Contract ABI - this should match your deployed MemoryStorage contract
const MEMORY_STORAGE_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "_ipfsHash", "type": "string"}],
    "name": "storeMemory",
    "outputs": [{"internalType": "uint256", "name": "memoryId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_memoryId", "type": "uint256"}],
    "name": "getMemory",
    "outputs": [
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}],
    "name": "getMemoriesByAddress",
    "outputs": [{"internalType": "uint256[]", "name": "memoryIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_memoryId", "type": "uint256"}],
    "name": "deleteMemory",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalMemoryCount",
    "outputs": [{"internalType": "uint256", "name": "count", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}],
    "name": "getMemoryCountByAddress",
    "outputs": [{"internalType": "uint256", "name": "count", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_address", "type": "address"}, {"internalType": "uint256", "name": "_memoryId", "type": "uint256"}],
    "name": "isMemoryOwner",
    "outputs": [{"internalType": "bool", "name": "isOwner", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "memoryId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "MemoryStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "memoryId", "type": "uint256"}
    ],
    "name": "MemoryDeleted",
    "type": "event"
  }
]

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1A68e87eaFbD252c9622D2De93Ec231a5D7AD7D6' // Sepolia deployed contract address

// Sepolia network configuration
const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia',
  rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
  }
}

const NETWORK_CONFIG = {
  localhost: {
    chainId: 1337,
    rpcUrl: 'http://127.0.0.1:8545'
  },
  sepolia: SEPOLIA_CONFIG
}

/**
 * Get contract instance with signer
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Object} - Contract instance with signer
 */
export async function getContract(walletClient) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') {
    throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.')
  }
  
  // Create provider from wallet client
  const provider = new ethers.BrowserProvider(walletClient)
  // Get signer for sending transactions
  const signer = await provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, MEMORY_STORAGE_ABI, signer)
}

/**
 * Store memory in smart contract
 * @param {string} ipfsHash - IPFS hash of the memory data
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<Object>} - Transaction result
 */
export async function storeMemory(ipfsHash, walletClient) {
  try {
    console.log('[Contract] Storing memory with IPFS hash:', ipfsHash)
    
    const contract = await getContract(walletClient)
    
    // Call storeMemory function
    const tx = await contract.storeMemory(ipfsHash)
    console.log('[Contract] Transaction sent:', tx.hash)
    
    // Wait for transaction to be mined
    const receipt = await tx.wait()
    console.log('[Contract] Transaction confirmed:', receipt.hash)
    
    // Get the memory ID from the event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log)
        return parsed.name === 'MemoryStored'
      } catch (e) {
        return false
      }
    })
    
    let memoryId = null
    if (event) {
      const parsed = contract.interface.parseLog(event)
      memoryId = parsed.args.memoryId.toString()
    }
    
    return {
      success: true,
      transactionHash: receipt.hash,
      memoryId,
      gasUsed: receipt.gasUsed.toString()
    }
  } catch (error) {
    console.error('[Contract] Error storing memory:', error)
    throw new Error(`Failed to store memory: ${error.message}`)
  }
}

/**
 * Get memory by ID
 * @param {string} memoryId - Memory ID
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<Object>} - Memory data
 */
export async function getMemory(memoryId, walletClient) {
  try {
    console.log('[Contract] Getting memory:', memoryId)
    
    const contract = await getContract(walletClient)
    const result = await contract.getMemory(memoryId)
    
    return {
      ipfsHash: result.ipfsHash,
      timestamp: result.timestamp.toString(),
      owner: result.owner
    }
  } catch (error) {
    console.error('[Contract] Error getting memory:', error)
    throw new Error(`Failed to get memory: ${error.message}`)
  }
}

/**
 * Get all memories for an address
 * @param {string} address - User address
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<Array>} - Array of memory IDs
 */
export async function getMemoriesByAddress(address, walletClient) {
  try {
    console.log('[Contract] Getting memories for address:', address)
    
    const contract = await getContract(walletClient)
    const memoryIds = await contract.getMemoriesByAddress(address)
    
    return memoryIds.map(id => id.toString())
  } catch (error) {
    console.error('[Contract] Error getting memories:', error)
    throw new Error(`Failed to get memories: ${error.message}`)
  }
}

/**
 * Delete memory
 * @param {string} memoryId - Memory ID to delete
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<Object>} - Transaction result
 */
export async function deleteMemory(memoryId, walletClient) {
  try {
    console.log('[Contract] Deleting memory:', memoryId)
    
    const contract = await getContract(walletClient)
    const tx = await contract.deleteMemory(memoryId)
    
    const receipt = await tx.wait()
    console.log('[Contract] Memory deleted:', receipt.hash)
    
    return {
      success: true,
      transactionHash: receipt.hash,
      gasUsed: receipt.gasUsed.toString()
    }
  } catch (error) {
    console.error('[Contract] Error deleting memory:', error)
    throw new Error(`Failed to delete memory: ${error.message}`)
  }
}

/**
 * Get total memory count
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<number>} - Total memory count
 */
export async function getTotalMemoryCount(walletClient) {
  try {
    const contract = await getContract(walletClient)
    const count = await contract.getTotalMemoryCount()
    return count.toString()
  } catch (error) {
    console.error('[Contract] Error getting total count:', error)
    throw new Error(`Failed to get total count: ${error.message}`)
  }
}

/**
 * Check if address owns a memory
 * @param {string} address - User address
 * @param {string} memoryId - Memory ID
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<boolean>} - Whether the address owns the memory
 */
export async function isMemoryOwner(address, memoryId, walletClient) {
  try {
    const contract = await getContract(walletClient)
    return await contract.isMemoryOwner(address, memoryId)
  } catch (error) {
    console.error('[Contract] Error checking ownership:', error)
    throw new Error(`Failed to check ownership: ${error.message}`)
  }
}

/**
 * Upload memories to IPFS and store hash in smart contract
 * @param {Array} memories - Array of memory objects to upload
 * @param {Object} walletClient - Wagmi wallet client
 * @param {Function} onProgress - Optional progress callback function
 * @returns {Promise<Object>} - Upload result with transaction details
 */
export async function uploadMemoriesToContract(memories, walletClient, onProgress = null) {
  try {
    console.log('[Upload] Starting upload process for', memories.length, 'memories')
    
    if (!memories || memories.length === 0) {
      throw new Error('No memories provided for upload')
    }

    // Get user address for encryption
    const accounts = await walletClient.getAddresses()
    const userAddress = accounts[0]

    // Step 1: Prepare data for IPFS upload
    const uploadData = {
      memories: memories,
      metadata: {
        uploadTimestamp: new Date().toISOString(),
        totalMemories: memories.length,
        version: '1.0',
        owner: userAddress
      }
    }

    if (onProgress) onProgress({ step: 'preparing', message: 'Preparing data for upload...' })

    // Step 2: Upload to IPFS with encryption enabled
    console.log('[Upload] Encrypting and uploading to IPFS...')
    if (onProgress) onProgress({ step: 'ipfs', message: 'Encrypting and uploading to IPFS...' })
    
    const ipfsHash = await uploadToIPFS(uploadData, {
      encrypt: true,
      walletClient,
      ownerAddress: userAddress
    })
    console.log('[Upload] IPFS upload successful. Hash:', ipfsHash)

    // Step 3: Store IPFS hash in smart contract
    console.log('[Upload] Storing IPFS hash in contract...')
    if (onProgress) onProgress({ step: 'contract', message: 'Storing in smart contract...' })
    
    const contractResult = await storeMemory(ipfsHash, walletClient)
    console.log('[Upload] Contract storage successful:', contractResult)

    if (onProgress) onProgress({ step: 'complete', message: 'Upload completed successfully!' })

    return {
      success: true,
      ipfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      transactionHash: contractResult.transactionHash,
      memoryId: contractResult.memoryId,
      gasUsed: contractResult.gasUsed,
      totalMemories: memories.length
    }

  } catch (error) {
    console.error('[Upload] Error in upload process:', error)
    if (onProgress) onProgress({ step: 'error', message: `Upload failed: ${error.message}` })
    throw new Error(`Upload failed: ${error.message}`)
  }
}

/**
 * Upload single memory to IPFS and store hash in smart contract
 * @param {Object} memory - Single memory object to upload
 * @param {Object} walletClient - Wagmi wallet client
 * @param {Function} onProgress - Optional progress callback function
 * @returns {Promise<Object>} - Upload result with transaction details
 */
export async function uploadSingleMemoryToContract(memory, walletClient, onProgress = null) {
  return uploadMemoriesToContract([memory], walletClient, onProgress)
}

/**
 * Get network configuration for current chain
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<Object>} - Network configuration
 */
export async function getNetworkConfig(walletClient) {
  try {
    const provider = new ethers.BrowserProvider(walletClient)
    const network = await provider.getNetwork()
    
    return {
      chainId: Number(network.chainId),
      name: network.name,
      isSepolia: Number(network.chainId) === 11155111
    }
  } catch (error) {
    console.error('[Contract] Error getting network config:', error)
    throw new Error(`Failed to get network config: ${error.message}`)
  }
}

/**
 * Check if user is connected to Sepolia network
 * @param {Object} walletClient - Wagmi wallet client
 * @returns {Promise<boolean>} - Whether connected to Sepolia
 */
export async function isConnectedToSepolia(walletClient) {
  try {
    const networkConfig = await getNetworkConfig(walletClient)
    return networkConfig.isSepolia
  } catch (error) {
    console.error('[Contract] Error checking Sepolia connection:', error)
    return false
  }
}
