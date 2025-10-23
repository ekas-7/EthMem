// background.js - Service worker for EthMem extension
console.log('[EthMem] Background script loaded');

// Import memory extraction and storage modules
importScripts(
  '../lib/config.js',
  '../lib/cloudService.js',
  '../lib/smartMemoryService.js',
  '../lib/memoryExtractor.js',
  '../lib/memoryStorage.js'
);

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('[EthMem] Extension installed');
  
  // Initialize IndexedDB
  if (typeof initDB !== 'undefined') {
    initDB().catch(err => {
      console.error('[EthMem] Failed to initialize DB:', err);
    });
  } else {
    console.error('[EthMem] initDB is not defined - scripts may not have loaded');
  }
  
  // Initialize cloud service
  if (typeof initCloudService !== 'undefined') {
    initCloudService();
  } else {
    console.error('[EthMem] initCloudService is not defined - scripts may not have loaded');
  }
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
  
  if (message.type === 'GET_ALL_MEMORIES') {
    handleGetMemories(sendResponse); // Same as GET_MEMORIES
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
  
  // Smart memory processing
  if (message.type === 'PROCESS_MESSAGE_SMART') {
    handleProcessMessageSmart(message.payload, sendResponse);
    return true;
  }
});

/**
 * Handle memory extraction request
 */
async function handleExtractMemory(payload, sendResponse) {
  console.log('[EthMem Background] handleExtractMemory called with payload:', payload);
  
  try {
    const { text, messageId, platform, url, timestamp } = payload;
    
    console.log('[EthMem Background] Extracting memory from:', text);
    
    // Extract memory using the extractor module
    const memory = await extractMemory(text);
    
    console.log('[EthMem Background] Extraction result:', memory);
    
    if (!memory) {
      console.log('[EthMem Background] No memory extracted');
      sendResponse({ success: false, message: 'No memory extracted' });
      return;
    }
    
    // Check for duplicates
    const duplicate = await isDuplicate(memory);
    
    if (duplicate) {
      console.log('[EthMem Background] Duplicate memory, skipping');
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
    console.error('[EthMem Background] Error in handleExtractMemory:', error);
    console.error('[EthMem Background] Error stack:', error.stack);
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
 * Handle ranked memories request
 */
async function handleGetRankedMemories(userMessage, maxMemories, sendResponse) {
  try {
    // Get all memories first
    const memories = await getAllMemories();
    
    if (!memories || memories.length === 0) {
      sendResponse({
        success: true,
        memories: []
      });
      return;
    }

    console.log(`[EthMem] Ranking ${memories.length} memories for: "${userMessage}"`);

    // Try cloud AI ranking
    if (typeof rankMemoriesWithAI !== 'undefined') {
      const rankedMemories = await rankMemoriesWithAI(userMessage, memories, maxMemories);
      
      sendResponse({
        success: true,
        memories: rankedMemories
      });
      return;
    }

    // Fallback: return most recent
    const recentMemories = memories
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxMemories);

    sendResponse({
      success: true,
      memories: recentMemories
    });

  } catch (error) {
    console.error('[EthMem] Error in handleGetRankedMemories:', error);
    sendResponse({
      success: false,
      memories: [],
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

/**
 * Handle smart message processing (extract + rank in one call)
 */
async function handleProcessMessageSmart(payload, sendResponse) {
  try {
    const { userMessage } = payload;
    
    console.log('[EthMem] Smart processing message:', userMessage.substring(0, 50));
    
    // Get API config
    const config = await loadConfig();
    if (!config.apiKey) {
      console.warn('[EthMem] No API key configured for smart processing');
      sendResponse({
        success: false,
        error: 'No API key configured',
        relevant: [],
        newMemory: null
      });
      return;
    }
    
    // Get all existing memories
    const allMemories = await getAllMemories();
    console.log('[EthMem] Processing with', allMemories.length, 'existing memories');
    
    // Note: Even if no memories exist yet, we should still try to extract new ones
    // So we don't return early here anymore
    
    // Process with GPT
    const result = await processMessageSmart(
      userMessage,
      allMemories, // Can be empty array
      config.apiKey,
      config.model
    );
    
    console.log('[EthMem] Smart processing result:', {
      relevantCount: result.relevant?.length || 0,
      hasNewMemory: !!result.newMemory
    });
    
    // If there's a new memory, save it (after checking for duplicates)
    if (result.newMemory) {
      const memory = {
        id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        source: userMessage,
        category: result.newMemory.category,
        entity: result.newMemory.entity,
        description: result.newMemory.description,
        context: {
          conversationId: 'chatgpt-' + Date.now(),
          platform: 'chatgpt'
        },
        metadata: {
          confidence: result.newMemory.confidence || 0.8,
          modelUsed: config.model || 'gpt-3.5-turbo',
          extractionVersion: '3.0-smart'
        },
        status: 'local'
      };
      
      // Check for duplicates before saving
      const duplicate = await isDuplicate(memory);
      
      if (duplicate) {
        console.log('[EthMem] ⚠️  Duplicate memory detected, skipping save');
      } else {
        await saveMemory(memory);
        console.log('[EthMem] ✅ New memory saved:', memory.description);
      }
    }
    
    // Format relevant memories for injection
    const injectionText = formatMemoriesForInjection(result.relevant);
    
    console.log('[EthMem] Smart processing complete:');
    console.log('[EthMem]   Relevant memories:', result.relevant.length);
    console.log('[EthMem]   New memory:', result.newMemory ? 'Yes' : 'No');
    
    sendResponse({
      success: true,
      relevant: result.relevant,
      injectionText: injectionText,
      newMemory: result.newMemory
    });
    
  } catch (error) {
    console.error('[EthMem] Error in smart processing:', error);
    sendResponse({
      success: false,
      error: error.message,
      relevant: [],
      newMemory: null
    });
  }
}
