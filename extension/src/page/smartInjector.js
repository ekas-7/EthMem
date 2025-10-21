/**
 * Smart Memory Injector
 * Intercepts ChatGPT messages and injects relevant memories using active AI model
 */

(function() {
  console.log('[SmartInjector] Initializing...');

  // State
  let conversationMemoriesInjected = new Set(); // Track which conversations have memories
  let activeModelId = null;

  // Initialize
  async function init() {
    // Get active model from content script (can't access chrome.storage in page context)
    try {
      const response = await sendMessageToContentScript({
        type: 'GET_ACTIVE_MODEL'
      });
      activeModelId = response?.activeModel || null;
      console.log('[SmartInjector] Active model:', activeModelId || 'none');
    } catch (error) {
      console.warn('[SmartInjector] Could not get active model:', error);
    }

    // Intercept fetch
    interceptFetch();
  }

  /**
   * Intercept ChatGPT API calls
   */
  function interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async function(url, options) {
      // Safety check: ensure url is a string
      if (typeof url !== 'string') {
        return originalFetch.call(this, url, options);
      }

      // Check if it's a ChatGPT conversation API
      if (url.includes('/backend-api/conversation') && options?.method === 'POST') {
        try {
          // Clone options to avoid mutating original
          const clonedOptions = { ...options };
          const body = JSON.parse(clonedOptions.body);
          
          // Only inject on first message of conversation
          const conversationId = body.conversation_id || 'new';
          const isFirstMessage = !conversationMemoriesInjected.has(conversationId);

          if (isFirstMessage && body.messages?.length > 0) {
            console.log('[SmartInjector] Detected first message in conversation');
            
            // Get user's message
            const userMessage = body.messages[body.messages.length - 1].content.parts[0];
            
            // Get relevant memories
            const relevantMemories = await getRelevantMemories(userMessage);
            
            if (relevantMemories.length > 0) {
              // Build context
              const context = buildContext(relevantMemories);
              
              // Inject system message
              body.messages.unshift({
                id: crypto.randomUUID(),
                author: { role: 'system' },
                content: {
                  content_type: 'text',
                  parts: [context]
                }
              });

              // Update request body
              clonedOptions.body = JSON.stringify(body);
              
              // Mark conversation as injected
              conversationMemoriesInjected.add(conversationId);
              
              console.log(`[SmartInjector] ✅ Injected ${relevantMemories.length} memories into conversation`);
              
              // Notify user
              notifyInjection(relevantMemories);
              
              // Call original fetch with modified options
              return originalFetch.call(this, url, clonedOptions);
            } else {
              console.log('[SmartInjector] No relevant memories found');
            }
          }
        } catch (error) {
          console.error('[SmartInjector] Injection failed:', error);
        }
      }

      // Continue with original fetch (unchanged)
      return originalFetch.call(this, url, options);
    };

    console.log('[SmartInjector] Fetch interceptor installed');
  }

  /**
   * Get relevant memories for user's message
   */
  async function getRelevantMemories(userMessage) {
    try {
      // Request memories from content script
      const response = await sendMessageToContentScript({
        type: 'GET_ALL_MEMORIES'
      });

      if (!response?.memories || response.memories.length === 0) {
        console.log('[SmartInjector] No memories available');
        return [];
      }

      console.log(`[SmartInjector] Got ${response.memories.length} memories from storage`);

      // Use simple keyword-based ranking (model inference happens in background/content script)
      const rankedMemories = rankMemoriesByKeywords(userMessage, response.memories, 5);

      return rankedMemories;

    } catch (error) {
      console.error('[SmartInjector] Failed to get memories:', error);
      return [];
    }
  }

  /**
   * Rank memories by keyword matching (fallback when model not available in page context)
   */
  function rankMemoriesByKeywords(userMessage, memories, topN = 5) {
    const messageLower = userMessage.toLowerCase();
    const keywords = messageLower.split(/\s+/);

    const scored = memories.map(mem => {
      const memText = `${mem.category} ${mem.entity} ${mem.context || ''}`.toLowerCase();
      
      let score = 0;
      keywords.forEach(kw => {
        if (memText.includes(kw)) score++;
      });

      // Boost recent memories
      const age = Date.now() - new Date(mem.timestamp).getTime();
      const recencyBoost = Math.max(0, 1 - (age / (1000 * 60 * 60 * 24 * 30)));
      score += recencyBoost * 0.5;

      // Boost high confidence
      if (mem.metadata?.confidence) {
        score += mem.metadata.confidence * 0.3;
      }

      return { memory: mem, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map(s => s.memory);
  }

  /**
   * Build context string from memories
   */
  function buildContext(memories) {
    if (!memories || memories.length === 0) {
      return null;
    }

    let context = "Personal context about the user:\n\n";
    
    memories.forEach(mem => {
      context += `• ${mem.category}: ${mem.entity}`;
      if (mem.context) {
        context += ` (${mem.context})`;
      }
      context += `\n`;
    });

    context += `\nUse this information to personalize your responses naturally.`;
    return context;
  }

  /**
   * Send message to content script via window.postMessage
   */
  function sendMessageToContentScript(message) {
    return new Promise((resolve, reject) => {
      const messageId = crypto.randomUUID();
      
      // Listen for response
      const listener = (event) => {
        if (event.data?.messageId === messageId) {
          window.removeEventListener('message', listener);
          resolve(event.data);
        }
      };
      
      window.addEventListener('message', listener);
      
      // Send request
      window.postMessage({ 
        ...message, 
        messageId,
        source: 'ethmem-page-script' 
      }, '*');
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('message', listener);
        reject(new Error('Content script timeout'));
      }, 5000);
    });
  }

  /**
   * Show user which memories were injected
   */
  function notifyInjection(memories) {
    // Send notification to content script to show badge
    window.postMessage({
      type: 'MEMORIES_INJECTED',
      memories: memories.map(m => ({
        category: m.category,
        entity: m.entity
      })),
      source: 'ethmem-page-script'
    }, '*');
  }

  // Start
  init();

})();
