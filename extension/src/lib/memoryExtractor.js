// Memory Extraction Module
// Uses Laflan mini model to extract structured memories from text

console.log('[EthMem] Memory Extractor loaded');

// Categories we can extract
const CATEGORIES = [
  'location', 'name', 'age', 'occupation',
  'food', 'hobby', 'music', 'movie',
  'family', 'friend', 'colleague',
  'skill', 'language', 'education',
  'allergy', 'medication', 'condition',
  'visited', 'planning'
];

/**
 * Extract memory from text using AI model
 * @param {string} text - User's message text
 * @returns {Promise<Object|null>} - Extracted memory or null
 */
async function extractMemory(text) {
  console.log('[MemoryExtractor] extractMemory called with text:', text);
  
  try {
    console.log('[MemoryExtractor] Building extraction prompt...');
    
    // Prepare prompt for the model
    const prompt = buildExtractionPrompt(text);
    
    console.log('[MemoryExtractor] Prompt built, running model inference...');
    
    // Send to model for inference
    const result = await runModelInference(prompt);
    
    console.log('[MemoryExtractor] Model inference result:', result);
    
    if (!result || Object.keys(result).length === 0) {
      console.log('[MemoryExtractor] No memory extracted from model');
      return null;
    }
    
    // Validate and normalize result
    console.log('[MemoryExtractor] Validating and normalizing result...');
    const memory = validateAndNormalizeMemory(result, text);
    
    if (memory) {
      console.log('[MemoryExtractor] Memory extracted successfully:', memory);
    } else {
      console.log('[MemoryExtractor] Validation failed, no memory created');
    }
    
    return memory;
    
  } catch (error) {
    console.error('[MemoryExtractor] Error extracting memory:', error);
    console.error('[MemoryExtractor] Error stack:', error.stack);
    return null;
  }
}

/**
 * Build extraction prompt for the model
 * Optimized for T5 models which need simple, direct prompts
 */
function buildExtractionPrompt(text) {
  // T5 models work best with task prefixes and simple instructions
  return `extract personal fact: ${text}`;
}

/**
 * Run model inference
 * This function is called from background script context via importScripts
 * It needs to communicate with the ChatGPT tab to run inference
 */
async function runModelInference(prompt) {
  // Check if active model is set
  const { activeModel, modelStates } = await chrome.storage.local.get(['activeModel', 'modelStates']);
  
  if (!activeModel) {
    console.log('[MemoryExtractor] No active model set, using pattern-based extraction');
    return patternBasedExtraction(prompt);
  }
  
  // Check if active model is loaded
  const modelState = modelStates?.[activeModel];
  if (!modelState || modelState.status !== 'loaded') {
    console.log('[MemoryExtractor] Active model not loaded, using pattern-based extraction');
    return patternBasedExtraction(prompt);
  }
  
  console.log('[MemoryExtractor] Using AI model for extraction:', activeModel);
  
  try {
    // Find ChatGPT tab to send inference request
    const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
    
    if (tabs.length === 0) {
      console.warn('[MemoryExtractor] No ChatGPT tab found, using pattern fallback');
      return patternBasedExtraction(prompt);
    }
    
    const tab = tabs[0];
    console.log('[MemoryExtractor] Sending inference request to tab:', tab.id);
    
    // Send to content script which will forward to page context
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'RUN_MODEL_INFERENCE',
      payload: {
        prompt: prompt,
        modelId: activeModel,
        task: 'extraction'
      }
    });
    
    console.log('[MemoryExtractor] Received response from tab:', response);
    
    if (response?.success && response?.result) {
      console.log('[MemoryExtractor] Model extraction result:', response.result);
      
      // If result is empty or just whitespace, use pattern fallback
      if (!response.result || response.result.trim() === '' || response.result === '{}') {
        console.warn('[MemoryExtractor] Model returned empty result, using pattern fallback');
        return patternBasedExtraction(text);
      }
      
      return parseModelOutput(response.result);
    } else {
      console.warn('[MemoryExtractor] Model inference failed or no result, using pattern fallback');
      console.warn('[MemoryExtractor] Response was:', JSON.stringify(response));
      return patternBasedExtraction(text);
    }
    
  } catch (error) {
    console.error('[MemoryExtractor] Model inference error:', error);
    return patternBasedExtraction(prompt);
  }
}

/**
 * Parse model output to extract JSON
 */
function parseModelOutput(output) {
  try {
    // Try to find JSON in the output
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[EthMem] No JSON found in model output');
      return {};
    }
    
    const result = JSON.parse(jsonMatch[0]);
    console.log('[EthMem] Parsed model result:', result);
    return result;
    
  } catch (error) {
    console.error('[EthMem] Failed to parse model output:', error);
    return {};
  }
}

/**
 * Pattern-based extraction (fallback when model is not available)
 * This is a simple rule-based system as fallback
 */
