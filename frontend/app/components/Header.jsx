"use client";
import { Rocket, User, ArrowRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-br from-[#0B2F1B] to-[#07120B] rounded-b-xl p-6 text-white relative overflow-hidden">
      {/* subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] pointer-events-none"></div>

      {/* gradient orbs (kept green-tinted to match theme) */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-800/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <nav className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-[#0B2F1B] rounded-full"></div>
                <div className="w-2 h-2 bg-[#0B2F1B] rounded-full"></div>
                <div className="w-2 h-2 bg-[#0B2F1B] rounded-full"></div>
                <div className="w-2 h-2 bg-[#0B2F1B] rounded-full"></div>
              </div>
            </div>
            <span className="text-white text-2xl font-semibold">zKMem</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a className="hover:text-white transition-colors" href="#">Features</a>
            <a className="hover:text-white transition-colors" href="#">Resources</a>
            <a className="hover:text-white transition-colors" href="#">Support</a>
            <a className="hover:text-white transition-colors" href="#">Pricing</a>
            <a className="hover:text-white transition-colors" href="#">Contact</a>
          </div>

          <div className="ml-auto">
            <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 px-5 rounded-full flex items-center gap-2">
              <span>Connect Wallet</span>
              <User size={16} />
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="px-6 pt-12 pb-16 text-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 shadow-inner">
              <span className="bg-emerald-400 text-black text-sm font-medium px-3 py-1.5 rounded-full">New</span>
              <span className="text-gray-300 pr-3">Try our new zk-backed memory</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Unified LLM Memory —<br /> <span className="text-emerald-400">Your Blockchain Identity.</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Merge your digital mind with your decentralized self. Experience a new layer of digital continuity — where your LLM memory becomes your blockchain identity.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <button className="bg-emerald-400 hover:bg-emerald-500 text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
              <span>Claim Your Decentralized Memory</span>
              <Rocket size={16} />
            </button>

            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all">
              <span>Learn More</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex justify-center items-center space-x-8 mt-8 text-gray-300">
            <p className="text-sm font-medium">Integration Partners:</p>
            <div className="flex items-center space-x-2">
              <img alt="Next logo" className="h-6 w-6" src="/next.svg" />
              <span>Ethereum</span>
            </div>
            <div className="flex items-center space-x-2">
              <img alt="Vercel logo" className="h-6 w-6" src="/vercel.svg" />
              <span>Polygon</span>
            </div>
            <div className="flex items-center space-x-2">
              <img alt="IPFS logo" className="h-6 w-6 invert-dark" src="/file.svg" />
              <span>IPFS</span>
            </div>
            <div className="flex items-center space-x-2">
              <img alt="OpenAI logo" className="h-6 w-6" src="/globe.svg" />
              <span>OpenAI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
