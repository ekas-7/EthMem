"use client";
import { Video, Infinity, Youtube } from 'lucide-react';

export default function Connect() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        {/* Desktop floating elements - hidden on mobile */}
        <div className="hidden lg:block">
          {/* LLM Logos */}
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
            <span className="text-2xl font-bold text-gray-700">GPT</span>
          </div>

          <div className="absolute top-[20%] right-[15%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
            <span className="text-xl font-bold text-gray-700">Claude</span>
          </div>

          <div className="absolute top-[12%] left-[40%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
            <span className="text-xl font-bold text-gray-700">Gemini</span>
          </div>

          <div className="absolute top-[45%] left-[5%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
            <span className="text-xl font-bold text-gray-700">LLaMA</span>
          </div>

          {/* ETH Tech Logos */}
          <div className="absolute bottom-[20%] left-[12%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="text-2xl font-bold text-gray-700">ETH</span>
          </div>

          <div className="absolute top-[55%] right-[8%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2.5s' }}>
            <span className="text-xl font-bold text-gray-700">IPFS</span>
          </div>

          <div className="absolute bottom-[25%] left-[35%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
            <span className="text-xl font-bold text-gray-700">Web3</span>
          </div>

          <div className="absolute bottom-[18%] right-[25%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.8s' }}>
            <span className="text-xl font-bold text-gray-700">Solidity</span>
          </div>

          <div className="absolute bottom-[15%] right-[8%] w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2.2s' }}>
            <span className="text-xl font-bold text-gray-700">DeFi</span>
          </div>
        </div>

        {/* Tablet floating elements - visible on medium screens */}
        <div className="hidden md:block lg:hidden">
          <div className="absolute top-[10%] left-[5%] w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
            <span className="text-lg font-bold text-gray-700">GPT</span>
          </div>

          <div className="absolute top-[15%] right-[8%] w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
            <span className="text-sm font-bold text-gray-700">Claude</span>
          </div>

          <div className="absolute top-[50%] left-[3%] w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
            <span className="text-sm font-bold text-gray-700">LLaMA</span>
          </div>

          <div className="absolute bottom-[15%] left-[10%] w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="text-lg font-bold text-gray-700">ETH</span>
          </div>

          <div className="absolute top-[60%] right-[5%] w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
            <span className="text-sm font-bold text-gray-700">Web3</span>
          </div>

          <div className="absolute bottom-[20%] right-[15%] w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.8s' }}>
            <span className="text-sm font-bold text-gray-700">DeFi</span>
          </div>
        </div>

        {/* Mobile floating elements - visible on small screens only */}
        <div className="block md:hidden">
          <div className="absolute top-[8%] left-[5%] w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
            <span className="text-xs font-bold text-gray-700">GPT</span>
          </div>

          <div className="absolute top-[12%] right-[8%] w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
            <span className="text-xs font-bold text-gray-700">ETH</span>
          </div>

          <div className="absolute bottom-[15%] left-[8%] w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="text-xs font-bold text-gray-700">Web3</span>
          </div>

          <div className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.8s' }}>
            <span className="text-xs font-bold text-gray-700">LLM</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
          <span className="text-gray-900">Connects with</span>
          <br />
          <span className="text-gray-400">all of your LLMs</span>
        </h1>
      </div>
    </div>
  );
}