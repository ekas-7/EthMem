export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-muted">Welcome back, 0x4a...b3</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-2 bg-card-dark rounded-full">🔔</div>
        <div className="p-2 bg-emerald-400 text-black rounded-full">Connected</div>
      </div>
    </header>
  );
}
