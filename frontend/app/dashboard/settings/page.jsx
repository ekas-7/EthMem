import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Save, Key, Shield, Bell, Trash2, Download, Upload } from 'lucide-react';

export const metadata = {
  title: "Settings - EthMem",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 md:ml-0 p-6 lg:p-10">
        <DashboardHeader />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-4">
                <nav className="space-y-2">
                  <a href="#general" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-emerald-700/20 text-emerald-300">
                    <Shield className="w-4 h-4" />
                    <span>General</span>
                  </a>
                  <a href="#api" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">
                    <Key className="w-4 h-4" />
                    <span>API Keys</span>
                  </a>
                  <a href="#notifications" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </a>
                  <a href="#data" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5">
                    <Download className="w-4 h-4" />
                    <span>Data Management</span>
                  </a>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* General Settings */}
              <div id="general" className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Memory Retention Period
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Auto-sync Frequency
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Real-time</option>
                      <option>Every 5 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Manual only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Privacy Mode</label>
                      <p className="text-xs text-gray-500">Enhanced privacy for sensitive conversations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Smart Categorization</label>
                      <p className="text-xs text-gray-500">Automatically categorize memories by topic</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* API Keys */}
              <div id="api" className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pinata API Key
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="password" 
                        placeholder="Enter your Pinata API key"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
                        Update
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pinata Secret Key
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="password" 
                        placeholder="Enter your Pinata secret key"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                      💡 <strong>Tip:</strong> You can get your Pinata API keys from{' '}
                      <a href="https://app.pinata.cloud/developers/api-keys" target="_blank" rel="noopener noreferrer" className="underline">
                        Pinata Dashboard
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div id="notifications" className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Email Notifications</label>
                      <p className="text-xs text-gray-500">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Memory Backup Alerts</label>
                      <p className="text-xs text-gray-500">Get notified when memories are backed up</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Weekly Reports</label>
                      <p className="text-xs text-gray-500">Receive weekly memory analytics</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div id="data" className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Export Data</h4>
                      <p className="text-xs text-gray-500">Download all your memories as JSON</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Import Data</h4>
                      <p className="text-xs text-gray-500">Upload memories from backup file</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Import</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-red-400">Delete All Data</h4>
                        <p className="text-xs text-red-300/70">Permanently delete all memories (irreversible)</p>
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
