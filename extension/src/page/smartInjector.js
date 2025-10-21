/**
 * Smart Memory Injector
 * Intercepts ChatGPT messages and injects relevant memories using active AI model
 */

(function() {
  console.log('[SmartInjector] Initializing...');

  // State
  let conversationMemoriesInjected = new Set(); // Track which conversations have memories
  let modelService = null;

  // Initialize
  async function init() {
    // Initialize model inference service
    modelService = new ModelInferenceService();
    await modelService.initialize();
    
    console.log('[SmartInjector] Model service initialized');

    // Intercept fetch
    interceptFetch();
  }

  /**
   * Intercept ChatGPT API calls
   */
  function interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async function(url, options = {}) {
      // Check if it's a ChatGPT conversation API
      if (url.includes('/backend-api/conversation') && options.method === 'POST') {
        try {
          const body = JSON.parse(options.body);
          
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
              const context = memoryRanker.buildContext(relevantMemories);
              
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
              options.body = JSON.stringify(body);
              
              // Mark conversation as injected
              conversationMemoriesInjected.add(conversationId);
              
              console.log(`[SmartInjector] ✅ Injected ${relevantMemories.length} memories into conversation`);
              
              // Notify user
              notifyInjection(relevantMemories);
            } else {
              console.log('[SmartInjector] No relevant memories found');
            }
          }
        } catch (error) {
          console.error('[SmartInjector] Injection failed:', error);
        }
      }

      // Continue with original fetch
      return originalFetch.apply(this, arguments);
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

      // Use model service to rank (with fallback to keyword matching)
      const rankedMemories = await modelService.rankMemories(
        userMessage, 
        response.memories,
        5 // top 5 memories
      );

      return rankedMemories;

    } catch (error) {
      console.error('[SmartInjector] Failed to get memories:', error);
      return [];
    }
  }

  /**
   * Build context string from memories
   */
  function buildContext(memories) {
    return modelService.buildContext(memories);
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
