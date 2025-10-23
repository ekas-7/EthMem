export default function ProductCard({ product }) {
  return (
    <div className="card text-center max-w-3xl mx-auto relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(55, 217, 116, 0.05) 0%, rgba(42, 184, 95, 0.05) 50%, rgba(55, 217, 116, 0.03) 100%)' }}></div>
      
      <div className="relative">
        <div className="inline-block mb-4">
          <div className="text-8xl transform hover:scale-110 transition-transform duration-300 cursor-pointer animate-bounce-subtle">
            {product.image}
          </div>
          <div className="mt-2 px-4 py-1 rounded-full inline-flex items-center space-x-2" style={{ background: 'linear-gradient(to right, rgba(55, 217, 116, 0.3), rgba(42, 184, 95, 0.3))', border: '1px solid rgba(55, 217, 116, 0.3)' }}>
            <svg className="w-4 h-4" style={{ color: '#37d974' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-xs font-semibold" style={{ color: '#37d974' }}>Premium Product</span>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-3 gradient-text text-shadow">
          {product.name}
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
          {product.description}
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <div className="stat-card group transition-all" style={{ borderColor: 'transparent' }}>
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 mr-2" style={{ color: '#37d974' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-sm text-gray-400 font-semibold">Starting Price</p>
            </div>
            <p className="text-4xl font-bold glow-blue mb-2" style={{ color: '#37d974' }}>
              {product.initialPrice}
              <span className="text-xl ml-2" style={{ color: '#2ab85f' }}>HBAR</span>
            </p>
            <div className="progress-bar mt-3">
              <div className="h-full transition-all duration-500 ease-out" style={{ width: '100%', background: 'linear-gradient(90deg, #37d974, #2ab85f)' }}></div>
            </div>
          </div>
          
          <div className="stat-card group transition-all" style={{ borderColor: 'transparent' }}>
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 mr-2" style={{ color: '#37d974' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-400 font-semibold">Minimum Price</p>
            </div>
            <p className="text-4xl font-bold glow mb-2" style={{ color: '#37d974' }}>
              {product.minPrice}
              <span className="text-xl ml-2" style={{ color: '#2ab85f' }}>HBAR</span>
            </p>
            <div className="progress-bar mt-3">
              <div 
                className="h-full transition-all duration-500 ease-out" 
                style={{ width: `${(product.minPrice / product.initialPrice) * 100}%`, background: 'linear-gradient(90deg, #37d974, #2ab85f)' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Negotiable</span>
          </div>
          <span className="text-gray-600">•</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Instant Settlement</span>
          </div>
        </div>
      </div>
    </div>
  )
}

