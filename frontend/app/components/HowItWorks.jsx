export default function HowItWorks() {
  return (
    <section className="text-center my-12 sm:my-16 lg:my-24 px-4">
      <div className="inline-block bg-emerald-100 text-emerald-700 text-xs md:text-sm font-semibold px-4 py-1 rounded-full mb-4">
        HOW IT WORKS
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 max-w-4xl mx-auto">
        Your Memory, Your Identity,
        <br />
        Your Control.
      </h2>

      <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-8 sm:mb-12">
  EthMem connects to your favorite LLMs and dApps, creating a unified, persistent memory layer that is cryptographically tied to your blockchain identity. All your data is stored decentrally, giving you full ownership and control.
      </p>

      <div className="max-w-3xl mx-auto">
        {/* Pale outer card */}
        <div className="bg-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 shadow-inner flex justify-center items-center">
          {/* Inner white card with subtle shadow */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl w-full max-w-lg text-center">
            <img
              alt="EthMem browser extension"
              src="/extension.png"
              className="block mx-auto w-48 sm:w-56 md:w-72 h-auto rounded-md mb-6"
            />
            <p className="text-sm text-gray-600 mb-6">Download our browser extension to get started — it enables EthMem to connect with your browser and persist memory securely.</p>
            <div className="flex justify-center">
              <a
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium text-gray-800 bg-gray-200 hover:bg-gray-300"
              >
                Download extension
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
