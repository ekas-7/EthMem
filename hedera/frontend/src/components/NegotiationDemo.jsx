import { useState, useEffect } from 'react'
import AgentCard from './AgentCard'
import MessageFlow from './MessageFlow'
import ProductCard from './ProductCard'
import NegotiationStats from './NegotiationStats'
import api from '../services/api'

export default function NegotiationDemo() {
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [serverError, setServerError] = useState(null)
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

  const checkServerHealth = async () => {
    try {
      await api.healthCheck()
      setIsConnected(true)
      setServerError(null)
    } catch (error) {
      setIsConnected(false)
      setServerError('Server not running. Please start the backend server with: npm run server')
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
        } else {
          setStats(prev => ({ ...prev, status: 'failed' }))
        }
        break

      case 'error':
        setIsNegotiating(false)
        setStats(prev => ({ ...prev, status: 'failed' }))
        setServerError(data.data.message)
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
      return
    }

    try {
      setIsNegotiating(true)
      setStats({ ...stats, status: 'negotiating', rounds: 0 })
      setMessages([])
      setServerError(null)

      // Connect to WebSocket
      await api.connect(handleWebSocketMessage, (error) => {
        setServerError('WebSocket connection failed')
        setIsNegotiating(false)
      })

      // Start negotiation
      await api.startNegotiation()

    } catch (error) {
      console.error('Error starting negotiation:', error)
      setServerError(error.message)
      setIsNegotiating(false)
      setStats(prev => ({ ...prev, status: 'failed' }))
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
      {/* Server Status */}
      {serverError && (
        <div className="card bg-red-500/20 border-red-500/50">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-400 mb-1">Server Error</h3>
              <p className="text-sm text-red-300">{serverError}</p>
              <button
                onClick={checkServerHealth}
                className="mt-2 text-xs px-3 py-1 bg-red-500/30 hover:bg-red-500/40 rounded"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex justify-center">
        <div className={`px-4 py-2 rounded-lg border ${isConnected ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
          <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            ● {isConnected ? 'Connected to Backend' : 'Backend Disconnected'}
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
      <div className="flex justify-center space-x-4">
        {!isNegotiating && stats.status === 'idle' && (
          <button
            onClick={startNegotiation}
            className="btn-primary"
            disabled={!isConnected}
          >
            🚀 Start Real Negotiation
          </button>
        )}
        
        {(stats.status === 'success' || stats.status === 'failed') && (
          <button
            onClick={resetDemo}
            className="btn-secondary"
          >
            🔄 Reset Demo
          </button>
        )}

        {isNegotiating && (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-lg">Negotiating on Hedera...</span>
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
