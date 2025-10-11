export default function Pricing() {
  return (
    <section className="bg-gradient-to-br from-[#0B1221] to-[#01050E] rounded-xl p-8 md:p-16 my-24 text-white">
      <div className="text-center mb-12">
        <div className="inline-block bg-gray-900 text-emerald-300 text-sm font-semibold px-4 py-1 rounded-full mb-4">
          PRICING
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">A Plan for Every<br />Decentralized Citizen.</h2>
        <div className="inline-flex items-center bg-gray-900 rounded-full p-1 mt-4">
          <button className="bg-emerald-400 text-black py-1 px-4 rounded-full text-sm font-semibold">Pay-as-you-go</button>
          <button className="py-1 px-4 rounded-full text-sm text-gray-400">Stake for Access</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#0E1620] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold">Pioneer</h3>
          <p className="text-gray-400 text-sm mb-4">For individuals getting started</p>
          <p className="text-4xl font-bold mb-6">Free</p>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-full mb-8">Claim Identity</button>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3">check_circle</span><span>Basic memory storage</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3">check_circle</span><span>Up to 3 dApp integrations</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3">check_circle</span><span>Community support</span></li>
          </ul>
        </div>
        <div className="bg-emerald-400 p-8 rounded-2xl border-2 border-emerald-300 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
          <h3 className="text-lg font-semibold text-black">Voyager</h3>
          <p className="text-black text-sm mb-4">For power users and developers</p>
          <p className="text-4xl font-bold mb-6 text-black">$10<span className="text-base font-normal text-black">/mo in ETH</span></p>
          <button className="w-full bg-white hover:bg-gray-100 text-emerald-600 font-semibold py-3 rounded-full mb-8">Choose Plan</button>
          <ul className="space-y-4 text-sm text-black">
            <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3">check_circle</span><span>Everything in Pioneer</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3">check_circle</span><span>Expanded memory storage</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3">check_circle</span><span>Unlimited dApp integrations</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-600 mr-3">check_circle</span><span>Priority support</span></li>
          </ul>
        </div>
        <div className="bg-[#0E1620] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-semibold">Architect</h3>
          <p className="text-gray-400 text-sm mb-4">For enterprises and dApps</p>
          <p className="text-4xl font-bold mb-6">Custom</p>
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-full mb-8">Contact Sales</button>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3">check_circle</span><span>Everything in Voyager</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3">check_circle</span><span>Scalable infrastructure</span></li>
            <li className="flex items-start"><span className="material-icons text-emerald-400 mr-3">check_circle</span><span>Dedicated support &amp; SLA</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
