'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useWallet } from './useWallet'
import contractDataService from '../services/contractDataService'

/**
 * Hook for managing smart contract data synchronization
 * @param {Array} extensionMemories - Current extension memories
 * @param {Object} options - Configuration options
 * @returns {Object} - Contract data state and methods
 */
export function useContractData(extensionMemories = [], options = {}) {
  const { walletClient, address, isConnected } = useWallet()
  const [contractData, setContractData] = useState({
    available: false,
    reason: '',
    contractMemories: [],
    newMemories: [],
    updatedMemories: [],
    totalContractMemories: 0,
    lastCheckTime: null,
    error: null
  })
  const [isChecking, setIsChecking] = useState(false)
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(options.autoCheck !== false)
  const [checkInterval, setCheckInterval] = useState(options.checkInterval || 30000)
  const [serviceStatus, setServiceStatus] = useState({})
  
  // Refs to avoid stale closures
  const extensionMemoriesRef = useRef(extensionMemories)
  const walletClientRef = useRef(walletClient)
  const addressRef = useRef(address)
  
  // Update refs when dependencies change
  useEffect(() => {
    extensionMemoriesRef.current = extensionMemories
  }, [extensionMemories])
  
  useEffect(() => {
    walletClientRef.current = walletClient
  }, [walletClient])
  
  useEffect(() => {
    addressRef.current = address
  }, [address])

  // Handle contract data updates
  const handleContractDataUpdate = useCallback((update) => {
    console.log('[useContractData] Received update:', update.type)
    
    if (update.type === 'contract_data_check') {
      setContractData(prev => ({
        ...prev,
        ...update.data,
        lastCheckTime: update.timestamp
      }))
      setIsChecking(false)
    } else if (update.type === 'contract_data_error') {
      setContractData(prev => ({
        ...prev,
        available: false,
        reason: 'Error checking contract data',
        error: update.error,
        lastCheckTime: update.timestamp
      }))
      setIsChecking(false)
    }
  }, [])

  // Register listener on mount
  useEffect(() => {
    contractDataService.addListener(handleContractDataUpdate)
    
    return () => {
      contractDataService.removeListener(handleContractDataUpdate)
    }
  }, [handleContractDataUpdate])

  // Update service status
  useEffect(() => {
    const updateStatus = () => {
      setServiceStatus(contractDataService.getStatus())
    }
    
    updateStatus()
    const statusInterval = setInterval(updateStatus, 1000)
    
    return () => clearInterval(statusInterval)
  }, [])

  // Manual check function
  const checkContractData = useCallback(async () => {
    if (!walletClient || !address || isChecking) {
      return
    }

    setIsChecking(true)
    
    try {
      const result = await contractDataService.checkContractDataAvailability(
        walletClient,
        address,
        extensionMemoriesRef.current
      )
      
      setContractData(prev => ({
        ...prev,
        ...result,
        lastCheckTime: new Date().toISOString()
      }))
      
    } catch (error) {
      console.error('[useContractData] Error checking contract data:', error)
      setContractData(prev => ({
        ...prev,
        available: false,
        reason: 'Error checking contract data',
        error: error.message,
        lastCheckTime: new Date().toISOString()
      }))
    } finally {
      setIsChecking(false)
    }
  }, [walletClient, address, isChecking])

  // Auto-check management
  useEffect(() => {
    if (!autoCheckEnabled || !walletClient || !address || !isConnected) {
      contractDataService.stopAutoCheck()
      return
    }

    // Start auto-check
    contractDataService.startAutoCheck(
      walletClient,
      address,
      extensionMemoriesRef.current,
      checkInterval
    )

    return () => {
      contractDataService.stopAutoCheck()
    }
  }, [autoCheckEnabled, walletClient, address, isConnected, checkInterval])

  // Sync new memories
  const syncNewMemories = useCallback(async (extensionSyncCallback) => {
    if (!contractData.newMemories || contractData.newMemories.length === 0) {
      return { success: true, syncedCount: 0, totalCount: 0 }
    }

    try {
      const result = await contractDataService.syncNewMemories(
        contractData.newMemories,
        extensionSyncCallback
      )
      
      // Refresh contract data after sync
      if (result.success && result.syncedCount > 0) {
        setTimeout(() => {
          checkContractData()
        }, 1000)
      }
      
      return result
    } catch (error) {
      console.error('[useContractData] Error syncing memories:', error)
      throw error
    }
  }, [contractData.newMemories, checkContractData])

  // Get contract memory by ID
  const getContractMemory = useCallback((contractId) => {
    return contractData.contractMemories.find(mem => mem.contractId === contractId)
  }, [contractData.contractMemories])

  // Check if memory exists in contract
  const isMemoryInContract = useCallback((memoryId) => {
    return contractData.contractMemories.some(mem => 
      mem.metadata?.contractId === memoryId || mem.contractId === memoryId
    )
  }, [contractData.contractMemories])

  // Get summary statistics
  const getSummary = useCallback(() => {
    return {
      hasContractData: contractData.available,
      totalContractMemories: contractData.totalContractMemories,
      newMemoriesCount: contractData.newMemories?.length || 0,
      updatedMemoriesCount: contractData.updatedMemories?.length || 0,
      lastCheckTime: contractData.lastCheckTime,
      isChecking,
      autoCheckEnabled,
      serviceStatus
    }
  }, [contractData, isChecking, autoCheckEnabled, serviceStatus])

  return {
    // State
    contractData,
    isChecking,
    autoCheckEnabled,
    checkInterval,
    serviceStatus,
    
    // Actions
    checkContractData,
    syncNewMemories,
    setAutoCheckEnabled,
    setCheckInterval,
    
    // Utilities
    getContractMemory,
    isMemoryInContract,
    getSummary,
    
    // Computed values
    hasNewMemories: (contractData.newMemories?.length || 0) > 0,
    hasUpdatedMemories: (contractData.updatedMemories?.length || 0) > 0,
    needsSync: (contractData.newMemories?.length || 0) > 0 || (contractData.updatedMemories?.length || 0) > 0
  }
}
