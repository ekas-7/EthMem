// background.js - Service worker for EthMem extension
console.log('[EthMem] Background script loaded');

// Import memory extraction and storage modules
importScripts(
  '../lib/config.js',
  '../lib/cloudService.js',
  '../lib/memoryExtractor.js',
  '../lib/memoryStorage.js'
);

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[EthMem] Extension installed');
  
  // Initialize IndexedDB
  initDB().catch(err => {
    console.error('[EthMem] Failed to initialize DB:', err);
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[EthMem] Message received:', message.type);
  
  if (message.type === 'EXTRACT_MEMORY') {
    handleExtractMemory(message.payload, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'GET_MEMORIES') {
    handleGetMemories(sendResponse);
    return true;
  }
  
  if (message.type === 'GET_MEMORY_STATS') {
    handleGetStats(sendResponse);
    return true;
  }
  
  if (message.type === 'DELETE_MEMORY') {
    handleDeleteMemory(message.payload.id, sendResponse);
    return true;
  }
  
  if (message.type === 'CLEAR_ALL_MEMORIES') {
    handleClearAll(sendResponse);
    return true;
  }
  
  // API Key management
  if (message.type === 'SAVE_API_KEY') {
    handleSaveApiKey(message.payload, sendResponse);
    return true;
  }
  
  if (message.type === 'GET_API_STATUS') {
    handleGetApiStatus(sendResponse);
    return true;
  }
  
  if (message.type === 'TEST_API_KEY') {
    handleTestApiKey(message.payload, sendResponse);
    return true;
  }
});

/**
 * Handle memory extraction request
 */
async function handleExtractMemory(payload, sendResponse) {
  try {
    const { text, messageId, platform, url, timestamp } = payload;
    
    console.log('[EthMem] Extracting memory from:', text.substring(0, 50));
    
    // Extract memory using the extractor module
    const memory = await extractMemory(text);
    
    if (!memory) {
      console.log('[EthMem] No memory extracted');
      sendResponse({ success: false, message: 'No memory extracted' });
      return;
    }
    
    // Check for duplicates
    const duplicate = await isDuplicate(memory);
    
    if (duplicate) {
      console.log('[EthMem] Duplicate memory, skipping');
      sendResponse({ success: false, message: 'Duplicate memory' });
      return;
    }
    
    // Save to IndexedDB
    await saveMemory(memory);
    
    console.log('[EthMem] ✅ Memory saved successfully!');
    console.log('[EthMem] ID:', memory.id);
    console.log('[EthMem] Category:', memory.category);
    console.log('[EthMem] Entity:', memory.entity);
    console.log('[EthMem] Description:', memory.description);
    
    // Send success response
    sendResponse({
      success: true,
      memory: memory
    });
    
  } catch (error) {
    console.error('[EthMem] Error in handleExtractMemory:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle get memories request
 */
async function handleGetMemories(sendResponse) {
  try {
    const memories = await getAllMemories();
    
    // Sort by timestamp (newest first)
    memories.sort((a, b) => b.timestamp - a.timestamp);
    
    sendResponse({
      success: true,
      memories: memories
    });
    
  } catch (error) {
    console.error('[EthMem] Error in handleGetMemories:', error);
    sendResponse({
      success: false,
      memories: [],
      error: error.message
    });
  }
}

/**
 * Handle get stats request
 */
async function handleGetStats(sendResponse) {
  try {
    const stats = await getStats();
    
    sendResponse({
      success: true,
      stats: stats
    });
    
  } catch (error) {
    console.error('[EthMem] Error in handleGetStats:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle delete memory request
 */
async function handleDeleteMemory(id, sendResponse) {
  try {
    await deleteMemory(id);
    
    sendResponse({
      success: true,
      message: 'Memory deleted'
    });
    
  } catch (error) {
    console.error('[EthMem] Error in handleDeleteMemory:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle clear all memories request
 */
async function handleClearAll(sendResponse) {
  try {
    await clearAllMemories();
    
    sendResponse({
      success: true,
      message: 'All memories cleared'
    });
    
  } catch (error) {
    console.error('[EthMem] Error in handleClearAll:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle save API key request
 */
async function handleSaveApiKey(payload, sendResponse) {
  try {
    const { apiKey } = payload;
    
    if (!apiKey || apiKey.trim().length === 0) {
      sendResponse({
        success: false,
        error: 'API key cannot be empty'
      });
      return;
    }
    
    await saveApiKey(apiKey);
    
    sendResponse({
      success: true,
      message: 'API key saved securely'
    });
    
  } catch (error) {
    console.error('[EthMem] Error saving API key:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle get API status request
 */
async function handleGetApiStatus(sendResponse) {
  try {
    const configured = await isApiKeyConfigured();
    const config = await loadConfig();
    
    sendResponse({
      success: true,
      configured: configured,
      model: config.model || 'gpt-3.5-turbo'
    });
    
  } catch (error) {
    console.error('[EthMem] Error getting API status:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle test API key request
 */
async function handleTestApiKey(payload, sendResponse) {
  try {
    const { apiKey } = payload;
    
    const result = await testApiKey(apiKey);
    
    sendResponse({
      success: true,
      valid: result.valid,
      error: result.error
    });
    
  } catch (error) {
    console.error('[EthMem] Error testing API key:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}
