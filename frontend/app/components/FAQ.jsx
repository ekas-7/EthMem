export default function FAQ() {
  return (
    <section className="bg-gradient-to-br from-[#0B1221] to-[#01050E] rounded-xl p-8 md:p-16 my-24 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked<br />Questions</h2>
          <p className="text-gray-400 mt-4">Have questions about decentralized memory? We've got answers.</p>
        </div>
        <div className="space-y-4">
          <details className="bg-surface-dark rounded-lg p-4 cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              Where is my data actually stored?
              <span className="material-icons">add</span>
            </summary>
            <p className="text-gray-400 mt-2">Your data is encrypted and stored on decentralized networks like IPFS. Only you, with your cryptographic keys, can access and decrypt your memory. zKMem as a service never has access to your raw data.</p>
          </details>
          <details className="bg-surface-dark rounded-lg p-4 cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              What is a blockchain identity?
              <span className="material-icons">add</span>
            </summary>
            <p className="text-gray-400 mt-2">Your blockchain identity is your public address (like an Ethereum wallet address). It acts as a universal, self-sovereign login and a root for your decentralized data, allowing you to control your information without relying on a central authority.</p>
          </details>
          <details className="bg-surface-dark rounded-lg p-4 cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              Can I use this with any LLM?
              <span className="material-icons">add</span>
            </summary>
            <p className="text-gray-400 mt-2">Yes! zKMem is designed to be model-agnostic. You can connect it to centralized models like those from OpenAI or to decentralized, open-source models running locally or on decentralized compute networks.</p>
          </details>
          <details className="bg-surface-dark rounded-lg p-4 cursor-pointer">
            <summary className="font-semibold flex justify-between items-center">
              What happens if I lose my wallet/keys?
              <span className="material-icons">add</span>
            </summary>
            <p className="text-gray-400 mt-2">As with all self-custodial systems, you are responsible for your keys. We are actively developing social recovery and other user-friendly key management solutions to mitigate this risk. Securely backing up your seed phrase is crucial.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
