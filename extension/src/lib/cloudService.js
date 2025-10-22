// cloudService.js - OpenAI API integration for memory extraction
// Uses GPT-3.5-turbo to extract structured memory data from conversations

/**
 * Extract memory from text using OpenAI GPT-3.5
 * @param {string} text - The conversation text to analyze
 * @param {string} apiKey - OpenAI API key
 * @param {string} model - Model to use (default: gpt-3.5-turbo)
 * @returns {Promise<Object|null>} Extracted memory or null if failed
 */
async function extractMemoryWithAI(text, apiKey, model = 'gpt-3.5-turbo') {
  if (!apiKey) {
    console.warn('[CloudAI] No API key provided');
    return null;
  }

  const prompt = `You are a memory extraction system. Analyze the following text and extract ONE specific, concrete piece of information about the user (preferences, facts, personal details, etc.).

Text: "${text}"

Extract the MOST IMPORTANT user-specific information and respond with a JSON object:
{
  "category": "food|location|name|age|occupation|skill|hobby|music|movie|family|friend|relationship|preference|goal|interest|language|education|allergy|visited|fact",
  "entity": "the specific thing (e.g., 'pizza', 'New York', 'coding', 'girlfriend')",
  "description": "clear description (e.g., 'User loves pizza', 'User lives in New York', 'User has a girlfriend')",
  "confidence": 0.0-1.0
}

IMPORTANT: Keep descriptions neutral and factual. Avoid storing overly personal or sensitive details verbatim.

If no meaningful user information is found, respond with:
{"category": "none", "entity": "", "description": "", "confidence": 0}

Respond ONLY with valid JSON, no other text.`;

  try {
    console.log('[CloudAI] Sending extraction request to OpenAI...');
    
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
            content: 'You are a precise memory extraction system. Extract ONE key fact about the user and respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[CloudAI] API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      console.warn('[CloudAI] Empty response from API');
      return null;
    }

    console.log('[CloudAI] Raw response:', content);

    // Parse JSON response
    const extracted = JSON.parse(content);
    
    // Validate response
    if (extracted.category === 'none' || !extracted.entity || !extracted.description) {
      console.log('[CloudAI] No meaningful memory found');
      return null;
    }

    console.log('[CloudAI] Successfully extracted memory:', extracted);
    return {
      category: extracted.category,
      entity: extracted.entity,
      description: extracted.description,
      confidence: extracted.confidence || 0.8,
      source: 'cloud-ai',
      model: model
    };

  } catch (error) {
    console.error('[CloudAI] Error extracting memory:', error);
    return null;
  }
}

/**
 * Test API key validity
 * @param {string} apiKey - OpenAI API key to test
 * @returns {Promise<Object>} {valid: boolean, error: string|null}
 */
async function testApiKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      return { valid: true, error: null };
    } else {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      return { valid: false, error: error.error?.message || 'Invalid API key' };
    }
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
