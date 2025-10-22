import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Settings, ExternalLink, Plus, Check, X } from 'lucide-react';

export const metadata = {
  title: "Integrations - EthMem",
};

const integrations = [
  {
    name: "ChatGPT",
    description: "AI-powered conversational assistant",
    status: "connected",
    icon: "/chatgpt.png",
    lastSync: "2 minutes ago"
  },
  {
    name: "Claude AI",
    description: "Advanced AI assistant by Anthropic",
    status: "connected",
    icon: "/claude.jpeg",
    lastSync: "5 minutes ago"
  },
  {
    name: "Gemini",
    description: "Google's multimodal AI model",
    status: "available",
    icon: "/gemini.png",
    lastSync: null
  },
  {
    name: "LLaMA",
    description: "Meta's large language model",
    status: "available",
    icon: "/llama.png",
    lastSync: null
  }
];

const availableIntegrations = [
  {
    name: "Notion",
    description: "Connect your Notion workspace for seamless memory storage",
    icon: "📝",
    category: "Productivity"
  },
  {
    name: "Google Drive",
    description: "Backup memories to your Google Drive",
    icon: "📁",
    category: "Storage"
  },
  {
    name: "Slack",
    description: "Enhanced team communication with memory context",
    icon: "💬",
    category: "Communication"
  },
  {
    name: "Discord",
    description: "AI memory integration for Discord servers",
    icon: "🎮",
    category: "Communication"
  }
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 md:ml-0 p-6 lg:p-10">
        <DashboardHeader />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Integrations</h2>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Integration</span>
            </button>
          </div>

          {/* Connected Integrations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Connected LLMs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.filter(i => i.status === 'connected').map((integration) => (
                <div key={integration.name} className="bg-gray-800 rounded-xl p-6 border border-emerald-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={integration.icon} 
                        alt={integration.name}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{integration.name}</h4>
                        <p className="text-sm text-gray-400">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Last sync: {integration.lastSync}</span>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Integrations */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Available LLMs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.filter(i => i.status === 'available').map((integration) => (
                <div key={integration.name} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={integration.icon} 
                        alt={integration.name}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{integration.name}</h4>
                        <p className="text-sm text-gray-400">{integration.description}</p>
                      </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm">
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Available Integrations */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Other Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableIntegrations.map((integration) => (
                <div key={integration.name} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                        {integration.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{integration.name}</h4>
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                          {integration.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
                  
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors">
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
