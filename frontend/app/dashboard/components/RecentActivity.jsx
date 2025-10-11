export default function RecentActivity() {
  const items = [
    {title: 'New memory created', sub: 'From InsightDAO - 2 min ago'},
    {title: 'Memory updated', sub: 'From Personal Assistant - 1 hour ago'},
    {title: 'New App Integration', sub: 'DeFi Trader Pro - 1 day ago'},
    {title: 'Memory Shared', sub: 'With ArtEvolve NFT - 2 days ago'},
  ];

  return (
    <ul className="space-y-3">
      {items.map((it, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">+</div>
          <div>
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-muted">{it.sub}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
