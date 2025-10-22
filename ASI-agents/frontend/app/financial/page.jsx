'use client'

import { useState } from 'react'
import axios from 'axios'
import { DollarSign, Send, AlertCircle, TrendingUp, Clock, PieChart, AlertTriangle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import MemoryViewer from '../components/MemoryViewer'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function FinancialPage() {
  const [investorId, setInvestorId] = useState('')
  const [query, setQuery] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('moderate')
  const [investmentHistory, setInvestmentHistory] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [advisory, setAdvisory] = useState(null)
  const [memories, setMemories] = useState([])
  const [error, setError] = useState(null)

  const loadMemories = async (invId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/financial/memories`, {
        user_id: invId,
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
      let portfolioData = null
      if (portfolio) {
        try {
          portfolioData = JSON.parse(portfolio)
        } catch {
          // If not valid JSON, send as string
          portfolioData = { description: portfolio }
        }
      }

      const response = await axios.post(`${API_BASE_URL}/api/financial/advise`, {
        investor_id: investorId,
        query: query,
        portfolio: portfolioData,
        risk_tolerance: riskTolerance,
        investment_history: investmentHistory
      })
      
      setAdvisory(response.data)
      await loadMemories(investorId)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get financial advisory')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center mr-4">
            <DollarSign size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Advisory</h1>
            <p className="text-gray-400">Portfolio analysis and investment guidance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-strong rounded-xl border border-white/10 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Investor ID
              </label>
              <input
                type="text"
                value={investorId}
                onChange={(e) => setInvestorId(e.target.value)}
                onBlur={() => investorId && loadMemories(investorId)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter investor ID (e.g., INV001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Financial Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-32"
                placeholder="What would you like to know about your investments?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Portfolio Information (Optional)
              </label>
              <textarea
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-24 font-mono text-sm"
                placeholder='Enter as JSON: {"stocks": 50000, "bonds": 30000, "crypto": 10000} or describe your portfolio'
              />
              <p className="text-xs text-gray-500 mt-1">
                You can enter JSON format or describe your portfolio in text
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Investment History (Optional)
              </label>
              <textarea
                value={investmentHistory}
                onChange={(e) => setInvestmentHistory(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-20"
                placeholder="Previous investments, returns, or financial goals..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="conservative">Conservative (Low Risk)</option>
                <option value="moderate">Moderate (Medium Risk)</option>
                <option value="aggressive">Aggressive (High Risk)</option>
              </select>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Get Financial Advice
                </>
              )}
            </button>
          </form>

          {isLoading && <LoadingSpinner message="Analyzing your portfolio..." />}

          {advisory && !isLoading && (
            <div className="mt-6 glass-strong rounded-xl border border-white/10 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <TrendingUp size={24} className="text-yellow-600 mr-2" />
                Financial Analysis
              </h2>

              <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-gray-300 mb-2">Analysis</h3>
                <p className="text-gray-400 leading-relaxed">{advisory.analysis}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <PieChart size={20} className="text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-300">Risk Assessment</h3>
                  </div>
                  <p className="text-gray-400 capitalize">{advisory.risk_assessment}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle size={20} className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-300">Risk Tolerance</h3>
                  </div>
                  <p className="text-gray-400 capitalize">{riskTolerance}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Recommendations</h3>
                <div className="space-y-3">
                  {advisory.recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-gray-300">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {advisory.suggested_actions && advisory.suggested_actions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-300 mb-3">Suggested Actions</h3>
                  <div className="space-y-2">
                    {advisory.suggested_actions.map((action, index) => (
                      <div key={index} className="flex items-start bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <TrendingUp size={18} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Disclaimer:</strong> This is AI-generated advice for informational purposes only. 
                    Please consult with a certified financial advisor before making investment decisions.
                  </span>
                </p>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                {new Date(advisory.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-strong rounded-xl border border-white/10 p-6 sticky top-6">
            <MemoryViewer
              memories={memories}
              userId={investorId}
              agentType="financial"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
