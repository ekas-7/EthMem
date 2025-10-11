export default function StatCard({ title, value, delta }) {
  return (
    <div className="bg-card-dark rounded-xl p-4 flex flex-col justify-between">
      <div className="text-sm text-muted">{title}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-emerald-400">{delta}</div>
      </div>
    </div>
  );
}
