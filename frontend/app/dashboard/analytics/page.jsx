'use client'

import Sidebar from "../components/Sidebar";
import { BarChart3, TrendingUp, Activity, Clock, Database, Zap, PieChart, Users, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const connectedApps = [
  { 
    name: 'ChatGPT', 
    interactions: 4250, 
    icon: '/chatgpt2.png',
    url: 'https://chatgpt.com'
  },
  { 
    name: 'Claude', 
    interactions: 3180, 
    icon: '/claude.jpeg',
    url: 'https://claude.ai'
  },
  { 
    name: 'Gemini', 
    interactions: 2890, 
    icon: '/gemini.png',
    url: 'https://gemini.google.com'
  },
  { 
    name: 'LLaMA', 
    interactions: 2001, 
    icon: '/llama.png',
    url: 'https://llama.meta.com'
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const handleVisitApp = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background-dark text-white flex relative">
      <Sidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Analytics</h1>
            <p className="text-sm text-muted mt-1">Deep insights into your memory usage and performance</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-emerald-400 text-black'
                    : 'bg-card-darker text-sidebar-text hover:bg-card-dark border border-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-emerald-400 font-semibold">+12.5%</span>
            </div>
            <div className="text-2xl font-bold text-white">14,321</div>
            <div className="text-sm text-muted mt-1">Total Interactions</div>
          </div>

          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-blue-400 font-semibold">-23ms</span>
            </div>
            <div className="text-2xl font-bold text-white">156ms</div>
            <div className="text-sm text-muted mt-1">Avg Response Time</div>
          </div>

          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-purple-400 font-semibold">94.2%</span>
            </div>
            <div className="text-2xl font-bold text-white">12.5 GB</div>
            <div className="text-sm text-muted mt-1">Memory Efficiency</div>
          </div>

          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-pink-400" />
              </div>
              <span className="text-xs text-pink-400 font-semibold">99.8%</span>
            </div>
            <div className="text-2xl font-bold text-white">7.3:1</div>
            <div className="text-sm text-muted mt-1">Compression Ratio</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Memory Usage Trends */}
          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark-primary flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Memory Usage Trends
              </h3>
            </div>
            <div className="h-64 flex items-end gap-2">
              {[45, 52, 48, 65, 59, 72, 68, 75, 82, 78, 85, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t hover:from-emerald-500 hover:to-emerald-300 transition-all duration-200"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted">
              <span>Jan</span>
              <span>Apr</span>
              <span>Jul</span>
              <span>Oct</span>
              <span>Dec</span>
            </div>
          </div>

          {/* User Interactions */}
          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark-primary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                User Interactions
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'ChatGPT', value: 4250, color: 'bg-emerald-400', percent: 85 },
                { label: 'Claude', value: 3180, color: 'bg-blue-400', percent: 65 },
                { label: 'Gemini', value: 2890, color: 'bg-purple-400', percent: 58 },
                { label: 'LLaMA', value: 2001, color: 'bg-pink-400', percent: 42 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sidebar-text font-medium">{item.label}</span>
                    <span className="text-muted">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-card-darker rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <h3 className="text-lg font-semibold mb-6 text-dark-primary flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Average Response Time', value: '156ms', trend: '+5%', isPositive: false },
                { label: 'Memory Efficiency', value: '94.2%', trend: '+2.1%', isPositive: true },
                { label: 'Data Compression Ratio', value: '7.3:1', trend: '+0.8', isPositive: true },
                { label: 'Uptime', value: '99.8%', trend: '+0.1%', isPositive: true },
              ].map((metric, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-card-darker rounded-lg border border-white/5">
                  <div>
                    <div className="text-sm text-sidebar-text">{metric.label}</div>
                    <div className="text-lg font-bold text-white mt-1">{metric.value}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    metric.isPositive ? 'text-emerald-400 bg-emerald-900/30' : 'text-red-400 bg-red-900/30'
                  }`}>
                    {metric.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Usage Breakdown */}
          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <h3 className="text-lg font-semibold mb-6 text-dark-primary flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Data Usage Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Conversations', percent: 65, color: 'emerald' },
                { label: 'Documents', percent: 25, color: 'blue' },
                { label: 'Media', percent: 10, color: 'purple' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sidebar-text">{item.label}</span>
                    <span className="text-sm font-semibold text-white">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-card-darker rounded-full h-2.5">
                    <div
                      className={`bg-${item.color}-400 h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Connected Apps */}
          <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
            <h3 className="text-lg font-semibold mb-6 text-dark-primary flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Connected Apps
            </h3>
            <div className="space-y-3">
              {connectedApps.map((app, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 bg-card-darker rounded-lg border border-white/5 hover:border-emerald-400/20 transition-all group cursor-pointer"
                  onClick={() => handleVisitApp(app.url)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                      <img 
                        src={app.icon} 
                        alt={app.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-sidebar-text">{app.name}</div>
                      <div className="text-xs text-muted">{app.interactions.toLocaleString()} interactions</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted group-hover:text-emerald-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
