export default function Pricing() {
  return (
    <section className="bg-gradient-to-br from-[#0B1221] to-[#01050E] rounded-xl p-8 md:p-16 my-24 text-white">
      <div className="text-center mb-12">
        <div className="inline-block bg-gray-800 text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">
          PRICING
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">A Plan for Every<br />Decentralized Citizen.</h2>
        <div className="inline-flex items-center bg-gray-800 rounded-full p-1 mt-4">
          <button className="bg-gray-700 py-1 px-4 rounded-full text-sm font-semibold">Pay-as-you-go</button>
          <button className="py-1 px-4 rounded-full text-sm text-gray-400">Stake for Access</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-dark p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold">Pioneer</h3>
          <p className="text-gray-400 text-sm mb-4">For individuals getting started</p>
          <p className="text-4xl font-bold mb-4">Free</p>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-md mb-6">Claim Identity</button>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center"><span className="material-icons text-green-500 mr-2">check_circle</span>Basic memory storage</li>
            <li className="flex items-center"><span className="material-icons text-green-500 mr-2">check_circle</span>Up to 3 dApp integrations</li>
            <li className="flex items-center"><span className="material-icons text-green-500 mr-2">check_circle</span>Community support</li>
          </ul>
        </div>
        <div className="bg-primary p-6 rounded-lg border-2 border-blue-400 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
          <h3 className="text-lg font-semibold">Voyager</h3>
          <p className="text-blue-200 text-sm mb-4">For power users and developers</p>
          <p className="text-4xl font-bold mb-4">$10<span className="text-base font-normal text-blue-200">/mo in ETH</span></p>
          <button className="w-full bg-white hover:bg-gray-200 text-primary font-semibold py-2 rounded-md mb-6">Choose Plan</button>
          <ul className="space-y-3 text-sm text-blue-100">
            <li className="flex items-center"><span className="material-icons mr-2">check_circle</span>Everything in Pioneer</li>
            <li className="flex items-center"><span className="material-icons mr-2">check_circle</span>Expanded memory storage</li>
            <li className="flex items-center"><span className="material-icons mr-2">check_circle</span>Unlimited dApp integrations</li>
            <li className="flex items-center"><span className="material-icons mr-2">check_circle</span>Priority support</li>
          </ul>
        </div>
        <div className="bg-surface-dark p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold">Architect</h3>
          <p className="text-gray-400 text-sm mb-4">For enterprises and dApps</p>
          <p className="text-4xl font-bold mb-4">Custom</p>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-md mb-6">Contact Sales</button>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center"><span className="material-icons text-green-500 mr-2">check_circle</span>Everything in Voyager</li>
            <li className="flex items-center"><span className="material-icons text-green-500 mr-2">check_circle</span>Scalable infrastructure</li>
            <li className="flex items-center"><span className="material-icons text-green-500 mr-2">check_circle</span>Dedicated support &amp; SLA</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
