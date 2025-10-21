/**
 * Memory Ranker using Laflan Mini
 * Ranks memories by relevance to user's message
 */

class MemoryRanker {
  constructor() {
    this.laflanEndpoint = 'http://localhost:11434'; // Ollama local endpoint
    this.model = 'laflan-mini'; // Your WebGPU model
    this.maxMemories = 5; // Top N memories to inject
  }

  /**
   * Rank memories by relevance to user's message
   * @param {string} userMessage - The message user is sending
   * @param {Array} allMemories - All available memories from IndexedDB
   * @returns {Promise<Array>} Top N relevant memories
   */
  async rankMemories(userMessage, allMemories) {
    if (!allMemories || allMemories.length === 0) {
      console.log('[MemoryRanker] No memories to rank');
      return [];
    }

    try {
      console.log(`[MemoryRanker] Ranking ${allMemories.length} memories for: "${userMessage}"`);

      // Build prompt for Laflan
      const prompt = this.buildRankingPrompt(userMessage, allMemories);

      // Query Laflan mini
      const rankedIndices = await this.queryLaflan(prompt);

      // Get top N memories
      const topMemories = rankedIndices
        .slice(0, this.maxMemories)
        .map(idx => allMemories[idx])
        .filter(Boolean);

      console.log(`[MemoryRanker] Selected ${topMemories.length} memories:`, 
        topMemories.map(m => `${m.category}:${m.entity}`));

      return topMemories;

    } catch (error) {
      console.error('[MemoryRanker] Ranking failed:', error);
      // Fallback: simple keyword matching
      return this.fallbackRanking(userMessage, allMemories);
    }
  }

  /**
   * Build prompt for Laflan to rank memories
   */
  buildRankingPrompt(userMessage, memories) {
    let prompt = `User's message: "${userMessage}"\n\n`;
    prompt += `Available memories:\n`;
    
    memories.forEach((mem, idx) => {
      prompt += `${idx}. ${mem.category}: ${mem.entity}`;
      if (mem.context) {
        prompt += ` (${mem.context})`;
      }
      prompt += `\n`;
    });

    prompt += `\nTask: Which memories are most relevant to this message? `;
    prompt += `Return ONLY the indices (numbers) of the top 5 most relevant memories, separated by commas.\n`;
    prompt += `Example output: 0,3,7,12,15\n\n`;
    prompt += `Relevant indices: `;

    return prompt;
  }

  /**
   * Query Laflan mini via Ollama API
   */
  async queryLaflan(prompt) {
    const response = await fetch(`${this.laflanEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Low temp for consistent ranking
          num_predict: 20,  // Short response (just indices)
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Laflan API error: ${response.status}`);
    }

    const data = await response.json();
    const output = data.response.trim();

    console.log('[MemoryRanker] Laflan output:', output);

    // Parse indices: "0,3,7,12,15" → [0,3,7,12,15]
    const indices = output
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    return indices;
  }

  /**
   * Fallback: Simple keyword matching if Laflan fails
   */
  fallbackRanking(userMessage, memories) {
    console.log('[MemoryRanker] Using fallback keyword matching');

    const messageLower = userMessage.toLowerCase();
    const keywords = messageLower.split(/\s+/);

    // Score each memory
    const scored = memories.map(mem => {
      const memText = `${mem.category} ${mem.entity} ${mem.context || ''}`.toLowerCase();
      
      // Count keyword matches
      let score = 0;
      keywords.forEach(kw => {
        if (memText.includes(kw)) score++;
      });

      // Boost recent memories
      const age = Date.now() - new Date(mem.timestamp).getTime();
      const recencyBoost = Math.max(0, 1 - (age / (1000 * 60 * 60 * 24 * 30))); // 30 days
      score += recencyBoost * 0.5;

      // Boost high confidence
      if (mem.metadata?.confidence) {
        score += mem.metadata.confidence * 0.3;
      }

      return { memory: mem, score };
    });

    // Sort by score and take top N
    const topMemories = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.maxMemories)
      .map(s => s.memory);

    console.log(`[MemoryRanker] Fallback selected ${topMemories.length} memories`);
    return topMemories;
  }

  /**
   * Build context string from selected memories
   */
  buildContext(memories) {
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
   * Check if Laflan is available
   */
  async isLaflanAvailable() {
    try {
      const response = await fetch(`${this.laflanEndpoint}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      const hasLaflan = data.models?.some(m => m.name.includes('laflan'));
      
      console.log('[MemoryRanker] Laflan available:', hasLaflan);
      return hasLaflan;
      
    } catch (error) {
      console.log('[MemoryRanker] Laflan not available:', error.message);
      return false;
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryRanker;
}
