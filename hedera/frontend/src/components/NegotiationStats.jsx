export default function NegotiationStats({ stats }) {
  const savingsPercent = stats.agreedPrice 
    ? ((stats.initialPrice - stats.agreedPrice) / stats.initialPrice * 100).toFixed(1)
    : 0

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="mr-2">📊</span>
        Negotiation Statistics
      </h3>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Status</p>
          <div className="flex items-center space-x-2">
            {stats.status === 'idle' && (
              <>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-semibold text-gray-400">Idle</span>
              </>
            )}
            {stats.status === 'negotiating' && (
              <>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-yellow-400">Negotiating</span>
              </>
            )}
            {stats.status === 'success' && (
              <>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="font-semibold text-green-400">Success</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Rounds</p>
          <p className="text-2xl font-bold">{stats.rounds}</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">
            {stats.agreedPrice ? 'Final Price' : 'Current Price'}
          </p>
          <p className="text-2xl font-bold text-blue-400">
            {stats.agreedPrice || stats.currentPrice} HBAR
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Savings</p>
          <p className="text-2xl font-bold text-green-400">
            {stats.savings} HBAR
            {stats.agreedPrice && (
              <span className="text-sm ml-2">({savingsPercent}%)</span>
            )}
          </p>
        </div>
      </div>

      {stats.status === 'success' && (
        <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-center text-green-400 font-semibold">
            🎉 Negotiation successful! Deal closed at {stats.agreedPrice} HBAR
          </p>
        </div>
      )}
    </div>
  )
}

