'use client'

import { useState } from 'react'
import { Clock, User, Brain } from 'lucide-react'

export default function MemoryViewer({ memories, userId, agentType }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!memories || memories.length === 0) {
    return (
      <div className="glass rounded-lg p-4 text-center text-gray-400 border border-white/10">
        No previous history found for this user
      </div>
    )
  }

  const displayMemories = isExpanded ? memories : memories.slice(0, 3)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-white flex items-center">
        <Brain className="mr-2 text-purple-400" size={20} />
        Memory History
      </h3>
      
      <div className="space-y-3">
        {displayMemories.map((memory, index) => (
          <div
            key={index}
            className="glass border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all hover:bg-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-full border border-cyan-500/20">
                {memory.category || 'General'}
              </span>
              {memory.timestamp && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {new Date(memory.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {memory.context || memory.description || memory.content}
            </p>
            
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {memory.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {memories.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
        >
          {isExpanded ? 'Show Less' : `Show ${memories.length - 3} More`}
        </button>
      )}
    </div>
  )
}
