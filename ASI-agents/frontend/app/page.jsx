'use client'

import Link from 'next/link'
import { Activity, Scale, Headphones, GraduationCap, DollarSign, Home } from 'lucide-react'

export default function HomePage() {
  const agents = [
    {
      name: 'Medical Consultation',
      description: 'AI-powered healthcare consultations with personalized medical memory',
      icon: Activity,
      href: '/medical',
      color: 'from-green-400 to-emerald-600',
      emoji: '🏥'
    },
    {
      name: 'Legal Consultation',
      description: 'Intelligent legal advice with case history integration',
      icon: Scale,
      href: '/legal',
      color: 'from-blue-400 to-indigo-600',
      emoji: '⚖️'
    },
    {
      name: 'Customer Support',
      description: 'Smart customer service with support ticket memory',
      icon: Headphones,
      href: '/support',
      color: 'from-orange-400 to-red-600',
      emoji: '🎧'
    },
    {
      name: 'Education System',
      description: 'Personalized AI tutoring with adaptive learning profiles',
      icon: GraduationCap,
      href: '/education',
      color: 'from-purple-400 to-pink-600',
      emoji: '📚'
    },
    {
      name: 'Financial Advisory',
      description: 'Portfolio analysis and investment guidance with risk profiling',
      icon: DollarSign,
      href: '/financial',
      color: 'from-yellow-400 to-orange-600',
      emoji: '💰'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ASI-Agents Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Multi-Domain AI Agent Ecosystems
        </p>
        <p className="text-gray-500">
          Five Complete Agent Systems Powered by ASI and Memory Integration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Link
            key={agent.name}
            href={agent.href}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${agent.color} text-white`}>
                  <agent.icon size={32} />
                </div>
                <span className="text-4xl">{agent.emoji}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                {agent.name}
              </h2>
              
              <p className="text-gray-600 leading-relaxed">
                {agent.description}
              </p>
              
              <div className="mt-4 flex items-center text-blue-600 font-semibold">
                <span className="group-hover:translate-x-2 transition-transform">
                  Access Agent →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">About ASI-Agents</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ASI-Agents is a comprehensive collection of five independent multi-agent systems, each designed for a specific domain but sharing the same powerful architecture. Each ecosystem features specialized AI agents that leverage memory integration for personalized, context-aware interactions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Agent Ecosystems</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">15+</div>
            <div className="text-sm text-gray-600">Specialized Agents</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">∞</div>
            <div className="text-sm text-gray-600">Possibilities</div>
          </div>
        </div>
      </div>
    </div>
  )
}
