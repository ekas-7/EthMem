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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center mr-4">
            <Headphones size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Support</h1>
            <p className="text-gray-600">Smart customer service with ticket memory</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer ID
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                onBlur={() => customerId && loadMemories(customerId)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter customer ID (e.g., CUST001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context (Optional)
              </label>
              <textarea
                value={ticketHistory}
                onChange={(e) => setTicketHistory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24"
                placeholder="Previous tickets or relevant information..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                  <option value="product">Product</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center disabled:opacity-50"
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
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Ticket size={24} className="text-orange-600 mr-2" />
                  Ticket #{ticket.ticket_id}
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Resolved
                </span>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-700 mb-2">Solution</h3>
                <p className="text-gray-600 leading-relaxed">{ticket.solution}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {ticket.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  ticket.escalation_required ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  <div className="text-sm text-gray-600 mb-1">Escalation</div>
                  <div className={`font-semibold ${
                    ticket.escalation_required ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {ticket.escalation_required ? 'Required' : 'Not Required'}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Est. Resolution</div>
                  <div className="font-semibold text-blue-700">
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
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
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
