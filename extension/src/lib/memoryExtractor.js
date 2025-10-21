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
 * Extract memory from text using Laflan mini model
 * @param {string} text - User's message text
 * @returns {Promise<Object|null>} - Extracted memory or null
 */
async function extractMemory(text) {
  try {
    console.log('[EthMem] Extracting memory from text:', text.substring(0, 100));
    
    // Prepare prompt for the model
    const prompt = buildExtractionPrompt(text);
    
    // Send to model for inference
    const result = await runModelInference(prompt);
    
    if (!result || Object.keys(result).length === 0) {
      console.log('[EthMem] No memory extracted');
      return null;
    }
    
    // Validate and normalize result
    const memory = validateAndNormalizeMemory(result, text);
    
    if (memory) {
      console.log('[EthMem] Memory extracted successfully:', memory);
    }
    
    return memory;
    
  } catch (error) {
    console.error('[EthMem] Error extracting memory:', error);
    return null;
  }
}

/**
 * Build extraction prompt for the model
 */
function buildExtractionPrompt(text) {
  return `Extract structured information from this text. Return JSON only.
If no information can be extracted, return empty JSON {}.

Categories: ${CATEGORIES.join(', ')}

Rules:
- Only extract clear, factual information
- Assign confidence score (0.0 to 1.0)
- If unsure, return empty JSON
- Extract only ONE main piece of information

Text: "${text}"

Response format:
{
  "category": "location",
  "entity": "delhi",
  "confidence": 0.95
}

JSON:`;
}

/**
 * Run model inference
 * For now, we'll use a mock implementation
 * TODO: Replace with actual Laflan mini model
 */
async function runModelInference(prompt) {
  // Check if model is loaded in the sandboxed iframe
  const modelLoaded = await checkModelStatus();
  
  if (!modelLoaded) {
    console.log('[EthMem] Model not loaded, using pattern-based extraction');
    return patternBasedExtraction(prompt);
  }
  
  // TODO: Send to actual model
  // For now, use pattern-based fallback
  return patternBasedExtraction(prompt);
}

/**
 * Check if model is loaded
 */
async function checkModelStatus() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['modelLoaded'], (result) => {
      resolve(result.modelLoaded || false);
    });
  });
}

/**
 * Pattern-based extraction (fallback when model is not loaded)
 * This is a simple rule-based system until the model is fully integrated
 */
function patternBasedExtraction(prompt) {
  console.log('[EthMem] Running pattern-based extraction');
  // Extract the text from prompt
  const textMatch = prompt.match(/Text: "(.+?)"/);
  if (!textMatch) return {};
  
  const text = textMatch[1].toLowerCase();
  
  // Location patterns
  if (text.match(/\b(live in|from|in)\s+([a-z]+)/i)) {
    const match = text.match(/\b(live in|from|in)\s+([a-z]+)/i);
    return {
      category: 'location',
      entity: match[2],
      confidence: 0.85
    };
  }
  
  // Name patterns
  if (text.match(/\b(my name is|i am|i'm|call me)\s+([a-z]+)/i)) {
    const match = text.match(/\b(my name is|i am|i'm|call me)\s+([a-z]+)/i);
    return {
      category: 'name',
      entity: match[2],
      confidence: 0.90
    };
  }
  
  // Age patterns
  if (text.match(/\b(i am|i'm|age)\s+(\d+)\s*(years?|yrs?|old)?/i)) {
    const match = text.match(/\b(i am|i'm|age)\s+(\d+)/i);
    return {
      category: 'age',
      entity: match[2],
      confidence: 0.88
    };
  }
  
  // Occupation patterns
  if (text.match(/\b(i am a|i'm a|i work as|my job is)\s+([a-z\s]+)/i)) {
    const match = text.match(/\b(i am a|i'm a|i work as|my job is)\s+([a-z\s]+)/i);
    return {
      category: 'occupation',
      entity: match[2].trim(),
      confidence: 0.82
    };
  }
  
  // Food preferences
  if (text.match(/\b(i like|i love|i enjoy|favorite food|favourite food)\s+([a-z\s]+)/i)) {
    const match = text.match(/\b(i like|i love|i enjoy|favorite food|favourite food)\s+([a-z\s]+)/i);
    return {
      category: 'food',
      entity: match[2].trim(),
      confidence: 0.75
    };
  }
  
  // Hobbies
  if (text.match(/\b(hobby|hobbies|i enjoy|i like to|i love to)\s+([a-z\s]+)/i)) {
    const match = text.match(/\b(hobby|hobbies|i enjoy|i like to|i love to)\s+([a-z\s]+)/i);
    return {
      category: 'hobby',
      entity: match[2].trim(),
      confidence: 0.78
    };
  }
  
  // Skills
  if (text.match(/\b(i know|i can|skilled in|expert in)\s+([a-z\s]+)/i)) {
    const match = text.match(/\b(i know|i can|skilled in|expert in)\s+([a-z\s]+)/i);
    return {
      category: 'skill',
      entity: match[2].trim(),
      confidence: 0.80
    };
  }
  
  // Languages
  if (text.match(/\b(i speak|i know|fluent in|language)\s+([a-z]+)/i)) {
    const match = text.match(/\b(i speak|i know|fluent in|language)\s+([a-z]+)/i);
    return {
      category: 'language',
      entity: match[2],
      confidence: 0.85
    };
  }
  
  // Travel
  if (text.match(/\b(visited|been to|traveled to|went to)\s+([a-z\s]+)/i)) {
    const match = text.match(/\b(visited|been to|traveled to|went to)\s+([a-z\s]+)/i);
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
  
  const { category, entity, confidence } = result;
  
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
  
  // Build final memory object
  return {
    id,
    timestamp: Date.now(),
    source: sourceText,
    category,
    entity: String(entity).trim(),
    context: {
      conversationId: 'chatgpt-' + Date.now(),
      platform: 'chatgpt'
    },
    metadata: {
      confidence: conf,
      modelUsed: 'laflan-mini',
      extractionVersion: '1.0'
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
