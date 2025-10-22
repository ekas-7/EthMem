'use client'

import { useState } from 'react'

export default function MemoryGrowthChart() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const values = [6,4,7,8,12,9,10,8,7,9,11,12];
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-48 bg-card-darker/50 rounded-lg p-4">
        {values.map((v, i) => {
          const isHighest = i === 4
          const isHovered = hoveredIndex === i
          return (
            <div 
              key={i} 
              className="flex-1 flex flex-col items-center justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <div className="absolute -mt-12 bg-emerald-900 text-emerald-300 px-2 py-1 rounded text-xs font-semibold shadow-lg">
                  {v} GB
                </div>
              )}
              <div 
                className={`w-full rounded-t transition-all duration-300 ${
                  isHighest 
                    ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/50' 
                    : 'bg-gradient-to-t from-emerald-700 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-500'
                } ${isHovered ? 'scale-105' : ''}`} 
                style={{height: `${v*7}%`}}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex justify-between text-xs text-muted px-2">
        {months.map((m,i)=> <div key={i} className="text-center">{m}</div>)}
      </div>
    </div>
  );
}

