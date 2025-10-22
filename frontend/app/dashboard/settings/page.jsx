'use client'

import Sidebar from "../components/Sidebar";
import { Save, Key, Shield, Bell, Trash2, Download, Upload, User, Lock, Wallet, Database } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-background-dark text-white flex relative">
      <Sidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Settings</h1>
            <p className="text-sm text-muted mt-1">Manage your account and preferences</p>
          </div>
          <button className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-black px-5 py-2.5 rounded-lg flex items-center space-x-2 font-semibold shadow-lg shadow-emerald-400/30 transition-all">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card-dark rounded-xl p-4 shadow-lg border border-white/5 sticky top-6">
              <nav className="space-y-2">
                {[
                  { id: 'general', icon: Shield, label: 'General' },
                  { id: 'account', icon: User, label: 'Account' },
                  { id: 'api', icon: Key, label: 'API Keys' },
                  { id: 'notifications', icon: Bell, label: 'Notifications' },
                  { id: 'security', icon: Lock, label: 'Security' },
                  { id: 'data', icon: Database, label: 'Data' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-emerald-700/30 text-emerald-300 shadow-lg shadow-emerald-700/20 border-l-4 border-emerald-400'
                          : 'text-sidebar-text hover:bg-white/5 hover:text-emerald-300 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
                <h3 className="text-lg font-semibold text-dark-primary mb-6">General Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Memory Retention Period
                    </label>
                    <select className="w-full bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors">
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Auto-sync Frequency
                    </label>
                    <select className="w-full bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors">
                      <option>Real-time</option>
                      <option>Every 5 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Manual only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-white/5">
                    <div>
                      <label className="text-sm font-medium text-sidebar-text">Privacy Mode</label>
                      <p className="text-xs text-muted mt-1">Enhanced privacy for sensitive conversations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-white/5">
                    <div>
                      <label className="text-sm font-medium text-sidebar-text">Smart Categorization</label>
                      <p className="text-xs text-muted mt-1">Automatically categorize memories by topic</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-white/5">
                    <div>
                      <label className="text-sm font-medium text-sidebar-text">Auto-backup to IPFS</label>
                      <p className="text-xs text-muted mt-1">Automatically backup memories to IPFS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
                <h3 className="text-lg font-semibold text-dark-primary mb-6">Account Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Display Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your display name"
                      defaultValue="0x4a...b3"
                      className="w-full bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="your.email@example.com"
                      className="w-full bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Wallet className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-emerald-400">Connected Wallet</h4>
                        <p className="text-xs text-emerald-300/70 mt-1">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3</p>
                        <button className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 underline">
                          Disconnect Wallet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
              <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
                <h3 className="text-lg font-semibold text-dark-primary mb-6">API Keys</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Pinata API Key
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="password" 
                        placeholder="Enter your Pinata API key"
                        className="flex-1 bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                      />
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-emerald-500/30">
                        Update
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Pinata Secret Key
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="password" 
                        placeholder="Enter your Pinata secret key"
                        className="flex-1 bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-400 focus:outline-none transition-colors"
                      />
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-emerald-500/30">
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      💡 <strong>Tip:</strong> You can get your Pinata API keys from{' '}
                      <a href="https://app.pinata.cloud/developers/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">
                        Pinata Dashboard
                      </a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sidebar-text mb-2">
                      Contract Address (Sepolia)
                    </label>
                    <input 
                      type="text" 
                      readOnly
                      value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3"
                      className="w-full bg-card-darker border border-white/10 rounded-lg px-4 py-3 text-muted"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
                <h3 className="text-lg font-semibold text-dark-primary mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Receive updates via email', checked: true },
                    { label: 'Memory Backup Alerts', desc: 'Get notified when memories are backed up', checked: false },
                    { label: 'Weekly Reports', desc: 'Receive weekly memory analytics', checked: true },
                    { label: 'Integration Updates', desc: 'Notifications about new integrations', checked: true },
                    { label: 'Security Alerts', desc: 'Important security notifications', checked: true },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-white/5">
                      <div>
                        <label className="text-sm font-medium text-sidebar-text">{notif.label}</label>
                        <p className="text-xs text-muted mt-1">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={notif.checked} />
                        <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
                <h3 className="text-lg font-semibold text-dark-primary mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-card-darker rounded-lg border border-white/5">
                    <div>
                      <label className="text-sm font-medium text-sidebar-text">Two-Factor Authentication</label>
                      <p className="text-xs text-muted mt-1">Add an extra layer of security</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                      Enable
                    </button>
                  </div>

                  <div className="p-4 bg-card-darker rounded-lg border border-white/5">
                    <h4 className="text-sm font-medium text-sidebar-text mb-3">Active Sessions</h4>
                    <div className="space-y-3">
                      {[
                        { device: 'MacBook Pro', location: 'San Francisco, CA', time: 'Active now' },
                        { device: 'iPhone 14', location: 'San Francisco, CA', time: '2 hours ago' },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-card-dark rounded-lg">
                          <div>
                            <div className="text-sm text-sidebar-text font-medium">{session.device}</div>
                            <div className="text-xs text-muted">{session.location} • {session.time}</div>
                          </div>
                          <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <div className="bg-card-dark rounded-xl p-6 shadow-lg border border-white/5">
                <h3 className="text-lg font-semibold text-dark-primary mb-6">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-card-darker rounded-lg border border-white/5 hover:border-emerald-400/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-900/30 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
                        <Download className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-sidebar-text">Export Data</h4>
                        <p className="text-xs text-muted mt-1">Download all your memories as JSON</p>
                      </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-all shadow-lg hover:shadow-emerald-500/30">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-card-darker rounded-lg border border-white/5 hover:border-blue-400/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-900/30 rounded-lg group-hover:bg-blue-900/50 transition-colors">
                        <Upload className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-sidebar-text">Import Data</h4>
                        <p className="text-xs text-muted mt-1">Upload memories from backup file</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-all shadow-lg hover:shadow-blue-500/30">
                      <Upload className="w-4 h-4" />
                      <span>Import</span>
                    </button>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-6">
                    <div className="p-5 bg-red-900/20 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-red-900/30 rounded-lg">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-400">Danger Zone</h4>
                          <p className="text-xs text-red-300/70 mt-1">Permanently delete all memories (irreversible)</p>
                        </div>
                      </div>
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all shadow-lg hover:shadow-red-500/30">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete All Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
