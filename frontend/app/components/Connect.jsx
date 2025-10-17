"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ConnectWallet from '../../components/ConnectWallet';
import { useWallet } from '../../hooks/useWallet';

export default function Connect() {
  const { isConnected, address, formattedAddress } = useWallet();
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        {/* Desktop floating elements - hidden on mobile */}
        <div className="hidden lg:block">
          {/* LLM Logos */}
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/chatgpt.png" alt="GPT" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[20%] right-[15%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/claude.jpeg" alt="Claude" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[12%] left-[40%] w-32 h-32 p-6 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '2s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/gemini.png" alt="Gemini" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[45%] left-[5%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/logo.png" alt="LLaMA" fill className="object-contain" />
            </div>
          </div>

          {/* ETH Tech Logos */}
          <div className="absolute bottom-[20%] left-[12%] w-32 h-32 bg-white  p-2 rounded-full shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/eth.svg" alt="ETH" fill className="" />
            </div>
          </div>

          <div className="absolute top-[55%] right-[8%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '2.5s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/ipfs.png" alt="IPFS" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[25%] left-[35%] w-32 h-32 pt-6 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/llama.png" alt="Web3" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[18%] right-[25%] w-32 h-32 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/solidity.png" alt="Solidity" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[15%] right-[8%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '2.2s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/ethglobal.jpg" alt="DeFi" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Tablet floating elements - visible on medium screens */}
        <div className="hidden md:block lg:hidden">
          <div className="absolute top-[10%] left-[5%] w-24 h-24 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/chatgpt.png" alt="GPT" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[15%] right-[8%] w-24 h-24 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/claude.jpeg" alt="Claude" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[50%] left-[3%] w-24 h-24 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/logo.png" alt="LLaMA" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[15%] left-[10%] w-24 h-24 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/eth.svg" alt="ETH" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[60%] right-[5%] w-24 h-24 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '2s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/globe.svg" alt="Web3" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[20%] right-[15%] w-24 h-24  bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/ethglobal.jpg" alt="DeFi" fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Mobile floating elements - visible on small screens only */}
        <div className="block md:hidden">
          <div className="absolute top-[8%] left-[5%] w-16 h-16 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image src="/chatgpt.png" alt="GPT" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute top-[12%] right-[8%] w-16 h-16 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image src="/eth.svg" alt="ETH" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[15%] left-[8%] w-16 h-16 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image src="/globe.svg" alt="Web3" fill className="object-contain" />
            </div>
          </div>

          <div className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-white rounded-full shadow-lg animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image src="/logo.png" alt="LLM" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
        {isConnected ? (
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="text-gray-900">Welcome to</span>
              <br />
              <span className="text-emerald-600">zKMem</span>
            </h1>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connected!</h2>
              <p className="text-gray-600 mb-4">Your blockchain identity is ready</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Connected Address:</p>
                <p className="font-mono text-sm text-gray-900">{formattedAddress}</p>
              </div>
              <button 
                onClick={handleGoToDashboard}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Access Your Memory Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="text-gray-900">Connects with</span>
              <br />
              <span className="text-gray-400">all of your LLMs</span>
            </h1>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">Connect your wallet to start using zKMem and access your unified LLM memory</p>
              <ConnectWallet className="w-full justify-center py-3" />
              <p className="text-xs text-gray-500 mt-4">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}