export default function NegotiationStats({ stats }) {
  const savingsPercent = stats.agreedPrice 
    ? ((stats.initialPrice - stats.agreedPrice) / stats.initialPrice * 100).toFixed(1)
    : 0

  const priceProgress = stats.initialPrice > 0 
    ? ((stats.initialPrice - (stats.agreedPrice || stats.currentPrice)) / stats.initialPrice * 100).toFixed(0)
    : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold flex items-center">
          <span className="mr-2 text-2xl">📊</span>
          Negotiation Statistics
        </h3>
        {stats.status === 'negotiating' && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
            <span className="text-sm text-yellow-400 font-semibold">Live</span>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {stats.status === 'idle' && (
              <>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="font-bold text-lg text-gray-400">Idle</span>
              </>
            )}
            {stats.status === 'negotiating' && (
              <>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="font-bold text-lg text-yellow-400">Active</span>
              </>
            )}
            {stats.status === 'success' && (
              <>
                <div className="w-3 h-3 bg-green-400 rounded-full glow-green"></div>
                <span className="font-bold text-lg text-green-400">Success</span>
              </>
            )}
            {stats.status === 'failed' && (
              <>
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="font-bold text-lg text-red-400">Failed</span>
              </>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rounds
            </p>
          </div>
          <p className="text-3xl font-bold" style={{ color: '#37d974' }}>{stats.rounds}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stats.agreedPrice ? 'Final Price' : 'Current'}
            </p>
          </div>
          <p className="text-3xl font-bold glow-blue" style={{ color: '#37d974' }}>
            {stats.agreedPrice || stats.currentPrice}
            <span className="text-lg ml-1" style={{ color: '#2ab85f' }}>HBAR</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Savings
            </p>
          </div>
          <p className="text-3xl font-bold text-green-400 glow-green">
            {stats.savings}
            <span className="text-lg text-green-300 ml-1">HBAR</span>
          </p>
          {stats.agreedPrice && (
            <p className="text-sm text-green-300 mt-1">↓ {savingsPercent}% off</p>
          )}
        </div>
      </div>

      {/* Price Progress Bar */}
      {stats.status !== 'idle' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Price Reduction Progress</span>
            <span className="text-sm font-semibold" style={{ color: '#37d974' }}>{priceProgress}%</span>
          </div>
          <div className="progress-bar h-3">
            <div 
              className="progress-fill"
              style={{ width: `${priceProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
            <span>{stats.initialPrice} HBAR</span>
            <span>{stats.agreedPrice || stats.currentPrice} HBAR</span>
          </div>
        </div>
      )}

      {stats.status === 'success' && (
        <div className="mt-6 p-5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-xl glow-green animate-pulse">
          <p className="text-center text-green-400 font-bold text-lg flex items-center justify-center">
            <span className="text-3xl mr-3">🎉</span>
            Negotiation successful! Deal closed at {stats.agreedPrice} HBAR
            <span className="text-3xl ml-3">🎉</span>
          </p>
          <p className="text-center text-green-300 text-sm mt-2">
            You saved {stats.savings} HBAR ({savingsPercent}% discount)
          </p>
        </div>
      )}

      {stats.status === 'failed' && (
        <div className="mt-6 p-5 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-xl">
          <p className="text-center text-red-400 font-bold text-lg flex items-center justify-center">
            <span className="text-3xl mr-3">❌</span>
            Negotiation failed
          </p>
        </div>
      )}
    </div>
  )
}

