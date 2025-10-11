export default function Testimonials() {
  return (
    <section className="my-24">
      <div className="text-center mb-12">
        <div className="inline-block bg-blue-100 text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4 dark:bg-surface-dark dark:text-primary">
          TESTIMONIALS
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">What our users<br />are building.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg">
          <p className="text-text-light-secondary dark:text-dark-secondary mb-4">"zKMem gives my AI agent a persistent, verifiable memory. It's the missing piece for creating truly autonomous agents on the blockchain. My users now have full ownership of their data."</p>
          <div className="flex items-center">
            <img alt="Avatar" className="w-10 h-10 rounded-full mr-4" src="/globe.svg" />
            <div>
              <p className="font-semibold text-text-light-primary dark:text-dark-primary">Alex (0x4a...b3)</p>
              <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Builder, InsightDAO</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg">
          <p className="text-text-light-secondary dark:text-dark-secondary mb-4">"As an artist, I'm using zKMem to create dynamic NFTs that evolve based on interactions with their owners. It brings a new level of life and provenance to digital art."</p>
          <div className="flex items-center">
            <img alt="Avatar" className="w-10 h-10 rounded-full mr-4" src="/file.svg" />
            <div>
              <p className="font-semibold text-text-light-primary dark:text-dark-primary">Clara</p>
              <p className="text-sm text-text-light-secondary dark:text-dark-secondary">NFT Artist</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg">
          <p className="text-text-light-secondary dark:text-dark-secondary mb-4">"Finally, my personal AI assistant remembers my preferences across different dApps without me having to re-configure everything. This is the future of user experience in web3."</p>
          <div className="flex items-center">
            <img alt="Avatar" className="w-10 h-10 rounded-full mr-4" src="/next.svg" />
            <div>
              <p className="font-semibold text-text-light-primary dark:text-dark-primary">DAO Jones</p>
              <p className="text-sm text-text-light-secondary dark:text-dark-secondary">DeFi User</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
