'use client'

import { useState } from 'react'
import { Clock, User } from 'lucide-react'

export default function MemoryViewer({ memories, userId, agentType }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!memories || memories.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        No previous history found for this user
      </div>
    )
  }

  const displayMemories = isExpanded ? memories : memories.slice(0, 3)

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-800 flex items-center">
        <span className="mr-2">🧠</span> Memory History
      </h3>
      
      <div className="space-y-3">
        {displayMemories.map((memory, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {memory.category || 'General'}
              </span>
              {memory.timestamp && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {new Date(memory.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              {memory.context || memory.description || memory.content}
            </p>
            
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {memory.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
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
          className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          {isExpanded ? 'Show Less' : `Show ${memories.length - 3} More`}
        </button>
      )}
    </div>
  )
}
