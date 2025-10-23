export default function MessageFlow({ messages }) {
  const getMessageIcon = (type) => {
    switch (type) {
      case 'offer': return '💼'
      case 'counter_offer': return '🔄'
      case 'accept': return '✅'
      case 'payment_request': return '💳'
      case 'payment': return '💰'
      default: return '📨'
    }
  }

  const getMessageColor = (type) => {
    switch (type) {
      case 'offer': return 'from-blue-500/20 to-blue-600/20 border-blue-500'
      case 'counter_offer': return 'from-purple-500/20 to-purple-600/20 border-purple-500'
      case 'accept': return 'from-green-500/20 to-green-600/20 border-green-500'
      case 'payment_request': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500'
      case 'payment': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500'
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold flex items-center">
          <span className="mr-2 text-2xl">📨</span>
          A2A Message Flow
          <span className="ml-3 px-3 py-1 rounded-full text-sm font-normal" style={{ background: 'rgba(55, 217, 116, 0.2)', color: '#37d974' }}>
            {messages.length} messages
          </span>
        </h3>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 opacity-30" style={{ background: 'linear-gradient(to bottom, #37d974, #2ab85f, #37d974)' }}></div>
        
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className="relative"
              style={{ 
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-4 h-4 rounded-full border-2 z-10" style={{ background: 'linear-gradient(135deg, #37d974, #2ab85f)', borderColor: '#1a2720' }}></div>
              
              <div className={`ml-16 bg-gradient-to-r ${getMessageColor(msg.type)} border-l-4 rounded-r-lg p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl transform hover:scale-110 transition-transform">
                    {getMessageIcon(msg.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                          {msg.from.avatar} {msg.from.name}
                        </span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                          {msg.to.avatar} {msg.to.name}
                        </span>
                      </div>
                      
                      <span className="text-xs text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-sm md:text-base text-gray-200 mb-3 font-medium">{msg.content.message}</p>
                    
                    {msg.content.price && (
                      <div className="flex items-center flex-wrap gap-3 text-sm">
                        <span className="px-4 py-2 rounded-lg font-bold text-lg shadow-lg" style={{ background: 'linear-gradient(to right, rgba(55, 217, 116, 0.3), rgba(42, 184, 95, 0.3))', border: '1px solid rgba(55, 217, 116, 0.3)' }}>
                          💎 {msg.content.price} HBAR
                        </span>
                        {msg.content.invoiceId && (
                          <span className="text-xs text-gray-400 font-mono bg-white/5 px-2 py-1 rounded">
                            Invoice: {msg.content.invoiceId.substring(0, 8)}...
                          </span>
                        )}
                        {msg.content.txId && (
                          <span className="text-xs text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded border border-green-500/30">
                            TX: {msg.content.txId.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                        {msg.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

