'use client'

import { useState } from 'react'
import axios from 'axios'
import { Scale, Send, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import MemoryViewer from '../components/MemoryViewer'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function LegalPage() {
  const [clientId, setClientId] = useState('')
  const [caseDescription, setCaseDescription] = useState('')
  const [legalHistory, setLegalHistory] = useState('')
  const [caseType, setCaseType] = useState('general')
  const [urgencyLevel, setUrgencyLevel] = useState('normal')
  const [isLoading, setIsLoading] = useState(false)
  const [consultation, setConsultation] = useState(null)
  const [memories, setMemories] = useState([])
  const [error, setError] = useState(null)

  const loadMemories = async (cliId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/legal/memories`, {
        user_id: cliId,
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
      const response = await axios.post(`${API_BASE_URL}/api/legal/consult`, {
        client_id: clientId,
        case_description: caseDescription,
        legal_history: legalHistory,
        case_type: caseType,
        urgency_level: urgencyLevel
      })
      
      setConsultation(response.data)
      await loadMemories(clientId)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get legal consultation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <Scale size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Legal Consultation
            </h1>
            <p className="text-gray-400">Intelligent legal advice with case history</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-strong rounded-xl border border-white/10 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                onBlur={() => clientId && loadMemories(clientId)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all"
                placeholder="Enter client ID (e.g., CLI001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Case Description
              </label>
              <textarea
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 h-32 transition-all"
                placeholder="Describe your legal case in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Legal History (Optional)
              </label>
              <textarea
                value={legalHistory}
                onChange={(e) => setLegalHistory(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 h-24 transition-all"
                placeholder="Any relevant legal history..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Case Type
                </label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                >
                  <option value="general" className="bg-gray-900">General</option>
                  <option value="civil" className="bg-gray-900">Civil</option>
                  <option value="criminal" className="bg-gray-900">Criminal</option>
                  <option value="corporate" className="bg-gray-900">Corporate</option>
                  <option value="family" className="bg-gray-900">Family Law</option>
                  <option value="real-estate" className="bg-gray-900">Real Estate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urgency Level
                </label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
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
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Get Legal Consultation
                </>
              )}
            </button>
          </form>

          {isLoading && <LoadingSpinner message="Analyzing your case..." />}

          {consultation && !isLoading && (
            <div className="mt-6 glass-strong rounded-xl border border-white/10 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <CheckCircle2 size={24} className="text-blue-400 mr-2" />
                Legal Analysis
              </h2>

              <div className="border-l-4 border-blue-500 pl-4 bg-blue-500/10 py-2 rounded-r">
                <h3 className="font-semibold text-gray-300 mb-2">Analysis</h3>
                <p className="text-gray-400 leading-relaxed">{consultation.legal_analysis}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {consultation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Next Steps</h3>
                <ol className="space-y-2">
                  {consultation.next_steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold mr-2 border border-blue-500/30">
                        {index + 1}
                      </span>
                      <span className="text-gray-400">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  consultation.consultation_required 
                    ? 'bg-yellow-500/10 border-yellow-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <div className="text-sm text-gray-400 mb-1">In-Person Consultation</div>
                  <div className={`font-semibold ${
                    consultation.consultation_required ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {consultation.consultation_required ? 'Required' : 'Not Required'}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Urgency</div>
                  <div className="font-semibold text-blue-400 capitalize">
                    {consultation.urgency_assessment}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                {new Date(consultation.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-strong rounded-xl border border-white/10 p-6 sticky top-6">
            <MemoryViewer
              memories={memories}
              userId={clientId}
              agentType="legal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