function patternBasedExtraction(text) {
  console.log('[EthMem] Running pattern-based extraction on:', text);
  
  if (!text) return {};
  
  const lowerText = text.toLowerCase();
  
  // Location patterns
  if (lowerText.match(/\b(live in|from|in)\s+([a-z]+)/i)) {
    const match = lowerText.match(/\b(live in|from|in)\s+([a-z]+)/i);
    return {
      category: 'location',
      entity: match[2],
      confidence: 0.85
    };
  }
  
  // Name patterns
  if (lowerText.match(/\b(my name is|i am|i'm|call me)\s+([a-z]+)/i)) {
    const match = lowerText.match(/\b(my name is|i am|i'm|call me)\s+([a-z]+)/i);
    return {
      category: 'name',
      entity: match[2],
      confidence: 0.90
    };
  }
  
  // Age patterns
  if (lowerText.match(/\b(i am|i'm|age)\s+(\d+)\s*(years?|yrs?|old)?/i)) {
    const match = lowerText.match(/\b(i am|i'm|age)\s+(\d+)/i);
    return {
      category: 'age',
      entity: match[2],
      confidence: 0.88
    };
  }
  
  // Occupation patterns
  if (lowerText.match(/\b(i am a|i'm a|i work as|my job is)\s+([a-z\s]+)/i)) {
    const match = lowerText.match(/\b(i am a|i'm a|i work as|my job is)\s+([a-z\s]+)/i);
    return {
      category: 'occupation',
      entity: match[2].trim(),
      confidence: 0.82
    };
  }
  
  // Food preferences - improved to capture context
  if (lowerText.match(/\b(i like|i love|i enjoy|i hate|i dislike|favorite food|favourite food)\s+([a-z\s]+)/i)) {
    const match = lowerText.match(/\b(i like|i love|i enjoy|i hate|i dislike|favorite food|favourite food)\s+([a-z\s]+)/i);
    const sentiment = match[1].toLowerCase();
    const food = match[2].trim();
    
    // Build contextual description
    let description = '';
    if (sentiment.includes('love') || sentiment.includes('favorite') || sentiment.includes('favourite')) {
      description = `User loves ${food}`;
    } else if (sentiment.includes('like') || sentiment.includes('enjoy')) {
      description = `User likes ${food}`;
    } else if (sentiment.includes('hate') || sentiment.includes('dislike')) {
      description = `User dislikes ${food}`;
    }
    
    return {
      category: 'food',
      entity: food,
      description: description,
      confidence: 0.85
    };
  }
  
  // Hobbies
  if (lowerText.match(/\b(hobby|hobbies|i enjoy|i like to|i love to)\s+([a-z\s]+)/i)) {
    const match = lowerText.match(/\b(hobby|hobbies|i enjoy|i like to|i love to)\s+([a-z\s]+)/i);
    return {
      category: 'hobby',
      entity: match[2].trim(),
      confidence: 0.78
    };
  }
  
  // Skills
  if (lowerText.match(/\b(i know|i can|skilled in|expert in)\s+([a-z\s]+)/i)) {
    const match = lowerText.match(/\b(i know|i can|skilled in|expert in)\s+([a-z\s]+)/i);
    return {
      category: 'skill',
      entity: match[2].trim(),
      confidence: 0.80
    };
  }
  
  // Languages
  if (lowerText.match(/\b(i speak|i know|fluent in|language)\s+([a-z]+)/i)) {
    const match = lowerText.match(/\b(i speak|i know|fluent in|language)\s+([a-z]+)/i);
    return {
      category: 'language',
      entity: match[2],
      confidence: 0.85
    };
  }
  
  // Travel
  if (lowerText.match(/\b(visited|been to|traveled to|went to)\s+([a-z\s]+)/i)) {
    const match = lowerText.match(/\b(visited|been to|traveled to|went to)\s+([a-z\s]+)/i);
    return {
      category: 'visited',
      entity: match[2].trim(),
      confidence: 0.83
    };
  }
  
  // No pattern matched
  return {};
}

/**
 * Validate and normalize extracted memory
 */
function validateAndNormalizeMemory(result, sourceText) {
  if (!result || typeof result !== 'object') {
    return null;
  }
  
  const { category, entity, confidence, description } = result;
  
  // Validate required fields
  if (!category || !entity) {
    return null;
  }
  
  // Validate category
  if (!CATEGORIES.includes(category)) {
    console.warn('[EthMem] Invalid category:', category);
    return null;
  }
  
  // Validate confidence
  const conf = parseFloat(confidence) || 0.5;
  if (conf < 0.7) {
    console.log('[EthMem] Confidence too low:', conf);
    return null;
  }
  
  // Generate unique ID
  const id = generateId();
  
  // Build final memory object with rich context
  return {
    id,
    timestamp: Date.now(),
    source: sourceText,
    category,
    entity: String(entity).trim(),
    description: description || null, // Rich description like "User loves mangoes"
    context: {
      conversationId: 'chatgpt-' + Date.now(),
      platform: 'chatgpt'
    },
    metadata: {
      confidence: conf,
      modelUsed: 'pattern-based',
      extractionVersion: '2.0'
    },
    status: 'local' // Will be 'synced' or 'on-chain' later
  };
}

/**
 * Generate unique ID
 */
function generateId() {
  return 'mem-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Export for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { extractMemory };
}
