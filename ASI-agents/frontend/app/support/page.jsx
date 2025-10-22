'use client'

import { useState } from 'react'
import axios from 'axios'
import { Headphones, Send, AlertCircle, CheckCircle2, Clock, Ticket } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import MemoryViewer from '../components/MemoryViewer'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function SupportPage() {
  const [customerId, setCustomerId] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [ticketHistory, setTicketHistory] = useState('')
  const [priority, setPriority] = useState('normal')
  const [category, setCategory] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [memories, setMemories] = useState([])
  const [error, setError] = useState(null)

  const loadMemories = async (custId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/support/memories`, {
        user_id: custId,
        limit: 10
      })
      setMemories(response.data.memories)
    } catch (err) {
      console.error('Error loading memories:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/support/ticket`, {
        customer_id: customerId,
        issue_description: issueDescription,
        ticket_history: ticketHistory,
        priority: priority,
        category: category
      })
      
      setTicket(response.data)
      await loadMemories(customerId)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create support ticket')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center mr-4">
              <Headphones size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Customer Support
            </h1>
            <p className="text-gray-400">Smart customer service with ticket memory</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-strong rounded-xl border border-white/10 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer ID
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                onBlur={() => customerId && loadMemories(customerId)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 transition-all"
                placeholder="Enter customer ID (e.g., CUST001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Issue Description
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 h-32 transition-all"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Context (Optional)
              </label>
              <textarea
                value={ticketHistory}
                onChange={(e) => setTicketHistory(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-500 h-24 transition-all"
                placeholder="Previous tickets or relevant information..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                >
                  <option value="general" className="bg-gray-900">General</option>
                  <option value="technical" className="bg-gray-900">Technical</option>
                  <option value="billing" className="bg-gray-900">Billing</option>
                  <option value="account" className="bg-gray-900">Account</option>
                  <option value="product" className="bg-gray-900">Product</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white"
                >
                  <option value="low" className="bg-gray-900">Low</option>
                  <option value="normal" className="bg-gray-900">Normal</option>
                  <option value="high" className="bg-gray-900">High</option>
                  <option value="urgent" className="bg-gray-900">Urgent</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Submit Ticket
                </>
              )}
            </button>
          </form>

          {isLoading && <LoadingSpinner message="Processing your request..." />}

          {ticket && !isLoading && (
            <div className="mt-6 glass-strong rounded-xl border border-white/10 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Ticket size={24} className="text-orange-400 mr-2" />
                  Ticket #{ticket.ticket_id}
                </h2>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/30">
                  Resolved
                </span>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 bg-orange-500/10 py-2 rounded-r">
                <h3 className="font-semibold text-gray-300 mb-2">Solution</h3>
                <p className="text-gray-400 leading-relaxed">{ticket.solution}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {ticket.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  ticket.escalation_required 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <div className="text-sm text-gray-400 mb-1">Escalation</div>
                  <div className={`font-semibold ${
                    ticket.escalation_required ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {ticket.escalation_required ? 'Required' : 'Not Required'}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Est. Resolution</div>
                  <div className="font-semibold text-blue-400">
                    {ticket.estimated_resolution_time}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                {new Date(ticket.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-strong rounded-xl border border-white/10 p-6 sticky top-6">
            <MemoryViewer
              memories={memories}
              userId={customerId}
              agentType="customer_support"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
