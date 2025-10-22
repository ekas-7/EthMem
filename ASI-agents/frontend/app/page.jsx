'use client'

import Link from 'next/link'
import { Activity, Scale, Headphones, GraduationCap, DollarSign, Sparkles, Zap, Brain } from 'lucide-react'

export default function HomePage() {
  const agents = [
    {
      name: 'Medical Consultation',
      description: 'AI-powered healthcare consultations with personalized medical memory',
      icon: Activity,
      href: '/medical',
      color: 'from-emerald-400 via-teal-500 to-cyan-600',
      glowColor: 'emerald',
      emoji: '🏥'
    },
    {
      name: 'Legal Consultation',
      description: 'Intelligent legal advice with case history integration',
      icon: Scale,
      href: '/legal',
      color: 'from-blue-400 via-indigo-500 to-purple-600',
      glowColor: 'blue',
      emoji: '⚖️'
    },
    {
      name: 'Customer Support',
      description: 'Smart customer service with support ticket memory',
      icon: Headphones,
      href: '/support',
      color: 'from-orange-400 via-red-500 to-pink-600',
      glowColor: 'orange',
      emoji: '🎧'
    },
    {
      name: 'Education System',
      description: 'Personalized AI tutoring with adaptive learning profiles',
      icon: GraduationCap,
      href: '/education',
      color: 'from-purple-400 via-fuchsia-500 to-pink-600',
      glowColor: 'purple',
      emoji: '📚'
    },
    {
      name: 'Financial Advisory',
      description: 'Portfolio analysis and investment guidance with risk profiling',
      icon: DollarSign,
      href: '/financial',
      color: 'from-amber-400 via-yellow-500 to-orange-600',
      glowColor: 'yellow',
      emoji: '💰'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="inline-block mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ASI-Agents
            </h1>
          </div>
        </div>
        
        <p className="text-2xl text-gray-300 mb-3 font-light">
          Multi-Domain AI Agent Ecosystems
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Five Complete Agent Systems Powered by <span className="text-cyan-400 font-semibold">ASI</span> and{' '}
          <span className="text-purple-400 font-semibold">ETHMem</span> Integration
        </p>

        {/* Stats Bar */}
        <div className="flex justify-center gap-8 mt-8 flex-wrap">
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Sparkles className="text-cyan-400" size={20} />
            <span className="text-white font-semibold">5 Ecosystems</span>
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Brain className="text-purple-400" size={20} />
            <span className="text-white font-semibold">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Zap className="text-pink-400" size={20} />
            <span className="text-white font-semibold">Memory Integration</span>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {agents.map((agent, index) => (
          <Link
            key={agent.name}
            href={agent.href}
            className="group relative overflow-hidden rounded-2xl glass-strong p-6 hover:scale-105 transition-all duration-300 border border-white/10 hover:border-white/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated gradient border on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`relative p-3 rounded-xl bg-gradient-to-br ${agent.color}`}>
                  <agent.icon size={32} className="text-white relative z-10" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} blur-lg opacity-50`}></div>
                </div>
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {agent.emoji}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                {agent.name}
              </h2>
              
              <p className="text-gray-400 leading-relaxed mb-4">
                {agent.description}
              </p>
              
              <div className={`flex items-center text-transparent bg-gradient-to-r ${agent.color} bg-clip-text font-semibold`}>
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  Access Agent →
                </span>
              </div>
            </div>

            {/* Corner accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${agent.color} opacity-10 blur-3xl`}></div>
          </Link>
        ))}
      </div>

      {/* About Section */}
      <div className="glass-strong rounded-2xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            About ASI-Agents
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6 text-lg">
            ASI-Agents is a comprehensive collection of five independent multi-agent systems, each designed for a specific domain but sharing the same powerful architecture. Each ecosystem features specialized AI agents that leverage memory integration for personalized, context-aware interactions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-6 glass rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                5
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Agent Ecosystems</div>
            </div>
            <div className="text-center p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                15+
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Specialized Agents</div>
            </div>
            <div className="text-center p-6 glass rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <div className="text-5xl font-black bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
                ∞
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
