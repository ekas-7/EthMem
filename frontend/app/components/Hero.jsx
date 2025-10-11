export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-lg text-center">
        <h2 className="text-5xl font-bold text-primary mb-2">1M+</h2>
        <p className="text-text-light-secondary dark:text-dark-secondary">Secured Memories</p>
      </div>
      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-lg text-center">
        <h2 className="text-5xl font-bold text-primary mb-2">10K+</h2>
        <p className="text-text-light-secondary dark:text-dark-secondary">Active Identities</p>
      </div>
      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-lg text-center">
        <h2 className="text-5xl font-bold text-primary mb-2">50+</h2>
        <p className="text-text-light-secondary dark:text-dark-secondary">dApps Integrated</p>
      </div>
    </section>
  );
}
