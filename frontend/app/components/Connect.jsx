"use client";
import { Video, Infinity, Youtube } from 'lucide-react';

export default function Connect() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center py-12 sm:py-16">
      <div className="absolute inset-0 pointer-events-none">
        {/* Responsive floating elements - hidden on small screens, scaled appropriately */}
        <div className="hidden sm:block absolute top-[15%] left-[8%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
          <span className="text-lg lg:text-3xl font-semibold text-gray-700">zoom</span>
        </div>

        <div className="hidden md:block absolute top-[20%] right-[15%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
          <Infinity className="w-8 h-8 lg:w-16 lg:h-16 text-gray-800" strokeWidth={2} />
        </div>

        <div className="hidden lg:block absolute top-[12%] left-[40%] w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
          <svg className="w-10 h-10 lg:w-16 lg:h-16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </div>

        <div className="hidden sm:block absolute top-[45%] left-[5%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
          <span className="text-2xl lg:text-5xl font-bold text-gray-700">N</span>
        </div>

        <div className="hidden md:block absolute bottom-[20%] left-[12%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
          <svg className="w-8 h-8 lg:w-16 lg:h-16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.25h5.75v5.75H0zm0 5.75h5.75v5.75H0zm0 5.75h5.75V20H0zm5.75-11.5h5.75v5.75H5.75zm0 5.75h5.75v5.75H5.75zm0 5.75h5.75V20H5.75zm5.75-11.5H17v5.75h-5.5zm0 5.75H17v5.75h-5.5zm0 5.75H17V20h-5.5z"/>
          </svg>
        </div>

        <div className="hidden lg:block absolute top-[55%] right-[8%] w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2.5s' }}>
          <Youtube className="w-10 h-10 lg:w-16 lg:h-16 text-gray-800" />
        </div>

        <div className="hidden md:block absolute bottom-[25%] left-[35%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
          <Video className="w-8 h-8 lg:w-14 lg:h-14 text-gray-800" />
        </div>

        <div className="hidden sm:block absolute bottom-[18%] right-[25%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.8s' }}>
          <span className="text-xl lg:text-4xl font-bold text-gray-700">V</span>
        </div>

        <div className="hidden md:block absolute bottom-[15%] right-[8%] w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '2.2s' }}>
          <span className="text-lg lg:text-4xl font-bold text-gray-700">VISA</span>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
          <span className="text-gray-900">Connects with</span>
          <br />
          <span className="text-gray-400">all of your LLMs</span>
        </h1>
      </div>
    </div>
  );
}
