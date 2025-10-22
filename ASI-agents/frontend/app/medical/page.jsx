'use client'

import { useState } from 'react'
import axios from 'axios'
import { Activity, Send, AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import MemoryViewer from '../components/MemoryViewer'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function MedicalPage() {
  const [patientId, setPatientId] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [urgencyLevel, setUrgencyLevel] = useState('normal')
  const [isLoading, setIsLoading] = useState(false)
  const [consultation, setConsultation] = useState(null)
  const [memories, setMemories] = useState([])
  const [error, setError] = useState(null)

  const loadMemories = async (patId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/medical/memories`, {
        user_id: patId,
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
      const response = await axios.post(`${API_BASE_URL}/api/medical/consult`, {
        patient_id: patientId,
        symptoms: symptoms,
        medical_history: medicalHistory,
        urgency_level: urgencyLevel
      })
      
      setConsultation(response.data)
      await loadMemories(patientId)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get consultation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center mr-4">
              <Activity size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Medical Consultation
            </h1>
            <p className="text-gray-400">AI-powered healthcare consultations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-strong rounded-xl border border-white/10 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Patient ID
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onBlur={() => patientId && loadMemories(patientId)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 transition-all"
                placeholder="Enter patient ID (e.g., PAT001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 h-32 transition-all"
                placeholder="Describe your symptoms in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Medical History (Optional)
              </label>
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 h-24 transition-all"
                placeholder="Any relevant medical history..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Urgency Level
              </label>
              <select
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white"
              >
                <option value="low" className="bg-[#0A1F1C]">Low</option>
                <option value="normal" className="bg-[#0A1F1C]">Normal</option>
                <option value="high" className="bg-[#0A1F1C]">High</option>
                <option value="emergency" className="bg-[#0A1F1C]">Emergency</option>
              </select>
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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Get Consultation
                </>
              )}
            </button>
          </form>

          {/* Results */}
          {isLoading && <LoadingSpinner message="Analyzing symptoms..." />}

          {consultation && !isLoading && (
            <div className="mt-6 glass-strong rounded-xl border border-white/10 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <CheckCircle2 size={24} className="text-emerald-400 mr-2" />
                Consultation Results
              </h2>

              <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-500/10 py-2 rounded-r">
                <h3 className="font-semibold text-gray-300 mb-2">Diagnosis</h3>
                <p className="text-gray-400 leading-relaxed">{consultation.diagnosis}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {consultation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  consultation.follow_up_required 
                    ? 'bg-yellow-500/10 border-yellow-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <div className="text-sm text-gray-400 mb-1">Follow-up Required</div>
                  <div className={`font-semibold ${
                    consultation.follow_up_required ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {consultation.follow_up_required ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Urgency Assessment</div>
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

        {/* Sidebar - Memories */}
        <div className="lg:col-span-1">
          <div className="glass-strong rounded-xl border border-white/10 p-6 sticky top-6">
            <MemoryViewer
              memories={memories}
              userId={patientId}
              agentType="medical"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
