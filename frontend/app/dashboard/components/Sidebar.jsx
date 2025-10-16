export default function Sidebar() {
  return (
    <aside className="w-72 bg-sidebar-dark min-h-screen p-6 hidden md:block">
  <div className="text-2xl font-bold text-emerald-300 mb-8">EthMem</div>
      <nav className="space-y-3 text-sm text-sidebar-text">
        <a className="block px-3 py-2 rounded-md bg-emerald-700/10" href="/dashboard">Dashboard</a>
        <a className="block px-3 py-2 rounded-md hover:bg-white/5" href="#">Insights</a>
        <a className="block px-3 py-2 rounded-md hover:bg-white/5" href="#">Integrations</a>
        <a className="block px-3 py-2 rounded-md hover:bg-white/5" href="#">Settings</a>
      </nav>

      <div className="mt-auto pt-6 text-sm text-sidebar-muted">
        <button className="w-full bg-emerald-400 text-black py-2 rounded-full">Connected</button>
        <div className="mt-4">Support</div>
        <div className="mt-2">Logout</div>
      </div>
    </aside>
  );
}
