export default function ConnectedLLMs() {
  const items = [
    {name: 'LLM-4 Turbo', status: 'Active', last: '5m ago'},
    {name: 'Personal Assistant', status: 'Active', last: '1h ago'},
  ];

  return (
    <div>
      <h4 className="font-semibold mb-3">Connected LLMs and Agents</h4>
      <ul className="space-y-3">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between bg-card-darker p-3 rounded-lg">
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-muted">Last interaction: {it.last}</div>
            </div>
            <div className={`text-sm ${it.status === 'Active' ? 'text-emerald-400' : 'text-gray-400'}`}>{it.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
