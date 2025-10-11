export default function UsagePie() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white font-bold">12.5GB</div>
      <div>
        <div className="text-sm text-muted">Total Used</div>
        <div className="mt-2 text-xs text-muted">Personal Data — 7.5 GB</div>
        <div className="text-xs text-muted">App Data — 3.2 GB</div>
        <div className="text-xs text-muted">Shared — 1.8 GB</div>
      </div>
    </div>
  );
}
