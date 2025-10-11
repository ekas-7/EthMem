"use client";
import { Rocket, User, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-br from-[#0B2F1B] to-[#07120B] rounded-b-xl sm:rounded-b-2xl md:rounded-b-[3rem] p-4 sm:p-6 text-white relative overflow-hidden">
      {/* subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px] pointer-events-none"></div>

      {/* gradient orbs (kept green-tinted to match theme) */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-800/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <nav className="px-2 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0B2F1B] rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0B2F1B] rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0B2F1B] rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0B2F1B] rounded-full"></div>
              </div>
            </div>
            <span className="text-white text-xl sm:text-2xl font-semibold">zKMem</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a className="hover:text-white transition-colors" href="#">Features</a>
            <a className="hover:text-white transition-colors" href="#">Resources</a>
            <a className="hover:text-white transition-colors" href="#">Support</a>
            <a className="hover:text-white transition-colors" href="#">Pricing</a>
            <a className="hover:text-white transition-colors" href="#">Contact</a>
          </div>

          {/* Desktop Connect Button */}
          <div className="hidden md:block">
            <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 px-5 rounded-full flex items-center gap-2">
              <span>Connect Wallet</span>
              <User size={16} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-sm rounded-lg mx-2 sm:mx-6 mb-4 p-4">
            <div className="flex flex-col space-y-4 text-sm font-medium text-gray-300">
              <a className="hover:text-white transition-colors py-2" href="#">Features</a>
              <a className="hover:text-white transition-colors py-2" href="#">Resources</a>
              <a className="hover:text-white transition-colors py-2" href="#">Support</a>
              <a className="hover:text-white transition-colors py-2" href="#">Pricing</a>
              <a className="hover:text-white transition-colors py-2" href="#">Contact</a>
              <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 mt-4">
                <span>Connect Wallet</span>
                <User size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Hero */}
        <div className="px-2 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16 text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-2 shadow-inner">
              <span className="bg-emerald-400 text-black text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">New</span>
              <span className="text-gray-300 pr-2 sm:pr-3 text-xs sm:text-sm">Try our new zk-backed memory</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Unified LLM Memory —<br /> <span className="text-emerald-400">Your Blockchain Identity.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Merge your digital mind with your decentralized self. Experience a new layer of digital continuity — where your LLM memory becomes your blockchain identity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
            <button className="bg-emerald-400 hover:bg-emerald-500 text-black px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
              <span className="text-sm sm:text-base">Claim Your Decentralized Memory</span>
              <Rocket size={16} />
            </button>

            <button className="bg-white/5 hover:bg-white/10 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
              <span className="text-sm sm:text-base">Learn More</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-6 sm:mt-8 text-gray-300 px-4">
            <p className="text-xs sm:text-sm font-medium">Integration Partners:</p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              <div className="flex items-center space-x-2">
                <img alt="Next logo" className="h-4 w-4 sm:h-6 sm:w-6" src="/next.svg" />
                <span className="text-xs sm:text-sm">Ethereum</span>
              </div>
              <div className="flex items-center space-x-2">
                <img alt="Vercel logo" className="h-4 w-4 sm:h-6 sm:w-6" src="/vercel.svg" />
                <span className="text-xs sm:text-sm">Polygon</span>
              </div>
              <div className="flex items-center space-x-2">
                <img alt="IPFS logo" className="h-4 w-4 sm:h-6 sm:w-6 invert-dark" src="/file.svg" />
                <span className="text-xs sm:text-sm">IPFS</span>
              </div>
              <div className="flex items-center space-x-2">
                <img alt="OpenAI logo" className="h-4 w-4 sm:h-6 sm:w-6" src="/globe.svg" />
                <span className="text-xs sm:text-sm">OpenAI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
