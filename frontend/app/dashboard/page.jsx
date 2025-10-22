import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatCard from "./components/StatCard";
import MemoryGrowthChart from "./components/MemoryGrowthChart";
import RecentActivity from "./components/RecentActivity";
import UsagePie from "./components/UsagePie";
import ConnectedLLMs from "./components/ConnectedLLMs";
import ExtensionDataViewer from "./components/ExtensionDataViewer";
import SepoliaStatus from "./components/SepoliaStatus";

export const metadata = {
  title: "Dashboard - EthMem",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 md:ml-0 p-6 lg:p-10">
        <DashboardHeader />
        
        <SepoliaStatus />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Data Usage" value="12.5 GB" delta="+2.1% last 30d" />
            <StatCard title="Linked Applications" value="8" delta="2 new this month" />
            <StatCard title="Total Interactions" value="14,321" delta="+15% last 30d" />
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <UsagePie />
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <ConnectedLLMs />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Memory Growth</h3>
            <MemoryGrowthChart />
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <RecentActivity />
          </div>
        </div>

        <div className="mt-6">
          <ExtensionDataViewer />
        </div>
      </div>
    </div>
  );
}
