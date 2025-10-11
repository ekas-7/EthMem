export default function HowItWorks() {
  return (
    <section className="text-center my-24">
      <div className="inline-block bg-blue-100 text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">
        HOW IT WORKS
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Memory, Your Identity,<br /> Your Control.</h2>
      <p className="text-lg text-text-light-secondary dark:text-dark-secondary max-w-2xl mx-auto mb-12">
        zKMem connects to your favorite LLMs and dApps, creating a unified, persistent memory layer that is cryptographically tied to your blockchain identity. All your data is stored decentrally, giving you full ownership and control.
      </p>
      <div className="relative">
        <img alt="zKMem dashboard" className="rounded-xl shadow-2xl mx-auto" src="/next.svg" />
      </div>
    </section>
  );
}
