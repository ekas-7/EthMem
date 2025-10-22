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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
            <Activity size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Medical Consultation</h1>
            <p className="text-gray-600">AI-powered healthcare consultations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onBlur={() => patientId && loadMemories(patientId)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter patient ID (e.g., PAT001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                placeholder="Describe your symptoms in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical History (Optional)
              </label>
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                placeholder="Any relevant medical history..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
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
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center disabled:opacity-50"
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
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <CheckCircle2 size={24} className="text-green-600 mr-2" />
                Consultation Results
              </h2>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-700 mb-2">Diagnosis</h3>
                <p className="text-gray-600 leading-relaxed">{consultation.diagnosis}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {consultation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  consultation.follow_up_required ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className="text-sm text-gray-600 mb-1">Follow-up Required</div>
                  <div className={`font-semibold ${
                    consultation.follow_up_required ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {consultation.follow_up_required ? 'Yes' : 'No'}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Urgency Assessment</div>
                  <div className="font-semibold text-blue-700 capitalize">
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
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
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
