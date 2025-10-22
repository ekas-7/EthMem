import { Brain, Zap, Clock } from 'lucide-react'

export default function ConnectedLLMs() {
  const items = [
    {name: 'LLM-4 Turbo', status: 'Active', last: '5m ago'},
    {name: 'Personal Assistant', status: 'Active', last: '1h ago'},
  ];

  return (
    <div>
      <h4 className="font-semibold mb-4 text-dark-primary">Connected LLMs and Agents</h4>
      <ul className="space-y-3">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between bg-card-darker p-3 rounded-lg border border-white/5 hover:border-emerald-400/20 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
                <Brain className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold text-sidebar-text text-sm">{it.name}</div>
                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  Last interaction: {it.last}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${it.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className={`text-xs font-medium ${it.status === 'Active' ? 'text-emerald-400' : 'text-gray-400'}`}>{it.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

