// smartMemoryService.js - Intelligent memory extraction and ranking
// Uses GPT-3.5-turbo to both extract new memories AND rank relevant ones

/**
 * Process a user message: extract new memories and rank relevant existing ones
 * @param {string} userMessage - The user's message
 * @param {Array} existingMemories - Array of existing memories
 * @param {string} apiKey - OpenAI API key
 * @param {string} model - Model to use (default: gpt-3.5-turbo)
 * @returns {Promise<Object>} {relevant: Array, newMemory: Object|null}
 */
async function processMessageSmart(userMessage, existingMemories, apiKey, model = 'gpt-3.5-turbo') {
  if (!apiKey) {
    console.warn('[SmartMemory] No API key provided');
    return { relevant: [], newMemory: null };
  }

  // Format memories for the prompt
  const memoryList = existingMemories.map((mem, idx) => 
    `${idx + 1}. [${mem.category}] ${mem.description || mem.entity}`
  ).join('\n');

  const prompt = `You are a memory assistant. You have some OLD MEMORIES about the user, and the user is now asking a NEW QUESTION.

OLD MEMORIES ABOUT THE USER:
${memoryList || 'No memories yet.'}

NEW QUESTION FROM USER:
"${userMessage}"

YOUR JOB:
1. Find which OLD MEMORIES would help answer this question better
2. Decide if this message reveals NEW FACTS about the user to remember

CRITICAL RULES FOR NEW MEMORIES:
DON'T save: Requests, questions, commands, one-time actions
   Examples of what NOT to save:
   - "i want to make shakes" → NO (temporary request)
   - "suggest me something" → NO (question)
   - "tell me about italy" → NO (request for info)
   - "what's the weather" → NO (question)

DO save: Personal facts, preferences, permanent information
   Examples of what TO save:
   - "i love bananas" → YES (preference)
   - "i'm allergic to peanuts" → YES (important fact)
   - "i live in delhi" → YES (permanent info)
   - "my name is rishi" → YES (identity)

MATCHING RELEVANT MEMORIES:
- For food/drink questions → Return ALL food preferences
- For location questions → Return location memories
- Be GENEROUS with matches - better to include too many than too few

EXAMPLES:

Example 1 - CORRECT MATCHING:
Memories: [1. User loves banana, 2. User is from Delhi]
Question: "i want to make shakes, suggest something"
Analysis: Banana is HIGHLY relevant (it's a food preference for drink question), Delhi is irrelevant
New memory: NO - "want to make shakes" is a REQUEST, not a fact about the user
Response: {"relevant": [1], "newMemory": null}

Example 2 - MULTIPLE FOOD MATCHES:
Memories: [1. User loves banana, 2. User loves apple, 3. User loves pav bhaji]
Question: "i want to make a juice"
Analysis: Banana and apple are BOTH relevant (all food preferences help), pav bhaji is food but less relevant to juice
New memory: NO - "want to make juice" is a REQUEST, not a preference
Response: {"relevant": [1, 2], "newMemory": null}

Example 3 - NO MATCH:
Memories: [1. User loves coding, 2. User speaks Hindi]
Question: "what's the weather?"
Analysis: No memories help with weather
New memory: NO - weather question doesn't reveal facts about user
Response: {"relevant": [], "newMemory": null}

Example 4 - EXTRACT NEW PREFERENCE:
Memories: [1. User loves banana]
Question: "i love mangoes"
Analysis: Banana not relevant to this statement
New memory: YES - "loves mangoes" is a PREFERENCE (permanent fact)
Response: {"relevant": [], "newMemory": {"category": "location|name|age|occupation|food|hobby|music|movie|family|friend|colleague|skill|language|education|allergy|medication|condition|visited|planning|preference|relationship|goal|interest|fact", "entity": "mangoes", "description": "User loves mangoes", "confidence": 0.95}}

Example 5 - REQUEST vs PREFERENCE:
Question: "i want to eat pizza"
Analysis: "want to eat" = temporary desire, NOT a preference
Response: {"relevant": [], "newMemory": null}

Question: "i love pizza"
Analysis: "love" = permanent preference
Response: {"relevant": [], "newMemory": {"category": "location|name|age|occupation|food|hobby|music|movie|family|friend|colleague|skill|language|education|allergy|medication|condition|visited|planning|preference|relationship|goal|interest|fact", "entity": "pizza", "description": "User loves pizza", "confidence": 0.95}}

NOW ANALYZE:
Return ONLY valid JSON with this structure:
{
  "relevant": [array of memory numbers like 1, 2, 3 or empty []],
  "newMemory": {category, entity, description, confidence} or null
}
JSON:`;

  try {
    console.log('[SmartMemory] Processing message with', existingMemories.length, 'existing memories');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a memory relevance analyzer. Your job is to identify which memories are truly relevant to a question, and detect new information. Be honest - if nothing is relevant, say so. Do not force connections. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[SmartMemory] API error:', response.status, errorData);
      return { relevant: [], newMemory: null };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      console.warn('[SmartMemory] Empty response from API');
      return { relevant: [], newMemory: null };
    }

    console.log('[SmartMemory] Raw response:', content);

    // Parse JSON response
    const result = JSON.parse(content);
    
    // Convert indices to actual memories
    const relevantMemories = (result.relevant || [])
      .map(idx => existingMemories[idx - 1])
      .filter(mem => mem); // Filter out undefined

    console.log('[SmartMemory] Found', relevantMemories.length, 'relevant memories');
    
    if (result.newMemory) {
      console.log('[SmartMemory] New memory to extract:', result.newMemory);
    }

    return {
      relevant: relevantMemories,
      newMemory: result.newMemory
    };

  } catch (error) {
    console.error('[SmartMemory] Error processing message:', error);
    return { relevant: [], newMemory: null };
  }
}

/**
 * Format memories for injection into chat
 * @param {Array} memories - Array of memory objects
 * @returns {string} Formatted context string
 */
function formatMemoriesForInjection(memories) {
  if (!memories || memories.length === 0) {
    return '';
  }

  const formatted = memories
    .map(mem => mem.description || `${mem.category}: ${mem.entity}`)
    .join('. ');

  return `\n\n[Personal Context: ${formatted}]`;
}
