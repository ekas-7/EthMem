export default function Pricing() {
  return (
    <section className="bg-gradient-to-br from-[#07120B] to-[#052116] rounded-xl p-4 sm:p-8 md:p-16 my-12 sm:my-16 lg:my-24 text-white relative overflow-hidden">
      {/* subtle grid overlay like header */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] pointer-events-none"></div>
      {/* subtle backdrop orbs to keep visual continuity with header */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/8 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-[#06200f] text-emerald-300 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            A Plan for Every<br />Decentralized Citizen.
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">Choose how you commit to your decentralized identity — flexible, developer-friendly, and built for web3-first users.</p>

          <div className="inline-flex items-center bg-[#062017] rounded-full p-1 mt-6 shadow-sm">
            <button className="bg-emerald-400 text-black py-1 px-3 sm:px-4 rounded-full text-sm font-semibold">Pay-as-you-go</button>
            <button className="py-1 px-3 sm:px-4 rounded-full text-sm text-gray-300">Stake for Access</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {/* Pioneer */}
          <div className="bg-[#071816] p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-emerald-900 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Pioneer</h3>
              <p className="text-gray-400 text-sm mt-1">For individuals getting started</p>
            </div>

            <div className="mt-auto">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Free</p>
              <button className="w-full bg-transparent border border-emerald-600 hover:bg-emerald-600/10 text-emerald-300 font-semibold py-3 rounded-full mb-8 text-sm sm:text-base">Claim Identity</button>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-300">
                <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3 text-lg">check_circle</span><span>Basic memory storage</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3 text-lg">check_circle</span><span>Up to 3 dApp integrations</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3 text-lg">check_circle</span><span>Community support</span></li>
              </ul>
            </div>
          </div>

          {/* Voyager - highlighted */}
          <div className="bg-emerald-400 p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border-2 border-emerald-300 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-black">Voyager</h3>
              <p className="text-black text-sm mt-1">For power users and developers</p>
            </div>

            <div className="mt-auto">
              <p className="text-3xl sm:text-4xl font-bold mb-6 text-black">$10<span className="text-base font-normal text-black">/mo in ETH</span></p>
              <button className="w-full bg-white hover:bg-gray-100 text-emerald-700 font-semibold py-3 rounded-full mb-8 text-sm sm:text-base">Choose Plan</button>
              <ul className="space-y-3 sm:space-y-4 text-sm text-black">
                <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3 text-lg">check_circle</span><span>Everything in Pioneer</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3 text-lg">check_circle</span><span>Expanded memory storage</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3 text-lg">check_circle</span><span>Unlimited dApp integrations</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3 text-lg">check_circle</span><span>Priority support</span></li>
              </ul>
            </div>
          </div>

          {/* Architect */}
          <div className="bg-[#071816] p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-emerald-900 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Architect</h3>
              <p className="text-gray-400 text-sm mt-1">For enterprises and dApps</p>
            </div>

            <div className="mt-auto">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Custom</p>
              <button className="w-full bg-transparent border border-emerald-600 hover:bg-emerald-600/10 text-emerald-300 font-semibold py-3 rounded-full mb-8 text-sm sm:text-base">Contact Sales</button>
              <ul className="space-y-3 sm:space-y-4 text-sm text-gray-300">
                <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3 text-lg">check_circle</span><span>Everything in Voyager</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3 text-lg">check_circle</span><span>Scalable infrastructure</span></li>
                <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3 text-lg">check_circle</span><span>Dedicated support &amp; SLA</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
