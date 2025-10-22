// background.js - Service worker for EthMem extension
console.log('[EthMem] Background script loaded');

// Import memory extraction and storage modules
// Note: importScripts paths are relative to extension root
try {
  self.importScripts(
    '/src/lib/memoryStorage.js',
    '/src/lib/memoryExtractor.js', 
    '/src/lib/cloudService.js'
  );
  console.log('[EthMem] Scripts imported successfully');
} catch (error) {
  console.error('[EthMem] Failed to import scripts:', error);
  console.error('[EthMem] Error details:', error.message, error.name);
}

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
  
  if (message.type === 'RUN_MODEL_INFERENCE') {
    handleModelInference(message.payload, sendResponse);
    return true;
  }
  
  if (message.type === 'GET_RANKED_MEMORIES') {
    handleGetRankedMemories(message.userMessage, message.maxMemories || 5, sendResponse);
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
    
    console.log('[EthMem Background] Memory saved successfully:', memory.id);
    
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
 * Handle model inference request
 */
async function handleModelInference(payload, sendResponse) {
  try {
    const { prompt, modelId, task } = payload;
    
    console.log('[EthMem Background] Running model inference for task:', task);
    console.log('[EthMem Background] Model ID:', modelId);
    console.log('[EthMem Background] Prompt preview:', prompt.substring(0, 200) + '...');
    
    // Get model states to verify model is loaded
    const { modelStates } = await chrome.storage.local.get(['modelStates']);
    const modelState = modelStates?.[modelId];
    
    if (!modelState || modelState.status !== 'loaded') {
      console.warn('[EthMem Background] Model not loaded:', modelId, modelState);
      sendResponse({
        success: false,
        error: 'Model not loaded'
      });
      return;
    }
    
    console.log('[EthMem Background] Model is loaded, finding active ChatGPT tab...');
    
    // Find the active ChatGPT tab to send inference request through content script
    const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
    
    if (tabs.length === 0) {
      console.warn('[EthMem Background] No ChatGPT tab found for model inference');
      sendResponse({
        success: false,
        error: 'No ChatGPT tab found - model inference requires active ChatGPT tab'
      });
      return;
    }
    
    const tab = tabs[0];
    console.log('[EthMem Background] Sending inference request to tab:', tab.id);
    
    // Send inference request to content script, which will forward to page context
    chrome.tabs.sendMessage(tab.id, {
      type: 'RUN_MODEL_INFERENCE',
      payload: {
        prompt,
        modelId,
        task
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[EthMem Background] Error sending to content script:', chrome.runtime.lastError);
        sendResponse({
          success: false,
          error: chrome.runtime.lastError.message
        });
        return;
      }
      
      console.log('[EthMem Background] Model inference response:', response);
      sendResponse(response);
    });
    
  } catch (error) {
    console.error('[EthMem Background] Error in handleModelInference:', error);
    console.error('[EthMem Background] Stack:', error.stack);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}
