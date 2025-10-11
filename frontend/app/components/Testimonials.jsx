export default function Testimonials() {
  return (
    <section className="my-24 px-4">
      <div className="text-center mb-12">
        <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          TESTIMONIALS
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">What our users<br />are building.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
  <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-500 text-sm mb-6">"zKMem gives my AI agent a persistent, verifiable memory. It's the missing piece for creating truly autonomous agents on the blockchain. My users now have full ownership of their data."</p>
          <div className="flex items-center">
            <img alt="Avatar" className="w-12 h-12 rounded-full mr-4 ring-2 ring-white shadow" src="/globe.svg" />
            <div>
              <p className="font-semibold text-gray-800">Alex (0x4a...b3)</p>
              <p className="text-sm text-gray-500">Builder, InsightDAO</p>
            </div>
          </div>
        </div>

  <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-500 text-sm mb-6">"As an artist, I'm using zKMem to create dynamic NFTs that evolve based on interactions with their owners. It brings a new level of life and provenance to digital art."</p>
          <div className="flex items-center">
            <img alt="Avatar" className="w-12 h-12 rounded-full mr-4 ring-2 ring-white shadow" src="/file.svg" />
            <div>
              <p className="font-semibold text-gray-800">Clara</p>
              <p className="text-sm text-gray-500">NFT Artist</p>
            </div>
          </div>
        </div>

  <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-500 text-sm mb-6">"Finally, my personal AI assistant remembers my preferences across different dApps without me having to re-configure everything. This is the future of user experience in web3."</p>
          <div className="flex items-center">
            <img alt="Avatar" className="w-12 h-12 rounded-full mr-4 ring-2 ring-white shadow" src="/next.svg" />
            <div>
              <p className="font-semibold text-gray-800">DAO Jones</p>
              <p className="text-sm text-gray-500">DeFi User</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
