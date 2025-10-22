"use client";
import Image from "next/image";

export default function Connect() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        {/* Desktop floating elements - hidden on mobile */}
        <div className="hidden lg:block">
          {/* LLM Logos */}
          <div
            className="absolute top-[15%] left-[8%] w-32 h-32 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/chatgpt.png"
                alt="GPT"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute top-[20%] right-[15%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/claude.jpeg"
                alt="Claude"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute top-[12%] left-[40%] w-32 h-32 p-6 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "2s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/gemini.png"
                alt="Gemini"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute top-[45%] left-[5%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full  flex items-center justify-center">
              <Image
                src="/asi.png"
                alt="LLaMA"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* ETH Tech Logos */}
          <div
            className="absolute bottom-[20%] left-[12%] w-32 h-32 bg-white p-2 rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image src="/eth.svg" alt="ETH" fill className="object-contain" />
            </div>
          </div>

          <div
            className="absolute top-[55%] right-[8%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "2.5s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/ipfs.png"
                alt="IPFS"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute bottom-[25%] left-[35%] w-32 h-32 pt-6 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/llama.png"
                alt="Web3"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute bottom-[18%] right-[25%] w-32 h-32 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/solidity.png"
                alt="Solidity"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute bottom-[15%] right-[8%] w-32 h-32 p-4 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "2.2s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-3 flex items-center justify-center">
              <Image
                src="/ethglobal.jpg"
                alt="DeFi"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Tablet floating elements - visible on medium screens */}
        <div className="hidden md:block lg:hidden">
          <div
            className="absolute top-[10%] left-[5%] w-24 h-24 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image
                src="/chatgpt.png"
                alt="GPT"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute top-[15%] right-[8%] w-24 h-24 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image
                src="/claude.jpeg"
                alt="Claude"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute top-[50%] left-[3%] w-24 h-24 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full  flex items-center justify-center">
              <Image
                src="/asi.png"
                alt="LLaMA"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute bottom-[15%] left-[10%] w-24 h-24 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image src="/eth.svg" alt="ETH" fill className="object-contain" />
            </div>
          </div>

          <div
            className="absolute top-[60%] right-[5%] w-24 h-24 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "2s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image
                src="/globe.svg"
                alt="Web3"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute bottom-[20%] right-[15%] w-24 h-24 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-2 flex items-center justify-center">
              <Image
                src="/ethglobal.jpg"
                alt="DeFi"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile floating elements - visible on small screens only */}
        <div className="block md:hidden">
          <div
            className="absolute top-[8%] left-[5%] w-16 h-16 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image
                src="/chatgpt.png"
                alt="GPT"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute top-[12%] right-[8%] w-16 h-16 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image src="/eth.svg" alt="ETH" fill className="object-contain" />
            </div>
          </div>

          <div
            className="absolute bottom-[15%] left-[8%] w-16 h-16 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image
                src="/globe.svg"
                alt="Web3"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            className="absolute bottom-[20%] right-[10%] w-16 h-16 bg-white rounded-full shadow-lg animate-float"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-full p-1 flex items-center justify-center">
              <Image src="/logo.png" alt="LLM" fill className="object-contain" />
            </div>
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