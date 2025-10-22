import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export const metadata = {
  title: "Analytics - EthMem",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 md:ml-0 p-6 lg:p-10">
        <DashboardHeader />

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Memory Usage Analytics */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Memory Usage Trends</h3>
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Memory usage chart coming soon...</p>
              </div>
            </div>

            {/* User Interaction Analytics */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">User Interactions</h3>
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Interaction analytics coming soon...</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Response Time</span>
                  <span className="text-emerald-400">156ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Memory Efficiency</span>
                  <span className="text-emerald-400">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Data Compression Ratio</span>
                  <span className="text-emerald-400">7.3:1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Uptime</span>
                  <span className="text-emerald-400">99.8%</span>
                </div>
              </div>
            </div>

            {/* Data Usage Breakdown */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Data Usage Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Conversations</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-400 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-sm text-gray-400">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Documents</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm text-gray-400">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Media</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{width: '10%'}}></div>
                    </div>
                    <span className="text-sm text-gray-400">10%</span>
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
