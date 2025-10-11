export default function MemoryGrowthChart() {
  // Small static bar chart placeholder using divs for modularity.
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const values = [6,4,7,8,12,9,10,8,7,9,11,12];

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-48">
        {values.map((v, i) => (
          <div key={i} className={`flex-1 bg-emerald-700 rounded ${i===4? 'bg-emerald-400': ''}`} style={{height: `${v*6}%`}} title={`${months[i]}: ${v}`} />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted">
        {months.map((m,i)=> <div key={i}>{m}</div>)}
      </div>
    </div>
  );
}
