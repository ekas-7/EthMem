export default function UsagePie() {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-dark-primary">Total Used</h4>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
            12.5GB
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent animate-pulse"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="text-sm text-sidebar-text">Personal Data</div>
            <div className="text-sm text-muted ml-auto">7.5 GB</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <div className="text-sm text-sidebar-text">App Data</div>
            <div className="text-sm text-muted ml-auto">3.2 GB</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
            <div className="text-sm text-sidebar-text">Shared</div>
            <div className="text-sm text-muted ml-auto">1.8 GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}

