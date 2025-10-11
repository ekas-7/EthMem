export default function Hero() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-16 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl text-center shadow-md">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-emerald-500 mb-3">1M+</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Secured Memories</p>
      </div>
      <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl text-center shadow-md">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-emerald-500 mb-3">10K+</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Active Identities</p>
      </div>
      <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl text-center shadow-md">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-emerald-500 mb-3">50+</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">dApps Integrated</p>
      </div>
    </section>
  );
}
