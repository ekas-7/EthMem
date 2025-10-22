/**
 * Cloud AI Service
 * Handles extraction and ranking using cloud-based AI
 */

// Import config (will be loaded via importScripts in background context)
// CONFIG is already available from config.js import

/**
 * Initialize the service
 */
function initCloudService() {
  try {
    console.log('[CloudAI] Service initialized');
  } catch (error) {
    console.error('[CloudAI] Failed to initialize:', error);
  }
}

/**
 * Extract memory from text using cloud AI
 * @param {string} text - User's message
 * @returns {Promise<Object>} - Extracted memory
 */
async function extractMemoryWithAI(text) {
  if (!self.CONFIG || !self.CONFIG.USE_CLOUD_EXTRACTION) {
    console.log('[CloudAI] Cloud extraction disabled');
    return null;
  }

  console.log('[CloudAI] Extracting memory from:', text);

  const prompt = `You are a memory extraction system. Extract ONE important personal fact from this message.

Message: "${text}"

Extract a personal fact and return ONLY valid JSON in this exact format:
{
  "category": "food|location|name|age|occupation|hobby|skill|language|preference",
  "entity": "the main subject",
  "description": "natural language description (e.g., User loves bananas, User lives in Delhi)",
  "confidence": 0.85
}

Rules:
- Only extract clear personal facts
- confidence must be between 0.7 and 1.0
- If no clear fact exists, return: {"category": null, "entity": null, "confidence": 0}

JSON:`;

  try {
    const response = await fetch(self.CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${self.CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: self.CONFIG.MODEL,
        messages: [
          { role: 'system', content: 'You are a personal memory extraction assistant. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: self.self.CONFIG.EXTRACTION_TEMPERATURE,
        max_tokens: self.self.CONFIG.EXTRACTION_MAX_TOKENS
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    console.log('[CloudAI] Extraction response:', content);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[CloudAI] No JSON in response');
      return null;
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Check if extraction was successful
    if (!result.category || !result.entity || result.confidence < 0.7) {
      console.log('[CloudAI] No valid memory extracted');
      return null;
    }

    console.log('[CloudAI] Memory extracted:', result);
    return result;

  } catch (error) {
    console.error('[CloudAI] Extraction error:', error);
    return null;
  }
}

/**
 * Rank memories by relevance to current message
 * @param {string} userMessage - Current user message
 * @param {Array} memories - All available memories
 * @param {number} topN - Number of memories to return
 * @returns {Promise<Array>} - Top N relevant memories
 */
async function rankMemoriesWithAI(userMessage, memories, topN = 5) {
  if (!self.CONFIG || !self.self.CONFIG.USE_CLOUD_RANKING) {
    console.log('[CloudAI] Cloud ranking disabled');
    return memories.slice(0, topN);
  }

  if (!memories || memories.length === 0) {
    return [];
  }

  if (memories.length <= topN) {
    return memories;
  }

  console.log(`[CloudAI] Ranking ${memories.length} memories for message:`, userMessage);

  // Create a summary of memories with indices
  const memorySummary = memories.map((m, idx) => {
    return `${idx}: ${m.category} - ${m.entity} (${m.description || m.entity})`;
  }).join('\n');

  const prompt = `Given this user message and list of memories, select the ${topN} most relevant memory indices.

User message: "${userMessage}"

Available memories:
${memorySummary}

Return ONLY a JSON array of the ${topN} most relevant memory indices (numbers only), ordered by relevance.
Example: [3, 7, 1, 5, 2]

JSON array:`;

  try {
    const response = await fetch(self.CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${self.CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: self.CONFIG.MODEL,
        messages: [
          { role: 'system', content: 'You are a memory relevance ranking system. Return only a JSON array of indices.' },
          { role: 'user', content: prompt }
        ],
        temperature: self.CONFIG.RANKING_TEMPERATURE,
        max_tokens: self.CONFIG.RANKING_MAX_TOKENS
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    console.log('[CloudAI] Ranking response:', content);

    // Parse JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      console.warn('[CloudAI] No JSON array in response, using first N');
      return memories.slice(0, topN);
    }

    const indices = JSON.parse(jsonMatch[0]);
    
    // Get memories at those indices
    const rankedMemories = indices
      .slice(0, topN)
      .map(idx => memories[idx])
      .filter(Boolean);

    console.log(`[CloudAI] Selected ${rankedMemories.length} memories`);
    return rankedMemories;

  } catch (error) {
    console.error('[CloudAI] Ranking error:', error);
    return memories.slice(0, topN);
  }
}

// Service will be initialized by background script
