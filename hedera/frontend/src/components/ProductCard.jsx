export default function ProductCard({ product }) {
  return (
    <div className="card text-center max-w-2xl mx-auto">
      <div className="text-6xl mb-4">{product.image}</div>
      <h2 className="text-3xl font-bold mb-2 gradient-text">{product.name}</h2>
      <p className="text-gray-300 mb-6">{product.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Initial Price</p>
          <p className="text-2xl font-bold text-blue-400">{product.initialPrice} HBAR</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Minimum Price</p>
          <p className="text-2xl font-bold text-purple-400">{product.minPrice} HBAR</p>
        </div>
      </div>
    </div>
  )
}

