"use client";
export default function Header() {
  return (
    <header className="bg-gradient-to-br from-[#0B2F1B] to-[#07120B] rounded-b-xl p-8 text-white relative overflow-hidden">
      <nav className="flex items-center justify-between mb-16">
        <div className="flex items-center space-x-3">
          <span className="material-icons text-emerald-400 text-3xl">memory</span>
          <span className="text-xl font-bold">zKMem</span>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 top-6 hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a className="hover:text-white" href="#">Features</a>
          <a className="hover:text-white" href="#">Resources</a>
          <a className="hover:text-white" href="#">Support</a>
          <a className="hover:text-white" href="#">Pricing</a>
          <a className="hover:text-white" href="#">Contact</a>
        </div>

        <div className="ml-auto">
          <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-2 px-5 rounded-full">
            Connect Wallet
          </button>
        </div>
      </nav>

      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          Unified LLM Memory —<br /> <span className="text-emerald-400">Your Blockchain Identity.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
          Merge your digital mind with your decentralized self. Experience a new layer of digital continuity — where your LLM memory becomes your blockchain identity. Every interaction, learning, and insight is cryptographically secured, portable across apps, and owned entirely by you. No central servers. No forgotten context. Just one evolving, intelligent identity — powered by you.
        </p>
        <div className="flex justify-center">
          <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold py-3 px-6 rounded-full flex items-center">
            Claim Your Decentralized Memory <span className="material-icons ml-2">east</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-8 mt-16 text-gray-400">
        <p className="text-sm font-medium">Integration Partners:</p>
        <div className="flex items-center space-x-2">
          <img alt="Ethereum logo" className="h-6 w-6" src="/next.svg" />
          <span>Ethereum</span>
        </div>
        <div className="flex items-center space-x-2">
          <img alt="Polygon logo" className="h-6 w-6" src="/vercel.svg" />
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
    </header>
  );
}
