export default function AgentCard({ agent }) {
  return (
    <div className="agent-card">
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
          {agent.avatar}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
          <p className="text-sm text-gray-400 mb-3">
            Account: <span className="text-blue-400 font-mono">{agent.account}</span>
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Balance:</span>
              <span className="text-lg font-semibold text-green-400">
                {agent.balance.toFixed(2)} HBAR
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Role:</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold capitalize">
                {agent.role}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Connected to Hedera Testnet</span>
        </div>
      </div>
    </div>
  )
}

