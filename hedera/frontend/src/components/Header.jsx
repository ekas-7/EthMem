export default function Header() {
  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg pulse-glow" style={{ background: 'linear-gradient(135deg, #37d974 0%, #2ab85f 100%)' }}>
              <img src="logo.png" alt="Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text text-shadow">
                AI E-commerce Negotiation
              </h1>
              <p className="text-xs md:text-sm text-gray-400 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Multi-Agent System
                </span>
                <span className="text-gray-500">•</span>
                <span>Powered by Hedera & A2A</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <svg className="w-5 h-5" style={{ color: '#37d974' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-gray-300">Real-time</span>
            </div>
            <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30 shadow-lg">
              <span className="text-green-400 text-sm font-semibold flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Testnet
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
