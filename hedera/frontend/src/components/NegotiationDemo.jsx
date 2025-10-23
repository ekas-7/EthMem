import { useState, useEffect } from 'react'
import AgentCard from './AgentCard'
import MessageFlow from './MessageFlow'
import ProductCard from './ProductCard'
import NegotiationStats from './NegotiationStats'
import Toast from './Toast'
import api from '../services/api'

export default function NegotiationDemo() {
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [toast, setToast] = useState(null)
  const [stats, setStats] = useState({
    initialPrice: 150,
    currentPrice: 150,
    agreedPrice: null,
    rounds: 0,
    savings: 0,
    status: 'idle' // idle, negotiating, success, failed
  })

  const [seller, setSeller] = useState({
    name: 'Seller Agent',
    account: '0.0.7118560',
    balance: 0,
    role: 'seller',
    avatar: '🏪',
    color: 'from-orange-500 to-red-500'
  })

  const [buyer, setBuyer] = useState({
    name: 'Buyer Agent',
    account: '0.0.7118542',
    balance: 0,
    role: 'buyer',
    avatar: '🛒',
    color: 'from-blue-500 to-purple-500'
  })

  const [product, setProduct] = useState({
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-canceling wireless headphones with 30-hour battery life',
    initialPrice: 150,
    minPrice: 100,
    image: '🎧'
  })

  // Check server health on mount
  useEffect(() => {
    checkServerHealth()
    loadProductInfo()
  }, [])

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  const checkServerHealth = async () => {
    try {
      await api.healthCheck()
      setIsConnected(true)
      setServerError(null)
      showToast('Connected to backend server', 'success')
    } catch (error) {
      setIsConnected(false)
      setServerError('Server not running. Please start the backend server with: npm run server')
      showToast('Backend server disconnected', 'error')
    }
  }

  const loadProductInfo = async () => {
    try {
      const productData = await api.getProduct()
      setProduct(prev => ({ ...prev, ...productData }))
      setStats(prev => ({ ...prev, initialPrice: productData.initialPrice }))
    } catch (error) {
      console.error('Failed to load product info:', error)
    }
  }

  const handleWebSocketMessage = (data) => {
    console.log('Handling message:', data.type)

    switch (data.type) {
      case 'status':
        if (data.data.status === 'negotiating') {
          setStats(prev => ({ ...prev, status: 'negotiating' }))
        }
        break

      case 'agents_initialized':
        setSeller(prev => ({ ...prev, ...data.data.seller, avatar: '🏪', color: 'from-orange-500 to-red-500' }))
        setBuyer(prev => ({ ...prev, ...data.data.buyer, avatar: '🛒', color: 'from-blue-500 to-purple-500' }))
        break

      case 'message':
        const msg = data.data
        const newMessage = {
          id: Date.now() + Math.random(),
          from: msg.from === 'seller' ? seller : buyer,
          to: msg.to === 'seller' ? seller : buyer,
          type: msg.messageType,
          content: {
            message: getMessageText(msg.messageType, msg.content),
            price: msg.content.offer?.price || msg.content.counterOffer?.price || msg.content.acceptance?.agreedPrice || msg.content.payment?.amount,
            invoiceId: msg.content.payment?.invoiceId,
            txId: msg.content.payment?.transactionId
          },
          timestamp: msg.timestamp
        }

        setMessages(prev => [...prev, newMessage])

        // Update stats based on message type
        if (msg.messageType === 'counter_offer') {
          setStats(prev => ({
            ...prev,
            currentPrice: msg.content.counterOffer.price,
            rounds: prev.rounds + 1
          }))
        }

        if (msg.messageType === 'accept') {
          const agreedPrice = msg.content.acceptance.agreedPrice
          setStats(prev => ({
            ...prev,
            agreedPrice,
            savings: product.initialPrice - agreedPrice
          }))
        }
        break

      case 'negotiation_complete':
        setIsNegotiating(false)
        if (data.data.success) {
          setStats(prev => ({
            ...prev,
            status: 'success',
            agreedPrice: data.data.agreedPrice,
            savings: data.data.savings,
            rounds: data.data.rounds
          }))

          // Update final balances
          if (data.data.finalBalances) {
            setSeller(prev => ({ ...prev, balance: data.data.finalBalances.seller }))
            setBuyer(prev => ({ ...prev, balance: data.data.finalBalances.buyer }))
          }
          
          showToast(`Deal successful! Saved ${data.data.savings} HBAR`, 'success')
        } else {
          setStats(prev => ({ ...prev, status: 'failed' }))
          showToast('Negotiation failed', 'error')
        }
        break

      case 'error':
        setIsNegotiating(false)
        setStats(prev => ({ ...prev, status: 'failed' }))
        setServerError(data.data.message)
        showToast(data.data.message, 'error')
        break

      default:
        console.log('Unknown message type:', data.type)
    }
  }

  const getMessageText = (type, content) => {
    switch (type) {
      case 'offer':
        return `Offering ${content.offer.productName} for ${content.offer.price} HBAR`
      case 'counter_offer':
        return `Counter-offering ${content.counterOffer.price} HBAR`
      case 'accept':
        return `Accepted! Deal at ${content.acceptance.agreedPrice} HBAR`
      case 'payment_request':
        return `Payment request: ${content.payment.amount} HBAR`
      case 'payment':
        return `Payment sent: ${content.payment.amount} HBAR`
      case 'reject':
        return `Rejected: ${content.rejection.reason}`
      default:
        return 'Message'
    }
  }

  const startNegotiation = async () => {
    if (!isConnected) {
      setServerError('Please start the backend server first: npm run server')
      showToast('Backend server not connected', 'error')
      return
    }

    try {
      setIsNegotiating(true)
      setStats({ ...stats, status: 'negotiating', rounds: 0 })
      setMessages([])
      setServerError(null)
      
      showToast('Starting negotiation...', 'info')

      // Connect to WebSocket
      await api.connect(handleWebSocketMessage, (error) => {
        setServerError('WebSocket connection failed')
        setIsNegotiating(false)
        showToast('WebSocket connection failed', 'error')
      })

      // Start negotiation
      await api.startNegotiation()
      showToast('Agents are negotiating...', 'info')

    } catch (error) {
      console.error('Error starting negotiation:', error)
      setServerError(error.message)
      setIsNegotiating(false)
      setStats(prev => ({ ...prev, status: 'failed' }))
      showToast('Failed to start negotiation', 'error')
    }
  }

  const resetDemo = () => {
    api.disconnect()
    setMessages([])
    setStats({
      initialPrice: product.initialPrice,
      currentPrice: product.initialPrice,
      agreedPrice: null,
      rounds: 0,
      savings: 0,
      status: 'idle'
    })
    setIsNegotiating(false)
    setServerError(null)
    checkServerHealth()
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Server Status */}
      {serverError && (
        <div className="card bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-bold text-red-400 mb-2 text-lg">Server Connection Error</h3>
              <p className="text-sm text-red-300 mb-3">{serverError}</p>
              <button
                onClick={checkServerHealth}
                className="btn-secondary text-sm px-4 py-2"
              >
                🔄 Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Banner */}
      <div className="flex justify-center">
        <div className={`px-6 py-3 rounded-xl border shadow-lg transition-all duration-300 ${
          isConnected 
            ? 'bg-green-500/20 border-green-500/40 glow-green' 
            : 'bg-red-500/20 border-red-500/40'
        }`}>
          <span className={`text-sm font-bold flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
            {isConnected ? '✓ Backend Connected' : '✗ Backend Disconnected'}
          </span>
        </div>
      </div>

      {/* Product Card */}
      <ProductCard product={product} />

      {/* Agents */}
      <div className="grid md:grid-cols-2 gap-6">
        <AgentCard agent={seller} />
        <AgentCard agent={buyer} />
      </div>

      {/* Stats */}
      <NegotiationStats stats={stats} />

      {/* Control Buttons */}
      <div className="flex justify-center items-center space-x-4 flex-wrap gap-4">
        {!isNegotiating && stats.status === 'idle' && (
          <button
            onClick={startNegotiation}
            className="btn-primary text-lg"
            disabled={!isConnected}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Start Real Negotiation</span>
            </span>
          </button>
        )}
        
        {(stats.status === 'success' || stats.status === 'failed') && (
          <button
            onClick={resetDemo}
            className="btn-secondary text-lg"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Demo</span>
            </span>
          </button>
        )}

        {isNegotiating && (
          <div className="card px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40 shimmer">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-t-3 border-yellow-400"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border border-yellow-400 opacity-20"></div>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-400">Negotiating on Hedera...</p>
                <p className="text-xs text-yellow-300">AI agents are working their magic ✨</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Flow */}
      {messages.length > 0 && (
        <MessageFlow messages={messages} seller={seller} buyer={buyer} />
      )}
    </div>
  )
}
