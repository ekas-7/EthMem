'use client'

import Sidebar from "../components/Sidebar";
import { Settings, ExternalLink, Plus, Check, X, Zap, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const integrations = [
  {
    name: "ChatGPT",
    description: "AI-powered conversational assistant",
    status: "connected",
    icon: "/chatgpt.png",
    lastSync: "2 minutes ago",
    interactions: "4.2k"
  },
  {
    name: "Claude AI",
    description: "Advanced AI assistant by Anthropic",
    status: "connected",
    icon: "/claude.jpeg",
    lastSync: "5 minutes ago",
    interactions: "3.1k"
  },
  {
    name: "Gemini",
    description: "Google's multimodal AI model",
    status: "available",
    icon: "/gemini.png",
    lastSync: null,
    interactions: "0"
  },
  {
    name: "LLaMA",
    description: "Meta's large language model",
    status: "available",
    icon: "/llama.png",
    lastSync: null,
    interactions: "0"
  }
];

const availableIntegrations = [
  {
    name: "Notion",
    description: "Connect your Notion workspace for seamless memory storage",
    icon: "📝",
    category: "Productivity",
    popular: true
  },
  {
    name: "Google Drive",
    description: "Backup memories to your Google Drive",
    icon: "📁",
    category: "Storage",
    popular: false
  },
  {
    name: "Slack",
    description: "Enhanced team communication with memory context",
    icon: "💬",
    category: "Communication",
    popular: true
  },
  {
    name: "Discord",
    description: "AI memory integration for Discord servers",
    icon: "🎮",
    category: "Communication",
    popular: false
  },
  {
    name: "Obsidian",
    description: "Sync your knowledge base with AI memory",
    icon: "🧠",
    category: "Productivity",
    popular: false
  },
  {
    name: "Zapier",
    description: "Automate workflows with memory data",
    icon: "⚡",
    category: "Automation",
    popular: true
  }
];

export default function IntegrationsPage() {
  const [filter, setFilter] = useState('all');

  const filteredIntegrations = filter === 'all' 
    ? availableIntegrations 
    : availableIntegrations.filter(i => i.category === filter);

  return (
    <div className="min-h-screen bg-background-dark text-white flex relative">
      <Sidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Integrations</h1>
            <p className="text-sm text-muted mt-1">Connect your favorite apps and AI models</p>
          </div>
          <button className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-black px-5 py-2.5 rounded-lg flex items-center space-x-2 font-semibold shadow-lg shadow-emerald-400/30 transition-all">
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card-dark rounded-xl p-5 shadow-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted">Connected Apps</div>
                <div className="text-2xl font-bold text-white mt-1">8</div>
              </div>
              <div className="p-3 bg-emerald-900/30 rounded-lg">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="bg-card-dark rounded-xl p-5 shadow-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted">Total Interactions</div>
                <div className="text-2xl font-bold text-white mt-1">7.3k</div>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-card-dark rounded-xl p-5 shadow-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted">Available</div>
                <div className="text-2xl font-bold text-white mt-1">24+</div>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Connected Integrations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-dark-primary mb-4">Connected LLMs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.filter(i => i.status === 'connected').map((integration) => (
              <div key={integration.name} className="bg-card-dark rounded-xl p-6 border border-emerald-500/20 shadow-lg hover:border-emerald-500/40 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-card-darker rounded-lg p-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img 
                        src={integration.icon} 
                        alt={integration.name}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{integration.name}</h4>
                      <p className="text-xs text-muted">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-900/30 rounded-full">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-400 font-semibold">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted">Last sync: </span>
                      <span className="text-sidebar-text">{integration.lastSync}</span>
                    </div>
                    <div className="px-2 py-1 bg-card-darker rounded">
                      <span className="text-muted">{integration.interactions} uses</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-muted hover:text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-all">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Integrations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-primary">Available LLMs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.filter(i => i.status === 'available').map((integration) => (
              <div key={integration.name} className="bg-card-dark rounded-xl p-6 border border-white/5 shadow-lg hover:border-emerald-400/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-card-darker rounded-lg p-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img 
                        src={integration.icon} 
                        alt={integration.name}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{integration.name}</h4>
                      <p className="text-xs text-muted">{integration.description}</p>
                    </div>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-emerald-500/30">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Available Integrations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-primary">Other Integrations</h3>
            <div className="flex gap-2">
              {['all', 'Productivity', 'Storage', 'Communication', 'Automation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === cat
                      ? 'bg-emerald-400 text-black'
                      : 'bg-card-darker text-sidebar-text hover:bg-card-dark border border-white/5'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <div key={integration.name} className="bg-card-dark rounded-xl p-6 border border-white/5 hover:border-gray-600 transition-all group shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-card-darker rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {integration.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{integration.name}</h4>
                        {integration.popular && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted mb-4">{integration.description}</p>
                
                <button className="w-full bg-card-darker hover:bg-gray-600 text-sidebar-text hover:text-white py-2 rounded-lg text-sm transition-all border border-white/5">
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
