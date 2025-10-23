export default function MessageFlow({ messages, seller, buyer }) {
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
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="mr-2">📨</span>
        A2A Message Flow
      </h3>
      
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`bg-gradient-to-r ${getMessageColor(msg.type)} border-l-4 rounded-r-lg p-4 backdrop-blur-sm animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{getMessageIcon(msg.type)}</div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">
                      {msg.from.avatar} {msg.from.name}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-semibold">
                      {msg.to.avatar} {msg.to.name}
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">{msg.content.message}</p>
                
                {msg.content.price && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="px-3 py-1 bg-white/10 rounded-full font-semibold">
                      💎 {msg.content.price} HBAR
                    </span>
                    {msg.content.invoiceId && (
                      <span className="text-xs text-gray-400 font-mono">
                        {msg.content.invoiceId}
                      </span>
                    )}
                    {msg.content.txId && (
                      <span className="text-xs text-gray-400 font-mono">
                        TX: {msg.content.txId}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {msg.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

