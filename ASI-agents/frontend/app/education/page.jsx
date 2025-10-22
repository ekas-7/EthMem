'use client'

import { useState } from 'react'
import axios from 'axios'
import { GraduationCap, Send, AlertCircle, BookOpen, Clock, Lightbulb } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import MemoryViewer from '../components/MemoryViewer'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function EducationPage() {
  const [studentId, setStudentId] = useState('')
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('mathematics')
  const [learningLevel, setLearningLevel] = useState('intermediate')
  const [learningHistory, setLearningHistory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tutoring, setTutoring] = useState(null)
  const [memories, setMemories] = useState([])
  const [error, setError] = useState(null)

  const loadMemories = async (studId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/education/memories`, {
        user_id: studId,
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
      const response = await axios.post(`${API_BASE_URL}/api/education/tutor`, {
        student_id: studentId,
        question: question,
        subject: subject,
        learning_level: learningLevel,
        learning_history: learningHistory
      })
      
      setTutoring(response.data)
      await loadMemories(studentId)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get tutoring')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mr-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Education System</h1>
            <p className="text-gray-400">Personalized AI tutoring with adaptive learning</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-strong rounded-xl border border-white/10 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onBlur={() => studentId && loadMemories(studentId)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter student ID (e.g., STU001)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                placeholder="What would you like to learn today?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="programming">Programming</option>
                  <option value="history">History</option>
                  <option value="literature">Literature</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Learning Level
                </label>
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Learning Context (Optional)
              </label>
              <textarea
                value={learningHistory}
                onChange={(e) => setLearningHistory(e.target.value)}
                className="w-full px-4 py-2 bg-[#0F2D27]/50 border border-emerald-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20"
                placeholder="Any relevant background or what you've learned so far..."
              />
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
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Get Tutoring
                </>
              )}
            </button>
          </form>

          {isLoading && <LoadingSpinner message="Preparing your lesson..." />}

          {tutoring && !isLoading && (
            <div className="mt-6 glass-strong rounded-xl border border-white/10 p-6 space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BookOpen size={24} className="text-purple-600 mr-2" />
                Learning Material
              </h2>

              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-gray-300 mb-2">Explanation</h3>
                <p className="text-gray-400 leading-relaxed">{tutoring.explanation}</p>
              </div>

              {tutoring.examples && tutoring.examples.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-300 mb-3 flex items-center">
                    <Lightbulb size={20} className="mr-2 text-yellow-500" />
                    Examples
                  </h3>
                  <div className="space-y-3">
                    {tutoring.examples.map((example, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-300">Example {index + 1}</span>
                        </div>
                        <p className="text-gray-400 ml-8">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tutoring.practice_problems && tutoring.practice_problems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-300 mb-3">Practice Problems</h3>
                  <div className="space-y-2">
                    {tutoring.practice_problems.map((problem, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <p className="text-gray-300">{problem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tutoring.additional_resources && tutoring.additional_resources.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-300 mb-3">Additional Resources</h3>
                  <ul className="space-y-2">
                    {tutoring.additional_resources.map((resource, index) => (
                      <li key={index} className="flex items-start">
                        <BookOpen size={18} className="text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                {new Date(tutoring.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-strong rounded-xl border border-white/10 p-6 sticky top-6">
            <MemoryViewer
              memories={memories}
              userId={studentId}
              agentType="education"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
