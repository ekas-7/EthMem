import { Plus, RefreshCw, Share2, Sparkles } from 'lucide-react'

export default function RecentActivity() {
  const items = [
    {title: 'New memory created', sub: 'From InsightDAO - 2 min ago', icon: Plus, color: 'bg-emerald-600'},
    {title: 'Memory updated', sub: 'From Personal Assistant - 1 hour ago', icon: RefreshCw, color: 'bg-blue-600'},
    {title: 'New App Integration', sub: 'DeFi Trader Pro - 1 day ago', icon: Sparkles, color: 'bg-purple-600'},
    {title: 'Memory Shared', sub: 'With ArtEvolve NFT - 2 days ago', icon: Share2, color: 'bg-pink-600'},
  ];

  return (
    <ul className="space-y-4">
      {items.map((it, idx) => {
        const Icon = it.icon
        return (
          <li key={idx} className="flex items-start gap-3 group">
            <div className={`w-9 h-9 rounded-full ${it.color} flex items-center justify-center text-white shadow-lg ${it.color.replace('bg-', 'shadow-')}/30 group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sidebar-text text-sm group-hover:text-emerald-300 transition-colors">{it.title}</div>
              <div className="text-xs text-muted mt-0.5">{it.sub}</div>
            </div>
          </li>
        )
      })}
    </ul>
  );
}

