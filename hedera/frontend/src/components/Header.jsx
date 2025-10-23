export default function Header() {
  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                AI E-commerce Negotiation
              </h1>
              <p className="text-sm text-gray-400">
                Powered by Hedera Agent Kit & A2A Protocol
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <span className="text-green-400 text-sm font-semibold">● Testnet</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

