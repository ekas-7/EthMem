export default function AgentCard({ agent }) {
  return (
    <div className="agent-card group">
      <div className="flex items-start space-x-4">
        <div className={`w-20 h-20 bg-gradient-to-br ${agent.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 glow`}>
          {agent.avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">{agent.name}</h3>
            <span className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wide`} style={{ background: agent.role === 'seller' ? 'linear-gradient(to right, rgba(55, 217, 116, 0.2), rgba(42, 184, 95, 0.2))' : 'linear-gradient(to right, rgba(55, 217, 116, 0.15), rgba(42, 184, 95, 0.15))', borderColor: 'rgba(55, 217, 116, 0.5)' }}>
              {agent.role}
            </span>
          </div>
          
          <div className="mb-3 p-2 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Account ID</p>
            <p className="font-mono font-semibold flex items-center" style={{ color: '#37d974', fontSize: '0.875rem' }}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {agent.account}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="stat-card">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Balance
                </span>
                <span className="text-2xl font-bold text-green-400 glow-green">
                  {agent.balance.toFixed(2)} <span className="text-sm text-green-300">HBAR</span>
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="h-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((agent.balance / 1000) * 100, 100)}%`, background: 'linear-gradient(90deg, #37d974, #2ab85f)' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Connected to Hedera Testnet</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secured</span>
          </div>
        </div>
      </div>
    </div>
  )
}

